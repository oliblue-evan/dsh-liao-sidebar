import assert from "node:assert/strict";
import test from "node:test";
import { fixture } from "./harness.mjs";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test("collapsed hover preview uses the real sidebar and restores the collapsed state", async () => {
  const f = await fixture({ collapsed: true });
  try {
    const trigger = f.document.querySelector(
      '[data-shell-leading] button[aria-label="打开侧边栏"]',
    );
    trigger.dispatchEvent(
      new f.window.MouseEvent("pointerover", { bubbles: true }),
    );
    await sleep(220);
    assert.equal(f.collapsed(), false, "the host expands before the overlay");
    assert.equal(
      f.frame.hasAttribute("data-lso-peek"),
      false,
      "the collapsed rail is never frozen as the preview",
    );
    f.document.querySelector("[data-shell-leading]").remove();
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), true);
    assert.equal(f.column.hasAttribute("data-lso-peek-column"), true);
    assert.match(
      f.frame.style.getPropertyValue("--lso-peek-grid"),
      /minmax\(0,\s*1fr\)/,
    );
    const strip = f.column.querySelector("[data-window-drag]");
    assert.equal(strip.hasAttribute("data-lso-peek-hidden"), true);
    assert.equal(
      f.document.querySelectorAll("[data-lso-peek-leading]").length,
      1,
    );
    assert.equal(
      f.document
        .querySelector("[data-lso-peek-leading]")
        .hasAttribute("data-window-drag-exclude"),
      true,
      "the fixed titlebar clone stays clickable on macOS Desktop",
    );
    assert.equal(
      f.column.hasAttribute("data-window-drag-exclude"),
      true,
      "the floating sidebar declares its own window-drag exclusion",
    );
    assert.deepEqual(
      Array.from(
        f.document.querySelectorAll("[data-lso-peek-leading] button"),
        (button) => button.getAttribute("aria-label"),
      ),
      ["打开侧边栏", "新建会话"],
      "both host controls are cloned before the host removes them",
    );
    const peekTop = parseInt(
        f.frame.style.getPropertyValue("--lso-peek-top"),
        10,
      ),
      peekHeight = parseInt(
        f.frame.style.getPropertyValue("--lso-peek-height"),
        10,
      );
    assert.equal(
      peekHeight,
      Math.max(320, Math.round((f.window.innerHeight - peekTop - 12) * 0.8)),
      "the floating preview uses four fifths of the available height",
    );
    assert.equal(f.toggles(), 1);
    assert.equal(f.collapsed(), false);

    f.document.body.dispatchEvent(
      new f.window.MouseEvent("pointermove", { bubbles: true }),
    );
    await sleep(220);
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), false);
    assert.equal(f.column.hasAttribute("data-lso-peek-column"), false);
    assert.equal(f.column.hasAttribute("data-window-drag-exclude"), false);
    assert.equal(strip.hasAttribute("data-lso-peek-hidden"), false);
    assert.equal(
      f.document.querySelectorAll("[data-lso-peek-leading]").length,
      0,
    );
    assert.equal(f.toggles(), 2);
    assert.equal(f.collapsed(), true);
  } finally {
    await f.close();
  }
});

test("collapsed rail layout keeps the open toggle available in the preview", async () => {
  const f = await fixture({ collapsed: true });
  try {
    f.document.querySelector("[data-shell-leading]").remove();
    const open = f.document.createElement("button");
    open.setAttribute("aria-label", "打开侧边栏");
    open.getBoundingClientRect = () => ({
      left: 10,
      top: 18,
      right: 46,
      bottom: 54,
      width: 36,
      height: 36,
    });
    const rail = f.document.createElement("div");
    rail.setAttribute("data-window-drag", "");
    rail.appendChild(open);
    const fresh = f.document.createElement("button");
    fresh.setAttribute("aria-label", "新建会话");
    fresh.getBoundingClientRect = () => ({
      left: 10,
      top: 66,
      right: 46,
      bottom: 102,
      width: 36,
      height: 36,
    });
    const newRow = f.document.createElement("div");
    newRow.appendChild(fresh);
    f.column.insertBefore(newRow, f.column.firstChild);
    f.column.insertBefore(rail, newRow);
    await f.flush();

    open.dispatchEvent(
      new f.window.MouseEvent("pointerover", { bubbles: true }),
    );
    await sleep(250);
    await f.flush();

    assert.equal(f.frame.hasAttribute("data-lso-peek"), true);
    assert.equal(f.column.hasAttribute("data-window-drag-exclude"), true);
    const clone = f.document.querySelector("[data-lso-peek-leading]");
    assert.ok(clone, "the rail open toggle is cloned above the preview");
    assert.equal(clone.hasAttribute("data-window-drag-exclude"), true);
    assert.deepEqual(
      Array.from(clone.querySelectorAll("button"), (button) =>
        button.getAttribute("aria-label"),
      ),
      ["打开侧边栏"],
      "the clone keeps the pin control without inventing a second one",
    );
  } finally {
    await f.close();
  }
});

