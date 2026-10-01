// Extracts the copy-paste prompts and form values from docs/afternoon-2/workshop.md.
// The tester replays exactly what participants paste, so a doc change is tested as written.
// Usage: node extract-prompts.mjs <workshop.md> <out-dir>
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [, , docPath, outDir] = process.argv;
const lines = readFileSync(docPath, 'utf8').split(/\r?\n/);
mkdirSync(outDir, { recursive: true });

// Collect every ```text block with the nearest non-empty line above it.
const blocks = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() !== '```text') continue;
  let lead = i - 1;
  while (lead >= 0 && lines[lead].trim() === '') lead--;
  const body = [];
  let j = i + 1;
  for (; j < lines.length && lines[j].trim() !== '```'; j++) body.push(lines[j]);
  blocks.push({ lead: lead >= 0 ? lines[lead].trim() : '', body: body.join('\n').trim() });
  i = j;
}

const byFirstLine = (prefix) => blocks.find((b) => b.body.startsWith(prefix));
const byLead = (lead) => blocks.find((b) => b.lead === lead);

const wanted = {
  'dt-start': byFirstLine('/dt-start-project'),
  'dt-summary': byFirstLine('Summarize the final decisions'),
  'dt-record': byFirstLine('Write a curated Design Thinking decision record'),
  'rpi-research': byFirstLine('/rpi-research'),
  'rpi-plan': byFirstLine('/rpi-plan'),
  'rpi-implement': byFirstLine('/rpi-implement'),
  'rpi-review': byFirstLine('/rpi-review'),
  'issue-title': byLead('Title:'),
  'issue-problem': byLead('Problem statement:'),
  'issue-outcome': byLead('Expected outcome:'),
  'issue-acceptance': byLead('Acceptance criteria:'),
  'issue-area': byLead('Area:'),
  'issue-out-of-scope': byLead('Out of scope:'),
  'agent-instructions': byFirstLine('Use the RPI workflow.'),
};

const missing = [];
for (const [name, block] of Object.entries(wanted)) {
  if (!block || !block.body) { missing.push(name); continue; }
  writeFileSync(join(outDir, `${name}.txt`), block.body + '\n');
  console.log(`extracted ${name} (${block.body.length} chars)`);
}
if (missing.length) {
  console.error(`missing prompts: ${missing.join(', ')}`);
  process.exit(1);
}
