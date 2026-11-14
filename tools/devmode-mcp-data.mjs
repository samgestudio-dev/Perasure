#!/usr/bin/env node
/* PeraSure Dev Mode — writes devmode/data/pages.js, iterations.js and status.js as one JSON file for the hosted MCP server
   (worker/index.js reads it from the branch devmode-mcp; Cloudflare Workers can't run those scripts). The "Dev Mode live" workflow
   runs it on every push to main.   node tools/devmode-mcp-data.mjs [out.json]   (default: stdout) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { localData } from '../devmode/mcp/local.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const d = await localData(rel => fs.promises.readFile(path.join(ROOT, rel), 'utf8'));
const json = JSON.stringify({ commit: process.env.GITHUB_SHA || null, made: new Date().toISOString(), ...d });
if (process.argv[2]) fs.writeFileSync(process.argv[2], json); else process.stdout.write(json);
