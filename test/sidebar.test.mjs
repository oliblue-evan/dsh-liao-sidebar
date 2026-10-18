import test from "node:test";
import assert from "node:assert/strict";
import { act } from "react";
import { fixture, entries, configKey } from "./harness.mjs";

async function using(options, fn) {
  const f = await fixture(options);
  try {
    await fn(f);
  } finally {
    await f.close();
  }
}

test("More expands in place, restores entry names, and never floats while the sidebar is open", async () =>
  using(
    {
      config: { more: ["skills", "context"] },
      hideMoreLabels: true,
    },
    async (f) => {
      const plugin = f.document.querySelector('nav button[aria-label="插件"]');
      assert.equal(
        plugin.hasAttribute("data-lso-entry"),
        false,
        "Plugins remains outside More",
      );
      const hidden = f.document.querySelector(
        'nav button[aria-label="技能中心"]',
      );
      assert.equal(hidden.style.display, "none");
      const trigger = f.document.querySelector("[data-lso-trigger]");
      await f.click("[data-lso-trigger]");
      const menu = f.document.querySelector(".lso-menu");
      assert.equal(menu.hidden, false);
      assert.equal(menu.querySelectorAll("[data-lso-entry]").length, 2);
      const skills = menu.querySelector('[data-lso-entry="skills"]');
      assert.match(skills.outerHTML, /lso-item/);
      assert.equal(
        skills.querySelector(".lso-item-label").textContent,
        "技能中心",
        "the cloned row supplies its own name when the host hides entry text",
      );
      assert.equal(
        skills.textContent.trim(),
        "技能中心",
        "the cloned row never duplicates its name",
      );
      f.document
        .querySelector('nav button[aria-label="上下文洞察"]')
        .setAttribute("aria-current", "page");
      await f.flush();
      assert.equal(
        f.document.querySelector('nav > [data-lso-selection="context"]'),
        null,
        "an open inline More never duplicates the newly selected entry",
      );
      await f.click("[data-lso-trigger]");
      assert.ok(
        f.document.querySelector('nav > [data-lso-selection="context"]'),
        "the selected hidden entry is promoted after closing More",
      );
      trigger.dispatchEvent(new f.window.MouseEvent("mouseenter"));
      assert.equal(
        f.document.querySelector(".lso-popover"),
        null,
        "an expanded sidebar uses its inline More rows instead of a floating menu",
      );
    },
  ));

test("the collapsed hover menu keeps readable labels, selected state, and the native row width", async () =>
  using(
    {
      collapsed: true,
      config: { more: ["skills", "context"] },
      hideMoreLabels: true,
    },
    async (f) => {
      f.document
        .querySelector('nav button[aria-label="上下文洞察"]')
        .setAttribute("aria-current", "page");
      await f.flush();
      f.document.querySelector("nav").style.background = "rgb(46, 46, 46)";
      const trigger = f.document.querySelector("[data-lso-trigger]");
      trigger.dispatchEvent(new f.window.MouseEvent("mouseenter"));
      const popover = f.document.querySelector(".lso-popover");
      assert.equal(popover.hidden, false);
      assert.equal(popover.children.length, 3);
      assert.equal(
        popover.style.getPropertyValue("--lso-popover-bg"),
        "rgb(46, 46, 46)",
        "the popup samples the covering sidebar surface",
      );
      assert.equal(
        popover
          .querySelector('[data-lso-entry="context"]')
          .getAttribute("data-lso-selected"),
        "true",
      );
      const popupRow = popover.querySelector('[data-lso-entry="skills"]');
      assert.equal(
        popupRow.querySelector(".lso-item-label").textContent,
        "技能中心",
      );
      assert.equal(
        popupRow.style.paddingLeft,
        "12px",
        "the popup gives the label room even when the rail row has no padding",
      );
      assert.equal(
        popupRow.style.margin,
        "0px 2px",
        "the popup keeps the native row inline margins",
      );
      const dragHint = popover.querySelector(".lso-popover-hint");
      assert.equal(dragHint.textContent, "拖拽入口或链接可自定义排序");
      assert.equal(dragHint.getAttribute("role"), "note");
      assert.equal(dragHint, popover.lastElementChild);
      assert.equal(dragHint.style.order, "999999");
      assert.equal(f.window.getComputedStyle(dragHint).pointerEvents, "none");
      const pluginCss = f.document.querySelector("[data-lso-style]").textContent;
      assert.match(
        pluginCss,
        /\.lso-popover\{[^}]*padding:8px 12px 4px;[^}]*background:var\(--lso-popover-bg,var\(--dsw-alias-bg-layer-2/,
        "the popup has a roomier top inset and uses the sampled sidebar surface",
      );
      assert.match(
        pluginCss,
        /\.lso-popover::before\{content:none\}/,
        "no extra menu tint is layered over the sidebar surface",
      );
      assert.match(
        pluginCss,
        /\.lso-popover-hint\{[^}]*gap:6px;margin:3px 2px 0;padding:6px 8px[^}]*font-size:11px/,
        "the footer hint shares the sidebar row insets",
      );
      assert.equal(
        popover.style.width,
        "260px",
        "when host layout is unavailable the popover uses its native sidebar width fallback",
      );
      await f.click('.lso-popover [data-lso-entry="skills"]');
      assert.equal(
        f.document.querySelector(".lso-popover"),
        null,
        "choosing an entry closes the floating menu",
      );
    },
  ));

