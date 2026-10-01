---
description: "Workshop tester: replays the entire Afternoon 2 lab in a throwaway sandbox repository and Codespace, then reports failures as an issue."

on:
  push:
    branches: [main]
    paths:
      - "docs/afternoon-2/**"
      - "solutions/afternoon-2/**"
      - "src/**"
      - "tests/**"
      - "MusicCatalog.slnx"
      - ".devcontainer.json"
      - ".devcontainer/**"
      - ".github/**"
  workflow_dispatch:

# Opt-in: forks, attendee copies and sandbox repositories do not set this variable, so they never run the tester.
if: vars.WORKSHOP_TESTER_ENABLED == 'true'

concurrency:
  group: workshop-tester
  cancel-in-progress: false

permissions:
  contents: read
  issues: read
  actions: read
  copilot-requests: write   # Copilot inference for the validation agent, no PAT required

engine: copilot
timeout-minutes: 20

jobs:
  # Deterministic job: holds the tester secrets, runs the lab in a Codespace and always cleans up.
  # It runs outside the agent sandbox and never fails, so the validation agent always receives results.
  lab_run:
    needs: [activation]
    runs-on: ubuntu-latest
    timeout-minutes: 330
    permissions:
      contents: read
    env:
      GH_TOKEN: ${{ secrets.WORKSHOP_TESTER_TOKEN }}
      COPILOT_GITHUB_TOKEN: ${{ secrets.WORKSHOP_TESTER_COPILOT_TOKEN }}
      SANDBOX_OWNER: ${{ vars.WORKSHOP_TESTER_OWNER || github.repository_owner }}
      SANDBOX_NAME: workshop-tester-${{ github.run_id }}-${{ github.run_attempt }}
      CODESPACE_MACHINE: ${{ vars.WORKSHOP_TESTER_MACHINE || 'standardLinux32gb' }}
      OUT_DIR: ${{ runner.temp }}/lab-run
      SOURCE_REPO: ${{ github.repository }}
      SOURCE_SHA: ${{ github.sha }}
      RUN_URL: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
    steps:
      - uses: actions/checkout@v5
        with:
          persist-credentials: false
      - name: Create sandbox repository and Codespace
        run: bash tests/workshop/afternoon-2/orchestrate.sh setup
      - name: Run the Afternoon 2 lab in the Codespace
        run: bash tests/workshop/afternoon-2/orchestrate.sh run
      - name: Collect lab results
        if: always()
        run: bash tests/workshop/afternoon-2/orchestrate.sh collect
      - name: Delete Codespace and sandbox repository
        if: always()
        run: bash tests/workshop/afternoon-2/orchestrate.sh cleanup
      - name: Upload lab results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: workshop-tester-results
          path: ${{ runner.temp }}/lab-run
          retention-days: 14
          if-no-files-found: warn

  agent:
    needs: [lab_run]

steps:
  - name: Download lab results
    uses: actions/download-artifact@v4
    with:
      name: workshop-tester-results
      path: /tmp/gh-aw/agent/lab-run

tools:
  github:
    toolsets: [repos, issues]
  bash: ["cat", "ls", "find", "grep", "head", "tail", "wc", "jq", "sed -n"]

safe-outputs:
  create-issue:
    title-prefix: "[Workshop tester] "
    labels: [workshop-tester, automation]
    max: 1
    close-older-issues: true
---

# Workshop tester: Afternoon 2 validation report

You are running unattended in GitHub Actions for `${{ github.repository }}` after a change reached `main`. The tested commit is in `meta.json`.
Do not ask questions. Do not modify files. Your only possible outputs are one issue or a `noop`.

A previous deterministic job already did this:

1. Created a throwaway private sandbox repository from a snapshot of this commit.
2. Opened a GitHub Codespace on it, using `.devcontainer.json`.
3. Ran `tests/workshop/afternoon-2/run-lab.sh` in that Codespace. The script replays every level of `docs/afternoon-2/workshop.md`: the commands, the copy-paste prompts (through Copilot CLI `-p`), the real `gh aw run` calls and the Coding Agent assignment.
4. Deleted the Codespace and the sandbox repository.