test("preview preserves the collapsed titlebar clearance", async () => {
  const f = await fixture({ collapsed: true });
  try {
    const style = f.document.createElement("style");
    style.textContent =
      "[data-sidebar-collapsed]{--dsh-frame-leading-clearance:160px}";
    f.document.head.appendChild(style);

    f.document
      .querySelector('[data-shell-leading] button[aria-label="打开侧边栏"]')
      .dispatchEvent(
        new f.window.MouseEvent("pointerover", { bubbles: true }),
      );
    await sleep(220);
    await f.flush();

    assert.equal(f.frame.hasAttribute("data-lso-peek"), true);
    assert.equal(
      f.frame.style.getPropertyValue("--dsh-frame-leading-clearance"),
      "160px",
      "the page title keeps the space occupied by the collapsed controls",
    );

    f.document.body.dispatchEvent(
      new f.window.MouseEvent("pointermove", { bubbles: true }),
    );
    await sleep(220);
    await f.flush();
    assert.equal(
      f.frame.style.getPropertyValue("--dsh-frame-leading-clearance"),
      "",
      "the host stylesheet takes the preview-only clearance back",
    );
  } finally {
    await f.close();
  }
});

test("the floating sidebar keeps its native width on narrow windows", async () => {
  const f = await fixture({ collapsed: true });
  try {
    Object.defineProperty(f.window, "innerWidth", {
      configurable: true,
      value: 747,
    });
    Object.defineProperty(f.window, "innerHeight", {
      configurable: true,
      value: 900,
    });
    f.column.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      right: 280,
      bottom: 900,
      width: 280,
      height: 900,
      x: 0,
      y: 0,
      toJSON() {},
    });

    f.document
      .querySelector('[data-shell-leading] button[aria-label="打开侧边栏"]')
      .dispatchEvent(
        new f.window.MouseEvent("pointerover", { bubbles: true }),
      );
    await sleep(220);
    await f.flush();
    assert.equal(
      f.frame.style.getPropertyValue("--lso-peek-width"),
      "280px",
      "the preview follows the real sidebar width instead of shrinking to 260px",
    );

    Object.defineProperty(f.window, "innerWidth", {
      configurable: true,
      value: 400,
    });
    Object.defineProperty(f.window, "innerHeight", {
      configurable: true,
      value: 300,
    });
    f.window.dispatchEvent(new f.window.Event("resize"));
    await sleep(50);
    await f.flush();
    assert.equal(
      f.frame.style.getPropertyValue("--lso-peek-width"),
      "280px",
      "narrow windows keep the minimum width instead of introducing horizontal scrolling",
    );
    assert.ok(
      parseInt(f.frame.style.getPropertyValue("--lso-peek-height"), 10) <=
        300,
      "the preview height stays within the viewport",
    );
  } finally {
    await f.close();
  }
});