test("a transient empty slot snapshot does not erase saved order or More preferences", async () =>
  using(
    {
      config: {
        order: ["skills", "context", "schedule", "ssh"],
        more: ["skills", "context"],
        shortcuts: { skills: "Ctrl+K" },
        links: [{ id: "link-docs", label: "文档", url: "https://example.com" }],
      },
    },
    async (f) => {
      const before = f.window.localStorage.getItem(configKey);
      await f.setEntries([]);
      assert.equal(
        f.window.localStorage.getItem(configKey),
        before,
        "an empty startup snapshot leaves preferences untouched",
      );
      await f.setEntries(entries);
      const restored = JSON.parse(f.window.localStorage.getItem(configKey));
      assert.deepEqual(restored.more.slice(0, 2), ["skills", "context"]);
      assert.equal(restored.shortcuts.skills, "Ctrl+K");
      assert.equal(restored.links[0].id, "link-docs");
    },
  ));

test("the promoted hidden panel persists until another entry is selected or More expands", async () =>
  using({ config: { more: ["skills"] } }, async (f) => {
    const trigger = f.document.querySelector("[data-lso-trigger]");
    const hidden = f.document.querySelector(
      'nav button[aria-label="技能中心"]',
    );
    Array.from(hidden.children)
      .find((node) => node.textContent.trim() === "技能中心")
      ?.remove();
    const promoted = () =>
      f.document.querySelector('nav > [data-lso-selection="skills"]');
    let clicked = 0;
    hidden.addEventListener("click", () => clicked++);
    hidden.setAttribute("aria-current", "page");
    await act(async () => {
      hidden.classList.toggle("active-probe");
      await Promise.resolve();
    });
    assert.ok(
      promoted(),
      "the selected hidden panel stays visible while More is collapsed",
    );
    assert.equal(trigger.getAttribute("data-lso-active"), "false");
    assert.equal(trigger.hasAttribute("aria-current"), false);
    assert.equal(trigger.getAttribute("aria-haspopup"), "true");
    assert.equal(
      trigger.getAttribute("aria-controls"),
      "liao-sidebar-organizer-menu",
    );

    await f.click("[data-lso-trigger]");
    assert.equal(f.document.querySelector(".lso-menu").hidden, false);
    const pluginCss = f.document.querySelector("[data-lso-style]").textContent;
    assert.match(
      pluginCss,
      /\.lso-more\[aria-expanded=true\]>\[data-lso-label\]\{color:var\(--dsw-alias-label-tertiary,#8e8e93\)!important\}/,
      "the expanded More label is deliberately muted",
    );
    assert.ok(
      f.document.querySelector('.lso-menu [data-lso-entry="skills"]'),
      "the expanded menu already shows the selected entry",
    );
    assert.equal(
      promoted(),
      null,
      "the expanded menu does not add a duplicate sidebar row",
    );
    await f.click("[data-lso-trigger]");
    assert.ok(
      promoted(),
      "the promoted row returns after collapsing the in-place menu",
    );

    trigger.dispatchEvent(new f.window.MouseEvent("mouseenter"));
    const proxy = promoted();
    assert.ok(
      proxy,
      "the promoted row remains while the pointer is over More",
    );
    assert.equal(proxy.textContent.trim(), "技能中心");
    assert.ok(
      proxy.querySelector("[data-lso-current-label]"),
      "the promoted row supplies its own name",
    );
    assert.equal(proxy.getAttribute("aria-current"), "page");
    assert.equal(proxy.hasAttribute("data-lso-entry"), false);
    assert.equal(proxy.nextElementSibling, trigger);
    assert.equal(trigger.getAttribute("data-lso-active"), "false");
    assert.equal(trigger.hasAttribute("aria-current"), false);
    assert.equal(
      f.document.querySelector(".lso-popover"),
      null,
      "an expanded sidebar never opens the floating More menu",
    );
    await f.click('nav > [data-lso-selection="skills"]');
    assert.equal(clicked, 1, "the promoted row opens the native panel");
    assert.equal(f.document.querySelector(".lso-popover"), null);
    assert.ok(promoted(), "clicking the promoted row does not remove it");
    assert.equal(trigger.getAttribute("aria-expanded"), "false");

    const visible = f.document.querySelector(
      'nav button[aria-label="上下文洞察"]',
    );
    visible.setAttribute("aria-current", "page");
    hidden.removeAttribute("aria-current");
    await act(async () => {
      visible.classList.toggle("visible-active-probe");
      await Promise.resolve();
    });
    assert.equal(
      promoted(),
      null,
      "the promoted row disappears after selecting another sidebar entry",
    );
  }));

test("alternate host selection markers refresh the promoted row", async () =>
  using({ config: { more: ["skills"] } }, async (f) => {
    const hidden = f.document.querySelector(
      'nav button[aria-label="技能中心"]',
    );
    const promoted = () =>
      f.document.querySelector('nav > [data-lso-selection="skills"]');

    await act(async () => {
      hidden.setAttribute("data-state", "active");
      await Promise.resolve();
    });
    assert.ok(promoted(), "data-state=active is observed");

    hidden.removeAttribute("data-state");
    await act(async () => {
      hidden.setAttribute("aria-selected", "true");
      await Promise.resolve();
    });
    assert.ok(promoted(), "aria-selected=true is observed");

    hidden.removeAttribute("aria-selected");
    await act(async () => {
      hidden.classList.toggle("inactive-probe");
      await Promise.resolve();
    });
    assert.equal(promoted(), null);
  }));

test("a promoted rail row keeps its icon width and the floating menu widens enough to read names", async () =>
  using(
    {
      collapsed: true,
      config: { more: ["skills"] },
      hideMoreLabels: true,
    },
    async (f) => {
      const nav = f.document.querySelector("nav");
      const hidden = f.document.querySelector(
        'nav button[aria-label="技能中心"]',
      );
      const rect = (width) => ({
        left: 10,
        top: 100,
        right: 10 + width,
        bottom: 136,
        width,
        height: 36,
        x: 10,
        y: 100,
        toJSON() {},
      });
      nav.getBoundingClientRect = () => rect(0);
      hidden.getBoundingClientRect = () => rect(36);
      hidden.setAttribute("aria-current", "page");
      await f.flush();
      const proxy = f.document.querySelector(
        'nav > [data-lso-selection="skills"]',
      );
      assert.ok(proxy);
      assert.equal(
        proxy.style.getPropertyValue("width"),
        "36px",
        "the promoted row keeps the source icon button width instead of collapsing to zero",
      );
      assert.equal(proxy.style.getPropertyValue("min-width"), "36px");
      assert.equal(proxy.style.getPropertyValue("max-width"), "36px");
      const label = proxy.querySelector("[data-lso-current-label]");
      assert.equal(label.textContent, "技能中心");
      assert.equal(
        label.hasAttribute("hidden"),
        true,
        "the rail keeps the promoted row icon-only",
      );
      assert.ok(proxy.querySelector("svg"), "the promoted row keeps its icon");

      const trigger = f.document.querySelector("[data-lso-trigger]");
      trigger.getBoundingClientRect = () => rect(36);
      trigger.dispatchEvent(new f.window.MouseEvent("mouseenter"));
      const popover = f.document.querySelector(".lso-popover");
      assert.ok(popover);
      assert.equal(
        popover.style.width,
        "240px",
        "the floating menu is wide enough for entry names",
      );
      assert.equal(
        popover.querySelector('[data-lso-entry="skills"] .lso-item-label')
          .textContent,
        "技能中心",
      );
    },
  ));

test("moving from the floating More menu onto the promoted row does not close it or flicker", async () =>
  using(
    {
      collapsed: true,
      config: { more: ["skills"] },
      hideMoreLabels: true,
    },
    async (f) => {
      const hidden = f.document.querySelector(
        'nav button[aria-label="技能中心"]',
      );
      let clicked = 0;
      hidden.addEventListener("click", () => clicked++);
      hidden.setAttribute("aria-current", "page");
      await f.flush();
      const trigger = f.document.querySelector("[data-lso-trigger]");
      trigger.dispatchEvent(new f.window.MouseEvent("mouseenter"));
      const proxy = f.document.querySelector(
        'nav > [data-lso-selection="skills"]',
      );
      assert.ok(proxy);
      assert.ok(f.document.querySelector(".lso-popover"));

      trigger.dispatchEvent(new f.window.MouseEvent("mouseleave"));
      proxy.dispatchEvent(new f.window.MouseEvent("mouseenter"));
      await new Promise((resolve) => setTimeout(resolve, 180));
      assert.ok(
        f.document.querySelector(".lso-popover"),
        "the pointer crossing onto the promoted row keeps the menu open",
      );
      assert.equal(
        f.document.querySelector('nav > [data-lso-selection="skills"]'),
        proxy,
      );

      await f.click('nav > [data-lso-selection="skills"]');
      assert.equal(clicked, 1);
      assert.equal(f.document.querySelector(".lso-popover"), null);
      assert.ok(
        f.document.querySelector('nav > [data-lso-selection="skills"]'),
        "the promoted row stays after it is selected",
      );

      trigger.dispatchEvent(new f.window.MouseEvent("mouseenter"));
      assert.ok(f.document.querySelector(".lso-popover"));
      await act(async () =>
        f.document.dispatchEvent(
          new f.window.KeyboardEvent("keydown", {
            key: "Escape",
            bubbles: true,
            cancelable: true,
          }),
        ),
      );
      assert.equal(f.document.querySelector(".lso-popover"), null);
      assert.ok(
        f.document.querySelector('nav > [data-lso-selection="skills"]'),
        "Escape closes the menu without removing the promoted row",
      );
    },
  ));

test("More stays absent by default, appears during drag as a drop target, and is created on first drop", async () =>
  using({}, async (f) => {
    assert.equal(f.document.querySelector("[data-lso-trigger]"), null);
    assert.equal(
      f.document.querySelector("[data-lso-zone]"),
      null,
      "the empty-state drop zone is not shown until dragging",
    );
    const node = f.document.querySelector('nav button[aria-label="技能中心"]');
    const start = new f.window.MouseEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      button: 0,
      clientX: 40,
      clientY: 70,
    });
    await act(async () => node.dispatchEvent(start));
    const move = new f.window.MouseEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      button: 0,
      clientX: 40,
      clientY: 90,
    });
    await act(async () => node.dispatchEvent(move));
    assert.equal(
      f.document.querySelector("[data-lso-trigger]"),
      null,
      "starting a drag does not create More",
    );
    const zone = f.document.querySelector("[data-lso-zone]");
    assert.ok(zone);
    assert.equal(zone.hidden, false);
    assert.equal(zone.parentElement, f.document.querySelector("nav"));
    assert.match(zone.textContent, /拖到这里可以将其收起/);
    const drop = new f.window.MouseEvent("pointerup", {
      bubbles: true,
      cancelable: true,
      button: 0,
      clientX: 40,
      clientY: 110,
    });
    await act(async () => zone.dispatchEvent(drop));
    const trigger = f.document.querySelector("[data-lso-trigger]");
    assert.ok(trigger, "More appears after the first item is dropped into it");
    assert.equal(trigger.querySelector("[data-lso-label]").textContent, "更多");
    assert.equal(
      JSON.parse(f.window.localStorage.getItem(configKey)).more.includes(
        "skills",
      ),
      true,
    );
    assert.equal(
      zone.hidden,
      true,
      "the temporary drop target disappears after dragging",
    );
  }));

