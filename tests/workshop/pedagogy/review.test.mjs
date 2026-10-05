import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepare, runReview, reviewContext, validateReport, reportHeadings, reviewerArgs } from './review.mjs';

const workflow = readFileSync(new URL('../../../.github/workflows/workshop-pedagogy-review.yml', import.meta.url), 'utf8')
  .replaceAll('\r\n', '\n');
const agent = readFileSync(new URL('../../../.github/agents/workshop-pedagogy-reviewer.agent.md', import.meta.url), 'utf8');
const env = {
  REVIEW_REPOSITORY: 'example/workshop', REVIEW_SHA: 'a'.repeat(40),
  TESTER_RUN_ID: '123', TESTER_RUN_ATTEMPT: '2', TESTER_CONCLUSION: 'failure',
  TESTER_RUN_URL: 'https://github.com/example/workshop/actions/runs/123',
  REVIEW_RUN_ID: '456', REVIEW_RUN_URL: 'https://github.com/example/workshop/actions/runs/456',
};
const completeReport = reportHeadings.map(heading =>
  `## ${heading}\n\n${heading === 'Level-by-level coverage' ? '| A1-L1 | Linked upstream content, not inspected |\n| A2-L1 | Primer and handoff assessed |' : 'Evidence and assessment.'}`
).join('\n\n');

test('provenance retains failed and clean tester runs and uses attempt-specific deduplication', () => {
  for (const conclusion of ['success', 'failure', 'cancelled', 'timed_out']) {
    const context = reviewContext({ ...env, TESTER_CONCLUSION: conclusion });
    assert.equal(context.sha, env.REVIEW_SHA);
    assert.equal(context.testerConclusion, conclusion);
    assert.equal(context.key, 'tester-123-2');
  }
  const manual = reviewContext({ ...env, TESTER_RUN_ID: '' });
  assert.equal(manual.key, 'manual-456');
  assert.equal(manual.testerRunUrl, null);
  for (const override of [
    { REVIEW_SHA: 'main' }, { REVIEW_REPOSITORY: '../other' },
    { TESTER_RUN_ID: 'not-a-run' }, { TESTER_RUN_ATTEMPT: '' },
    { REVIEW_RUN_URL: 'http://github.com/run' },
  ]) assert.throws(() => reviewContext({ ...env, ...override }));
});

test('report validation rejects empty, incomplete, and uncovered-level responses', () => {
  assert.equal(validateReport(completeReport, [{ id: 'A1-L1' }, { id: 'A2-L1' }]), completeReport);
  assert.throws(() => validateReport(''), /empty/);
  assert.throws(() => validateReport('A short summary'), /Missing report section/);
  assert.throws(() => validateReport(completeReport.replace('## Prioritized findings\n\nEvidence and assessment.',
    '## Prioritized findings\n')), /Empty report section/);
  assert.throws(() => validateReport(completeReport, [{ id: 'A2-L6' }]), /Missing level coverage row/);
  assert.throws(() => validateReport(completeReport.replace('## Scope and evidence', '## Overall assessment')
    .replace('## Overall assessment\n\nEvidence and assessment.\n\n## Overall assessment',
      '## Overall assessment\n\nEvidence and assessment.\n\n## Scope and evidence')), /out of order/);
});

test('automation isolates source data and captures only a validated stdout report', () => {
  const root = mkdtempSync(join(tmpdir(), 'pedagogy-test-'));
  try {
    const source = join(root, 'source'), automation = join(root, 'automation'), output = join(root, 'output');
    for (const directory of [
      join(source, 'docs', 'afternoon-1'), join(source, 'docs', 'afternoon-2'),
      join(source, '.github'), join(automation, '.github', 'agents'),
    ]) mkdirSync(directory, { recursive: true });
    writeFileSync(join(source, 'README.md'), 'Workshop overview');
    writeFileSync(join(source, 'docs', 'afternoon-1', 'workshop.md'), '## Open upstream Level 1: Completion');
    writeFileSync(join(source, 'docs', 'afternoon-2', 'workshop.md'),
      '# Level 1: HVE\n![Missing asset](assets/missing.png)');
    writeFileSync(join(source, '.github', 'copilot-instructions.md'), 'Untrusted instructions');
    writeFileSync(join(automation, '.github', 'agents', 'workshop-pedagogy-reviewer.agent.md'), agent);
    prepare(source, automation, output, env);
    const input = JSON.parse(readFileSync(join(output, 'workspace', 'review-input.json'), 'utf8'));
    assert.deepEqual(input.levels.map(level => level.id), ['A1-L1', 'A2-L1']);
    assert.equal(input.files.find(file => file.path.includes('afternoon-2')).images[0].exists, false);
    assert.deepEqual(readdirSync(join(output, 'workspace', '.github')), ['agents']);
    assert.equal(readFileSync(join(output, 'workspace', '.github', 'agents',
      'workshop-pedagogy-reviewer.agent.md'), 'utf8'), agent);
    const summary = process.env.GITHUB_STEP_SUMMARY;
    delete process.env.GITHUB_STEP_SUMMARY;
    try {
      runReview(output, (command, args, options) => {
        assert.equal(command, 'copilot');
        assert.deepEqual(args.slice(0, reviewerArgs.length), reviewerArgs);
        assert.equal(options.cwd, join(output, 'workspace'));
        return { status: 0, stdout: completeReport, stderr: '' };
      });
      assert.match(readFileSync(join(output, 'report.md'), 'utf8'), /Tester run: .* \(failure\)/);
      assert.throws(() => runReview(output, () => ({ status: 1, stderr: 'Authentication failed' })), /Authentication failed/);
      assert.throws(() => runReview(output, () => ({ status: 0, stdout: 'Incomplete' })), /Missing report section/);
    } finally {
      if (summary !== undefined) process.env.GITHUB_STEP_SUMMARY = summary;
    }
  } finally {
    rmSync(root, { recursive: true });
  }
});

