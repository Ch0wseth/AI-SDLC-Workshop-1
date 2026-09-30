---
published: false
type: workshop
title: 'Agentic SDLC with GitHub Copilot — Afternoon 2: HVE-Core, RPI, APM and agentic workflows'
short_title: HVE-Core, RPI and agentic workflows
description: Build a governed Music Catalog feature with HVE-Core, Design Thinking, RPI, APM, GitHub Copilot plugins, gh-aw workflows, and Coding Agent.
level: intermediate
authors: [Julien Strebler]
contacts: ['@justrebl']
duration_minutes: 240
tags: github copilot, hve-core, rpi, design thinking, apm, agentic workflows, coding agent, plugins, accessibility
banner_url: assets/banner.png
navigation_levels: 3
navigation_numbering: false
sections_title:
  - 'Agentic SDLC with GitHub Copilot — Afternoon 2: HVE-Core, RPI, APM and agentic workflows'
  - 'Level 0: Setup and starting point'
  - 'Level 1: HVE orientation and HVE-Core CLI plugin'
  - 'Level 2: Design Thinking with DT Coach'
  - 'Level 3: RPI implementation loop'
  - 'Break'
  - 'Level 4: APM, policy and plugin marketplace'
  - 'Level 5: Agentic workflows with gh-aw'
  - 'Level 6: Coding Agent delegation'
  - 'Recap: Governed agentic SDLC'
  - 'Extra Credits 🪙'
---

# Agentic SDLC with GitHub Copilot — Afternoon 2: HVE-Core, RPI, APM and agentic workflows

*Version 1.0 - September 2026*

The goal of this workshop is to move from Copilot primitives to a governed agentic SDLC. You will use HVE-Core as a methodology source, Design Thinking to frame a deliberately small capability, RPI to implement it, APM and Copilot plugin marketplaces to package the rules, gh-aw to automate backlog and accessibility reviews, and GitHub Copilot Coding Agent to pick up one follow-up issue.

The shared application is the Music Catalog starter. It begins with a React + TypeScript + Vite front end in `src\front`, a .NET 10 minimal API in `src\api`, xUnit API tests in `tests\api`, and synthetic seed data in `src\api\Data\tracks.json`. The capability for today is fixed: **browse tracks and add tracks to a single in-memory playlist**. Duplicate adds are rejected. The empty playlist state is visible.

<div class="warning" data-title="Product evolution">

> GitHub Copilot, Copilot CLI, HVE-Core, APM, Agent Plugins, gh-aw, and Coding Agent evolve quickly. Screens, labels, commands, and availability may change after this workshop is written. When a feature looks different, check the current documentation linked in the relevant section and adapt without changing the learning objective.

</div>

## Minimal Pre-requisites

These are the minimal pre-requisites to run this workshop locally with the starter mono-repo. See the [full Afternoon 2 checklist](prerequisites.md) for policy, licence, and administrator checks.

