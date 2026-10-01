# Facilitator runbook — Agentic SDLC with GitHub Copilot

This runbook covers both afternoons (4 hours each). Attendee content lives in [Afternoon 1: GitHub Copilot Zero to Hero](../afternoon-1/workshop.md) and [Afternoon 2: AI SDLC with GitHub and GitHub Copilot](workshop.md). The attendee checklist is [prerequisites.md](prerequisites.md).

Afternoon 1 runs the official [GHCopilotHoL](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/) lab on attendee forks of [Philess/gh-copilot-demo](https://github.com/Philess/gh-copilot-demo), then adds Levels 7 to 9 from this repository. Afternoon 2 switches to the Music Catalog template in this repository.

## Timing plan

### Afternoon 1 — GitHub Copilot Zero to Hero (240 min)

| Block | Minutes | Source | Checkpoint |
| --- | --- | --- | --- |
| Setup | 15 | Upstream introduction | Fork opened, front end running |
| Upstream Level 1 Code Completion | 25 | GHCopilotHoL | Completions accepted |
| Upstream Level 2 Copilot Chat | 30 | GHCopilotHoL | Chat fixes and tests |
| Upstream Level 3 Agent Basics | 20 | GHCopilotHoL | Agent change reviewed |
| Upstream Level 4 Plan & Implement | 25 | GHCopilotHoL | Plan implemented, Code Review run |
| Break | 15 | | Work committed |
| Upstream Level 5 Advanced Concepts | 25 | GHCopilotHoL | Instructions, prompt files, MCP |
| Upstream Level 6 Agents on the platform | 20 | GHCopilotHoL | Coding Agent PR opened |
| Level 7 Agent Skills | 15 | This repository | Skill committed |
| Level 8 Copilot CLI | 25 | This repository | Endpoint added from CLI |
| Level 9 Agent Plugins | 15 | This repository | Plugin installed then removed |
| Recap | 10 | This repository | |

Before the session, compare the upstream repositories with the commits recorded in the GitHub Copilot Zero to Hero guide and adjust the timeboxes if levels changed. If late, skip the upstream side quests first, then shorten Level 9 to the CLI commands.

### Afternoon 2 — AI SDLC with GitHub and GitHub Copilot (240 min)

| Block | Minutes | Checkpoint | If late |
| --- | --- | --- | --- |
| Level 0 Setup | 10 | Starter green | Skip the tour |
| Level 1 HVE-Core plugin | 15 | `copilot plugin list` shows hve-core | Use the VS Code extension |
| Level 2 Design Thinking | 35 | DT decisions captured | Hand out the decision summary |
| Level 3 RPI (includes a 10-minute break) | 80 | Playlist feature merged and tests green | Let the facilitator share their finished branch |
| Level 4 APM, policy and marketplace | 40 | Lockfile committed and policy audited | Demo the audit from recordings |
| Level 5 Agentic workflows | 40 | Daily backlog issue created | Show a prerecorded run |
| Level 6 Coding Agent | 15 | Pull request opened by Copilot | Show a prerecorded pull request |
| Recap | 5 | | |

## Pre-flight (day before)

1. Complete the smoke test in [prerequisites.md](prerequisites.md#day-before-smoke-test-facilitator).
2. Record these fallback artifacts: a passing `apm audit --ci --policy apm-policy.yml`, a failing audit with the deny rule, a daily-backlog issue, an a11y-review issue, and a Coding Agent pull request.
3. Check that the HVE-Core commit pinned in `solutions/afternoon-2/apm.yml` still resolves. If you bump it, update the workshop text as well.
4. Validate the plugin marketplace from a clean profile: `copilot plugin marketplace add <your-org>/<your-repo>`, `copilot plugin marketplace browse music-catalog-marketplace`, then `copilot plugin install music-catalog-conventions@music-catalog-marketplace`.
5. Capture the screenshots listed in each `assets/README.md`.
6. Check the latest [workshop tester](../../tests/workshop/afternoon-2/README.md) run. It replays the whole lab on every change to `main`, and an open `[Workshop tester]` issue lists the steps that currently fail.

## Known risks and fallbacks

| Risk | Signal | Fallback |
| --- | --- | --- |
| RPI runs longer than planned | Research still running at +25 min | Tell attendees to accept the plan as-is, or continue from the facilitator's finished branch |
| Model output diverges between attendees | Different file layouts | Prompts are fixed; compare against the acceptance criteria (duplicate returns 409, empty state shown), not against identical code |
| `apm audit` slow or stuck | No output after several minutes | Show the recorded output; point out that `--no-drift` exists and costs coverage |
| APM tag pin fails | Resolution error | Use the commit SHA pin from `solutions/afternoon-2/apm.yml` |
| `apm install` reports "No harness detected" | Install error | Add `--target copilot` |
| gh-aw workflow cannot authenticate | Run fails at the agent step | Check `permissions: copilot-requests: write`, or configure the `COPILOT_GITHUB_TOKEN` secret |
| Coding Agent does not show the RPI Agent | Custom agent missing from the picker | Agents must be in `.github/agents` on the default branch; merge first |
| Coding Agent setup fails | `copilot-setup-steps` job red | The Actions log shows the failing restore; the firewall is on by default |

## Messaging guardrails

- Keep units distinct. Tokens, AI credits, legacy premium requests and external API cost are **different** units.
- Never state that Auto, HydraFusion or harness choice is the cheapest option. Measure actual usage instead.
- Present HydraFusion as a **Research Preview** only.
- Present `apm audit --policy` as **experimental**.
- Present the import of HVE agents into gh-aw as a **workshop pattern**, not a product feature.
