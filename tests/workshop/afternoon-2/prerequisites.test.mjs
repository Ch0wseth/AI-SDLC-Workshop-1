import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const workshop = readFileSync(new URL('../../../docs/afternoon-2/workshop.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const runner = readFileSync(new URL('./run-lab.sh', import.meta.url), 'utf8').replace(/\r\n/g, '\n');

test('starter readiness belongs to the introduction, not a separate level', () => {
  const introduction = workshop.indexOf('# AI SDLC with GitHub and GitHub Copilot');
  const readiness = workshop.indexOf('## Starter readiness (prerequisite)');
  const firstLevel = workshop.indexOf('# Level 1:');
  assert.ok(introduction >= 0 && readiness > introduction && firstLevel > readiness);
  assert.doesNotMatch(workshop, /Level 0|Baseline Afternoon 2 starter/);
  assert.match(workshop.slice(readiness, firstLevel), /dotnet test\nnpm --prefix src\/front test\ngit status/);
  assert.match(workshop, /since the initial commit of this workshop repository/);
});

test('lab runner checks prerequisite readiness without creating a baseline commit', () => {
  const readiness = runner.slice(runner.indexOf('# ---------------------------------------------------------------- Starter readiness'),
    runner.indexOf('# ---------------------------------------------------------------- Level 1'));
  for (const id of ['pre-starter-layout', 'pre-dotnet-test', 'pre-npm-test', 'pre-clean-tree']) {
    assert.match(readiness, new RegExp(`step ${id} preflight `));
  }
  assert.match(readiness, /'npm --prefix src\/front test'/);
  assert.match(readiness, /tree_clean_check/);
  assert.doesNotMatch(readiness, /git add|git commit|Level 0/);
});

test('DT prompts allow local tracking notes but preserve the implementation boundary', () => {
  const start = workshop.slice(workshop.indexOf('/dt-start-project\n'),
    workshop.indexOf('## Extended track: Product Manager'));
  assert.match(start, /sample all nine HVE Design Thinking methods within a 10–15 minute/);
  assert.match(start, /Now follow the chat for the next 10 minutes/);
  assert.match(start, /the conversation is the exercise/);
  assert.match(start, /working notes only under \.copilot-tracking\//);
  assert.match(start, /application code, tests, and published documentation stay unchanged/);
  assert.doesNotMatch(start, /Do not edit files\./);
  assert.match(start, /exclude users, authentication, persistence, reorder, remove, search, and playlist creation/);
});

test('DT sampler permits exploration and keeps its shortcuts distinct from implementation', () => {
  const dt = workshop.slice(workshop.indexOf('# Level 2:'), workshop.indexOf('## Extended track: Product Manager'));
  for (const method of [
    'Scope Conversations', 'Design Research', 'Input Synthesis', 'Brainstorming', 'User Concepts',
    'Low-Fidelity Prototypes', 'High-Fidelity Prototypes', 'User Testing', 'Iteration at Scale',
  ]) assert.ok(dt.includes(method), method);
  assert.match(dt, /Start with a user problem, not a prescribed feature/);
  assert.match(dt, /These shortcuts do not satisfy the full methods' evidence gates/);
  assert.match(dt, /not the conclusion of your user research/);
  assert.match(dt, /HTTP 409/);
  assert.match(dt, /Leave the duplicate-feedback UX choice open/);
  assert.match(dt, /Do not invent any missing session history/);
  assert.match(runner, /copilot_prompt l2-dt-start/);
  assert.match(runner, /step l2-dt-notes/);
});

test('Level 2 names native DT handoffs without treating the sampler as completed evidence', () => {
  const handoff = workshop.slice(workshop.indexOf('## Debrief and hand off to the shared implementation slice'),
    workshop.indexOf('### Step 2: Review the mapping, not the creativity'));
  for (const prompt of [
    'dt-handoff-problem-space.prompt', 'dt-handoff-solution-space.prompt',
    'dt-handoff-implementation-space.prompt', 'dt-canonical-deck.prompt', 'dt-figma-export.prompt',
  ]) assert.ok(handoff.includes(prompt), prompt);
  assert.match(handoff, /\/hve-core:dt-handoff-implementation-space\.prompt project-slug=music-catalog-listening-experience/);
  assert.match(handoff, /if no Implementation Space method is complete/);
  assert.match(handoff, /workshop-only recap/);
  assert.match(handoff, /it does not start implementation/);
  assert.match(handoff, /Figma MCP server and permission/);
  for (const label of [
    'User-visible capability', 'API endpoints', 'Front-end states',
    'Duplicate handling', 'Accessibility', 'Out of scope',
  ]) assert.ok(handoff.includes(`- **${label}:**`), label);
});

test('Level 2 inspects coach-generated notes without prescribing a save prompt', () => {
  const checkpoint = workshop.slice(workshop.indexOf('### Step 3: Explore the local coaching notes'),
    workshop.indexOf('## Extended track: Product Manager'));
  assert.match(checkpoint, /you do not need to send a separate save prompt/);
  assert.match(checkpoint, /Once it has finished writing/);
  assert.match(checkpoint, /Read the contents, not just the filenames/);
  assert.match(checkpoint, /At least one coach-generated working-state file exists/);
  assert.match(checkpoint, /no manual save step is required/);
  assert.match(checkpoint, /Do not create placeholder notes yourself/);
  assert.match(checkpoint, /Do not treat an empty folder or a chat-only answer as persisted state/);
  assert.match(checkpoint, /dt-coach-tracking-folder\.png/);
  assert.doesNotMatch(checkpoint, /Save or update the local working notes/);
});

test('tester extracts the exploration and implementation handoff separately', () => {
  const output = mkdtempSync(join(tmpdir(), 'dt-prompts-'));
  try {
    const result = spawnSync(process.execPath, [
      fileURLToPath(new URL('./extract-prompts.mjs', import.meta.url)),
      fileURLToPath(new URL('../../../docs/afternoon-2/workshop.md', import.meta.url)),
      output,
    ], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const start = readFileSync(join(output, 'dt-start.txt'), 'utf8');
    const brief = readFileSync(join(output, 'dt-brief.txt'), 'utf8');
    const summary = readFileSync(join(output, 'dt-summary.txt'), 'utf8');
    assert.equal(start.trim(), '/dt-start-project');
    assert.equal(brief.trim().split('\n').length, 3);
    assert.match(brief, /10–15 minute learning exercise/);
    assert.doesNotMatch(start, /POST \/api\/playlist\/tracks/);
    assert.match(summary, /Use this facilitator-owned contract/);
    assert.match(summary, /POST \/api\/playlist\/tracks/);
    const dtExample = readFileSync(join(output, 'dt-example-01.txt'), 'utf8');
    const brdExample = readFileSync(join(output, 'brd-example-06.txt'), 'utf8');
    assert.match(dtExample, /tech-savvy hi-fi enthusiasts/);
    assert.match(brdExample, /Every participant ships the slice with passing tests/);
    assert.match(readFileSync(join(output, 'dt-example-09.txt'), 'utf8'), /what was only planned/);
    assert.match(readFileSync(join(output, 'curated-solutions.txt'), 'utf8'), /Toggle example: a step-by-step BRD conversation/);
    assert.match(readFileSync(join(output, 'replay-policy.txt'), 'utf8'), /Do not invent learner answers/);
    assert.match(readFileSync(join(output, 'replay-policy.txt'), 'utf8'), /Do not sign off, approve waivers/);
  } finally {
    rmSync(output, { recursive: true });
  }
});

test('tester replays curated contributions sequentially without approving the BRD handoff', () => {
  assert.match(runner, /--agent hve-core:dt-coach/);
  assert.match(runner, /--agent hve-core:brd-builder/);
  assert.match(runner, /for number in \$\(seq 2 11\)/);
  assert.match(runner, /skip_step l2-brd-signoff/);
  assert.match(runner, /earlier BRD turn failed; do not invent missing answers/);
  const helpers = readFileSync(new URL('./lib.sh', import.meta.url), 'utf8');
  assert.match(helpers, /cat '\$RESULTS_DIR\/prompts\/replay-policy.txt'/);
});

test('tester fails extraction when a curated solution message disappears', () => {
  const output = mkdtempSync(join(tmpdir(), 'dt-missing-example-'));
  try {
    const source = join(output, 'workshop.md');
    writeFileSync(source, workshop.replace(/```text\nI would like to explore the experience[\s\S]*?```/, ''));
    const result = spawnSync(process.execPath, [
      fileURLToPath(new URL('./extract-prompts.mjs', import.meta.url)), source, join(output, 'prompts'),
    ], { encoding: 'utf8' });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /expected 9 text blocks/);
  } finally {
    rmSync(output, { recursive: true });
  }
});

test('interactive agent changes provide direct CLI commands alongside VS Code selection', () => {
  for (const name of [
    'dt-coach', 'meeting-analyst', 'brd-builder', 'prd-builder', 'functional-planner',
    'backlog-manager', 'rpi-agent', 'adr-creation', 'code-review', 'music-catalog-test-writer',
  ]) assert.ok(workshop.includes(`/agent ${name}`), name);
  assert.match(workshop, /direct name is not recognized/);
  assert.match(workshop, /use the agent picker instead/);
  assert.doesNotMatch(workshop, /^Select \*\*(BRD Builder|DT Coach|Code Review|ADR Creator|Backlog Manager|Functional Planner)\*\*\./m);
});

test('BRD starter and example preserve the supplied workshop facts and review boundaries', () => {
  const brd = workshop.slice(workshop.indexOf('### Step 3: Write the BRD'),
    workshop.indexOf('### Step 4: Turn the BRD into a PRD'));
  assert.match(brd, /Create a business requirements document for the Music Catalog playlist slice/);
  assert.match(brd, /Use only these facts/);
  assert.match(brd, /Ask at most three clarifying questions, then write the BRD/);
  assert.match(brd, /Sponsor: the workshop facilitator/);
  assert.match(brd, /every participant ships the slice with passing tests/);
  assert.match(brd, /These are acceptance targets, not observed results/);
  assert.match(brd, /shared playlist scope as the delivery boundary/);
  assert.match(brd, /<summary>Toggle example: a step-by-step BRD conversation<\/summary>/);
  assert.match(brd, /Send each message separately/);
  assert.match(brd, /docs\/project-planning\/music-catalog-playlist-slice-brd\.md/);
  assert.match(brd, /Verify the file exists/);
  assert.match(brd, /A waiver is not a clean pass/);
  assert.match(brd, /only after inspecting the document/);
  assert.doesNotMatch(brd, /I am acting as the product owner|We have not validated business outcome metrics/);
  const prd = workshop.slice(workshop.indexOf('### Step 4: Turn the BRD into a PRD'),
    workshop.indexOf('### Step 5: Plan the GitHub issue hierarchy'));
  assert.match(prd, /explicitly switch to PRD Builder/);
  assert.match(prd, /\/agent hve-core:prd-builder/);
  assert.match(prd, /command as a separate message/);
  assert.match(prd, /Move from the BRD work to a PRD/);
  assert.match(prd, /carry forward its constraints and open questions/);
  assert.match(prd, /Ask at most 3 clarifying questions, one at a time/);
  assert.match(prd, /Wait for my scope confirmation/);
  assert.match(prd, /Do not select \*\*Yes\*\* merely/);
  assert.match(prd, /ask for my final approval before recording sign-off/);
  assert.match(prd, /POST \/api\/playlist\/tracks/);
  assert.doesNotMatch(prd, /POST \/api\/playlist\/\{trackId\}/);
});

test('PM backlog checks use the reviewed plan rather than a prescribed reference hierarchy', () => {
  const backlog = workshop.slice(workshop.indexOf('### Step 5: Plan the GitHub issue hierarchy'),
    workshop.indexOf('### Step 8: Get a sprint order'));
  assert.match(backlog, /There is no prescribed issue count or reference hierarchy/);
  assert.match(backlog, /requirement coverage, acceptance criteria, dependencies/);
  assert.match(backlog, /explicitly switch to Backlog Manager/);
  assert.match(backlog, /\/agent hve-core:backlog-manager/);
  assert.match(backlog, /Create the GitHub issues in <owner>\/<repo>/);
  assert.match(backlog, /wait for my confirmation before the first create/);
  assert.match(backlog, /reports their URLs/);
  assert.doesNotMatch(backlog, /four sub-issues|five issues|Five open issues|hand-written sample/);
});

test('dev container provisions remote GitHub MCP while the lab retains authorization steps', () => {
  const container = JSON.parse(readFileSync(new URL('../../../.devcontainer.json', import.meta.url), 'utf8'));
  assert.deepEqual(container.customizations.vscode.mcp.servers.github, {
    type: 'http', url: 'https://api.githubcopilot.com/mcp/',
  });
  const setup = workshop.slice(workshop.indexOf('### Step 1: Prepare your Copilot surface'),
    workshop.indexOf('### Step 2 (facilitator demo, optional): Meeting Analyst'));
  assert.match(setup, /GitHub MCP is built in, so do not add a duplicate server/);
  assert.match(setup, /MCP: Add Server/);
  assert.match(setup, /complete GitHub sign-in/);
  assert.match(setup, /without changing anything/);
  assert.match(setup, /cannot pre-authorize your account/);
  assert.match(setup, /MCP: List Servers > github > Start Server/);
  assert.match(setup, /complete the browser authorization/);
  assert.match(setup, /Not automatically with this HTTP configuration/);
  assert.match(setup, /gh auth login/);
  assert.match(setup, /Codespace's `GITHUB_TOKEN`/);
  assert.match(setup, /prefer VS Code's GitHub OAuth sign-in rather than copying a token/);
  assert.match(setup, /password-masked VS Code input variable/);
});
