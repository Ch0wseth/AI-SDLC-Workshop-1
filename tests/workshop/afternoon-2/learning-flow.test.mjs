import { readFileSync, existsSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const guide = read('../../../docs/afternoon-2/workshop.md');
const tutor = read('../../../docs/tutor.md');
const workflow = read('../../../solutions/afternoon-2/.github/workflows/daily-backlog.md');
const runner = read('./run-lab.sh');
const level = (number) => guide.slice(guide.indexOf(`# Level ${number}:`),
  guide.indexOf(number === 6 ? '# Recap:' : `# Level ${number + 1}:`));
const visible = (text) => text.replace(/<details>[\s\S]*?<\/details>/g, '');
const header = workflow.split('\n---\n')[0];
const output = (name) => header.match(new RegExp(`^  ${name}:\\n((?:    .*\\n)+)`, 'm'))?.[1];

test('Levels 4-6 explain commands without subjective success claims or timing', () => {
  for (const number of [4, 5, 6]) {
    const text = level(number);
    assert.match(text, /## Topic\n\n[^<]+\n\n\*\*Why this level:\*\*/);
    assert.doesNotMatch(text, /(?:students?|participants?|you) (?:should|will|can) understand|you understand/i);
    assert.doesNotMatch(text, /takes about \d+ minutes|approximately \d+ minutes|^\| \d+-\d+ minutes/m);
    const blocks = [...visible(text).matchAll(/```(?:powershell|bash)\n([\s\S]*?)\n```/g)];
    assert.ok(blocks.length > 0);
    for (const block of blocks) {
      const preceding = visible(text).slice(0, block.index).trim().split('\n\n').at(-1);
      assert.ok(preceding.length > 25, `Level ${number}: purpose before ${block[1].split('\n')[0]}`);
      assert.doesNotMatch(preceding, /^Run:$/);
    }
  }
});

test('the required path works with optional context closed', () => {
  const l4 = visible(level(4));
  const l5 = visible(level(5));
  const l6 = visible(level(6));
  for (const text of ['apm install --target copilot', 'copilot plugin disable hve-core',
    'apm audit --ci --policy apm-policy.yml', 'Restore a passing audit before committing',
    'git add apm.yml apm.lock.yaml apm-policy.yml .github .agents', 'default branch']) {
    assert.ok(l4.includes(text), text);
  }
  for (const text of ['backlog-managed', 'committed', 'gh aw compile', 'gh aw run daily-backlog',
    'Use the RPI workflow.', 'No participant configuration or audit run is required',
    'status-to-issue closure automation off']) {
    assert.ok(l5.includes(text), text);
  }
  for (const text of ['--add-reviewer @copilot', 'posted Copilot review', 'Approve and run workflows',
    'both', '`test`', '`apm-audit`', 'substantive changes', 'Partial delivery stays open']) {
    assert.ok(l6.includes(text), text);
  }
});

test('all task mutations are independently bounded by opt-in filters', () => {
  for (const name of ['add-comment', 'close-issue', 'add-labels', 'remove-labels']) {
    const config = output(name);
    assert.ok(config, name);
    assert.match(config, /target: "\*"/);
    assert.match(config, /required-labels: \[backlog-managed\]/);
    const maximum = Number(config.match(/max: (\d+)/)?.[1]);
    assert.ok(maximum >= 1 && maximum <= 10, `${name} cap`);
  }
  assert.match(output('close-issue'), /state-reason: completed/);
  assert.match(output('create-issue'), /max: 1/);
  assert.match(header, /contents: read\n  issues: read\n  pull-requests: read\n  actions: read/);
  assert.match(header, /toolsets: \[repos, issues, pull_requests, actions\]/);
  assert.doesNotMatch(header, /assign-to-agent:|update-issue:|update-project:|create-pull-request:|github-token:|secrets\./);
});

test('reconciliation preserves requirements and needs explicit revision-bound delivery evidence', () => {
  for (const phrase of ['docs/project-planning/**', 'explicitly linked PRs or fixing commits',
    'Do not match a fix by title', 'actual head', 'Never substitute a green run from another revision',
    'every acceptance criterion', 'implementation and adequate', 'verified on `main`',
    'Keep partial, conflicting, blocked, or unverified delivery open',
    'rewrite issue requirements', 're-read the issue state', 'Evidence key:',
    'do not post another comment', 'unrelated new main SHA', 'Report unprocessed work']) {
    assert.ok(workflow.includes(phrase), phrase);
  }
  assert.match(workflow, /If there are no open issues, use `noop`/);
  assert.match(workflow, /close_issue.*[\s\S]*actual issue number/);
});

test('proctor demos are not replayed as participant runs', () => {
  const l5 = level(5);
  assert.doesNotMatch(l5, /gh aw run a11y-review|Copy-Item .*a11y-review/);
  assert.match(tutor, /playwright.*mode: cli/);
  assert.match(tutor, /@latest.*demonstration configuration/);
  for (const path of ['l4-private-marketplace.png', 'l5-playwright-mcp.png']) {
    assert.ok(existsSync(new URL(`../../../docs/afternoon-2/assets/${path}`, import.meta.url)));
    assert.ok(tutor.includes(path));
  }
  assert.match(runner, /skip_step l4-marketplace-demo/);
  assert.match(runner, /skip_step l5-accessibility-demo/);
  assert.doesNotMatch(runner, /wait_aw_run l5-run-a11y|step l4-plugin-install|skip_step l6-test-writer/);
});

test('the follow-up issue has committed planning evidence before delegation', () => {
  const l5 = level(5);
  assert.ok(l5.indexOf('git commit -m "Plan the remove-from-playlist follow-up"') <
    l5.indexOf('### Step 5: Assign the issue'));
  assert.match(runner, /step l5-planning-follow-up/);
  assert.match(runner, /step l5-managed-issue/);
  assert.match(runner, /managed issue stays open with committed planning evidence/);
  const brief = read('../../../solutions/afternoon-2/docs/project-planning/remove-playlist-track.md');
  assert.match(brief, /excluded from that slice/);
  assert.match(brief, /No persistence, multiple playlists, users, reorder, search/);
  assert.match(l5, /No assignment, application-code write, or Project write is enabled/);
});

test('the dashboard uses configured closure automation, not unchecked agent field writes', () => {
  assert.match(level(5), /Item closed.*Done/);
  assert.match(level(5), /people set the intermediate review state/);
  assert.match(level(6), /configured the closed-item workflow/);
  assert.match(runner, /skip_step l5-project-progress/);
  assert.match(runner, /skip_step l6-accept-and-reconcile/);
});