test("a fixed sidebar entry accepts drags from More so the only remaining row can pull entries back out", async () =>
  using(
    {
      collapsed: true,
      config: { more: ["skills", "context", "schedule", "ssh"] },
    },
    async (f) => {
      const trigger = f.document.querySelector("[data-lso-trigger]");
      const plugin = f.document.querySelector('nav button[aria-label="插件"]');
      assert.notEqual(
        f.window.getComputedStyle(trigger).display,
        "none",
        "More stays visible when every movable entry starts inside it",
      );
      assert.equal(
        trigger.style.getPropertyValue("display"),
        "",
        "More does not inherit a hidden template display",
      );
      assert.equal(
        trigger.hasAttribute("data-lso-anchor"),
        false,
        "More never inherits the fixed-row anchor",
      );
      assert.equal(
        plugin.hasAttribute("data-lso-entry"),
        false,
        "the fixed plugin row is not reorderable",
      );
      assert.equal(
        plugin.getAttribute("data-lso-anchor"),
        "true",
        "the fixed row is available as an outside drop anchor",
      );
      trigger.dispatchEvent(new f.window.MouseEvent("mouseenter"));
      const popupRow = f.document.querySelector(
        '.lso-popover [data-lso-entry="skills"]',
      );
      assert.ok(popupRow);
      plugin.getBoundingClientRect = () => ({
        top: 40,
        bottom: 80,
        left: 10,
        right: 250,
        width: 240,
        height: 40,
        x: 10,
        y: 40,
        toJSON() {},
      });
      popupRow.getBoundingClientRect = () => ({
        top: 280,
        bottom: 320,
        left: 300,
        right: 540,
        width: 240,
        height: 40,
        x: 300,
        y: 280,
        toJSON() {},
      });
      await act(async () =>
        popupRow.dispatchEvent(
          new f.window.MouseEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 320,
            clientY: 300,
          }),
        ),
      );
      await act(async () =>
        plugin.dispatchEvent(
          new f.window.MouseEvent("pointermove", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 40,
            clientY: 55,
          }),
        ),
      );
      assert.equal(
        plugin.getAttribute("data-lso-after"),
        "true",
        "the fixed row receives the insertion edge below itself",
      );
      const markers = f.document.querySelectorAll(".lso-insertion-marker");
      assert.equal(
        markers.length,
        1,
        "the anchor renders exactly one blue insertion line",
      );
      assert.equal(
        markers[0].style.top,
        "78.5px",
        "the line sits directly below the plugin row",
      );
      await act(async () =>
        plugin.dispatchEvent(
          new f.window.MouseEvent("pointerup", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 40,
            clientY: 55,
          }),
        ),
      );
      const stored = JSON.parse(f.window.localStorage.getItem(configKey));
      assert.equal(
        stored.more.includes("skills"),
        false,
        "the dragged entry leaves More",
      );
      assert.equal(
        stored.order[0],
        "skills",
        "the outgoing entry lands before the other movable rows",
      );
      assert.notEqual(
        f.document.querySelector('nav button[aria-label="技能中心"]').style
          .display,
        "none",
      );
    },
  ));