test("preview fades and slides both in and out", async () => {
  const f = await fixture({ collapsed: true });
  const animations = [];
  try {
    f.column.animate = function (frames, options) {
      let finish;
      const animation = {
        frames,
        options,
        finished: new Promise((resolve) => {
          finish = resolve;
        }),
        cancel() {},
        finish,
      };
      animations.push(animation);
      return animation;
    };

    f.document
      .querySelector('[data-shell-leading] button[aria-label="打开侧边栏"]')
      .dispatchEvent(
        new f.window.MouseEvent("pointerover", { bubbles: true }),
      );
    await sleep(220);
    await f.flush();

    assert.equal(animations.length, 1);
    assert.equal(animations[0].options.duration, 180);
    assert.equal(animations[0].frames[0].opacity, 0);
    assert.equal(animations[0].frames[0].translate, "-10px 0px");

    f.document.body.dispatchEvent(
      new f.window.MouseEvent("pointermove", { bubbles: true }),
    );
    await sleep(220);
    assert.equal(animations.length, 2);
    assert.equal(animations[1].options.duration, 120);
    assert.equal(animations[1].frames[1].opacity, 0);
    assert.equal(animations[1].frames[1].translate, "-6px 0px");
    assert.equal(
      f.column.hasAttribute("data-lso-peek-closing"),
      true,
      "the preview stays mounted while its exit animation runs",
    );

    animations[1].finish();
    await sleep(0);
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), false);
    assert.equal(f.column.hasAttribute("data-lso-peek-closing"), false);
  } finally {
    await f.close();
  }
});

test("closing the preview keeps the rail gutter and covers the collapse", async () => {
  const f = await fixture({ collapsed: true });
  try {
    const trigger = f.document.querySelector(
      '[data-shell-leading] button[aria-label="打开侧边栏"]',
    );
    trigger.dispatchEvent(
      new f.window.MouseEvent("pointerover", { bubbles: true }),
    );
    await sleep(220);
    await f.flush();
    const grid = f.frame.style.getPropertyValue("--lso-peek-grid");
    assert.match(
      grid,
      /^56px minmax\(0,\s*1fr\) 0px$/,
      "the preview keeps the collapsed rail width instead of collapsing it",
    );

    f.document.body.dispatchEvent(
      new f.window.MouseEvent("pointermove", { bubbles: true }),
    );
    await sleep(220);
    assert.equal(f.frame.hasAttribute("data-lso-peek"), false);
    assert.equal(f.collapsed(), true, "the host is collapsed again");
    assert.ok(
      f.document.querySelector("[data-lso-peek-clone]"),
      "a static rail covers the host collapse so the sidebar never blanks",
    );
    await f.flush();
    assert.equal(
      f.document.querySelectorAll("[data-lso-peek-clone]").length,
      0,
      "the cover is dropped once the real rail is ready",
    );
  } finally {
    await f.close();
  }
});

test("collapsing the host while previewing removes the floating overlay", async () => {
  const f = await fixture({ collapsed: true });
  try {
    f.document
      .querySelector('[data-shell-leading] button[aria-label="打开侧边栏"]')
      .dispatchEvent(
        new f.window.MouseEvent("pointerover", { bubbles: true }),
      );
    await sleep(220);
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), true);
    assert.equal(
      f.document.querySelectorAll("[data-lso-peek-leading]").length,
      1,
    );

    f.frame.setAttribute("data-sidebar-collapsed", "");
    await sleep(0);
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), false);
    assert.equal(f.column.hasAttribute("data-lso-peek-column"), false);
    assert.equal(
      f.document.querySelectorAll("[data-lso-peek-leading]").length,
      0,
    );
  } finally {
    await f.close();
  }
});

test("collapsed hover preview can be disabled and clicking inside keeps it floating", async () => {
  const disabled = await fixture({ collapsed: true, config: { peek: false } });
  try {
    disabled.document
      .querySelector('[data-shell-leading] button[aria-label="打开侧边栏"]')
      .dispatchEvent(
        new disabled.window.MouseEvent("pointerover", { bubbles: true }),
      );
    await sleep(220);
    await disabled.flush();
    assert.equal(disabled.frame.hasAttribute("data-lso-peek"), false);
    assert.equal(disabled.toggles(), 0);
  } finally {
    await disabled.close();
  }

  const f = await fixture({ collapsed: true });
  try {
    const trigger = f.document.querySelector(
      '[data-shell-leading] button[aria-label="打开侧边栏"]',
    );
    trigger.dispatchEvent(
      new f.window.MouseEvent("pointerover", { bubbles: true }),
    );
    await sleep(220);
    await f.flush();
    const inside = f.column.querySelector("button");
    inside.dispatchEvent(
      new f.window.MouseEvent("pointerdown", { bubbles: true }),
    );
    inside.dispatchEvent(new f.window.MouseEvent("click", { bubbles: true }));
    assert.equal(f.frame.hasAttribute("data-lso-peek"), true);
    assert.equal(f.column.hasAttribute("data-lso-peek-column"), true);
    assert.equal(f.toggles(), 1);
    assert.equal(f.collapsed(), false);
  } finally {
    await f.close();
  }
});

