#!/usr/bin/env node
/* Dev Mode data for the hosted MCP server — writes devmode/data/pages.js, iterations.js and status.js as one JSON file (the Worker in
   the devmode-platform repo reads it from this repo's branch devmode-mcp; Cloudflare Workers can't run those scripts). The "Dev Mode
   live" workflow runs it on every push to main.   node tools/devmode-mcp-data.mjs [out.json]   (default: stdout) */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function run(code) {
  const ctx = { window: {}, document: { querySelector: () => null, currentScript: null }, console, URLSearchParams };
  vm.runInNewContext(code, ctx, { timeout: 3000 });
  return ctx.window;
}
const read = f => fs.readFileSync(path.join(ROOT, 'devmode', 'data', f + '.js'), 'utf8');
const pages = run(read('pages')).DM_PAGES;
/* plain data only: what the MCP core's pagesFrom() needs (it rebuilds byId, url and js the same way pages.js does) */
const d = { BASE: pages.BASE, sections: JSON.parse(JSON.stringify(pages.sections)),
  iterations: JSON.parse(JSON.stringify(run(read('iterations')).DM_ITERATIONS)), status: JSON.parse(JSON.stringify(run(read('status')).DM_STATUS)) };
const json = JSON.stringify({ commit: process.env.GITHUB_SHA || null, made: new Date().toISOString(), ...d });
if (process.argv[2]) fs.writeFileSync(process.argv[2], json); else process.stdout.write(json);
