# Tutor guide — Agentic SDLC with GitHub Copilot

This guide is for tutors and facilitators. It holds **all timing** for both afternoons (4 hours each), the pre-flight checklist, known risks and messaging guardrails. The attendee guides contain no time codes, so keep timing changes in this file only.

- Attendee content: [GitHub Copilot Zero to Hero](afternoon-1/workshop.md) and [AI SDLC with GitHub and GitHub Copilot](afternoon-2/workshop.md)
- Attendee checklist: [prerequisites and pre-D-Day checks](prerequisites.md), or the per-option checklists for [Codespaces](before-d-day-codespace.md), [local dev container](before-d-day-devcontainer.md) and [local tools](before-d-day-local.md)
- Maintaining the content: [CONTRIBUTING.md](../CONTRIBUTING.md)

GitHub Copilot Zero to Hero runs the official [GHCopilotHoL](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/) lab on attendee forks of [Philess/gh-copilot-demo](https://github.com/Philess/gh-copilot-demo), then adds Levels 7 to 9 and an advanced **Deeper primitives** page from this repository. AI SDLC with GitHub and GitHub Copilot switches to the Music Catalog template in this repository.

## Afternoon 1 — GitHub Copilot Zero to Hero (240 min)

| Start | Block | Minutes | Source | Checkpoint |
| --- | --- | --- | --- | --- |
| 0:00 | Setup: fork gh-copilot-demo, open Codespaces or local | 15 | This guide + upstream introduction | Fork opened, front end running |
| 0:15 | Part 1 — Upstream Level 1 Code Completion | 25 | GHCopilotHoL | Completions accepted |
| 0:40 | Part 1 — Upstream Level 2 Copilot Chat | 30 | GHCopilotHoL | Chat fixes and tests |
| 1:10 | Part 1 — Upstream Level 3 Agent Basics | 20 | GHCopilotHoL | Agent change reviewed |
| 1:30 | Part 1 — Upstream Level 4 Plan & Implement | 25 | GHCopilotHoL | Plan implemented, Code Review run |
| 1:55 | Break | 15 | | Work committed |
| 2:10 | Part 2 — Upstream Level 5 Advanced Concepts (instructions, prompts, MCP) | 25 | GHCopilotHoL | Instructions, prompt files, MCP |
| 2:35 | Part 2 — Upstream Level 6 Copilot cloud agent and custom agents on github.com | 20 | GHCopilotHoL | Copilot cloud agent PR opened |
| 2:55 | Level 7 Agent Skills | 15 | This repository | Skill committed |
| 3:10 | Level 8 Copilot CLI | 25 | This repository | Endpoint added from CLI |
| 3:35 | Level 9 Agent Plugins and marketplaces | 15 | This repository | Plugin installed then removed |
| 3:50 | Recap | 10 | This repository | |
| 4:00 | End | | | |

Part 1 totals 100 minutes and Part 2 totals 45 minutes. On the standard track, the **Deeper primitives** page is for early finishers only.

**If late:** upstream Levels 1 to 6 are the core. Skip the upstream side quests first, then shorten Level 9 to the CLI plugin commands only.

### Fast track for advanced developers and architects

Use this variant when most attendees already use agent mode daily. Send upstream Levels 1 to 4 as pre-work, or run them as a 20-minute facilitator demo, and spend the time saved on the **Deeper primitives** page.

| Start | Block | Minutes | Source | Checkpoint |
| --- | --- | --- | --- | --- |
| 0:00 | Setup: fork gh-copilot-demo, open Codespaces or local | 15 | This guide + upstream introduction | Fork opened, front end running |
| 0:15 | Part 1 — Upstream Levels 1 to 4 as a facilitator demo (or pre-work) | 20 | GHCopilotHoL | Attendees can explain why a reviewed plan beats a reviewed diff |
| 0:35 | Part 2 — Upstream Level 5 Advanced Concepts | 30 | GHCopilotHoL | Instructions, prompt files, MCP |
| 1:05 | Part 2 — Upstream Level 6 Copilot cloud agent and custom agents | 25 | GHCopilotHoL | Copilot cloud agent PR opened; assign the issue first so it runs during the next blocks |
| 1:30 | Level 7 Agent Skills | 20 | This repository | Skill committed |
| 1:50 | Break | 15 | | Work committed |
| 2:05 | Level 8 Copilot CLI | 30 | This repository | Endpoint added from CLI |
| 2:35 | Deeper primitives: instruction layering, guardrail hook, MCP governance | 50 | This repository | Path-specific instruction applied, `git push` denied by the hook, MCP inventory done |
| 3:25 | Level 9 Agent Plugins and marketplaces | 20 | This repository | Plugin installed then removed |
| 3:45 | Recap, with the autonomy ladder | 15 | This repository | |
| 4:00 | End | | | |

In the recap, walk the autonomy ladder explicitly and point out that the upstream lab reaches Copilot cloud agent (Level 6) before Copilot CLI (Level 8). Ask the room which controls from the Deeper primitives page they would need before letting the cloud agent work on their own repositories.

## Afternoon 2 — AI SDLC with GitHub and GitHub Copilot (240 min)

| Start | Block | Minutes | Checkpoint | If late |
| --- | --- | --- | --- | --- |
| 0:00 | Introduction and prerequisite readiness | 10 | Prerequisites already complete; unblock attendees if needed | Skip checks already completed before the workshop |
| 0:10 | Level 1 HVE-Core plugin | 10 | `copilot plugin list` shows hve-core | Use the VS Code extension |
| 0:20 | Level 2 Design Thinking | 20 | Learner-led sampler, honest nine-method recap, shared implementation handoff | Preview remaining methods without claiming completion; hand out only the implementation contract |
| 0:40 | Level 2 Curate what you commit | 10 | Reviewed delivery brief saved, curated files committed, `.copilot-tracking` ignored | Inspect the staged file tree; commit only reviewed planning documents |
| 0:50 | Level 3 RPI, with context engineering and the duplicate-add decision | 65 | Playlist feature merged, tests green, decision debriefed | Share your finished branch; keep the 5-minute decision debrief |
| 1:55 | Break | 10 | Implementation committed, tests pass | |
| 2:05 | Level 4 APM, policy and marketplace | 30 | Lockfile and deployed skills committed; policy and PR audit workflow in place | Start `apm install` first, explain the lockfile and policy while it runs; demo the audit from recordings |
| 2:35 | Level 5 Agentic workflows and delegation | 50 | Backlog summary issue created, `test` and `apm-audit` required, one issue assigned to Copilot cloud agent | Show a prerecorded backlog run; finish setup pushes before enabling the strict APM rule |
| 3:25 | Level 6 Review the delegated work, code review and push protection | 20 | Delegated pull request reviewed with the test-writer agent and Copilot code review | Show a prerecorded pull request and review; always demo push protection yourself |
| 3:45 | Recap and architect capstone | 15 | | Keep the recap to 5 minutes and run the capstone as a discussion |
| 4:00 | End | | | |

Level 3 and the break together form a 75-minute block. Stop the room at the plan gate for the duplicate-feedback decision, then run a 5-minute debrief after Review: ask attendees with contrasting choices to explain the trade-off. Do not prescribe two options before the planner explores them. In Level 5, make sure every attendee assigns the issue to Copilot cloud agent as soon as the ruleset step is done: the agent works for 10 to 20 minutes while attendees run the accessibility workflow, and the pull request is ready for Level 6. The Extra Credits page is optional: use it only for early finishers or as a facilitator-led discussion.

For Level 2, allocate 10–15 minutes to the learner-led nine-method sampler and the remaining time to the debrief, shared implementation handoff, and saved-note inspection. Encourage different listening contexts and concepts; do not distribute the six playlist decisions as the brainstorming answer. Use the native Method Next prompt to show state-based recommendations, not to force progress past missing evidence. Prioritize learner contributions in Methods 1–6 and preview Methods 7–9 if time runs short. Tell attendees when the timebox ends; model latency makes this a pacing target, not a guaranteed duration. Never mark simulated research or planned testing as completed evidence.

Use the existing 10-minute curation allocation to save the shared brief with Documentation before the optional PM track, then review and commit the planning files afterwards. Do not add a second writing exercise. In the PM track, retain the supplied business facts and three-question limits, but let the builders choose their questions, templates, traceability, and quality checks. Point out a useful question, an evidence gap, and a native quality-review or handoff decision; these show more HVE value than matching a reference document.

### Extended tracks (outside the 240 minutes)

The core agenda above does not include the role-based extended tracks. Choose how to use them before the day:

| Track | Where | Extra minutes | HVE-Core role guide | Best use |
| --- | --- | --- | --- | --- |
| Product Manager: DT Coach → (Meeting Analyst) → BRD Builder → PRD Builder → Functional Planner → Backlog Manager → GitHub issues | End of Level 2 | about 40 | TPM, Business Program Manager (beta) | Hands-on for a PM-heavy room, otherwise a facilitator demo |
| Tech Lead: ADR Creator, Code Review agent, `/git-commit` | End of Level 3 | 10 to 15 | Tech Lead, Engineer | Early finishers |
| Security Architect: report-only security review delegated to Copilot cloud agent | End of Level 5 | about 20, plus agent run time | Security Architect | Facilitator demo, or hands-on for a security-focused room |

To keep the afternoon at 240 minutes when you run a track hands-on, take the time from elsewhere: shorten the DT Coach prompts in Level 2 (keep the 10-minute curation block), demo Level 4 from recordings, or move Level 5 accessibility and Extra Credits to a demo. For a PM-only audience, start with the introduction and Levels 1 to 2 with the Product Manager track, then Level 5, and demo the rest.

Rules for the tracks:
- Meeting Analyst needs a Microsoft 365 Copilot licence and WorkIQ, and cannot read local transcripts. Always demo it yourself, or skip it.
- Only `/backlog-execute` writes to GitHub. Make attendees read the Functional Planner handoff before they confirm.
- Present the HVE-Core security agents as assistive only. They never replace SAST, DAST, SCA, or qualified human review.
- The gh-aw label-gated delegation (`security-review-delegation.md`) needs a fine-grained PAT stored as `GH_AW_AGENT_TOKEN`. Use your own sandbox and delete the PAT afterwards. Do not ask attendees to create one.
- Hand-written reference outputs for all three tracks (BRD, PRD, backlog handoff, ADR, security report) are in [solutions/afternoon-2/docs](../solutions/afternoon-2/docs/README.md). Use them as labelled facilitator fallbacks, not output shapes or exact wording attendees must reproduce.

## Pre-flight (day before)

1. Run the AI SDLC smoke test on a fresh copy of the repository:
   1. Create the copy using the introduction's **Dev Environment Setup** instructions and complete **Starter readiness (prerequisite)**.
   2. Run `copilot plugin marketplace add microsoft/hve-core` and `copilot plugin install hve-core@hve-core`.
   3. Run `apm install` with the pinned `apm.yml`, then `apm policy status --policy-source apm-policy.yml`.
   4. Run `gh aw compile` and `gh aw run daily-backlog`, and confirm the summary issue is created.
   5. Copy `solutions/afternoon-2/.github/workflows/ci.yml`, push it, and confirm the `test` check passes. Create the ruleset from `solutions/afternoon-2/rulesets/main-tests-required.json` and confirm it appears under **Settings** > **Rules** > **Rulesets**.
   6. Assign a test issue to Copilot and confirm a pull request opens and the `test` check runs after you approve the workflows.
2. Compare the upstream repositories with the pinned commits listed in [CONTRIBUTING.md](../CONTRIBUTING.md#upstream-pins), and adjust the timings above if levels changed.
3. Record these fallback artifacts: a passing `apm audit --ci --policy apm-policy.yml`, a failing audit with the deny rule, a daily-backlog issue, an a11y-review issue, a Copilot cloud agent pull request with its Copilot code review, and a push rejected by push protection with the workshop custom pattern.
4. Check that the HVE-Core commit pinned in `solutions/afternoon-2/apm.yml` still resolves. If you bump it, update the workshop text as well.
5. Validate the plugin marketplace from a clean profile: `copilot plugin marketplace add <your-org>/<your-repo>`, `copilot plugin marketplace browse music-catalog-marketplace`, then `copilot plugin install music-catalog-conventions@music-catalog-marketplace`.
6. Capture the screenshots listed in each `assets/README.md`.
7. Check the latest [workshop tester](../tests/workshop/afternoon-2/README.md) run. It replays the whole lab on every change to `main`, and an open `[Workshop tester]` issue lists the steps that currently fail.

## Known risks and fallbacks

| Risk | Signal | Fallback |
| --- | --- | --- |
| RPI runs longer than planned | Research still running at +25 min | Tell attendees to accept the plan as-is, or continue from the facilitator's finished branch |
| Model output diverges between attendees | Different file layouts | Level 2 exploration deliberately varies; reconcile only the implementation handoff. Level 3 keeps the shared acceptance criteria and duplicate-add UX choice; compare behaviour (409, empty state, accessible feedback), not identical code |
| `apm install` takes a long time | Install still running | Start it first, then explain the lockfile and policy while it runs; blocked attendees can use `solutions/afternoon-2/apm.yml` as the reference |
| `apm audit` slow or stuck | No output after several minutes | Show the recorded output; point out that `--no-drift` exists and costs coverage |
| APM tag pin fails | Resolution error | Use the commit SHA pin from `solutions/afternoon-2/apm.yml` |
| `apm install` reports "No harness detected" | Install error | Add `--target copilot` |
| gh-aw workflow cannot authenticate | Run fails at the agent step | Check `permissions: copilot-requests: write`, or configure the `COPILOT_GITHUB_TOKEN` secret |
| Copilot cloud agent does not show the RPI Agent | Custom agent missing from the picker | Agents must be in `.github/agents` on the default branch; merge first |
| Copilot cloud agent setup fails | `copilot-setup-steps` job red | The Actions log shows the failing restore or build; the firewall is on by default |
| Ruleset creation fails | `gh api` returns 403 or 404 | In a Codespace, clear `GITHUB_TOKEN` so `gh` uses the attendee's login. The attendee needs the admin role on the repository; rulesets on private repositories need a supported plan. Create the ruleset from **Settings** > **Rules** > **Rulesets**, or demo it and continue |
| Delegated pull request shows no checks | Checks wait with **Approve and run workflows** | Expected: workflows on Copilot pull requests need a human approval. Approve them, then wait for the `test` check |
| Delegated pull request not ready at Level 6 | Session still running | Review the session log live, then review the facilitator's prerecorded pull request |
| Attendees chose different duplicate-add approaches | Debrief at the review gate | Compare each approach with the shared acceptance criteria and accessibility needs; differing conformant designs are valid |
| Copilot is missing from **Reviewers** | Copilot code review policy disabled, or the attendee has no licence that includes it | Enable the **Copilot code review** policy, or demo the review yourself |
| **Advanced Security** shows no Secret Protection or custom patterns | No GitHub Secret Protection licence for private repositories | Demo push protection from a licensed repository |
| Backlog Executor cannot create issues | The PM track stops at `/backlog-execute` | Restart Copilot CLI with `--enable-all-github-mcp-tools`, or sign in to the GitHub MCP server in VS Code; fallback: `gh issue create` from `handoff.md` |
| Security Reviewer missing for Copilot cloud agent | The custom agent is not listed, or the assignment ignores it | Check that `.github\agents\security-reviewer.agent.md` is on the default branch; otherwise assign without a custom agent |
| Security delegation workflow does nothing | The label was added but no assignment happened | Check the `GH_AW_AGENT_TOKEN` secret and that the issue still has the `security-review` label |

## Messaging guardrails

- Keep units distinct. Tokens, AI credits, legacy premium requests and external API cost are **different** units.
- Never state that Auto, HydraFusion or harness choice is the cheapest option. Measure actual usage instead. This applies to the model decision guide in the architect capstone too.
- Present HydraFusion as a **Research Preview** only.
- Policy auditing needs no `apm experimental enable` step. Upstream documentation labels `--policy` experimental; distinguish that maturity label from an activation requirement.
- Present the import of HVE agents into gh-aw as a **workshop pattern**, not a product feature.
