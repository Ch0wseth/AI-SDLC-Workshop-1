import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
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
  assert.match(start, /Wait for my answer before moving on/);
  assert.match(start, /working notes only under \.copilot-tracking\//);
  assert.match(start, /including application code, tests, or published documentation/);
  assert.doesNotMatch(start, /Do not edit files\./);
  assert.match(start, /exclude users, authentication, persistence, reorder, remove, search, and playlist creation/);
});

test('DT sampler permits exploration and keeps its shortcuts distinct from implementation', () => {
  const dt = workshop.slice(workshop.indexOf('# Level 2:'), workshop.indexOf('## Extended track: Product Manager'));
  for (const method of [
    'Scope Conversations', 'Design Research', 'Input Synthesis', 'Brainstorming', 'User Concepts',
    'Low-Fidelity Prototypes', 'High-Fidelity Prototypes', 'User Testing', 'Iteration at Scale',
  ]) assert.ok(dt.includes(method), method);
  assert.match(dt, /Do not assume a playlist is the best solution/);
  assert.match(dt, /Do not claim that the full method gates passed/);
  assert.match(dt, /not the conclusion of your user research/);
  assert.match(dt, /HTTP 409/);
  assert.match(dt, /Leave the duplicate-feedback UX choice open/);
  assert.match(dt, /Do not invent any missing session history/);
  assert.match(runner, /skip_step l2-dt-start/);
  assert.match(runner, /copilot_prompt l2-dt-notes/);
});

test('Level 2 persists DT notes before asking learners to inspect their contents', () => {
  const checkpoint = workshop.slice(workshop.indexOf('### Step 3: Save and inspect the local coaching notes'),
    workshop.indexOf('## Extended track: Product Manager'));
  assert.match(checkpoint, /Save or update the local working notes/);
  assert.match(checkpoint, /Wait for the agent to finish and report the paths/);
  assert.match(checkpoint, /Read the contents, not just the filenames/);
  assert.match(checkpoint, /At least one reported working-state file exists/);
  assert.match(checkpoint, /Do not treat an empty folder or a chat-only answer as persisted state/);
  assert.match(checkpoint, /Do not modify files outside \.copilot-tracking\//);
});

test('tester extracts the exploration, implementation handoff, and note-save prompts separately', () => {
  const output = mkdtempSync(join(tmpdir(), 'dt-prompts-'));
  try {
    const result = spawnSync(process.execPath, [
      fileURLToPath(new URL('./extract-prompts.mjs', import.meta.url)),
      fileURLToPath(new URL('../../../docs/afternoon-2/workshop.md', import.meta.url)),
      output,
    ], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const start = readFileSync(join(output, 'dt-start.txt'), 'utf8');
    const summary = readFileSync(join(output, 'dt-summary.txt'), 'utf8');
    const notes = readFileSync(join(output, 'dt-notes.txt'), 'utf8');
    assert.match(start, /Do not assume a playlist is the best solution/);
    assert.doesNotMatch(start, /POST \/api\/playlist\/tracks/);
    assert.match(summary, /Use this facilitator-owned contract/);
    assert.match(summary, /POST \/api\/playlist\/tracks/);
    assert.match(notes, /nine-method coverage recap/);
    assert.match(notes, /Do not modify files outside \.copilot-tracking\//);
  } finally {
    rmSync(output, { recursive: true });
  }
});
