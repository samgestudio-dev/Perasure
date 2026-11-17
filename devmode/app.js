/* PeraSure in Dev Mode (https://samge.studio/devmode/?app=perasure, repo devmode-platform): what the platform needs to know about this
   repo. The platform reads this file, then devmode/data/*.js, and opens the app and the component stage from here. Paths are from the
   repo's top folder. Keep in step with the platform's mcp/apps.mjs (perasure). */
window.DM_APP = {
  id: 'perasure',
  name: 'PeraSure',
  mark: 'shared/ps-ui/assets/logos/perasure-mark.svg',   /* drawn white on brand */
  brand: '#1b5fa8',
  repo: 'samgestudio-dev/Perasure',
  jira: 'https://kylith.atlassian.net/browse/',
  figmaDs: 'OBsvf42AiRapcRrasD7KNm',
  ns: 'PS',                                    /* the shared components: window.PS.* */
  entry: 'prototypes/app/index.html',          /* the whole app (DM_PAGES.url builds its addresses) */
  stage: 'shared/stage.html',                  /* one state of one component: ?entry=&state= */
  tokens: 'tokens/tokens.css', changelog: 'tokens/CHANGELOG.md',
  css: 'shared/ps-ui/ps-ui.css', assets: 'shared/ps-ui/assets/', player: 'animations/player.html', motionFile: 'shared/ps-ui/core.js',
  textClass: 'ps-t-', srcVar: '--ps-src',      /* text-style classes and the icon variable the inspector reads */
  zmax: 1.15,                                  /* phone-fit.js: PS_FIT.max (capped zoom) */
  skill: 'perasure-iteration-log', exComp: 'CouponOption'
};
