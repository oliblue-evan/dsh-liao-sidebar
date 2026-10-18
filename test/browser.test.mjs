import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";
import { fixture } from "./harness.mjs";

const source = readFileSync(
  new URL("../lib/client.js", import.meta.url),
  "utf8",
);

test("real Chromium keeps More visible and renders one anchored drag line", async (t) => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: "chrome" });
  } catch (error) {
    t.skip(
      `Chrome is unavailable for the browser smoke test: ${error.message}`,
    );
    return;
  }

  const server = createServer((_request, response) => {
    response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    response.end(`<!doctype html>
      <html lang="zh"><head><meta charset="utf-8"><style>
        html,body{margin:0;min-height:100%;background:#171719;color:#f9fafb;font:14px -apple-system,sans-serif}
        nav{display:flex;flex-direction:column;gap:4px;width:280px;padding:12px;box-sizing:border-box;background:#2c2c2e}
        nav button{display:flex;align-items:center;gap:8px;min-height:36px;margin:0 2px;padding:7px 8px;border:0;border-radius:12px;background:transparent;color:inherit;font:inherit;text-align:left}
      </style></head><body>
        <nav aria-label="全局面板">
          ${[
            ["插件", "plugins"],
            ["技能中心", "skills"],
            ["上下文洞察", "context"],
            ["自动化任务", "schedule"],
            ["SSH", "ssh"],
          ]
            .map(
              ([label]) =>
                `<button aria-label="${label}"><span aria-hidden="true">◆</span><span>${label}</span></button>`,
            )
            .join("")}
        </nav>
      </body></html>`);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const page = await browser.newPage({
      viewport: { width: 1000, height: 760 },
    });
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.evaluate(() => {
      localStorage.setItem(
        "liao-sidebar-organizer.config",
        JSON.stringify({
          more: ["skills", "context", "schedule", "ssh"],
          order: [],
          shortcuts: {},
          links: [],
        }),
      );
      window.__ModuleLoader__ = {
        load(entry) {
          window.__lsoEntry = entry;
        },
      };
    });
    await page.addScriptTag({ content: source });
    await page.evaluate(async () => {
      const disposers = [];
      const entries = [
        ["plugins", "插件", 0],
        ["skills", "技能中心", 10],
        ["context", "上下文洞察", 20],
        ["schedule", "自动化任务", 30],
        ["ssh", "SSH", 40],
      ].map(([id, label, order]) => ({
        options: { id, label, order },
        registrant: "browser-smoke",
      }));
      const plugin = window.__lsoEntry.factory((name) => {
        if (name === "react") return {};
        throw new Error(name);
      });
      const ctx = {
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
      };
      plugin.apply(ctx);
      window.__lsoDispose = () =>
        disposers.reverse().forEach((dispose) => dispose());
    });
    await page.waitForSelector("[data-lso-trigger]", { state: "visible" });

    const trigger = page.locator("[data-lso-trigger]");
    await trigger.hover();
    const row = page.locator('.lso-popover [data-lso-entry="skills"]');
    await row.waitFor({ state: "visible" });
    if (process.env.LSO_POPOVER_SCREENSHOT)
      await page.screenshot({
        path: process.env.LSO_POPOVER_SCREENSHOT,
        fullPage: true,
      });
    const plugin = page.locator('nav button[aria-label="插件"]');
    const rowBox = await row.boundingBox();
    const pluginBox = await plugin.boundingBox();
    assert.ok(rowBox && pluginBox);

    await page.mouse.move(
      rowBox.x + rowBox.width / 2,
      rowBox.y + rowBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(rowBox.x + rowBox.width / 2 + 12, rowBox.y + 8, {
      steps: 2,
    });
    const whileInside = await page.evaluate(() => {
      const row = document.querySelector(
        '.lso-popover [data-lso-entry="skills"]',
      );
      return {
        exists: !!row,
        dragging: row && row.getAttribute("data-lso-dragging"),
        dimmed: row && getComputedStyle(row).opacity,
      };
    });
    assert.equal(whileInside.exists, true);
    assert.equal(whileInside.dragging, "true");
    assert.equal(whileInside.dimmed, "0.35");

    await page.mouse.move(
      pluginBox.x + pluginBox.width / 2,
      pluginBox.y + pluginBox.height / 2,
      { steps: 3 },
    );

    const duringDrag = await page.evaluate(() => {
      const marker = document.querySelector(".lso-insertion-marker");
      return {
        markers: document.querySelectorAll(".lso-insertion-marker").length,
        markerTop: marker && marker.getBoundingClientRect().top,
        anchorBottom: document
          .querySelector('nav button[aria-label="插件"]')
          .getBoundingClientRect().bottom,
        after: document
          .querySelector('nav button[aria-label="插件"]')
          .getAttribute("data-lso-after"),
      };
    });
    assert.equal(duringDrag.markers, 1);
    assert.equal(duringDrag.after, "true");
    assert.ok(duringDrag.markerTop > duringDrag.anchorBottom - 3);

    await page.mouse.up();
    await page
      .locator('nav button[aria-label="技能中心"]')
      .waitFor({ state: "visible" });
    assert.equal(
      await trigger.isVisible(),
      true,
      "More remains visible after pulling an entry out",
    );
    await page.evaluate(() => window.__lsoDispose());
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }
});

