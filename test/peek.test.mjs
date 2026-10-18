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