test("dragging from the floating More menu keeps the original row dimmed instead of rebuilding it", async () =>
  using({ collapsed: true, config: { more: ["skills"] } }, async (f) => {
    const trigger = f.document.querySelector("[data-lso-trigger]");
    trigger.dispatchEvent(new f.window.MouseEvent("mouseenter"));
    const row = f.document.querySelector(
      '.lso-popover [data-lso-entry="skills"]',
    );
    row.getBoundingClientRect = () => ({
      top: 100,
      bottom: 140,
      left: 300,
      right: 540,
      width: 240,
      height: 40,
      x: 300,
      y: 100,
      toJSON() {},
    });
    await act(async () =>
      row.dispatchEvent(
        new f.window.MouseEvent("pointerdown", {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 320,
          clientY: 120,
        }),
      ),
    );
    await act(async () =>
      row.dispatchEvent(
        new f.window.MouseEvent("pointermove", {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 330,
          clientY: 150,
        }),
      ),
    );
    const current = f.document.querySelector(
      '.lso-popover [data-lso-entry="skills"]',
    );
    assert.equal(current, row, "the dragged floating row survives drag start");
    assert.equal(current.getAttribute("data-lso-dragging"), "true");
    assert.equal(f.window.getComputedStyle(current).opacity, "0.35");
    assert.equal(f.document.querySelectorAll(".lso-popover").length, 1);
    await act(async () =>
      f.document.dispatchEvent(
        new f.window.MouseEvent("pointercancel", { bubbles: true }),
      ),
    );
  }));

