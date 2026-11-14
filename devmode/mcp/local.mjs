/* PeraSure Dev Mode — devmode/data/pages.js, iterations.js and status.js as data, read in Node (they are browser scripts that set
   window.DM_*). Used by the local MCP server and by tools/devmode-mcp-data.mjs, which publishes the same data as JSON for the hosted
   server (Cloudflare Workers can't run these scripts). Output: { BASE, sections, iterations, status }. */
import vm from 'node:vm';

function run(code) {
  const ctx = { window: {}, document: { querySelector: () => null, currentScript: null }, console, URLSearchParams };
  vm.runInNewContext(code, ctx, { timeout: 3000 });
  return ctx.window;
}
export async function localData(read) {
  const [pg, it, st] = await Promise.all(['pages', 'iterations', 'status'].map(f => read(`devmode/data/${f}.js`)));
  const pages = run(pg).DM_PAGES;
  /* plain data only: what core.mjs's pagesFrom() needs (it rebuilds byId, url and js the same way pages.js does) */
  const sections = JSON.parse(JSON.stringify(pages.sections));
  return { BASE: pages.BASE, sections, iterations: JSON.parse(JSON.stringify(run(it).DM_ITERATIONS)), status: JSON.parse(JSON.stringify(run(st).DM_STATUS)) };
}
