#!/usr/bin/env -S deno run --import-map import_map.json --allow-read --allow-write
/**
 * Simple Deno script to package static assets into a JSON object. This JSON file can be bundled
 * into a Deno binary so static files can be served within a single binary.
 */
import { encode } from 'std/encoding/base64.ts';
import { walk } from 'std/fs/mod.ts';
import { translatePath } from './utils.ts';

const frontendDist = translatePath('../frontend/dist');
const staticFilesPath = translatePath('../backend/dist/staticFiles.json');

const files: { [key: string]: string } = {};

for await (const fileInfo of walk(frontendDist, { includeDirs: false })) {
  files['/' + fileInfo.name] = encode(Deno.readFileSync(fileInfo.path));
}

const encoder = new TextEncoder();
Deno.writeFileSync(staticFilesPath, encoder.encode(JSON.stringify(files)));
