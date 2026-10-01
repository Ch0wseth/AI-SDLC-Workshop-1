# Maintainer handbook

This handbook gives a new maintainer enough context to pick up the workshop without the original authoring notes. It records why the workshop is shaped the way it is, what was verified and how, what is still open, and how to continue the work.

For writing rules, upstream pins and validation commands, see [CONTRIBUTING.md](../CONTRIBUTING.md). For timing and the facilitator's messaging guardrails, see [tutor.md](tutor.md).

## When to use this handbook

- You are taking over maintenance or preparing a new delivery.
- You want to change the scope, order or tooling of an afternoon and need to know which decisions it would reopen.
- You are about to re-verify the workshop against new releases of Copilot, Copilot CLI, APM, HVE-Core or GitHub agentic workflows.

## Workshop intent

The workshop runs over two 4-hour afternoons for a technical audience. Each afternoon builds on the previous one, so the progression is the main design constraint.

| Afternoon | Focus | Source |
| --- | --- | --- |
| 1. GitHub Copilot Zero to Hero | Copilot primitives: completions, chat, instructions, prompts, agents, skills, MCP | Wraps [Philess/GHCopilotHoL](https://github.com/Philess/GHCopilotHoL) and adds Levels 7 to 9 |
| 2. AI SDLC with GitHub and GitHub Copilot | HVE principles, Design Thinking, RPI, APM and plugin marketplace, agentic workflows, Copilot cloud agent delegation | Original content in this repository |

The [README crescendo](../README.md#the-crescendo) explains the order to attendees. Read it before you reorder modules.

## Design decisions

These decisions shape the content. Changing one usually affects several modules, the solutions and the workshop tester.

| # | Decision | Why |
| --- | --- | --- |
| D1 | Two 4-hour afternoons | Fits a customer's half-day slots and separates individual use (Afternoon 1) from team and SDLC use (Afternoon 2). |
| D2 | Afternoon 1 follows GHCopilotHoL | Reuses a maintained lab instead of forking it. Upstream commits are pinned in [CONTRIBUTING.md](../CONTRIBUTING.md#upstream-pins). |
| D3 | Afternoon 2 order: HVE principles → Design Thinking → RPI → APM and plugin marketplace → agentic workflows → Copilot cloud agent | Each step reuses the output of the previous one, ending with controlled delegation. |
| D4 | Hands-on first, demos as fallback | Attendees keep working assets. The tutor guide lists the demo fallbacks. |
| D5 | Environment setup happens before the day | Setup failures should not consume workshop time. See [prerequisites.md](prerequisites.md) and the `before-d-day-*.md` checklists. |
| D6 | One application for all of Afternoon 2: the Music Catalog (`src/front` React 19 + TypeScript + Vite, `src/api` .NET 10 minimal API) | One shared context keeps prompts, reviews and workflows comparable across the room. |
| D7 | Attendees start from a hello-world starter | Keeps the slice small enough to finish. |
| D8 | One feature: browse tracks and add a track to a playlist | Small enough for one RPI loop, rich enough for review findings. |
| D9 | Exactly one in-memory playlist: no persistence, no users, no playlist creation or reordering | Avoids databases and authentication, which add setup without teaching the method. |
| D10 | Duplicate handling and the empty-playlist state are left open | They give attendees real decisions at the RPI review gate. |
| D11 | Every Design Thinking and RPI step has a fixed copy-paste prompt | Keeps the room in step and makes debriefs comparable. The workshop tester extracts these prompts. |
| D12 | Design Thinking plus RPI takes 2 hours or less | Leaves time for APM, workflows and delegation. |
| D13 | HVE-Core is installed through APM inside the application repository | Copilot cloud agent and agentic workflows only see what is in the repository, so a local plugin is not enough. |
| D14–D15 | Agentic workflows: daily backlog management, accessibility review, and security-review delegation | Shows recurring automation that feeds issues back to people and agents. |
| D16 | A generated issue is delegated to Copilot cloud agent | Closes the loop from backlog to pull request under human review. |
| D17 | Reference for agentic workflow layout: [CoffeesoftDotDev/accessibility-copilot](https://github.com/CoffeesoftDotDev/accessibility-copilot) | A working `.md` plus compiled `.lock.yml` example. It also showed that workflows can open repeated failure issues, so the solutions limit and deduplicate their outputs. |

Later additions follow the same pattern:

- **Role tracks.** These are the product manager, developer (RPI) and security tracks, based on the [HVE-Core role guides](https://microsoft.github.io/hve-core/docs/hve-guide/roles/tpm).
- **Level 6.** This adds code review and secret scanning.
- **RPI Agent.** A section explains that RPI Agent runs the `/rpi-*` phases.
- **Workshop Creator agent.** Defined in `.github/agents/workshop-creator.agent.md`, it reproduces this repository's creation path for a new workshop.

## Scope limits

Keep these out of the attendee path unless the design decisions above change:

- No database, file writes or external services in the Music Catalog. State stays in memory.
- No additional front-end state-management or UI libraries.
- Cost, Auto model selection and HydraFusion are optional extension content only. HydraFusion is a Research Preview. No prices or quotas appear anywhere.
- No real customer or personal data. Use synthetic data only.

## Verified facts and how they were checked

Re-check these whenever you bump a version. The dates and versions are from the original verification.

| Fact | How it was checked |
| --- | --- |
| `apm install microsoft/hve-core --target copilot` works; without `--target`, an empty repository fails with "No harness detected" | Run live with APM 0.32.0 on Windows |
| HVE-Core cannot be pinned by release tag (`#hve-core-v3.2.2` fails with "no apm.yml found"); pinning by commit SHA works | Run live. The pin is the v3.2.2 commit `1dbd6a7`, recorded in `solutions/afternoon-2/apm.yml` |
| `apm audit --ci` fails without `apm.lock.yaml`; it passes with the lockfile and the sample policy | Run live. `apm audit --policy` is treated as experimental |
| RPI commands `/rpi`, `/rpi-research`, `/rpi-plan`, `/rpi-implement` and `/rpi-review` exist. The phase commands are skills that also run without RPI Agent. RPI Agent asks for a working mode only when the request does not set one | Read against the installed HVE-Core 3.2.2 plugin files |
| Agentic workflows use `engine: copilot`, safe outputs, and compiled `.lock.yml` files generated by `gh aw compile`, never written by hand | Read in the [gh-aw documentation](https://github.github.com/gh-aw/) |

When a fact cannot be confirmed in official documentation, label it as preview, experimental or unverified in the guide rather than presenting it as settled.

## Open assumptions and risks

| Item | Status | Impact |
| --- | --- | --- |
| Customer licences cover Copilot CLI, the Copilot App, Copilot cloud agent and agentic workflows | Unverified per customer. Check on the [kick-off call](kick-off-call-checklist.md) | High |
| The customer organization allows plugin marketplaces, APM sources and the required network hosts | Unverified per customer. See [prerequisites.md](prerequisites.md) | High |
| Design Thinking plus RPI fits in 2 hours with scripted prompts | Not yet measured in a dry run | High |
| Scripted prompts give similar enough outputs for group debriefs | Assumed | Medium |
| The three solution workflows (`daily-backlog.md`, `a11y-review.md`, `security-review-delegation.md`) compile and run in a real repository | Not compiled in this repository. Run `gh aw compile` in a test repository before delivery | Medium |
| The sample plugin marketplace installs from this repository | Not tested live | Medium |

## Current status

- **Guides.** Both guides keep `published: false` until a dry run is complete.
- **Kick-off deck.** `docs/kick-off.pptx` is current on `main`.
- **Open work.** [#26](https://github.com/Justrebl/AI-SDLC-Workshop/pull/26) adds Codespace security guardrails to the workshop tester.
  - Its source changes are complete and checked statically.
  - The live runs need a `WORKSHOP_TESTER_SANDBOX_TOKEN` repository secret: a fine-grained token with Contents, Issues, Pull requests, Actions and Workflows read and write, and Metadata read.
  - Run once with the egress lock off and once with `WORKSHOP_TESTER_EGRESS_LOCK=1`.
- **Organization settings.** An organization admin still needs to apply the Codespaces and Copilot budget settings described in [#26](https://github.com/Justrebl/AI-SDLC-Workshop/pull/26) before the tester runs unattended.

## Resume the work

### Prerequisites

- Copilot CLI or VS Code with the [HVE-Core plugin](https://microsoft.github.io/hve-core/) installed.
- `gh` with the `gh aw` extension, and `apm`.
- .NET 10 SDK and Node.js for the starter application.

### Step 1: Start from `main` on a feature branch

Use one branch and one pull request per feature. Run `git switch -c feature/<topic> origin/main`.

### Step 2: Run the change through RPI

Describe the change and its acceptance criteria to `/rpi`, or run the phases yourself. For example:

```text
/rpi task="Re-verify Level 4 against the latest APM release and update the guide and solutions"
```

During Research, give the agent this handbook, [CONTRIBUTING.md](../CONTRIBUTING.md) and [tutor.md](tutor.md#messaging-guardrails) so it inherits the decisions, writing rules and guardrails. Expect the agent to verify commands against official documentation before it changes a guide.

### Step 3: Validate and open the pull request

Run the checks in [CONTRIBUTING.md](../CONTRIBUTING.md#validation) that apply to your change, then open a pull request with a conventional commit prefix. Preview the guide on MOAW from your branch.

### Step 4: Merge stacked pull requests

If several pull requests are stacked on each other, merge them with the asynchronous merge API on the top pull request. This merges every open pull request below it:

```bash
gh api -X PUT repos/Justrebl/AI-SDLC-Workshop/pulls/<top-pr>/merge-async -f merge_method=merge
```

`gh pr merge` returns an error for pull requests that are part of a stack.

## Expected outcome

The change is on `main`, the attendee guides stay free of maintainer-only content, and the [workshop tester](../tests/workshop/afternoon-2/README.md) replays Afternoon 2 without opening a failure issue.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `gh aw compile` hangs | Add `--no-check-update` |
| `apm install` fails with "No harness detected" | Pass `--target copilot` |
| APM rejects the HVE-Core pin | Pin a commit SHA, not a release tag |
| The workshop tester cannot find the baseline | Keep the `Baseline Afternoon 2 starter` commit message unchanged |