test("clicking the original open button during preview pins without double toggling", async () => {
  const f = await fixture({ collapsed: true });
  try {
    const trigger = f.document.querySelector(
      '[data-shell-leading] button[aria-label="打开侧边栏"]',
    );
    trigger.dispatchEvent(
      new f.window.MouseEvent("pointerover", { bubbles: true }),
    );
    await sleep(220);
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), true);
    assert.equal(f.toggles(), 1);

    trigger.click();
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), false);
    assert.equal(f.collapsed(), false);
    assert.equal(f.toggles(), 1, "the click pins instead of toggling again");
  } finally {
    await f.close();
  }
});

test("clicking the preview titlebar open button pins the normal expanded sidebar", async () => {
  const f = await fixture({ collapsed: true });
  try {
    f.document
      .querySelector('[data-shell-leading] button[aria-label="打开侧边栏"]')
      .dispatchEvent(
        new f.window.MouseEvent("pointerover", { bubbles: true }),
      );
    await sleep(220);
    await f.flush();
    const cloneOpen = f.document.querySelector(
      '[data-lso-peek-leading] button[aria-label="打开侧边栏"]',
    );
    cloneOpen.click();
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), false);
    assert.equal(f.column.hasAttribute("data-lso-peek-column"), false);
    assert.equal(
      f.document.querySelectorAll("[data-lso-peek-leading]").length,
      0,
    );
    assert.equal(f.toggles(), 1);
    assert.equal(f.collapsed(), false);
  } finally {
    await f.close();
  }
});

test("Meta+B closes the preview and restores the collapsed sidebar", async () => {
  const f = await fixture({ collapsed: true });
  try {
    f.document
      .querySelector('[data-shell-leading] button[aria-label="打开侧边栏"]')
      .dispatchEvent(
        new f.window.MouseEvent("pointerover", { bubbles: true }),
      );
    await sleep(220);
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), true);
    assert.equal(f.collapsed(), false);

    f.document.dispatchEvent(
      new f.window.KeyboardEvent("keydown", {
        key: "b",
        metaKey: true,
        bubbles: true,
        cancelable: true,
      }),
    );
    await sleep(240);
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), false);
    assert.equal(
      f.collapsed(),
      true,
      "the host shortcut keeps the sidebar collapsed instead of leaving it open",
    );
  } finally {
    await f.close();
  }
});

test("Escape closes the preview without the hover trigger reopening it", async () => {
  const f = await fixture({ collapsed: true });
  try {
    const trigger = f.document.querySelector(
      '[data-shell-leading] button[aria-label="打开侧边栏"]',
    );
    trigger.dispatchEvent(
      new f.window.MouseEvent("pointerover", { bubbles: true }),
    );
    await sleep(220);
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), true);

    f.document.dispatchEvent(
      new f.window.KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
        cancelable: true,
      }),
    );
    await sleep(260);
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), false);
    assert.equal(f.collapsed(), true);

    trigger.dispatchEvent(
      new f.window.MouseEvent("pointerover", { bubbles: true }),
    );
    await sleep(260);
    assert.equal(
      f.frame.hasAttribute("data-lso-peek"),
      false,
      "the trigger stays quiet until the pointer leaves it",
    );

    f.document.dispatchEvent(
      new f.window.MouseEvent("pointermove", {
        bubbles: true,
        clientX: 400,
        clientY: 400,
      }),
    );
    trigger.dispatchEvent(
      new f.window.MouseEvent("pointerover", { bubbles: true }),
    );
    await sleep(260);
    await f.flush();
    assert.equal(
      f.frame.hasAttribute("data-lso-peek"),
      true,
      "hover opens the preview again after the pointer moves away",
    );
  } finally {
    await f.close();
  }
});