test("settings support shortcuts and validated custom links; shortcut invokes the native entry", async () =>
  using({}, async (f) => {
    let clicked = 0;
    f.document
      .querySelector('nav button[aria-label="技能中心"]')
      .addEventListener("click", () => clicked++);
    f.window.open = (...args) => {
      f.opened = args;
    };
    await f.settings();
    assert.match(
      f.document.querySelector(".lso-settings h2").textContent,
      /侧栏管家设置/,
    );
    const field = f.document.querySelector('[aria-label="快捷键 技能中心"]');
    const props =
      field[Object.keys(field).find((key) => key.startsWith("__reactProps"))];
    await act(async () =>
      props.onKeyDown({
        key: "K",
        ctrlKey: true,
        shiftKey: true,
        currentTarget: { blur() {} },
        preventDefault() {},
      }),
    );
    assert.equal(
      JSON.parse(f.window.localStorage.getItem(configKey)).shortcuts.skills,
      "Ctrl+Shift+K",
    );
    await act(async () =>
      f.document.body.dispatchEvent(
        new f.window.KeyboardEvent("keydown", {
          key: "k",
          ctrlKey: true,
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        }),
      ),
    );
    assert.equal(clicked, 1);
    const inputs = [...f.document.querySelectorAll(".lso-link-form input")];
    const nameProps =
      inputs[0][
        Object.keys(inputs[0]).find((key) => key.startsWith("__reactProps"))
      ];
    const urlProps =
      inputs[1][
        Object.keys(inputs[1]).find((key) => key.startsWith("__reactProps"))
      ];
    await act(async () => {
      nameProps.onChange({ target: { value: "项目文档" } });
      urlProps.onChange({ target: { value: "https://example.com/docs" } });
    });
    await f.click(".lso-link-form button");
    assert.equal(
      JSON.parse(f.window.localStorage.getItem(configKey)).links[0].url,
      "https://example.com/docs",
    );
    assert.equal(
      f.document.querySelectorAll(".lso-menu .lso-custom").length,
      1,
    );
  }));

