import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { readFileSync } from "node:fs";
import vm from "node:vm";

export const configKey = "liao-sidebar-organizer.config";
export function readAsar(path, file) {
  const bytes = readFileSync(path),
    header = JSON.parse(bytes.subarray(16, 16 + bytes.readUInt32LE(12)));
  let entry = header;
  for (const key of file.split("/")) entry = entry.files[key];
  const offset = 8 + bytes.readUInt32LE(4) + Number(entry.offset);
  return bytes.subarray(offset, offset + entry.size).toString();
}
export const entries = [
  {
    options: { id: "plugins", order: 0, label: "插件" },
    registrant: "@deepseek-ai/dsh-client-ui-plugin-manager",
  },
  {
    options: { id: "skills", order: 10, label: "技能中心" },
    registrant: "@deepseek-ai/dsh-client-ui-skill-explorer",
  },
  {
    options: { id: "context", order: 20, label: "上下文洞察" },
    registrant: "@deepseek-ai/dsh-context",
  },
  {
    options: { id: "schedule", order: 30, label: "自动化任务" },
    registrant: "@deepseek-ai/dsh-client-ui-automation",
  },
  {
    options: { id: "ssh", order: 40, label: "SSH" },
    registrant: "@deepseek-ai/dsh-ssh",
  },
];

export async function fixture({
  config,
  legacyConfig,
  source,
  loaderSource,
  slotEntries = entries,
} = {}) {
  const liveEntries = slotEntries.slice();
  const nav = `<nav aria-label="全局面板">${liveEntries.map((entry) => `<button aria-label="${entry.options.label}"><svg><path d="M0 0"></path></svg><span>${entry.options.label}</span></button>`).join("")}</nav>`;
  const dom = new JSDOM(
    `<html lang="zh"><head></head><body>${nav}<main id="settings"></main></body></html>`,
    { url: "http://localhost", pretendToBeVisual: true },
  );
  const { window } = dom,
    { document } = window,
    prior = {};
  for (const key of ["window", "document", "IS_REACT_ACT_ENVIRONMENT"]) {
    prior[key] = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: key === "window" ? window : key === "document" ? document : true,
    });
  }
  if (config !== undefined)
    window.localStorage.setItem(configKey, JSON.stringify(config));
  if (legacyConfig !== undefined)
    window.localStorage.setItem(
      "liao-plugin-shelf.config",
      JSON.stringify(legacyConfig),
    );
  const frames = new Map();
  let frameId = 0;
  window.requestAnimationFrame = (fn) => {
    frames.set(++frameId, fn);
    return frameId;
  };
  window.cancelAnimationFrame = (id) => frames.delete(id);
  let entry, modules;
  window.__ModuleLoader__ = {
    load: (value) => {
      entry = value;
    },
  };
  const sandbox = vm.createContext({ window, document, console });
  if (loaderSource) {
    vm.runInContext(loaderSource, sandbox);
    const bootstrap = {
      id: "@deepseek-ai/dsh-client-modules",
      exports: entry.factory(() => {
        throw Error("Unexpected loader dependency");
      }),
    };
    const target = {
      mode: "queue",
      pendingQueue: [],
      load: (value) => target.pendingQueue.push(value),
    };
    window.__ModuleLoader__ = target;
    modules = new bootstrap.exports.ClientModuleSystem({
      manifest: { modules: [] },
      staticModules: { react: React },
      registrationTarget: target,
      bootstrapModule: bootstrap,
    });
  }
  vm.runInContext(
    source ||
      readFileSync(new URL("../lib/client.js", import.meta.url), "utf8"),
    sandbox,
  );
  const plugin = modules
    ? await modules.import("dsh-liao-sidebar")
    : entry.factory((name) => {
        if (name !== "react") throw Error(name);
        return React;
      });
  const slots = new Map(),
    disposers = [];
  let root;
  const ctx = {
    effect(fn) {
      const dispose = fn();
      if (typeof dispose === "function") disposers.push(dispose);
    },
    locale: {
      getSnapshot: () => ({ active: document.documentElement.lang }),
      register: () => () => {},
    },
    slots: {
      entriesOfSlot: (name) =>
        name === "sidebar.panellist" ? liveEntries : [],
      subscribe: () => () => {},
      inject(_slot, fn) {
        return fn();
      },
      register(options, Component) {
        const key = `${options.name}:${options.key}`;
        slots.set(key, Component);
        return () => slots.delete(key);
      },
    },
  };
  await act(async () => plugin.apply(ctx));
  async function flush() {
    for (let i = 0; i < 20; i++) {
      const pending = [...frames.values()];
      frames.clear();
      if (!pending.length) return;
      await act(async () => {
        pending.forEach((fn) => fn());
        await Promise.resolve();
      });
    }
    throw Error("Mutation observer did not settle");
  }
  await flush();
  return {
    dom,
    window,
    document,
    slots,
    async click(selector) {
      const node = document.querySelector(selector);
      if (!node) throw Error(`Missing ${selector}`);
      await act(async () => node.click());
      await flush();
    },
    async setEntries(next) {
      liveEntries.splice(0, liveEntries.length, ...next);
      const probe = document.querySelector("nav button[aria-label]");
      await act(async () => {
        probe?.classList.toggle("lso-probe");
        await Promise.resolve();
      });
      await flush();
    },
    async settings() {
      root = createRoot(document.querySelector("#settings"));
      await act(async () =>
        root.render(
          React.createElement(
            slots.get("plugins.bundle.config:dsh-liao-sidebar"),
          ),
        ),
      );
    },
    async dispose() {
      await act(async () => {
        if (root) root.unmount();
        disposers.reverse().forEach((fn) => fn());
      });
      await flush();
    },
    async close() {
      await this.dispose();
      dom.window.close();
      for (const key of Object.keys(prior))
        if (prior[key]) Object.defineProperty(globalThis, key, prior[key]);
        else delete globalThis[key];
    },
  };
}
