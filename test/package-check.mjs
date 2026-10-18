import assert from "node:assert/strict";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { fixture, readAsar } from "./harness.mjs";

const dir = mkdtempSync(join(tmpdir(), "dsh-sidebar-pack-"));
let f;
try {
  const archive = join(dir, "plugin.tgz"),
    pnpm = process.env.npm_execpath;
  if (pnpm && /pnpm/.test(pnpm))
    execFileSync(process.execPath, [pnpm, "pack", "--out", archive], {
      stdio: "pipe",
    });
  else execFileSync("pnpm", ["pack", "--out", archive], { stdio: "pipe" });
  const entries = execFileSync("tar", ["-tzf", archive], { encoding: "utf8" })
    .trim()
    .split("\n")
    .sort();
  const expected = [
    "CHANGELOG.md",
    "LICENSE",
    "README.md",
    "cordis.patch.yml",
    "dsh-plugin.naming.json",
    "lib/client.js",
    "lib/index.js",
    "locale/en.json",
    "locale/zh.json",
    "package.json",
  ]
    .map((path) => "package/" + path)
    .sort();
  assert.deepEqual(
    entries,
    expected,
    "Only reviewed runtime files and documentation belong in the package",
  );
  const read = (file) =>
    execFileSync("tar", ["-xOf", archive, "package/" + file], {
      encoding: "utf8",
    });
  const manifest = JSON.parse(read("package.json"));
  assert.equal(manifest.name, "dsh-liao-sidebar");
  assert.equal(manifest.version, "0.1.1");
  assert.equal(JSON.parse(read("locale/zh.json")).meta.title, "侧栏管家");
  assert.match(
    read("lib/client.js"),
    /id:\s*["']dsh-liao-sidebar["']/,
    "The client loader ID must match the package ID expected by DSH",
  );
  assert.doesNotMatch(
    read("lib/client.js"),
    /dps-sidebar/,
    "No Plugin Shelf sidebar implementation remains in the new package",
  );
  assert.match(
    read("lib/client.js"),
    /liao-plugin-shelf\.config/,
    "The standalone plugin can import existing saved preferences",
  );
  execFileSync("tar", ["-xzf", archive, "-C", dir]);
  const entry = await import(
    pathToFileURL(join(dir, "package/lib/index.js")).href
  );
  assert.equal(entry.name, "sidebar-organizer");
  const asar =
    process.env.DSH_ASAR ||
    "/Applications/DeepSeek Harness.app/Contents/Resources/app.asar";
  const loaderSource = existsSync(asar)
    ? readAsar(
        asar,
        "dsh/node_modules/@deepseek-ai/dsh-client-modules/lib/client.js",
      )
    : undefined;
  if (loaderSource)
    assert.equal(
      JSON.parse(
        readAsar(
          asar,
          "dsh/node_modules/@deepseek-ai/dsh-client-modules/package.json",
        ),
      ).version,
      "0.2.1-rc.2",
    );
  f = await fixture({ source: read("lib/client.js"), loaderSource });
  assert.equal(
    f.document.querySelector("[data-lso-trigger]"),
    null,
    "fresh installs start without a More trigger",
  );
  const source = f.document.querySelector('nav button[aria-label="技能中心"]');
  source.dispatchEvent(
    new f.window.MouseEvent("pointerdown", {
      bubbles: true,
      button: 0,
      clientX: 40,
      clientY: 70,
    }),
  );
  source.dispatchEvent(
    new f.window.MouseEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      button: 0,
      clientX: 40,
      clientY: 90,
    }),
  );
  const zone = f.document.querySelector("[data-lso-zone]");
  assert.ok(
    zone && !zone.hidden,
    "the packed client exposes a temporary drop target during drag",
  );
  zone.dispatchEvent(
    new f.window.MouseEvent("pointerup", {
      bubbles: true,
      cancelable: true,
      button: 0,
      clientX: 40,
      clientY: 110,
    }),
  );
  assert.ok(
    f.document.querySelector("[data-lso-trigger]"),
    "the packed client creates More after the first item is dropped",
  );
  await f.click("[data-lso-trigger]");
  assert.equal(f.document.querySelector(".lso-menu").hidden, false);
  await f.dispose();
  assert.equal(
    f.document.querySelectorAll("[data-lso-style],[data-lso-trigger],.lso-menu")
      .length,
    0,
  );
  console.log(
    "Pack OK: 10 reviewed files; localized metadata, drag-to-create More, menu and disposal passed" +
      (loaderSource
        ? " via DSH 0.2.1-rc.2 ClientModuleSystem."
        : ". Host loader unavailable; transport proof skipped."),
  );
} finally {
  if (f) await f.close();
  rmSync(dir, { recursive: true, force: true });
}