test("settings describe the current More state and only activate More for hidden entries", async () =>
  using({ config: { more: ["skills"] } }, async (f) => {
    const trigger = f.document.querySelector("[data-lso-trigger]");
    const hidden = f.document.querySelector(
      'nav button[aria-label="技能中心"]',
    );
    const visible = f.document.querySelector(
      'nav button[aria-label="上下文洞察"]',
    );
    visible.setAttribute("aria-current", "page");
    await act(async () => {
      visible.classList.toggle("visible-active-probe");
      await Promise.resolve();
    });
    assert.equal(trigger.getAttribute("data-lso-active"), "false");
    hidden.setAttribute("aria-current", "page");
    visible.removeAttribute("aria-current");
    await act(async () => {
      hidden.classList.toggle("hidden-active-probe");
      await Promise.resolve();
    });
    await f.settings();
    assert.ok(
      f.document.querySelector('[aria-label="移出更多 技能中心"]'),
      "the toggle names the action needed to leave More",
    );
  }));

test("settings reject duplicate shortcuts, report the conflict, and accept arrow shortcuts", async () =>
  using({}, async (f) => {
    await f.settings();
    function field(label) {
      const node = f.document.querySelector(`[aria-label="快捷键 ${label}"]`);
      return node[
        Object.keys(node).find((key) => key.startsWith("__reactProps"))
      ];
    }
    await act(async () =>
      field("技能中心").onKeyDown({
        key: "K",
        ctrlKey: true,
        currentTarget: { blur() {} },
        preventDefault() {},
      }),
    );
    await act(async () =>
      field("上下文洞察").onKeyDown({
        key: "k",
        ctrlKey: true,
        currentTarget: { blur() {} },
        preventDefault() {},
      }),
    );
    let stored = JSON.parse(f.window.localStorage.getItem(configKey));
    assert.equal(
      stored.shortcuts.context,
      undefined,
      "a conflicting shortcut is not saved",
    );
    assert.match(
      f.document.querySelector(".lso-error").textContent,
      /技能中心/,
    );
    await act(async () =>
      field("上下文洞察").onKeyDown({
        key: "ArrowDown",
        ctrlKey: true,
        currentTarget: { blur() {} },
        preventDefault() {},
      }),
    );
    stored = JSON.parse(f.window.localStorage.getItem(configKey));
    assert.equal(stored.shortcuts.context, "Ctrl+DOWN");
  }));

test("custom links participate in More ordering and can be reordered by dragging", async () =>
  using(
    {
      config: {
        more: ["skills"],
        links: [
          { id: "link-a", label: "文档", url: "https://example.com/a" },
          { id: "link-b", label: "状态", url: "https://example.com/b" },
        ],
      },
    },
    async (f) => {
      await f.click("[data-lso-trigger]");
      const first = f.document.querySelector(
        '.lso-menu [data-lso-entry="link-a"]',
      );
      const second = f.document.querySelector(
        '.lso-menu [data-lso-entry="link-b"]',
      );
      assert.ok(
        first && second,
        "custom links expose the same drag identity as native rows",
      );
      assert.equal(second.getAttribute("data-lso-link"), "true");
      first.getBoundingClientRect = () => ({
        top: 60,
        bottom: 100,
        left: 10,
        right: 250,
        width: 240,
        height: 40,
        x: 10,
        y: 60,
        toJSON() {},
      });
      second.getBoundingClientRect = () => ({
        top: 110,
        bottom: 150,
        left: 10,
        right: 250,
        width: 240,
        height: 40,
        x: 10,
        y: 110,
        toJSON() {},
      });
      await act(async () =>
        second.dispatchEvent(
          new f.window.MouseEvent("pointerdown", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 30,
            clientY: 130,
          }),
        ),
      );
      await act(async () =>
        first.dispatchEvent(
          new f.window.MouseEvent("pointermove", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 30,
            clientY: 70,
          }),
        ),
      );
      await act(async () =>
        first.dispatchEvent(
          new f.window.MouseEvent("pointerup", {
            bubbles: true,
            cancelable: true,
            button: 0,
            clientX: 30,
            clientY: 70,
          }),
        ),
      );
      const order = JSON.parse(f.window.localStorage.getItem(configKey)).order;
      assert.ok(order.indexOf("link-b") < order.indexOf("link-a"));
    },
  ));

