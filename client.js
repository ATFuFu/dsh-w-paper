window.__ModuleLoader__.load({
  id: 'dsh-w-paper',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'dsh-w-paper';
    const STORAGE_KEY = 'dsh-w-paper/settings/v1';
    /** Settings saved by the pre-release build keep working after the rename. */
    const LEGACY_STORAGE_KEYS = ['dsh-background-studio/settings/v1'];
    const PANEL_WIDTH = 404;
    const MAX_IMAGE_EDGE = 1920;

    /* ------------------------------------------------------------------ */
    /* dictionaries                                                        */
    /* ------------------------------------------------------------------ */

    const EN = {
      open: 'Background settings',
      button: 'Wallpaper',
      settingsTitle: 'Background',
      settingsDesc: 'Preset or imported picture, blur, transparency and parallax.',
      adjust: 'Adjust',
      title: 'Background',
      close: 'Close',
      presets: 'Presets',
      presetNone: 'None',
      presetStarry: 'Starry',
      presetSky: 'Blue sky',
      presetDusk: 'Dusk',
      presetSunrise: 'Sunrise',
      importImage: 'Import',
      image: 'Picture',
      clearImage: 'Remove picture',
      effects: 'Look',
      blur: 'Blur',
      sharpen: 'Sharpen',
      saturation: 'Saturation',
      contrast: 'Contrast',
      offset: 'Offset',
      offsetX: 'X',
      offsetY: 'Y',
      parallax: 'Parallax',
      surfaces: 'Surfaces',
      sidebar: 'Sidebar',
      topbar: 'Top bar',
      chatArea: 'Chat area',
      chatBorder: 'Chat border',
      reset: 'Reset',
      importFailed: 'That file could not be used as a picture.',
      storageFull: 'Picture is too large to remember; other settings were saved.',
      hint: 'Changes apply immediately.',
    };

    const ZH = {
      open: '背景设置',
      button: '背景',
      settingsTitle: '背景',
      settingsDesc: '预设或导入的图片，以及虚化、透明度与视差。',
      adjust: '调整',
      title: '背景设置',
      close: '关闭',
      presets: '预设背景',
      presetNone: '无背景',
      presetStarry: '星空',
      presetSky: '蓝天',
      presetDusk: '黄昏',
      presetSunrise: '日出',
      importImage: '导入图片',
      image: '自定义图片',
      clearImage: '移除自定义图片',
      effects: '画面调节',
      blur: '虚化',
      sharpen: '锐化',
      saturation: '饱和度',
      contrast: '对比度',
      offset: '背景偏移',
      offsetX: '水平',
      offsetY: '垂直',
      parallax: '鼠标视差',
      surfaces: '界面',
      sidebar: '侧边栏',
      topbar: '顶部栏',
      chatArea: '聊天区',
      chatBorder: '聊天区边框',
      reset: '恢复默认',
      importFailed: '这个文件没法当背景图片用呢。',
      storageFull: '图片太大没存下，其它设置已经保存。',
      hint: '调完立即生效。',
    };

    let tr = (key) => (typeof navigator !== 'undefined' && /^zh/i.test(navigator.language) ? ZH : EN)[key] || key;

    /* ------------------------------------------------------------------ */
    /* settings store                                                      */
    /* ------------------------------------------------------------------ */

    const PRESET_IDS = ['none', 'starry', 'sky', 'dusk', 'sunrise'];

    const DEFAULTS = {
      preset: 'starry',
      image: '',
      blur: 0,
      sharpen: 0,
      saturation: 100,
      contrast: 100,
      offsetX: 0,
      offsetY: 0,
      parallax: 45,
      sidebarTransparency: 45,
      topbarTransparency: 55,
      chatTransparency: 68,
      chatBorder: true,
    };

    const PERSIST_KEYS = [
      'preset', 'image', 'blur', 'sharpen', 'saturation', 'contrast', 'offsetX', 'offsetY', 'parallax',
      'sidebarTransparency', 'topbarTransparency', 'chatTransparency', 'chatBorder',
    ];

    function clamp(value, lo, hi, fallback) {
      const n = Number(value);
      if (!Number.isFinite(n)) return fallback;
      return Math.min(hi, Math.max(lo, n));
    }

    function readStoredSettings() {
      const keys = [STORAGE_KEY].concat(LEGACY_STORAGE_KEYS);
      for (const key of keys) {
        try {
          const raw = window.localStorage.getItem(key);
          if (raw) return raw;
        } catch (error) {
          return null;
        }
      }
      return null;
    }

    function loadSettings() {
      const out = { ...DEFAULTS };
      try {
        const raw = readStoredSettings();
        if (!raw) return out;
        const saved = JSON.parse(raw);
        if (presetIsKnown(saved.preset)) out.preset = saved.preset;
        if (typeof saved.image === 'string') out.image = saved.image;
        out.blur = clamp(saved.blur, 0, 24, DEFAULTS.blur);
        out.sharpen = clamp(saved.sharpen, 0, 100, DEFAULTS.sharpen);
        out.saturation = clamp(saved.saturation, 0, 200, DEFAULTS.saturation);
        out.contrast = clamp(saved.contrast, 50, 160, DEFAULTS.contrast);
        out.offsetX = clamp(saved.offsetX, -40, 40, DEFAULTS.offsetX);
        out.offsetY = clamp(saved.offsetY, -40, 40, DEFAULTS.offsetY);
        out.parallax = clamp(saved.parallax, 0, 100, DEFAULTS.parallax);
        out.sidebarTransparency = clamp(saved.sidebarTransparency, 0, 100, DEFAULTS.sidebarTransparency);
        out.topbarTransparency = clamp(saved.topbarTransparency, 0, 100, DEFAULTS.topbarTransparency);
        out.chatTransparency = clamp(saved.chatTransparency, 0, 100, DEFAULTS.chatTransparency);
        out.chatBorder = saved.chatBorder !== false;
      } catch (error) {
        return { ...DEFAULTS };
      }
      return out;
    }

    function presetIsKnown(id) {
      return id === 'custom' || PRESET_IDS.indexOf(id) >= 0;
    }

    function saveSettings(state) {
      const data = {};
      for (const key of PERSIST_KEYS) data[key] = state[key];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
      } catch (error) {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, image: '' }));
        } catch (ignored) {
          /* storage is unavailable entirely; the session still works */
        }
        return false;
      }
    }

    const REVEAL_KEY = 'dsh-w-paper/revealed/v1';
    const LEGACY_REVEAL_KEYS = ['dsh-background-studio/revealed/v7'];

    function wasRevealed() {
      try {
        if (window.localStorage.getItem(REVEAL_KEY) === '1') return true;
        return LEGACY_REVEAL_KEYS.some((key) => window.localStorage.getItem(key) === '1');
      } catch (error) {
        return true;
      }
    }

    function markRevealed() {
      try {
        window.localStorage.setItem(REVEAL_KEY, '1');
      } catch (error) {
        /* ignoring: the panel simply opens once more next time */
      }
    }

    const store = {
      state: { ...loadSettings(), open: false, anchor: null, notice: '' },
      listeners: new Set(),
      get() {
        return this.state;
      },
      set(patch) {
        const next = { ...this.state, ...patch };
        let changed = false;
        for (const key of Object.keys(patch)) {
          if (next[key] !== this.state[key]) { changed = true; break; }
        }
        if (!changed) return;
        this.state = next;
        this.listeners.forEach((fn) => fn());
      },
      subscribe(fn) {
        this.listeners.add(fn);
        return () => { this.listeners.delete(fn); };
      },
      bump() {
        this.listeners.forEach((fn) => fn());
      },
    };

    function updateSettings(patch) {
      store.set(patch);
      const ok = saveSettings(store.state);
      if (!ok && store.state.image) store.set({ notice: tr('storageFull') });
    }

    function useStore() {
      return React.useSyncExternalStore(
        (notify) => store.subscribe(notify),
        () => store.state
      );
    }

    /* ------------------------------------------------------------------ */
    /* preset artwork                                                      */
    /* ------------------------------------------------------------------ */

    function mulberry32(seed) {
      let a = seed >>> 0;
      return function random() {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function paintStarry(g, w, h) {
      const random = mulberry32(0x51a7c0de);
      const sky = g.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#04060f');
      sky.addColorStop(0.42, '#080d20');
      sky.addColorStop(0.72, '#0d1430');
      sky.addColorStop(1, '#171d3f');
      g.fillStyle = sky;
      g.fillRect(0, 0, w, h);

      g.globalCompositeOperation = 'lighter';
      const nebulas = [
        [0.62, 0.30, 0.42, 'rgba(96,86,220,0.20)'],
        [0.38, 0.52, 0.36, 'rgba(52,120,220,0.15)'],
        [0.78, 0.66, 0.30, 'rgba(150,80,200,0.13)'],
      ];
      for (const [cx, cy, radius, color] of nebulas) {
        const glow = g.createRadialGradient(cx * w, cy * h, 0, cx * w, cy * h, radius * Math.max(w, h));
        glow.addColorStop(0, color);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = glow;
        g.fillRect(0, 0, w, h);
      }

      g.save();
      g.translate(w * 0.5, h * 0.42);
      g.rotate(-0.38);
      const band = g.createLinearGradient(0, -h * 0.34, 0, h * 0.34);
      band.addColorStop(0, 'rgba(120,140,255,0)');
      band.addColorStop(0.5, 'rgba(150,165,255,0.13)');
      band.addColorStop(1, 'rgba(120,140,255,0)');
      g.fillStyle = band;
      g.fillRect(-w * 0.75, -h * 0.34, w * 1.5, h * 0.68);
      g.restore();
      g.globalCompositeOperation = 'source-over';

      const unit = Math.max(0.45, w / 1500);
      const count = Math.max(40, Math.round((w * h) / 520));
      for (let i = 0; i < count; i += 1) {
        const x = random() * w;
        const y = random() * h;
        const r = (0.35 + Math.pow(random(), 4) * 1.5) * unit;
        const alpha = 0.22 + random() * 0.72;
        const warm = Math.round(random() * 46);
        g.beginPath();
        g.arc(x, y, Math.max(0.3, r), 0, Math.PI * 2);
        g.fillStyle = 'rgba(' + (206 + warm) + ',' + (218 + Math.round(random() * 30)) + ',255,' + alpha.toFixed(3) + ')';
        g.fill();
      }

      for (let i = 0; i < 12; i += 1) {
        const x = random() * w;
        const y = random() * h * 0.94;
        const r = (1.3 + random() * 2.1) * unit;
        const glow = g.createRadialGradient(x, y, 0, x, y, r * 7);
        glow.addColorStop(0, 'rgba(226,236,255,0.85)');
        glow.addColorStop(0.25, 'rgba(180,200,255,0.26)');
        glow.addColorStop(1, 'rgba(120,150,255,0)');
        g.fillStyle = glow;
        g.beginPath();
        g.arc(x, y, r * 7, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = 'rgba(255,255,255,0.95)';
        g.beginPath();
        g.arc(x, y, Math.max(0.9, r * 0.6), 0, Math.PI * 2);
        g.fill();
      }
    }

    function paintSky(g, w, h) {
      const random = mulberry32(0x2c9f31a7);
      const sky = g.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#2a6fc4');
      sky.addColorStop(0.38, '#4f9be0');
      sky.addColorStop(0.72, '#8ec8f2');
      sky.addColorStop(1, '#d8ecff');
      g.fillStyle = sky;
      g.fillRect(0, 0, w, h);

      const sun = g.createRadialGradient(w * 0.16, h * 0.06, 0, w * 0.16, h * 0.06, Math.max(w, h) * 0.55);
      sun.addColorStop(0, 'rgba(255,255,255,0.55)');
      sun.addColorStop(0.4, 'rgba(222,240,255,0.18)');
      sun.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = sun;
      g.fillRect(0, 0, w, h);

      const unit = Math.max(0.16, w / 1600);
      for (let i = 0; i < 9; i += 1) {
        const cx = random() * w;
        const cy = h * (0.28 + random() * 0.56);
        const puffs = 5 + Math.floor(random() * 5);
        for (let p = 0; p < puffs; p += 1) {
          const px = cx + (random() - 0.5) * 300 * unit;
          const py = cy + (random() - 0.5) * 52 * unit;
          const pr = (34 + random() * 62) * unit;
          const puff = g.createRadialGradient(px, py, 0, px, py, pr);
          puff.addColorStop(0, 'rgba(255,255,255,0.92)');
          puff.addColorStop(0.55, 'rgba(255,255,255,0.52)');
          puff.addColorStop(1, 'rgba(255,255,255,0)');
          g.fillStyle = puff;
          g.beginPath();
          g.arc(px, py, pr, 0, Math.PI * 2);
          g.fill();
        }
      }
    }

    function paintDusk(g, w, h) {
      const random = mulberry32(0x9b3a77c1);
      const sky = g.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#161a3a');
      sky.addColorStop(0.24, '#2e2b58');
      sky.addColorStop(0.46, '#5a3f6d');
      sky.addColorStop(0.64, '#96506f');
      sky.addColorStop(0.78, '#cf6f5f');
      sky.addColorStop(0.9, '#f0a05e');
      sky.addColorStop(1, '#f8c987');
      g.fillStyle = sky;
      g.fillRect(0, 0, w, h);

      const sunY = h * 0.8;
      const glow = g.createRadialGradient(w * 0.62, sunY, 0, w * 0.62, sunY, h * 0.55);
      glow.addColorStop(0, 'rgba(255,226,170,0.95)');
      glow.addColorStop(0.18, 'rgba(255,196,140,0.55)');
      glow.addColorStop(0.55, 'rgba(240,140,110,0.18)');
      glow.addColorStop(1, 'rgba(240,140,110,0)');
      g.fillStyle = glow;
      g.fillRect(0, 0, w, h);
      g.beginPath();
      g.arc(w * 0.62, sunY, h * 0.045, 0, Math.PI * 2);
      g.fillStyle = 'rgba(255,242,214,0.95)';
      g.fill();

      const unitX = Math.max(0.14, w / 1600);
      for (let i = 0; i < 7; i += 1) {
        const cy = h * (0.16 + random() * 0.5);
        const cx = random() * w;
        const cw = (200 + random() * 420) * unitX;
        const ch = Math.max(2, (8 + random() * 16) * (h / 900));
        const band = g.createLinearGradient(cx - cw, cy, cx + cw, cy);
        band.addColorStop(0, 'rgba(30,22,52,0)');
        band.addColorStop(0.5, 'rgba(30,22,52,' + (0.18 + random() * 0.2).toFixed(2) + ')');
        band.addColorStop(1, 'rgba(30,22,52,0)');
        g.fillStyle = band;
        g.beginPath();
        g.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2);
        g.fill();
      }
    }

    function paintSunrise(g, w, h) {
      const random = mulberry32(0x4d1e2b93);
      const sky = g.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#1b2548');
      sky.addColorStop(0.26, '#39376f');
      sky.addColorStop(0.46, '#7b4a76');
      sky.addColorStop(0.6, '#c06a5f');
      sky.addColorStop(0.72, '#f09a63');
      sky.addColorStop(0.84, '#ffd29a');
      sky.addColorStop(1, '#ffe8bd');
      g.fillStyle = sky;
      g.fillRect(0, 0, w, h);

      const horizon = h * 0.76;
      const sunX = w * 0.42;
      const glow = g.createRadialGradient(sunX, horizon, 0, sunX, horizon, h * 0.6);
      glow.addColorStop(0, 'rgba(255,246,214,1)');
      glow.addColorStop(0.12, 'rgba(255,226,170,0.75)');
      glow.addColorStop(0.45, 'rgba(255,180,120,0.22)');
      glow.addColorStop(1, 'rgba(255,170,110,0)');
      g.fillStyle = glow;
      g.fillRect(0, 0, w, h);
      g.beginPath();
      g.arc(sunX, horizon, h * 0.058, 0, Math.PI * 2);
      g.fillStyle = '#fff6d8';
      g.fill();

      const water = g.createLinearGradient(0, horizon, 0, h);
      water.addColorStop(0, 'rgba(42,28,44,0.55)');
      water.addColorStop(0.5, 'rgba(26,18,36,0.85)');
      water.addColorStop(1, 'rgba(12,10,22,0.96)');
      g.fillStyle = water;
      g.fillRect(0, horizon, w, h - horizon);

      const unitX = Math.max(0.14, w / 1600);
      for (let i = 0; i < 26; i += 1) {
        const depth = Math.pow(random(), 2.2);
        const ry = horizon + depth * (h - horizon);
        const rw = (30 + random() * 130) * unitX * (1 - depth * 0.4);
        const rx = sunX + (random() - 0.5) * w * 0.22;
        g.fillStyle = 'rgba(255,214,150,' + (0.05 + random() * 0.22).toFixed(2) + ')';
        g.fillRect(rx - rw / 2, ry, rw, Math.max(1, h * 0.004));
      }

      for (let i = 0; i < 6; i += 1) {
        const cy = h * (0.34 + random() * 0.34);
        const cx = random() * w;
        const cw = (160 + random() * 380) * unitX;
        const ch = Math.max(2, (5 + random() * 12) * (h / 900));
        const band = g.createLinearGradient(cx - cw, cy, cx + cw, cy);
        band.addColorStop(0, 'rgba(255,180,150,0)');
        band.addColorStop(0.5, 'rgba(255,196,160,' + (0.12 + random() * 0.18).toFixed(2) + ')');
        band.addColorStop(1, 'rgba(255,180,150,0)');
        g.fillStyle = band;
        g.beginPath();
        g.ellipse(cx, cy, cw, ch, 0, 0, Math.PI * 2);
        g.fill();
      }
    }

    function paintPreset(g, id, w, h) {
      g.clearRect(0, 0, w, h);
      if (id === 'starry') paintStarry(g, w, h);
      else if (id === 'sky') paintSky(g, w, h);
      else if (id === 'dusk') paintDusk(g, w, h);
      else if (id === 'sunrise') paintSunrise(g, w, h);
      else {
        g.fillStyle = '#12151f';
        g.fillRect(0, 0, w, h);
      }
    }

    const presetCache = new Map();

    function renderPreset(id) {
      if (presetCache.has(id)) return presetCache.get(id);
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const g = canvas.getContext('2d');
      let url = '';
      try {
        paintPreset(g, id, canvas.width, canvas.height);
        url = canvas.toDataURL('image/jpeg', 0.9);
      } catch (error) {
        url = '';
      }
      presetCache.set(id, url);
      return url;
    }

    function hasBackground(state) {
      if (state.preset === 'none') return false;
      if (state.preset === 'custom') return Boolean(state.image);
      return true;
    }

    function resolveImage(state) {
      if (state.preset === 'none') return '';
      if (state.preset === 'custom') return state.image || '';
      return renderPreset(state.preset);
    }

    /* ------------------------------------------------------------------ */
    /* document side effects                                               */
    /* ------------------------------------------------------------------ */

    const CSS_VARS = [
      '--dshbg-image', '--dshbg-px', '--dshbg-py', '--dshbg-filter', '--dshbg-mx', '--dshbg-my',
      '--dshbg-side-a', '--dshbg-top-a', '--dshbg-chat-a',
    ];

    function buildFilter(state) {
      const parts = [];
      if (state.blur > 0) parts.push('blur(' + state.blur + 'px)');
      if (state.saturation !== 100) parts.push('saturate(' + (state.saturation / 100) + ')');
      if (state.contrast !== 100) parts.push('contrast(' + (state.contrast / 100) + ')');
      if (state.sharpen > 0) parts.push('url(#dshbg-sharpen)');
      return parts.length ? parts.join(' ') : 'none';
    }

    function clearDocument() {
      const root = document.documentElement;
      root.classList.remove('dshbg-on');
      root.classList.remove('dshbg-frame');
      for (const name of CSS_VARS) root.style.removeProperty(name);
    }

    function transparencyToAlpha(percent) {
      const value = clamp(percent, 0, 100, 100);
      return Math.round((1 - value / 100) * 1000) / 1000;
    }

    function applyVisual(state) {
      if (typeof document === 'undefined') return;
      const root = document.documentElement;
      const image = resolveImage(state);
      if (!image) {
        clearDocument();
        return;
      }
      root.classList.add('dshbg-on');
      root.classList.toggle('dshbg-frame', state.chatBorder !== false);
      root.style.setProperty('--dshbg-image', 'url("' + image + '")');
      root.style.setProperty('--dshbg-px', state.offsetX + '%');
      root.style.setProperty('--dshbg-py', state.offsetY + '%');
      root.style.setProperty('--dshbg-filter', buildFilter(state));
      root.style.setProperty('--dshbg-side-a', String(transparencyToAlpha(state.sidebarTransparency)));
      root.style.setProperty('--dshbg-top-a', String(transparencyToAlpha(state.topbarTransparency)));
      root.style.setProperty('--dshbg-chat-a', String(transparencyToAlpha(state.chatTransparency)));
    }

    function useApplyVisual(state) {
      React.useEffect(() => {
        const handle = window.setTimeout(() => applyVisual(state), 0);
        return () => window.clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [
        state.preset, state.image, state.blur, state.sharpen, state.saturation, state.contrast,
        state.offsetX, state.offsetY, state.sidebarTransparency, state.topbarTransparency,
        state.chatTransparency, state.chatBorder,
      ]);
    }

    function useParallax(state) {
      const preset = state.preset;
      const image = state.image;
      const parallax = state.parallax;
      React.useEffect(() => {
        const root = document.documentElement;
        const active = parallax > 0
          && hasBackground(store.state)
          && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
        if (!active) {
          root.style.setProperty('--dshbg-mx', '0px');
          root.style.setProperty('--dshbg-my', '0px');
          return undefined;
        }
        const max = 8 + (parallax / 100) * 26;
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;
        let frame = 0;
        const tick = () => {
          frame = 0;
          currentX += (targetX - currentX) * 0.14;
          currentY += (targetY - currentY) * 0.14;
          const settled = Math.abs(targetX - currentX) < 0.08 && Math.abs(targetY - currentY) < 0.08;
          if (settled) {
            currentX = targetX;
            currentY = targetY;
          }
          root.style.setProperty('--dshbg-mx', currentX.toFixed(2) + 'px');
          root.style.setProperty('--dshbg-my', currentY.toFixed(2) + 'px');
          if (!settled) frame = window.requestAnimationFrame(tick);
        };
        const wake = () => {
          if (!frame) frame = window.requestAnimationFrame(tick);
        };
        const onMove = (event) => {
          const nx = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
          const ny = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
          targetX = -nx * max;
          targetY = -ny * max;
          wake();
        };
        const onLeave = () => {
          targetX = 0;
          targetY = 0;
          wake();
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        window.addEventListener('mousemove', onMove, { passive: true });
        document.addEventListener('pointerleave', onLeave);
        document.addEventListener('mouseleave', onLeave);
        return () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('mousemove', onMove);
          document.removeEventListener('pointerleave', onLeave);
          document.removeEventListener('mouseleave', onLeave);
          if (frame) window.cancelAnimationFrame(frame);
        };
      }, [parallax, preset, image]);
    }

    /* ------------------------------------------------------------------ */
    /* image import                                                        */
    /* ------------------------------------------------------------------ */

    function readAsDataUrl(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(reader.error || new Error('read failed'));
        reader.readAsDataURL(file);
      });
    }

    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('decode failed'));
        image.src = src;
      });
    }

    async function importPicture(file) {
      const raw = await readAsDataUrl(file);
      const image = await loadImage(raw);
      const edge = Math.max(image.naturalWidth, image.naturalHeight);
      const scale = Math.min(1, MAX_IMAGE_EDGE / edge);
      if (scale > 0.999 && raw.length < 1400000) return raw;
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const g = canvas.getContext('2d');
      g.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.86);
    }

    /* ------------------------------------------------------------------ */
    /* icons                                                               */
    /* ------------------------------------------------------------------ */

    function CloseGlyph() {
      return h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false },
        h('path', {
          d: 'M6 6l12 12M18 6L6 18', fill: 'none', stroke: 'currentColor',
          strokeWidth: 2, strokeLinecap: 'round',
        }));
    }

    function PlusGlyph() {
      return h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', 'aria-hidden': true, focusable: false },
        h('path', {
          d: 'M12 5v14M5 12h14', fill: 'none', stroke: 'currentColor',
          strokeWidth: 2, strokeLinecap: 'round',
        }));
    }

    /** Wallpaper mark: a framed picture, so the trigger reads as "background". */
    function BackgroundGlyph() {
      return h('svg', {
        width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round',
        'aria-hidden': true, focusable: false,
      },
        h('rect', { x: 3, y: 4.5, width: 18, height: 15, rx: 3 }),
        h('circle', { cx: 8.6, cy: 9.8, r: 1.5, fill: 'currentColor', stroke: 'none' }),
        h('path', { d: 'M4.4 16.4 9 11.8l3.6 3.8 2.9-2.5 4.1 3.5' }));
    }

    /* ------------------------------------------------------------------ */
    /* sharpen filter                                                      */
    /* ------------------------------------------------------------------ */

    function SharpenFilter({ amount }) {
      const strength = (amount / 100) * 1.6;
      const kernel = [0, -strength, 0, -strength, 1 + 4 * strength, -strength, 0, -strength, 0].join(' ');
      return h('svg', {
        width: 0, height: 0, 'aria-hidden': true, focusable: false,
        style: { position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' },
      },
        h('defs', null,
          h('filter', { id: 'dshbg-sharpen', x: '0%', y: '0%', width: '100%', height: '100%', colorInterpolationFilters: 'sRGB' },
            h('feConvolveMatrix', { order: 3, preserveAlpha: 'true', edgeMode: 'duplicate', kernelMatrix: kernel })
          )
        )
      );
    }

    /* ------------------------------------------------------------------ */
    /* panel                                                               */
    /* ------------------------------------------------------------------ */

    function PresetThumb({ id }) {
      const ref = React.useRef(null);
      React.useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const g = canvas.getContext('2d');
        if (g) paintPreset(g, id, canvas.width, canvas.height);
      }, [id]);
      return h('canvas', { ref, width: 192, height: 108, className: 'dshbg-thumb' });
    }

    function Card({ active, onClick, children, className }) {
      return h('div', {
        role: 'button',
        tabIndex: 0,
        className: 'dshbg-card' + (active ? ' is-active' : '') + (className ? ' ' + className : ''),
        'aria-pressed': active ? 'true' : 'false',
        onClick,
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
          }
        },
      }, children);
    }

    function Slider({ label, value, min, max, step, unit, onChange }) {
      return h('label', { className: 'dshbg-row' },
        h('span', { className: 'dshbg-row-label' }, label),
        h('input', {
          className: 'dshbg-range',
          type: 'range',
          min, max, step: step || 1,
          value,
          onChange: (event) => onChange(Number(event.target.value)),
        }),
        h('span', { className: 'dshbg-row-value' }, value + (unit || ''))
      );
    }

    function Panel({ state }) {
      const fileRef = React.useRef(null);
      const anchor = state.anchor || { left: 24, top: 64 };
      const viewportHeight = window.innerHeight || 800;
      const maxLeft = Math.max(8, (window.innerWidth || 1280) - PANEL_WIDTH - 8);
      const left = Math.min(Math.max(8, anchor.left), maxLeft);
      const top = Math.max(8, Math.min(anchor.top + 8, viewportHeight - 240));

      const choose = () => {
        if (fileRef.current) fileRef.current.click();
      };

      const onFile = async (event) => {
        const target = event.target;
        const file = target.files && target.files[0];
        target.value = '';
        if (!file) return;
        try {
          const image = await importPicture(file);
          updateSettings({ image, preset: 'custom', notice: '' });
        } catch (error) {
          store.set({ notice: tr('importFailed') });
        }
      };

      const clearImage = () => {
        updateSettings({ image: '', preset: state.preset === 'custom' ? 'none' : state.preset });
      };

      return h(React.Fragment, null,
        h('div', { className: 'dshbg-backdrop', onPointerDown: () => store.set({ open: false }) }),
        h('div', {
          className: 'dshbg-panel',
          role: 'dialog',
          'aria-label': tr('title'),
          style: { left: left + 'px', top: top + 'px', bottom: '12px' },
          onPointerDown: (event) => event.stopPropagation(),
        },
          h('div', { className: 'dshbg-head' },
            h('span', { className: 'dshbg-title' }, tr('title')),
            h('button', {
              type: 'button',
              className: 'dshbg-icon-btn',
              'aria-label': tr('close'),
              title: tr('close'),
              onClick: () => store.set({ open: false }),
            }, h(CloseGlyph))
          ),
          h('div', { className: 'dshbg-body' },
            h('div', { className: 'dshbg-label' }, tr('presets')),
            h('div', { className: 'dshbg-grid' },
              PRESET_IDS.map((id) => h(Card, {
                key: id,
                active: state.preset === id,
                onClick: () => updateSettings({ preset: id }),
              },
                h('span', { className: 'dshbg-thumb-wrap' },
                  id === 'none'
                    ? h('span', { className: 'dshbg-thumb dshbg-thumb-none' })
                    : h(PresetThumb, { id })
                ),
                h('span', { className: 'dshbg-card-label' }, tr('preset' + id.charAt(0).toUpperCase() + id.slice(1)))
              )),
              h(Card, {
                active: state.preset === 'custom' && Boolean(state.image),
                onClick: choose,
                className: 'dshbg-card-import',
              },
                h('span', { className: 'dshbg-thumb-wrap' },
                  state.image
                    ? h('span', {
                      className: 'dshbg-thumb',
                      style: { backgroundImage: 'url("' + state.image + '")', backgroundSize: 'cover', backgroundPosition: 'center' },
                    })
                    : h('span', { className: 'dshbg-thumb dshbg-thumb-add' }, h(PlusGlyph))
                ),
                h('span', { className: 'dshbg-card-label' }, tr('importImage')),
                state.image
                  ? h('button', {
                    type: 'button',
                    className: 'dshbg-card-clear',
                    title: tr('clearImage'),
                    'aria-label': tr('clearImage'),
                    onClick: (event) => { event.stopPropagation(); clearImage(); },
                  }, h(CloseGlyph))
                  : null
              )
            ),
            h('input', {
              ref: fileRef,
              type: 'file',
              accept: 'image/*',
              className: 'dshbg-file',
              onChange: onFile,
            }),
            h('div', { className: 'dshbg-label' }, tr('effects')),
            h(Slider, {
              label: tr('blur'), value: state.blur, min: 0, max: 24, unit: 'px',
              onChange: (value) => updateSettings({ blur: value }),
            }),
            h(Slider, {
              label: tr('sharpen'), value: state.sharpen, min: 0, max: 100, unit: '',
              onChange: (value) => updateSettings({ sharpen: value }),
            }),
            h(Slider, {
              label: tr('saturation'), value: state.saturation, min: 0, max: 200, unit: '%',
              onChange: (value) => updateSettings({ saturation: value }),
            }),
            h(Slider, {
              label: tr('contrast'), value: state.contrast, min: 50, max: 160, unit: '%',
              onChange: (value) => updateSettings({ contrast: value }),
            }),
            h('div', { className: 'dshbg-label' }, tr('offset')),
            h(Slider, {
              label: tr('offsetX'), value: state.offsetX, min: -40, max: 40, unit: '%',
              onChange: (value) => updateSettings({ offsetX: value }),
            }),
            h(Slider, {
              label: tr('offsetY'), value: state.offsetY, min: -40, max: 40, unit: '%',
              onChange: (value) => updateSettings({ offsetY: value }),
            }),
            h('div', { className: 'dshbg-label' }, tr('parallax')),
            h(Slider, {
              label: tr('parallax'), value: state.parallax, min: 0, max: 100, unit: '',
              onChange: (value) => updateSettings({ parallax: value }),
            }),
            h('div', { className: 'dshbg-label' }, tr('surfaces')),
            h(Slider, {
              label: tr('sidebar'), value: state.sidebarTransparency, min: 0, max: 100, unit: '%',
              onChange: (value) => updateSettings({ sidebarTransparency: value }),
            }),
            h(Slider, {
              label: tr('topbar'), value: state.topbarTransparency, min: 0, max: 100, unit: '%',
              onChange: (value) => updateSettings({ topbarTransparency: value }),
            }),
            h(Slider, {
              label: tr('chatArea'), value: state.chatTransparency, min: 0, max: 100, unit: '%',
              onChange: (value) => updateSettings({ chatTransparency: value }),
            }),
            h('div', { className: 'dshbg-row-toggle' },
              h('span', { className: 'dshbg-row-label' }, tr('chatBorder')),
              h('label', { className: 'dshbg-switch' },
                h('input', {
                  type: 'checkbox',
                  checked: state.chatBorder !== false,
                  onChange: (event) => updateSettings({ chatBorder: event.target.checked }),
                }),
                h('span', { className: 'dshbg-switch-track' }, h('span', { className: 'dshbg-switch-thumb' }))
              )
            ),
            h('div', { className: 'dshbg-foot' },
              h('button', {
                type: 'button',
                className: 'dshbg-text-btn',
                onClick: () => updateSettings({ ...DEFAULTS }),
              }, tr('reset')),
              h('span', { className: 'dshbg-notice' }, state.notice || tr('hint'))
            )
          )
        )
      );
    }

    /* ------------------------------------------------------------------ */
    /* slot components                                                     */
    /* ------------------------------------------------------------------ */

    function GearButton() {
      const state = useStore();
      const ref = React.useRef(null);
      React.useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        if (!store.state.anchor) store.set({ anchor: { left: rect.left, top: rect.bottom } });
      }, []);
      return h('button', {
        ref,
        type: 'button',
        className: 'dshbg-trigger' + (state.open ? ' is-open' : ''),
        title: tr('open'),
        'aria-label': tr('open'),
        'aria-haspopup': 'dialog',
        'aria-expanded': state.open ? 'true' : 'false',
        onClick: (event) => {
          if (state.open) {
            store.set({ open: false });
            return;
          }
          const rect = event.currentTarget.getBoundingClientRect();
          store.set({ open: true, anchor: { left: rect.left, top: rect.bottom }, notice: '' });
        },
      },
        h(BackgroundGlyph),
        h('span', { className: 'dshbg-trigger-label' }, tr('button'))
      );
    }

    /** General-settings row: the same panel, reachable from Settings → General. */
    function SettingsRow() {
      const state = useStore();
      const image = resolveImage(state);
      const presetName = state.preset === 'custom'
        ? tr('image')
        : tr('preset' + state.preset.charAt(0).toUpperCase() + state.preset.slice(1));
      return h('div', { className: 'dshbg-setting' },
        h('div', { className: 'dshbg-setting-text' },
          h('div', { className: 'dshbg-setting-title' }, tr('settingsTitle')),
          h('div', { className: 'dshbg-setting-desc' }, tr('settingsDesc'))
        ),
        h('div', { className: 'dshbg-setting-control' },
          h('span', {
            className: 'dshbg-setting-swatch' + (image ? '' : ' dshbg-setting-swatch-empty'),
            style: image ? { backgroundImage: 'url("' + image + '")' } : undefined,
            'aria-hidden': true,
          }),
          h('span', { className: 'dshbg-setting-value' }, presetName),
          h('button', {
            type: 'button',
            className: 'dshbg-setting-btn',
            onClick: (event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              store.set({ open: true, anchor: { left: rect.left - 320, top: rect.bottom }, notice: '' });
            },
          }, tr('adjust'))
        )
      );
    }

    function StudioLayer() {
      const state = useStore();
      useApplyVisual(state);
      useParallax(state);

      React.useEffect(() => {
        if (wasRevealed()) return undefined;
        const timer = window.setTimeout(() => {
          markRevealed();
          if (!store.state.open) store.set({ open: true });
        }, 1200);
        return () => window.clearTimeout(timer);
      }, []);

      React.useEffect(() => {
        if (!state.open) return undefined;
        const onKey = (event) => {
          if (event.key === 'Escape') store.set({ open: false });
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [state.open]);

      return h(React.Fragment, null,
        h(SharpenFilter, { amount: state.sharpen }),
        state.open ? h(Panel, { state }) : null
      );
    }

    /* ------------------------------------------------------------------ */
    /* stylesheet                                                          */
    /* ------------------------------------------------------------------ */

    const CSS = `
html.dshbg-on { background-color: #0a0d16; }

html.dshbg-on body {
  background-color: transparent !important;
  --dsw-alias-bg-base: transparent !important;
  --dshbg-veil-rgb: 255, 255, 255;
  --dshbg-side-rgb: 249, 250, 251;
  --dsw-specific-sidebar-fill: rgba(var(--dshbg-side-rgb), var(--dshbg-side-a, 0.55)) !important;
}
html.dshbg-on body[data-ds-dark-theme] {
  --dshbg-veil-rgb: 21, 21, 23;
  --dshbg-side-rgb: 27, 27, 28;
}

html.dshbg-on *:has(> [data-conversation-header-leading]) {
  background-color: rgba(var(--dshbg-veil-rgb), var(--dshbg-top-a, 0.45));
}

html.dshbg-on [data-conversation-scroll] {
  box-sizing: border-box;
  margin: 4px 8px 8px;
  border-radius: 14px;
  background-color: rgba(var(--dshbg-veil-rgb), var(--dshbg-chat-a, 0.32));
}
html.dshbg-on.dshbg-frame [data-conversation-scroll] {
  border: 1px solid var(--dsw-alias-border-l3);
}

html.dshbg-on body::before {
  content: "";
  position: fixed;
  inset: -8%;
  z-index: -1;
  pointer-events: none;
  background-image: var(--dshbg-image, none);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: calc(50% + var(--dshbg-px, 0%)) calc(50% + var(--dshbg-py, 0%));
  filter: var(--dshbg-filter, none);
  transform: translate3d(var(--dshbg-mx, 0px), var(--dshbg-my, 0px), 0);
  will-change: transform;
}
html.dshbg-on body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.44) 46%, rgba(255,255,255,0.6) 100%);
}
html.dshbg-on body[data-ds-dark-theme]::after {
  background-image: linear-gradient(180deg, rgba(8,10,18,0.6) 0%, rgba(8,10,18,0.45) 46%, rgba(8,10,18,0.62) 100%);
}

html.dshbg-on #root,
html.dshbg-on #root > div,
html.dshbg-on body > div:not(#root) { background-color: transparent !important; }

html.dshbg-on *:has(> [data-shell-overlay]) { background: transparent !important; }
html.dshbg-on *:has(> [data-shell-overlay]) > *:not([data-shell-overlay]) {
  background-color: transparent !important;
  background-image: none !important;
}
html.dshbg-on[data-windows-titlebar] *:has(> [data-shell-overlay])::before {
  background: rgba(var(--dshbg-veil-rgb), var(--dshbg-top-a, 0.45)) !important;
}

.dshbg-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px 0 8px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: var(--dsw-alias-button-elevated-fill);
  color: var(--dsw-alias-label-primary);
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  -webkit-app-region: no-drag;
  transition: background-color .12s ease, border-color .12s ease, color .12s ease;
}
.dshbg-trigger:hover { background: var(--dsw-alias-button-floating-hover); }
.dshbg-trigger.is-open {
  border-color: var(--dsw-alias-state-business-primary);
  color: var(--dsw-alias-state-business-primary);
}
.dshbg-trigger:focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 1px; }

.dshbg-setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 16px 0;
  border-bottom: .5px solid var(--dsw-alias-border-l2);
}
.dshbg-setting-text { min-width: 0; }
.dshbg-setting-title { font-size: 14px; line-height: 20px; color: var(--dsw-alias-label-primary); }
.dshbg-setting-desc { margin-top: 4px; font-size: 12px; line-height: 18px; color: var(--dsw-alias-label-secondary); }
.dshbg-setting-control { display: flex; align-items: center; gap: 10px; flex: none; }
.dshbg-setting-swatch {
  width: 46px;
  height: 28px;
  flex: none;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  background-color: var(--dsw-alias-bg-layer-2);
  background-size: cover;
  background-position: center;
}
.dshbg-setting-swatch-empty {
  background-image: repeating-linear-gradient(135deg, rgba(128,128,140,.18) 0 6px, transparent 6px 12px);
}
.dshbg-setting-value { font-size: 13px; color: var(--dsw-alias-label-secondary); white-space: nowrap; }
.dshbg-setting-btn {
  height: 28px;
  padding: 0 12px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-family: inherit;
  font-size: 13px;
  cursor: pointer;
}
.dshbg-setting-btn:hover { background: var(--dsw-alias-interactive-bg-hover); }

.dshbg-backdrop { position: fixed; inset: 0; z-index: 1; background: transparent; }

.dshbg-panel {
  position: fixed;
  z-index: 2;
  width: ${PANEL_WIDTH}px;
  max-height: calc(100vh - 24px);
  bottom: 12px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-radius: 14px;
  overflow: hidden;
  background: var(--dsw-alias-bg-overlay);
  border: 1px solid var(--dsw-alias-border-l2);
  box-shadow: 0 18px 48px -12px rgba(0,0,0,.42), 0 2px 8px rgba(0,0,0,.16);
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 1.45;
  -webkit-app-region: no-drag;
}
.dshbg-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 12px 6px 14px;
}
.dshbg-title { font-size: 13px; font-weight: 600; }
.dshbg-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  cursor: pointer;
}
.dshbg-icon-btn:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dshbg-body { flex: 1; min-height: 0; padding: 0 14px 12px; overflow-y: auto; }
.dshbg-label {
  margin: 10px 0 5px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: .06em;
  color: var(--dsw-alias-label-tertiary);
}
.dshbg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.dshbg-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  overflow: hidden;
  text-align: center;
  transition: border-color .12s ease, box-shadow .12s ease, transform .12s ease;
}
.dshbg-card:hover { border-color: var(--dsw-alias-border-l3); }
.dshbg-card:focus-visible { outline: 2px solid var(--dsw-alias-brand-primary); outline-offset: 1px; }
.dshbg-card.is-active {
  border-color: var(--dsw-alias-brand-primary);
  box-shadow: 0 0 0 1px var(--dsw-alias-brand-primary);
}
.dshbg-thumb-wrap { display: block; width: 100%; }
.dshbg-thumb {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
.dshbg-thumb-none {
  background:
    repeating-linear-gradient(135deg, rgba(128,128,140,.18) 0 6px, transparent 6px 12px),
    var(--dsw-alias-bg-layer-2);
}
.dshbg-thumb-add {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-tertiary);
}
.dshbg-card-label {
  display: block;
  padding: 5px 4px 6px;
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dshbg-card-clear {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: rgba(12,14,22,.72);
  color: #fff;
  cursor: pointer;
}
.dshbg-file { display: none; }
.dshbg-row {
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr) 50px;
  align-items: center;
  gap: 10px;
  padding: 2px 0;
  cursor: pointer;
}
.dshbg-row-label { color: var(--dsw-alias-label-secondary); }
.dshbg-row-value {
  text-align: right;
  color: var(--dsw-alias-label-tertiary);
  font-variant-numeric: tabular-nums;
  font-size: 12px;
}
.dshbg-range {
  width: 100%;
  height: 18px;
  margin: 0;
  accent-color: var(--dsw-alias-brand-primary);
  cursor: pointer;
}
.dshbg-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid var(--dsw-alias-border-l1);
}
.dshbg-row-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 0 2px;
}
.dshbg-switch {
  position: relative;
  display: inline-flex;
  flex: none;
  width: 36px;
  height: 20px;
  cursor: pointer;
}
.dshbg-switch input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
.dshbg-switch-track {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background: var(--dsw-alias-border-l4);
  pointer-events: none;
  transition: background-color .15s ease;
}
.dshbg-switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,.35);
  transition: transform .15s ease;
}
.dshbg-switch input:checked + .dshbg-switch-track { background: var(--dsw-alias-state-business-primary); }
.dshbg-switch input:checked + .dshbg-switch-track .dshbg-switch-thumb { transform: translateX(16px); }
.dshbg-switch input:focus-visible + .dshbg-switch-track { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 2px; }
.dshbg-text-btn {
  padding: 4px 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  cursor: pointer;
}
.dshbg-text-btn:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.dshbg-notice {
  flex: 1;
  min-width: 0;
  text-align: right;
  font-size: 11px;
  color: var(--dsw-alias-label-tertiary);
}
`;

    function insertStylesheet(css) {
      if (typeof styles !== 'undefined' && styles && typeof styles.insert === 'function') {
        return styles.insert(css);
      }
      const element = document.createElement('style');
      element.setAttribute('data-plugin', 'dsh-w-paper');
      element.textContent = css;
      document.head.appendChild(element);
      return () => element.remove();
    }

    /* ------------------------------------------------------------------ */
    /* apply                                                               */
    /* ------------------------------------------------------------------ */

    return {
      inject: ['slots'],
      apply(ctx) {
        const locale = ctx.get('locale');
        if (locale) {
          for (const [id, dict] of [['en', EN], ['zh', ZH]]) {
            ctx.effect(() => {
              try {
                return locale.register(NS, id, dict);
              } catch (error) {
                return () => {};
              }
            });
          }
          tr = locale.bind(NS);
          ctx.effect(() => locale.subscribe(() => store.bump()));
        }

        ctx.effect(() => insertStylesheet(CSS));
        ctx.effect(() => () => clearDocument());

        ctx.slots.inject('conversation.header.leading', () => ctx.slots.register({
          name: 'conversation.header.leading',
        }, GearButton));

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'dsh-w-paper',
          order: 0,
        }, StudioLayer));

        ctx.slots.inject('settings.general.item', () => ctx.slots.register({
          name: 'settings.general.item',
          id: 'dsh-w-paper',
          order: 13,
        }, SettingsRow));
      },
    };
  },
});
