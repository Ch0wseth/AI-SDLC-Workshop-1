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
let section = '';
let toggle = '';
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('#')) section = lines[i].trim();
  const summary = lines[i].match(/<summary>(.*?)<\/summary>/);
  if (summary) toggle = summary[1];
  if (lines[i].trim() === '</details>') toggle = '';
  if (lines[i].trim() !== '```text') continue;
  let lead = i - 1;
  while (lead >= 0 && lines[lead].trim() === '') lead--;
  const body = [];
  let j = i + 1;
  for (; j < lines.length && lines[j].trim() !== '```'; j++) body.push(lines[j]);
  blocks.push({ section, toggle, lead: lead >= 0 ? lines[lead].trim() : '', body: body.join('\n').trim() });
  i = j;
}

const byFirstLine = (prefix) => blocks.find((b) => b.body.startsWith(prefix));
const byLead = (lead) => blocks.find((b) => b.lead === lead);
const taskAfterCommand = (command) => {
  const index = blocks.findIndex((block) => block.body === command);
  const task = blocks[index + 1];
  return index >= 0 && task?.section === blocks[index].section && !task.body.startsWith('/') ? task : undefined;
};

const wanted = {
  'dt-start': byFirstLine('/dt-start-project'),
  'dt-method-next-command': byFirstLine('/hve-core:dt-method-next.prompt'),
  'dt-brief': byFirstLine('Project name: Music Catalog listening experience'),
  'dt-summary': byFirstLine('Summarize the final decisions'),
  'dt-record': byFirstLine('Write a curated Design Thinking decision record'),
  'brd-start': byFirstLine('Create a business requirements document for the Music Catalog playlist slice.'),
  'rpi-research-command': byFirstLine('/rpi-research'),
  'rpi-research': taskAfterCommand('/rpi-research'),
  'rpi-plan-command': byFirstLine('/rpi-plan'),
  'rpi-plan': taskAfterCommand('/rpi-plan'),
  'rpi-implement-command': byFirstLine('/rpi-implement'),
  'rpi-implement': taskAfterCommand('/rpi-implement'),
  'rpi-review-command': byFirstLine('/rpi-review'),
  'rpi-review': taskAfterCommand('/rpi-review'),
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

const examples = [
  { name: 'dt-example', summary: 'Toggle solution: example prompts for the nine methods', count: 9 },
  { name: 'brd-example', summary: 'Toggle example: a step-by-step BRD conversation', count: 13 },
];
for (const { name, summary, count } of examples) {
  const prompts = blocks.filter((block) => block.toggle === summary);
  if (prompts.length !== count) {
    console.error(`expected ${count} text blocks in "${summary}", found ${prompts.length}`);
    process.exit(1);
  }
  // The BRD toggle starts with step 2; its last block is a conditional clarification-limit response.
  prompts.forEach((block, index) => {
    const number = name === 'brd-example' ? index + 2 : index + 1;
    writeFileSync(join(outDir, `${name}-${String(number).padStart(2, '0')}.txt`), block.body + '\n');
  });
}

const solutions = blocks.filter((block) => /Toggle (solution|example)/i.test(block.toggle));
writeFileSync(join(outDir, 'curated-solutions.txt'), solutions.map((block) =>
  `${block.section}\n${block.toggle}\n${block.lead}\n${block.body}`).join('\n\n') + '\n');
writeFileSync(join(outDir, 'replay-policy.txt'), [
  'You are replaying a published workshop example, not choosing your own learner scenario.',
  'Follow the current message and the relevant curated solution in the reference file below.',
  'Do not invent learner answers, stakeholders, research, test results, metrics, approvals, or waivers.',
  'Wait for the next supplied message instead of autonomously progressing through later conversation steps.',
  'If a required answer is absent, record the gap and stop that action; do not bypass evidence or approval gates.',
  'DT examples are sampled or planned, not evidence that full methods are complete. Keep DT coaching writes under .copilot-tracking/ only.',
  'The separate Documentation authoring turn may curate the published delivery brief in docs/project-planning/playlist-design-decisions.md. This is not human approval or proof of completed DT methods.',
  'BRD drafting may write its documented file in docs/project-planning/. Do not sign off, approve waivers, or execute a backlog handoff.',
  `Curated reference file: ${join(outDir, 'curated-solutions.txt')}`,
].join('\n') + '\n');