test("the link editor enforces and explains its storage limit", async () =>
  using(
    {
      config: {
        links: Array.from({ length: 30 }, (_, index) => ({
          id: `link-${index}`,
          label: `链接 ${index}`,
          url: `https://example.com/${index}`,
        })),
      },
    },
    async (f) => {
      await f.settings();
      assert.match(
        f.document.querySelector(".lso-error").textContent,
        /最多可添加 30 个/,
      );
      assert.equal(
        f.document.querySelector(".lso-link-form button").disabled,
        true,
      );
    },
  ));

test("normalization removes duplicate link ids and duplicate shortcut bindings", async () =>
  using(
    {
      config: {
        shortcuts: { skills: "Ctrl+K", context: "ctrl+k" },
        links: [
          { id: "link-a", label: "A", url: "https://example.com/a" },
          { id: "link-a", label: "A duplicate", url: "https://example.com/b" },
        ],
      },
    },
    async (f) => {
      const stored = JSON.parse(f.window.localStorage.getItem(configKey));
      assert.deepEqual(Object.values(stored.shortcuts), ["Ctrl+K"]);
      assert.equal(stored.links.length, 1);
      assert.equal(stored.links[0].label, "A");
    },
  ));

test("imports existing Plugin Shelf sidebar preferences once into the standalone key", async () =>
  using(
    {
      legacyConfig: {
        sidebarMore: ["skills"],
        sidebarOrder: ["skills", "context"],
        sidebarShortcuts: { skills: "Ctrl+Shift+K" },
        sidebarLinks: [
          { id: "link-docs", label: "文档", url: "https://example.com" },
        ],
      },
    },
    async (f) => {
      const saved = JSON.parse(f.window.localStorage.getItem(configKey));
      assert.deepEqual(saved.more, ["skills"]);
      assert.deepEqual(saved.order.slice(0, 2), ["skills", "context"]);
      assert.equal(saved.shortcuts.skills, "Ctrl+Shift+K");
      assert.equal(saved.links[0].url, "https://example.com");
    },
  ));

test("pointer drag dims the original while keeping the cursor-following preview solid, and restores host attributes", async () =>
  using({}, async (f) => {
    const node = f.document.querySelector('nav button[aria-label="技能中心"]');
    let clicked = 0;
    node.addEventListener("click", () => clicked++);
    node.getBoundingClientRect = () => ({
      top: 50,
      bottom: 90,
      left: 10,
      right: 250,
      width: 240,
      height: 40,
      x: 10,
      y: 50,
      toJSON() {},
    });
    await act(async () =>
      node.dispatchEvent(
        new f.window.MouseEvent("pointerdown", {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 40,
          clientY: 70,
        }),
      ),
    );
    await act(async () =>
      node.dispatchEvent(
        new f.window.MouseEvent("pointermove", {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 70,
          clientY: 120,
        }),
      ),
    );
    assert.equal(
      f.document.documentElement.getAttribute("data-lso-drag-active"),
      "true",
    );
    assert.equal(
      node.getAttribute("draggable"),
      "false",
      "HTML native dragging is disabled to avoid its cursor badge",
    );
    assert.equal(node.getAttribute("data-lso-dragging"), "true");
    assert.equal(f.window.getComputedStyle(node).opacity, "0.35");
    assert.equal(f.window.getComputedStyle(node).filter, "grayscale(1)");
    const preview = f.document.querySelector(".lso-drag-preview");
    assert.equal(f.window.getComputedStyle(preview).opacity, "1");
    assert.equal(f.window.getComputedStyle(preview).filter, "none");
    assert.equal(
      f.window.getComputedStyle(preview.querySelector("svg")).opacity,
      "1",
    );
    assert.equal(
      preview.style.left,
      "40px",
      "the original grab point stays under the visible pointer",
    );
    assert.equal(
      preview.style.top,
      "100px",
      "the preview does not drift down-right of the pointer",
    );
    assert.match(
      f.document.querySelector("[data-lso-style]").textContent,
      /\.lso-drag-preview\{[^}]*background-color:[^}]*#2b2b2b/i,
    );
    assert.doesNotMatch(
      f.document.querySelector("[data-lso-style]").textContent,
      /cursor:none/,
    );
    assert.equal(
      f.document
        .querySelector('nav button[aria-label="插件"]')
        .getAttribute("data-lso-anchor"),
      "true",
    );
    await act(async () => {
      node.dispatchEvent(
        new f.window.MouseEvent("pointerup", {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 70,
          clientY: 120,
        }),
      );
      node.dispatchEvent(
        new f.window.MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          detail: 1,
        }),
      );
    });
    assert.equal(
      clicked,
      0,
      "the synthetic click after dragging is suppressed",
    );
    await f.dispose();
    assert.equal(
      f.document.documentElement.hasAttribute("data-lso-drag-active"),
      false,
    );
    assert.equal(node.hasAttribute("data-lso-entry"), false);
    assert.equal(node.hasAttribute("draggable"), false);
    assert.equal(
      f.document
        .querySelector('nav button[aria-label="插件"]')
        .hasAttribute("data-lso-anchor"),
      false,
    );
    assert.equal(f.document.querySelector(".lso-drag-preview"), null);
  }));