test("real Chromium renders the card-based settings layout and reflows on narrow widths", async (t) => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true, channel: "chrome" });
  } catch (error) {
    t.skip(
      `Chrome is unavailable for the settings layout test: ${error.message}`,
    );
    return;
  }

  try {
    const settingsFixture = await fixture({
      config: {
        more: ["skills"],
        shortcuts: { skills: "Ctrl+K" },
        links: [
          {
            id: "link-docs",
            label: "项目文档",
            url: "https://example.com/docs",
          },
        ],
      },
    });
    await settingsFixture.settings();
    const settingsMarkup =
      settingsFixture.document.querySelector(".lso-settings").outerHTML;
    const settingsCss = settingsFixture.document.querySelector(
      "[data-lso-style]",
    ).textContent;
    await settingsFixture.close();

    const page = await browser.newPage({
      viewport: { width: 900, height: 1000 },
    });
    await page.setContent(`<!doctype html>
      <html lang="zh"><head><meta charset="utf-8"><style>
        :root{--dsw-alias-label-primary:#f5f5f7;--dsw-alias-label-secondary:#c7c7cc;--dsw-alias-label-tertiary:#8e8e93;--dsw-alias-bg-layer-1:#252528;--dsw-alias-bg-layer-2:#303034;--dsw-alias-border-l2:#ffffff1f;--dsw-alias-interactive-bg-hover:#ffffff12;--dsw-alias-state-business-primary:#8099ff;--dsw-alias-state-error-primary:#ef8585}
        html,body{margin:0;background:#151517;color:#f5f5f7;font:14px/1.5 -apple-system,sans-serif}body{padding:24px}#settings{max-width:800px;margin:0 auto}
      </style><style>${settingsCss}</style></head><body><main id="settings">${settingsMarkup}</main></body></html>`);

    await page.waitForSelector(".lso-entry-row");
    assert.equal(
      await page.locator(".lso-settings-section").count(),
      4,
      "peek, display compatibility, entries and links are grouped into card sections",
    );
    const layout = await page.evaluate(() => {
      const settings = document.querySelector(".lso-settings");
      const section = document.querySelector(".lso-settings-section");
      const row = document.querySelector(".lso-entry-row");
      const form = document.querySelector(".lso-link-form");
      return {
        sectionBackground: getComputedStyle(section).backgroundColor,
        sectionRadius: getComputedStyle(section).borderRadius,
        rowColumns: getComputedStyle(row).gridTemplateColumns.split(" ").length,
        formColumns: getComputedStyle(form).gridTemplateColumns.split(" ")
          .length,
        settingsWidth: settings.getBoundingClientRect().width,
        packageShown:
          document.querySelector(".lso-entry-main small")?.textContent || "",
      };
    });
    assert.notEqual(layout.sectionBackground, "rgba(0, 0, 0, 0)");
    assert.equal(layout.sectionRadius, "12px");
    assert.equal(layout.rowColumns, 3);
    assert.equal(layout.formColumns, 3);
    assert.ok(layout.settingsWidth <= 800);
    assert.match(layout.packageShown, /dsh-client-ui-skill-explorer/);
    const inlineRow = await page.evaluate(() => {
      const row = document.querySelector(".lso-entry-row");
      const shortcut = row.querySelector(".lso-capture").getBoundingClientRect();
      const actions = row
        .querySelector(".lso-entry-actions")
        .getBoundingClientRect();
      return {
        rowHeight: row.getBoundingClientRect().height,
        verticalDelta: Math.abs(
          shortcut.top +
            shortcut.height / 2 -
            (actions.top + actions.height / 2),
        ),
      };
    });
    assert.ok(
      inlineRow.verticalDelta < 4,
      "the shortcut and actions share the entry's main row",
    );
    assert.ok(
      inlineRow.rowHeight < 80,
      "the inline shortcut control keeps entry rows compact",
    );

    await page.locator("details summary").click();
    assert.equal(await page.locator("details").getAttribute("open"), "");
    if (process.env.LSO_SCREENSHOT)
      await page.screenshot({
        path: process.env.LSO_SCREENSHOT,
        fullPage: true,
      });

    await page.setViewportSize({ width: 360, height: 900 });
    await page.waitForTimeout(80);
    const narrow = await page.evaluate(() => ({
      rowColumns: getComputedStyle(
        document.querySelector(".lso-entry-row"),
      ).gridTemplateColumns.split(" ").length,
      formColumns: getComputedStyle(
        document.querySelector(".lso-link-form"),
      ).gridTemplateColumns.split(" ").length,
      overflow: document.documentElement.scrollWidth - innerWidth,
    }));
    assert.equal(narrow.rowColumns, 1);
    assert.equal(narrow.formColumns, 1);
    assert.ok(narrow.overflow <= 0, "settings do not overflow a 360px viewport");
  } finally {
    await browser.close();
  }
});
