/* DSH Sidebar Organizer — keeps global-panel navigation owned by DSH. */
window.__ModuleLoader__ &&
  window.__ModuleLoader__.load({
    id: "dsh-liao-sidebar",
    factory: function (require) {
      "use strict";
      var React = require("react"),
        NS = "liao-sidebar-organizer",
        BUNDLE = "dsh-liao-sidebar",
        KEY = NS + ".config",
        MENU_ID = NS + "-menu",
        MAX_LINKS = 30,
        MAX_SHORTCUTS = 100,
        MAX_ORDER_ITEMS = 500,
        activeCtx;
      var TEXT = {
        zh: {
          settings: "侧栏管家设置",
          entries: "入口与链接",
          more: "更多",
          moreMenu: "「更多」菜单",
          moreMode: "打开方式",
          moreModeClick: "仅点击",
          moreModeHover: "点击与悬停",
          moreModeHint:
            "点击「更多」在侧栏内展开，再点「收起」关闭。开启悬停后，指针停在「更多」上会从侧边弹出菜单。",
          pinToSidebar: "固定到侧栏",
          showCurrentEntry: "在侧栏显示当前收纳入口",
          collapse: "收起",
          peek: "收起时悬停预览",
          peekHint: "侧栏收起后，悬停「打开侧边栏」按钮显示完整侧栏。",
          peekOn: "已开启",
          peekOff: "已关闭",
          displayFix: "显示适配",
          displayFixHint:
            "自动识别收起侧栏后标题或控件与窗口按钮重叠的页面，并在当前页面补上窗口安全间距。下方每个入口可以单独关闭。",
          autoOptimize: "自动优化",
          optimize: "优化",
          optimizeDisabled: "请先开启自动优化",
          needsFix: "需优化",
          fixed: "已优化",
          alreadyFits: "已适配",
          detectedCount: "本次已识别 {count} 个需要优化的页面。",
          openMore: "展开更多侧栏入口",
          menu: "更多侧栏入口",
          empty: "拖到这里可以将其收起",
          hint: "除「插件」入口外，其他入口都可以收进「更多」。拖动可调整顺序，也可设置快捷键或添加自定义链接。",
          show: "收进更多",
          hide: "移出更多",
          up: "上移",
          down: "下移",
          shortcut: "快捷键",
          capture: "点击并按下快捷键",
          shortcutHint: "点击输入框后按下组合键；按 Backspace 清除。",
          custom: "自定义链接",
          linkOpen: "打开位置",
          linkExternal: "系统浏览器",
          linkBuiltIn: "DSH 内置浏览器",
          linkCurrent: "当前网页（Web）",
          linkLocationHint: "没有可用的会话浏览器时，链接会交给系统浏览器。",
          linkEdit: "编辑链接",
          saveLink: "保存链接",
          cancel: "取消",
          preferences: "配置备份",
          exportConfig: "导出配置",
          importConfig: "导入配置",
          resetConfig: "恢复默认",
          invalidConfig: "无法读取配置。请粘贴侧栏管家导出的 JSON。",
          confirmImport: "用这份备份替换当前的侧栏管家配置？",
          confirmReset: "清除侧栏管家的排序、收纳、快捷键和自定义链接？",
          entriesHint:
            "入口和自定义链接在这里共用同一条排序；修改会立即同步到侧栏。",
          linksHint:
            "添加常用网页；新链接会进入上方统一列表，并与侧栏入口共用「更多」中的显示顺序。",
          entryCount: "{count} 个入口",
          linkCount: "{count} 个链接",
          itemCount: "{count} 项（{entries} 个入口 · {links} 个链接）",
          onSidebar: "侧栏显示",
          inMore: "收在更多",
          label: "链接名称",
          url: "网址（https://）",
          add: "添加链接",
          remove: "移除",
          invalid: "请输入有效的 HTTP 或 HTTPS 网址。",
          shortcutConflict: "该快捷键已被「{name}」使用。",
          hostShortcutConflict:
            "该快捷键已被宿主「{name}」占用，请换一个组合。",
          hostShortcutWarning: "与宿主「{name}」冲突，插件已让出该快捷键。",
          hostShortcutUnknown: "未命名功能",
          shortcutLimit: "最多可设置 100 个快捷键。",
          linkLimit: "最多可添加 30 个自定义链接。",
          saved: "设置会立即生效，并保存在当前设备。",
          noEntries: "当前没有可整理的侧栏入口。",
        },
        en: {
          settings: "Sidebar Organizer settings",
          entries: "Entries and links",
          more: "More",
          moreMenu: "More menu",
          moreMode: "Open with",
          moreModeClick: "Click only",
          moreModeHover: "Click and hover",
          moreModeHint:
            "Click More to expand the list inline. Click Collapse to close it. Enable hover to open a separate flyout on pointer hover.",
          pinToSidebar: "Pin to sidebar",
          showCurrentEntry: "Show the active hidden entry in the sidebar",
          collapse: "Collapse",
          peek: "Hover preview when collapsed",
          peekHint: "Hover the open-sidebar button to show the full sidebar while collapsed.",
          peekOn: "On",
          peekOff: "Off",
          displayFix: "Display compatibility",
          displayFixHint:
            "Detects pages whose title or controls overlap the window buttons when the sidebar is collapsed, then adds the missing safe-area spacing. You can disable it per entry below.",
          autoOptimize: "Auto optimize",
          optimize: "Optimize",
          optimizeDisabled: "Turn on auto optimize first",
          needsFix: "Needs fix",
          fixed: "Optimized",
          alreadyFits: "Compatible",
          detectedCount:
            "This session found {count} page(s) that need optimization.",
          openMore: "Show more sidebar entries",
          menu: "More sidebar entries",
          empty: "Drag here to move an entry into More",
          hint: "Move any entry except Plugins into More. Drag to reorder, assign shortcuts, or add web links.",
          show: "Move to More",
          hide: "Move out of More",
          up: "Move up",
          down: "Move down",
          shortcut: "Shortcut",
          capture: "Click and press a shortcut",
          shortcutHint:
            "Focus the field and press a key combination. Backspace clears it.",
          custom: "Custom links",
          linkOpen: "Open in",
          linkExternal: "System browser",
          linkBuiltIn: "DSH browser",
          linkCurrent: "Current page (Web)",
          linkLocationHint: "Links use the system browser when the session browser is unavailable.",
          linkEdit: "Edit link",
          saveLink: "Save link",
          cancel: "Cancel",
          preferences: "Preferences backup",
          exportConfig: "Export preferences",
          importConfig: "Import preferences",
          resetConfig: "Restore defaults",
          invalidConfig: "Could not read the backup. Paste JSON exported by Sidebar Organizer.",
          confirmImport: "Replace the current Sidebar Organizer preferences with this backup?",
          confirmReset: "Clear Sidebar Organizer order, hidden entries, shortcuts, and custom links?",
          entriesHint:
            "Entries and custom links share one order here. Updates appear in the sidebar immediately.",
          linksHint:
            "Add frequently used web pages. New links join the unified list above and share the More order with sidebar entries.",
          entryCount: "{count} entries",
          linkCount: "{count} links",
          itemCount: "{count} items ({entries} entries · {links} links)",
          onSidebar: "On sidebar",
          inMore: "In More",
          label: "Link name",
          url: "URL (https://)",
          add: "Add link",
          remove: "Remove",
          invalid: "Enter a valid HTTP or HTTPS URL.",
          shortcutConflict: 'That shortcut is already used by "{name}".',
          hostShortcutConflict:
            'That shortcut is already used by the host feature "{name}". Choose another combination.',
          hostShortcutWarning:
            'Conflicts with the host feature "{name}"; the organizer yields this shortcut.',
          hostShortcutUnknown: "Unnamed feature",
          shortcutLimit: "You can assign at most 100 shortcuts.",
          linkLimit: "You can add at most 30 custom links.",
          saved: "Changes apply immediately and are saved on this device.",
          noEntries: "No sidebar entries are available.",
        },
      };
      var PATHS = {
        grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
        link: "M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7",
        chevron: "m8 5 7 7-7 7",
        up: "m6 14 6-6 6 6",
        down: "m6 10 6 6 6-6",
        trash: "M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5",
        edit: "m15 5 4 4M5 19l4-1L20 7l-4-4L5 14z",
        pin: "M8 3h8l-1 7 4 4v2H5v-2l4-4-1-7zM12 16v5",
      };
      var CSS = `
.lso-menu[hidden]{display:none!important}
[data-lso-peek],[data-lso-peek-pending]{grid-template-columns:var(--lso-peek-grid,0px minmax(0,1fr) 0px)!important;transition:none!important}
[data-lso-peek-restoring],[data-lso-peek-restoring] *{transition:none!important;animation:none!important}
[data-lso-peek-clone],[data-lso-peek-clone] *{animation:none!important;transition:none!important}
[data-lso-peek] [data-lso-peek-column]{position:absolute!important;grid-area:auto!important;inset:0 auto 0 0!important;width:var(--lso-peek-width,280px)!important;height:100%!important;min-width:0!important;max-height:100%!important;overflow:hidden!important;z-index:19!important;border:0!important;border-inline-end:1px solid var(--dsw-alias-border-l3,#ffffff14)!important;border-radius:0!important;box-sizing:border-box!important;background:var(--lso-peek-bg,var(--dsw-specific-sidebar-fill,var(--dsw-alias-bg-layer-2,#2c2c2e)))!important;box-shadow:var(--dsw-elevation-prominent,0 0 0 .5px #ffffff14,0 16px 40px #00000066)!important;transform:none!important;transition:none!important;backdrop-filter:var(--lso-peek-blur,none);-webkit-backdrop-filter:var(--lso-peek-blur,none)}
[data-lso-peek-pending] [data-lso-peek-column],[data-lso-peek] > [data-sidebar-mask],[data-lso-peek-pending] > [data-sidebar-mask]{visibility:hidden!important}
[data-lso-peek-column][data-lso-peek-closing]{pointer-events:none!important}
[data-lso-peek] [data-lso-peek-column]>*{height:100%!important;max-height:100%!important}
[data-lso-peek] [data-lso-peek-column] [data-window-drag]{-webkit-app-region:no-drag!important;cursor:default!important}
[data-lso-peek-hidden]{visibility:hidden!important}
[data-lso-peek] [data-lso-peek-column] [class*="logoRow"]:has([data-lso-peek-hidden]){margin-top:var(--lso-peek-header-offset,0px)}
html [data-lso-page-fix=true]{box-sizing:border-box!important;padding-top:calc(var(--lso-page-fix-base-top,0px) + var(--lso-page-fix-top,0px))!important;padding-right:calc(var(--lso-page-fix-base-right,0px) + var(--lso-page-fix-x,0px))!important;padding-bottom:calc(var(--lso-page-fix-base-bottom,0px) + var(--lso-page-fix-bottom,0px))!important;padding-left:calc(var(--lso-page-fix-base-left,0px) + var(--lso-page-fix-x,0px))!important}
.lso-mode-options{display:inline-flex;align-items:center;gap:2px;margin-top:8px;padding:2px;border:1px solid var(--dsw-alias-border-l2,#8883);border-radius:9px;background:var(--dsw-alias-bg-layer-2,#8881)}
.lso-mode-option{height:28px;padding:0 14px!important;border:0;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary,#aaa);font-size:12px;line-height:20px;white-space:nowrap}
.lso-mode-option[aria-checked=true],.lso-mode-option[aria-checked=true]:hover{background:var(--dsw-alias-bg-layer-1,#8881);color:var(--dsw-alias-label-primary,#eee);box-shadow:0 1px 2px #00000040}
.lso-more{position:relative;display:flex!important;flex-wrap:nowrap!important;align-items:center;gap:10px;width:100%;min-width:0;overflow:hidden;box-sizing:border-box;text-align:left}
.lso-more[data-lso-active=true]{background:var(--dsw-alias-interactive-bg-hover,#8883)!important;color:var(--dsw-alias-label-primary,#eee)}
.lso-more[aria-expanded=true]>[data-lso-label]{color:var(--dsw-alias-label-tertiary,#8e8e93)!important}
.lso-more>[data-lso-label]{display:block;flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lso-more>svg,.lso-dropzone>svg{display:block!important;width:1em!important;height:1em!important;min-width:1em!important;max-width:1em!important;flex:0 0 1em!important}
.lso-chevron{width:.8em!important;height:.8em!important;min-width:.8em!important;max-width:.8em!important;flex:0 0 .8em!important;margin-left:auto;opacity:.65;transition:transform .16s ease}
.lso-more[aria-expanded=true] .lso-chevron{transform:rotate(90deg)}
.lso-current-entry>[data-lso-current-label]{display:block;flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:inherit;font:inherit}
.lso-current-entry>[data-lso-current-label][hidden]{display:none!important}
.lso-current-entry[data-lso-selected=true]{background:var(--dsw-alias-interactive-bg-hover,#8883)!important;color:var(--dsw-alias-label-primary,#eee)!important}
.lso-menu{display:flex;flex-direction:column;gap:4px;width:100%;min-width:0;max-width:100%;max-height:min(50vh,420px);overflow-y:auto;overflow-x:hidden;padding:0;box-sizing:border-box;flex:0 0 auto}
.lso-menu .lso-item{width:100%;min-width:0;max-width:100%;box-sizing:border-box;cursor:pointer;justify-content:flex-start!important;gap:10px!important;padding:0 12px!important;text-align:left}
.lso-menu[data-lso-inline]{max-height:none;overflow:visible}
[data-lso-inline] .lso-inline-row{position:relative;min-width:0}
[data-lso-inline] .lso-item{display:flex;align-items:center;min-height:32px;border:0;border-radius:var(--dsw-radius-md,8px);background:transparent;color:inherit;font:inherit}
[data-lso-inline] .lso-inline-row>.lso-item{padding-inline-end:38px!important}
[data-lso-inline] .lso-item>svg,[data-lso-inline] .lso-item>[class*="panelGlyph"]{width:16px;height:16px;flex:none}
[data-lso-inline] .lso-inline-pin{position:absolute;inset-inline-end:0;top:50%;transform:translateY(-50%);display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;padding:0;border:0;border-radius:var(--dsw-radius-sm,6px);background:transparent;color:var(--dsw-alias-label-caption,#999);cursor:pointer}
[data-lso-inline] .lso-inline-pin:hover{color:var(--dsw-alias-label-primary,#eee)}
[data-lso-inline] .lso-inline-pin:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#8099ff));outline-offset:-2px}
[data-lso-inline] .lso-inline-pin svg{display:block;width:14px;height:14px;pointer-events:none}
@media(hover:hover){[data-lso-inline] .lso-inline-row:not(:hover):not(:focus-within) .lso-inline-pin{opacity:0;pointer-events:none}}
[data-lso-inline-open] [class*="panelTitle"]{color:var(--dsw-alias-label-tertiary,#8e8e93)}
[data-lso-inline-open] [data-lso-more-trailing] svg:last-child{transform:rotate(90deg)}
[data-lso-inline-open] [data-lso-more-trailing] svg:not(:last-child){display:none}
.lso-native-extra{display:contents}
[data-slot="sidebar.panellist.actions"]:has(>.lso-native-extra){display:contents}
[data-lso-flyout]{position:fixed!important;inset:auto!important;left:var(--lso-flyout-x)!important;top:var(--lso-flyout-y)!important;transform:none!important;width:var(--lso-flyout-width)!important;min-width:0!important;max-width:calc(100vw - 16px)!important;max-height:var(--lso-flyout-height)!important;overflow-y:auto!important;box-sizing:border-box}
[data-lso-more-trailing]{display:inline-flex;align-items:center;gap:8px;margin-inline-start:auto;pointer-events:none;opacity:.8}
[data-lso-more-trailing] svg{width:16px;height:16px;flex:none}
[data-lso-more-trailing] svg:last-child{width:12px;height:12px}
button[data-lso-official-trigger][data-lso-active=true],button[data-lso-official-trigger][aria-expanded=true]:not([data-lso-inline-open]){background:var(--dsw-alias-interactive-bg-hover,#8883)!important}
.lso-native-extra .lso-item{display:flex;align-items:center;justify-content:flex-start!important;gap:6px!important;width:100%;min-width:0;max-width:100%;min-height:34px;height:34px;padding:6px 8px!important;border:0;border-radius:12px;background:transparent;color:inherit;font:13px/20px system-ui,sans-serif;text-align:left;cursor:pointer;box-sizing:border-box}
.lso-native-extra .lso-item>svg{display:block;width:16px!important;height:16px!important;min-width:16px!important;max-width:16px!important;flex:0 0 16px!important}
.lso-native-extra .lso-custom{display:flex;align-items:center;gap:6px}
.lso-native-extra .lso-item-label{display:block;flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:inherit;font:inherit;text-align:left}
.lso-native-extra .lso-shortcut{margin-left:auto}
.lso-native-extra .lso-item[data-lso-selected=true]:after{content:'✓';margin-left:auto;color:var(--dsw-alias-state-business-primary,#8099ff);font-size:18px;line-height:1}
button[data-lso-official-trigger][data-lso-target=true]{background:var(--dsw-alias-interactive-bg-hover,#8883)!important}
.lso-item>.lso-item-label{display:block;flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:inherit;font:inherit;text-align:left}
.lso-menu .lso-item:hover,.lso-native-extra .lso-item:hover,.lso-item:focus-visible,.lso-item[data-lso-selected=true]{background:var(--dsw-alias-interactive-bg-hover,#8883)!important;outline:none}
.lso-shortcut{margin-left:auto;padding:1px 5px;border:1px solid var(--dsw-alias-border-l2,#8884);border-radius:5px;color:var(--dsw-alias-label-tertiary,#999);font:11px/1.4 system-ui,sans-serif;white-space:nowrap}
.lso-dropzone{display:flex;align-items:center;justify-content:center;gap:8px;min-height:44px;margin:4px 8px;padding:6px 10px;border:1px dashed var(--dsw-alias-border-l2,#8887);border-radius:10px;color:var(--dsw-alias-label-tertiary,#999);font-size:12px;box-sizing:border-box}
.lso-dropzone[hidden]{display:none!important}
.lso-dropzone[data-lso-target=true]{border:2px dashed var(--dsw-alias-state-business-primary,#6683ee);background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#6683ee) 10%,transparent);color:var(--dsw-alias-state-business-primary,#8099ff)}
.lso-insertion-marker{position:fixed;z-index:2147483646;height:3px;background:var(--dsw-alias-state-business-primary,#6683ee);border-radius:0;pointer-events:none}
.lso-insertion-marker[hidden]{display:none!important}
[data-lso-entry][data-lso-dragging=true]{opacity:.35!important;filter:grayscale(1)!important}
.lso-drag-preview,.lso-drag-preview *{opacity:1!important;filter:none!important}
.lso-drag-preview{position:fixed!important;z-index:2147483647!important;pointer-events:none!important;background:var(--dsw-alias-bg-layer-2,#2b2b2b)!important;background-color:var(--dsw-alias-bg-layer-2,#2b2b2b)!important;transform:none!important;box-shadow:0 8px 24px #0005!important}
html[data-lso-drag-active=true] [data-lso-entry]:hover,html[data-lso-drag-active=true] nav[aria-label] :hover,html[data-lso-drag-active=true] [role=menu] :hover{background:transparent!important;outline:none!important;box-shadow:none!important}
.lso-settings{display:flex;flex-direction:column;gap:12px;max-width:100%;padding:16px;color:var(--dsw-alias-label-primary,#eee);font:13px/1.5 system-ui,sans-serif;container-type:inline-size}
.lso-settings *{box-sizing:border-box}
.lso-settings-header{min-width:0}
.lso-settings h2{margin:0;font-size:20px;line-height:28px;font-weight:600}
.lso-settings p{margin:0;color:var(--dsw-alias-label-secondary,#aaa)}
.lso-settings h3{margin:0;font-size:14px;line-height:20px;font-weight:500}
.lso-settings .lso-intro{max-width:640px;margin-top:4px;color:var(--dsw-alias-label-tertiary,#999);font-size:12px;line-height:18px}
.lso-settings-section{min-width:0;padding:14px 16px;border:1px solid var(--dsw-alias-border-l2,#8883);border-radius:12px;background:var(--dsw-alias-bg-layer-1,#8881)}
.lso-section-heading{display:flex;align-items:center;justify-content:space-between;gap:12px}
.lso-toggle-heading{align-items:flex-start}
.lso-setting-copy{min-width:0;flex:1 1 auto}
.lso-toggle-heading .lso-more-switch{margin-top:-4px}
.lso-section-count{flex:none;padding:1px 7px;border-radius:999px;background:var(--dsw-alias-bg-layer-2,#8881);color:var(--dsw-alias-label-tertiary,#999);font-size:11px;line-height:18px;font-variant-numeric:tabular-nums}
.lso-settings .lso-section-hint{margin-top:3px;color:var(--dsw-alias-label-tertiary,#999);font-size:12px;line-height:18px}
.lso-settings ul{list-style:none;margin:0;padding:0}
.lso-settings-list{margin-top:6px!important}
.lso-settings .lso-empty{padding:16px 0 4px;color:var(--dsw-alias-label-tertiary,#999);font-size:12px}
.lso-entry-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:10px 12px;padding:10px 0;border-bottom:1px solid var(--dsw-alias-border-l2,#8882)}
.lso-entry-row:last-child{border-bottom:0;padding-bottom:0}
.lso-entry-main{min-width:0}
.lso-entry-title{display:flex;align-items:center;gap:8px;min-width:0}
.lso-entry-title strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;line-height:20px;font-weight:500}
.lso-entry-badge{flex:none;padding:0 6px;border-radius:999px;background:var(--dsw-alias-bg-layer-2,#8881);color:var(--dsw-alias-label-tertiary,#999);font-size:10px;line-height:18px}
.lso-entry-badge[data-state=more]{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#6683ee) 12%,transparent);color:var(--dsw-alias-state-business-primary,#8099ff)}
.lso-entry-badge[data-state=needs]{background:color-mix(in srgb,var(--dsw-alias-state-warn-primary,#e5b454) 12%,transparent);color:var(--dsw-alias-state-warn-primary,#e5b454)}
.lso-entry-badge[data-state=fixed]{background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#5cc98b) 12%,transparent);color:var(--dsw-alias-state-success-primary,#5cc98b)}
.lso-entry-badge[data-state=ok]{background:color-mix(in srgb,var(--dsw-alias-state-success-primary,#5cc98b) 8%,transparent);color:var(--dsw-alias-state-success-primary,#5cc98b)}
.lso-settings small{display:block;color:var(--dsw-alias-label-tertiary,#999);font-size:11px;line-height:17px;overflow-wrap:anywhere}
.lso-entry-actions{display:flex;align-items:center;justify-content:flex-end;gap:5px;flex:none}
.lso-switches{display:flex;align-items:center;gap:4px;flex:none}
.lso-actions{display:flex;align-items:center;gap:3px;flex:none}
.lso-settings button,.lso-settings input{font:inherit;color:inherit}
.lso-settings button{cursor:pointer}
.lso-settings button:focus-visible,.lso-settings input:focus-visible,.lso-settings summary:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary,#6683ee);outline-offset:2px}
.lso-settings button:hover{background:var(--dsw-alias-interactive-bg-hover,#8882)}
.lso-actions button,.lso-settings .lso-add{border:1px solid var(--dsw-alias-border-l2,#8883);border-radius:8px;background:var(--dsw-alias-bg-layer-2,#8881);padding:0 8px;min-width:30px;height:30px;line-height:20px}
.lso-actions button:disabled{opacity:.35;cursor:default}
.lso-icon-button{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;padding:0!important}
.lso-icon-button svg{width:14px;height:14px;display:block}
.lso-more-switch{display:inline-flex;align-items:center;gap:7px;flex:none;height:30px;padding:0 4px 0 8px!important;border:0;border-radius:8px;background:transparent}
.lso-more-switch-label{color:var(--dsw-alias-label-tertiary,#999);font-size:11px;line-height:18px}
.lso-switch-track{position:relative;display:block;width:34px;height:20px;padding:2px;border-radius:20px;background:var(--dsw-alias-interactive-bg-hover,#777);transition:background .15s}
.lso-switch-track>span{display:block;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-label-primary,#fff);transition:transform .15s}
.lso-more-switch[aria-checked=true] .lso-switch-track{background:var(--dsw-alias-state-business-primary,#6683ee)}
.lso-more-switch[aria-checked=true] .lso-switch-track>span{transform:translateX(14px)}
.lso-more-switch:disabled{opacity:.45;cursor:default}
.lso-shortcut-cell{display:flex;flex-direction:column;align-items:flex-start;gap:4px;min-width:0}
.lso-capture{width:158px;max-width:100%;height:30px;padding:0 8px;border:1px solid var(--dsw-alias-border-l2,#8883);border-radius:8px;background:var(--dsw-alias-bg-layer-2,#8881);text-align:center;cursor:pointer;font-size:12px!important}
.lso-capture::placeholder{color:var(--dsw-alias-label-tertiary,#999)}
.lso-shortcut-warning{max-width:210px;color:var(--dsw-alias-state-error-primary,#ef8585);font-size:11px;line-height:15px}
.lso-link-form{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.5fr) minmax(0,1fr) auto;gap:8px;margin-top:10px;padding:10px;border-radius:10px;background:var(--dsw-alias-bg-layer-2,#8881)}
.lso-field{display:flex;flex-direction:column;gap:4px;min-width:0}
.lso-field>span{color:var(--dsw-alias-label-tertiary,#999);font-size:11px;line-height:16px}
.lso-link-form input{min-width:0;height:32px;padding:0 9px;border:1px solid var(--dsw-alias-border-l2,#8883);border-radius:8px;background:var(--dsw-alias-bg-layer-1,#8881);font-size:12px}
.lso-link-form select{min-width:0;height:32px;padding:0 8px;color:inherit;border:1px solid var(--dsw-alias-border-l2,#8883);border-radius:8px;background:var(--dsw-alias-bg-layer-1,#8881);font:inherit}
.lso-backup-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
.lso-backup-text{display:block;width:100%;min-height:80px;resize:vertical;margin-top:8px;padding:6px 8px;border:1px solid var(--dsw-alias-border-l2,#8883);border-radius:8px;background:var(--dsw-alias-bg-layer-2,#8881);color:inherit;font:12px/1.5 monospace}
.lso-settings .lso-add{align-self:end;height:32px;padding:0 12px;white-space:nowrap}
.lso-settings .lso-add-primary{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#6683ee) 14%,transparent);border-color:color-mix(in srgb,var(--dsw-alias-state-business-primary,#6683ee) 45%,transparent);color:var(--dsw-alias-state-business-primary,#8099ff)}
.lso-settings .lso-add:disabled{opacity:.4;cursor:default}
.lso-settings details{border:1px solid var(--dsw-alias-border-l2,#8883);border-radius:12px;background:var(--dsw-alias-bg-layer-1,#8881)}
.lso-settings details.lso-settings-section{padding:0}
.lso-settings summary{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:24px;padding:14px 16px;cursor:pointer;list-style:none;font-size:14px;line-height:20px;font-weight:500}
.lso-settings summary::-webkit-details-marker{display:none}
.lso-settings summary:after{content:'⌄';flex:none;color:var(--dsw-alias-label-tertiary,#999);font-weight:400}
.lso-summary-title{display:flex;align-items:center;gap:8px;min-width:0}
.lso-settings details[open]>summary:after{transform:rotate(180deg)}
.lso-settings details[open]>summary{border-bottom:1px solid var(--dsw-alias-border-l2,#8882)}
.lso-disclosure-body{padding:12px 16px 14px}
.lso-settings-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:0 2px;color:var(--dsw-alias-label-tertiary,#999);font-size:12px;line-height:18px}
.lso-notice{padding:9px 12px;border:1px solid color-mix(in srgb,var(--dsw-alias-state-error-primary,#ef8585) 35%,transparent);border-radius:9px;background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#ef8585) 8%,transparent);color:var(--dsw-alias-state-error-primary,#ef8585);font-size:12px;line-height:18px}
.lso-error{color:var(--dsw-alias-state-error-primary,#ef8585)!important}
@container(max-width:560px){.lso-entry-row{grid-template-columns:1fr}.lso-entry-actions{justify-content:flex-start}.lso-shortcut-cell{width:100%}.lso-capture{width:100%;max-width:220px}.lso-link-form{grid-template-columns:1fr}.lso-settings .lso-add{justify-self:start}.lso-entry-title{flex-wrap:wrap}}
@media(prefers-reduced-motion:reduce){.lso-switch-track,.lso-switch-track>span{transition:none}}
`;
      function t(key) {
        var lang =
          activeCtx && activeCtx.locale
            ? activeCtx.locale.getSnapshot().active
            : "zh";
        return (
          (String(lang).toLowerCase().startsWith("zh") ? TEXT.zh : TEXT.en)[
            key
          ] || key
        );
      }
      function el(tag, cls, value) {
        var node = document.createElement(tag);
        if (cls) node.className = cls;
        if (value !== undefined) node.textContent = value;
        return node;
      }
      function attr(node, key, value) {
        if (node.getAttribute(key) !== value) node.setAttribute(key, value);
      }
      function svg(name) {
        var node = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg",
        );
        node.setAttribute("viewBox", "0 0 24 24");
        node.setAttribute("width", name === "chevron" ? ".8em" : "1em");
        node.setAttribute("height", name === "chevron" ? ".8em" : "1em");
        node.setAttribute("aria-hidden", "true");
        node.setAttribute("fill", "none");
        node.setAttribute("stroke", "currentColor");
        node.setAttribute("stroke-width", "1.7");
        node.setAttribute("stroke-linecap", "round");
        node.setAttribute("stroke-linejoin", "round");
        var path = document.createElementNS(node.namespaceURI, "path");
        path.setAttribute("d", PATHS[name]);
        node.appendChild(path);
        return node;
      }
      function read() {
        try {
          return JSON.parse(window.localStorage.getItem(KEY) || "null");
        } catch (_) {
          return null;
        }
      }
      function safeUrl(value) {
        try {
          var url = new window.URL(value);
          return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
          return false;
        }
      }
      function validShortcut(value) {
        return /^(?:(?:Ctrl|Alt|Shift|Meta)\+){1,4}(?:[A-Z0-9]|F(?:[1-9]|1[0-2])|SPACE|ENTER|ESC|TAB|BACKSPACE|DELETE|UP|DOWN|LEFT|RIGHT)$/i.test(
          value,
        );
      }
      function normalize(raw) {
        var v =
            raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {},
          out = {
            order: [],
            more: [],
            shortcuts: {},
            links: [],
            peek: v.peek !== false,
            moreMode: v.moreMode === "click" ? "click" : "hover",
            showCurrentEntry: v.showCurrentEntry === true,
            optimize: v.optimize !== false,
            optimizePages: {},
          };
        function ids(value) {
          return Array.isArray(value)
            ? Array.from(
                new Set(
                  value.filter(function (x) {
                    return typeof x === "string" && x.length < 256;
                  }),
                ),
              ).slice(0, MAX_ORDER_ITEMS)
            : [];
        }
        out.order = ids(v.order);
        out.more = ids(v.more);
        if (
          v.shortcuts &&
          typeof v.shortcuts === "object" &&
          !Array.isArray(v.shortcuts)
        ) {
          var seenKeys = new Set();
          Object.keys(v.shortcuts)
            .slice(0, MAX_SHORTCUTS)
            .forEach(function (id) {
              var key = v.shortcuts[id],
                canonical = typeof key === "string" ? key.toLowerCase() : "";
              if (
                validShortcut(key) &&
                !seenKeys.has(canonical) &&
                Object.keys(out.shortcuts).length < MAX_SHORTCUTS
              ) {
                seenKeys.add(canonical);
                out.shortcuts[id] = v.shortcuts[id];
              }
            });
        }
        if (Array.isArray(v.links)) {
          var seenLinks = new Set(),
            links = [];
          v.links.forEach(function (x) {
            if (!x || typeof x !== "object" || links.length >= MAX_LINKS)
              return;
            var id =
                typeof x.id === "string" && /^[a-z0-9-]{1,64}$/i.test(x.id)
                  ? x.id
                  : "",
              label =
                typeof x.label === "string" ? x.label.trim().slice(0, 60) : "",
              url =
                typeof x.url === "string" ? x.url.trim().slice(0, 2048) : "";
            if (!id || !label || !safeUrl(url) || seenLinks.has(id)) return;
            seenLinks.add(id);
            var link = { id: id, label: label, url: url };
            if (x.open === "builtin" || x.open === "current") link.open = x.open;
            links.push(link);
          });
          out.links = links;
        }
        if (
          v.optimizePages &&
          typeof v.optimizePages === "object" &&
          !Array.isArray(v.optimizePages)
        ) {
          Object.keys(v.optimizePages)
            .slice(0, MAX_ORDER_ITEMS)
            .forEach(function (id) {
              if (
                typeof id === "string" &&
                id.length < 256 &&
                typeof v.optimizePages[id] === "boolean"
              )
                out.optimizePages[id] = v.optimizePages[id];
            });
        }
        out.peek = v.peek !== false;
        out.optimize = v.optimize !== false;
        return out;
      }
      function shortcutFromEvent(event) {
        var key = String(event.key || "").toUpperCase();
        if (["CONTROL", "ALT", "SHIFT", "META"].includes(key)) return "";
        var mods = [];
        if (event.ctrlKey) mods.push("Ctrl");
        if (event.altKey) mods.push("Alt");
        if (event.shiftKey) mods.push("Shift");
        if (event.metaKey) mods.push("Meta");
        if (!mods.length) return "";
        var aliases = {
          " ": "SPACE",
          ESCAPE: "ESC",
          ARROWDOWN: "DOWN",
          ARROWUP: "UP",
          ARROWLEFT: "LEFT",
          ARROWRIGHT: "RIGHT",
        };
        key = aliases[key] || key;
        var result = mods.join("+") + "+" + key;
        return validShortcut(result) ? result : "";
      }
      function canonicalKey(value) {
        var key = String(value || "").trim(),
          lower = key.toLowerCase(),
          aliases = {
            " ": "SPACE",
            space: "SPACE",
            spacebar: "SPACE",
            esc: "ESC",
            escape: "ESC",
            return: "ENTER",
            enter: "ENTER",
            arrowup: "UP",
            up: "UP",
            arrowdown: "DOWN",
            down: "DOWN",
            arrowleft: "LEFT",
            left: "LEFT",
            arrowright: "RIGHT",
            right: "RIGHT",
            del: "DELETE",
            delete: "DELETE",
            backspace: "BACKSPACE",
            tab: "TAB",
          };
        if (aliases[lower]) return aliases[lower];
        if (/^f(?:[1-9]|1[0-2])$/i.test(key)) return key.toUpperCase();
        return /^[a-z0-9]$/i.test(key) ? key.toUpperCase() : "";
      }
      function canonicalShortcut(value) {
        var parts = String(value || "")
            .trim()
            .split("+")
            .map(function (part) {
              return part.trim();
            })
            .filter(Boolean),
          mods = [],
          key = "";
        if (!parts.length) return "";
        parts.forEach(function (part) {
          var lower = part.toLowerCase(),
            mod =
              lower === "control" || lower === "ctrl"
                ? "Ctrl"
                : lower === "alt" || lower === "option"
                  ? "Alt"
                  : lower === "shift"
                    ? "Shift"
                    : lower === "meta" ||
                        lower === "cmd" ||
                        lower === "command" ||
                        lower === "super"
                      ? "Meta"
                      : "";
          if (mod) {
            if (!mods.includes(mod)) mods.push(mod);
            return;
          }
          key = canonicalKey(part);
        });
        var ordered = ["Ctrl", "Alt", "Shift", "Meta"].filter(function (mod) {
          return mods.includes(mod);
        });
        var result = ordered.concat(key ? [key] : []).join("+");
        return validShortcut(result) ? result : "";
      }
      function hostShortcutOwner(value) {
        var wanted = canonicalShortcut(value);
        if (!wanted) return "";
        var nodes = document.querySelectorAll("[aria-keyshortcuts]");
        for (var i = 0; i < nodes.length; i += 1) {
          var node = nodes[i];
          if (
            node.closest &&
            node.closest(
              '[data-plugin="dsh-liao-sidebar"],[data-lso-native-extra]',
            )
          )
            continue;
          var values = String(
            node.getAttribute("aria-keyshortcuts") || "",
          ).split(/\s+/);
          if (
            values.some(function (candidate) {
              return canonicalShortcut(candidate) === wanted;
            })
          )
            return (
              String(node.getAttribute("aria-label") || "").trim() ||
              String(node.getAttribute("title") || "").trim() ||
              String(node.textContent || "")
                .replace(/\s+/g, " ")
                .trim() ||
              t("hostShortcutUnknown")
            );
        }
        return "";
      }
      function pretty(value) {
        return String(value || "")
          .split("+")
          .map(function (part) {
            return (
              {
                Ctrl: "⌃",
                Alt: "⌥",
                Shift: "⇧",
                Meta: "⌘",
                SPACE: "Space",
                ENTER: "↵",
                ESC: "Esc",
                TAB: "Tab",
                BACKSPACE: "⌫",
                DELETE: "Del",
                UP: "↑",
                DOWN: "↓",
                LEFT: "←",
                RIGHT: "→",
              }[part] || part
            );
          })
          .join("");
      }
      function apply(ctx) {
        activeCtx = ctx;
        var config = normalize(read()),
          entries = [],
          targets = new Map(),
          templates = new Map(),
          menuGlyphs = new Map(),
          original = new Map(),
          originalOrder = new Map(),
          originalOfficialOrder = new WeakMap(),
          originalDrag = new Map(),
          expanded = false,
          nav = null,
          trigger = null,
          triggerHost = null,
          triggerOwned = false,
          triggerBound = null,
          triggerHandlers = null,
          menu = null,
          nativeMenu = null,
          nativeExtra = null,
          slotExtra = null,
          pinHost = null,
          nativeMenuFrame = null,
          moreGeometry = null,
          moreResize = null,
          sidebarBrowser = null,
          currentProxy = null,
          currentProxyId = null,
          zone = null,
          preview = null,
          insertionMarker = null,
          dragging = null,
          pointerPress = null,
          dropTarget = null,
          alignmentTried = new Set(),
          sidebarCollapsed = null,
          dragClick = false,
          moreOpenTimer = null,
          moreCloseTimer = null,
          pinRequests = new Set(),
          moreHoverOpened = false,
          nativeMoreClick = false,
          moreHoverNodes = new WeakSet(),
          peek = {
            active: false,
            pinned: false,
            owned: false,
            pointerInside: false,
            frame: null,
            drawer: false,
            column: null,
            trigger: null,
            hiddenStrip: null,
            leadingClone: null,
            leadingCapture: null,
            leadingClearance: "",
            leadingClearanceInline: null,
            leadingClearanceApplied: false,
            closing: false,
            openAnimation: null,
            closeAnimation: null,
            finishTimer: null,
            openTimer: null,
            closeTimer: null,
            revealFrame: null,
            revealTries: 0,
            panelEnter: null,
            panelLeave: null,
            naturalWidth: 0,
            holdClosed: false,
            railSnapshot: null,
            railRect: null,
            railBg: "",
            railClone: null,
          },
          compat = {
            frame: null,
            observer: null,
            center: null,
            root: null,
            appliedTo: null,
            pageId: null,
            applied: false,
            retry: 0,
            viewport: 0,
            seen: Object.create(null),
          },
          cloneNo = 0,
          listeners = new Set(),
          alive = true;
        var legacy = null;
        if (!read()) {
          try {
            legacy = JSON.parse(
              window.localStorage.getItem("liao-plugin-shelf.config") || "null",
            );
          } catch (_) {}
          if (legacy) {
            config = normalize({
              order: legacy.sidebarOrder,
              more: legacy.sidebarMore,
              shortcuts: legacy.sidebarShortcuts,
              links: legacy.sidebarLinks,
            });
          }
        }
        function persist() {
          try {
            window.localStorage.setItem(KEY, JSON.stringify(config));
          } catch (_) {}
        }
        function update(next) {
          config = normalize(Object.assign({}, config, next));
          if (config.peek === false) closePeek(true, true);
          if (config.moreMode !== "hover") resetMoreHover();
          persist();
          listeners.forEach(function (fn) {
            fn();
          });
          refresh();
          scheduleCompat();
        }
        function label(entry) {
          try {
            var value = entry.options && entry.options.label;
            return (
              (typeof value === "function" ? value() : value) ||
              entry.options.id
            );
          } catch (_) {
            return entry.options && entry.options.id;
          }
        }
        function selected(id) {
          try {
            var info =
                activeCtx &&
                activeCtx.layout &&
                activeCtx.layout.panelInfo,
              active =
                info &&
                typeof info.getSnapshot === "function" &&
                info.getSnapshot().activePanelId;
            if (active !== null && active !== undefined)
              return active === id;
          } catch (_) {}
          var node = targets.get(id);
          return (
            !!node &&
            (node.getAttribute("aria-current") === "page" ||
              node.getAttribute("aria-selected") === "true" ||
              node.getAttribute("data-state") === "active" ||
              node.classList.contains("active") ||
              node.classList.contains("selected") ||
              node.classList.contains("current"))
          );
        }
        function rowHost(node) {
          var host = node;
          while (host && host.parentElement && host.parentElement !== nav)
            host = host.parentElement;
          return host || node;
        }
        function activate(id) {
          var link = linkFor(id);
          if (link) {
            if (link.open === "builtin" && sidebarBrowser) {
              try {
                sidebarBrowser.openTab("browser", {
                  params: { url: link.url },
                  revealIfOpened: false,
                });
                return true;
              } catch (_) {}
            }
            if (link.open === "current" && /^https?:$/.test(window.location.protocol)) {
              window.location.assign(link.url);
              return true;
            }
            window.open(link.url, "_blank", "noopener,noreferrer");
            return true;
          }
          try {
            if (
              activeCtx &&
              activeCtx.layout &&
              typeof activeCtx.layout.selectPanel === "function"
            ) {
              activeCtx.layout.selectPanel(id);
              return true;
            }
          } catch (_) {}
          var target = targets.get(id);
          if (target && target.isConnected) {
            target.click();
            return true;
          }
          return false;
        }
        function ordered() {
          return config.order
            .map(function (id) {
              return entries.find(function (item) {
                return item.id === id;
              });
            })
            .filter(Boolean);
        }
        function linkFor(id) {
          return config.links.find(function (link) {
            return link.id === id;
          });
        }
        function isLink(id) {
          return !!linkFor(id);
        }
        function orderedLinks() {
          return config.order
            .map(function (id) {
              return linkFor(id);
            })
            .filter(Boolean);
        }
        function orderedAll() {
          return config.order
            .map(function (id) {
              var entry = entries.find(function (item) {
                return item.id === id;
              });
              if (entry) return entry;
              var link = linkFor(id);
              return link ? Object.assign({ type: "link" }, link) : null;
            })
            .filter(Boolean);
        }
        function inMore() {
          return orderedAll().filter(function (item) {
            return item.type === "link" || config.more.includes(item.id);
          });
        }
        function isHiddenEntry(item) {
          return item.movable && (
            config.more.includes(item.id) ||
            (trigger && !triggerOwned && !targets.has(item.id))
          );
        }
        function inlineItems() {
          var items = entries.filter(isHiddenEntry).concat(
            orderedLinks().map(function (link) {
              return Object.assign({ type: "link" }, link);
            }),
          );
          function position(item) {
            var index = config.order.indexOf(item.id);
            return index < 0 ? MAX_ORDER_ITEMS : index;
          }
          return items.sort(function (first, second) {
            return position(first) - position(second);
          });
        }
        function officialRowIds(root) {
          var ids = new Set();
          if (!root) return ids;
          Array.from(root.querySelectorAll("button[aria-label]")).forEach(
            function (node) {
              if (node.closest("[data-lso-native-extra]")) return;
              if (!pinActionKind(node)) return;
              var item = entryFromActionLabel(
                String(node.getAttribute("aria-label") || ""),
              );
              if (item) ids.add(item.id);
            },
          );
          return ids;
        }
        function nativeMenuItems() {
          var officialIds = officialRowIds(nativeMenu);
          return inMore().filter(function (item) {
            if (item.type === "link") return true;
            return (
              targets.has(item.id) &&
              !officialIds.has(item.id)
            );
          });
        }
        function officialRows(root) {
          var rows = [];
          if (!root) return rows;
          Array.from(root.querySelectorAll("button[aria-label]")).forEach(
            function (pin) {
              if (pin.closest("[data-lso-native-extra]")) return;
              if (!pinActionKind(pin)) return;
              var item = entryFromActionLabel(
                String(pin.getAttribute("aria-label") || ""),
              );
              if (!item) return;
              var scope = pin.closest("span");
              if (scope) scope = scope.parentElement;
              while (
                scope &&
                scope !== root &&
                !scope.querySelector(
                  'button[role="menuitem"]:not([aria-label])',
                )
              )
                scope = scope.parentElement;
              if (!scope || scope === root) return;
              var row = Array.from(
                scope.querySelectorAll('button[role="menuitem"]'),
              ).find(function (node) {
                return node !== pin && !node.hasAttribute("aria-label");
              });
              if (!row || row === pin) return;
              rows.push({ id: item.id, row: row, pin: pin, wrap: scope });
            },
          );
          return rows;
        }
        function decorateOfficialRows(root) {
          var rows = officialRows(root);
          rows.forEach(function (item, index) {
            if (!templates.has(item.id) && !menuGlyphs.has(item.id)) {
              var glyph = item.row.querySelector("svg");
              if (glyph) menuGlyphs.set(item.id, glyph.cloneNode(true));
            }
            item.row.setAttribute("draggable", "false");
            item.row.setAttribute("data-lso-official-row", "");
            attr(item.row, "data-lso-entry", item.id);
            if (item.wrap) {
              if (!originalOfficialOrder.has(item.wrap))
                originalOfficialOrder.set(item.wrap, item.wrap.style.order);
              var position = config.order.indexOf(item.id),
                slot = position < 0 ? index : position;
              item.wrap.style.order = String(slot - MAX_ORDER_ITEMS - 1);
            }
          });
        }
        function restoreOfficialRows(root) {
          officialRows(root).forEach(function (item) {
            if (item.wrap && originalOfficialOrder.has(item.wrap))
              item.wrap.style.order =
                originalOfficialOrder.get(item.wrap);
          });
        }
        function pinActionKind(button) {
          var icon = button && button.querySelector("svg[data-icon]"),
            name = icon ? String(icon.getAttribute("data-icon") || "") : "",
            use = !name && button && button.querySelector("use"),
            href = use
              ? String(
                  use.getAttribute("href") ||
                    use.getAttribute("xlink:href") ||
                    "",
                )
              : "";
          if (!name) name = href;
          var tokens = String(name)
            .toLowerCase()
            .split(/[^a-z0-9]+/)
            .filter(Boolean);
          if (tokens.indexOf("unpin") >= 0) return "unpin";
          if (tokens.indexOf("pin") >= 0)
            return tokens.indexOf("fill") >= 0 ? "unpin" : "pin";
          var value = String(
            (button && button.getAttribute("aria-label")) || "",
          );
          if (
            /取消固定/.test(value) ||
            /(?:^|[^a-z])unpin(?:[^a-z]|$)/i.test(value)
          )
            return "unpin";
          if (
            /固定/.test(value) ||
            /(?:^|[^a-z])pin(?:[^a-z]|$)/i.test(value)
          )
            return "pin";
          return "";
        }
        function entryFromActionLabel(value) {
          var matches = entries.filter(function (item) {
            return value.indexOf(item.label) >= 0;
          });
          matches.sort(function (a, b) {
            return b.label.length - a.label.length;
          });
          return matches[0] || null;
        }
        function syncPinAction(event) {
          var button =
            event.target.closest &&
            event.target.closest("button[aria-label]");
          if (!button || button.classList.contains("lso-inline-pin")) return;
          if (!button.closest('nav[aria-label],[role="menu"]')) return;
          var kind = pinActionKind(button);
          if (!kind) return;
          var value = String(button.getAttribute("aria-label") || ""),
            item = entryFromActionLabel(value);
          if (!item) return;
          var id = item.id;
          if (kind === "unpin") {
            alignmentTried.add(id);
            if (!config.more.includes(id)) appendToMore(id);
          } else {
            alignmentTried.delete(id);
            if (config.more.includes(id))
              update({
                more: config.more.filter(function (entryId) {
                  return entryId !== id;
                }),
              });
          }
        }
        function findNav() {
          var navs = Array.from(
            document.querySelectorAll("nav[aria-label]"),
          );
          return (
            navs.find(function (node) {
              return /global panels|全局面板/i.test(
                node.getAttribute("aria-label") || "",
              );
            }) ||
            navs.find(function (node) {
              return !!node.querySelector(
                '[data-slot="sidebar.panellist"]',
              );
            }) ||
            navs.find(function (node) {
              return !!node.querySelector(
                'button[aria-haspopup="menu"]',
              );
            }) ||
            null
          );
        }
        function findOfficialMore() {
          if (!nav) return null;
          var expected = t("more").toLowerCase();
          return (
            Array.from(
              nav.querySelectorAll(
                'button[aria-haspopup="menu"]:not([data-lso-trigger])',
              ),
            ).find(function (node) {
              var label = String(
                node.getAttribute("aria-label") || "",
              ).toLowerCase();
              return (
                node === triggerBound ||
                label === expected ||
                /(?:^|[_ -])panelRow(?:$|[_ -])/.test(
                  String(node.className || ""),
                ) ||
                /更多|more/i.test(label)
              );
            }) || null
          );
        }
        function moreOpen() {
          if (expanded || (menu && !menu.hidden)) return true;
          return nativeMoreOpen();
        }
        function nativeMoreOpen() {
          return !!(trigger && !triggerOwned &&
            !trigger.hasAttribute("data-lso-inline-open") &&
            trigger.getAttribute("aria-expanded") === "true");
        }
        function sidebarFrame() {
          return (
            document.querySelector("[data-sidebar-collapsed]") ||
            document.querySelector("[data-lso-peek]")
          );
        }
        function sidebarColumn(frame) {
          var node = nav || findNav();
          while (node && node.parentElement && node.parentElement !== frame)
            node = node.parentElement;
          return node && node.parentElement === frame ? node : null;
        }
        function mainColumn(frame) {
          var sidebar = sidebarColumn(frame),
            next = sidebar && sidebar.nextElementSibling;
          if (
            next &&
            next.nodeType === 1 &&
            !next.hasAttribute("data-shell-bottom") &&
            !next.hasAttribute("data-shell-overlay") &&
            !next.hasAttribute("data-shell-leading")
          )
            return next;
          return (
            Array.from(frame.children).find(function (node) {
              return /(?:^|[_ -])center/i.test(
                String(node.className || ""),
              );
            }) || null
          );
        }
        function pageRoot(center) {
          var nodes = [center],
            index = 0;
          while (index < nodes.length && index < 40) {
            var node = nodes[index++];
            for (var i = 0; i < node.children.length; i++) {
              var child = node.children[i],
                rect = child.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) return child;
              nodes.push(child);
            }
          }
          return null;
        }
        function activeEntryId() {
          try {
            var info =
                activeCtx &&
                activeCtx.layout &&
                activeCtx.layout.panelInfo,
              active =
                info &&
                typeof info.getSnapshot === "function" &&
                info.getSnapshot().activePanelId;
            if (
              typeof active === "string" &&
              entries.some(function (item) {
                return item.id === active;
              })
            )
              return active;
          } catch (_) {}
          if (currentProxyId && targets.has(currentProxyId))
            return currentProxyId;
          var id = null;
          targets.forEach(function (_node, key) {
            if (!id && selected(key)) id = key;
          });
          return id;
        }
        function optimizeEnabledFor(id) {
          return (
            !!id && config.optimize && config.optimizePages[id] !== false
          );
        }
        function removePageFix() {
          if (!compat.appliedTo) return;
          compat.appliedTo.removeAttribute("data-lso-page-fix");
          [
            "--lso-page-fix-base-top",
            "--lso-page-fix-base-right",
            "--lso-page-fix-base-bottom",
            "--lso-page-fix-base-left",
            "--lso-page-fix-top",
            "--lso-page-fix-x",
            "--lso-page-fix-bottom",
          ].forEach(function (name) {
            compat.appliedTo.style.removeProperty(name);
          });
          compat.appliedTo = null;
          compat.root = null;
          compat.applied = false;
          compat.viewport = 0;
        }
        function stopCompat() {
          removePageFix();
          if (compat.observer) {
            compat.observer.disconnect();
            compat.observer = null;
          }
          compat.center = null;
          compat.appliedTo = null;
          compat.pageId = null;
          compat.retry = 0;
        }
        function observeCompat(center) {
          if (compat.center === center && compat.observer) return;
          if (compat.observer) compat.observer.disconnect();
          compat.center = center;
          compat.observer = new window.MutationObserver(function () {
            scheduleCompat();
          });
          compat.observer.observe(center, {
            childList: true,
            subtree: true,
          });
        }
        function contentMetrics(root, safeTop) {
          var nodes = [root],
            index = 0,
            inspected = 0,
            top = null,
            left = null,
            text = /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|SVG)$/;
          while (index < nodes.length && inspected < 2400) {
            var node = nodes[index++];
            inspected += 1;
            if (!node || node.nodeType !== 1 || text.test(node.tagName))
              continue;
            var style;
            try {
              style = window.getComputedStyle(node);
            } catch (_) {
              continue;
            }
            if (
              style.display === "none" ||
              style.visibility === "hidden" ||
              style.opacity === "0" ||
              style.position === "fixed"
            )
              continue;
            var rect = node.getBoundingClientRect();
            if (!rect || rect.width <= 0 || rect.height <= 0) continue;
            if (rect.top >= safeTop + 160) continue;
            var direct = false;
            for (var child = node.firstChild; child; child = child.nextSibling) {
              if (
                child.nodeType === 3 &&
                /\S/.test(child.nodeValue || "")
              ) {
                direct = true;
                break;
              }
            }
            if (
              direct ||
              (node.matches &&
                node.matches(
                  "h1,h2,h3,h4,h5,h6,button,input,select,textarea,[role=heading],[role=button],[role=tab],[role=switch]",
                ))
            ) {
              if (top === null || rect.top < top) {
                top = rect.top;
              }
              if (left === null || rect.left < left) left = rect.left;
            }
            for (var i = 0; i < node.children.length; i++)
              nodes.push(node.children[i]);
          }
          return { top: top, left: left };
        }
        function notifyCompatChange() {
          listeners.forEach(function (fn) {
            fn();
          });
        }
        function checkCompat() {
          if (!alive) return;
          if (!config.optimize) {
            stopCompat();
            return;
          }
          var frame = sidebarFrame();
          if (!frame) {
            stopCompat();
            return;
          }
          if (
            !frame.hasAttribute("data-sidebar-collapsed") &&
            !frame.hasAttribute("data-lso-peek")
          ) {
            stopCompat();
            return;
          }
          var id = activeEntryId();
          if (!optimizeEnabledFor(id)) {
            stopCompat();
            return;
          }
          if (compat.pageId !== id) compat.retry = 0;
          var center = mainColumn(frame),
            root = center && pageRoot(center);
          if (!center || !root) {
            stopCompat();
            return;
          }
          observeCompat(center);
          if (
            compat.appliedTo &&
            (compat.appliedTo !== center ||
              compat.root !== root ||
              compat.pageId !== id ||
              (compat.viewport && compat.viewport !== window.innerWidth))
          )
            removePageFix();
          if (
            compat.applied &&
            compat.appliedTo === center &&
            compat.root === root &&
            compat.pageId === id &&
            compat.viewport === window.innerWidth
          )
            return;
          var safeTop =
            parseFloat(
              window
                .getComputedStyle(document.documentElement)
                .getPropertyValue("--dsh-frame-top-clearance"),
            ) || 0;
          if (!(safeTop > 0)) {
            stopCompat();
            return;
          }
          var rect = root.getBoundingClientRect();
          if (!rect || rect.width <= 0 || rect.height <= 0) {
            if (compat.retry < 5) {
              compat.retry += 1;
              compat.pageId = id;
              scheduleCompat();
            }
            return;
          }
          var metrics = contentMetrics(root, safeTop);
          if (metrics.top === null) {
            if (compat.retry < 5) {
              compat.retry += 1;
              compat.pageId = id;
              scheduleCompat();
            }
            return;
          }
          compat.retry = 0;
          var needs = metrics.top < safeTop - 0.5,
            nextState = needs ? "needs" : "ok",
            changed = compat.seen[id] !== nextState;
          compat.seen[id] = nextState;
          compat.pageId = id;
          if (changed) notifyCompatChange();
          if (!needs) {
            removePageFix();
            return;
          }
          var centerRect = center.getBoundingClientRect(),
            computed = window.getComputedStyle(center),
            contentTop = metrics.top - centerRect.top,
            contentLeft =
              metrics.left === null ? 0 : metrics.left - centerRect.left,
            targetTop = safeTop + 28,
            targetSide = Math.max(
              24,
              Math.min(48, window.innerWidth * 0.04),
            ),
            extraTop = Math.max(0, targetTop - contentTop),
            extraSide = Math.max(0, targetSide - contentLeft);
          center.style.setProperty(
            "--lso-page-fix-base-top",
            (parseFloat(computed.paddingTop) || 0) + "px",
          );
          center.style.setProperty(
            "--lso-page-fix-base-right",
            (parseFloat(computed.paddingRight) || 0) + "px",
          );
          center.style.setProperty(
            "--lso-page-fix-base-bottom",
            (parseFloat(computed.paddingBottom) || 0) + "px",
          );
          center.style.setProperty(
            "--lso-page-fix-base-left",
            (parseFloat(computed.paddingLeft) || 0) + "px",
          );
          center.style.setProperty("--lso-page-fix-top", extraTop + "px");
          center.style.setProperty("--lso-page-fix-x", extraSide + "px");
          center.style.setProperty("--lso-page-fix-bottom", "48px");
          attr(center, "data-lso-page-fix", "true");
          compat.appliedTo = center;
          compat.root = root;
          compat.applied = true;
          compat.viewport = window.innerWidth;
        }
        function scheduleCompat() {
          if (!alive || compat.frame !== null) return;
          var run = function () {
            compat.frame = null;
            checkCompat();
          };
          compat.frame =
            typeof window.requestAnimationFrame === "function"
              ? window.requestAnimationFrame(run)
              : window.setTimeout(run, 0);
        }
        function openSidebarLabel() {
          try {
            return ctx.locale.bind("sidebar")("toggle.open");
          } catch (_) {}
          try {
            return ctx.locale.get("sidebar", "toggle.open");
          } catch (_) {}
          return "打开侧边栏";
        }
        function isOpenSidebarToggle(node) {
          if (!node || node.tagName !== "BUTTON") return false;
          var label = String(node.getAttribute("aria-label") || "");
          return (
            label === openSidebarLabel() ||
            /打开侧边栏|open sidebar/i.test(label)
          );
        }
        function hostToggleSidebar() {
          try {
            if (
              ctx.layout &&
              typeof ctx.layout.toggleSidebar === "function"
            ) {
              ctx.layout.toggleSidebar();
              return true;
            }
          } catch (_) {}
          return false;
        }
        function clearPeekOpen() {
          if (!peek.openTimer) return;
          window.clearTimeout(peek.openTimer);
          peek.openTimer = null;
        }
        function clearPeekClose() {
          if (!peek.closeTimer) return;
          window.clearTimeout(peek.closeTimer);
          peek.closeTimer = null;
        }
        function peekInside(node) {
          return !!(
            (peek.column && node && peek.column.contains(node)) ||
            (peek.trigger && node && peek.trigger.contains(node)) ||
            (peek.leadingClone &&
              node &&
              peek.leadingClone.contains(node)) ||
            (node &&
              node.closest &&
              node.closest(
                ".lso-menu,.lso-native-extra,[data-lso-flyout]",
              ))
          );
        }
        function positionPeek() {
          if (
            !peek.active ||
            !peek.frame ||
            !peek.column ||
            !peek.column.isConnected
          )
            return;
          var frameRect = peek.frame.getBoundingClientRect(),
            width = Math.max(0, Math.min(
              peek.naturalWidth > 0 ? peek.naturalWidth : 280,
              frameRect.width || window.innerWidth,
            ));
          peek.frame.style.setProperty("--lso-peek-width", width + "px");
          try {
            var surface = window.getComputedStyle(peek.column);
            if (
              surface.backgroundColor &&
              surface.backgroundColor !== "rgba(0, 0, 0, 0)"
            )
              peek.frame.style.setProperty(
                "--lso-peek-bg",
                surface.backgroundColor,
              );
            if (surface.backdropFilter && surface.backdropFilter !== "none")
              peek.frame.style.setProperty(
                "--lso-peek-blur",
                surface.backdropFilter,
              );
          } catch (_) {}
        }
        function schedulePeek(trigger, immediate) {
          if (!config.peek || peek.active || peek.pinned) return;
          if (!sidebarFrame()) return;
          clearPeekOpen();
          if (immediate) {
            openPeek(trigger);
            return;
          }
          peek.openTimer = window.setTimeout(function () {
            peek.openTimer = null;
            openPeek(trigger);
          }, 180);
        }
        function removeRailClone() {
          if (peek.railClone) {
            peek.railClone.remove();
            peek.railClone = null;
          }
          peek.railSnapshot = null;
          peek.railRect = null;
          peek.railBg = "";
        }
        function captureRailSnapshot(column, rect) {
          removeRailClone();
          var bg = "";
          for (
            var node = column;
            node && node !== document.documentElement;
            node = node.parentElement
          ) {
            var color = window.getComputedStyle(node).backgroundColor;
            if (
              color &&
              color !== "rgba(0, 0, 0, 0)" &&
              color !== "transparent"
            ) {
              bg = color;
              break;
            }
          }
          var clone = column.cloneNode(true);
          clone.removeAttribute("id");
          Array.from(clone.querySelectorAll("[id]")).forEach(function (node) {
            node.removeAttribute("id");
          });
          peek.railSnapshot = clone;
          peek.railRect = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
          };
          peek.railBg = bg;
        }
        function mountRailClone() {
          if (peek.railClone || !peek.railSnapshot || !peek.railRect) return;
          var node = peek.railSnapshot,
            rect = peek.railRect;
          node.setAttribute("data-lso-peek-clone", "");
          node.setAttribute("aria-hidden", "true");
          node.setAttribute("inert", "");
          node.style.position = "fixed";
          node.style.left = rect.left + "px";
          node.style.top = rect.top + "px";
          node.style.width = rect.width + "px";
          node.style.height = rect.height + "px";
          node.style.margin = "0";
          node.style.zIndex = "18";
          node.style.pointerEvents = "none";
          if (peek.railBg) node.style.background = peek.railBg;
          document.body.appendChild(node);
          peek.railClone = node;
        }
        function dropRailClone() {
          var clone = peek.railClone,
            width = peek.railRect ? peek.railRect.width : 0;
          if (!clone) return;
          var tries = 0,
            step = function () {
              if (!clone.isConnected) {
                if (peek.railClone === clone) peek.railClone = null;
                return;
              }
              var root = document.querySelector(
                '[data-sidebar-collapsed] [data-slot="sidebar"] > div',
              );
              var rootWidth = root ? root.getBoundingClientRect().width : 0;
              if (
                !root ||
                rootWidth === 0 ||
                (rootWidth > 0 && rootWidth <= width + 2) ||
                tries >= 40
              ) {
                clone.remove();
                if (peek.railClone === clone) {
                  peek.railClone = null;
                  peek.railSnapshot = null;
                  peek.railRect = null;
                  peek.railBg = "";
                }
                return;
              }
              tries += 1;
              if (typeof window.requestAnimationFrame === "function")
                window.requestAnimationFrame(step);
              else window.setTimeout(step, 16);
            };
          if (typeof window.requestAnimationFrame === "function")
            window.requestAnimationFrame(step);
          else window.setTimeout(step, 16);
        }
        function openPeek(trigger) {
          if (!alive || !config.peek || peek.active || peek.pinned) return;
          removeRailClone();
          var frame = sidebarFrame();
          if (!frame || !frame.hasAttribute("data-sidebar-collapsed")) return;
          var column = sidebarColumn(frame);
          if (!column) return;
          var rect = trigger.getBoundingClientRect();
          if (!rect || rect.width <= 0 || rect.height <= 0) return;
          var railRect = column.getBoundingClientRect(),
            collapsedGrid =
              frame.style.getPropertyValue("grid-template-columns") ||
              window.getComputedStyle(frame).gridTemplateColumns ||
              "",
            collapsedTrack = collapsedGrid.trim().split(/\s+/)[0] || "",
            railWidth = collapsedTrack
              ? parseFloat(collapsedTrack) || 0
              : Math.round(railRect.width || 0) || 56,
            grid = collapsedGrid.trim().slice(collapsedTrack.length).trim()
              ? collapsedGrid.trim()
              : (collapsedTrack || railWidth + "px") + " minmax(0, 1fr) 0px";
          if (railWidth > 0) captureRailSnapshot(column, railRect);
          peek.active = true;
          peek.pinned = false;
          peek.owned = true;
          peek.pointerInside = true;
          peek.holdClosed = false;
          peek.frame = frame;
          peek.drawer = frame.hasAttribute("data-sidebar-drawer");
          peek.column = column;
          peek.trigger = trigger;
          peek.leadingClearance = window
            .getComputedStyle(frame)
            .getPropertyValue("--dsh-frame-leading-clearance")
            .trim();
          peek.leadingClearanceInline =
            frame.style.getPropertyValue("--dsh-frame-leading-clearance") ||
            null;
          peek.leadingClearanceApplied = false;
          var leading = document.querySelector("[data-shell-leading]"),
            leadingRect = leading && leading.getBoundingClientRect(),
            leadingButtons = leading
              ? Array.from(leading.querySelectorAll("button"))
              : [],
            leadingOpenButton = leadingButtons.find(isOpenSidebarToggle),
            leadingNewButton = leadingButtons.find(function (button) {
              return button !== leadingOpenButton;
            });
          var captureOpen = leadingOpenButton,
            captureNew = leadingNewButton,
            captureRect =
              leadingRect && leadingOpenButton && leadingNewButton
                ? {
                    left: leadingRect.left,
                    top: leadingRect.top,
                    width: leadingRect.width,
                    height: leadingRect.height,
                  }
                : null,
            captureClass = leading ? leading.className : "";
          if (!captureRect) {
            var railRect = trigger.getBoundingClientRect();
            if (railRect && railRect.width > 0 && railRect.height > 0) {
              captureOpen = trigger;
              captureNew = null;
              captureRect = {
                left: railRect.left,
                top: railRect.top,
                width: railRect.width,
                height: railRect.height,
              };
              captureClass = "";
            }
          }
          peek.leadingCapture =
            captureRect && captureOpen
              ? {
                  className: captureClass,
                  rect: captureRect,
                  openHTML: captureOpen.outerHTML,
                  newHTML: captureNew ? captureNew.outerHTML : "",
                }
              : null;
          frame.style.setProperty("--lso-peek-grid", grid);
          frame.setAttribute("data-lso-peek-pending", "");
          column.setAttribute("data-lso-peek-column", "");
          peek.columnDragExclude = column.getAttribute("data-window-drag-exclude");
          if (peek.leadingClearance) {
            frame.style.setProperty("--dsh-frame-leading-clearance", peek.leadingClearance);
            peek.leadingClearanceApplied = true;
          }
          if (!hostToggleSidebar()) {
            peek.active = false;
            trigger.click();
            peek.active = true;
          }
          var reveal = function () {
            peek.revealFrame = null;
            if (!peek.active || peek.frame !== frame) return;
            if (!frame.isConnected || !column.isConnected) {
              closePeek(false, true);
              return;
            }
            if (frame.hasAttribute("data-sidebar-collapsed")) {
              if (peek.revealTries < 8) {
                peek.revealTries += 1;
                peek.revealFrame =
                  typeof window.requestAnimationFrame === "function"
                    ? window.requestAnimationFrame(reveal)
                    : window.setTimeout(reveal, 16);
                return;
              }
              closePeek(true, true);
              return;
            }
          var naturalWidth = Math.max(
            column.scrollWidth || 0,
            column.firstElementChild && column.firstElementChild.scrollWidth || 0,
          );
          if (naturalWidth >= 180)
            peek.naturalWidth = Math.round(naturalWidth);
          frame.setAttribute("data-lso-peek", "true");
          frame.removeAttribute("data-lso-peek-pending");
          column.setAttribute("data-window-drag-exclude", "");
          if (peek.leadingCapture) {
            var capturedLeading = peek.leadingCapture;
            var leadingClone = document.createElement("div");
            leadingClone.className = capturedLeading.className;
            leadingClone.setAttribute("data-lso-peek-leading", "");
            leadingClone.setAttribute("data-window-drag-exclude", "");
            leadingClone.style.position = "fixed";
            leadingClone.style.left = capturedLeading.rect.left + "px";
            leadingClone.style.top = capturedLeading.rect.top + "px";
            leadingClone.style.width = capturedLeading.rect.width + "px";
            leadingClone.style.height = capturedLeading.rect.height + "px";
            leadingClone.style.display = "flex";
            leadingClone.style.alignItems = "center";
            leadingClone.style.gap = "8px";
            leadingClone.style.zIndex = "21";
            leadingClone.style.pointerEvents = "auto";
            leadingClone.innerHTML =
              capturedLeading.openHTML + capturedLeading.newHTML;
            Array.from(leadingClone.querySelectorAll("button")).forEach(
              function (button) {
                button.addEventListener("click", function (event) {
                  event.preventDefault();
                  event.stopPropagation();
                  if (isOpenSidebarToggle(button)) {
                    pinPeek();
                    return;
                  }
                  var target = Array.from(
                    peek.column
                      ? peek.column.querySelectorAll("button[aria-label]")
                      : [],
                  ).find(function (node) {
                    return /新建会话|new session/i.test(
                      node.getAttribute("aria-label") || "",
                    );
                  });
                  if (target) target.click();
                });
              },
            );
            document.body.appendChild(leadingClone);
            peek.leadingClone = leadingClone;
          }
          var toggle = Array.from(
            column.querySelectorAll("[data-window-drag] button[aria-label]"),
          ).find(function (button) {
            return button.hasAttribute("data-sidebar-toggle") ||
              /收起侧边栏|collapse sidebar/i.test(button.getAttribute("aria-label") || "");
          });
          if (toggle && peek.leadingClone) {
            toggle.setAttribute("data-lso-peek-hidden", "");
            peek.hiddenStrip = toggle;
            if (toggle.closest('[class*="logoRow"]')) {
              var clearance = peek.leadingClone.getBoundingClientRect().bottom -
                frame.getBoundingClientRect().top;
              frame.style.setProperty("--lso-peek-header-offset", Math.max(0, clearance) + "px");
            }
          }
          positionPeek();
          playPeekIn();
          var enter = function () {
            peek.pointerInside = true;
            clearPeekClose();
          };
          var leave = function () {
            peek.pointerInside = false;
            schedulePeekClose();
          };
          peek.panelEnter = enter;
          peek.panelLeave = leave;
          column.addEventListener("pointerenter", enter);
          column.addEventListener("pointerleave", leave);
          scheduleCompat();
          window.requestAnimationFrame(function () {
            positionPeek();
            window.requestAnimationFrame(positionPeek);
          });
          };
          peek.revealTries = 0;
          peek.revealFrame =
            typeof window.requestAnimationFrame === "function"
              ? window.requestAnimationFrame(reveal)
              : window.setTimeout(reveal, 16);
        }
        function schedulePeekClose() {
          if (!peek.active || peek.pinned) return;
          clearPeekClose();
          peek.closeTimer = window.setTimeout(function () {
            peek.closeTimer = null;
            if (!peek.pointerInside) closePeek(true);
          }, 160);
        }
        function removePeekVisuals() {
          if (!peek.frame) return;
          clearPeekMotion();
          peek.frame.removeAttribute("data-lso-peek-restoring");
          peek.frame.removeAttribute("data-lso-peek-pending");
          if (peek.leadingClearanceApplied) {
            if (peek.leadingClearanceInline !== null)
              peek.frame.style.setProperty(
                "--dsh-frame-leading-clearance",
                peek.leadingClearanceInline,
              );
            else
              peek.frame.style.removeProperty(
                "--dsh-frame-leading-clearance",
              );
          }
          peek.leadingClearance = "";
          peek.leadingClearanceInline = null;
          peek.leadingClearanceApplied = false;
          peek.frame.removeAttribute("data-lso-peek");
          peek.frame.style.removeProperty("--lso-peek-grid");
          peek.frame.style.removeProperty("--lso-peek-width");
          peek.frame.style.removeProperty("--lso-peek-header-offset");
          peek.frame.style.removeProperty("--lso-peek-bg");
          peek.frame.style.removeProperty("--lso-peek-blur");
          if (peek.column) {
            peek.column.removeAttribute("data-lso-peek-column");
            peek.column.removeAttribute("data-lso-peek-closing");
            if (peek.columnDragExclude === null)
              peek.column.removeAttribute("data-window-drag-exclude");
            else if (peek.columnDragExclude !== undefined)
              peek.column.setAttribute(
                "data-window-drag-exclude",
                peek.columnDragExclude,
              );
            peek.columnDragExclude = undefined;
            if (peek.panelEnter)
              peek.column.removeEventListener("pointerenter", peek.panelEnter);
            if (peek.panelLeave)
              peek.column.removeEventListener("pointerleave", peek.panelLeave);
          }
          if (peek.hiddenStrip) {
            peek.hiddenStrip.removeAttribute("data-lso-peek-hidden");
            peek.hiddenStrip = null;
          }
          if (peek.leadingClone) {
            peek.leadingClone.remove();
            peek.leadingClone = null;
          }
          peek.leadingCapture = null;
          scheduleCompat();
        }
        function cancelPeekReveal() {
          if (peek.revealFrame !== null) {
            if (typeof window.cancelAnimationFrame === "function")
              window.cancelAnimationFrame(peek.revealFrame);
            else window.clearTimeout(peek.revealFrame);
          }
          peek.revealFrame = null;
          peek.revealTries = 0;
        }
        function peekAnimationAllowed(column) {
          return !!(
            column &&
            typeof column.animate === "function" &&
            (!window.matchMedia ||
              !window.matchMedia("(prefers-reduced-motion: reduce)").matches)
          );
        }
        function cancelPeekAnimation(animation) {
          if (!animation) return;
          try {
            animation.cancel();
          } catch (_) {}
        }
        function clearPeekMotion() {
          if (peek.finishTimer) {
            window.clearTimeout(peek.finishTimer);
            peek.finishTimer = null;
          }
          cancelPeekAnimation(peek.openAnimation);
          cancelPeekAnimation(peek.closeAnimation);
          peek.openAnimation = null;
          peek.closeAnimation = null;
          peek.closing = false;
        }
        function playPeekIn() {
          if (!peekAnimationAllowed(peek.column)) return;
          cancelPeekAnimation(peek.openAnimation);
          var animation = peek.column.animate(
            [
              { translate: "-100% 0px" },
              { translate: "0px 0px" },
            ],
            {
              duration: 180,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            },
          );
          peek.openAnimation = animation;
          animation.finished.then(
            function () {
              if (peek.openAnimation === animation)
                peek.openAnimation = null;
            },
            function () {},
          );
        }
        function clearPeekState() {
          peek.active = false;
          peek.pinned = false;
          peek.owned = false;
          peek.pointerInside = false;
          peek.frame = null;
          peek.column = null;
          peek.trigger = null;
          peek.hiddenStrip = null;
          peek.leadingClone = null;
          peek.naturalWidth = 0;
        }
        function collapseHostSidebar(frame) {
          if (hostToggleSidebar()) return true;
          var toggle = Array.from(
            frame.querySelectorAll("button[aria-label]"),
          ).find(function (node) {
            return /收起侧边栏|collapse sidebar/i.test(
              node.getAttribute("aria-label") || "",
            );
          });
          if (!toggle) return false;
          toggle.click();
          return true;
        }
        function finishClosePeek(restore) {
          if (!peek.active) return;
          var frame = peek.frame,
            shouldRestore = restore !== false && peek.owned && !peek.pinned,
            needsCollapse =
              shouldRestore &&
              frame &&
              frame.isConnected &&
              !frame.hasAttribute("data-sidebar-collapsed");
          if (!needsCollapse) {
            removePeekVisuals();
            clearPeekState();
            dropRailClone();
            return;
          }
          frame.setAttribute("data-lso-peek-restoring", "");
          if (!collapseHostSidebar(frame)) {
            frame.removeAttribute("data-lso-peek-restoring");
            removePeekVisuals();
            clearPeekState();
            dropRailClone();
            return;
          }
          var settle = function (tries) {
            if (!peek.active || peek.frame !== frame) return;
            if (
              frame.hasAttribute("data-sidebar-collapsed") ||
              !frame.isConnected ||
              tries >= 12
            ) {
              removePeekVisuals();
              clearPeekState();
              dropRailClone();
              return;
            }
            if (typeof window.requestAnimationFrame === "function")
              window.requestAnimationFrame(function () {
                settle(tries + 1);
              });
            else
              window.setTimeout(function () {
                settle(tries + 1);
              }, 16);
          };
          settle(0);
        }
        function closePeek(restore, immediate) {
          if (!peek.active) return;
          if (peek.closing) {
            if (immediate) finishClosePeek(restore);
            return;
          }
          clearPeekOpen();
          clearPeekClose();
          cancelPeekReveal();
          if (restore !== false) mountRailClone();
          if (immediate || !peekAnimationAllowed(peek.column)) {
            finishClosePeek(restore);
            return;
          }
          peek.closing = true;
          peek.column.setAttribute("data-lso-peek-closing", "");
          var start = window.getComputedStyle(peek.column).translate;
          cancelPeekAnimation(peek.openAnimation);
          peek.openAnimation = null;
          var animation = peek.column.animate(
            [
              { translate: start && start !== "none" ? start : "0px 0px" },
              { translate: "-100% 0px" },
            ],
            {
              duration: 120,
              easing: "cubic-bezier(0.4, 0, 1, 1)",
              fill: "forwards",
            },
          );
          peek.closeAnimation = animation;
          var complete = function () {
            if (!peek.closing) return;
            if (peek.finishTimer) {
              window.clearTimeout(peek.finishTimer);
              peek.finishTimer = null;
            }
            finishClosePeek(restore);
          };
          animation.finished.then(complete, function () {});
          peek.finishTimer = window.setTimeout(complete, 180);
        }
        function pinPeek() {
          if (!peek.active || peek.closing) return;
          clearPeekOpen();
          clearPeekClose();
          cancelPeekReveal();
          removePeekVisuals();
          peek.active = false;
          peek.pinned = false;
          peek.owned = false;
          peek.pointerInside = false;
          peek.frame = null;
          peek.column = null;
          peek.trigger = null;
          peek.hiddenStrip = null;
          peek.leadingClone = null;
          peek.naturalWidth = 0;
        }
        function peekPointerOver(event) {
          var target = event.target;
          if (!target || !target.closest) return;
          var button = target.closest("button");
          if (button && isOpenSidebarToggle(button)) {
            if (peek.holdClosed && !peek.active) return;
            if (peek.active) clearPeekClose();
            else schedulePeek(button, false);
            return;
          }
          if (peek.active && peekInside(target)) clearPeekClose();
        }
        function peekPointerOut(event) {
          if (peek.active || !peek.openTimer) return;
          var target = event.target;
          if (!target || !target.closest) return;
          var button = target.closest("button");
          if (
            button &&
            isOpenSidebarToggle(button) &&
            !peekInside(event.relatedTarget)
          )
            clearPeekOpen();
        }
        function peekPointerMove(event) {
          if (peek.holdClosed && !peek.active) {
            var opener = document.querySelector(
                "button[data-sidebar-opener]",
              ),
              openerRect = opener && opener.getBoundingClientRect();
            if (openerRect && openerRect.width > 0) {
              if (
                event.clientX < openerRect.left - 2 ||
                event.clientX > openerRect.right + 2 ||
                event.clientY < openerRect.top - 2 ||
                event.clientY > openerRect.bottom + 2
              )
                peek.holdClosed = false;
            } else {
              var held =
                event.target && event.target.closest
                  ? event.target.closest("button")
                  : null;
              if (!held || !isOpenSidebarToggle(held))
                peek.holdClosed = false;
            }
          }
          if (!peek.active) return;
          if (peekInside(event.target)) {
            peek.pointerInside = true;
            clearPeekClose();
          } else {
            peek.pointerInside = false;
            schedulePeekClose();
          }
        }
        function peekFocusIn(event) {
          if (peek.holdClosed && !peek.active) return;
          if (isOpenSidebarToggle(event.target) && !peek.active &&
              !event.target.hasAttribute("data-dsh-automatic-focus"))
            schedulePeek(event.target, true);
          else if (peek.active && peekInside(event.target))
            clearPeekClose();
        }
        function peekFocusOut(event) {
          if (!peek.active) {
            if (peek.holdClosed && !peekInside(event.relatedTarget))
              peek.holdClosed = false;
            return;
          }
          if (peek.pointerInside) return;
          if (!peekInside(event.relatedTarget)) {
            peek.pointerInside = false;
            schedulePeekClose();
          }
        }
        function peekPointerDown(event) {
          if (!peek.active) return;
          if (peek.leadingClone && peek.leadingClone.contains(event.target))
            return;
          if (peek.column && peek.column.contains(event.target)) return;
          if (
            event.target.closest &&
            isOpenSidebarToggle(event.target.closest("button"))
          ) {
            event.preventDefault();
            event.stopPropagation();
            pinPeek();
            return;
          }
          if (event.target.closest &&
              event.target.closest(".lso-menu,.lso-native-extra,[role=menu]"))
            return;
          closePeek(true);
        }
        function peekClick(event) {
          if (!peek.active) return;
          if (
            event.target.closest &&
            isOpenSidebarToggle(event.target.closest("button"))
          ) {
            event.preventDefault();
            event.stopPropagation();
            pinPeek();
            return;
          }
          if (peek.leadingClone && peek.leadingClone.contains(event.target))
            return;
          if (peek.column && peek.column.contains(event.target)) return;
          var menuSurface =
            event.target.closest &&
            event.target.closest(
              ".lso-menu,.lso-native-extra,[role=menu]",
            );
          if (menuSurface) {
            if (menuSurface.closest(".lso-menu:not([data-lso-inline])")) {
              window.setTimeout(function () {
                close();
              }, 0);
            }
            return;
          }
          closePeek(true);
        }
        function peekKeydown(event) {
          if (!peek.active) return;
          if (event.key === "Escape") {
            if (nativeMenu && nativeMenu.contains(event.target)) return;
            event.preventDefault();
            event.stopPropagation();
            peek.holdClosed = true;
            closePeek(true);
            window.setTimeout(function () {
              var lead = document.querySelector("[data-shell-leading] button");
              if (lead && typeof lead.focus === "function")
                lead.focus({ preventScroll: true });
            }, 0);
            return;
          }
          if (
            (event.metaKey || event.ctrlKey) &&
            String(event.key).toLowerCase() === "b"
          ) {
            event.preventDefault();
            event.stopPropagation();
            peek.holdClosed = true;
            closePeek(true);
          }
        }
        function peekResize() {
          if (!peek.active) return;
          if (!peek.frame || !peek.column || !peek.column.isConnected)
            closePeek(true, true);
          else if (peek.drawer !== peek.frame.hasAttribute("data-sidebar-drawer"))
            closePeek(true, true);
          else positionPeek();
          scheduleCompat();
        }
        function peekBlur() {
          if (peek.active) closePeek(true);
        }
        function cloneIds(root) {
          var nodes = [root].concat(Array.from(root.querySelectorAll("*"))),
            ids = new Map(),
            prefix = "lso-" + ++cloneNo + "-";
          nodes.forEach(function (n) {
            if (n.id) ids.set(n.id, prefix + n.id);
          });
          nodes.forEach(function (n) {
            Array.from(n.attributes || []).forEach(function (a) {
              var next = a.value.replace(
                /url\((["']?)#([^)"']+)\1\)/g,
                function (m, q, id) {
                  return ids.has(id)
                    ? "url(" + q + "#" + ids.get(id) + q + ")"
                    : m;
                },
              );
              if (
                (a.name === "href" || a.name === "xlink:href") &&
                next[0] === "#" &&
                ids.has(next.slice(1))
              )
                next = "#" + ids.get(next.slice(1));
              if (/^aria-(labelledby|describedby|controls|owns)$/.test(a.name))
                next = next
                  .split(/\s+/)
                  .map(function (id) {
                    return ids.get(id) || id;
                  })
                  .join(" ");
              if (next !== a.value) n.setAttribute(a.name, next);
            });
            if (n.id && ids.has(n.id)) n.id = ids.get(n.id);
          });
        }
        function snapshotRow(node) {
          var clone = node.cloneNode(true);
          clone.removeAttribute("id");
          clone.removeAttribute("aria-current");
          clone.removeAttribute("aria-selected");
          clone.removeAttribute("data-state");
          clone.removeAttribute("data-lso-entry");
          clone.removeAttribute("data-lso-dragging");
          clone.removeAttribute("data-lso-target");
          clone.removeAttribute("data-lso-before");
          clone.removeAttribute("data-lso-after");
          clone.removeAttribute("draggable");
          cloneIds(clone);
          return clone;
        }
        var APPEARANCE_PROPS = [
            "align-items",
            "justify-content",
            "gap",
            "flex",
            "min-width",
            "min-height",
            "height",
            "padding",
            "border",
            "border-radius",
            "background",
            "background-color",
            "color",
            "font",
            "font-family",
            "font-size",
            "font-weight",
            "line-height",
            "letter-spacing",
            "text-align",
            "white-space",
            "box-sizing",
            "overflow",
          ];
        function captureAppearance(source) {
          var values = {},
            style = window.getComputedStyle(source);
          APPEARANCE_PROPS.forEach(function (p) {
            var v = style.getPropertyValue(p);
            if (v) values[p] = v;
          });
          return values;
        }
        function applyAppearance(values, clone) {
          Object.keys(values || {}).forEach(function (p) {
            clone.style.setProperty(p, values[p]);
          });
          clone.style.removeProperty("display");
          clone.style.setProperty("width", "100%", "important");
          clone.style.setProperty("min-width", "0", "important");
          clone.style.setProperty("max-width", "100%", "important");
          clone.style.setProperty("box-sizing", "border-box", "important");
          clone.style.setProperty("flex", "0 0 auto", "important");
          clone.style.setProperty("margin", "0", "important");
        }
        function copyAppearance(source, clone) {
          applyAppearance(captureAppearance(source), clone);
        }
        function syncRowLabel(node, text, marker) {
          var attribute = marker || "data-lso-item-label";
          Array.from(node.children).forEach(function (child) {
            if (
              child.hasAttribute(attribute) ||
              child.classList.contains("lso-item-label") ||
              /panelGlyph/i.test(String(child.className || ""))
            )
              return;
            if (
              /panelTitle/i.test(String(child.className || "")) ||
              (!child.querySelector("svg") &&
                String(child.textContent || "").trim())
            )
              child.remove();
          });
          Array.from(node.childNodes).forEach(function (child) {
            if (
              child.nodeType === 3 &&
              String(child.nodeValue || "").trim()
            )
              child.remove();
          });
          var own = node.querySelector("[" + attribute + "]");
          if (!own) {
            own = el("span", "lso-item-label", text);
            own.setAttribute(attribute, "");
            node.appendChild(own);
          }
          if (own.textContent !== text) own.textContent = text;
          return own;
        }
        function drawItems(container) {
          var inline = container.hasAttribute("data-lso-inline"),
            values = inline ? inlineItems() : container === nativeExtra ? nativeMenuItems() : inMore(),
            signature = values
              .map(function (item) {
                var node = targets.get(item.id);
                return [
                  item.id,
                  item.label,
                  item.url || "",
                  config.shortcuts[item.id] || "",
                  node ? node.getAttribute("aria-current") || "" : "link",
                  node ? node.className : "",
                  String(selected(item.id)),
                ].join(":");
              })
              .join("|");
          if (inline) signature = "inline|" + signature;
          if (container.getAttribute("data-signature") === signature) return;
          container.replaceChildren();
          values.forEach(function (item, index) {
            var node;
            if (item.type === "link") {
              node = el("button", "lso-item lso-custom");
              node.type = "button";
              node.draggable = false;
              node.setAttribute("aria-label", item.label);
              node.setAttribute("data-lso-entry", item.id);
              node.setAttribute("data-lso-link", "true");
              if (container === nativeExtra) {
                node.setAttribute("role", "menuitem");
                node.setAttribute("tabindex", "-1");
              }
              node.appendChild(svg("link"));
              node.appendChild(el("span", "lso-item-label", item.label));
              node.addEventListener("click", function () {
                if (!inline) dismissMenuSurface();
                activate(item.id);
              });
            } else {
              var target = targets.get(item.id);
              if (!target && !inline) return;
              node = target ? target.cloneNode(true) : el("button");
              node.type = "button";
              if (!target) {
                var template = templates.get(item.id),
                  icon = (template && template.node.querySelector("svg")) || menuGlyphs.get(item.id);
                node.appendChild(icon ? icon.cloneNode(true) : svg("grid"));
              }
              node.removeAttribute("id");
              node.classList.add("lso-item");
              node.removeAttribute("data-lso-more");
              node.setAttribute("data-lso-entry", item.id);
              node.draggable = false;
              if (inline) {
                node.setAttribute("aria-label", item.label);
                node.setAttribute("aria-current", selected(item.id) ? "page" : "false");
              } else if (container === nativeExtra) {
                node.setAttribute("role", "menuitem");
                node.setAttribute("tabindex", "-1");
              }
              attr(node, "data-lso-selected", String(selected(item.id)));
              if (target && !inline) copyAppearance(target, node);
              syncRowLabel(node, item.label, "data-lso-item-label");
              cloneIds(node);
              node.addEventListener("click", function (event) {
                var hit =
                  event.target.closest &&
                  event.target.closest("button,a,input");
                if (hit && hit !== node) return;
                event.preventDefault();
                if (!inline) dismissMenuSurface();
                activate(item.id);
              });
            }
            if (config.shortcuts[item.id])
              node.appendChild(
                el("span", "lso-shortcut", pretty(config.shortcuts[item.id])),
              );
            if (inline) {
              node.style.removeProperty("display");
              node.style.removeProperty("order");
            } else {
              node.style.order =
                container === nativeExtra
                  ? String(
                      (config.order.indexOf(item.id) < 0
                        ? index
                        : config.order.indexOf(item.id)) - MAX_ORDER_ITEMS - 1,
                    )
                  : String(index);
            }
            if (inline && item.type !== "link") {
              var row = el("div", "lso-inline-row"),
                pin = el("button", "lso-inline-pin"),
                pinLabel = t("pinToSidebar") + " " + item.label;
              pin.type = "button";
              pin.title = pinLabel;
              pin.setAttribute("aria-label", pinLabel);
              pin.appendChild(svg("pin"));
              pin.addEventListener("click", function () {
                if (targets.has(item.id)) toggleMore(item.id);
                else pinEntry(item.id);
              });
              row.append(node, pin);
              container.appendChild(row);
            } else {
              container.appendChild(node);
            }
          });
          container.setAttribute("data-signature", signature);
        }
        function renderMoreAdditions(props) {
          var rerender = React.useState(0)[1];
          React.useEffect(function () {
            var listener = function () {
              rerender(function (revision) { return revision + 1; });
            };
            listeners.add(listener);
            return function () { listeners.delete(listener); };
          }, []);
          var ref = React.useCallback(function (node) {
            slotExtra = node;
            scheduleNativeMenu();
          }, []);
          React.useLayoutEffect(function () {
            if (typeof props.onPinnedChange !== "function" || !Array.isArray(props.entries)) return;
            var ids = new Set(props.entries.map(function (entry) { return entry.id; }));
            pinHost = { nav: nav, ids: ids, set: props.onPinnedChange };
            var restored = [];
            pinRequests.forEach(function (id) {
              if (!ids.has(id)) return;
              pinRequests.delete(id);
              alignmentTried.delete(id);
              props.onPinnedChange(id, true);
              restored.push(id);
            });
            if (restored.length) {
              props.onDismiss();
              update({ more: config.more.filter(function (id) { return !restored.includes(id); }) });
            }
          }, [props.entries, props.onPinnedChange]);
          if (!Array.isArray(props.entries) || typeof props.onDismiss !== "function") return null;
          var hostEntries = new Map(props.entries.map(function (item) { return [item.id, item]; }));
          var rows = inMore().filter(function (item) {
            var host = hostEntries.get(item.id);
            return item.type === "link" || (host && host.pinned && targets.has(item.id));
          }).map(function (item) {
            var host = hostEntries.get(item.id),
              shortcut = config.shortcuts[item.id],
              glyph = item.type === "link" ? PATHS.link : PATHS.grid;
            return React.createElement("button", {
              type: "button", key: item.id, role: "menuitem", tabIndex: -1,
              className: "lso-item" + (host ? "" : " lso-custom"),
              "aria-label": item.label,
              "aria-current": host && host.active ? "page" : undefined,
              "data-lso-entry": item.id,
              "data-lso-selected": Boolean(host && host.active),
              "data-lso-link": host ? undefined : "true",
              style: { order: config.order.indexOf(item.id) - MAX_ORDER_ITEMS - 1 },
              onClick: function () {
                props.onDismiss();
                if (host) props.onOpen(item.id);
                else activate(item.id);
              },
            }, React.createElement("svg", {
              viewBox: "0 0 24 24", "aria-hidden": "true", fill: "none",
              stroke: "currentColor", strokeWidth: 1.7,
            }, React.createElement("path", { d: glyph })),
            React.createElement("span", { className: "lso-item-label" }, item.label),
            shortcut ? React.createElement("span", { className: "lso-shortcut" }, pretty(shortcut)) : null);
          });
          return React.createElement("div", {
            ref: ref, className: "lso-native-extra", "data-lso-native-extra": "",
          }, rows);
        }
        function dismissMenuSurface() {
          if (triggerOwned) {
            setOwnMenu(false);
            return;
          }
          if (!nativeMoreOpen()) return;
          var button = trigger,
            closeNative = function () {
              if (
                button === trigger && nativeMoreOpen()
              )
                clickNativeMore();
            };
          if (typeof window.requestAnimationFrame === "function")
            window.requestAnimationFrame(closeNative);
          else window.setTimeout(closeNative, 16);
        }
        function nativeMenuRoot() {
          return (
            Array.from(document.querySelectorAll('[role="menu"]')).find(
              function (root) {
                return !!root.querySelector(
                  '[data-slot="sidebar.panellist.actions"]',
                );
              },
            ) || null
          );
        }
        function clearFlyout() {
          if (moreGeometry) moreGeometry.abort();
          moreGeometry = null;
          if (moreResize) moreResize.disconnect();
          moreResize = null;
          if (!nativeMenu) return;
          nativeMenu.removeAttribute("data-lso-flyout");
          ["x", "y", "width", "height"].forEach(function (key) {
            nativeMenu.style.removeProperty("--lso-flyout-" + key);
          });
        }
        function placeFlyout() {
          if (!nativeMenu || !trigger || !trigger.isConnected) return;
          var anchor = trigger.getBoundingClientRect(),
            sidebar = trigger.closest('[data-lso-peek-column]') || nav,
            bounds = sidebar ? sidebar.getBoundingClientRect() : anchor,
            viewportWidth = document.documentElement.clientWidth || window.innerWidth,
            viewportHeight = document.documentElement.clientHeight || window.innerHeight,
            width = Math.max(0, Math.min(280, viewportWidth - 16)),
            height = Math.max(0, Math.min(440, viewportHeight - 16)),
            right = Math.max(anchor.right + 6, bounds.right),
            left = Math.min(anchor.left, bounds.left) - width - 6,
            side = right + width <= viewportWidth - 8 || left >= 8,
            x = right + width <= viewportWidth - 8 ? right : left;
          if (!side) x = Math.min(anchor.left, viewportWidth - width - 8);
          var naturalHeight = Math.min(height, nativeMenu.scrollHeight || height),
            y = side ? anchor.top : anchor.bottom + 4;
          if (!side && y + naturalHeight > viewportHeight - 8 && anchor.top >= naturalHeight + 12)
            y = anchor.top - naturalHeight - 4;
          nativeMenu.style.setProperty("--lso-flyout-x", Math.max(8, x) + "px");
          nativeMenu.style.setProperty("--lso-flyout-y", Math.max(8, Math.min(y, viewportHeight - naturalHeight - 8)) + "px");
          nativeMenu.style.setProperty("--lso-flyout-width", width + "px");
          nativeMenu.style.setProperty("--lso-flyout-height", height + "px");
          attr(nativeMenu, "data-lso-flyout", "");
        }
        function removeNativeExtra() {
          clearFlyout();
          if (nativeMenu && nativeMenu.isConnected) restoreOfficialRows(nativeMenu);
          if (nativeExtra) {
            nativeExtra.remove();
            nativeExtra = null;
          }
          nativeMenu = null;
          moreHoverOpened = false;
          cancelMoreHoverClose();
        }
        function syncNativeMenu() {
          if (!trigger || triggerOwned) {
            removeNativeExtra();
            updateTrigger();
            return;
          }
          var root = nativeMenuRoot(),
            slot = root && root.querySelector(
              '[data-slot="sidebar.panellist.actions"]',
            ),
            viewport = slot && slot.parentElement;
          if (!root || !slot || !viewport) {
            if (nativeMenu || !nativeMoreOpen())
              removeNativeExtra();
            syncCurrentProxy();
            updateTrigger();
            return;
          }
          if (nativeMenu !== root) {
            clearFlyout();
            nativeMenu = root;
            moreGeometry = new window.AbortController();
            var signal = moreGeometry.signal;
            window.addEventListener("resize", placeFlyout, { signal: signal });
            document.addEventListener("scroll", function (event) {
              if (!root.contains(event.target)) placeFlyout();
            }, { capture: true, signal: signal });
            if (typeof window.ResizeObserver === "function") {
              moreResize = new window.ResizeObserver(placeFlyout);
              moreResize.observe(root);
              moreResize.observe(trigger);
            }
          }
          decorateOfficialRows(root);
          bindHoverSurface(root);
          attr(root, "data-window-drag-exclude", "true");
          var wantsExtra = slotExtra && root.contains(slotExtra) ? false : dragging
            ? !!nativeExtra
            : nativeMenuItems().length > 0;
          if (!wantsExtra) {
            if (nativeExtra) {
              nativeExtra.remove();
              nativeExtra = null;
            }
          } else {
            if (
              !nativeExtra ||
              nativeExtra.parentNode !== viewport ||
              nativeExtra.nextElementSibling !== slot
            ) {
              if (nativeExtra) nativeExtra.remove();
              nativeExtra = el("div", "lso-native-extra");
              nativeExtra.setAttribute("data-lso-native-extra", "");
              nativeExtra.setAttribute("role", "group");
              nativeExtra.setAttribute("aria-label", t("menu"));
              nativeExtra.setAttribute("data-window-drag-exclude", "");
              viewport.insertBefore(nativeExtra, slot);
            }
            if (!dragging) drawItems(nativeExtra);
            if (nativeExtra && !nativeExtra.childElementCount) {
              nativeExtra.remove();
              nativeExtra = null;
            }
          }
          placeFlyout();
          syncCurrentProxy();
          updateTrigger();
        }
        function scheduleNativeMenu() {
          if (!alive || nativeMenuFrame !== null) return;
          var run = function () {
            nativeMenuFrame = null;
            syncNativeMenu();
          };
          nativeMenuFrame =
            typeof window.requestAnimationFrame === "function"
              ? window.requestAnimationFrame(run)
              : window.setTimeout(run, 16);
        }
        function unbindTrigger() {
          var tail = triggerBound && triggerBound.querySelector("[data-lso-more-trailing]");
          if (tail) tail.remove();
          if (triggerBound) {
            triggerBound.removeAttribute("data-lso-official-trigger");
            triggerBound.removeAttribute("data-lso-active");
            triggerBound.removeAttribute("aria-current");
            if (triggerBound.hasAttribute("data-lso-inline-open")) {
              triggerBound.removeAttribute("data-lso-inline-open");
              triggerBound.removeAttribute("aria-controls");
              triggerBound.setAttribute("aria-expanded", "false");
              triggerBound.setAttribute("aria-label", t("more"));
              var title = triggerBound.querySelector('[class*="panelTitle"]');
              if (title) title.textContent = t("more");
            }
          }
          if (triggerBound && triggerHandlers) {
            Object.keys(triggerHandlers).forEach(function (name) {
              triggerBound.removeEventListener(
                name,
                triggerHandlers[name],
                !triggerOwned && name === "click",
              );
            });
          }
          trigger = null;
          triggerHost = null;
          triggerOwned = false;
          triggerBound = null;
          triggerHandlers = null;
          expanded = false;
        }
        function bindTrigger(button, owned) {
          if (
            trigger === button &&
            triggerBound === button &&
            triggerOwned === owned
          )
            return;
          unbindTrigger();
          trigger = button;
          triggerHost = button;
          while (
            triggerHost.parentElement &&
            triggerHost.parentElement !== nav
          )
            triggerHost = triggerHost.parentElement;
          triggerOwned = owned;
          triggerBound = button;
          triggerHandlers = owned
            ? {
                click: toggleMenu,
                mouseenter: function () {
                  cancelMoreHoverClose();
                  if (moreHoverMode() && !expanded) scheduleMoreHoverOpen();
                },
                mouseleave: function () {
                  cancelMoreHoverOpen();
                  if (moreHoverMode() && moreHoverOpened)
                    scheduleMoreHoverClose();
                },
              }
            : {
                click: function (event) {
                  if (
                    nativeMoreClick ||
                    (sidebarCollapsed && !peek.active) ||
                    !inlineItems().length
                  ) {
                    scheduleNativeMenu();
                    return;
                  }
                  event.preventDefault();
                  event.stopImmediatePropagation();
                  if (nativeMoreOpen()) clickNativeMore();
                  resetMoreHover();
                  setOwnMenu(!expanded);
                },
                keydown: function (event) {
                  if (event.key !== "ArrowDown" || nativeMoreOpen()) return;
                  event.preventDefault();
                  event.stopPropagation();
                  showNativeActions();
                },
                mouseenter: function () {
                  cancelMoreHoverClose();
                  if (moreHoverMode() && !moreOpen()) scheduleMoreHoverOpen();
                },
                mouseleave: function () {
                  cancelMoreHoverOpen();
                  if (moreHoverMode() && moreHoverOpened)
                    scheduleMoreHoverClose();
                },
              };
          Object.keys(triggerHandlers).forEach(function (name) {
            triggerBound.addEventListener(name, triggerHandlers[name], !owned && name === "click");
          });
        }
        function moreHoverMode() {
          return config.moreMode === "hover";
        }
        function cancelMoreHoverOpen() {
          if (moreOpenTimer !== null) {
            window.clearTimeout(moreOpenTimer);
            moreOpenTimer = null;
          }
        }
        function cancelMoreHoverClose() {
          if (moreCloseTimer !== null) {
            window.clearTimeout(moreCloseTimer);
            moreCloseTimer = null;
          }
        }
        function resetMoreHover() {
          cancelMoreHoverOpen();
          cancelMoreHoverClose();
          moreHoverOpened = false;
        }
        function clickNativeMore() {
          if (!trigger || triggerOwned) return;
          nativeMoreClick = true;
          try {
            trigger.dispatchEvent(new window.MouseEvent("click", {
              bubbles: true,
              cancelable: true,
            }));
          } finally {
            nativeMoreClick = false;
          }
        }
        function showNativeActions() {
          setOwnMenu(false);
          resetMoreHover();
          if (!nativeMoreOpen()) clickNativeMore();
        }
        function setOwnMenu(open) {
          if (!menu) return;
          if (expanded === open) return;
          expanded = open;
          menu.hidden = !open;
          if (!open) {
            moreHoverOpened = false;
            cancelMoreHoverClose();
          }
          syncCurrentProxy();
          updateTrigger();
        }
        function scheduleMoreHoverOpen() {
          if (!moreHoverMode() || !trigger || moreOpen()) return;
          if (moreOpenTimer !== null) return;
          moreOpenTimer = window.setTimeout(function () {
            moreOpenTimer = null;
            if (!moreHoverMode() || moreOpen()) return;
            openMoreByHover();
          }, 25);
        }
        function openMoreByHover() {
          if (!trigger || moreOpen()) return;
          if (triggerOwned && !menu) return;
          moreHoverOpened = true;
          if (triggerOwned) {
            setOwnMenu(true);
            return;
          }
          clickNativeMore();
        }
        function closeMoreByHover() {
          if (!moreHoverOpened) return;
          moreHoverOpened = false;
          if (triggerOwned) {
            setOwnMenu(false);
            return;
          }
          dismissMenuSurface();
        }
        function scheduleMoreHoverClose() {
          if (!moreHoverMode() || !moreHoverOpened) return;
          if (moreCloseTimer !== null) return;
          moreCloseTimer = window.setTimeout(function () {
            moreCloseTimer = null;
            if (!moreHoverMode() || !moreHoverOpened) return;
            closeMoreByHover();
          }, 160);
        }
        function bindHoverSurface(node) {
          if (!node || moreHoverNodes.has(node)) return;
          moreHoverNodes.add(node);
          node.addEventListener("mouseenter", cancelMoreHoverClose);
          node.addEventListener("mouseleave", function () {
            if (!moreHoverMode()) return;
            cancelMoreHoverOpen();
            if (moreHoverOpened) scheduleMoreHoverClose();
          });
        }
        function updateTrigger() {
          if (!trigger) return;
          var active = currentMoreEntry(),
            activeId = active ? active.id : "";
          if (triggerOwned) {
            var name = trigger.querySelector("[data-lso-label]"),
              text = expanded ? t("collapse") : t("more");
            if (name && name.textContent !== text) name.textContent = text;
            attr(
              trigger,
              "aria-label",
              expanded ? t("collapse") : t("openMore"),
            );
            attr(trigger, "title", expanded ? t("collapse") : t("more"));
            attr(trigger, "aria-expanded", String(expanded));
            attr(trigger, "aria-haspopup", "true");
            attr(trigger, "aria-controls", MENU_ID);
          }
          if (!triggerOwned) {
            var tail = trigger.querySelector("[data-lso-more-trailing]"),
              label = trigger.querySelector('[class*="panelTitle"]'),
              wasInline = trigger.hasAttribute("data-lso-inline-open"),
              template = templates.get(activeId),
              glyph =
                (template && template.node.querySelector("svg")) ||
                menuGlyphs.get(activeId);
            if (expanded || wasInline) {
              var nativeCaption = expanded ? t("collapse") : t("more");
              if (expanded) {
                attr(trigger, "data-lso-inline-open", "");
                attr(trigger, "aria-controls", MENU_ID);
              } else {
                trigger.removeAttribute("data-lso-inline-open");
                trigger.removeAttribute("aria-controls");
              }
              attr(trigger, "aria-label", nativeCaption);
              attr(trigger, "aria-expanded", String(expanded));
              if (label && label.textContent !== nativeCaption)
                label.textContent = nativeCaption;
            }
            if (label && !tail) {
              tail = el("span");
              tail.setAttribute("aria-hidden", "true");
              tail.setAttribute("data-lso-more-trailing", "");
              trigger.appendChild(tail);
            }
            if (!label && tail) tail.remove();
            if (
              label &&
              tail &&
              (tail.getAttribute("data-panel") !== activeId ||
                (tail.childElementCount > 1) !== Boolean(glyph))
            ) {
              tail.replaceChildren();
              if (glyph) {
                var icon = glyph.cloneNode(true);
                cloneIds(icon);
                tail.appendChild(icon);
              }
              tail.appendChild(svg("chevron"));
              tail.setAttribute("data-panel", activeId);
            }
          }
          attr(
            trigger,
            "data-lso-active",
            String(!!active && (triggerOwned ? !currentProxy : !expanded)),
          );
          if (active && !currentProxy && !expanded) attr(trigger, "aria-current", "page");
          else trigger.removeAttribute("aria-current");
        }
        function clearCurrentProxy() {
          if (currentProxy) currentProxy.remove();
          currentProxy = null;
          currentProxyId = null;
        }
        function syncCurrentLabel(proxy, text) {
          var own = syncRowLabel(proxy, text, "data-lso-current-label");
          if (own) {
            var width = nav && nav.getBoundingClientRect().width;
            if (width < 160) own.setAttribute("hidden", "");
            else own.removeAttribute("hidden");
          }
        }
        function fitCurrentProxy(proxy, source) {
          var navWidth = nav ? nav.getBoundingClientRect().width : 0,
            sourceWidth = source.getBoundingClientRect().width;
          if (sourceWidth > 0 && navWidth < 160) {
            proxy.style.setProperty(
              "width",
              sourceWidth + "px",
              "important",
            );
            proxy.style.setProperty(
              "min-width",
              sourceWidth + "px",
              "important",
            );
            proxy.style.setProperty(
              "max-width",
              sourceWidth + "px",
              "important",
            );
          }
        }
        function proxyOrder() {
          var host = triggerHost || trigger,
            value = Number(host && host.style.order);
          if (!Number.isFinite(value)) value = 100 + config.order.length;
          return String(Math.round(value) - 1);
        }
        function currentMoreEntry() {
          return entries.find(function (item) {
            return isHiddenEntry(item) && selected(item.id);
          });
        }
        function syncCurrentProxy() {
          var active = config.showCurrentEntry && currentMoreEntry();
          if (!active || !trigger) {
            clearCurrentProxy();
            return;
          }
          var source = targets.get(active.id),
            template = templates.get(active.id),
            base = source && source.isConnected ? source : template && template.node;
          if (!base) {
            clearCurrentProxy();
            return;
          }
          if (
            currentProxy &&
            currentProxyId === active.id &&
            currentProxy.parentNode === nav
          ) {
            if (base === source) copyAppearance(source, currentProxy);
            else applyAppearance(template.style, currentProxy);
            syncCurrentLabel(currentProxy, active.label);
            if (source) fitCurrentProxy(currentProxy, source);
            currentProxy.style.order = proxyOrder();
            return;
          }
          clearCurrentProxy();
          var proxy = base.cloneNode(true);
          proxy.removeAttribute("id");
          proxy.removeAttribute("data-lso-entry");
          proxy.removeAttribute("data-lso-anchor");
          proxy.removeAttribute("data-lso-more");
          proxy.removeAttribute("data-lso-dragging");
          proxy.removeAttribute("data-lso-target");
          proxy.removeAttribute("data-lso-before");
          proxy.removeAttribute("data-lso-after");
          proxy.removeAttribute("data-lso-link");
          proxy.draggable = false;
          proxy.setAttribute("data-lso-selection", active.id);
          proxy.setAttribute("data-lso-selected", "true");
          proxy.classList.add("lso-current-entry");
          if (base === source) copyAppearance(source, proxy);
          else applyAppearance(template.style, proxy);
          syncCurrentLabel(proxy, active.label);
          if (source) fitCurrentProxy(proxy, source);
          cloneIds(proxy);
          proxy.addEventListener("click", function (event) {
            event.preventDefault();
            if (!expanded) close();
            activate(active.id);
          });
          currentProxy = proxy;
          currentProxyId = active.id;
          (triggerHost || trigger).before(proxy);
          proxy.style.order = proxyOrder();
        }
        function close() {
          expanded = false;
          if (menu) menu.hidden = true;
          syncCurrentProxy();
          updateTrigger();
        }
        function dismiss(event) {
          if (event.key !== "Escape" || !expanded) return;
          if (!triggerOwned) return;
          var focused = !!(menu && menu.contains(document.activeElement));
          event.preventDefault();
          event.stopPropagation();
          close();
          if (focused && trigger) trigger.focus({ preventScroll: true });
        }
        function toggleMenu() {
          if (!menu || !trigger) return;
          moreHoverOpened = false;
          cancelMoreHoverClose();
          setOwnMenu(!expanded);
        }
        function renderMenu() {
          if (trigger && !triggerOwned) syncNativeMenu();
          if (!zone) {
            zone = el("div", "lso-dropzone");
            zone.setAttribute("data-lso-zone", "");
            zone.appendChild(svg("grid"));
            zone.appendChild(el("span", "", t("empty")));
          }
          if (trigger) {
            zone.hidden = true;
            if (zone.parentNode) zone.remove();
            if (!menu) {
              menu = el("div", "lso-menu");
              menu.hidden = true;
              menu.id = MENU_ID;
              menu.setAttribute("role", "group");
              menu.setAttribute("aria-label", t("menu"));
              bindHoverSurface(menu);
            }
            if (triggerOwned) menu.removeAttribute("data-lso-inline");
            else attr(menu, "data-lso-inline", "");
            if (!dragging) {
              if (!triggerOwned && expanded && !inlineItems().length) expanded = false;
              drawItems(menu);
              menu.hidden = !expanded;
              var anchor = triggerHost || trigger;
              menu.style.order = anchor.style.order;
              if (anchor.nextElementSibling !== menu) anchor.after(menu);
              updateTrigger();
            }
            return;
          }
          if (menu) menu.remove();
          if (nav && dragging) {
            zone.style.order = String(100 + config.order.length);
            if (zone.parentNode !== nav) nav.appendChild(zone);
            zone.hidden = false;
          } else {
            zone.hidden = true;
            if (zone.parentNode) zone.remove();
          }
        }
        function refresh() {
          if (!alive) return;
          nav = findNav();
          var frame = sidebarFrame(),
            collapsed = !!(
              frame && frame.hasAttribute("data-sidebar-collapsed")
            );
          if (
            sidebarCollapsed !== null &&
            sidebarCollapsed !== collapsed
          ) {
            if (moreHoverOpened) closeMoreByHover();
            if (collapsed && !triggerOwned) setOwnMenu(false);
            resetMoreHover();
          }
          sidebarCollapsed = collapsed;
          if (!nav) {
            close();
            clearCurrentProxy();
            if (trigger && triggerOwned) trigger.remove();
            unbindTrigger();
            removeNativeExtra();
            if (menu) menu.remove();
            menu = null;
            targets.clear();
            return;
          }
          var raw = [];
          try {
            raw = ctx.slots.entriesOfSlot("sidebar.panellist") || [];
          } catch (_) {}
          entries = raw
            .map(function (entry) {
              var id = entry.options && entry.options.id,
                name = label(entry);
              return {
                id: id,
                label: name,
                registrant: entry.registrant || "",
                order: Number.isFinite(entry.options && entry.options.order)
                  ? entry.options.order
                  : 0,
                movable:
                  !!id &&
                  id !== "plugins" &&
                  !/^(插件|plugins)$/i.test(String(name).trim()),
              };
            })
            .filter(function (entry) {
              return entry.id;
            })
            .sort(function (a, b) {
              return a.order - b.order;
            });
          var buttons = Array.from(
            nav.querySelectorAll("button[aria-label]"),
          ).filter(function (node) {
            return (
              !node.hasAttribute("data-lso-trigger") &&
              !node.hasAttribute("data-lso-selection") &&
              node.getAttribute("aria-haspopup") !== "menu" &&
              !node.closest('.lso-menu,.lso-native-extra,[role="menu"]')
            );
          });
          targets.clear();
          buttons.forEach(function (node) {
            var entry = entries.find(function (item) {
              return (
                item.label === node.getAttribute("aria-label") &&
                !targets.has(item.id)
              );
            });
            if (entry && entry.movable) targets.set(entry.id, node);
          });
          targets.forEach(function (node, id) {
            var snapshot = templates.get(id);
            if (!snapshot || snapshot.source !== node)
              templates.set(id, {
                source: node,
                node: snapshotRow(node),
                style: captureAppearance(node),
              });
          });
          var movableNodes = new Set(targets.values());
          buttons.forEach(function (node) {
            if (movableNodes.has(node)) node.removeAttribute("data-lso-anchor");
            else attr(node, "data-lso-anchor", "true");
          });
          var linkIds = config.links.map(function (link) {
              return link.id;
            }),
            order = config.order.slice();
          entries.filter(function (item) { return item.movable; })
            .map(function (item) { return item.id; }).concat(linkIds).forEach(function (id) {
            if (!order.includes(id)) order.push(id);
          });
          config.order = order.slice(0, MAX_ORDER_ITEMS);
          config.more = config.more.filter(function (id) {
            return !linkIds.includes(id);
          });
          var hidden = config.more.filter(function (id) {
              return entries.some(function (item) {
                return item.id === id;
              });
            });
          var knownOrder = config.order.filter(function (id) {
            return targets.has(id);
          });
          knownOrder.forEach(function (id, index) {
            var node = targets.get(id),
              host = rowHost(node),
              hide = host && host !== node ? host : node;
            if (!original.has(hide))
              original.set(hide, {
                display: hide.style.getPropertyValue("display"),
                priority: hide.style.getPropertyPriority("display"),
              });
            if (!originalOrder.has(host))
              originalOrder.set(host, host.style.order);
            if (!originalDrag.has(node))
              originalDrag.set(node, node.getAttribute("draggable"));
            node.setAttribute("draggable", "false");
            attr(node, "data-lso-entry", id);
            host.style.order = String(100 + index);
            if (config.more.includes(id)) {
              hide.style.setProperty("display", "none", "important");
            } else {
              var old = original.get(hide);
              node.removeAttribute("data-lso-more");
              if (
                hide.style.getPropertyValue("display") === "none" &&
                hide.style.getPropertyPriority("display") === "important"
              ) {
                if (old.display)
                  hide.style.setProperty("display", old.display, old.priority);
                else hide.style.removeProperty("display");
              }
            }
          });
          var official = findOfficialMore(),
            ownButton = nav.querySelector("[data-lso-trigger]");
          if (official) {
            if (ownButton) {
              if (trigger === ownButton) unbindTrigger();
              ownButton.remove();
              ownButton = null;
            }
            official.removeAttribute("data-lso-anchor");
            attr(official, "data-lso-official-trigger", "true");
          }
          var button = official || ownButton;
          if (!official && !hidden.length && !config.links.length) {
            if (official) {
              var officialHost = rowHost(official);
              if (!originalOrder.has(officialHost))
                originalOrder.set(officialHost, officialHost.style.order);
              officialHost.style.order = String(100 + knownOrder.length);
            }
            close();
            clearCurrentProxy();
            if (ownButton && !official) {
              if (trigger === ownButton) unbindTrigger();
              ownButton.remove();
            }
            if (official) {
              if (trigger === official) unbindTrigger();
              official.removeAttribute("data-lso-official-trigger");
              official.removeAttribute("data-lso-active");
              official.removeAttribute("aria-current");
            }
            removeNativeExtra();
            if (menu) menu.remove();
            menu = null;
            renderMenu();
            persist();
            return;
          }
          if (!button) {
            var visibleButtons = buttons.filter(function (node) {
              return window.getComputedStyle(node).display !== "none";
            });
            var template =
              visibleButtons.find(function (node) {
                return (
                  !node.hasAttribute("aria-current") &&
                  !node.hasAttribute("data-lso-anchor")
                );
              }) ||
              visibleButtons.find(function (node) {
                return !node.hasAttribute("data-lso-anchor");
              }) ||
              visibleButtons.find(function (node) {
                return !node.hasAttribute("aria-current");
              }) ||
              visibleButtons[0] ||
              el("button");
            button = template.cloneNode(false);
            button.removeAttribute("id");
            button.removeAttribute("aria-current");
            button.removeAttribute("draggable");
            button.removeAttribute("hidden");
            button.removeAttribute("data-lso-entry");
            button.removeAttribute("data-lso-anchor");
            button.removeAttribute("data-lso-more");
            button.removeAttribute("data-lso-dragging");
            button.removeAttribute("data-lso-target");
            button.removeAttribute("data-lso-before");
            button.removeAttribute("data-lso-after");
            button.removeAttribute("data-lso-link");
            button.style.removeProperty("display");
            button.className = (template && template.className) || "";
            button.classList.add("lso-more");
            button.type = "button";
            var icon = svg("grid"),
              name = el("span", "", t("more")),
              chevron = svg("chevron");
            name.setAttribute("data-lso-label", "");
            chevron.classList.add("lso-chevron");
            button.replaceChildren(icon, name, chevron);
            button.setAttribute("data-lso-trigger", "");
            button.setAttribute("data-plugin", "dsh-liao-sidebar");
            nav.appendChild(button);
          }
          bindTrigger(button, !official);
          button.removeAttribute("data-lso-anchor");
          trigger.hidden = false;
          var moreHost = triggerHost || trigger;
          if (!originalOrder.has(moreHost))
            originalOrder.set(moreHost, moreHost.style.order);
          moreHost.style.order = String(100 + knownOrder.length);
          syncCurrentProxy();
          renderMenu();
          if (JSON.stringify(config) !== window.localStorage.getItem(KEY)) {
            persist();
          }
          alignMoreWithHost();
        }
        function move(id, direction, pool) {
          var ids = pool || config.order,
            i = ids.indexOf(id),
            to = i + direction;
          if (i < 0 || to < 0 || to >= ids.length) return;
          var other = ids[to],
            order = config.order.slice(),
            fromIndex = order.indexOf(id),
            toIndex = order.indexOf(other);
          if (fromIndex < 0 || toIndex < 0) return;
          order[fromIndex] = other;
          order[toIndex] = id;
          update({ order: order });
        }
        function pinEntry(id) {
          if (pinRequests.has(id)) return true;
          if (pinHost && pinHost.nav === nav && pinHost.ids.has(id)) {
            alignmentTried.delete(id);
            pinHost.set(id, true);
            if (config.more.includes(id)) {
              update({ more: config.more.filter(function (entryId) { return entryId !== id; }) });
            }
            return true;
          }
          var pin = officialPinButtonFor(id);
          if (pin) {
            pin.click();
            return true;
          }
          if (!trigger || triggerOwned) return false;
          var button = trigger,
            opened = !nativeMoreOpen(),
            tries = 0;
          pinRequests.add(id);
          if (opened) showNativeActions();
          var attempt = function () {
            if (!alive || !pinRequests.has(id)) return;
            var found = officialPinButtonFor(id);
            if (found) {
              pinRequests.delete(id);
              found.click();
              if (opened) dismissMenuSurface();
              return;
            }
            tries += 1;
            if (tries < 12) {
              window.setTimeout(attempt, 30);
              return;
            }
            pinRequests.delete(id);
            if (
              opened &&
              button === trigger &&
              nativeMoreOpen()
            )
              clickNativeMore();
          };
          window.setTimeout(attempt, 30);
          return true;
        }
        function appendToMore(id) {
          update({
            order: config.order.filter(function (entryId) {
              return entryId !== id;
            }).concat(id),
            more: config.more.concat(id),
          });
        }
        function toggleMore(id) {
          if (!config.more.includes(id)) {
            var unpin = targets.has(id) && officialUnpinButtonFor(id);
            if (unpin) unpin.click();
            if (!config.more.includes(id)) appendToMore(id);
          } else if (targets.has(id) || !pinEntry(id)) {
            alignmentTried.delete(id);
            update({ more: config.more.filter(function (entryId) {
              return entryId !== id;
            }) });
          }
        }
        function captureShortcut(event, id) {
          if (event.key === "Backspace" || event.key === "Delete") {
            event.preventDefault();
            var next = Object.assign({}, config.shortcuts);
            delete next[id];
            update({ shortcuts: next });
            return null;
          }
          var value = shortcutFromEvent(event);
          if (!value) return null;
          event.preventDefault();
          var hostOwner = hostShortcutOwner(value);
          if (hostOwner) return { hostConflict: hostOwner };
          var conflict = Object.keys(config.shortcuts).find(function (key) {
            return (
              key !== id &&
              config.shortcuts[key].toLowerCase() === value.toLowerCase()
            );
          });
          if (conflict) return { conflict: conflict };
          if (
            !config.shortcuts[id] &&
            Object.keys(config.shortcuts).length >= MAX_SHORTCUTS
          )
            return { limit: true };
          var next = Object.assign({}, config.shortcuts);
          next[id] = value;
          update({ shortcuts: next });
          event.currentTarget.blur();
          return null;
        }
        function shortcuts(event) {
          if (event.defaultPrevented || event.isComposing || event.repeat)
            return;
          var target = event.target;
          if (
            target &&
            (target.isContentEditable ||
              /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName || ""))
          )
            return;
          var key = shortcutFromEvent(event);
          if (!key) return;
          var id = Object.keys(config.shortcuts).find(function (x) {
            return config.shortcuts[x].toLowerCase() === key.toLowerCase();
          });
          if (!id) return;
          if (hostShortcutOwner(key)) return;
          event.preventDefault();
          activate(id);
        }
        function dragPreview(event, node, offsetX, offsetY) {
          var rect = node.getBoundingClientRect(),
            clone = node.cloneNode(true),
            computed = window.getComputedStyle(node);
          clone.removeAttribute("id");
          clone.removeAttribute("aria-current");
          clone.removeAttribute("draggable");
          clone.removeAttribute("data-lso-entry");
          clone.removeAttribute("data-lso-link");
          clone.removeAttribute("data-lso-dragging");
          cloneIds(clone);
          for (var i = 0; i < computed.length; i++)
            clone.style.setProperty(
              computed[i],
              computed.getPropertyValue(computed[i]),
            );
          clone.classList.add("lso-drag-preview");
          clone.style.setProperty("left", event.clientX - offsetX + "px");
          clone.style.setProperty("top", event.clientY - offsetY + "px");
          clone.style.setProperty("width", rect.width + "px");
          clone.style.setProperty("height", rect.height + "px");
          clone.style.setProperty("margin", "0");
          document.body.appendChild(clone);
          preview = clone;
        }
        function pointerDown(event) {
          if (peek.active) return;
          var node =
              event.target.closest && event.target.closest("[data-lso-entry]"),
            id = node && node.getAttribute("data-lso-entry");
          if (event.button !== 0 || !id || !config.order.includes(id)) return;
          var rect = node.getBoundingClientRect();
          pointerPress = {
            id: id,
            node: node,
            x: event.clientX,
            y: event.clientY,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
            active: false,
          };
        }
        function clearMarkers() {
          document
            .querySelectorAll(
              "[data-lso-target],[data-lso-before],[data-lso-after]",
            )
            .forEach(function (x) {
              x.removeAttribute("data-lso-target");
              x.removeAttribute("data-lso-before");
              x.removeAttribute("data-lso-after");
            });
          if (insertionMarker) {
            insertionMarker.remove();
            insertionMarker = null;
          }
          dropTarget = null;
        }
        function markTarget(target, clientY) {
          clearMarkers();
          if (
            isLink(dragging) &&
            (!target ||
              !target.closest ||
              !target.closest(
                '.lso-menu,.lso-native-extra,[role="menu"]',
              ))
          )
            return;
          if (
            target &&
            (target.hasAttribute("data-lso-zone") ||
              target.hasAttribute("data-lso-trigger") ||
              target.hasAttribute("data-lso-official-trigger"))
          ) {
            attr(target, "data-lso-target", "true");
            dropTarget = target;
            return;
          }
          if (target && target.hasAttribute("data-lso-anchor")) {
            var anchorRect = target.getBoundingClientRect();
            if (anchorRect.height > 0 && anchorRect.width > 0) {
              attr(target, "data-lso-after", "true");
              dropTarget = target;
              insertionMarker = el("div", "lso-insertion-marker");
              insertionMarker.style.left = anchorRect.left + "px";
              insertionMarker.style.top = anchorRect.bottom - 1.5 + "px";
              insertionMarker.style.width = anchorRect.width + "px";
              document.body.appendChild(insertionMarker);
            }
            return;
          }
          var best = null;
          if (
            target &&
            target.hasAttribute("data-lso-entry") &&
            target.getAttribute("data-lso-entry") !== dragging
          ) {
            var focusedRect = target.getBoundingClientRect();
            if (focusedRect.height > 0 && focusedRect.width > 0)
              best = {
                node: target,
                edge:
                  clientY < focusedRect.top + focusedRect.height / 2
                    ? "before"
                    : "after",
                rect: focusedRect,
              };
          }
          if (!best) {
            var distance = Infinity;
            Array.from(document.querySelectorAll("[data-lso-entry]")).forEach(
              function (node) {
                if (node.getAttribute("data-lso-entry") === dragging) return;
                var rect = node.getBoundingClientRect();
                if (rect.height <= 0 || rect.width <= 0) return;
                var topDistance = Math.abs(clientY - rect.top),
                  bottomDistance = Math.abs(clientY - rect.bottom);
                if (topDistance < distance) {
                  distance = topDistance;
                  best = { node: node, edge: "before", rect: rect };
                }
                if (bottomDistance < distance) {
                  distance = bottomDistance;
                  best = { node: node, edge: "after", rect: rect };
                }
              },
            );
          }
          if (best) {
            attr(
              best.node,
              best.edge === "after" ? "data-lso-after" : "data-lso-before",
              "true",
            );
            dropTarget = best.node;
            insertionMarker = el("div", "lso-insertion-marker");
            insertionMarker.style.left = best.rect.left + "px";
            insertionMarker.style.top =
              best.rect[best.edge === "after" ? "bottom" : "top"] - 1.5 + "px";
            insertionMarker.style.width = best.rect.width + "px";
            document.body.appendChild(insertionMarker);
          }
        }
        function pointerMove(event) {
          if (!pointerPress) return;
          var press = pointerPress;
          if (
            !press.active &&
            Math.hypot(event.clientX - press.x, event.clientY - press.y) < 5
          )
            return;
          if (!press.active) {
            press.active = true;
            dragClick = true;
            dragging = press.id;
            attr(document.documentElement, "data-lso-drag-active", "true");
            dragPreview(event, press.node, press.offsetX, press.offsetY);
            attr(press.node, "data-lso-dragging", "true");
            renderMenu();
          }
          if (event.cancelable) event.preventDefault();
          if (preview) {
            preview.style.left = event.clientX - press.offsetX + "px";
            preview.style.top = event.clientY - press.offsetY + "px";
          }
          var target = document.elementFromPoint
            ? document.elementFromPoint(event.clientX, event.clientY)
            : event.target;
          target =
            target &&
            target.closest &&
            target.closest(
              "[data-lso-zone],[data-lso-trigger],[data-lso-official-trigger],[data-lso-entry],[data-lso-anchor]",
            );
          markTarget(target, event.clientY);
        }
        function dragEnd(event) {
          var node =
            event.target &&
            event.target.closest &&
            event.target.closest("[data-lso-entry]");
          if (node) node.removeAttribute("data-lso-dragging");
          document.documentElement.removeAttribute("data-lso-drag-active");
          document
            .querySelectorAll("[data-lso-dragging]")
            .forEach(function (x) {
              x.removeAttribute("data-lso-dragging");
            });
          clearMarkers();
          dragging = null;
          pointerPress = null;
          if (preview) {
            preview.remove();
            preview = null;
          }
          renderMenu();
          if (dragClick)
            window.setTimeout(function () {
              dragClick = false;
            }, 0);
        }
        function pointerUp(event) {
          if (!pointerPress) return;
          var press = pointerPress;
          pointerPress = null;
          if (!press.active) return;
          try {
            var target = document.elementFromPoint
              ? document.elementFromPoint(event.clientX, event.clientY)
              : event.target;
            target =
              target &&
              target.closest &&
              target.closest(
                "[data-lso-zone],[data-lso-trigger],[data-lso-official-trigger],[data-lso-entry],[data-lso-anchor]",
              );
            markTarget(target, event.clientY);
            if (dropTarget) dropOn(dropTarget, press.id);
          } finally {
            dragEnd({ target: press.node });
          }
        }
        function officialPinButtonFor(id) {
          var row = officialRows(nativeMenu).find(function (item) {
            return item.id === id;
          });
          return row ? row.pin : null;
        }
        function officialUnpinButtonFor(id) {
          if (!nav) return null;
          return (
            Array.from(nav.querySelectorAll("button[aria-label]")).find(
              function (button) {
                if (pinActionKind(button) !== "unpin") return false;
                var item = entryFromActionLabel(
                  String(button.getAttribute("aria-label") || ""),
                );
                return !!item && item.id === id;
              },
            ) || null
          );
        }
        function alignMoreWithHost() {
          if (!alive) return;
          var id = config.more.find(function (entryId) {
            return (
              !alignmentTried.has(entryId) &&
              targets.has(entryId) &&
              !!officialUnpinButtonFor(entryId)
            );
          });
          if (!id) return;
          alignmentTried.add(id);
          var unpin = officialUnpinButtonFor(id);
          window.setTimeout(function () {
            if (alive && config.more.includes(id) && unpin && unpin.isConnected)
              unpin.click();
          }, 0);
        }
        function dropOn(target, id) {
          var to = target.getAttribute("data-lso-entry");
          if (!config.order.includes(id)) return;
          if (
            target.hasAttribute("data-lso-zone") ||
            target.hasAttribute("data-lso-trigger") ||
            target.hasAttribute("data-lso-official-trigger")
          ) {
            if (isLink(id)) return;
            if (targets.has(id) && !config.more.includes(id)) toggleMore(id);
          } else if (target.hasAttribute("data-lso-anchor")) {
            if (isLink(id)) return;
            var order = config.order.filter(function (x) {
                return x !== id;
              }),
              needsPin = !targets.has(id);
            order.unshift(id);
            update({
              order: order,
              more: config.more.filter(function (x) {
                return x !== id;
              }),
            });
            if (needsPin) pinEntry(id);
          } else if (to && to !== id) {
            var order = config.order.filter(function (x) {
                return x !== id;
              }),
              index = order.indexOf(to);
            if (index < 0) index = order.length;
            else if (target.hasAttribute("data-lso-after")) index++;
            order.splice(index, 0, id);
            var more = config.more.filter(function (x) {
                return x !== id;
              }),
              inside =
                !!target.closest(
                  '.lso-menu,.lso-native-extra,[role="menu"]',
                ) ||
                config.more.includes(to);
            if (inside && !isLink(id)) more.push(id);
            var needsPin = !inside && !isLink(id) && !targets.has(id);
            update({ order: order, more: more });
            if (needsPin) pinEntry(id);
          }
        }
        function suppressNativeDrag(event) {
          var node =
            event.target.closest && event.target.closest("[data-lso-entry]");
          if (node) event.preventDefault();
        }
        function suppressDragClick(event) {
          if (!dragClick || event.detail === 0) return;
          dragClick = false;
          event.preventDefault();
          event.stopPropagation();
        }
        function renderSettings() {
          var force = React.useState(0)[1],
            nameState = React.useState(""),
            linkName = nameState[0],
            setLinkName = nameState[1],
            urlState = React.useState(""),
            linkUrl = urlState[0],
            setLinkUrl = urlState[1],
            openState = React.useState("external"),
            linkOpen = openState[0],
            setLinkOpen = openState[1],
            editState = React.useState(null),
            editing = editState[0],
            setEditing = editState[1],
            backupState = React.useState(""),
            backup = backupState[0],
            setBackup = backupState[1],
            linkSection = React.useRef(null),
            linkNameInput = React.useRef(null),
            backupInput = React.useRef(null),
            errorState = React.useState(null),
            error = errorState[0],
            setError = errorState[1];
          React.useEffect(function () {
            var fn = function () {
              force(function (n) {
                return n + 1;
              });
            };
            listeners.add(fn);
            return function () {
              listeners.delete(fn);
            };
          }, []);
          function nameForId(id) {
            var item = ordered().find(function (entry) {
              return entry.id === id;
            });
            var link = linkFor(id);
            return (item && item.label) || (link && link.label) || id;
          }
          function errorText() {
            if (!error) return "";
            if (error.kind === "shortcutConflict")
              return t("shortcutConflict").replace(
                "{name}",
                nameForId(error.id),
              );
            if (error.kind === "hostShortcutConflict")
              return t("hostShortcutConflict").replace(
                "{name}",
                error.name,
              );
            return t(error.kind);
          }
          function field(id, name) {
            var owner = hostShortcutOwner(config.shortcuts[id] || "");
            return React.createElement(
              React.Fragment,
              null,
              React.createElement("input", {
                className: "lso-capture",
                readOnly: true,
                value: pretty(config.shortcuts[id] || ""),
                placeholder: t("capture"),
                title: t("shortcutHint"),
                "aria-label": t("shortcut") + " " + name,
                onKeyDown: function (e) {
                  var result = captureShortcut(e, id);
                  if (result && result.conflict)
                    setError({ kind: "shortcutConflict", id: result.conflict });
                  else if (result && result.hostConflict)
                    setError({
                      kind: "hostShortcutConflict",
                      name: result.hostConflict,
                    });
                  else if (result && result.limit)
                    setError({ kind: "shortcutLimit" });
                  else setError(null);
                },
              }),
              owner
                ? React.createElement(
                    "span",
                    {
                      className: "lso-shortcut-warning",
                      title: t("hostShortcutWarning").replace("{name}", owner),
                    },
                    t("hostShortcutWarning").replace("{name}", owner),
                  )
                : null,
            );
          }
          function reactIcon(name) {
            return React.createElement(
              "svg",
              {
                viewBox: "0 0 24 24",
                "aria-hidden": "true",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.7",
                strokeLinecap: "round",
                strokeLinejoin: "round",
              },
              React.createElement("path", { d: PATHS[name] }),
            );
          }
          function iconButton(icon, label, disabled, onClick) {
            return React.createElement(
              "button",
              {
                type: "button",
                className: "lso-icon-button",
                disabled: disabled,
                title: label,
                "aria-label": label,
                onClick: onClick,
              },
              reactIcon(icon),
            );
          }
          function moreSwitch(id, name, more) {
            var label = (more ? t("hide") : t("show")) + " " + name;
            return React.createElement(
              "button",
              {
                type: "button",
                role: "switch",
                className: "lso-more-switch",
                "aria-checked": more,
                "aria-label": label,
                title: label,
                onClick: function () {
                  toggleMore(id);
                },
              },
              React.createElement(
                "span",
                { className: "lso-more-switch-label", "aria-hidden": "true" },
                t("more"),
              ),
              React.createElement(
                "span",
                { className: "lso-switch-track", "aria-hidden": "true" },
                React.createElement("span"),
              ),
            );
          }
          function optimizeSwitch(id, name) {
            var on = config.optimizePages[id] !== false,
              label = t("optimize") + " " + name;
            return React.createElement(
              "button",
              {
                type: "button",
                role: "switch",
                className: "lso-more-switch",
                "aria-checked": on,
                "aria-label": label,
                title: config.optimize ? label : t("optimizeDisabled"),
                disabled: !config.optimize,
                onClick: function () {
                  var next = Object.assign({}, config.optimizePages);
                  if (on) next[id] = false;
                  else delete next[id];
                  update({ optimizePages: next });
                },
              },
              React.createElement(
                "span",
                { className: "lso-more-switch-label", "aria-hidden": "true" },
                t("optimize"),
              ),
              React.createElement(
                "span",
                { className: "lso-switch-track", "aria-hidden": "true" },
                React.createElement("span"),
              ),
            );
          }
          function clearLinkForm() {
            setEditing(null);
            setLinkName("");
            setLinkUrl("");
            setLinkOpen("external");
            setError(null);
          }
          function editLink(item) {
            setEditing(item.id);
            setLinkName(item.label);
            setLinkUrl(item.url);
            setLinkOpen(item.open || "external");
            setError(null);
            if (linkSection.current) linkSection.current.open = true;
            if (linkNameInput.current) linkNameInput.current.focus();
          }
          function saveLink() {
            var name = linkName.trim(),
              url = linkUrl.trim(),
              previous = editing && linkFor(editing);
            if (!name || !safeUrl(url)) {
              setError({ kind: "invalid" });
              return;
            }
            if (!previous && config.links.length >= MAX_LINKS) {
              setError({ kind: "linkLimit" });
              return;
            }
            var id = previous && previous.id;
            while (!id || (!previous && (linkFor(id) || config.order.includes(id))))
              id = "link-" + Math.random().toString(36).slice(2, 11);
            var replacement = { id: id, label: name, url: url, open: linkOpen };
            update({
              links: previous ? config.links.map(function (item) {
                return item.id === id ? replacement : item;
              }) : config.links.concat(replacement),
              order: previous ? config.order : config.order.concat(id),
            });
            clearLinkForm();
          }
          function replacePreferences(next) {
            var toRestore = config.more.filter(function (id) { return !next.more.includes(id); });
            alignmentTried.clear();
            update(next);
            toRestore.forEach(function (id) {
              if (!targets.has(id) && entries.some(function (entry) { return entry.id === id; })) pinEntry(id);
            });
            clearLinkForm();
          }
          function exportPreferences() {
            setBackup(JSON.stringify({ plugin: BUNDLE, version: 1, preferences: config }, null, 2));
            setError(null);
            window.requestAnimationFrame(function () {
              if (backupInput.current) {
                backupInput.current.focus();
                backupInput.current.select();
              }
            });
          }
          function importPreferences() {
            var document;
            try {
              if (backup.length <= 256000) document = JSON.parse(backup);
            } catch (_) {}
            if (!document || document.plugin !== BUNDLE || document.version !== 1 ||
                !document.preferences || !Array.isArray(document.preferences.order) ||
                !Array.isArray(document.preferences.more) || !Array.isArray(document.preferences.links)) {
              setError({ kind: "invalidConfig" });
              return;
            }
            if (window.confirm(t("confirmImport"))) replacePreferences(normalize(document.preferences));
          }
          var entryItems = ordered(),
            allItems = orderedAll(),
            allIds = allItems.map(function (item) {
              return item.id;
            }),
            linkItems = orderedLinks(),
            linkLimitReached = config.links.length >= MAX_LINKS,
            errorMessage = errorText(),
            noticeMessage =
              errorMessage || (linkLimitReached ? t("linkLimit") : "");
          var list = allItems.map(function (item, index) {
            if (item.type === "link") {
              return React.createElement(
                "li",
                {
                  key: item.id,
                  className: "lso-entry-row lso-link-row",
                  "data-state": "more",
                  "data-lso-sort-id": item.id,
                  "data-lso-row-kind": "link",
                },
                React.createElement(
                  "div",
                  { className: "lso-entry-main" },
                  React.createElement(
                    "div",
                    { className: "lso-entry-title" },
                    React.createElement("strong", null, item.label),
                    React.createElement(
                      "span",
                      {
                        className: "lso-entry-badge",
                        "data-state": "more",
                      },
                      t("custom"),
                    ),
                    React.createElement(
                      "span",
                      {
                        className: "lso-entry-badge",
                        "data-state": "more",
                      },
                      t("more"),
                    ),
                  ),
                  React.createElement("small", null, item.url + " · " + t(
                    item.open === "builtin" ? "linkBuiltIn" : item.open === "current" ? "linkCurrent" : "linkExternal",
                  )),
                ),
                React.createElement(
                  "div",
                  { className: "lso-shortcut-cell" },
                  field(item.id, item.label),
                ),
                React.createElement(
                  "div",
                  { className: "lso-entry-actions" },
                  React.createElement(
                    "div",
                    { className: "lso-actions" },
                    iconButton(
                      "up",
                      t("up") + " " + item.label,
                      index === 0,
                      function () {
                        move(item.id, -1, allIds);
                      },
                    ),
                    iconButton(
                      "down",
                      t("down") + " " + item.label,
                      index === allItems.length - 1,
                      function () {
                        move(item.id, 1, allIds);
                      },
                    ),
                    iconButton(
                      "edit",
                      t("linkEdit") + " " + item.label,
                      false,
                      function () { editLink(item); },
                    ),
                    iconButton(
                      "trash",
                      t("remove") + " " + item.label,
                      false,
                      function () {
                        var nextShortcuts = Object.assign({}, config.shortcuts);
                        delete nextShortcuts[item.id];
                        update({
                          links: config.links.filter(function (x) {
                            return x.id !== item.id;
                          }),
                          order: config.order.filter(function (id) {
                            return id !== item.id;
                          }),
                          shortcuts: nextShortcuts,
                        });
                        if (editing === item.id) clearLinkForm();
                      },
                    ),
                  ),
                ),
              );
            }
            var more = config.more.includes(item.id),
              compatState = compat.seen[item.id],
              sourceLabel = String(item.registrant || "").trim(),
              compatLabel =
                compatState === "needs"
                  ? config.optimize &&
                    config.optimizePages[item.id] !== false
                    ? t("fixed")
                    : t("needsFix")
                  : compatState === "ok"
                    ? t("alreadyFits")
                    : "";
            return React.createElement(
              "li",
              {
                key: item.id,
                className: "lso-entry-row",
                "data-state": more ? "more" : "sidebar",
                "data-lso-sort-id": item.id,
                "data-lso-row-kind": "entry",
              },
              React.createElement(
                "div",
                { className: "lso-entry-main" },
                React.createElement(
                  "div",
                  { className: "lso-entry-title" },
                  React.createElement("strong", null, item.label),
                  React.createElement(
                    "span",
                    {
                      className: "lso-entry-badge",
                      "data-state": more ? "more" : "sidebar",
                    },
                    more ? t("inMore") : t("onSidebar"),
                  ),
                  compatLabel
                    ? React.createElement(
                        "span",
                        {
                          className: "lso-entry-badge",
                          "data-state":
                            compatState === "needs"
                              ? config.optimize &&
                                config.optimizePages[item.id] !== false
                                ? "fixed"
                                : "needs"
                              : "ok",
                        },
                        compatLabel,
                      )
                    : null,
                ),
                sourceLabel && !/^[A-Z0-9]{1,4}$/.test(sourceLabel)
                  ? React.createElement("small", null, sourceLabel)
                  : null,
              ),
              React.createElement(
                "div",
                { className: "lso-shortcut-cell" },
                field(item.id, item.label),
              ),
              React.createElement(
                "div",
                { className: "lso-entry-actions" },
                React.createElement(
                  "div",
                  { className: "lso-switches" },
                  moreSwitch(item.id, item.label, more),
                  optimizeSwitch(item.id, item.label),
                ),
                React.createElement(
                  "div",
                  { className: "lso-actions" },
                  iconButton(
                    "up",
                    t("up") + " " + item.label,
                    index === 0,
                    function () {
                      move(item.id, -1, allIds);
                    },
                  ),
                  iconButton(
                    "down",
                    t("down") + " " + item.label,
                    index === allItems.length - 1,
                    function () {
                      move(item.id, 1, allIds);
                    },
                  ),
                ),
              ),
            );
          });
          return React.createElement(
            "div",
            { className: "lso-settings" },
            React.createElement(
              "header",
              { className: "lso-settings-header" },
              React.createElement("h2", null, t("settings")),
              React.createElement("p", { className: "lso-intro" }, t("hint")),
            ),
            noticeMessage
              ? React.createElement(
                  "div",
                  {
                    className: "lso-notice lso-error",
                    role: "alert",
                    "aria-live": "polite",
                  },
                  noticeMessage,
                )
              : null,
            React.createElement(
              "section",
              {
                className: "lso-settings-section",
                "aria-labelledby": "lso-settings-more-mode",
              },
              React.createElement(
                "h3",
                { id: "lso-settings-more-mode" },
                t("moreMenu"),
              ),
              React.createElement(
                "p",
                { className: "lso-section-hint" },
                t("moreModeHint"),
              ),
              React.createElement(
                "div",
                {
                  className: "lso-mode-options",
                  role: "radiogroup",
                  "aria-label": t("moreMode"),
                },
                ["click", "hover"].map(function (mode) {
                  return React.createElement(
                    "button",
                    {
                      key: mode,
                      type: "button",
                      role: "radio",
                      className: "lso-mode-option",
                      "aria-checked": config.moreMode === mode,
                      "data-lso-mode": mode,
                      onClick: function () {
                        update({ moreMode: mode });
                      },
                    },
                    t(mode === "click" ? "moreModeClick" : "moreModeHover"),
                  );
                }),
              ),
              React.createElement(
                "div",
                { className: "lso-section-heading", style: { marginTop: "8px" } },
                React.createElement(
                  "span",
                  { id: "lso-settings-current-entry" },
                  t("showCurrentEntry"),
                ),
                React.createElement(
                  "button",
                  {
                    type: "button",
                    role: "switch",
                    className: "lso-more-switch",
                    "aria-checked": config.showCurrentEntry,
                    "aria-labelledby": "lso-settings-current-entry",
                    onClick: function () {
                      update({ showCurrentEntry: !config.showCurrentEntry });
                    },
                  },
                  React.createElement(
                    "span",
                    { className: "lso-switch-track", "aria-hidden": "true" },
                    React.createElement("span"),
                  ),
                ),
              ),
            ),
            React.createElement(
              "section",
              {
                className: "lso-settings-section",
                "aria-labelledby": "lso-settings-peek",
              },
              React.createElement(
                "div",
                { className: "lso-section-heading lso-toggle-heading" },
                React.createElement(
                  "div",
                  { className: "lso-setting-copy" },
                  React.createElement(
                    "h3",
                    { id: "lso-settings-peek" },
                    t("peek"),
                  ),
                  React.createElement(
                    "p",
                    { className: "lso-section-hint" },
                    t("peekHint"),
                  ),
                ),
                React.createElement(
                  "button",
                  {
                    type: "button",
                    role: "switch",
                    className: "lso-more-switch",
                    "aria-checked": config.peek,
                    "aria-label": t("peek"),
                    onClick: function () {
                      update({ peek: !config.peek });
                    },
                  },
                  React.createElement(
                    "span",
                    {
                      className: "lso-more-switch-label",
                      "aria-hidden": "true",
                    },
                    t(config.peek ? "peekOn" : "peekOff"),
                  ),
                  React.createElement(
                    "span",
                    { className: "lso-switch-track", "aria-hidden": "true" },
                    React.createElement("span"),
                  ),
                ),
              ),
            ),
            React.createElement(
              "section",
              {
                className: "lso-settings-section",
                "aria-labelledby": "lso-settings-display-fix",
              },
              React.createElement(
                "div",
                { className: "lso-section-heading lso-toggle-heading" },
                React.createElement(
                  "div",
                  { className: "lso-setting-copy" },
                  React.createElement(
                    "h3",
                    { id: "lso-settings-display-fix" },
                    t("displayFix"),
                  ),
                  React.createElement(
                    "p",
                    { className: "lso-section-hint" },
                    t("displayFixHint"),
                  ),
                ),
                React.createElement(
                  "button",
                  {
                    type: "button",
                    role: "switch",
                    className: "lso-more-switch",
                    "aria-checked": config.optimize,
                    "aria-label": t("autoOptimize"),
                    onClick: function () {
                      update({ optimize: !config.optimize });
                    },
                  },
                  React.createElement(
                    "span",
                    {
                      className: "lso-more-switch-label",
                      "aria-hidden": "true",
                    },
                    t(config.optimize ? "peekOn" : "peekOff"),
                  ),
                  React.createElement(
                    "span",
                    { className: "lso-switch-track", "aria-hidden": "true" },
                    React.createElement("span"),
                  ),
                ),
              ),
              Object.keys(compat.seen).some(function (id) {
                return compat.seen[id] === "needs";
              })
                ? React.createElement(
                    "p",
                    { className: "lso-section-hint" },
                    t("detectedCount").replace(
                      "{count}",
                      Object.keys(compat.seen).filter(function (id) {
                        return compat.seen[id] === "needs";
                      }).length,
                    ),
                  )
                : null,
            ),
            React.createElement(
              "section",
              {
                className: "lso-settings-section",
                "aria-labelledby": "lso-settings-entries",
              },
              React.createElement(
                "div",
                { className: "lso-section-heading" },
                React.createElement(
                  "h3",
                  { id: "lso-settings-entries" },
                  t("entries"),
                ),
                React.createElement(
                  "span",
                  { className: "lso-section-count" },
                  t("itemCount")
                    .replace("{count}", allItems.length)
                    .replace("{entries}", entryItems.length)
                    .replace("{links}", linkItems.length),
                ),
              ),
              React.createElement(
                "p",
                { className: "lso-section-hint" },
                t("entriesHint"),
              ),
              list.length
                ? React.createElement(
                    "ul",
                    { className: "lso-settings-list" },
                    list,
                  )
                : React.createElement(
                    "p",
                    { className: "lso-empty" },
                    t("noEntries"),
                  ),
            ),
            React.createElement(
              "details",
              { className: "lso-settings-section lso-disclosure", ref: linkSection },
              React.createElement(
                "summary",
                null,
                React.createElement(
                  "span",
                  { className: "lso-summary-title" },
                  React.createElement("span", null, t("custom")),
                  React.createElement(
                    "span",
                    { className: "lso-section-count" },
                    t("linkCount").replace("{count}", config.links.length),
                  ),
                ),
              ),
              React.createElement(
                "div",
                { className: "lso-disclosure-body" },
                React.createElement(
                  "p",
                  { className: "lso-section-hint" },
                  t("linksHint"),
                ),
                React.createElement(
                  "form",
                  { className: "lso-link-form", onSubmit: function (event) {
                    event.preventDefault();
                    saveLink();
                  } },
                  React.createElement(
                    "label",
                    { className: "lso-field" },
                    React.createElement("span", null, t("label")),
                    React.createElement("input", {
                      ref: linkNameInput,
                      maxLength: 60,
                      value: linkName,
                      placeholder: t("label"),
                      "aria-label": t("label"),
                      onChange: function (e) {
                        setLinkName(e.target.value);
                        setError(null);
                      },
                    }),
                  ),
                  React.createElement(
                    "label",
                    { className: "lso-field" },
                    React.createElement("span", null, t("url")),
                    React.createElement("input", {
                      type: "url",
                      maxLength: 2048,
                      value: linkUrl,
                      placeholder: t("url"),
                      "aria-label": t("url"),
                      onChange: function (e) {
                        setLinkUrl(e.target.value);
                        setError(null);
                      },
                    }),
                  ),
                  React.createElement(
                    "label",
                    { className: "lso-field" },
                    React.createElement("span", null, t("linkOpen")),
                    React.createElement("select", {
                      title: t("linkLocationHint"),
                      value: linkOpen,
                      onChange: function (event) { setLinkOpen(event.target.value); },
                    }, [
                      ["external", "linkExternal"], ["builtin", "linkBuiltIn"], ["current", "linkCurrent"],
                    ].map(function (option) {
                      return React.createElement("option", {
                        key: option[0], value: option[0],
                        disabled: option[0] === "current" && !/^https?:$/.test(window.location.protocol),
                      }, t(option[1]));
                    })),
                  ),
                  React.createElement(
                    "button",
                    {
                      type: "submit",
                      className: "lso-add lso-add-primary",
                      disabled:
                        (!editing && linkLimitReached) ||
                        !linkName.trim() ||
                        !safeUrl(linkUrl.trim()),
                    },
                    t(editing ? "saveLink" : "add"),
                  ),
                  editing ? React.createElement("button", {
                    type: "button", className: "lso-add", onClick: clearLinkForm,
                  }, t("cancel")) : null,
                ),
              ),
            ),
            React.createElement("details", { className: "lso-settings-section lso-disclosure" },
              React.createElement("summary", null, t("preferences")),
              React.createElement("div", { className: "lso-disclosure-body" },
                React.createElement("textarea", {
                  ref: backupInput, className: "lso-backup-text", "aria-label": t("preferences"),
                  value: backup, maxLength: 256000, spellCheck: false,
                  onChange: function (event) { setBackup(event.target.value); setError(null); },
                }),
                React.createElement("div", { className: "lso-backup-actions" },
                  React.createElement("button", { type: "button", className: "lso-add", onClick: exportPreferences }, t("exportConfig")),
                  React.createElement("button", { type: "button", className: "lso-add", disabled: !backup.trim(), onClick: importPreferences }, t("importConfig")),
                  React.createElement("button", { type: "button", className: "lso-add", onClick: function () {
                    if (window.confirm(t("confirmReset"))) replacePreferences(normalize(null));
                  } }, t("resetConfig")),
                ),
              ),
            ),
            React.createElement(
              "div",
              { className: "lso-settings-footer" },
              React.createElement("span", null, t("saved")),
            ),
          );
        }
        ctx.effect(function () {
          var style = el("style");
          style.setAttribute("data-plugin", "dsh-liao-sidebar");
          style.setAttribute("data-lso-style", "");
          style.textContent = CSS;
          document.head.appendChild(style);
          return function () {
            style.remove();
          };
        }, "sidebar-organizer: styles");
        ctx.effect(function () {
          return ctx.locale.register(NS, TEXT);
        }, "sidebar-organizer: dictionaries");
        ctx.effect(function () {
          function sync() {
            refresh();
            scheduleCompat();
          }
          var observer = new window.MutationObserver(function (records) {
            if (
              peek.active &&
              peek.frame &&
              peek.frame.hasAttribute("data-sidebar-collapsed") &&
              peek.frame.hasAttribute("data-lso-peek")
            )
              closePeek(false, true);
            if (
              records.some(function (record) {
                return (
                  record.attributeName === "data-sidebar-collapsed" ||
                  record.attributeName === "data-sidebar-drawer" ||
                  record.attributeName === "data-lso-peek" ||
                  record.attributeName === "aria-keyshortcuts" ||
                  (nav &&
                    (record.target === nav || nav.contains(record.target))) ||
                  Array.from(record.addedNodes)
                    .concat(Array.from(record.removedNodes))
                    .some(function (node) {
                      return (
                        node.nodeType === 1 &&
                        (node.matches(
                          "nav[aria-label],[aria-keyshortcuts]",
                        ) ||
                          node.querySelector(
                            "nav[aria-label],[aria-keyshortcuts]",
                          ))
                      );
                    })
                );
              })
            )
              sync();
          });
          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [
              "aria-current",
              "aria-selected",
              "data-state",
              "class",
              "data-sidebar-collapsed",
              "data-sidebar-drawer",
              "data-lso-peek",
              "aria-keyshortcuts",
            ],
          });
          var nativeMenuObserver = new window.MutationObserver(
            function (records) {
              var relevant = records.some(function (record) {
                if (record.type === "attributes")
                  return !triggerOwned && record.target === trigger;
                if (
                  nativeExtra &&
                  (record.target === nativeExtra ||
                    nativeExtra.contains(record.target))
                )
                  return true;
                if (
                  nativeMenu &&
                  (record.target === nativeMenu ||
                    nativeMenu.contains(record.target) ||
                    Array.from(record.removedNodes).some(function (node) {
                      return (
                        node === nativeMenu ||
                        (node.nodeType === 1 && node.contains(nativeMenu))
                      );
                    }))
                )
                  return true;
                return Array.from(record.addedNodes).some(function (node) {
                  return (
                    node.nodeType === 1 &&
                    (node.matches('[role="menu"]') ||
                      !!node.querySelector('[role="menu"]'))
                  );
                });
              });
              if (relevant) scheduleNativeMenu();
            },
          );
          nativeMenuObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["aria-expanded"],
          });
          function cancelDrag() {
            if (pointerPress || dragging || preview || insertionMarker)
              dragEnd({ target: null });
          }
          sync();
          var sub =
            ctx.slots.subscribe &&
            ctx.slots.subscribe("sidebar.panellist", sync);
          var panelSub =
            ctx.layout &&
            ctx.layout.panelInfo &&
            ctx.layout.panelInfo.subscribe &&
            ctx.layout.panelInfo.subscribe(sync);
          document.addEventListener("pointerdown", pointerDown, true);
          document.addEventListener("pointermove", pointerMove, true);
          document.addEventListener("pointerup", pointerUp, true);
          document.addEventListener("pointercancel", cancelDrag, true);
          document.addEventListener("dragstart", suppressNativeDrag, true);
          document.addEventListener("click", suppressDragClick, true);
          document.addEventListener("click", syncPinAction, true);
          document.addEventListener("keydown", dismiss, true);
          document.addEventListener("keydown", shortcuts, true);
          document.addEventListener("pointerover", peekPointerOver, true);
          document.addEventListener("pointerout", peekPointerOut, true);
          document.addEventListener("pointermove", peekPointerMove, true);
          document.addEventListener("focusin", peekFocusIn, true);
          document.addEventListener("focusout", peekFocusOut, true);
          document.addEventListener("pointerdown", peekPointerDown, true);
          document.addEventListener("click", peekClick, true);
          document.addEventListener("keydown", peekKeydown, true);
          window.addEventListener("resize", peekResize);
          window.addEventListener("resize", scheduleCompat);
          window.addEventListener("blur", peekBlur);
          window.addEventListener("blur", cancelDrag);
          return function () {
            alive = false;
            observer.disconnect();
            nativeMenuObserver.disconnect();
            if (nativeMenuFrame !== null) {
              if (typeof window.cancelAnimationFrame === "function")
                window.cancelAnimationFrame(nativeMenuFrame);
              else window.clearTimeout(nativeMenuFrame);
              nativeMenuFrame = null;
            }
            if (typeof sub === "function") sub();
            if (typeof panelSub === "function") panelSub();
            document.removeEventListener("pointerdown", pointerDown, true);
            document.removeEventListener("pointermove", pointerMove, true);
            document.removeEventListener("pointerup", pointerUp, true);
            document.removeEventListener("pointercancel", cancelDrag, true);
            document.removeEventListener("dragstart", suppressNativeDrag, true);
            document.removeEventListener("click", suppressDragClick, true);
            document.removeEventListener("click", syncPinAction, true);
            document.removeEventListener("keydown", dismiss, true);
            document.removeEventListener("keydown", shortcuts, true);
            document.removeEventListener("pointerover", peekPointerOver, true);
            document.removeEventListener("pointerout", peekPointerOut, true);
            document.removeEventListener("pointermove", peekPointerMove, true);
            document.removeEventListener("focusin", peekFocusIn, true);
            document.removeEventListener("focusout", peekFocusOut, true);
            document.removeEventListener("pointerdown", peekPointerDown, true);
            document.removeEventListener("click", peekClick, true);
            document.removeEventListener("keydown", peekKeydown, true);
            window.removeEventListener("resize", peekResize);
            window.removeEventListener("resize", scheduleCompat);
            window.removeEventListener("blur", peekBlur);
            window.removeEventListener("blur", cancelDrag);
            document.documentElement.removeAttribute("data-lso-drag-active");
            clearMarkers();
            stopCompat();
            closePeek(false, true);
            removeRailClone();
            resetMoreHover();
            clearCurrentProxy();
            if (preview) preview.remove();
            if (trigger && triggerOwned) trigger.remove();
            if (trigger && !triggerOwned) {
              trigger.removeAttribute("data-lso-official-trigger");
              trigger.removeAttribute("data-lso-active");
              trigger.removeAttribute("aria-current");
            }
            unbindTrigger();
            removeNativeExtra();
            if (menu) menu.remove();
            if (zone) zone.remove();
            document
              .querySelectorAll(
                "[data-lso-entry],[data-lso-anchor],[data-lso-link],[data-lso-more],[data-lso-dragging],[data-lso-target],[data-lso-before],[data-lso-after],[data-lso-selection],[data-lso-official-row]",
              )
              .forEach(function (node) {
                node.removeAttribute("data-lso-entry");
                node.removeAttribute("data-lso-anchor");
                node.removeAttribute("data-lso-link");
                node.removeAttribute("data-lso-more");
                node.removeAttribute("data-lso-dragging");
                node.removeAttribute("data-lso-target");
                node.removeAttribute("data-lso-before");
                node.removeAttribute("data-lso-after");
                node.removeAttribute("data-lso-selection");
                node.removeAttribute("data-lso-official-row");
              });
            if (activeCtx === ctx) activeCtx = null;
            original.forEach(function (old, node) {
              if (old) {
                if (old.display)
                  node.style.setProperty("display", old.display, old.priority);
                else node.style.removeProperty("display");
              }
            });
            originalOrder.forEach(function (order, node) {
              node.style.order = order;
            });
            targets.forEach(function (node) {
              if (originalDrag.get(node) === null)
                node.removeAttribute("draggable");
              else if (originalDrag.has(node))
                node.setAttribute("draggable", originalDrag.get(node));
            });
            targets.clear();
            templates.clear();
            menuGlyphs.clear();
            original.clear();
            originalOrder.clear();
            originalDrag.clear();
          };
        }, "sidebar-organizer: global navigation");
        ctx.effect(function () {
          return ctx.slots.inject("plugins.bundle.config", function () {
            return ctx.slots.register(
              { name: "plugins.bundle.config", key: BUNDLE, locale: NS },
              renderSettings,
            );
          });
        }, "sidebar-organizer: settings");
        ctx.effect(function () {
          return ctx.slots.inject("sidebar.panellist.actions", function () {
            return ctx.slots.register(
              { name: "sidebar.panellist.actions", id: "liao-sidebar-links", order: -10 },
              renderMoreAdditions,
            );
          });
        }, "sidebar-organizer: More entries");
        if (typeof ctx.inject === "function") {
          ctx.inject(["sidebarRight", "sidebarRightTabs"], function (scope) {
            scope.effect(function () {
              sidebarBrowser = scope.sidebarRight;
              return function () { sidebarBrowser = null; };
            }, "sidebar-organizer: browser links");
          });
        }
        ctx.effect(function () {
          if (legacy && !read()) persist();
          var handler = function () {
            var raw = read();
            if (raw) {
              config = normalize(raw);
              listeners.forEach(function (fn) {
                fn();
              });
              refresh();
              scheduleCompat();
            }
          };
          window.addEventListener("storage", handler);
          return function () {
            window.removeEventListener("storage", handler);
          };
        }, "sidebar-organizer: storage");
      }
      return {
        name: "sidebar-organizer",
        inject: ["slots", "locale", "layout"],
        apply: apply,
      };
    },
  });