test("the temporary drop zone is absent whenever More already exists, including during drag", async () =>
  using({ config: { more: ["skills"] } }, async (f) => {
    assert.ok(f.document.querySelector("[data-lso-trigger]"));
    assert.equal(f.document.querySelector("[data-lso-zone]"), null);
    const node = f.document.querySelector('nav button[aria-label="SSH"]');
    await act(async () =>
      node.dispatchEvent(
        new f.window.MouseEvent("pointerdown", {
          bubbles: true,
          button: 0,
          clientX: 40,
          clientY: 70,
        }),
      ),
    );
    await act(async () =>
      node.dispatchEvent(
        new f.window.MouseEvent("pointermove", {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 40,
          clientY: 90,
        }),
      ),
    );
    assert.equal(f.document.querySelector("[data-lso-zone]"), null);
    await act(async () =>
      node.dispatchEvent(
        new f.window.MouseEvent("pointerup", {
          bubbles: true,
          button: 0,
          clientX: 40,
          clientY: 90,
        }),
      ),
    );
  }));

test("drag insertion marker and drop use the nearest row edge when the pointer is in the gap", async () =>
  using({}, async (f) => {
    const tops = {
      插件: 40,
      技能中心: 100,
      上下文洞察: 160,
      自动化任务: 220,
      SSH: 300,
    };
    f.document.querySelectorAll("nav button[aria-label]").forEach((node) => {
      const top = tops[node.getAttribute("aria-label")];
      node.getBoundingClientRect = () => ({
        top,
        bottom: top + 40,
        left: 0,
        right: 240,
        width: 240,
        height: 40,
        x: 0,
        y: top,
        toJSON() {},
      });
    });
    const node = f.document.querySelector('nav button[aria-label="SSH"]');
    await act(async () =>
      node.dispatchEvent(
        new f.window.MouseEvent("pointerdown", {
          bubbles: true,
          button: 0,
          clientX: 40,
          clientY: 320,
        }),
      ),
    );
    await act(async () =>
      node.dispatchEvent(
        new f.window.MouseEvent("pointermove", {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 40,
          clientY: 150,
        }),
      ),
    );
    assert.equal(
      f.document
        .querySelector('nav button[aria-label="技能中心"]')
        .getAttribute("data-lso-after"),
      "true",
    );
    const marker = f.document.querySelector(".lso-insertion-marker");
    assert.ok(marker, "the insertion indicator is a separate straight line");
    assert.equal(marker.style.top, "138.5px");
    assert.equal(marker.style.left, "0px");
    assert.match(f.window.getComputedStyle(marker).borderRadius, /0px|^0$/);
    assert.match(
      f.document.querySelector("[data-lso-style]").textContent,
      /html\[data-lso-drag-active=true\] \.lso-popover :hover,html\[data-lso-drag-active=true\] \[role=menu\] :hover\{background:transparent!important/,
    );
    await act(async () =>
      node.dispatchEvent(
        new f.window.MouseEvent("pointerup", {
          bubbles: true,
          button: 0,
          clientX: 40,
          clientY: 150,
        }),
      ),
    );
    assert.equal(
      f.document.querySelector(".lso-insertion-marker"),
      null,
      "the indicator is removed when dragging ends",
    );
    assert.deepEqual(
      JSON.parse(f.window.localStorage.getItem(configKey)).order.slice(0, 3),
      ["skills", "ssh", "context"],
    );
  }));
