const D = __PAYLOAD__;
// 1. freeze the old collections as Legacy
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const renamed = [];
for (const c of cols) {
  if (['Primitive', 'Semantic', 'Component'].includes(c.name) && c.id.match(/1450:11892|1020:5688|198:8252/)) { c.name = 'Legacy · ' + c.name; renamed.push(c.id); }
}
// 2. new collections, mode Light
function coll(name) {
  let c = cols.find(x => x.name === name && !x.id.match(/1450:11892|1020:5688|198:8252/));
  if (!c) { c = figma.variables.createVariableCollection(name); }
  if (c.modes[0].name !== 'Light') c.renameMode(c.modes[0].modeId, 'Light');
  return c;
}
const P = coll('Primitive'), S = coll('Semantic'), C = coll('Component');
const existing = await figma.variables.getLocalVariablesAsync('COLOR');
const byKey = {}; for (const v of existing) byKey[v.variableCollectionId + '|' + v.name] = v;
function make(c, name, css, scopes, hidden) {
  let v = byKey[c.id + '|' + name];
  if (!v) { v = figma.variables.createVariable(name, c, 'COLOR'); byKey[c.id + '|' + name] = v; }
  v.scopes = scopes; v.hiddenFromPublishing = !!hidden;
  v.setVariableCodeSyntax('WEB', `var(--${css})`);
  return v;
}
const pal = {};
for (const [name, css, [r, g, b, a]] of D.pal) {
  const v = make(P, name, css, [], true);
  v.setValueForMode(P.modes[0].modeId, { r: r / 255, g: g / 255, b: b / 255, a });
  pal[name] = v;
}
for (const [name, css, ref, scopes] of D.sem) {
  const v = make(S, name, css, scopes, false);
  v.setValueForMode(S.modes[0].modeId, figma.variables.createVariableAlias(pal[ref]));
}
for (const [name, css, ref] of D.tag) {
  const v = make(C, name, css, ['ALL_FILLS', 'STROKE_COLOR'], false);
  v.setValueForMode(C.modes[0].modeId, figma.variables.createVariableAlias(pal[ref]));
}
return { renamed, collections: { Primitive: P.id, Semantic: S.id, Component: C.id }, modes: { Primitive: P.modes[0].modeId, Semantic: S.modes[0].modeId, Component: C.modes[0].modeId },
  counts: { palette: D.pal.length, semantic: D.sem.length, tag: D.tag.length } };
