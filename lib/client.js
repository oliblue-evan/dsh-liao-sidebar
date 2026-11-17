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
          entries: "侧栏入口",
          more: "更多",
          moreMenu: "「更多」菜单",
          moreMode: "打开方式",
          moreModeClick: "点击打开",
          moreModeHover: "悬停打开",
          moreModeHint:
            "「更多」中的入口和自定义链接都使用官方菜单。选择悬停时，指针在「更多」上稍作停留就会自动展开。",
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
          entriesHint: "调整显示位置和排序；修改会立即同步到侧栏。",
          linksHint:
            "添加常用网页；链接会和侧栏入口共用「更多」中的显示顺序。",
          entryCount: "{count} 个入口",
          linkCount: "{count} 个链接",
          onSidebar: "侧栏显示",
          inMore: "收在更多",
          label: "链接名称",
          url: "网址（https://）",
          add: "添加链接",
          remove: "移除",
          invalid: "请输入有效的 HTTP 或 HTTPS 网址。",
          shortcutConflict: "该快捷键已被「{name}」使用。",
          shortcutLimit: "最多可设置 100 个快捷键。",
          linkLimit: "最多可添加 30 个自定义链接。",
          saved: "设置会立即生效，并保存在当前设备。",
          noEntries: "当前没有可整理的侧栏入口。",
        },
        en: {
          settings: "Sidebar Organizer settings",
          entries: "Sidebar entries",
          more: "More",
          moreMenu: "More menu",
          moreMode: "Open with",
          moreModeClick: "Click",
          moreModeHover: "Hover",
          moreModeHint:
            "Entries and custom links use the official More menu. With hover, the menu opens after a short pause over More.",
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
          entriesHint:
            "Change visibility and order. Updates appear in the sidebar immediately.",
          linksHint:
            "Add frequently used web pages. Links share the More order with sidebar entries.",
          entryCount: "{count} entries",
          linkCount: "{count} links",
          onSidebar: "On sidebar",
          inMore: "In More",
          label: "Link name",
          url: "URL (https://)",
          add: "Add link",
          remove: "Remove",
          invalid: "Enter a valid HTTP or HTTPS URL.",
          shortcutConflict: 'That shortcut is already used by "{name}".',
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
      };
      var CSS = `
.lso-menu[hidden]{display:none!important}
[data-lso-peek]{grid-template-columns:var(--lso-peek-grid,0px minmax(0,1fr) 0px)!important;transition:none!important}
[data-lso-peek-restoring],[data-lso-peek-restoring] *{transition:none!important;animation:none!important}
[data-lso-peek-clone],[data-lso-peek-clone] *{animation:none!important;transition:none!important}
[data-lso-peek] [data-lso-peek-column]{position:relative!important;left:var(--lso-peek-left,8px)!important;top:var(--lso-peek-top,56px)!important;width:var(--lso-peek-width,280px)!important;height:var(--lso-peek-height,calc(100vh - 68px))!important;min-width:0!important;max-height:var(--lso-peek-max-height,calc(100vh - 68px))!important;overflow:hidden!important;z-index:19!important;border:1px solid var(--dsw-alias-border-l3,#ffffff14)!important;border-radius:16px!important;background:var(--lso-peek-bg,var(--dsw-specific-sidebar-fill,var(--dsw-alias-bg-layer-2,#2c2c2e)))!important;box-shadow:var(--dsw-elevation-prominent,0 0 0 .5px #ffffff14,0 16px 40px #00000066)!important;transform:none!important;transition:none!important;backdrop-filter:var(--lso-peek-blur,none);-webkit-backdrop-filter:var(--lso-peek-blur,none)}
[data-lso-peek] [data-lso-peek-column]{min-width:280px!important}
[data-lso-peek-column][data-lso-peek-closing]{pointer-events:none!important}
[data-lso-peek] [data-lso-peek-column]>*{height:100%!important;max-height:100%!important}
[data-lso-peek] [data-lso-peek-column] [data-window-drag]{-webkit-app-region:no-drag!important;cursor:default!important}
[data-lso-peek-hidden]{display:none!important}
html [data-lso-page-fix=true]{box-sizing:border-box!important;padding-top:calc(var(--lso-page-fix-base-top,0px) + var(--lso-page-fix-top,0px))!important;padding-right:calc(var(--lso-page-fix-base-right,0px) + var(--lso-page-fix-x,0px))!important;padding-bottom:calc(var(--lso-page-fix-base-bottom,0px) + var(--lso-page-fix-bottom,0px))!important;padding-left:calc(var(--lso-page-fix-base-left,0px) + var(--lso-page-fix-x,0px))!important}
.lso-peek-row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:8px 0}
.lso-peek-row .lso-more-switch-label{color:var(--dsw-alias-label-primary,#eee);font-size:13px}
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
.lso-menu{display:flex;flex-direction:column;gap:4px;width:100%;min-width:0;max-width:100%;max-height:min(50vh,420px);overflow-y:auto;overflow-x:hidden;padding:0;box-sizing:border-box;flex:0 0 auto}
.lso-menu .lso-item{width:100%;min-width:0;max-width:100%;box-sizing:border-box;cursor:pointer;justify-content:flex-start!important;gap:10px!important;padding:0 12px!important;text-align:left}
.lso-native-extra{display:flex;flex-direction:column;gap:0;width:100%;min-width:0;max-width:100%;padding:0 0 4px;box-sizing:border-box;flex:0 0 auto}
.lso-native-extra:not(:empty){margin-bottom:2px;border-bottom:.5px solid var(--dsw-alias-border-l2,#8884)}
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
.lso-shortcut-cell{min-width:0}
.lso-capture{width:158px;max-width:100%;height:30px;padding:0 8px;border:1px solid var(--dsw-alias-border-l2,#8883);border-radius:8px;background:var(--dsw-alias-bg-layer-2,#8881);text-align:center;cursor:pointer;font-size:12px!important}
.lso-capture::placeholder{color:var(--dsw-alias-label-tertiary,#999)}
.lso-link-form{display:grid;grid-template-columns:minmax(110px,.8fr) minmax(180px,1.5fr) auto;gap:8px;margin-top:10px;padding:10px;border-radius:10px;background:var(--dsw-alias-bg-layer-2,#8881)}
.lso-field{display:flex;flex-direction:column;gap:4px;min-width:0}
.lso-field>span{color:var(--dsw-alias-label-tertiary,#999);font-size:11px;line-height:16px}
.lso-link-form input{min-width:0;height:32px;padding:0 9px;border:1px solid var(--dsw-alias-border-l2,#8883);border-radius:8px;background:var(--dsw-alias-bg-layer-1,#8881);font-size:12px}
.lso-settings .lso-add{align-self:end;height:32px;padding:0 12px;white-space:nowrap}
.lso-settings .lso-add-primary{background:color-mix(in srgb,var(--dsw-alias-state-business-primary,#6683ee) 14%,transparent);border-color:color-mix(in srgb,var(--dsw-alias-state-business-primary,#6683ee) 45%,transparent);color:var(--dsw-alias-state-business-primary,#8099ff)}
.lso-settings .lso-add:disabled{opacity:.4;cursor:default}
.lso-link-list{margin-top:8px!important}
.lso-settings .lso-link-list .lso-entry-row{padding:9px 0}
.lso-settings .lso-link-list .lso-entry-row:first-child{padding-top:8px}
.lso-settings .lso-link-list .lso-entry-row:last-child{padding-bottom:0}
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
            moreMode: v.moreMode === "hover" ? "hover" : "click",
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
            links.push({ id: id, label: label, url: url });
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
          original = new Map(),
          originalOrder = new Map(),
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
          nativeMenuFrame = null,
          currentProxy = null,
          currentProxyId = null,
          zone = null,
          preview = null,
          insertionMarker = null,
          dragging = null,
          pointerPress = null,
          dropTarget = null,
          sidebarCollapsed = null,
          dragClick = false,
          moreOpenTimer = null,
          moreCloseTimer = null,
          moreHoverOpened = false,
          moreHoverClick = false,
          moreHoverNodes = new WeakSet(),
          peek = {
            active: false,
            pinned: false,
            owned: false,
            pointerInside: false,
            frame: null,
            column: null,
            trigger: null,
            anchor: null,
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
            return (
              item.type === "link" ||
              (config.more.includes(item.id) && targets.has(item.id))
            );
          });
        }
        function findNav() {
          return (
            Array.from(document.querySelectorAll("nav[aria-label]")).find(
              function (node) {
                return /global panels|全局面板/i.test(
                  node.getAttribute("aria-label") || "",
                );
              },
            ) || null
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
          return !!(
            trigger &&
            !triggerOwned &&
            trigger.getAttribute("aria-expanded") === "true"
          );
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
                ".lso-menu,.lso-native-extra,[role=menu]",
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
          var r = peek.anchor,
            frameRect = peek.frame.getBoundingClientRect(),
            top = Math.max(
              8,
              Math.round(
                (r && r.bottom ? r.bottom : frameRect.top + 44) +
                  6 -
                  frameRect.top,
              ),
            ),
            left = Math.max(
              8,
              Math.min(
                32,
                Math.round(
                  (r && r.left ? r.left : frameRect.left + 16) -
                    frameRect.left -
                    8,
                ),
              ),
            ),
            width = Math.max(
              280,
              peek.naturalWidth > 0 ? peek.naturalWidth : 280,
            ),
            availableHeight = Math.max(
              0,
              window.innerHeight - frameRect.top - top - 12,
            ),
            height = Math.min(
              availableHeight,
              Math.max(280, Math.round(availableHeight * 0.8)),
            );
          peek.frame.style.setProperty("--lso-peek-top", top + "px");
          peek.frame.style.setProperty("--lso-peek-left", left + "px");
          peek.frame.style.setProperty("--lso-peek-width", width + "px");
          peek.frame.style.setProperty("--lso-peek-height", height + "px");
          peek.frame.style.setProperty(
            "--lso-peek-max-height",
            height + "px",
          );
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
            grid =
              (collapsedTrack || railWidth + "px") +
              " minmax(0, 1fr) 0px";
          if (railWidth > 0) captureRailSnapshot(column, railRect);
          peek.active = true;
          peek.pinned = false;
          peek.owned = true;
          peek.pointerInside = true;
          peek.holdClosed = false;
          peek.frame = frame;
          peek.column = column;
          peek.trigger = trigger;
          peek.anchor = rect;
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
            if (peek.leadingClearance) {
              frame.style.setProperty(
                "--dsh-frame-leading-clearance",
                peek.leadingClearance,
              );
              peek.leadingClearanceApplied = true;
            }
          var naturalWidth = Math.max(
            column.getBoundingClientRect().width || 0,
            column.scrollWidth || 0,
          );
          if (naturalWidth > 0)
            peek.naturalWidth = Math.round(naturalWidth);
          frame.style.setProperty("--lso-peek-grid", grid);
          frame.setAttribute("data-lso-peek", "true");
          column.setAttribute("data-lso-peek-column", "");
          peek.columnDragExclude = column.getAttribute(
            "data-window-drag-exclude",
          );
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
          var strip = Array.from(
            column.querySelectorAll("[data-window-drag]"),
          ).find(function (node) {
            var button = node.querySelector("button[aria-label]");
            return (
              button &&
              (isOpenSidebarToggle(button) ||
                /收起侧边栏|collapse sidebar/i.test(
                  button.getAttribute("aria-label") || "",
                ))
            );
          });
          if (strip) {
            strip.setAttribute("data-lso-peek-hidden", "");
            peek.hiddenStrip = strip;
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
          peek.frame.style.removeProperty("--lso-peek-top");
          peek.frame.style.removeProperty("--lso-peek-left");
          peek.frame.style.removeProperty("--lso-peek-width");
          peek.frame.style.removeProperty("--lso-peek-height");
          peek.frame.style.removeProperty("--lso-peek-max-height");
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
              {
                opacity: 0,
                translate: "-10px 0px",
                scale: "0.985",
              },
              {
                opacity: 1,
                translate: "0px 0px",
                scale: "1",
              },
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
          peek.anchor = null;
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
          if (!peek.active || peek.closing) return;
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
          cancelPeekAnimation(peek.openAnimation);
          peek.openAnimation = null;
          var animation = peek.column.animate(
            [
              {
                opacity: 1,
                translate: "0px 0px",
                scale: "1",
              },
              {
                opacity: 0,
                translate: "-6px 0px",
                scale: "0.99",
              },
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
          peek.anchor = null;
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
          if (isOpenSidebarToggle(event.target) && !peek.active)
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
          if (event.target.closest &&
              event.target.closest(".lso-menu")) {
            window.setTimeout(function () {
              close();
            }, 0);
            return;
          }
          closePeek(true);
        }
        function peekKeydown(event) {
          if (!peek.active) return;
          if (event.key === "Escape") {
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
        function copyAppearance(source, clone) {
          var props = [
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
          var style = window.getComputedStyle(source);
          props.forEach(function (p) {
            var v = style.getPropertyValue(p);
            if (v) clone.style.setProperty(p, v);
          });
          clone.style.removeProperty("display");
          clone.style.setProperty("width", "100%", "important");
          clone.style.setProperty("min-width", "0", "important");
          clone.style.setProperty("max-width", "100%", "important");
          clone.style.setProperty("box-sizing", "border-box", "important");
          clone.style.setProperty("flex", "0 0 auto", "important");
          clone.style.setProperty("margin", "0", "important");
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
          var values = inMore(),
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
                dismissMenuSurface();
                window.open(item.url, "_blank", "noopener,noreferrer");
              });
            } else {
              var target = targets.get(item.id);
              if (!target) return;
              node = target.cloneNode(true);
              node.removeAttribute("id");
              node.classList.add("lso-item");
              node.removeAttribute("data-lso-more");
              node.setAttribute("data-lso-entry", item.id);
              node.draggable = false;
              if (container === nativeExtra) {
                node.setAttribute("role", "menuitem");
                node.setAttribute("tabindex", "-1");
              }
              attr(node, "data-lso-selected", String(selected(item.id)));
              copyAppearance(target, node);
              syncRowLabel(node, item.label, "data-lso-item-label");
              cloneIds(node);
              node.addEventListener("click", function (event) {
                event.preventDefault();
                dismissMenuSurface();
                target.click();
              });
            }
            if (config.shortcuts[item.id])
              node.appendChild(
                el("span", "lso-shortcut", pretty(config.shortcuts[item.id])),
              );
            node.style.order = String(index);
            container.appendChild(node);
          });
          container.setAttribute("data-signature", signature);
        }
        function dismissMenuSurface() {
          if (triggerOwned) {
            setOwnMenu(false);
            return;
          }
          if (!trigger) return;
          if (trigger.getAttribute("aria-expanded") !== "true") return;
          var button = trigger,
            closeNative = function () {
              if (
                button.isConnected &&
                button.getAttribute("aria-expanded") === "true"
              )
                button.click();
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
        function removeNativeExtra() {
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
            removeNativeExtra();
            updateTrigger();
            syncCurrentProxy();
            return;
          }
          nativeMenu = root;
          bindHoverSurface(root);
          attr(root, "data-window-drag-exclude", "true");
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
          if (!inMore().length) {
            nativeExtra.remove();
            nativeExtra = null;
          }
          updateTrigger();
          syncCurrentProxy();
        }
        function scheduleNativeMenu() {
          if (nativeMenuFrame !== null) return;
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
          if (triggerBound && triggerHandlers) {
            Object.keys(triggerHandlers).forEach(function (name) {
              triggerBound.removeEventListener(
                name,
                triggerHandlers[name],
              );
            });
          }
          trigger = null;
          triggerHost = null;
          triggerOwned = false;
          triggerBound = null;
          triggerHandlers = null;
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
                click: function () {
                  if (moreHoverClick) {
                    moreHoverClick = false;
                    scheduleNativeMenu();
                    return;
                  }
                  resetMoreHover();
                  scheduleNativeMenu();
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
            triggerBound.addEventListener(name, triggerHandlers[name]);
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
          moreHoverClick = false;
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
          }, 180);
        }
        function openMoreByHover() {
          if (!trigger || moreOpen()) return;
          if (triggerOwned && !menu) return;
          moreHoverOpened = true;
          if (triggerOwned) {
            setOwnMenu(true);
            return;
          }
          moreHoverClick = true;
          try {
            trigger.click();
          } finally {
            window.setTimeout(function () {
              moreHoverClick = false;
            }, 0);
          }
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
          var active =
            !moreOpen() &&
            !currentProxy &&
            ordered().some(function (item) {
              return config.more.includes(item.id) && selected(item.id);
            });
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
          attr(trigger, "data-lso-active", String(active));
          if (active) attr(trigger, "aria-current", "page");
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
        function syncCurrentProxy() {
          var active = ordered().find(function (item) {
            return (
              config.more.includes(item.id) &&
              targets.has(item.id) &&
              selected(item.id)
            );
          });
          if (!active || !trigger) {
            clearCurrentProxy();
            return;
          }
          var source = targets.get(active.id);
          if (!source) {
            clearCurrentProxy();
            return;
          }
          if (
            currentProxy &&
            currentProxyId === active.id &&
            currentProxy.parentNode === nav
          ) {
            copyAppearance(source, currentProxy);
            syncCurrentLabel(currentProxy, active.label);
            fitCurrentProxy(currentProxy, source);
            currentProxy.style.order = String(
              Number((triggerHost || trigger).style.order) - 0.5,
            );
            return;
          }
          clearCurrentProxy();
          var proxy = source.cloneNode(true);
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
          proxy.classList.add("lso-current-entry");
          copyAppearance(source, proxy);
          syncCurrentLabel(proxy, active.label);
          fitCurrentProxy(proxy, source);
          cloneIds(proxy);
          proxy.addEventListener("click", function (event) {
            event.preventDefault();
            if (!expanded) close();
            source.click();
          });
          currentProxy = proxy;
          currentProxyId = active.id;
          (triggerHost || trigger).before(proxy);
          proxy.style.order = String(
            Number((triggerHost || trigger).style.order) - 0.5,
          );
        }
        function close() {
          expanded = false;
          if (menu) menu.hidden = true;
          syncCurrentProxy();
          updateTrigger();
        }
        function dismiss(event) {
          if (event.key !== "Escape" || !expanded) return;
          if (
            !triggerOwned &&
            trigger &&
            trigger.getAttribute("aria-expanded") === "true"
          )
            return;
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
          if (trigger && !triggerOwned) {
            if (menu) {
              menu.remove();
              menu = null;
            }
            if (zone) {
              zone.hidden = true;
              if (zone.parentNode) zone.remove();
            }
            syncNativeMenu();
            return;
          }
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
            if (!dragging) {
              drawItems(menu);
              menu.hidden = !expanded;
              menu.style.order = trigger.style.order;
              if (trigger.nextElementSibling !== menu) trigger.after(menu);
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
          var movableNodes = new Set(targets.values());
          buttons.forEach(function (node) {
            if (movableNodes.has(node)) node.removeAttribute("data-lso-anchor");
            else attr(node, "data-lso-anchor", "true");
          });
          var nativeIds = entries
              .filter(function (item) {
                return item.movable && targets.has(item.id);
              })
              .map(function (item) {
                return item.id;
              }),
            linkIds = config.links.map(function (link) {
              return link.id;
            }),
            order = config.order.slice();
          nativeIds.concat(linkIds).forEach(function (id) {
            if (!order.includes(id)) order.push(id);
          });
          config.order = order.slice(0, MAX_ORDER_ITEMS);
          config.more = config.more.filter(function (id) {
            return !linkIds.includes(id);
          });
          var knownOrder = config.order.filter(function (id) {
            return targets.has(id);
          });
          knownOrder.forEach(function (id, index) {
            var node = targets.get(id);
            if (!original.has(node))
              original.set(node, {
                display: node.style.getPropertyValue("display"),
                priority: node.style.getPropertyPriority("display"),
              });
            if (!originalOrder.has(node))
              originalOrder.set(node, node.style.order);
            if (!originalDrag.has(node))
              originalDrag.set(node, node.getAttribute("draggable"));
            node.setAttribute("draggable", "false");
            attr(node, "data-lso-entry", id);
            node.style.order = String(100 + index);
            if (config.more.includes(id)) {
              node.style.setProperty("display", "none", "important");
            } else {
              var old = original.get(node);
              node.removeAttribute("data-lso-more");
              if (
                node.style.getPropertyValue("display") === "none" &&
                node.style.getPropertyPriority("display") === "important"
              ) {
                if (old.display)
                  node.style.setProperty("display", old.display, old.priority);
                else node.style.removeProperty("display");
              }
            }
          });
          var hidden = knownOrder.filter(function (id) {
            return config.more.includes(id);
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
          if (!hidden.length && !config.links.length) {
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
          (triggerHost || trigger).style.order = String(
            100 + knownOrder.length,
          );
          syncCurrentProxy();
          renderMenu();
          if (JSON.stringify(config) !== window.localStorage.getItem(KEY)) {
            persist();
          }
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
        function toggleMore(id) {
          var more = config.more.slice(),
            i = more.indexOf(id);
          if (i < 0) more.push(id);
          else more.splice(i, 1);
          update({ more: more });
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
          event.preventDefault();
          var link = config.links.find(function (x) {
            return x.id === id;
          });
          var node = targets.get(id);
          if (link) window.open(link.url, "_blank", "noopener,noreferrer");
          else if (node) node.click();
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
        function dropOn(target, id) {
          var to = target.getAttribute("data-lso-entry");
          if (!config.order.includes(id)) return;
          if (
            target.hasAttribute("data-lso-zone") ||
            target.hasAttribute("data-lso-trigger") ||
            target.hasAttribute("data-lso-official-trigger")
          ) {
            if (isLink(id)) return;
            if (!config.more.includes(id)) toggleMore(id);
          } else if (target.hasAttribute("data-lso-anchor")) {
            if (isLink(id)) return;
            var order = config.order.filter(function (x) {
              return x !== id;
            });
            order.unshift(id);
            update({
              order: order,
              more: config.more.filter(function (x) {
                return x !== id;
              }),
            });
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
            update({ order: order, more: more });
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
            return t(error.kind);
          }
          function field(id, name) {
            return React.createElement("input", {
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
                else if (result && result.limit)
                  setError({ kind: "shortcutLimit" });
                else setError(null);
              },
            });
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
          function add() {
            var name = linkName.trim(),
              url = linkUrl.trim();
            if (!name || !safeUrl(url)) {
              setError({ kind: "invalid" });
              return;
            }
            if (config.links.length >= MAX_LINKS) {
              setError({ kind: "linkLimit" });
              return;
            }
            var id;
            do {
              id = "link-" + Math.random().toString(36).slice(2, 11);
            } while (
              linkFor(id) ||
              entries.some(function (entry) {
                return entry.id === id;
              })
            );
            update({
              links: config.links.concat([
                {
                  id: id,
                  label: name,
                  url: url,
                },
              ]),
              order: config.order.concat([id]),
            });
            setLinkName("");
            setLinkUrl("");
            setError(null);
          }
          var nativeItems = ordered(),
            nativeIds = nativeItems.map(function (item) {
              return item.id;
            }),
            linkItems = orderedLinks(),
            linkIds = linkItems.map(function (link) {
              return link.id;
            }),
            linkLimitReached = config.links.length >= MAX_LINKS,
            errorMessage = errorText(),
            noticeMessage =
              errorMessage || (linkLimitReached ? t("linkLimit") : "");
          var list = nativeItems.map(function (item, index) {
            var more = config.more.includes(item.id),
              compatState = compat.seen[item.id],
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
                item.registrant
                  ? React.createElement("small", null, item.registrant)
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
                      move(item.id, -1, nativeIds);
                    },
                  ),
                  iconButton(
                    "down",
                    t("down") + " " + item.label,
                    index === nativeItems.length - 1,
                    function () {
                      move(item.id, 1, nativeIds);
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
            ),
            React.createElement(
              "section",
              {
                className: "lso-settings-section",
                "aria-labelledby": "lso-settings-peek",
              },
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
              React.createElement(
                "div",
                { className: "lso-peek-row" },
                React.createElement(
                  "span",
                  { className: "lso-more-switch-label" },
                  t("peek"),
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
                "h3",
                { id: "lso-settings-display-fix" },
                t("displayFix"),
              ),
              React.createElement(
                "p",
                { className: "lso-section-hint" },
                t("displayFixHint"),
              ),
              React.createElement(
                "div",
                { className: "lso-peek-row" },
                React.createElement(
                  "span",
                  { className: "lso-more-switch-label" },
                  t("autoOptimize"),
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
                  t("entryCount").replace("{count}", nativeItems.length),
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
              { className: "lso-settings-section lso-disclosure" },
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
                  "div",
                  { className: "lso-link-form" },
                  React.createElement(
                    "label",
                    { className: "lso-field" },
                    React.createElement("span", null, t("label")),
                    React.createElement("input", {
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
                    "button",
                    {
                      type: "button",
                      className: "lso-add lso-add-primary",
                      disabled:
                        linkLimitReached ||
                        !linkName.trim() ||
                        !safeUrl(linkUrl.trim()),
                      onClick: add,
                    },
                    t("add"),
                  ),
                ),
                linkItems.length
                  ? React.createElement(
                      "ul",
                      { className: "lso-link-list" },
                      linkItems.map(function (link, index) {
                        return React.createElement(
                          "li",
                          {
                            key: link.id,
                            className: "lso-entry-row lso-link-row",
                          },
                          React.createElement(
                            "div",
                            { className: "lso-entry-main" },
                            React.createElement(
                              "div",
                              { className: "lso-entry-title" },
                              React.createElement("strong", null, link.label),
                              React.createElement(
                                "span",
                                {
                                  className: "lso-entry-badge",
                                  "data-state": "more",
                                },
                                t("more"),
                              ),
                            ),
                            React.createElement("small", null, link.url),
                          ),
                          React.createElement(
                            "div",
                            { className: "lso-shortcut-cell" },
                            field(link.id, link.label),
                          ),
                          React.createElement(
                            "div",
                            { className: "lso-entry-actions" },
                            React.createElement(
                              "div",
                              { className: "lso-actions" },
                              iconButton(
                                "up",
                                t("up") + " " + link.label,
                                index === 0,
                                function () {
                                  move(link.id, -1, linkIds);
                                },
                              ),
                              iconButton(
                                "down",
                                t("down") + " " + link.label,
                                index === linkItems.length - 1,
                                function () {
                                  move(link.id, 1, linkIds);
                                },
                              ),
                              iconButton(
                                "trash",
                                t("remove") + " " + link.label,
                                false,
                                function () {
                                  update({
                                    links: config.links.filter(function (x) {
                                      return x.id !== link.id;
                                    }),
                                    order: config.order.filter(function (id) {
                                      return id !== link.id;
                                    }),
                                  });
                                },
                              ),
                            ),
                          ),
                        );
                      }),
                    )
                  : null,
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
                  record.attributeName === "data-lso-peek" ||
                  (nav &&
                    (record.target === nav || nav.contains(record.target))) ||
                  Array.from(record.addedNodes)
                    .concat(Array.from(record.removedNodes))
                    .some(function (node) {
                      return (
                        node.nodeType === 1 &&
                        (node.matches("nav[aria-label]") ||
                          node.querySelector("nav[aria-label]"))
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
              "data-lso-peek",
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
          document.addEventListener("pointerdown", pointerDown, true);
          document.addEventListener("pointermove", pointerMove, true);
          document.addEventListener("pointerup", pointerUp, true);
          document.addEventListener("pointercancel", cancelDrag, true);
          document.addEventListener("dragstart", suppressNativeDrag, true);
          document.addEventListener("click", suppressDragClick, true);
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
            document.removeEventListener("pointerdown", pointerDown, true);
            document.removeEventListener("pointermove", pointerMove, true);
            document.removeEventListener("pointerup", pointerUp, true);
            document.removeEventListener("pointercancel", cancelDrag, true);
            document.removeEventListener("dragstart", suppressNativeDrag, true);
            document.removeEventListener("click", suppressDragClick, true);
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
                "[data-lso-entry],[data-lso-anchor],[data-lso-link],[data-lso-more],[data-lso-dragging],[data-lso-target],[data-lso-before],[data-lso-after],[data-lso-selection]",
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
              });
            if (activeCtx === ctx) activeCtx = null;
            targets.forEach(function (node) {
              var old = original.get(node);
              if (old) {
                if (old.display)
                  node.style.setProperty("display", old.display, old.priority);
                else node.style.removeProperty("display");
              }
              if (originalOrder.has(node))
                node.style.order = originalOrder.get(node);
              if (originalDrag.get(node) === null)
                node.removeAttribute("draggable");
              else if (originalDrag.has(node))
                node.setAttribute("draggable", originalDrag.get(node));
            });
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
