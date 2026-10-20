/* PeraSure Playground — shared UI kit for the picker (index.html) and the animation player.
   Material UI 5 (vendor/mui-material@5.18.0, browser build: window.MaterialUI) on React 18
   (vendor/react*, window.React / window.ReactDOM). No JSX / no build step: PG.h = createElement.
   Exposes window.PG = { h, theme, Icon, mount }. */
(function () {
  var M = window.MaterialUI, R = window.React;
  var h = R.createElement;
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  var C = {
    blue: '#2c74be', blueDark: '#235d99', blue50: '#f3f8ff', blue100: '#e4f0ff', blue200: '#c8deff',
    ink: '#141e24', sub: '#5d6970', mute: '#8e989e', line: 'rgba(20,30,36,0.10)',
    page: '#f0f5f4', track: '#e3eaea', paper: '#ffffff', soft: '#f5f7f8'
  };
  var HEAD = '"Hanken Grotesk", Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';
  var BODY = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

  // Soft, layered elevation: a hairline ring + a diffuse drop.
  var ring = '0 0 0 1px rgba(16,24,40,0.05)';
  var shadows = ['none',
    ring + ', 0 1px 2px rgba(16,24,40,0.06)',
    ring + ', 0 1px 3px rgba(16,24,40,0.07), 0 4px 12px rgba(16,24,40,0.05)',
    ring + ', 0 2px 6px rgba(16,24,40,0.08), 0 8px 20px rgba(16,24,40,0.06)',
    ring + ', 0 4px 10px rgba(16,24,40,0.08), 0 14px 32px rgba(16,24,40,0.10)'];
  while (shadows.length < 25) shadows.push(shadows[4]);

  var theme = M.createTheme({
    palette: {
      primary: { main: C.blue, dark: C.blueDark, light: '#5b95d1', contrastText: '#fff' },
      background: { default: C.page, paper: C.paper },
      text: { primary: C.ink, secondary: C.sub, disabled: '#a3abb0' },
      divider: C.line,
      action: { hover: 'rgba(20,30,36,0.04)', selected: 'rgba(44,116,190,0.08)', focus: 'rgba(44,116,190,0.12)' }
    },
    shape: { borderRadius: 12 },
    shadows: shadows,
    typography: {
      fontFamily: BODY,
      h4: { fontFamily: HEAD, fontWeight: 700, fontSize: 32, lineHeight: '38px', letterSpacing: '-0.02em' },
      h5: { fontFamily: HEAD, fontWeight: 700, fontSize: 24, lineHeight: '30px', letterSpacing: '-0.015em' },
      h6: { fontFamily: HEAD, fontWeight: 700, fontSize: 18, lineHeight: '24px', letterSpacing: '-0.01em' },
      subtitle1: { fontWeight: 600, fontSize: 16, lineHeight: '22px', letterSpacing: '-0.005em' },
      subtitle2: { fontWeight: 600, fontSize: 14, lineHeight: '20px' },
      body1: { fontSize: 15, lineHeight: '22px' },
      body2: { fontSize: 13.5, lineHeight: '20px' },
      caption: { fontSize: 12, lineHeight: '16px' },
      overline: { fontWeight: 700, fontSize: 11, lineHeight: '16px', letterSpacing: '0.1em' },
      button: { fontWeight: 600, fontSize: 14, lineHeight: '20px', textTransform: 'none', letterSpacing: 0 }
    },
    transitions: reduce ? { create: function () { return 'none'; } } : undefined,
    components: {
      MuiCssBaseline: { styleOverrides: {
        html: { WebkitTextSizeAdjust: '100%' },
        body: { WebkitTapHighlightColor: 'transparent', WebkitFontSmoothing: 'antialiased', backgroundColor: C.page },
        'a, button, input, [role="button"], [role="tab"]': { touchAction: 'manipulation' }
      } },
      // Press feedback is done with Motion (whileTap scale), not the Material ripple.
      MuiButtonBase: { defaultProps: { disableRipple: true } },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 14, minHeight: 44, paddingLeft: 16, paddingRight: 16 },
          sizeLarge: { minHeight: 52, fontSize: 15, borderRadius: 16 },
          outlined: { borderColor: C.line, backgroundColor: C.paper, color: C.ink, '&:hover': { borderColor: 'rgba(20,30,36,0.18)', backgroundColor: C.soft } },
          text: { '&:hover': { backgroundColor: C.blue50 } }
        }
      },
      MuiIconButton: { styleOverrides: { root: { '&.Mui-focusVisible': { outline: '2px solid ' + C.blue200 } } } },
      MuiCard: { defaultProps: { elevation: 2 }, styleOverrides: { root: { borderRadius: 22 } } },
      MuiPaper: { styleOverrides: { rounded: { borderRadius: 22 } } },
      MuiChip: { styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
        sizeSmall: { height: 22, fontSize: 11, '& .MuiChip-label': { paddingLeft: 7, paddingRight: 7 } }
      } },
      MuiToggleButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
      MuiSlider: { styleOverrides: {
        root: { height: 6, padding: '16px 0' },
        rail: { opacity: 1 },
        // No position easing: a timeline thumb must sit exactly on the current frame
        // (MUI eases left/width by default, which lags and slides back on every loop).
        track: { transition: 'none' },
        thumb: { transition: 'box-shadow 150ms ease', width: 22, height: 22, backgroundColor: '#fff', boxShadow: '0 0 0 1.5px ' + C.blue + ', 0 2px 6px rgba(0,1,40,0.18)',
          '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 1.5px ' + C.blue + ', 0 0 0 7px rgba(44,116,190,0.14)' },
          '&.Mui-active': { boxShadow: '0 0 0 1.5px ' + C.blue + ', 0 0 0 10px rgba(44,116,190,0.16)' } },
        mark: { width: 2, height: 10, borderRadius: 1, backgroundColor: '#fff', opacity: 1 }
      } },
      MuiMenu: { styleOverrides: { paper: { borderRadius: 18 } } },
      MuiListItemButton: { styleOverrides: { root: { borderRadius: 14 } } },
      MuiMenuItem: { styleOverrides: { root: { borderRadius: 12, margin: '0 6px', paddingLeft: 8, paddingRight: 10 } } },
      MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, fontSize: 14, minHeight: 40 } } },
      MuiTooltip: { styleOverrides: { tooltip: { fontSize: 12, borderRadius: 8 } } }
    }
  });
  theme.C = C;

  /* Material icons (rounded set paths) as MUI SvgIcons. */
  var P = {
    back: 'M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z',
    next: 'M10 6 8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z',
    menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    play: 'M8 5v14l11-7z',
    pause: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
    replay: 'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z',
    check: 'M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    download: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z',
    speed: 'M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zm-9.79 6.84a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z',
    done: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    touch: 'M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z',
    animation: 'M15 2c-2.71 0-5.05 1.54-6.22 3.78-1.28.67-2.34 1.72-3 3C3.54 9.95 2 12.29 2 15c0 3.87 3.13 7 7 7 2.71 0 5.05-1.54 6.22-3.78 1.28-.67 2.34-1.72 3-3C20.46 14.05 22 11.71 22 9c0-3.87-3.13-7-7-7zM9 20c-2.76 0-5-2.24-5-5 0-1.12.37-2.16 1-3 0 3.87 3.13 7 7 7-.84.63-1.88 1-3 1zm3-3c-2.76 0-5-2.24-5-5 0-1.12.37-2.16 1-3 0 3.86 3.13 6.99 7 7-.84.63-1.88 1-3 1zm4.7-3.3c-.53.19-1.1.3-1.7.3-2.76 0-5-2.24-5-5 0-.6.11-1.17.3-1.7.53-.19 1.1-.3 1.7-.3 2.76 0 5 2.24 5 5 0 .6-.11 1.17-.3 1.7zM19 12c0-3.86-3.13-6.99-7-7 .84-.63 1.87-1 3-1 2.76 0 5 2.24 5 5 0 1.12-.37 2.16-1 3z',
    palette: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
    phone: 'M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z'
  };
  var Icon = {};
  Object.keys(P).forEach(function (k) {
    Icon[k] = function (props) { return h(M.SvgIcon, props, h('path', { d: P[k] })); };
  });

  /* ---- Motion (vendor/motion@14.4.0/motion-react.js → window.Motion) ----------------------
     All interface motion uses Motion springs defined by visualDuration (how long it looks) +
     bounce, so timings are easy to tune and coordinate. LazyMotion(domMax, strict) loads the
     features incl. layout / layoutId animations; components use the lightweight `m.*`.
     MotionConfig reducedMotion="user" turns transforms off when the phone asks for less motion. */
  var Mo = window.Motion;
  var T = {
    ui:     { type: 'spring', visualDuration: 0.32, bounce: 0.12 },   // general UI movement
    snap:   { type: 'spring', visualDuration: 0.22, bounce: 0.08 },   // indicators, press feedback
    pop:    { type: 'spring', visualDuration: 0.36, bounce: 0.28 },   // things appearing (menu, swatches, pills)
    layout: { type: 'spring', visualDuration: 0.38, bounce: 0.1 },    // cards changing size / position
    fade:   { type: 'tween', duration: 0.2, ease: [0.2, 0, 0, 1] },   // colour / opacity only
    out:    { type: 'tween', duration: 0.14, ease: [0.4, 0, 1, 1] }   // exits: quick and quiet
  };
  var TAP = { scale: 0.96 };

  function mount(el, App) {
    var root = ReactDOM.createRoot(el);
    root.render(h(M.ThemeProvider, { theme: theme }, h(M.CssBaseline),
      h(Mo.MotionConfig, { reducedMotion: 'user', transition: T.ui },
        h(Mo.LazyMotion, { features: Mo.domMax, strict: true }, h(App)))));
    return root;
  }

  // Deploy stamp from this script's own ?v= (set by tools/stamp.py); appended to links and assets.
  var me = document.currentScript && document.currentScript.src || '';
  var v = (/[?&]v=([\w-]+)/.exec(me) || [])[1] || '';

  window.PG = { h: h, theme: theme, Icon: Icon, mount: mount, C: C, reduce: reduce, v: v === 'STAMP' ? '' : v,
    Mo: Mo, m: Mo.m, T: T, TAP: TAP };
})();
