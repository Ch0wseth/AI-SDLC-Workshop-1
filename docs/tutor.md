# Tutor guide — Agentic SDLC with GitHub Copilot

This guide is for tutors and facilitators. It holds **all timing** for both afternoons (4 hours each), the pre-flight checklist, known risks and messaging guardrails. The attendee guides contain no time codes, so keep timing changes in this file only.

- Attendee content: [GitHub Copilot Zero to Hero](afternoon-1/workshop.md) and [AI SDLC with GitHub and GitHub Copilot](afternoon-2/workshop.md)
- Attendee checklist: [prerequisites and pre-D-Day checks](prerequisites.md)
- Maintaining the content: [CONTRIBUTING.md](../CONTRIBUTING.md)

GitHub Copilot Zero to Hero runs the official [GHCopilotHoL](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/) lab on attendee forks of [Philess/gh-copilot-demo](https://github.com/Philess/gh-copilot-demo), then adds Levels 7 to 9 from this repository. AI SDLC with GitHub and GitHub Copilot switches to the Music Catalog template in this repository.

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

Part 1 totals 100 minutes and Part 2 totals 45 minutes.

**If late:** upstream Levels 1 to 6 are the core. Skip the upstream side quests first, then shorten Level 9 to the CLI plugin commands only.

## Afternoon 2 — AI SDLC with GitHub and GitHub Copilot (240 min)

| Start | Block | Minutes | Checkpoint | If late |
| --- | --- | --- | --- | --- |
| 0:00 | Level 0 Setup | 10 | Starter green | Skip the tour |
| 0:10 | Level 1 HVE-Core plugin | 15 | `copilot plugin list` shows hve-core | Use the VS Code extension |
| 0:25 | Level 2 Design Thinking | 35 | DT decisions captured | Hand out the decision summary |
| 1:00 | Level 3 RPI | 70 | Playlist feature merged and tests green | Share your finished branch |
| 2:10 | Break | 10 | Implementation committed, tests pass | |
| 2:20 | Level 4 APM, policy and marketplace | 40 | Lockfile committed and policy audited | Start `apm install` first, explain the lockfile and policy while it runs; demo the audit from recordings |
| 3:00 | Level 5 Agentic workflows | 40 | Daily backlog issue created | Show a prerecorded run |
| 3:40 | Level 6 Copilot cloud agent | 15 | Pull request opened by Copilot | Show a prerecorded pull request |
| 3:55 | Recap | 5 | | |
| 4:00 | End | | | |

Level 3 and the break together form an 80-minute block. The Extra Credits page is optional: use it only for early finishers or as a facilitator-led discussion.

## Pre-flight (day before)

1. Run the AI SDLC smoke test on a fresh copy of the repository:
   1. Create the copy (Level 0 Step 1) and run Level 0 end to end.
   2. Run `copilot plugin marketplace add microsoft/hve-core` and `copilot plugin install hve-core@hve-core`.
   3. Run `apm install` with the pinned `apm.yml`, then `apm policy status --policy-source apm-policy.yml`.
   4. Run `gh aw compile` and `gh aw run daily-backlog`, and confirm the summary issue is created.
   5. Assign a test issue to Copilot and confirm a pull request opens.
2. Compare the upstream repositories with the pinned commits listed in [CONTRIBUTING.md](../CONTRIBUTING.md#upstream-pins), and adjust the timings above if levels changed.
3. Record these fallback artifacts: a passing `apm audit --ci --policy apm-policy.yml`, a failing audit with the deny rule, a daily-backlog issue, an a11y-review issue, and a Copilot cloud agent pull request.
4. Check that the HVE-Core commit pinned in `solutions/afternoon-2/apm.yml` still resolves. If you bump it, update the workshop text as well.
5. Validate the plugin marketplace from a clean profile: `copilot plugin marketplace add <your-org>/<your-repo>`, `copilot plugin marketplace browse music-catalog-marketplace`, then `copilot plugin install music-catalog-conventions@music-catalog-marketplace`.
6. Capture the screenshots listed in each `assets/README.md`.
7. Check the latest [workshop tester](../tests/workshop/afternoon-2/README.md) run. It replays the whole lab on every change to `main`, and an open `[Workshop tester]` issue lists the steps that currently fail.

## Known risks and fallbacks

| Risk | Signal | Fallback |
| --- | --- | --- |
| RPI runs longer than planned | Research still running at +25 min | Tell attendees to accept the plan as-is, or continue from the facilitator's finished branch |
| Model output diverges between attendees | Different file layouts | Prompts are fixed; compare against the acceptance criteria (duplicate returns 409, empty state shown), not against identical code |
| `apm install` takes a long time | Install still running | Start it first, then explain the lockfile and policy while it runs; blocked attendees can use `solutions/afternoon-2/apm.yml` as the reference |
| `apm audit` slow or stuck | No output after several minutes | Show the recorded output; point out that `--no-drift` exists and costs coverage |
| APM tag pin fails | Resolution error | Use the commit SHA pin from `solutions/afternoon-2/apm.yml` |
| `apm install` reports "No harness detected" | Install error | Add `--target copilot` |
| gh-aw workflow cannot authenticate | Run fails at the agent step | Check `permissions: copilot-requests: write`, or configure the `COPILOT_GITHUB_TOKEN` secret |
| Copilot cloud agent does not show the RPI Agent | Custom agent missing from the picker | Agents must be in `.github/agents` on the default branch; merge first |
| Copilot cloud agent setup fails | `copilot-setup-steps` job red | The Actions log shows the failing restore; the firewall is on by default |

## Messaging guardrails

- Keep units distinct. Tokens, AI credits, legacy premium requests and external API cost are **different** units.
- Never state that Auto, HydraFusion or harness choice is the cheapest option. Measure actual usage instead.
- Present HydraFusion as a **Research Preview** only.
- Present `apm audit --policy` as **experimental**.
- Present the import of HVE agents into gh-aw as a **workshop pattern**, not a product feature.
