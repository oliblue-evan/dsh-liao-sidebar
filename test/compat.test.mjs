import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";
import { fixture, configKey } from "./harness.mjs";

const source = readFileSync(
  new URL("../lib/client.js", import.meta.url),
  "utf8",
);

test("settings expose a master auto-optimize switch and one switch per entry", async () => {
  const f = await fixture();
  try {
    await f.settings();
    const master = f.document.querySelector('[aria-label="自动优化"]');
    const skills = f.document.querySelector('[aria-label="优化 技能中心"]');
    assert.ok(master, "the master switch is rendered");
    assert.equal(master.getAttribute("aria-checked"), "true");
    assert.ok(skills, "each sidebar entry gets its own optimize switch");
    assert.equal(skills.getAttribute("aria-checked"), "true");

    await f.click('[aria-label="优化 技能中心"]');
    let stored = JSON.parse(f.window.localStorage.getItem(configKey));
    assert.equal(stored.optimizePages.skills, false);
    assert.equal(
      f.document
        .querySelector('[aria-label="优化 技能中心"]')
        .getAttribute("aria-checked"),
      "false",
    );

    await f.click('[aria-label="优化 技能中心"]');
    stored = JSON.parse(f.window.localStorage.getItem(configKey));
    assert.equal(stored.optimizePages.skills, undefined);
    assert.equal(
      f.document
        .querySelector('[aria-label="优化 技能中心"]')
        .getAttribute("aria-checked"),
      "true",
    );

    await f.click('[aria-label="自动优化"]');
    stored = JSON.parse(f.window.localStorage.getItem(configKey));
    assert.equal(stored.optimize, false);
    assert.equal(
      f.document.querySelector('[aria-label="优化 技能中心"]').disabled,
      true,
      "per-entry switches wait for the master switch",
    );
  } finally {
    await f.close();
  }
});

test("collapsed pages are detected and fixed, then honor their switches", async (t) => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: "chrome" });
  } catch (error) {
    t.skip(`Chrome is unavailable for the compatibility test: ${error.message}`);
    return;
  }

  const server = createServer((_request, response) => {
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(`<!doctype html>
      <html lang="zh" data-platform="darwin" style="--dsh-frame-top-clearance:48px">
      <head><meta charset="utf-8"><style>
        html,body{margin:0;height:100%;background:#111;color:#eee}
        #frame{display:grid;grid-template-columns:0 minmax(0,1fr);height:100vh}
        #side{overflow:hidden}
        nav{display:flex;flex-direction:column;width:280px}
        nav button{height:36px}
        #center{display:flex;flex-direction:column;min-width:0;height:100vh;overflow:hidden}
        #page{height:100%;padding:14px 16px 16px;background:#191919}
        h1{margin:0;font-size:20px}
      </style></head>
      <body>
        <div id="frame" data-test-frame data-sidebar-collapsed>
          <div id="side"><nav aria-label="全局面板">
            <button aria-label="技能中心" aria-current="page">技能中心</button>
            <button aria-label="SSH">SSH</button>
          </nav></div>
          <div id="center"><div id="page"><h1>技能中心</h1></div></div>
        </div>
      </body></html>`);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const page = await browser.newPage({
      viewport: { width: 1000, height: 760 },
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.evaluate((key) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          order: ["skills", "ssh"],
          more: [],
          shortcuts: {},
          links: [],
        }),
      );
      window.__ModuleLoader__ = {
        load(entry) {
          window.__lsoEntry = entry;
        },
      };
    }, configKey);
    await page.addScriptTag({ content: source });
    await page.evaluate(async () => {
      const disposers = [];
      const entries = [
        ["skills", "技能中心", 10],
        ["ssh", "SSH", 20],
      ].map(([id, label, order]) => ({
        options: { id, label, order },
        registrant: "compat-test",
      }));
      const plugin = window.__lsoEntry.factory((name) => {
        if (name === "react") return {};
        throw new Error(name);
      });
      plugin.apply({
        effect(fn) {
          const dispose = fn();
          if (typeof dispose === "function") disposers.push(dispose);
        },
        locale: {
          getSnapshot: () => ({ active: "zh" }),
          register: () => () => {},
        },
        slots: {
          entriesOfSlot: (name) =>
            name === "sidebar.panellist" ? entries : [],
          subscribe: () => () => {},
          inject: (_name, fn) => fn(),
          register: () => () => {},
        },
      });
      window.__lsoDispose = () =>
        disposers.reverse().forEach((dispose) => dispose());
    });

    await page.waitForSelector("#center[data-lso-page-fix]");
    let state = await page.evaluate(() => {
      const center = document.querySelector("#center");
      return {
        paddingTop: getComputedStyle(center).paddingTop,
        base: center.style.getPropertyValue("--lso-page-fix-base"),
        titleTop: document.querySelector("#page h1").getBoundingClientRect().top,
      };
    });
    assert.equal(state.base, "0px");
    assert.equal(state.paddingTop, "48px");
    assert.ok(
      state.titleTop >= 48,
      "the title moves below the macOS window safe area",
    );

    await page.evaluate(() =>
      document.querySelector("#frame").removeAttribute("data-sidebar-collapsed"),
    );
    await page.waitForFunction(
      () => !document.querySelector("#center").hasAttribute("data-lso-page-fix"),
    );
    assert.equal(
      await page.evaluate(
        () => getComputedStyle(document.querySelector("#center")).paddingTop,
      ),
      "0px",
      "expanding the sidebar removes the temporary fix",
    );

    await page.evaluate(() =>
      document.querySelector("#frame").setAttribute("data-sidebar-collapsed", ""),
    );
    await page.waitForSelector("#center[data-lso-page-fix]");

    await page.evaluate((key) => {
      const config = JSON.parse(localStorage.getItem(key));
      config.optimizePages = { skills: false };
      localStorage.setItem(key, JSON.stringify(config));
      window.dispatchEvent(new StorageEvent("storage", { key }));
    }, configKey);
    await page.waitForFunction(
      () => !document.querySelector("#center").hasAttribute("data-lso-page-fix"),
    );

    await page.evaluate((key) => {
      const config = JSON.parse(localStorage.getItem(key));
      config.optimizePages = {};
      localStorage.setItem(key, JSON.stringify(config));
      window.dispatchEvent(new StorageEvent("storage", { key }));
    }, configKey);
    await page.waitForSelector("#center[data-lso-page-fix]");

    await page.evaluate((key) => {
      const config = JSON.parse(localStorage.getItem(key));
      config.optimize = false;
      localStorage.setItem(key, JSON.stringify(config));
      window.dispatchEvent(new StorageEvent("storage", { key }));
    }, configKey);
    await page.waitForFunction(
      () => !document.querySelector("#center").hasAttribute("data-lso-page-fix"),
    );

    await page.evaluate((key) => {
      const config = JSON.parse(localStorage.getItem(key));
      config.optimize = true;
      localStorage.setItem(key, JSON.stringify(config));
      window.dispatchEvent(new StorageEvent("storage", { key }));
    }, configKey);
    await page.waitForSelector("#center[data-lso-page-fix]");

    await page.evaluate(() => window.__lsoDispose());
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await browser.close();
  }
});
