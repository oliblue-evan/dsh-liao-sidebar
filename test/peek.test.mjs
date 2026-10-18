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

test("pinning the preview clears a floating More menu first", async () => {
  const f = await fixture({
    collapsed: true,
    config: { more: ["skills"] },
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
    assert.ok(
      f.document.querySelector(".lso-popover"),
      "the preview sidebar still supports the More hover menu",
    );

    f.document
      .querySelector(
        '[data-lso-peek-leading] button[aria-label="打开侧边栏"]',
      )
      .click();
    await f.flush();
    assert.equal(
      f.document.querySelector(".lso-popover"),
      null,
      "pinning the normal sidebar removes the floating menu",
    );
    assert.equal(f.frame.hasAttribute("data-lso-peek"), false);
  } finally {
    await f.close();
  }
});

test("selecting entries inside the sidebar preview keeps the More popover open", async () => {
  const f = await fixture({
    collapsed: true,
    config: { more: ["skills", "context"] },
  });
  try {
    f.document
      .querySelector('[data-shell-leading] button[aria-label="打开侧边栏"]')
      .dispatchEvent(
        new f.window.MouseEvent("pointerover", { bubbles: true }),
      );
    await sleep(220);
    await f.flush();

    f.document
      .querySelector("[data-lso-trigger]")
      .dispatchEvent(new f.window.MouseEvent("mouseenter"));
    assert.ok(f.document.querySelector(".lso-popover"));

    await f.click('.lso-popover [data-lso-entry="skills"]');
    assert.ok(
      f.document.querySelector(".lso-popover"),
      "the first selection keeps the popover open",
    );
    await f.click('.lso-popover [data-lso-entry="context"]');
    assert.ok(
      f.document.querySelector(".lso-popover"),
      "the popover survives consecutive selections inside the sidebar preview",
    );
    assert.equal(f.frame.hasAttribute("data-lso-peek"), true);
  } finally {
    await f.close();
  }
});