|                                  |                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Workshop repository              | Create a fresh repository from the [workshop template](https://github.com/Justrebl/AI-SDLC-Workshop). Afternoon 1 used a different demo app. |
| GitHub account with Copilot licence | Business or Enterprise recommended; Coding Agent, plugins, and gh-aw may need administrator enablement. |
| VS Code latest + GitHub Copilot Chat | Required for local agent work. Install the HVE extension only if you use the VS Code alternative.       |
| Git                              | Required for checkpoint commits and for APM dependency resolution.                                        |
| Node.js 22 LTS                  | Required for the Vite + React front end and Copilot CLI.                                                  |
| .NET 10 SDK                     | Required for the minimal API and xUnit integration tests.                                                 |
| GitHub CLI                      | Required for gh-aw installation and GitHub repository operations.                                         |
| Copilot CLI                     | Required for HVE-Core plugin installation and plugin marketplace exercises.                               |
| APM CLI                         | Required for the repository-owned HVE-Core dependency and policy audit.                                   |
| gh-aw extension                 | Required for agentic workflow compilation and runs.                                                       |

<div class="info" data-title="Documented capability labels">

> This workshop labels mechanisms as **documented capability**, **configuration**, **experimental**, **architectural recommendation**, or **workshop simulation**. Keep those labels when you adapt the material so participants do not confuse a verified product feature with a teaching pattern.

</div>

<div class="important" data-title="Synthetic data only">

> The 12 tracks in `src\api\Data\tracks.json` are synthetic sample data. Do not paste customer data, confidential backlog items, credentials, or production telemetry into prompts, issues, workflow runs, screenshots, or plugin manifests.

</div>

![Afternoon 2 route map](assets/a2-route-map.png)

---

# Level 0: Setup and starting point

You have **10 minutes** for this level.

## Topic

You will verify the starter repository, run both test suites, confirm that the playlist capability is not implemented yet, and create a clean checkpoint.

![Starting repository in VS Code](assets/l0-starting-repository.png)

## Validate the starter

### Step 1: Open the repository root

Open the repository that you created from the workshop template. The expected layout is:

```text
src\front
src\api
tests\api
MusicCatalog.slnx
.github\copilot-instructions.md
.github\workflows\copilot-setup-steps.yml
.github\ISSUE_TEMPLATE\feature.yml
solutions\afternoon-2
```

Expected result:
- `src\api\Program.cs` exposes `GET /api/hello` only.
- `src\front\src\App.tsx` fetches `/api/hello` only.
- `src\api\Data\tracks.json` contains 12 synthetic tracks and is not wired to an endpoint yet.

### Step 2: Run API tests

Run from the repository root:

```powershell
dotnet test
```

Expected result:
- xUnit tests pass.
- The existing hello endpoint still works.

### Step 3: Run front-end tests

Run:

```powershell
cd src\front
npm test
```

Expected result:
- Vitest passes.
- The existing test verifies the hello message.

### Step 4: Create a baseline checkpoint

Run from the repository root:

```powershell
git status
git add -A; git commit -m "Baseline Afternoon 2 starter"
```

Expected result:
- Your working tree is clean.
- You can roll back before starting the HVE/RPI flow.

<div class="tip" data-title="If you already committed">

> If Git says there is nothing to commit, that is fine. The important part is that `git status` is clean before you ask agents to edit the repository.

</div>

---

# Level 1: HVE orientation and HVE-Core CLI plugin

You have **15 minutes** for this level.

## Topic

You will install HVE-Core as a personal Copilot CLI plugin and identify the HVE agents used later: DT Coach, RPI Agent, Backlog Manager, Accessibility Reviewer, and Accessibility Planner.

![HVE-Core plugin installed in Copilot CLI](assets/l1-hve-plugin-installed.png)

## Understand HVE-Core

HVE-Core is an opinionated agentic SDLC framework. Its published principle is: **AI carries the rules, humans keep the judgment.** In this workshop, HVE-Core is a methodology source, not a promise that every generated output is correct.

<div class="warning" data-title="Rapidly evolving framework">

> HVE-Core documentation describes it as rapidly evolving and best treated as a source of patterns and learning rather than a stable production dependency. Use it to structure work, then review and test like any other engineering output.

</div>

## Install the CLI plugin

### Step 1: Register the HVE-Core marketplace

Run from any terminal where `copilot` is available:

```powershell
copilot plugin marketplace add microsoft/hve-core
```

Expected result:
- Copilot CLI registers the `hve-core` marketplace.
- If the marketplace already exists, continue.

### Step 2: Install HVE-Core

Run:

```powershell
copilot plugin install hve-core@hve-core
```

Expected result:
- The plugin installs the HVE-Core agents, commands, and skills for your Copilot CLI environment.
- The plugin includes the Research, Plan, Implement, Review lifecycle.

<div class="info" data-title="Documented capability">

> The two commands above come from the HVE-Core plugin documentation. HVE-Core instructions from plugins are not auto-applied as project instructions; project-level instructions still live in your repository.

</div>

### Step 3: Browse plugin commands

Start an interactive Copilot CLI session in the repository root:

```powershell
copilot
```

Then type:

```text
/plugin
```

Expected result:
- You can see installed plugins or plugin help for your CLI version.
- `/rpi`, `/rpi-research`, `/rpi-plan`, `/rpi-implement`, `/rpi-review`, and Design Thinking prompts may be discoverable depending on your version.

### Step 4: VS Code alternative

If the Copilot CLI plugin path is blocked, install the VS Code extension instead:

```text
ise-hve-essentials.hve-core
```

Expected result:
- You can select HVE agents from Copilot Chat in VS Code.
- The remaining prompts still work, but the UI path is different.

![HVE-Core VS Code extension alternative](assets/l1-vscode-extension.png)

## Commit checkpoint

No repository file should change in this level. Run:

```powershell
git status
```

Expected result:
- Your working tree is still clean.

---

# Level 2: Design Thinking with DT Coach

You have **35 minutes** for this level.

## Topic

You will use HVE-Core DT Coach to frame the feature. To keep the room aligned, the inputs and decisions are fixed. The output should identify one capability: browse tracks and add a track to a single in-memory playlist. Duplicate adds are rejected. An empty-state is shown.

![DT Coach framing the playlist capability](assets/l2-dt-coach-framing.png)

## Start a DT project

### Step 1: Open Copilot CLI or VS Code Chat

Use the surface where HVE-Core is available. Select **DT Coach** if your UI offers an agent picker.

### Step 2: Start the project

Copy paste the following prompt:

```text
/dt-start-project

Project name: Music Catalog playlist slice
Audience: workshop participants building a small full-stack feature
Business context: a synthetic music catalog app used to learn governed agentic SDLC practices
Capability: browse tracks and add tracks to a single in-memory playlist
Constraints:
- exactly one playlist
- in-memory API state only
- no users, authentication, persistence, reorder, remove, search, or playlist creation in this slice
- duplicate add is rejected
- empty playlist state is shown
- front-end controls must be accessible by role and label
Expected output: a concise problem statement, user need, success criteria, assumptions, and implementation boundaries
Do not edit files.
```

Expected result:
- DT Coach frames the problem and the user need.
- It does not implement code.
- It preserves the fixed decisions.

<div class="important" data-title="Workshop simulation">

> This is a compressed Design Thinking exercise for a four-hour workshop. It is not validated customer research. Treat the result as facilitator-owned scope control for the implementation exercise.

</div>

## Lock the decisions

### Step 1: Ask for a decision summary

Copy paste the following prompt:

```text
Summarize the final decisions for the Music Catalog playlist slice in exactly six bullets:
1. user-visible capability
2. API endpoints
3. front-end states
4. duplicate handling
5. accessibility expectation
6. out-of-scope items
Do not edit files.
```

Expected result:
- The summary includes browse tracks and add-to-playlist.
- It states duplicate add returns a rejection, not a silent success.
- It states the empty playlist state is visible.

### Step 2: Validate against the fixed scope

Manually check that the DT output does not add extra features. Reject additions such as multiple playlists, persistence, users, album search, drag-and-drop, or recommendation logic.

![DT decisions summary](assets/l2-dt-decisions.png)

## Commit checkpoint

No repository file should change. Run:

```powershell
git status
```

Expected result:
- Your working tree is clean.
- You have a shared feature scope for RPI.

---

# Level 3: RPI implementation loop

You have **80 minutes** for this level, including the break that follows. RPI means **Research, Plan, Implement, Review**. HVE-Core also documents a follow-up stage in the RPI Agent description, but this workshop walks the four core phases.

## Topic

You will use the RPI Agent to implement the playlist slice. The target behavior is fixed:

- API: `GET /api/tracks` returns the 12 tracks from `src\api\Data\tracks.json`.
- API: `GET /api/playlist` returns the current in-memory playlist.
- API: `POST /api/playlist/{trackId}` adds a track and returns `409 Conflict` for duplicates.
- Front end: renders a track list and a playlist panel with an empty state.
- Front end: add buttons are accessible by role and name.
- Tests: xUnit for API behavior and Vitest + Testing Library for UI behavior.

![RPI Agent phase walkthrough](assets/l3-rpi-agent-walkthrough.png)

## Research phase

### Step 1: Ask RPI to research only

Select **RPI Agent** if your UI offers an agent picker. Copy paste the following prompt:

```text
/rpi-research

Task: Implement the Music Catalog playlist slice.

Research only. Do not edit files.

Known repository facts:
- src/api is a .NET 10 minimal API.
- src/api/Program.cs currently exposes GET /api/hello.
- src/api/Data/tracks.json contains 12 synthetic tracks with id, title, artist, album, and durationSeconds.
- tests/api uses xUnit with WebApplicationFactory<Program>.
- src/front is React + TypeScript + Vite.
- src/front/src/App.tsx currently fetches /api/hello.
- src/front tests use Vitest and Testing Library.

Feature requirements:
- GET /api/tracks returns all tracks from tracks.json.
- GET /api/playlist returns the single in-memory playlist.
- POST /api/playlist/{trackId} adds one track to the playlist.
- POST returns 404 when the track id does not exist.
- POST returns 409 when the track is already in the playlist.
- The front end shows a track list, add buttons, and a playlist panel.
- The playlist panel shows an empty state before anything is added.
- Buttons must have accessible names.
- No persistence, users, remove, reorder, search, or styling library.

Expected research output: relevant files, implementation risks, tests to add, and open questions. Resolve open questions using the requirements above rather than asking me.
```

Expected result:
- RPI identifies `Program.cs`, `tracks.json`, API tests, `App.tsx`, and front-end tests.
- It notes in-memory state and duplicate handling.
- It does not edit files.

### Step 2: Research validation

Run:

```powershell
git status
```

Expected result:
- The working tree is clean.
- If files changed, review and undo them before continuing because this phase is research only.

### Step 3: Research checkpoint

If there are no file changes, no commit is needed. If your tool wrote notes intentionally, commit them only after reviewing:

```powershell
git status
git add -A; git commit -m "Record RPI research notes"
```

## Plan phase

### Step 1: Ask for an implementation plan

Copy paste the following prompt:

```text
/rpi-plan

Create an implementation plan for the Music Catalog playlist slice using the research result.

Do not edit files.

The plan must include:
- API model shape for Track and playlist items.
- How Program.cs reads src/api/Data/tracks.json.
- The in-memory playlist service or collection.
- Endpoint behavior and status codes for GET /api/tracks, GET /api/playlist, POST /api/playlist/{trackId}.
- xUnit test cases, including duplicate add returning 409.
- React component state and rendering plan.
- Vitest test cases for loading tracks, empty playlist, adding a track, and duplicate feedback.
- Validation commands.
- A rollback strategy using git commits.
Keep the plan small enough for a workshop.
```

Expected result:
- The plan is sequenced and testable.
- It does not add out-of-scope features.
- It includes `dotnet test` and `npm test` from `src\front`.

### Step 2: Plan validation

Review the plan manually. Reject any plan that adds persistence, creates multiple playlists, changes ports, adds libraries, or stores playlist state in `tracks.json`.

### Step 3: Plan checkpoint

Run:

```powershell
git status
```

Expected result:
- The working tree is clean unless you intentionally saved plan notes.

## Implement phase

### Step 1: Ask RPI to implement

Copy paste the following prompt:

```text
/rpi-implement

Implement the approved Music Catalog playlist slice.

Requirements:
- Keep changes scoped to src/api, tests/api, and src/front unless a test setup file must be updated.
- In the API, read the synthetic track catalog from src/api/Data/tracks.json.
- Add GET /api/tracks returning all tracks.
- Add GET /api/playlist returning the current in-memory playlist.
- Add POST /api/playlist/{trackId} that adds the matching track.
- Return 404 with a JSON error body when trackId is unknown.
- Return 409 with a JSON error body when the track is already in the playlist.
- Keep playlist state in memory only.
- In the front end, render the catalog as a list with accessible Add buttons.
- Render a playlist panel with the empty-state text: "Your playlist is empty. Add a track to get started."
- Show a user-visible message when an add fails because the track is already in the playlist.
- Add or update xUnit tests for the API endpoints.
- Add or update Vitest + Testing Library tests for loading tracks, empty playlist, adding a track, and duplicate feedback.
- Run dotnet test.
- Run npm test from src/front.
- Fix only issues caused by this feature.
```

Expected result:
- The agent edits the API and front end.
- Tests are added.
- Validation commands run or are provided for you to run.

![Playlist feature implemented locally](assets/l3-playlist-implemented.png)

### Step 2: Validate API tests

Run from the repository root:

```powershell
dotnet test
```

Expected result:
- Existing `/api/hello` tests still pass.
- New tests cover tracks, playlist, add, not found, and duplicate conflict.

### Step 3: Validate front-end tests

Run:

```powershell
cd src\front
npm test
```

Expected result:
- Tests pass.
- Testing Library queries use roles or labels for user interactions.

### Step 4: Run the app

In one terminal:

```powershell
cd src\api
dotnet run
```

In another terminal:

```powershell
cd src\front
npm run dev
```

Expected result:
- The browser shows the track catalog.
- The playlist panel shows the empty-state message.
- Adding a track moves or copies it into the playlist panel.
- Adding the same track again shows a duplicate message.

### Step 5: Commit implementation checkpoint

Run from the repository root:

```powershell
git status
git add -A; git commit -m "Implement playlist slice with RPI"
```

## Review phase

### Step 1: Ask RPI to review the implementation

Copy paste the following prompt:

```text
/rpi-review

Review the Music Catalog playlist implementation against the fixed requirements.

Do not implement broad refactors.

Check:
- GET /api/tracks reads the 12 synthetic tracks from src/api/Data/tracks.json.
- GET /api/playlist returns the current in-memory playlist.
- POST /api/playlist/{trackId} returns 404 for unknown ids and 409 for duplicates.
- No persistence, users, remove, reorder, search, or new external services were added.
- Front-end Add buttons have accessible names.
- Empty playlist state is visible with the exact text required.
- Tests cover happy path, duplicate add, empty state, and visible feedback.
- dotnet test and npm test pass.

Return a review with: pass/fail summary, findings, smallest fixes, and validation evidence. If you make fixes, keep them minimal and rerun the relevant tests.
```

Expected result:
- The review is tied to the fixed requirements.
- Any fixes are small and directly related to the feature.

### Step 2: Validate after review

Run both commands again:

```powershell
dotnet test
```

```powershell
cd src\front
npm test
```

Expected result:
- Both suites pass after review fixes.

### Step 3: Commit review checkpoint

Run from the repository root:

```powershell
git status
git add -A; git commit -m "Review playlist slice"
```

<div class="tip" data-title="Reference fallback">

> If your agent drifts too far, reset to the last checkpoint and ask it to implement only the API first, then the front end. The fixed prompts are designed to keep the room homogeneous, but generated output can still vary.

</div>

---

# Break

You have **10 minutes** for this break. Before leaving your machine, make sure the implementation is committed and tests pass.

Run:

```powershell
git status
```

Expected result:
- Your working tree is clean.
- Your latest commit contains the reviewed playlist feature.

<div class="tip" data-title="After the break">

> The next level shifts from implementing the feature to packaging and governing the agentic method. Keep the playlist implementation as-is unless a later validation command fails.

</div>

---

# Level 4: APM, policy and plugin marketplace

You have **40 minutes** for this level.

## Topic

You will install HVE-Core as a repository-owned APM dependency pinned by commit SHA, audit it, inspect a policy failure, and add a team Copilot plugin marketplace containing local Music Catalog conventions.

![APM audit and plugin marketplace](assets/l4-apm-marketplace.png)

## Install HVE-Core through APM

### Step 1: Copy the solution manifest

Run from the repository root:

```powershell
Copy-Item solutions\afternoon-2\apm.yml .\apm.yml
```

Expected result:
- `apm.yml` exists at the repository root.
- It contains the dependency `microsoft/hve-core#1dbd6a7ea90b74accaf8c809262e38952bd4c359`.

<div class="info" data-title="Documented capability plus live verification">

> APM supports GitHub dependencies pinned by ref or SHA. Live verification for this workshop showed that HVE-Core installs successfully when pinned to commit SHA `1dbd6a7ea90b74accaf8c809262e38952bd4c359`; release-tag pins failed for this package version.

</div>

### Step 2: Install the APM dependency

Run:

```powershell
apm install --target copilot
```

Expected result:
- HVE-Core deploys Copilot agents, prompts, and skills into repository-readable locations.
- `apm.lock.yaml` is created.
- The lockfile records the resolved commit.
- The install may take a few minutes.

<div class="tip" data-title="Timing fallback">

> If the room is short on time, start `apm install` first, then explain the lockfile and policy while it runs. If a participant is blocked, use the committed solution manifest as the reference and let the facilitator continue the explanation.

</div>

### Step 3: Inspect the lockfile

Open `apm.lock.yaml` and look for `resolved_commit`.

Expected result:
- The resolved commit matches the pinned HVE-Core commit or the lockfile records the same immutable source.
- You understand that the lockfile is the reproducibility record.

### Step 4: Audit in CI mode

Run:

```powershell
apm audit --ci
```

Expected result:
- The audit passes when the lockfile and deployed files are consistent.
- If it fails, read the failing check and fix only the APM setup.

## Apply repository policy

### Step 1: Copy the policy

Run:

```powershell
Copy-Item solutions\afternoon-2\apm-policy.yml .\apm-policy.yml
```

Expected result:
- `apm-policy.yml` exists at the repository root.
- The policy allows `microsoft/**`, requires pinned constraints, and limits dependency depth.
- The policy sets `mcp.trust.self_defined: deny` for inline MCP definitions.
- The policy uses `executables.deny` to block executable components from `untrusted-org/*`.
- There is no top-level `targets` key in this policy schema.

### Step 2: Audit with policy

First confirm that APM parses the policy file:

```powershell
apm policy status --policy-source apm-policy.yml
```

Expected result:
- The table shows `Outcome: found`, `Enforcement: block` and `Warnings: none`.

Then run the policy audit:

```powershell
apm audit --ci --policy apm-policy.yml
```

<div class="tip" data-title="If the audit seems stuck">

> `apm audit --ci` replays the install to detect drift and may fetch from the network. On restricted networks this can take several minutes. Wait, or ask your facilitator for the recorded output. `--no-drift` skips the replay but reduces coverage, so keep it out of real CI gates.

</div>

Expected result:
- The audit passes for the pinned HVE-Core dependency.
- The `--policy` flag is treated as **experimental** in this workshop because the validated command used the experimental policy path.

<div class="important" data-title="Tighten-only inheritance">

> APM policy inheritance is described as enterprise → org → repo, and lower levels can only tighten the rules. Do not rely on a repository policy to weaken enterprise or organization controls.

</div>

### Step 3: Inspect executable component governance

Open `apm-policy.yml` and find this section:

```yaml
executables:
  deny:
    - "untrusted-org/*"
```

Expected result:
- Participants understand that this section governs executable components, including hooks, `bin` executables, self-defined MCP servers, LSP servers, and canvas extensions from matching packages.
- `deny` always wins over local consent for those executable components.
- This is separate from `dependencies.allow`, which controls dependency source patterns.

<div class="important" data-title="Executable components">

> Treat executable components like code dependencies with runtime impact. Policy should block untrusted executable surfaces even when a package also contains harmless instructions, prompts, or skills.

</div>

### Step 4: Demonstrate a dependency deny rule failure

Temporarily edit `apm-policy.yml` so the dependencies block denies the current package:

```yaml
dependencies:
  deny:
    - "microsoft/hve-core"
  require_pinned_constraint: true
```

Run:

```powershell
apm audit --ci --policy apm-policy.yml
```

Expected result:
- The command fails with exit code `1` because `enforcement: block` denies the installed dependency.

Restore the solution policy:

```powershell
Copy-Item solutions\afternoon-2\apm-policy.yml .\apm-policy.yml
apm audit --ci --policy apm-policy.yml
```

Expected result:
- The audit passes again.

### Step 5: Discuss CI

APM publishes `microsoft/apm-action@v1` for GitHub Actions. A minimal CI pattern is:

```yaml
- uses: microsoft/apm-action@v1
```

Expected result:
- Participants understand that CI can install and audit the declared agent package dependencies.
- The workshop does not require authoring a new CI workflow now.

## Add a team plugin marketplace

### Step 1: Copy marketplace files

Run from the repository root:

```powershell
New-Item -ItemType Directory -Force .github\plugin | Out-Null
New-Item -ItemType Directory -Force .github\copilot | Out-Null
Copy-Item solutions\afternoon-2\.github\plugin\marketplace.json .github\plugin\marketplace.json
Copy-Item solutions\afternoon-2\.github\copilot\settings.json .github\copilot\settings.json
Copy-Item -Recurse -Force solutions\afternoon-2\plugins .\plugins
```

Expected result:
- `.github\plugin\marketplace.json` defines `music-catalog-marketplace`.
- `.github\copilot\settings.json` defines `extraKnownMarketplaces` and enables `music-catalog-conventions@music-catalog-marketplace`.
- `plugins\music-catalog-conventions\plugin.json` defines a local plugin with one test-writer agent and one API endpoint skill.

### Step 2: Inspect the plugin contents

Open:

```text
plugins\music-catalog-conventions\plugin.json
plugins\music-catalog-conventions\agents\music-catalog-test-writer.agent.md
plugins\music-catalog-conventions\skills\add-api-endpoint\SKILL.md
```

Expected result:
- The plugin is a team convention package.
- The skill says API state stays in memory.
- The test-writer agent writes tests only.

### Step 3: Register and browse the marketplace in Copilot CLI

Replace `YOUR-ORG/YOUR-REPO` in `.github\copilot\settings.json` after you push to your own repository. Then run:

```powershell
copilot plugin marketplace add <owner>/<repo>
copilot plugin marketplace browse music-catalog-marketplace
copilot plugin install music-catalog-conventions@music-catalog-marketplace
```

Expected result:
- The marketplace can be registered from the repository.
- The plugin appears as `music-catalog-conventions`.
- The install command uses the exact marketplace name from `marketplace.json`.

<div class="warning" data-title="Configuration versus install">

> `.github\copilot\settings.json` is repository configuration for known and enabled plugins. The CLI marketplace commands install into a user's Copilot environment. Managed organization policy may override local enable or disable commands.

</div>

### Step 4: VS Code Agent Plugins view

In VS Code, open Extensions and search:

```text
@agentPlugins @recommended
```

Expected result:
- When Agent Plugins are available, VS Code shows recommended or configured plugins.
- If the UI is unavailable, explain the configuration pattern and continue.

![VS Code Agent Plugins recommended view](assets/l4-vscode-agentplugins.png)

## Commit checkpoint

Run from the repository root:

```powershell
git status
git add apm.yml apm.lock.yaml apm-policy.yml .github\plugin\marketplace.json .github\copilot\settings.json plugins\music-catalog-conventions
git commit -m "Add governed HVE and plugin marketplace setup"
```

Expected result:
- The APM manifest, lockfile, policy, marketplace, settings, and local plugin are committed.
- No generated workflow lock files are committed in this level.

---

# Level 5: Agentic workflows with gh-aw

You have **40 minutes** for this level.

## Topic

You will install gh-aw, initialize the repository, copy two workflow source files, compile them to `.lock.yml`, and run the daily backlog workflow. You will then inspect the accessibility workflow pattern.

![gh-aw workflow compilation](assets/l5-ghaw-compile.png)

## Install and initialize gh-aw

### Step 1: Install the extension

Run:

```powershell
gh extension install github/gh-aw
```

Expected result:
- The `gh aw` command is available.

### Step 2: Initialize the repository

Run from the repository root:

```powershell
gh aw init
```

Expected result:
- gh-aw initializes repository support for agentic workflows.
- With the Copilot engine, gh-aw may create Copilot-specific artifacts such as an agent and MCP integration depending on the current version.

<div class="info" data-title="Documented capability">

> gh-aw workflow source files are Markdown files in `.github\workflows`. `gh aw compile` produces `.lock.yml` GitHub Actions workflows. Do not hand-edit generated lock files.

</div>

## Add workflow source files

### Step 1: Copy the solution workflows

Run:

```powershell
Copy-Item solutions\afternoon-2\.github\workflows\daily-backlog.md .github\workflows\daily-backlog.md
Copy-Item solutions\afternoon-2\.github\workflows\a11y-review.md .github\workflows\a11y-review.md
```

Expected result:
- `.github\workflows\daily-backlog.md` uses HVE Backlog Manager as a workshop pattern.
- `.github\workflows\a11y-review.md` uses Accessibility Reviewer and Accessibility Planner as a workshop pattern.

### Step 2: Inspect `daily-backlog.md`

Check these mechanisms:

- `permissions: copilot-requests: write` authenticates Copilot inference through GitHub Actions permissions rather than a PAT for this pattern.
- `imports:` references `.github\agents\backlog-manager.agent.md` deployed by APM.
- `safe-outputs:` limits issue creation and labels.
- The prompt explicitly says not to assign issues to Copilot.

Expected result:
- Participants understand that the workflow creates one summary issue with recommended order and parallelizable sets.
- Delegation remains a human decision.

### Step 3: Inspect `a11y-review.md`

Check these mechanisms:

- It imports Accessibility Reviewer and Accessibility Planner.
- It scopes review to `src\front\src\**`.
- It creates at most one issue and closes older matching issues.
- It says the result is not a conformance claim.

Expected result:
- Participants understand the workflow creates an actionable review issue, not an official accessibility certification.

<div class="warning" data-title="Architectural pattern">

> The `imports:` use of HVE agent files is a workshop pattern. gh-aw compilation verifies the syntax, while gh-aw `tools:` and `safe-outputs:` govern actual workflow capabilities. HVE agent files may contain tool names intended for other Copilot surfaces.

</div>

## Compile workflows

### Step 1: Compile

Run:

```powershell
gh aw compile
```

Expected result:
- gh-aw generates `.github\workflows\daily-backlog.lock.yml` and `.github\workflows\a11y-review.lock.yml`.
- Compile succeeds with the HVE imports.

### Step 2: Review generated files without editing

Run:

```powershell
git status
git diff -- .github\workflows\daily-backlog.md .github\workflows\a11y-review.md
```

Expected result:
- You review source Markdown changes.
- You do not hand-edit `.lock.yml` files.

## Run the backlog workflow

### Step 1: Commit workflow sources and locks

Run:

```powershell
git status
git add .github\workflows\daily-backlog.md .github\workflows\daily-backlog.lock.yml .github\workflows\a11y-review.md .github\workflows\a11y-review.lock.yml
git commit -m "Add agentic backlog and accessibility workflows"
```

Expected result:
- The source `.md` files and generated `.lock.yml` files are committed together.

### Step 2: Push your branch

Run:

```powershell
git push
```

Expected result:
- GitHub can see the workflow files.

### Step 3: Run daily backlog

Run:

```powershell
gh aw run daily-backlog
```

Expected result:
- gh-aw triggers the compiled workflow.
- The workflow creates one `[Daily backlog]` summary issue when there are open issues.
- The summary includes `## Recommended implementation order` and `## Can be developed in parallel`.

![Daily backlog summary issue](assets/l5-daily-backlog-issue.png)

### Step 4: Read the summary issue

Open the created issue. Look for:

- Recommended order.
- Parallelizable set.
- Needs human decision.
- Notes and assumptions.

Expected result:
- You can use the issue to decide what humans or agents should do next.
- You do not treat the workflow as an automatic delegation system.

<div class="tip" data-title="Parallel work option">

> Copilot CLI documents `/fleet` as an option for parallel sub-agents in supported versions. Use it only for bounded tasks with independent files, and verify the exact command behavior in your CLI version.

</div>

## Accessibility workflow

### Step 1: Compile evidence

You already compiled `a11y-review.md`. It is enough for the workshop to inspect the workflow source. If your facilitator asks you to run it, use:

```powershell
gh aw run a11y-review
```

Expected result:
- The workflow either creates one accessibility issue or noops when it finds no verified findings.

### Step 2: Commit checkpoint

If you ran the workflow and only GitHub issues changed, no local commit is needed. Run:

```powershell
git status
```

Expected result:
- Your local working tree is clean.

---

# Level 6: Coding Agent delegation

You have **15 minutes** for this level.

## Topic

You will create one follow-up issue from the feature form and assign it to GitHub Copilot Coding Agent using the RPI Agent custom agent if it is available on the default branch.

![Assign issue to Coding Agent with custom agent](assets/l6-coding-agent-assignment.png)

## Create a follow-up issue

### Step 1: Open the feature form

On GitHub, open **Issues > New issue > Feature request**. Use the repository issue form from `.github\ISSUE_TEMPLATE\feature.yml`.

### Step 2: Fill the form

Copy paste the following fixed content into the form fields.

Problem statement:

```text
Users can add tracks to the in-memory playlist, but they cannot remove a track if they added the wrong one.
```

Expected outcome:

```text
A user can remove an existing track from the in-memory playlist without refreshing the page.
```

Acceptance criteria:

```text
- [ ] API exposes a remove operation for an existing playlist track.
- [ ] Removing an unknown or absent track returns a clear error status and JSON body.
- [ ] Front end shows an accessible Remove button for each playlist item.
- [ ] Removing a track updates the playlist panel and restores the empty state when the last item is removed.
- [ ] xUnit and Vitest tests cover the behavior.
```

Area:

```text
both
```

Out of scope:

```text
Persistence, multiple playlists, users, reorder, search, and styling library changes.
```

Expected result:
- A small follow-up issue exists.
- The issue is scoped enough for an agent.

## Assign to Coding Agent

### Step 1: Confirm default branch prerequisites

Coding Agent custom agents and setup workflows must be present on the default branch to be used reliably.

Check:
- `.github\workflows\copilot-setup-steps.yml` is on the default branch.
- HVE-Core RPI Agent files from APM are committed or otherwise available in the repository default branch before selecting that custom agent.
- Your organization allows Coding Agent.

<div class="warning" data-title="Policy-dependent feature">

> Coding Agent availability, custom agent selection, and network settings depend on license and organization policy. If the UI is unavailable, watch the facilitator demo and keep your issue for manual implementation.

</div>

### Step 2: Assign the issue

On the issue page, use **Assignees** or the Copilot task control to assign the issue to Copilot. If the UI lets you choose a custom agent, choose **RPI Agent**.

Copy paste the following additional instructions:

```text
Use the RPI workflow. Research the current playlist implementation, plan the smallest remove-from-playlist change, implement it with tests, and review against the issue acceptance criteria. Keep state in memory only. Do not add persistence, users, multiple playlists, reorder, search, or a styling library. Run dotnet test and npm test from src/front before opening the PR.
```

Expected result:
- Copilot creates a branch and a draft PR or task session, depending on current GitHub behavior.
- The PR references the issue.
- The setup job prepares .NET 10 and Node 22 dependencies.

### Step 3: Review the PR

When the PR is ready, check:

- The implementation stayed within the issue scope.
- Tests ran and passed.
- The firewall did not block required dependency downloads.
- The PR body lists any blocked network requests if they occurred.
- The custom agent did not bypass human review.

<div class="info" data-title="Firewall default">

> GitHub documentation states that Copilot cloud agent internet access is limited by a firewall by default. Allowed hosts and organization policy determine whether dependency downloads work without extra configuration.

</div>

## Commit checkpoint

No local commit is required for this level unless you changed local files. Run:

```powershell
git status
```

Expected result:
- Local work remains clean.
- The follow-up work is tracked in GitHub.

---

# Recap: Governed agentic SDLC

You have **5 minutes** for this recap.

## Topic

You will connect the afternoon into one operating model.

## What you practiced

You started with a clean starter app. You used DT Coach to constrain the problem. You used RPI Agent to research, plan, implement, and review a full-stack slice. You converted methodology into repository-owned dependencies with APM and a lockfile. You used policy to show how governance can block unapproved agent packages. You packaged team conventions as a Copilot plugin marketplace. You compiled gh-aw workflows for backlog triage and accessibility review. You created a follow-up issue for Coding Agent.

## Operating model

| Layer | What it did today | Governance point |
| ----- | ----------------- | ---------------- |
| DT Coach | Framed the capability and boundaries. | Humans accepted fixed decisions. |
| RPI Agent | Sequenced research, plan, implement, review. | Tests and commits verified progress. |
| APM | Installed HVE-Core into the repo with a SHA pin. | `apm.lock.yaml` and policy audit made it reproducible. |
| Plugin marketplace | Shared Music Catalog conventions. | Marketplace and settings made plugin enablement explicit. |
| gh-aw | Ran backlog and accessibility workflows. | `safe-outputs` limited writes. |
| Coding Agent | Picked up one scoped follow-up issue. | Human issue, setup workflow, firewall, PR review. |

<div class="important" data-title="Human judgment stays in the loop">

> The SDLC is agentic, not unattended. Humans choose scope, approve policies, review outputs, validate tests, and decide what lands on the default branch.

</div>

## Final validation

Run from the repository root:

```powershell
dotnet test
```

Then run:

```powershell
cd src\front
npm test
```

Expected result:
- API tests pass.
- Front-end tests pass.
- Your repository has clean, reviewed commits for the playlist slice and governance setup.

---

# Extra Credits 🪙

Use this section only if you finish early or as a facilitator-led discussion. Do not add unverified prices or unpublished claims.

## Usage-unit matrix

Different experiences can consume different units. Keep units distinct when reporting cost or usage.

| Experience | Usage unit to track | Notes |
| ---------- | ------------------- | ----- |
| VS Code Chat and Agent | AI credits under the current Copilot billing model | Since June 1, 2026, documented Copilot billing uses AI credits; 1 credit = $0.01. Code completions are not billed on paid plans. |
| Copilot CLI | AI credits | CLI model usage is billed through the same AI-credit model. Use `/usage` if your CLI version supports it; verify in your CLI version. |
| Coding Agent | AI credits plus separate GitHub Actions runner consumption where applicable | The agent runs in a GitHub Actions-powered environment; keep AI credits and runner minutes separate. |
| gh-aw with Copilot engine | AI credits for Copilot requests; GitHub Actions workflow execution for compute | `permissions: copilot-requests: write` enables Copilot requests from the workflow pattern used here. |
| External APIs, MCP tools, or package registries | Provider-specific units | Do not blend third-party API fees with Copilot AI credits. |

Official references to verify during delivery:
- GitHub Copilot billing and usage: https://docs.github.com/en/copilot/concepts/billing-and-usage
- GitHub Copilot CLI documentation: https://docs.github.com/en/copilot/how-tos/copilot-cli
- Coding Agent customization: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent

<div class="warning" data-title="No invented prices">

> This workshop states the documented AI-credit unit and avoids invented model prices. Premium requests are legacy for the current 2026 framing in the research notes. Code completions are not billed on paid plans under the documented AI-credit model.

</div>

## Auto model selection

Auto model selection is a documented capability in GitHub Copilot experiences including VS Code, Copilot CLI, Copilot App, and GitHub.com surfaces. The documented tiers are:

| Tier | Priority | Typical use |
| ---- | -------- | ----------- |
| Efficiency | Cost | Fast, straightforward tasks. |
| Balance | Cost, quality and latency | Everyday work. |
| Intelligence | Quality | Complex tasks. |

Auto excludes models not in your plan, models blocked by administrator policy, and models blocked by data residency or FedRAMP constraints. Research verified a documented discount for paid-plan users, but do not claim Auto is always cheapest, fastest, or best. Record the model actually selected when you need reproducibility.

Copy paste the following prompt when comparing model behavior:

```text
For this task, tell me which model was used or selected if the surface exposes it. Summarize why the task was routed that way if the product provides that explanation. Do not guess hidden routing details.
```

Expected result:
- You collect reproducibility evidence when the surface exposes it.
- You do not infer private routing or cost decisions.

## HydraFusion research preview

Project HydraFusion is described by GitHub as a **research preview**. The verified execution patterns are:

- **Single**: one selected model solves the task directly.
- **Cascade**: an efficient model drafts a solution and a quality gate decides whether to accept or escalate.
- **Critique**: one model drafts, an independent critic reviews, and the drafting model revises once.

Cost and usage aggregate across every workflow leg. Treat HydraFusion as an optional research preview, not a production default and not guaranteed cheaper.

<div class="warning" data-title="Experimental feature">

> The workshop research verified the HydraFusion concept and patterns from GitHub's announcement. It did not verify a stable CLI toggle command. If HydraFusion appears in `/model`, use the current UI and documentation rather than memorized commands.

</div>

## Controlled measurement experiment

Run the same bounded task through multiple modes and compare results. Keep context fixed.

Task prompt to reuse:

```text
Review the Music Catalog playlist implementation for one missed edge case. Do not edit files. Return one finding at most, with file, behavior, test idea, and confidence.
```

Measurement template:

| Run | Model or mode | Context size | Usage units | Latency | Tests passing | Review findings |
| --- | ------------- | ------------ | ----------- | ------- | ------------- | --------------- |
| 1 | Efficient model |  |  |  |  |  |
| 2 | Stronger reasoning model |  |  |  |  |  |
| 3 | Auto |  |  |  |  |  |
| 4 | HydraFusion, if available |  |  |  |  |  |

Separate context sources when interpreting the result:

- Files in the repository.
- Repository instructions and plugins.
- The user prompt.
- Conversation history.
- Tool results.
- Sub-agents or `/fleet` workers.
- Generated output.
- Context compaction or summarization.
- Billable usage.

## CLI commands to verify locally

Use these commands only if your installed CLI version supports them:

```text
/model
```

```text
/usage
```

```text
/fleet
```

Expected result:
- `/model` shows available model selection options.
- `/usage` shows usage information if supported for your account and CLI version.
- `/fleet` is available in documented Copilot CLI versions for parallel sub-agent execution; verify in your CLI version before teaching it.

## Help us improve this Workshop

If you faced any challenge or bug running this workshop, please let us know. Your help will be invaluable in making this workshop better, especially as we try to keep it up to date with fast-moving Copilot capabilities. [Report any problem here.](https://github.com/Justrebl/AI-SDLC-Workshop/issues)
