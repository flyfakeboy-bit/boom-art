window.__ModuleLoader__.load({
  id: '@local/boom-art',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useEffect, useRef, useState, useCallback } = React;
    const useSync = React.useSyncExternalStore
      ? React.useSyncExternalStore
      : function useSyncFallback(subscribe, getSnapshot) {
          const [, force] = React.useState(0);
          React.useEffect(() => subscribe(() => force((value) => value + 1)), [subscribe]);
          return getSnapshot();
        };

    const STORAGE_KEY = 'dsh.composer-fireworks.v1';
    const DEFAULT_LEVEL = 3;
    const MIN_LEVEL = 1;
    const MAX_LEVEL = 6;

    const EMOJIS = [
      '🎉', '✨', '💥', '🎆', '🎇', '🥳', '🚀', '💫', '⭐', '🌟', '🔥', '💖',
      '🌈', '🍾', '🪩', '😎', '🤩', '👏', '🫧', '💎', '⚡', '🍭', '🎊', '🛸',
    ];

    const PHRASES = ['太厉害了！', '牛逼！', '我勒个豆！', '完美的指令！', '完美无瑕！'];

    const DARK_PALETTE = [
      '#ff5d8f', '#ffd166', '#7ae7ff', '#b69cff', '#5dffb0',
      '#ff9f45', '#fff1a8', '#ff6be5', '#66b7ff',
    ];
    const LIGHT_PALETTE = [
      '#d61f4a', '#b45309', '#0e7490', '#6d28d9', '#047857',
      '#c2410c', '#9d174d', '#0f766e', '#1d4ed8',
    ];

    const LEVELS = [
      { id: 1, sparks: 200, emoji: 8, words: 3, reach: 190, trail: 3, width: 0.95, life: 1.0, delay: 70 },
      { id: 2, sparks: 320, emoji: 14, words: 4, reach: 250, trail: 3, width: 1.0, life: 1.1, delay: 80 },
      { id: 3, sparks: 480, emoji: 22, words: 6, reach: 330, trail: 4, width: 1.05, life: 1.2, delay: 90 },
      { id: 4, sparks: 700, emoji: 34, words: 8, reach: 430, trail: 5, width: 1.1, life: 1.3, delay: 100 },
      { id: 5, sparks: 980, emoji: 64, words: 13, reach: 570, trail: 6, width: 1.15, life: 1.5, delay: 120 },
      { id: 6, sparks: 3200, emoji: 640, words: 96, reach: 920, trail: 8, width: 1.2, life: 1.8, delay: 180 },
    ];

    const DICTS = {
      zh: {
        settings: '爆炸艺术设置',
        openSettings: '打开爆炸艺术设置',
        closeSettings: '关闭设置',
        title: '爆炸艺术！',
        intensity: '特效强度',
        preview: '试放当前强度',
        previewOff: '特效已关闭',
        toggleOn: '关闭特效',
        toggleOff: '开启特效',
        lvl1: '星火',
        lvl2: '轻绽',
        lvl3: '正好',
        lvl4: '热烈',
        lvl5: '狂欢',
        lvl6: 'MAX 糊脸',
        desc1: '短促的一圈星火，轻轻散开。',
        desc2: '外喷更长，拖尾开始出现。',
        desc3: '默认：一圈完整的大烟花。',
        desc4: '更长的拖尾，更密的火花。',
        desc5: '几乎铺满四周，拖尾拉得很长。',
        desc6: '超长拖尾、极高密度；会明显吃性能。',
        confirmBody: '你真的要关闭这个非常帅气超级酷炫究极无敌吊炸天的特效吗？',
        confirmClose: '（一脚踹飞）',
        confirmOops: '哦当然不，我非常想要留住这个非常帅气超级酷炫究极无敌吊炸天的特效',
        closing: '（倒地不起）',
        oops: '我就知道！🥳',
        welcome: '（瞬间原地复活）你果然回来了！🥳',
        max: 'MAX',
      },
      en: {
        settings: 'Boom Art settings',
        openSettings: 'Open Boom Art settings',
        closeSettings: 'Close settings',
        title: 'Boom Art!',
        intensity: 'Intensity',
        preview: 'Preview this level',
        previewOff: 'Effects are off',
        toggleOn: 'Turn effects off',
        toggleOff: 'Turn effects on',
        lvl1: 'Sparks',
        lvl2: 'Light',
        lvl3: 'Just right',
        lvl4: 'Lively',
        lvl5: 'Carnival',
        lvl6: 'MAX',
        desc1: 'A short ring of sparks drifts outward.',
        desc2: 'A longer reach; the trail starts to show.',
        desc3: 'The default: one complete frame-wide blast.',
        desc4: 'Longer trails and denser sparks.',
        desc5: 'Almost fills the frame, with very long trails.',
        desc6: 'Extreme trails and density; will cost performance.',
        confirmBody: 'Are you really sure you want to turn off this incredibly handsome, super cool, ultimate, invincible, absolutely insane firework?',
        confirmClose: '(kick it flying)',
        confirmOops: 'Oh of course not, I really want to keep this incredibly handsome, super cool, ultimate, invincible, absolutely insane firework',
        closing: '(knocked out)',
        oops: 'I knew it! 🥳',
        welcome: '(instantly revived) You came back! 🥳',
        max: 'MAX',
      },
    };

    const LOCALE_ALIASES = {
      zh: ['zh', 'zh-CN', 'zh-Hans', 'zh-Hant', 'zh-TW', 'zh-HK'],
      en: ['en', 'en-US', 'en-GB', 'en-AU', 'en-CA'],
    };

    const CSS = `
.dsh-fw-root{position:fixed;inset:0;z-index:2147483000;pointer-events:none;overflow:hidden;font-family:system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif}
.dsh-fw-canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;display:block}
.dsh-fw-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden;contain:strict}
.dsh-fw-sentinel{display:block;width:0;height:0;pointer-events:none;overflow:hidden}
.dsh-fw-particle{position:absolute;left:0;top:0;white-space:nowrap;pointer-events:none;will-change:transform,opacity;transform-origin:50% 50%;line-height:1;user-select:none}
.dsh-fw-emoji{font-size:22px;letter-spacing:0;z-index:1}
.dsh-fw-word{font-weight:850;letter-spacing:.015em;z-index:2;text-rendering:geometricPrecision;-webkit-font-smoothing:antialiased;font-family:system-ui,-apple-system,"Segoe UI","Microsoft YaHei","PingFang SC",sans-serif}
.dsh-fw-root[data-theme="dark"] .dsh-fw-word{text-shadow:
  1px 0 0 rgba(4,6,12,.96),-1px 0 0 rgba(4,6,12,.96),0 1px 0 rgba(4,6,12,.96),0 -1px 0 rgba(4,6,12,.96),
  1px 1px 0 rgba(4,6,12,.96),-1px -1px 0 rgba(4,6,12,.96),1px -1px 0 rgba(4,6,12,.96),-1px 1px 0 rgba(4,6,12,.96)}
.dsh-fw-root[data-theme="light"] .dsh-fw-word{text-shadow:
  1px 0 0 rgba(255,255,255,.98),-1px 0 0 rgba(255,255,255,.98),0 1px 0 rgba(255,255,255,.98),0 -1px 0 rgba(255,255,255,.98),
  1px 1px 0 rgba(255,255,255,.98),-1px -1px 0 rgba(255,255,255,.98),1px -1px 0 rgba(255,255,255,.98),-1px 1px 0 rgba(255,255,255,.98)}
.dsh-fw-trigger{box-sizing:border-box;width:28px;height:28px;padding:0;border:1px solid transparent;border-radius:9px;background:transparent;color:var(--dsw-alias-label-secondary);display:grid;place-items:center;cursor:pointer;outline:none;transition:background .14s ease,color .14s ease,border-color .14s ease,opacity .14s ease}
.dsh-fw-trigger:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dsh-fw-trigger:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dsh-fw-trigger[data-open="true"]{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1)}
.dsh-fw-trigger[data-off="true"]{opacity:.58}
.dsh-fw-trigger svg{display:block;overflow:visible}
.dsh-fw-panel{position:fixed;box-sizing:border-box;max-width:calc(100vw - 24px);max-height:calc(100vh - 24px);overflow:auto;padding:16px;border:1px solid var(--dsw-alias-border-l1);border-radius:16px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 16px 44px rgba(0,0,0,.24);pointer-events:auto;z-index:2;animation:dsh-fw-panel-in .16s cubic-bezier(.2,.8,.2,1) both}
@keyframes dsh-fw-panel-in{from{opacity:0;transform:translateY(5px) scale(.985)}to{opacity:1;transform:none}}
.dsh-fw-head{display:flex;align-items:flex-start;gap:10px;margin-bottom:14px}
.dsh-fw-head-icon{flex:none;width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1)}
.dsh-fw-head-copy{min-width:0;flex:1}
.dsh-fw-title{margin:0;font-size:15px;font-weight:700;line-height:20px;letter-spacing:.01em}
.dsh-fw-title-row{display:flex;align-items:center;gap:6px;min-width:0}
.dsh-fw-version{flex:none;padding:1px 5px;border:1px solid var(--dsw-alias-border-l1);border-radius:5px;font-size:9px;font-weight:700;line-height:12px;letter-spacing:.06em;color:var(--dsw-alias-brand-primary)}
.dsh-fw-x{flex:none;width:24px;height:24px;padding:0;border:1px solid transparent;border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:16px;line-height:20px;cursor:pointer}
.dsh-fw-x:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dsh-fw-label{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin:0 0 7px;font-size:12px;font-weight:650;line-height:16px}
.dsh-fw-current{font-size:11px;font-weight:600;color:var(--dsw-alias-brand-primary);white-space:nowrap}
.dsh-fw-segs{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px}
.dsh-fw-seg{box-sizing:border-box;height:34px;padding:0 2px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary);font:650 11px/1 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;cursor:pointer;transition:background .12s ease,color .12s ease,border-color .12s ease}
.dsh-fw-seg:hover{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}
.dsh-fw-seg[data-active="true"]{background:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);color:#fff}
.dsh-fw-seg[data-max="true"]{font-size:9px;letter-spacing:.03em}
.dsh-fw-seg[data-max="true"]:not([data-active="true"]){color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}
.dsh-fw-seg:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dsh-fw-desc{min-height:32px;margin:8px 0 13px;font-size:11px;line-height:16px;color:var(--dsw-alias-label-secondary)}
.dsh-fw-divider{height:1px;background:var(--dsw-alias-border-l1);margin:0 0 12px}
.dsh-fw-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
.dsh-fw-row-copy{min-width:0}
.dsh-fw-row-title{font-size:12px;font-weight:650;line-height:16px}
.dsh-fw-switch{flex:none;box-sizing:border-box;width:42px;height:24px;padding:2px;border:1px solid transparent;border-radius:999px;background:var(--dsw-alias-state-idle-primary);cursor:pointer;transition:background .16s ease}
.dsh-fw-switch[aria-checked="true"]{background:var(--dsw-alias-brand-primary)}
.dsh-fw-switch:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dsh-fw-knob{display:block;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 1px 0 rgba(0,0,0,.18);transform:translateX(0);transition:transform .16s cubic-bezier(.2,.8,.2,1)}
.dsh-fw-switch[aria-checked="true"] .dsh-fw-knob{transform:translateX(18px)}
.dsh-fw-preview{box-sizing:border-box;width:100%;height:34px;border:1px solid var(--dsw-alias-border-l1);border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:650 12px/1 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;cursor:pointer}
.dsh-fw-preview:hover:not(:disabled){border-color:var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2)}
.dsh-fw-preview:disabled{opacity:.45;cursor:not-allowed}
.dsh-fw-preview:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dsh-fw-backdrop{position:fixed;inset:0;z-index:4;display:grid;place-items:center;padding:20px;background:rgba(6,8,16,.34);pointer-events:auto;animation:dsh-fw-fade-in .14s ease both}
@keyframes dsh-fw-fade-in{from{opacity:0}to{opacity:1}}
.dsh-fw-modal{box-sizing:border-box;width:min(368px,calc(100vw - 32px));padding:23px 22px 19px;border:1px solid var(--dsw-alias-border-l1);border-radius:19px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 24px 70px rgba(0,0,0,.32);text-align:center;animation:dsh-fw-modal-in .18s cubic-bezier(.2,.9,.2,1) both}
@keyframes dsh-fw-modal-in{from{opacity:0;transform:translateY(8px) scale(.975)}to{opacity:1;transform:none}}
.dsh-fw-modal-text{margin:0;font-size:16px;font-weight:700;line-height:25px;letter-spacing:.01em}
.dsh-fw-modal-actions{display:flex;flex-direction:column;gap:9px;margin-top:20px}
.dsh-fw-btn{box-sizing:border-box;flex:none;width:100%;min-height:38px;padding:9px 12px;border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:650 12px/1.45 system-ui,-apple-system,"Segoe UI","Microsoft YaHei",sans-serif;cursor:pointer;white-space:normal;overflow-wrap:anywhere}
.dsh-fw-btn:hover{background:var(--dsw-alias-bg-layer-2)}
.dsh-fw-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dsh-fw-btn[data-danger="true"]{border-color:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}
.dsh-fw-btn[data-danger="true"]:hover{background:var(--dsw-alias-state-error-primary);color:#fff}
.dsh-fw-timer{height:2px;margin:18px 8px 0;overflow:hidden;border-radius:999px;background:var(--dsw-alias-border-l1)}
.dsh-fw-timer span{display:block;width:100%;height:100%;background:var(--dsw-alias-brand-primary);transform-origin:left center;animation:dsh-fw-timer 1s linear both}
@keyframes dsh-fw-timer{from{transform:scaleX(1)}to{transform:scaleX(0)}}
`;

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function rand(min, max) {
      return min + Math.random() * (max - min);
    }

    function pick(list) {
      return list[Math.floor(Math.random() * list.length)];
    }

    function loadSettings() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return { enabled: true, level: DEFAULT_LEVEL };
        const parsed = JSON.parse(raw);
        const level = Number.isInteger(parsed?.level) ? clamp(parsed.level, MIN_LEVEL, MAX_LEVEL) : DEFAULT_LEVEL;
        return { enabled: parsed?.enabled !== false, level };
      } catch (_error) {
        return { enabled: true, level: DEFAULT_LEVEL };
      }
    }

    let uiListeners = new Set();
    let uiState = Object.assign({}, loadSettings(), {
      settingsOpen: false,
      anchor: null,
      modal: null,
    });

    function getUI() {
      return uiState;
    }

    function subscribeUI(listener) {
      uiListeners.add(listener);
      return () => uiListeners.delete(listener);
    }

    function persistSettings() {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ enabled: uiState.enabled, level: uiState.level }),
        );
      } catch (_error) {}
    }

    function updateUI(patch, persist) {
      uiState = Object.assign({}, uiState, patch);
      if (persist) persistSettings();
      for (const listener of uiListeners) listener();
    }

    let rootCtx = null;
    let activeEngine = null;
    let pendingBurst = null;
    let latestBounds = null;

    let clipState = null;
    const clipListeners = new Set();

    function publishClip(rect) {
      clipState = rect;
      for (const listener of clipListeners) listener(rect);
    }

    function readDark(ctx) {
      try {
        const theme = ctx && typeof ctx.get === 'function' ? ctx.get('theme') : undefined;
        const scheme = theme && typeof theme.getTheme === 'function' ? theme.getTheme()?.active?.colorScheme : undefined;
        if (scheme === 'dark' || scheme === 'light') return scheme === 'dark';
      } catch (_error) {}
      try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      } catch (_error) {
        return true;
      }
    }

    function measureCard(element) {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) return null;
      let radius = 16;
      try {
        radius = parseFloat(window.getComputedStyle(element).borderTopLeftRadius) || 16;
      } catch (_error) {}
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        radius,
      };
    }

    function toRect(rect) {
      return {
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    }

    function fireAt(bounds, level, dark) {
      if (!uiState.enabled || !bounds) return;
      const payload = { bounds, level, dark };
      if (activeEngine) activeEngine.burst(bounds, level, dark);
      else pendingBurst = payload;
    }

    function fireCurrent(levelOverride) {
      if (!uiState.enabled) return false;
      const bounds = latestBounds || (uiState.anchor && uiState.anchor.card);
      if (!bounds) return false;
      fireAt(bounds, levelOverride || uiState.level, readDark(rootCtx));
      return true;
    }

    function borderPoint(rect, t) {
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const perimeter = 2 * (width + height);
      let distance = (((t % 1) + 1) % 1) * perimeter;
      if (distance < width) {
        return { x: rect.left + distance, y: rect.top, nx: 0, ny: -1, tx: 1, ty: 0 };
      }
      distance -= width;
      if (distance < height) {
        return { x: rect.right, y: rect.top + distance, nx: 1, ny: 0, tx: 0, ty: 1 };
      }
      distance -= height;
      if (distance < width) {
        return { x: rect.right - distance, y: rect.bottom, nx: 0, ny: 1, tx: -1, ty: 0 };
      }
      distance -= width;
      return { x: rect.left, y: rect.bottom - height + (height - distance), nx: -1, ny: 0, tx: 0, ty: -1 };
    }

    function addRoundRectPath(ctx, x, y, width, height, radius) {
      const r = Math.max(0, Math.min(radius, width / 2, height / 2));
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + width - r, y);
      ctx.arcTo(x + width, y, x + width, y + r, r);
      ctx.lineTo(x + width, y + height - r);
      ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
      ctx.lineTo(x + r, y + height);
      ctx.arcTo(x, y + height, x, y + height - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
    }

    function pathRoundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      addRoundRectPath(ctx, x, y, width, height, radius);
    }

    function borderPointAtAngle(bounds, angle) {
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const tx = dx === 0 ? Infinity : (bounds.width / 2) / Math.abs(dx);
      const ty = dy === 0 ? Infinity : (bounds.height / 2) / Math.abs(dy);
      const distance = Math.min(tx, ty);
      return {
        x: cx + dx * distance,
        y: cy + dy * distance,
        ux: dx,
        uy: dy,
      };
    }

    function roundedRectPathD(x, y, width, height, radius) {
      const r = Math.max(0, Math.min(radius, width / 2, height / 2));
      return [
        'M' + (x + r) + ' ' + y,
        'H' + (x + width - r),
        'A' + r + ' ' + r + ' 0 0 1 ' + (x + width) + ' ' + (y + r),
        'V' + (y + height - r),
        'A' + r + ' ' + r + ' 0 0 1 ' + (x + width - r) + ' ' + (y + height),
        'H' + (x + r),
        'A' + r + ' ' + r + ' 0 0 1 ' + x + ' ' + (y + height - r),
        'V' + (y + r),
        'A' + r + ' ' + r + ' 0 0 1 ' + (x + r) + ' ' + y,
        'Z',
      ].join(' ');
    }

    function makeOutsideClipPath(rect) {
      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);
      const inset = 1;
      return (
        'M0 0 H' + width + ' V' + height + ' H0 Z ' +
        roundedRectPathD(
          rect.left - inset,
          rect.top - inset,
          rect.width + inset * 2,
          rect.height + inset * 2,
          (rect.radius || 16) + inset,
        )
      );
    }

    class FireworksEngine {
      constructor(canvas, layer) {
        this.canvas = canvas;
        this.layer = layer;
        this.ctx = canvas.getContext('2d');
        this.sparks = [];
        this.shocks = [];
        this.domEls = new Set();
        this.raf = 0;
        this.last = 0;
        this.border = null;
        this.clipRect = null;
        this.dark = true;
        this.disposed = false;
        this.onResize = this.resize.bind(this);
        this.tick = this.tick.bind(this);
        window.addEventListener('resize', this.onResize, { passive: true });
        this.resize();
      }

      resize() {
        if (this.disposed || !this.canvas) return;
        const dpr = clamp(window.devicePixelRatio || 1, 1, 2.5);
        const width = Math.max(1, window.innerWidth);
        const height = Math.max(1, window.innerHeight);
        this.canvas.width = Math.round(width * dpr);
        this.canvas.height = Math.round(height * dpr);
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      ensureLoop() {
        if (this.disposed || this.raf) return;
        this.last = performance.now();
        this.raf = window.requestAnimationFrame(this.tick);
      }

      burst(bounds, level, dark) {
        if (this.disposed || !this.ctx) return;
        const cfg = LEVELS[clamp(level, MIN_LEVEL, MAX_LEVEL) - 1] || LEVELS[DEFAULT_LEVEL - 1];
        const palette = dark ? DARK_PALETTE : LIGHT_PALETTE;
        const phrase = pick(PHRASES);
        const start = performance.now();
        this.dark = dark;
        this.clipRect = bounds;
        publishClip(bounds);
        this.border = {
          rect: bounds,
          start,
          duration: cfg.id === 6 ? 900 : 760,
          leds: cfg.id >= 5 ? 48 : 32,
          color: dark ? '#ffe9a8' : '#d61f4a',
          accent: dark ? '#ff6be5' : '#6d28d9',
        };
        const shockCount = cfg.id >= 5 ? 3 : cfg.id >= 3 ? 2 : 1;
        this.shocks = [];
        for (let index = 0; index < shockCount; index += 1) {
          this.shocks.push({
            rect: bounds,
            start: start + index * 80,
            duration: 560 + index * 150 + (cfg.id === 6 ? 140 : 0),
            maxExpand: cfg.reach * (0.62 + index * 0.24),
            color: index === 0
              ? (dark ? '#fff3c4' : '#d61f4a')
              : palette[index % palette.length],
            width: index === 0 ? 1.8 : 1.2,
            alpha: 0.62 - index * 0.12,
          });
        }
        this.launchCorona(bounds, cfg, palette, start);
        for (let index = 0; index < cfg.emoji; index += 1) {
          this.spawnTextParticle('emoji', pick(EMOJIS), bounds, cfg, palette);
        }
        for (let index = 0; index < cfg.words; index += 1) {
          this.spawnTextParticle('word', phrase, bounds, cfg, palette);
        }
        this.ensureLoop();
      }

      launchCorona(bounds, cfg, palette, start) {
        for (let index = 0; index < cfg.sparks; index += 1) {
          const radial = (index / cfg.sparks) * Math.PI * 2 + rand(-0.035, 0.035);
          const point = borderPointAtAngle(bounds, radial);
          const spread = Math.random() < 0.18 ? 0.72 : 0.28;
          const angle = radial + rand(-spread, spread);
          const ux = point.ux;
          const uy = point.uy;
          const offset = 4 + Math.random() * 8;
          const life = rand(0.76, 1.28) * cfg.life;
          const target = cfg.reach * rand(0.55, 1.1);
          const speed = target / (life * 0.52);
          const x = point.x + ux * offset - uy * rand(-9, 9);
          const y = point.y + uy * offset + ux * rand(-9, 9);
          this.sparks.push({
            x,
            y,
            vx: Math.cos(angle) * speed - uy * rand(-42, 42),
            vy: Math.sin(angle) * speed + ux * rand(-42, 42),
            life,
            maxLife: life,
            bornAt: start + Math.random() * cfg.delay,
            color: pick(palette),
            width: cfg.width * rand(0.8, 1.26),
            gravity: rand(28, 148),
            drag: rand(0.7, 1.38),
            seed: Math.random() * Math.PI * 2,
            trail: [{ x, y }],
            maxTrail: cfg.trail + (Math.random() < 0.14 ? 2 : 0),
          });
        }
        if (this.sparks.length > 9000) this.sparks.splice(0, this.sparks.length - 9000);
      }

      spawnTextParticle(kind, text, bounds, cfg, palette) {
        let radial = rand(-Math.PI, Math.PI);
        for (let attempt = 0; attempt < 10 && Math.sin(radial) > 0.18; attempt += 1) {
          radial = rand(-Math.PI, Math.PI);
        }
        const point = borderPointAtAngle(bounds, radial);
        const ux = point.ux;
        const uy = point.uy;
        const isEmoji = kind === 'emoji';
        const angle = radial + rand(-0.24, 0.24);
        const size = isEmoji
          ? rand(17, 28) + (cfg.id === 6 ? rand(0, 7) : 0)
          : rand(28, 43) + (cfg.id === 6 ? rand(0, 12) : 0);
        const glyphSpan = isEmoji ? size : Math.max(size, text.length * size * 0.92);
        const halfAlong = (Math.abs(ux) * glyphSpan + Math.abs(uy) * size) / 2;
        const clearance = halfAlong + 10;
        const x = point.x + ux * clearance - uy * rand(-size * 0.28, size * 0.28);
        const y = point.y + uy * clearance + ux * rand(-size * 0.28, size * 0.28);
        const distance = Math.max(96, cfg.reach * (isEmoji ? rand(0.4, 0.86) : rand(0.55, 1.05)));
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;
        const duration = (isEmoji ? rand(1.05, 1.9) : rand(1.32, 2.22)) * (cfg.id === 6 ? 1.08 : 1);
        const rotation = rand(-24, 24);
        const color = pick(palette);
        const element = document.createElement('span');
        element.className = 'dsh-fw-particle ' + (isEmoji ? 'dsh-fw-emoji' : 'dsh-fw-word');
        element.textContent = text;
        element.style.left = x.toFixed(2) + 'px';
        element.style.top = y.toFixed(2) + 'px';
        element.style.fontSize = size.toFixed(1) + 'px';
        if (!isEmoji) element.style.color = color;
        if (this.domEls.size > 1800) {
          const oldest = this.domEls.values().next().value;
          if (oldest) {
            oldest.remove();
            this.domEls.delete(oldest);
          }
        }
        this.layer.appendChild(element);
        this.domEls.add(element);
        const delay = Math.random() * cfg.delay + rand(0, 40);
        const endY = dy + (isEmoji ? 8 : 13);
        const midY = dy * 0.56 - (isEmoji ? 10 : 18);
        const scalePeak = isEmoji ? 1.16 : 1.1;
        const scaleEnd = isEmoji ? 0.84 : 0.88;
        if (typeof element.animate !== 'function') {
          element.style.opacity = '0';
          window.setTimeout(() => element.remove(), duration * 1000 + delay);
          this.domEls.delete(element);
          return;
        }
        const animation = element.animate(
          [
            { transform: 'translate(-50%,-50%) translate(0px,0px) scale(.2) rotate(0deg)', opacity: 0, offset: 0 },
            { transform: 'translate(-50%,-50%) translate(' + (dx * 0.08).toFixed(1) + 'px,' + (dy * 0.08).toFixed(1) + 'px) scale(' + scalePeak + ') rotate(' + (rotation * 0.12).toFixed(1) + 'deg)', opacity: 1, offset: 0.1 },
            { transform: 'translate(-50%,-50%) translate(' + (dx * 0.56).toFixed(1) + 'px,' + midY.toFixed(1) + 'px) scale(1.01) rotate(' + (rotation * 0.56).toFixed(1) + 'deg)', opacity: 0.97, offset: 0.56 },
            { transform: 'translate(-50%,-50%) translate(' + dx.toFixed(1) + 'px,' + endY.toFixed(1) + 'px) scale(' + scaleEnd + ') rotate(' + rotation.toFixed(1) + 'deg)', opacity: 0, offset: 1 },
          ],
          {
            duration: duration * 1000,
            delay,
            easing: 'cubic-bezier(.16,.74,.26,1)',
            fill: 'both',
          },
        );
        const finish = () => {
          element.remove();
          this.domEls.delete(element);
        };
        animation.finished.then(finish, finish);
      }

      tick(now) {
        this.raf = 0;
        if (this.disposed || !this.ctx) return;
        const dt = Math.min(0.032, Math.max(0.001, (now - this.last) / 1000));
        this.last = now;
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ctx = this.ctx;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        if (this.clipRect) {
          ctx.beginPath();
          ctx.rect(0, 0, width, height);
          addRoundRectPath(
            ctx,
            this.clipRect.left - 1,
            this.clipRect.top - 1,
            this.clipRect.width + 2,
            this.clipRect.height + 2,
            (this.clipRect.radius || 16) + 1,
          );
          ctx.clip('evenodd');
        }
        this.drawBorder(now);
        this.drawShocks(now);
        this.drawSparks(dt, now);
        ctx.restore();
        const borderAlive = this.border && now - this.border.start < this.border.duration + 540;
        const shocksAlive = this.shocks.some((shock) => now - shock.start < shock.duration + 120);
        if (this.sparks.length || shocksAlive || borderAlive) {
          this.raf = window.requestAnimationFrame(this.tick);
        } else {
          this.border = null;
          this.shocks.length = 0;
        }
      }

      drawBorder(now) {
        if (!this.border) return;
        const age = (now - this.border.start) / this.border.duration;
        if (age < 0 || age > 1.35) return;
        const rect = this.border.rect;
        const envelope = Math.pow(Math.sin(Math.PI * clamp(age, 0, 1)), 0.72);
        const pad = 2.6;
        const frame = {
          left: rect.left - pad,
          top: rect.top - pad,
          width: rect.width + pad * 2,
          height: rect.height + pad * 2,
          radius: (rect.radius || 16) + pad,
        };
        const ctx = this.ctx;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        pathRoundRect(ctx, frame.left, frame.top, frame.width, frame.height, frame.radius);
        ctx.globalAlpha = 0.15 * envelope;
        ctx.strokeStyle = this.border.color;
        ctx.lineWidth = 5.2;
        ctx.stroke();
        ctx.globalAlpha = 0.95 * envelope;
        ctx.strokeStyle = this.border.color;
        ctx.lineWidth = 1.7;
        ctx.stroke();
        ctx.globalAlpha = 0.7 * envelope;
        ctx.strokeStyle = this.dark ? '#fff7d6' : '#ffffff';
        ctx.lineWidth = 0.65;
        ctx.stroke();
        const leds = this.border.leds;
        for (let index = 0; index < leds; index += 1) {
          const u = (index + 0.5) / leds;
          const point = borderPoint(frame, u);
          const phase = ((index * 7) % 13) / 13;
          const local = clamp((age - 0.04 - phase * 0.22) / 0.62, 0, 1);
          const pulse = Math.sin(Math.PI * local);
          if (pulse <= 0.001) continue;
          const twinkle = 0.62 + 0.38 * Math.sin(now * 0.036 + index * 1.9);
          const alpha = envelope * pulse * twinkle;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = index % 4 === 0 ? this.border.accent : (this.dark ? '#fff7d6' : '#ffffff');
          ctx.beginPath();
          ctx.arc(point.x, point.y, index % 5 === 0 ? 1.9 : 1.15, 0, Math.PI * 2);
          ctx.fill();
          if (index % 6 === 0) {
            ctx.strokeStyle = this.border.color;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(point.x - 4.5, point.y);
            ctx.lineTo(point.x + 4.5, point.y);
            ctx.moveTo(point.x, point.y - 4.5);
            ctx.lineTo(point.x, point.y + 4.5);
            ctx.stroke();
          }
        }
        ctx.restore();
      }

      drawShocks(now) {
        if (!this.shocks.length) return;
        const ctx = this.ctx;
        for (const shock of this.shocks) {
          const age = (now - shock.start) / shock.duration;
          if (age < 0 || age > 1.18) continue;
          const progress = clamp(age, 0, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          const expand = 2 + shock.maxExpand * ease;
          const rect = shock.rect;
          const alpha = (1 - progress) * shock.alpha;
          if (alpha < 0.015) continue;
          ctx.save();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          pathRoundRect(
            ctx,
            rect.left - expand,
            rect.top - expand,
            rect.width + expand * 2,
            rect.height + expand * 2,
            (rect.radius || 16) + expand,
          );
          ctx.globalAlpha = alpha * 0.18;
          ctx.strokeStyle = shock.color;
          ctx.lineWidth = shock.width * 2.4;
          ctx.stroke();
          ctx.globalAlpha = alpha;
          ctx.lineWidth = shock.width;
          ctx.stroke();
          ctx.restore();
        }
      }

      drawSparks(dt, now) {
        const ctx = this.ctx;
        if (!this.sparks.length) return;
        const width = window.innerWidth;
        const height = window.innerHeight;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let index = this.sparks.length - 1; index >= 0; index -= 1) {
          const spark = this.sparks[index];
          if (now < spark.bornAt) continue;
          spark.life -= dt;
          if (spark.life <= 0) {
            this.sparks.splice(index, 1);
            continue;
          }
          const drag = Math.exp(-spark.drag * dt);
          spark.vx *= drag;
          spark.vy = spark.vy * drag + spark.gravity * dt;
          spark.x += spark.vx * dt;
          spark.y += spark.vy * dt;
          spark.trail.push({ x: spark.x, y: spark.y });
          if (spark.trail.length > spark.maxTrail) spark.trail.shift();
          if (spark.x < -110 || spark.x > width + 110 || spark.y < -110 || spark.y > height + 110) {
            this.sparks.splice(index, 1);
            continue;
          }
          const ratio = spark.life / spark.maxLife;
          const fadeIn = clamp((spark.maxLife - spark.life) / 0.06, 0, 1);
          const twinkle = 0.8 + 0.2 * Math.sin(now * 0.028 + spark.seed);
          const alpha = Math.pow(ratio, 1.16) * fadeIn * twinkle;
          const first = spark.trail[0];
          ctx.beginPath();
          ctx.moveTo(first.x, first.y);
          for (let pointIndex = 1; pointIndex < spark.trail.length; pointIndex += 1) {
            const point = spark.trail[pointIndex];
            ctx.lineTo(point.x, point.y);
          }
          if (spark.width > 1.08) {
            ctx.globalAlpha = alpha * 0.16;
            ctx.strokeStyle = spark.color;
            ctx.lineWidth = spark.width * 2.6;
            ctx.stroke();
          }
          ctx.globalAlpha = alpha;
          ctx.lineWidth = spark.width;
          ctx.stroke();
          if (spark.width > 1.34) {
            ctx.globalAlpha = alpha * 0.92;
            ctx.fillStyle = this.dark ? '#fffbe8' : '#fff5f7';
            ctx.fillRect(spark.x - 0.62, spark.y - 0.62, 1.24, 1.24);
          }
        }
        ctx.restore();
      }

      dispose() {
        this.disposed = true;
        if (this.raf) window.cancelAnimationFrame(this.raf);
        this.raf = 0;
        for (const element of this.domEls) element.remove();
        this.domEls.clear();
        this.sparks.length = 0;
        this.shocks.length = 0;
        window.removeEventListener('resize', this.onResize);
        if (this.ctx) {
          try {
            this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          } catch (_error) {}
        }
      }
    }

    function useUI() {
      return useSync(subscribeUI, getUI, getUI);
    }

    function useTranslate(ctx) {
      const [, setRevision] = useState(0);
      useEffect(() => {
        let locale;
        try {
          locale = ctx.get('locale');
        } catch (_error) {}
        if (!locale || typeof locale.subscribe !== 'function') return undefined;
        return locale.subscribe(() => setRevision((value) => value + 1));
      }, [ctx]);
      let locale;
      try {
        locale = ctx.get('locale');
      } catch (_error) {}
      if (locale && typeof locale.bind === 'function') {
        try {
          const translate = locale.bind('boom-art');
          return (key) => {
            const value = translate(key);
            return value === key ? (DICTS.zh[key] || DICTS.en[key] || key) : value;
          };
        } catch (_error) {}
      }
      return (key) => (DICTS.zh[key] || DICTS.en[key] || key);
    }

    function useDarkTheme(ctx) {
      const [dark, setDark] = useState(() => readDark(ctx));
      useEffect(() => {
        let off;
        try {
          if (ctx && typeof ctx.on === 'function') off = ctx.on('theme/change', () => setDark(readDark(ctx)));
        } catch (_error) {}
        return () => {
          if (typeof off === 'function') off();
        };
      }, [ctx]);
      return dark;
    }

    function SparkleIcon(props) {
      return h(
        'svg',
        {
          viewBox: '0 0 16 16',
          width: props?.size || 16,
          height: props?.size || 16,
          'aria-hidden': 'true',
          fill: 'none',
        },
        h('path', {
          d: 'M7.9 1.15l1.27 3.62 3.63 1.28-3.63 1.27L7.9 10.95 6.62 7.32 3 6.05l3.62-1.28z',
          fill: 'currentColor',
          stroke: 'currentColor',
          strokeWidth: 0.45,
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M12.55 10.25l.62 1.77 1.78.63-1.78.62-.62 1.78-.63-1.78-1.77-.62 1.77-.63z',
          fill: 'currentColor',
        }),
        h('path', {
          d: 'M3.1 9.8l.48 1.37 1.37.48-1.37.48-.48 1.37-.48-1.37-1.37-.48 1.37-.48z',
          fill: 'currentColor',
          opacity: 0.78,
        }),
      );
    }

    function SettingsButton(props) {
      const ui = useUI();
      const t = useTranslate(props.ctx);
      const onClick = (event) => {
        event.stopPropagation();
        const card = event.currentTarget.closest('[data-composer-card]');
        if (card) latestBounds = measureCard(card) || latestBounds;
        updateUI({
          settingsOpen: !getUI().settingsOpen,
          anchor: {
            trigger: toRect(event.currentTarget.getBoundingClientRect()),
            card: latestBounds,
          },
        });
      };
      return h(
        'button',
        {
          type: 'button',
          className: 'dsh-fw-trigger',
          'data-open': ui.settingsOpen ? 'true' : 'false',
          'data-off': ui.enabled ? 'false' : 'true',
          title: ui.enabled ? t('openSettings') : t('openSettings'),
          'aria-label': ui.enabled ? t('openSettings') : t('openSettings'),
          'aria-haspopup': 'dialog',
          'aria-expanded': ui.settingsOpen ? 'true' : 'false',
          onMouseDown: (event) => {
            event.preventDefault();
            event.stopPropagation();
          },
          onClick,
        },
        h(SparkleIcon, { size: 15 }),
      );
    }

    function SendWatcher(props) {
      const ctx = props.ctx;
      const sessionId = props.sessionId;
      const useInput = props.useInput;
      const input = typeof useInput === 'function' ? useInput((snapshot) => snapshot) : undefined;
      const draft = typeof input?.draft === 'string' ? input.draft : '';
      const attachmentCount = Array.isArray(input?.attachmentIds) ? input.attachmentIds.length : 0;
      const hostRef = useRef(null);
      const gestureRef = useRef(0);
      const prevRef = useRef(null);

      const refresh = useCallback(() => {
        const host = hostRef.current;
        const card = host && host.closest ? host.closest('[data-composer-card]') : null;
        if (!card) return;
        const bounds = measureCard(card);
        if (bounds) latestBounds = bounds;
      }, []);

      useEffect(() => {
        refresh();
        const host = hostRef.current;
        const card = host && host.closest ? host.closest('[data-composer-card]') : null;
        if (!card) return undefined;
        let observer;
        try {
          observer = new ResizeObserver(refresh);
          observer.observe(card);
        } catch (_error) {}
        window.addEventListener('resize', refresh, { passive: true });
        window.addEventListener('scroll', refresh, true);
        return () => {
          if (observer) observer.disconnect();
          window.removeEventListener('resize', refresh);
          window.removeEventListener('scroll', refresh, true);
        };
      }, [refresh, sessionId]);

      useEffect(() => {
        const host = hostRef.current;
        const card = host && host.closest ? host.closest('[data-composer-card]') : null;
        if (!card) return undefined;
        const markGesture = () => {
          gestureRef.current = performance.now();
        };
        const onKeyDown = (event) => {
          if (event.key !== 'Enter' || event.shiftKey || event.altKey) return;
          if (event.isComposing || event.keyCode === 229) return;
          if (event.ctrlKey && event.metaKey) return;
          markGesture();
        };
        const onPointerDown = (event) => {
          const target = event.target && event.target.closest ? event.target.closest('button') : null;
          if (!target || target.disabled) return;
          const classes = String(target.className || '').split(/\s+/);
          if (classes.some((name) => name.endsWith('_primary'))) markGesture();
        };
        card.addEventListener('keydown', onKeyDown, true);
        card.addEventListener('pointerdown', onPointerDown, true);
        return () => {
          card.removeEventListener('keydown', onKeyDown, true);
          card.removeEventListener('pointerdown', onPointerDown, true);
        };
      }, [sessionId]);

      useEffect(() => {
        const sid = sessionId == null ? '' : String(sessionId);
        const current = { sid, draft, attachmentCount };
        const previous = prevRef.current;
        if (!previous || previous.sid !== sid) {
          prevRef.current = current;
          return;
        }
        const wasSendable = previous.draft.trim() !== '' || previous.attachmentCount > 0;
        const nowEmpty = draft.trim() === '' && attachmentCount === 0;
        if (wasSendable && nowEmpty && performance.now() - gestureRef.current < 950 && getUI().enabled) {
          gestureRef.current = 0;
          window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
              refresh();
              if (latestBounds) fireAt(latestBounds, getUI().level, readDark(ctx));
            });
          });
        }
        prevRef.current = current;
      }, [draft, attachmentCount, sessionId, refresh, ctx]);

      return h('span', { ref: hostRef, className: 'dsh-fw-sentinel', 'aria-hidden': 'true' });
    }

    function computePanelStyle(anchor, measuredHeight) {
      const width = Math.min(320, Math.max(240, window.innerWidth - 24));
      const estimatedHeight = measuredHeight && measuredHeight > 40 ? measuredHeight : 320;
      if (!anchor || !anchor.trigger) {
        return { left: Math.max(12, (window.innerWidth - width) / 2) + 'px', top: '72px', width: width + 'px' };
      }
      const trigger = anchor.trigger;
      const cardTop = anchor.card && Number.isFinite(anchor.card.top) ? anchor.card.top : trigger.top;
      let left = trigger.left + trigger.width / 2 - width / 2;
      left = clamp(left, 12, window.innerWidth - width - 12);
      let top = cardTop - estimatedHeight - 12;
      if (top < 12) top = trigger.bottom + 12;
      top = clamp(top, 12, Math.max(12, window.innerHeight - estimatedHeight - 12));
      return { left: Math.round(left) + 'px', top: Math.round(top) + 'px', width: Math.round(width) + 'px' };
    }

    function SettingsPanel(props) {
      const { t, ui } = props;
      const panelRef = useRef(null);
      const [style, setStyle] = useState(() => computePanelStyle(ui.anchor));
      useEffect(() => {
        const update = () => setStyle(computePanelStyle(ui.anchor, panelRef.current ? panelRef.current.offsetHeight : undefined));
        update();
        let observer;
        try {
          observer = new ResizeObserver(update);
          if (panelRef.current) observer.observe(panelRef.current);
        } catch (_error) {}
        window.addEventListener('resize', update, { passive: true });
        window.addEventListener('scroll', update, true);
        return () => {
          if (observer) observer.disconnect();
          window.removeEventListener('resize', update);
          window.removeEventListener('scroll', update, true);
        };
      }, [ui.anchor]);
      useEffect(() => {
        const onPointerDown = (event) => {
          if (getUI().modal) return;
          const panel = panelRef.current;
          if (panel && panel.contains(event.target)) return;
          const trigger = event.target && event.target.closest ? event.target.closest('.dsh-fw-trigger') : null;
          if (trigger) return;
          updateUI({ settingsOpen: false });
        };
        const onKeyDown = (event) => {
          if (event.key !== 'Escape' || getUI().modal) return;
          updateUI({ settingsOpen: false });
        };
        window.addEventListener('pointerdown', onPointerDown, true);
        window.addEventListener('keydown', onKeyDown, true);
        return () => {
          window.removeEventListener('pointerdown', onPointerDown, true);
          window.removeEventListener('keydown', onKeyDown, true);
        };
      }, []);
      const level = LEVELS[ui.level - 1] || LEVELS[DEFAULT_LEVEL - 1];
      const levelName = t(level.id === 6 ? 'lvl6' : 'lvl' + level.id);
      const description = t('desc' + level.id);
      const setLevel = (next) => updateUI({ level: clamp(next, MIN_LEVEL, MAX_LEVEL) }, true);
      const toggle = () => {
        if (getUI().enabled) {
          updateUI({ modal: { kind: 'confirm' } });
          return;
        }
        updateUI({ enabled: true, modal: { kind: 'welcome' } }, true);
        fireCurrent();
      };
      return h(
        'section',
        {
          ref: panelRef,
          className: 'dsh-fw-panel',
          style,
          role: 'dialog',
          'aria-modal': 'false',
          'aria-label': t('title'),
        },
        h(
          'div',
          { className: 'dsh-fw-head' },
          h('span', { className: 'dsh-fw-head-icon' }, h(SparkleIcon, { size: 17 })),
          h(
            'div',
            { className: 'dsh-fw-head-copy' },
            h(
              'div',
              { className: 'dsh-fw-title-row' },
              h('h2', { className: 'dsh-fw-title' }, t('title')),
              h('span', { className: 'dsh-fw-version' }, 'v88.8'),
            ),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-fw-x',
              'aria-label': t('closeSettings'),
              title: t('closeSettings'),
              onClick: () => updateUI({ settingsOpen: false }),
            },
            '×',
          ),
        ),
        h(
          'div',
          { className: 'dsh-fw-label' },
          h('span', null, t('intensity')),
          h('span', { className: 'dsh-fw-current' }, levelName),
        ),
        h(
          'div',
          { className: 'dsh-fw-segs', role: 'group', 'aria-label': t('intensity') },
          LEVELS.map((item) =>
            h(
              'button',
              {
                key: item.id,
                type: 'button',
                className: 'dsh-fw-seg',
                'data-active': ui.level === item.id ? 'true' : 'false',
                'data-max': item.id === 6 ? 'true' : 'false',
                'aria-pressed': ui.level === item.id ? 'true' : 'false',
                title: item.id === 6 ? t('lvl6') : t('lvl' + item.id),
                onClick: () => setLevel(item.id),
              },
              item.id === 6 ? t('max') : String(item.id),
            ),
          ),
        ),
        h('p', { className: 'dsh-fw-desc' }, description),
        h('div', { className: 'dsh-fw-divider' }),
        h(
          'div',
          { className: 'dsh-fw-row' },
          h(
            'div',
            { className: 'dsh-fw-row-copy' },
            h('div', { className: 'dsh-fw-row-title' }, ui.enabled ? t('toggleOn') : t('toggleOff')),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dsh-fw-switch',
              role: 'switch',
              'aria-checked': ui.enabled ? 'true' : 'false',
              'aria-label': ui.enabled ? t('toggleOn') : t('toggleOff'),
              title: ui.enabled ? t('toggleOn') : t('toggleOff'),
              onClick: toggle,
            },
            h('span', { className: 'dsh-fw-knob' }),
          ),
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'dsh-fw-preview',
            disabled: !ui.enabled,
            onClick: () => fireCurrent(),
          },
          ui.enabled ? t('preview') : t('previewOff'),
        ),
      );
    }

    function Modal(props) {
      const { t, ui } = props;
      const modal = ui.modal;
      const confirmRef = useRef(null);
      const isConfirm = modal && modal.kind === 'confirm';
      useEffect(() => {
        if (isConfirm && confirmRef.current) {
          try {
            confirmRef.current.focus({ preventScroll: true });
          } catch (_error) {}
        }
      }, [isConfirm, modal]);
      if (!modal) return null;
      const text =
        modal.kind === 'confirm'
          ? t('confirmBody')
          : modal.kind === 'closing'
            ? t('closing')
            : modal.kind === 'oops'
              ? t('oops')
              : t('welcome');
      return h(
        'div',
        { className: 'dsh-fw-backdrop' },
        h(
          'div',
          {
            className: 'dsh-fw-modal',
            role: 'alertdialog',
            'aria-modal': 'true',
            'aria-live': 'assertive',
            'aria-label': text,
          },
          h('p', { className: 'dsh-fw-modal-text' }, text),
          isConfirm
            ? h(
                'div',
                { className: 'dsh-fw-modal-actions' },
                h(
                  'button',
                  {
                    ref: confirmRef,
                    type: 'button',
                    className: 'dsh-fw-btn',
                    onClick: () => updateUI({ modal: { kind: 'oops' } }),
                  },
                  t('confirmOops'),
                ),
                h(
                  'button',
                  {
                    type: 'button',
                    className: 'dsh-fw-btn',
                    'data-danger': 'true',
                    onClick: () => updateUI({ modal: { kind: 'closing' } }),
                  },
                  t('confirmClose'),
                ),
              )
            : h('div', { className: 'dsh-fw-timer' }, h('span')),
        ),
      );
    }

    function Overlay(props) {
      const ctx = props.ctx;
      const ui = useUI();
      const t = useTranslate(ctx);
      const dark = useDarkTheme(ctx);
      const [clipRect, setClipRectState] = useState(() => clipState);
      useEffect(() => {
        clipListeners.add(setClipRectState);
        return () => {
          clipListeners.delete(setClipRectState);
        };
      }, []);
      const clipPathD = clipRect ? makeOutsideClipPath(clipRect) : null;
      const canvasRef = useRef(null);
      const layerRef = useRef(null);
      useEffect(() => {
        const engine = new FireworksEngine(canvasRef.current, layerRef.current);
        activeEngine = engine;
        if (pendingBurst) {
          const payload = pendingBurst;
          pendingBurst = null;
          engine.burst(payload.bounds, payload.level, payload.dark);
        }
        return () => {
          if (activeEngine === engine) activeEngine = null;
          engine.dispose();
        };
      }, []);
      useEffect(() => {
        if (!ui.modal || ui.modal.kind === 'confirm') return undefined;
        const kind = ui.modal.kind;
        const timer = window.setTimeout(() => {
          if (kind === 'closing') updateUI({ enabled: false, modal: null }, true);
          else updateUI({ modal: null });
        }, 1000);
        return () => window.clearTimeout(timer);
      }, [ui.modal]);
      useEffect(() => {
        if (!ui.settingsOpen) return undefined;
        const onKeyDown = (event) => {
          if (event.key === 'Escape' && !getUI().modal) updateUI({ settingsOpen: false });
        };
        window.addEventListener('keydown', onKeyDown, true);
        return () => window.removeEventListener('keydown', onKeyDown, true);
      }, [ui.settingsOpen]);
      return h(
        'div',
        { className: 'dsh-fw-root', 'data-theme': dark ? 'dark' : 'light', style: { pointerEvents: 'none' } },
        h('style', { 'data-dsh-composer-fireworks': 'styles' }, CSS),
        h(
          'svg',
          { width: 0, height: 0, style: { position: 'absolute' }, 'aria-hidden': 'true' },
          h(
            'defs',
            null,
            h(
              'clipPath',
              { id: 'dsh-fw-outside', clipPathUnits: 'userSpaceOnUse' },
              h('path', { d: clipPathD || 'M0 0', clipRule: 'evenodd' }),
            ),
          ),
        ),
        h('canvas', { ref: canvasRef, className: 'dsh-fw-canvas', 'aria-hidden': 'true' }),
        h('div', {
          ref: layerRef,
          className: 'dsh-fw-layer',
          'aria-hidden': 'true',
          style: clipPathD ? { clipPath: 'url(#dsh-fw-outside)' } : undefined,
        }),
        ui.settingsOpen ? h(SettingsPanel, { t, ui }) : null,
        h(Modal, { t, ui }),
      );
    }

    function registerLocale(ctx) {
      let locale;
      try {
        locale = ctx.get('locale');
      } catch (_error) {}
      if (!locale || typeof locale.register !== 'function') return undefined;
      const disposers = [];
      for (const id of Object.keys(DICTS)) {
        const tags = LOCALE_ALIASES[id] || [id];
        for (const tag of tags) {
          try {
            disposers.push(locale.register('boom-art', tag, DICTS[id]));
          } catch (_error) {}
        }
      }
      return () => {
        for (const dispose of disposers) {
          try {
            dispose();
          } catch (_error) {}
        }
      };
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        rootCtx = ctx;
        ctx.effect(() => registerLocale(ctx));
        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            { name: 'shell.overlay', id: 'boom-art-overlay', order: 90 },
            (slotProps) => h(Overlay, { ...slotProps, ctx }),
          ),
        );
        ctx.slots.inject('conversation.input.right', () =>
          ctx.slots.register(
            { name: 'conversation.input.right', id: 'boom-art-settings', order: 20 },
            () => h(SettingsButton, { ctx }),
          ),
        );
        ctx.slots.inject('conversation.input.overlay', () =>
          ctx.slots.register(
            { name: 'conversation.input.overlay', id: 'boom-art-sentinel', order: 1 },
            (slotProps) => h(SendWatcher, { ...slotProps, ctx }),
          ),
        );
      },
    };
  },
});