## Inputs

All inputs are under `/tmp/gh-aw/agent/lab-run/`:

- `meta.json`: source commit, run URL, sandbox name and Codespace machine type.
- `infra/results.jsonl`: setup and cleanup steps (`infra-*`) plus preflight findings.
- `lab/workshop-tester/results.jsonl`: one JSON object per lab step. Fields are `id`, `level`, `title`, `mode`, `command`, `exit_code`, `duration_s`, `status`, `checks[]`, `notes`, `log`, and `log_tail`.
  - `mode` is one of `literal`, `translated`, `emulated` or `skipped`. `literal` means the lab command as written. `translated` means a PowerShell command run as bash. `emulated` means a UI or interactive step replayed non-interactively.
  - `status` is one of `pass`, `fail`, `warn` or `skip`.
- `lab/workshop-tester/steps/<id>.log`: full output of each step. `*.run.log` holds the gh-aw workflow run logs.
- `lab/workshop-tester/sessions/*.md`: the Copilot CLI session transcripts.
- `lab/workshop-tester/usage/*.json`: Copilot CLI usage statistics for each prompt step.
- `lab/workshop-tester/daily-backlog-issue.json`, `coding-agent-pr.json` and `coding-agent-pr-checks.txt`, when they were produced.

If `lab/` is missing, the lab never ran. Report the infrastructure failure from `infra/results.jsonl`.

## Validation

1. Read `docs/afternoon-2/workshop.md` and list every step and its **Expected result** bullets, level by level.
2. Match each documented step to a result `id`, using its `level` and `title`.
   - List any documented step that has no result. That is coverage drift between the lab and `tests/workshop/afternoon-2/run-lab.sh`.
   - List any executed step that no longer exists in the lab.
3. For each step, judge the outcome against the documented expected result, using the `checks`, `exit_code` and logs.
   - Copilot output is non-deterministic. Judge the intent of the expected result, not exact wording.
4. Classify every problem as exactly one of:
   - **Lab defect**: the document is wrong, incomplete or out of order, so a participant following it literally would fail or be confused. Examples: a missing push before a step that needs the remote, files the lab never commits, a missing title, a repository that is not a template.
   - **Solution or code defect**: files under `solutions/afternoon-2/`, `src/`, `tests/` or `.devcontainer*` do not behave as the lab says.
   - **Product or environment change**: a tool, CLI flag, plugin, model, policy or GitHub feature behaved differently than documented. Quote the exact error.
   - **Tester limitation**: the failure comes only from emulation, for example `/plugin` replayed as `copilot plugin list` or prompts sent through `copilot -p`, and a participant would not hit it.
   - **Infrastructure failure**: tokens, sandbox creation, Codespace, SSH or timeouts.
5. Copilot CLI usage: summarize each prompt step from `usage/*.json`, using the units those files report. Do not convert them into premium requests, credits or money.

## Output

- If every step passed and you found no lab defect, solution defect, product change or coverage drift, call `noop`. Include a one-line summary with the number of steps and the total duration.
- Otherwise create **one** issue with this structure:
  - Title: a short summary of the most important failure.
  - `## Summary`: the overall verdict, source commit, link to the run (from `meta.json`), and steps passed, failed, warned and skipped.
  - `## Results by level`: a table with Level | Steps | Pass | Fail | Warn | Skip | Notes.
  - `## Problems`: one subsection per problem. Give the classification, the step `id` and the documented expected result. Add evidence of 15 lines at most from the log, and the smallest suggested fix: the exact doc text to change, or the file to fix.
  - `## Coverage drift`: list it, or write "none".
  - `## Copilot CLI usage`: a table by prompt step, in the reported units.
  - `## Notes`: tester limitations and assumptions.
- Never include tokens, secrets or full environment dumps. Quote only short log excerpts.