test('completion trigger is restricted to the opted-in same-repository main tester', () => {
  const tester = readFileSync(new URL('../../../.github/workflows/workshop-tester.lock.yml', import.meta.url), 'utf8');
  const name = tester.match(/^name: "(.+)"$/m)[1];
  assert.ok(workflow.includes(`workflows: ["${name}"]`));
  for (const guard of [
    "vars.WORKSHOP_TESTER_ENABLED == 'true'", "github.ref == 'refs/heads/main'",
    'github.event.workflow_run.head_repository.full_name == github.repository',
    "github.event.workflow_run.head_branch == 'main'",
    "github.event.workflow_run.path == '.github/workflows/workshop-tester.lock.yml'",
    "github.event.workflow_run.event == 'push'", "github.event.workflow_run.event == 'workflow_dispatch'",
  ]) assert.ok(workflow.includes(guard), guard);
  assert.match(workflow, /types: \[completed\]/);
  assert.doesNotMatch(workflow, /conclusion == 'success'|WORKSHOP_TESTER_TOKEN[ }]/);
  const reviewer = workflow.slice(workflow.indexOf('  review:'), workflow.indexOf('  publish:'));
  assert.doesNotMatch(reviewer, /issues: write|contents: write|GH_TOKEN:/);
  assert.match(reviewer, /head_sha \|\| github.sha/);
  assert.match(workflow, /persist-credentials: false/g);
  assert.match(agent, /tools: \[read, search\]/);
  assert.deepEqual(reviewerArgs.slice(reviewerArgs.indexOf('--model'), reviewerArgs.indexOf('--model') + 4),
    ['--model', 'auto', '--auto-tier', 'intelligence']);
  assert.deepEqual(reviewerArgs.slice(reviewerArgs.indexOf('--available-tools') + 1,
    reviewerArgs.indexOf('--deny-tool')), ['view', 'glob', 'grep']);
});

test('publisher creates only one labelled issue, never updates or closes issues', async () => {
  const script = workflow.split('          script: |\n')[1].split('      - name: Report publishing failure')[0]
    .split('\n').map(line => line.replace(/^ {12}/, '')).join('\n');
  const publish = new Function('require', 'context', 'github', 'core', `return (async () => { ${script} })();`);
  const marker = '<!-- pedagogy-review:tester-123-2 -->';
  const metadata = reviewContext(env);
  for (const existing of [[], [{ number: 9, body: marker, html_url: 'https://github.com/issue/9' }]]) {
    const mutations = [], summaries = [];
    const github = {
      paginate: async () => existing,
      rest: { issues: {
        getLabel: async input => assert.equal(input.name, 'pedagogy-review'),
        listForRepo: () => {},
        create: async input => { mutations.push(input); return { data: { html_url: 'https://github.com/issue/10' } }; },
      } },
    };
    const summary = {
      addRaw(text) { summaries.push(text); return this; },
      addLink() { return this; }, async write() {},
    };
    await publish(() => ({
      readFileSync: path => path.endsWith('context.json') ? JSON.stringify(metadata) : completeReport,
    }), { repo: { owner: 'example', repo: 'workshop' } }, github, { summary });
    assert.equal(mutations.length, existing.length ? 0 : 1);
    if (mutations.length) {
      assert.deepEqual(mutations[0].labels, ['pedagogy-review']);
      assert.ok(mutations[0].body.startsWith(marker));
      assert.equal(mutations[0].assignees, undefined);
    }
    assert.deepEqual(summaries, [completeReport]);
  }
});