test("the preview sidebar expands More on hover and collapses it when pinned", async () => {
  const f = await fixture({
    collapsed: true,
    config: { more: ["skills"], moreMode: "hover" },
  });
  try {
    f.document
      .querySelector('[data-shell-leading] button[aria-label="打开侧边栏"]')
      .dispatchEvent(
        new f.window.MouseEvent("pointerover", { bubbles: true }),
      );
    await sleep(220);
    await f.flush();

    const trigger = f.document.querySelector("[data-lso-trigger]");
    assert.ok(trigger);
    trigger.dispatchEvent(new f.window.MouseEvent("mouseenter"));
    await sleep(220);
    await f.flush();
    const menu = f.document.querySelector(".lso-menu");
    assert.equal(
      menu.hidden,
      false,
      "the preview sidebar still expands More on hover",
    );

    trigger.dispatchEvent(new f.window.MouseEvent("mouseleave"));
    f.document
      .querySelector(
        '[data-lso-peek-leading] button[aria-label="打开侧边栏"]',
      )
      .click();
    await f.flush();
    await sleep(220);
    assert.equal(
      menu.hidden,
      true,
      "pinning the normal sidebar lets the hover menu collapse",
    );
    assert.equal(f.frame.hasAttribute("data-lso-peek"), false);
  } finally {
    await f.close();
  }
});

test("selecting entries inside the sidebar preview closes the hover menu", async () => {
  const f = await fixture({
    collapsed: true,
    config: { more: ["skills", "context"], moreMode: "hover" },
  });
  try {
    f.document
      .querySelector('[data-shell-leading] button[aria-label="打开侧边栏"]')
      .dispatchEvent(
        new f.window.MouseEvent("pointerover", { bubbles: true }),
      );
    await sleep(220);
    await f.flush();

    const trigger = f.document.querySelector("[data-lso-trigger]");
    let clicked = 0;
    f.document
      .querySelector('nav button[aria-label="技能中心"]')
      .addEventListener("click", () => clicked++);
    trigger.dispatchEvent(new f.window.MouseEvent("mouseenter"));
    await sleep(220);
    await f.flush();
    const menu = f.document.querySelector(".lso-menu");
    assert.equal(menu.hidden, false);

    await f.click('.lso-menu [data-lso-entry="skills"]');
    assert.equal(clicked, 1, "the row opens the native panel");
    assert.equal(menu.hidden, true, "choosing a row closes the menu");
    assert.equal(
      f.frame.hasAttribute("data-lso-peek"),
      true,
      "the sidebar preview stays open",
    );

    trigger.dispatchEvent(new f.window.MouseEvent("mouseenter"));
    await sleep(220);
    await f.flush();
    assert.equal(menu.hidden, false, "the menu reopens on the next hover");
    assert.equal(f.frame.hasAttribute("data-lso-peek"), true);
  } finally {
    await f.close();
  }
});

test("choosing an entry from the official More menu keeps the preview open", async () => {
  const f = await fixture({
    collapsed: true,
    officialMore: true,
    officialMoreEntries: ["context"],
    config: { more: ["context"], moreMode: "click" },
  });
  try {
    f.document
      .querySelector('[data-shell-leading] button[aria-label="打开侧边栏"]')
      .dispatchEvent(
        new f.window.MouseEvent("pointerover", { bubbles: true }),
      );
    await sleep(240);
    await f.flush();
    assert.equal(f.frame.hasAttribute("data-lso-peek"), true);

    await f.click("[data-lso-official-trigger]");
    const row = f.document.querySelector(
      '[role="menu"] .sidebarEntry button[role="menuitem"]:not([aria-label])',
    );
    assert.ok(row, "the official More row is available");
    let clicked = 0;
    row.addEventListener("click", () => clicked++);
    row.dispatchEvent(
      new f.window.MouseEvent("click", { bubbles: true }),
    );
    await f.flush();
    assert.equal(clicked, 1, "the official row still receives its click");
    assert.equal(
      f.frame.hasAttribute("data-lso-peek"),
      true,
      "the floating sidebar remains open for the next entry",
    );
  } finally {
    await f.close();
  }
});
