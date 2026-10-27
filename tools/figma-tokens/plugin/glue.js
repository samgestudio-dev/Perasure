// Plugin wrapper around core.js. tools/sync-tokens.py concatenates core.js + this file into code.js.
figma.showUI(__html__, { width: 360, height: 460, themeColors: true });
(async () => {
  try {
    const exp = await psExport('plugin');
    exp.digest = psDigest(psGroups(exp));
    figma.ui.postMessage({ type: 'export', data: exp });
  } catch (e) {
    figma.ui.postMessage({ type: 'error', message: String(e && e.message || e) });
  }
})();
figma.ui.onmessage = m => {
  if (m.type === 'open') figma.openExternal(m.url);
  if (m.type === 'close') figma.closePlugin();
};
