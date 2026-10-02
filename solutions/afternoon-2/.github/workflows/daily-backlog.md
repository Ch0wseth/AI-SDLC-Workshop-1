---
description: "Daily backlog triage for the Music Catalog: recommended implementation order and parallelizable work."

on:
  schedule: daily on weekdays
  workflow_dispatch:

permissions:
  contents: read
  issues: read
  pull-requests: read
  copilot-requests: write   # Copilot inference billed through the org, no PAT required

engine: copilot

# Workshop pattern: reuse the HVE-Core Backlog Manager instructions deployed by APM.
# gh-aw merges the agent body into the prompt; capabilities come from `tools:` and `safe-outputs:` below.
imports:
  - .github/agents/backlog-manager.agent.md

tools:
  github:
    toolsets: [repos, issues, pull_requests]

safe-outputs:
  create-issue:
    title-prefix: "[Daily backlog] "
    labels: [backlog-summary, automation]
    max: 1
    expires: 2
    close-older-issues: true
  add-labels:
    allowed: [priority-high, priority-medium, priority-low, parallelizable, needs-triage]
    target: "*"
    create-if-missing: true
    max: 20
---

# Daily backlog summary

You are running unattended inside a GitHub Actions job for the repository `${{ github.repository }}`.
Do not ask questions. Do not assign issues to anyone, including Copilot: delegation stays a human decision.

1. List every **open** issue, excluding issues whose title starts with `[Daily backlog]`.
2. For each issue, infer area (`api`, `front`, `both`), size (S, M, L) and dependencies on other open issues, using only issue content and the repository code.
3. Apply at most one priority label (`priority-high`, `priority-medium`, `priority-low`) to issues that have none. Add `needs-triage` when the issue has no acceptance criteria. Add `parallelizable` to issues that touch disjoint files from every higher-priority issue. For each `add_labels` call, pass the open issue's actual number as `item_number`; scheduled and manually dispatched runs have no triggering issue. Never label a different issue or omit the target.
4. Create **one** summary issue with this structure:
   - `## Recommended implementation order` — a numbered list with issue links and a one-line rationale each.
   - `## Can be developed in parallel` — groups of issues with no shared files or dependency, each group a candidate for separate Copilot coding agent sessions or `/fleet` sub-agents.
   - `## Needs a human decision` — ambiguous or oversized issues.
   - `## Notes` — assumptions you made.
5. If there are no open issues, call `noop` with a short explanation instead of creating an issue.
