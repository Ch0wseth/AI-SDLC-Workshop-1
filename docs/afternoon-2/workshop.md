---
published: false
type: workshop
title: 'AI SDLC with GitHub and GitHub Copilot'
short_title: AI SDLC with GitHub Copilot
description: Build a governed Music Catalog feature with HVE-Core, Design Thinking, RPI, APM, GitHub Copilot plugins, gh-aw workflows, and Copilot cloud agent.
level: intermediate
authors: [Julien Strebler]
contacts: ['@justrebl']
duration_minutes: 240
tags: github copilot, hve-core, rpi, design thinking, apm, agentic workflows, copilot cloud agent, plugins, accessibility
banner_url: assets/banner.png
navigation_levels: 3
navigation_numbering: false
sections_title:
  - 'AI SDLC with GitHub and GitHub Copilot'
  - 'Level 0: Setup and starting point'
  - 'Level 1: HVE orientation and HVE-Core CLI plugin'
  - 'Level 2: Design Thinking with DT Coach'
  - 'Level 3: RPI implementation loop'
  - 'Break'
  - 'Level 4: APM, policy and plugin marketplace'
  - 'Level 5: Agentic workflows and delegation'
  - 'Level 6: Review the delegated work'
  - 'Recap: Governed agentic SDLC'
  - 'Extra Credits 🪙'
---

# AI SDLC with GitHub and GitHub Copilot

*Version 1.0 - September 2026*

Welcome to this workshop. It follows **GitHub Copilot Zero to Hero**: there you used Copilot primitives one at a time. Here you combine them into a governed, AI-assisted software development lifecycle (SDLC) for a real repository.

You will go from an idea to a merged change and then automate the work around it. The afternoon tells one story in three acts:

1. **Build the feature.**
   - Frame a deliberately small capability with the HVE-Core **Design Thinking Coach**.
   - Implement it with the **RPI** workflow (Research, Plan, Implement, Review), and make one real design decision at the review gate.
2. **Scale the method that built it.**
   - Make the method repository-owned and governed with **APM** and policy.
   - Share team conventions through a Copilot **plugin marketplace**.
   - Rank a backlog, seeded from your own review findings, with **GitHub Agentic Workflows (gh-aw)**.
3. **Close the loop.**
   - Delegate one parallelizable issue to **Copilot cloud agent** (formerly Copilot coding agent), behind a test contract.
   - Review its pull request with required checks, Copilot code review and your team's test-writer agent.

The recap turns this into an operating model, then looks at it as an architect would: org rollout, measuring impact, brownfield adoption, and choosing a method and a model.

The shared application is the Music Catalog starter. It has a React + TypeScript + Vite front end in `src\front`, a .NET 10 minimal API in `src\api`, xUnit API tests in `tests\api`, and synthetic seed data in `src\api\Data\tracks.json`. The capability for today is fixed: **browse tracks and add tracks to a single in-memory playlist**. Duplicate adds are rejected. The empty playlist state is visible.

<div class="task" data-title="How to read this lab">

> Each level starts with a short **Topic**, followed by numbered steps and an **Expected result**. Copy-paste prompts are in code blocks. Reference solutions are in `solutions\afternoon-2`. Commit a checkpoint at the end of each level so that you can always come back to a working state.

</div>

<div class="warning" data-title="Product evolution">

> GitHub Copilot, Copilot CLI, HVE-Core, APM, Agent Plugins, gh-aw, and Copilot cloud agent evolve quickly. Screens, labels, commands, and availability may change after this workshop is written. When a feature looks different, check the current documentation linked in the relevant section and adapt without changing the learning objective.

</div>

## 🎓 Key concepts

This is a quick reminder of what you will practise, not a lecture. Each concept links to its reference documentation.

### Copilot primitives (recap from GitHub Copilot Zero to Hero)

Primitives are the building blocks that you combine in this lab:

| Primitive | What it carries | Where it lives |
| --- | --- | --- |
| [Custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) | Always-on conventions | `.github\copilot-instructions.md`, `*.instructions.md` |
| [Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files) | Reusable tasks you invoke by name | `*.prompt.md` |
| [Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents) | A persona with its own tools and rules | `*.agent.md` |
| [Agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) | Task knowledge loaded on demand | `skills\<name>\SKILL.md` |
| [MCP servers](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) | External tools and data | `mcp.json` |
| [Plugins](https://code.visualstudio.com/docs/copilot/customization/agent-plugins) and [marketplaces](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing) | A bundle of primitives and a catalogue to share it | `plugin.json`, `marketplace.json` |

Principle: **context is the product**. The quality of an agent's output depends on the context that you give it. Primitives make that context explicit, reviewable, and versioned.

### HVE and HVE-Core

[HVE-Core](https://microsoft.github.io/hve-core/) (Hypervelocity Engineering Core) is an open-source, opinionated agentic SDLC framework from Microsoft. It ships agents, prompts, instructions, and skills as a Copilot plugin. Its central principle is **"AI carries the rules, humans keep the judgment."**

- **Design Thinking Coach**: guides a team through the problem space before any code is written: scope, research, synthesis, then ideas.
- **RPI (Research → Plan → Implement → Review)**: separates finding facts, deciding, changing code, and verifying. Each phase writes an artifact that a human can review, and each phase starts from a clean context.
- HVE-Core describes itself as *rapidly evolving*. Treat it as a source of patterns, and pin the version that you use.

### APM (Agent Package Manager)

[APM](https://microsoft.github.io/apm/) is a dependency manager for agent context. It applies the `package.json` model to agent context.

- `apm.yml` declares the skills, prompts, instructions, plugins, and MCP servers that a repository needs.
- The **lockfile** pins exact versions, so every developer and CI run gets the same context.
- **Policy** and `apm audit` restrict allowed sources, executable components, and MCP servers at enterprise, organization, or repository level.
- Principle: agent context is part of your **software supply chain**. Review, version, and govern it like code.

### GitHub Agentic Workflows (gh-aw)

[gh-aw](https://github.github.com/gh-aw/) lets you write repository automation in Markdown and run it as GitHub Actions. It is part of the GitHub Next [Continuous AI](https://githubnext.com/projects/continuous-ai) research.

- You write `*.md` and compile it to a `*.lock.yml` that Actions runs. Commit both files.
- The agent runs with **read-only permissions**. Writes such as issues, comments, and pull requests go through declared **safe outputs**.
- Principle: put automation on a schedule or an event, but keep strong guardrails and keep humans in the loop.

### Copilot cloud agent (formerly coding agent)

[Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) works on an issue in its own GitHub Actions environment and opens a pull request for review.

- `copilot-setup-steps.yml` prepares its environment. Repository instructions and custom agents shape its behaviour.
- Branch protection, required reviews, and CI remain the gates. The agent proposes the change and humans approve it.
- By default, the agent checks its own changes with CodeQL, the GitHub Advisory Database, secret scanning and Copilot code review before it completes the pull request ([risks and mitigations](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations)).

### Copilot code review and secret scanning

- [Copilot code review](https://docs.github.com/en/copilot/concepts/agents/code-review) reviews a pull request like a human reviewer. It reads the repository custom instructions, such as `.github/copilot-instructions.md`, from the pull request's head branch.
- [Secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning) detects credentials in the Git history. [Push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection) blocks a push that contains a secret before it reaches the repository.
- Both act on pull requests and pushes. They review agent output in the same way as human output.

### Context, verification and trust

Three ideas connect the levels. Each one gets a short segment where it matters.

- **Context engineering** (Level 3): an agent only knows what is in its context window. Layered instructions, skills loaded on demand, and phase artifacts written to disk keep that context small and reviewable.
- **Verification as contract** (Levels 5 and 6): tests, CI and branch rulesets define "done". The same checks apply to your commits and to an agent's pull request.
- **Agentic threat model** (Levels 5 and 6): an agent that runs without you reads text that other people wrote. Read-only permissions, safe outputs, the agent firewall and narrow tokens limit what that text can make it do.

### Further reading

- [Customize Copilot in VS Code (overview)](https://code.visualstudio.com/docs/copilot/customization/overview)
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli)
- [HVE-Core repository](https://github.com/microsoft/hve-core)
- [Customize the Copilot cloud agent environment](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Copilot billing and usage](https://docs.github.com/en/copilot/concepts/billing-and-usage)

## 🚀 Dev Environment Setup

To complete this lab, you need:

- A GitHub account with a GitHub Copilot licence. Business or Enterprise is recommended. Copilot cloud agent, plugins, and gh-aw may need administrator enablement. See the [full prerequisites checklist](https://github.com/Justrebl/AI-SDLC-Workshop/blob/main/docs/prerequisites.md) for the policy, licence, and administrator checks, or the checklist for your delivery option: [Codespaces](https://github.com/Justrebl/AI-SDLC-Workshop/blob/main/docs/before-d-day-codespace.md), [local dev container](https://github.com/Justrebl/AI-SDLC-Workshop/blob/main/docs/before-d-day-devcontainer.md) or [local tools](https://github.com/Justrebl/AI-SDLC-Workshop/blob/main/docs/before-d-day-local.md).
- **Your own repository** created from the workshop template. Level 4 pushes a marketplace, Level 5 runs workflows and assigns an issue to Copilot cloud agent, and Level 6 reviews its pull request, so the repository must belong to you.

Create your repository from the template: open [Justrebl/AI-SDLC-Workshop](https://github.com/Justrebl/AI-SDLC-Workshop), select **Use this template** → **Create a new repository**, and choose a **private** repository under your account. [Learn more about template repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template). Level 0 Step 1 gives the equivalent `gh` command and a fallback.

The repository ships a [dev container](https://code.visualstudio.com/docs/devcontainers/containers) based on a **prebuilt image**. The image already contains Git, Node.js 22, .NET 10, GitHub CLI, Copilot CLI, and APM CLI. On first start, the dev container installs the gh-aw extension and restores the API and front-end dependencies.

Choose one of the following three options.

### 🥇 Option 1: Pre-configured GitHub Codespace

Use this option if you want everything ready in a browser or in VS Code, with nothing to install.

1. In your new repository, select **<> Code** → **Codespaces** → **+** (Create codespace on main). See [Creating a codespace](https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository).
2. Wait for the `postCreateCommand` to finish in the terminal.

<div class="info" data-title="Codespaces usage">

> Codespaces usage is billed or counted against your included quota, depending on your account. Check [GitHub Codespaces billing](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces), and stop or delete your codespace after the workshop.

</div>

### 🥈 Option 2: Local dev container

Use this option if you prefer to work locally with the same tooling as the codespace.

1. Install [Git](https://git-scm.com/downloads), [Docker Desktop](https://www.docker.com/products/docker-desktop/), and [VS Code](https://code.visualstudio.com/download) with the **Dev Containers** extension.
2. Clone your repository and open it in VS Code.
3. Run **Dev Containers: Reopen in Container** from the Command Palette.

### 🥉 Option 3: Local environment

Use this option if you cannot run containers. Install:

| Tool | Why |
| --- | --- |
| [Git](https://git-scm.com/downloads) | Checkpoint commits and APM dependency resolution |
| [VS Code](https://code.visualstudio.com/download) + GitHub Copilot Chat | Local agent work |
| [Node.js 22 LTS](https://nodejs.org/en/download) | Vite + React front end, and Copilot CLI |
| [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) | Minimal API and xUnit tests |
| [GitHub CLI](https://cli.github.com/) | Repository operations and gh-aw |
| [Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli) | HVE-Core plugin and marketplace exercises |
| [APM CLI](https://microsoft.github.io/apm/getting-started/installation/) | Repository-owned HVE-Core dependency and policy audit |

Then clone your repository, run `gh extension install github/gh-aw`, `dotnet restore`, and `npm --prefix src\front ci`.

<div class="tip" data-title="Recommendation">

> Use Option 1 when you can. It saves setup time and gives the same environment to every participant and to the workshop tester.

</div>

## 🔐 Sign in and check your tools

Sign in to GitHub CLI, and then to Copilot CLI. Copilot CLI asks you to run `/login` on first start.

```bash
gh auth login
copilot
```

Check that every tool answers:

```bash
git --version
node --version
dotnet --version
gh --version
copilot --version
apm --version
gh aw version
```

<details>
<summary>📚 Toggle solution</summary>

If a command is missing:

- In a codespace or dev container, run **Codespaces: Rebuild Container** or **Dev Containers: Rebuild Container**.
- Locally, reinstall the tool from the table in Option 3. Then open a new terminal so that `PATH` is refreshed.
- If `gh aw version` fails, run `gh extension install github/gh-aw`.

</details>

<div class="info" data-title="Documented capability labels">

> This workshop labels mechanisms as **documented capability**, **configuration**, **experimental**, **architectural recommendation**, or **workshop simulation**. Keep those labels when you adapt the material so participants do not confuse a verified product feature with a teaching pattern.

</div>

<div class="important" data-title="Synthetic data only">

> The 12 tracks in `src\api\Data\tracks.json` are synthetic sample data. Do not paste customer data, confidential backlog items, credentials, or production telemetry into prompts, issues, workflow runs, screenshots, or plugin manifests.

</div>

![AI SDLC with GitHub and GitHub Copilot route map](assets/a2-route-map.png)

---

# Level 0: Setup and starting point

## Topic

You will verify the starter repository, run both test suites, confirm that the playlist capability is not implemented yet, and create a clean checkpoint.

![Starting repository in VS Code](assets/l0-starting-repository.png)

## Validate the starter

### Step 1: Create your workshop repository

You need a repository that you own: Level 4 pushes a marketplace, Level 5 runs workflows and assigns an issue to Copilot cloud agent, and Level 6 reviews its pull request. Skip this step if you already created your repository from the template in **🚀 Dev Environment Setup** (introduction page) and opened it.

Otherwise, create it from the template with GitHub CLI. Replace `my-music-catalog` with any name:

```powershell
gh repo create my-music-catalog --private --template Justrebl/AI-SDLC-Workshop --clone
cd my-music-catalog
```

If template creation is blocked in your organization, copy the repository with a fresh history:

```powershell
git clone https://github.com/Justrebl/AI-SDLC-Workshop my-music-catalog
cd my-music-catalog
Remove-Item -Recurse -Force .git
git init -b main; git add -A; git commit -m "Workshop starter"
gh repo create my-music-catalog --private --source . --remote origin --push
```

Expected result:
- `gh repo view` shows your own repository with a `main` branch.
- You can open it locally or in a Codespace.

> The copy contains files under `.github\workflows`. If the push is rejected for missing the `workflow` scope, follow the tip in Level 5 "Push your branch", then run `git push -u origin main`.

### Step 2: Open the repository root

Open the repository root. The expected layout is:

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

### Step 3: Run API tests

Run from the repository root:

```powershell
dotnet test
```

Expected result:
- xUnit tests pass.
- The existing hello endpoint still works.

### Step 4: Run front-end tests

Run:

```powershell
cd src\front
npm test
```

Expected result:
- Vitest passes.
- The existing test verifies the hello message.

### Step 5: Create a baseline checkpoint

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

## Topic

You will install HVE-Core as a personal Copilot CLI plugin and identify the HVE agents used later: DT Coach, RPI Agent, Backlog Manager, Accessibility Reviewer, and Accessibility Planner. The extended tracks also use BRD Builder, PRD Builder, Functional Planner, Code Review, ADR Creator, and Security Reviewer.

**Why this level:** in GitHub Copilot Zero to Hero, you wrote your own primitives. HVE-Core gives you a shared, opinionated method instead of a personal one. You install it for yourself first; Level 4 explains why that is not enough for a team.

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

## Topic

You will use HVE-Core DT Coach to frame the feature. To keep the room aligned, the inputs and decisions are fixed. The output should identify one capability: browse tracks and add a track to a single in-memory playlist. Duplicate adds are rejected. An empty-state is shown.

**Why this level:** an agent builds exactly what you ask. Before you hand it work, decide what is worth asking and what is out of scope. The decisions you lock here become the boundaries of every prompt that follows.

An extended Product Manager track then turns these decisions into a BRD, a PRD, and GitHub issues with the HVE-Core planning agents.

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

## Extended track: Product Manager with HVE-Core

<div class="info" data-title="Extended track">

> This track adds about 40 minutes. Your facilitator tells you whether the room runs it hands-on, watches it as a demo, or skips it. Level 3 works without it: if you skip it, go to [Curate what you commit](#curate-what-you-commit).

</div>

This track follows the HVE-Core [TPM guide](https://microsoft.github.io/hve-core/docs/hve-guide/roles/tpm) and [Business Program Manager guide](https://microsoft.github.io/hve-core/docs/hve-guide/roles/business-program-manager). You turn the decisions you just locked into requirement documents, then into a tracked backlog of GitHub issues. In Level 3, a developer picks up that backlog.

### The PM agent chain

Use the agents in this order:

| Order | Stage in the TPM guide | HVE-Core agent or command | What it produces | Writes to GitHub? |
| --- | --- | --- | --- | --- |
| 1 | Discovery | **DT Coach** (done above) | A framed problem and locked decisions | No |
| 2 | Discovery, optional | **Meeting Analyst** | Requirements extracted from Microsoft 365 meeting transcripts | No |
| 3 | Product definition | **BRD Builder** | A business requirements document (BRD) in `docs\project-planning` | No |
| 4 | Product definition | **PRD Builder** | A product requirements document (PRD) in `docs\project-planning` | No |
| 5 | Decomposition | **Functional Planner** | A GitHub issue hierarchy plan and a handoff file you can review | No, read-only |
| 6 | Execution | **Backlog Manager** with `/backlog-execute run` | GitHub issues and sub-issues | **Yes**, after you confirm |
| 7 | Sprint planning | **Backlog Manager** with `/backlog-plan sprint` | A recommended order and dependencies | No, read-only |

Why this order:

- **Why before what.** The BRD states the business need and who benefits. The PRD states what the product does and how to test it. The TPM guide recommends writing the BRD before creating any work item.
- **Planning is separate from writing.** Functional Planner and `/backlog-plan` cannot change the tracker. Only `/backlog-execute` writes to GitHub, and only after you review the handoff and confirm the repository.
- **One owner per role.** In the Business Program Manager guide (beta), a BPM stops at the BRD and user stories, then works with a TPM, who manages the issues. In this track, you play both roles.

<div class="important" data-title="Workshop simulation">

> The role guides and agent behaviour are documented by HVE-Core. The stakeholder facts, the short question rounds, and one person playing both PM roles are a workshop simulation. Agent output still needs your review before it reaches GitHub.

</div>

### Step 1: Prepare your Copilot surface

Use VS Code Copilot Chat or Copilot CLI with the HVE-Core plugin from Level 1.

The backlog agents read and write GitHub through the GitHub MCP server. By default, Copilot CLI enables only a subset of the built-in GitHub MCP server tools. Creating issues and sub-issues needs the full set, so start Copilot CLI from the repository root with:

```powershell
copilot --enable-all-github-mcp-tools
```

In VS Code, add and sign in to the GitHub MCP server. See [Use MCP servers in VS Code](https://code.visualstudio.com/docs/copilot/customization/mcp-servers).

To switch agents, type `/agent` in Copilot CLI and choose the agent, or use the agent picker in VS Code.

<div class="info" data-title="Configuration option">

> `--enable-all-github-mcp-tools` is a Copilot CLI option. It lets the session use write tools on GitHub with your identity. Use it only for this track, and review every operation before you confirm it.

</div>

### Step 2 (facilitator demo, optional): Meeting Analyst

**Meeting Analyst** reads meeting transcripts from Microsoft 365 through the WorkIQ MCP server, extracts requirements, and hands off to PRD Builder. It needs a Microsoft 365 Copilot licence and WorkIQ, and it cannot read a local transcript file.

The playlist slice has no real meetings, so attendees skip this step. The stakeholder facts in the next prompt stand in for a transcript.

### Step 3: Write the BRD

Select **BRD Builder**. Copy paste the following prompt:

```text
Create a business requirements document for the Music Catalog playlist slice.

Use only these facts. Do not invent stakeholders, metrics, or dates:
- Business problem: workshop participants need one small, realistic feature to practise a governed agentic SDLC end to end.
- Sponsor: the workshop facilitator. Users: workshop participants acting as listeners of a synthetic music catalog.
- Business objective: a listener can browse the catalog and collect tracks in a single playlist during a session.
- Success criteria: every participant ships the slice with passing tests during the workshop; a duplicate add is rejected with a visible message; the empty playlist state is visible; controls are accessible by role and label.
- Constraints: one playlist, in-memory state only, no users, authentication, persistence, reorder, remove, search, or playlist creation.
- Source: the locked Design Thinking decisions for this slice.

Ask at most three clarifying questions, then write the BRD. Record anything you cannot confirm as an open question instead of guessing.
```

Answer its questions from the fixed scope.

Expected result:
- BRD Builder shows its requirements-planning disclaimer, then creates a BRD such as `docs\project-planning\music-catalog-playlist-slice-brd.md`. The exact file name can differ.
- Objectives and success criteria trace back to the facts above.
- Out-of-scope items are listed as out of scope.
- BRD Builder offers a handoff to PRD Builder.

### Step 4: Turn the BRD into a PRD

Accept the handoff, or select **PRD Builder**. Copy paste the following prompt:

```text
Create a product requirements document for the Music Catalog playlist slice from the BRD in docs/project-planning.

Product requirements:
- GET /api/tracks returns the 12 tracks from src/api/Data/tracks.json.
- GET /api/playlist returns the single in-memory playlist.
- POST /api/playlist/{trackId} adds a track, returns 404 for an unknown id, and returns 409 for a duplicate.
- The front end shows the track list with accessible Add buttons, a playlist panel, the empty-state text "Your playlist is empty. Add a track to get started.", and a visible duplicate message.
- xUnit tests cover the API. Vitest and Testing Library tests cover the UI.

Non-functional requirements: in-memory state only, no new libraries or external services, accessible markup.

Write each requirement with testable acceptance criteria. Ask at most three clarifying questions.
```

Expected result:
- PRD Builder creates a PRD such as `docs\project-planning\music-catalog-playlist-slice.md`, with functional requirements, acceptance criteria, and non-functional requirements.
- The requirements match the fixed behaviour of Level 3, so the PM and the developer share one contract.

Read both documents before you continue. Remove any scope creep. The issues you create next link to these documents.

### Step 5: Plan the GitHub issue hierarchy

Select **Functional Planner**. Copy paste the following prompt, replacing `<owner>/<repo>` with your repository:

```text
Plan a GitHub issue hierarchy for <owner>/<repo> from the playlist slice PRD in docs/project-planning.

Platform: GitHub. Do not create, update, or comment on anything.
Use the generic platform-native lens and this shape:
- one parent issue for the playlist slice
- sub-issues for the tracks API, the playlist API with 404 and 409 handling, the front-end track list and playlist panel, and the tests
Give each sub-issue a title, a short description, the area (api, front, or both) in the body, acceptance criteria copied from the PRD, and a link to the PRD.
Do not add labels, milestones, or assignees. Mark anything you cannot validate as needs_review. Finish with a handoff I can review.
```

Expected result:
- Functional Planner confirms the repository, reads the existing issues, and writes a planning log and a `handoff.md`. It tells you where they are.
- No issue exists on GitHub yet.

Open `handoff.md`. Check that it lists one parent issue, four sub-issues, and acceptance criteria that match the PRD.

<div class="tip" data-title="Reference outputs">

> To compare your BRD, PRD, and handoff with a hand-written sample, open `solutions\afternoon-2\docs\project-planning`. The samples show the expected shape and scope, not the exact text an agent produces.

</div>

### Step 6: Create the issues

Use the Functional Planner **Execute Hierarchy** handoff, or select **Backlog Manager**. Copy paste the following prompt, replacing `<owner>/<repo>`:

```text
Execute the reviewed playlist slice hierarchy handoff from Functional Planner against the GitHub repository <owner>/<repo>.

List the operations first and wait for my confirmation before the first create.
Create the parent issue first, then each sub-issue, and link each one as a sub-issue of the parent.
Do not assign anyone, including Copilot.
```

Expected result:
- Backlog Manager confirms GitHub and your repository, then hands the operations to its GitHub Backlog Executor subagent.
- After you confirm, the parent issue and four sub-issues exist, linked as sub-issues.
- No issue is assigned to Copilot. Delegation stays a human decision, which you make in Level 5.

<div class="tip" data-title="Write tools missing">

> If the executor reports that it cannot create issues, restart Copilot CLI with `copilot --enable-all-github-mcp-tools`, or check that the GitHub MCP server is signed in within VS Code. As a fallback, create the five issues yourself with `gh issue create`, using the content of `handoff.md`.

</div>

### Step 7: Verify the backlog on GitHub

Run:

```powershell
gh issue list --state open
```

Then open the parent issue on GitHub.

Expected result:
- Five open issues: one parent and four sub-issues.
- The parent issue shows its sub-issues and their progress.

### Step 8: Get a sprint order (read-only)

Select **Backlog Manager**. Copy paste the following prompt, replacing `<owner>/<repo>`:

```text
/backlog-plan sprint

Plan the next iteration for <owner>/<repo> from the open playlist slice issues.
Read-only: recommend an implementation order with dependencies and say which issues can be developed in parallel. Do not change any issue.
```

Expected result:
- An order such as the tracks API, then the playlist API, then the front end, with tests alongside each step.
- Nothing changes on GitHub.
- In Level 5, the daily backlog workflow automates this same triage every weekday.

### Step 9: Hand off to curation

Do not commit yet. The BRD and PRD go through the curation checklist in the next section, and you commit them there together with the Design Thinking record.

Note the parent issue number. You use it in Level 3.

## Curate what you commit

### Topic

HVE-Core agents keep two kinds of output apart:

- **Working state.** Session notes, research, plans, change logs and handoff files. HVE-Core agents write them under `.copilot-tracking\` in your repository. They are drafts for the agent and for you, they can contain raw notes or meeting content, and they are never committed. HVE-Core lists `.copilot-tracking/` in its own `.gitignore`, and the workshop template does the same.
- **Deliverables.** Reviewed documents that other people rely on: the BRD, the PRD, architecture decision records (ADRs), and a short record of the Design Thinking decisions. You commit them next to the code, after a human review.

The rule is simple: never commit the tracking folder. Curate what matters out of it into a reviewed file, then commit that file.

| Agent | Working state (ignored) | Committed deliverable | Source |
| --- | --- | --- | --- |
| **DT Coach** | Coaching state and method notes under `.copilot-tracking\` | A curated decision record. HVE-Core documents no committed location, so the workshop uses `docs\project-planning\playlist-design-decisions.md` | [Design Thinking](https://microsoft.github.io/hve-core/docs/design-thinking/) |
| **Meeting Analyst** | Extracted transcript notes | Nothing. Anonymize what feeds the PRD, then delete the notes after handoff | [Security model](https://microsoft.github.io/hve-core/docs/security/security-model) |
| **BRD Builder** | Session state under `.copilot-tracking\` | `docs\project-planning\<name>-brd.md` | [Product definition](https://microsoft.github.io/hve-core/docs/hve-guide/lifecycle/product-definition) |
| **PRD Builder** | Session state under `.copilot-tracking\` | `docs\project-planning\<name>.md` | [Product definition](https://microsoft.github.io/hve-core/docs/hve-guide/lifecycle/product-definition) |
| **ADR Creator** | Draft notes under `.copilot-tracking\` | `docs\decisions\` (used in the Level 3 Tech Lead extension) | [Agents catalog](https://microsoft.github.io/hve-core/docs/agents/) |
| **Functional Planner** and **Backlog Manager** | Planning logs and `handoff.md` under `.copilot-tracking\` | GitHub issues, not files | [TPM guide](https://microsoft.github.io/hve-core/docs/hve-guide/roles/tpm) |
| **RPI Agent** (Level 3) | Research, plans, change logs and reviews under `.copilot-tracking\` | The code, the tests and the pull request | [Context engineering](https://microsoft.github.io/hve-core/docs/rpi/context-engineering) |

<div class="important" data-title="Workshop recommendation">

> HVE-Core documents where the BRD, PRD and ADRs go. It does not document a committed location for Design Thinking output. Saving a curated record in `docs\project-planning` next to the BRD and PRD is a workshop recommendation, not an HVE-Core rule.

</div>

### Step 1: Check that the tracking folder is ignored

Run from the repository root:

```powershell
git check-ignore -v .copilot-tracking
```

Expected result:
- Git prints the `.gitignore` rule that ignores `.copilot-tracking/`.
- If it prints nothing, add `.copilot-tracking/` to `.gitignore` and commit that change first.

### Step 2: Sort the working state

Run:

```powershell
Get-ChildItem .copilot-tracking -Recurse -File | Select-Object -ExpandProperty FullName
git status
```

For each file, decide:

- **Keep locally.** Agent working state you may reuse later, such as DT Coach state or the backlog handoff. It stays ignored.
- **Curate.** Content that should become part of a deliverable, such as the Design Thinking decisions. You copy the outcome, not the file.
- **Delete.** Raw meeting or transcript notes, once their content has been anonymized into the PRD.

Expected result:
- `git status` shows no `.copilot-tracking` entries.
- If you ran the extended track, it shows the BRD and PRD under `docs\project-planning` as new files.

### Step 3: Write the Design Thinking record

Select **DT Coach**. Copy paste the following prompt:

```text
Write a curated Design Thinking decision record for the Music Catalog playlist slice to docs/project-planning/playlist-design-decisions.md.

Use only the six locked decisions from this session:
1. user-visible capability
2. API endpoints
3. front-end states
4. duplicate handling
5. accessibility expectation
6. out-of-scope items

Add a short problem statement and the success criteria.
Do not include coaching notes, session state, file paths under .copilot-tracking, names, quotes, or raw notes.
Edit only that one file.
```

Expected result:
- One new file, `docs\project-planning\playlist-design-decisions.md`, with the problem, the six decisions and the success criteria.
- No other file changes.

### Step 4: Review before you commit

Open each file you plan to commit and check:

- [ ] No names, email addresses, quotes or customer details. Use roles such as "workshop participant" instead.
- [ ] No paths or links into `.copilot-tracking\`. HVE-Core instructions forbid referencing tracking files from committed content, because they are not in the repository.
- [ ] Out-of-scope items are still listed as out of scope.
- [ ] The Markdown is valid. Run:

```powershell
npx markdownlint-cli2 "docs/project-planning/*.md"
```

- [ ] You read every file yourself. Agent output is a draft until a human approves it.

### Step 5: Commit the reviewed deliverables

Stage the reviewed folder by path, not with `git add -A`:

```powershell
git add docs\project-planning
git status
git commit -m "Add playlist slice design record, BRD and PRD"
```

Expected result:
- The commit contains only files under `docs\project-planning`.
- `.copilot-tracking\` still exists on your machine but is not part of the commit.

HVE-Core references:

- [Install HVE-Core as an extension](https://microsoft.github.io/hve-core/docs/getting-started/methods/extension) and [Setup in the lifecycle guide](https://microsoft.github.io/hve-core/docs/hve-guide/lifecycle/setup): `.copilot-tracking/` is local working state and belongs in `.gitignore`.
- [Copilot tracking instructions](https://github.com/microsoft/hve-core/blob/main/.github/instructions/hve-core/copilot-tracking.instructions.md): what agents write to the tracking folder, and why committed content must not reference it.
- [Context engineering](https://microsoft.github.io/hve-core/docs/rpi/context-engineering): why RPI keeps research and plans as files outside the conversation.
- [Security model](https://microsoft.github.io/hve-core/docs/security/security-model): sensitive meeting content and the gitignore mitigation.
- [Product definition](https://microsoft.github.io/hve-core/docs/hve-guide/lifecycle/product-definition), [TPM guide](https://microsoft.github.io/hve-core/docs/hve-guide/roles/tpm) and [Business Program Manager guide](https://microsoft.github.io/hve-core/docs/hve-guide/roles/business-program-manager): where the BRD and PRD live and who reviews them.
- [Design Thinking](https://microsoft.github.io/hve-core/docs/design-thinking/) and the [agents catalog](https://microsoft.github.io/hve-core/docs/agents/).
- [HVE-Core custom agents](https://github.com/microsoft/hve-core/blob/main/.github/CUSTOM-AGENTS.md) and the [HVE-Core planning documents](https://github.com/microsoft/hve-core/tree/main/docs/planning), as examples of committed, curated planning content.

## Commit checkpoint

Run:

```powershell
git status
git log --oneline -1
```

Expected result:
- Your working tree is clean, and `.copilot-tracking\` does not appear.
- The last commit holds your curated files under `docs\project-planning`.
- You have a shared feature scope for RPI.

---

# Level 3: RPI implementation loop

RPI means **Research, Plan, Implement, Review**. HVE-Core also documents a follow-up stage in the RPI Agent description, but this workshop walks the four core phases.

## Topic

You will use the RPI Agent to implement the playlist slice. The target behavior is fixed:

- API: `GET /api/tracks` returns the 12 tracks from `src\api\Data\tracks.json`.
- API: `GET /api/playlist` returns the current in-memory playlist.
- API: `POST /api/playlist/{trackId}` adds a track and returns `409 Conflict` for duplicates.
- Front end: renders a track list and a playlist panel with an empty state.
- Front end: add buttons are accessible by role and name.
- Tests: xUnit for API behavior and Vitest + Testing Library for UI behavior.

One decision is deliberately left open: **how the user interface handles a duplicate add**. The API contract is fixed (`409 Conflict`), but whether the UI reports the conflict or prevents it is yours to decide at the plan gate. You compare choices with your neighbours at the review gate.

**Why this level:** a single "build this" prompt mixes finding facts, making decisions and editing code, so you cannot tell where it went wrong. RPI separates them into phases that each leave an artifact you can review, and puts you at the gate between them.

![RPI Agent phase walkthrough](assets/l3-rpi-agent-walkthrough.png)

## Work as a developer

This level follows the HVE-Core [Engineer guide](https://microsoft.github.io/hve-core/docs/hve-guide/roles/engineer) and [Tech Lead guide](https://microsoft.github.io/hve-core/docs/hve-guide/roles/tech-lead).

| Engineer guide stage | HVE-Core command | Where in this level |
| --- | --- | --- |
| Research | `/rpi-research` | Research phase |
| Plan | `/rpi-plan` | Plan phase |
| Implement | `/rpi-implement` | Implement phase |
| Review | `/rpi-review` | Review phase |
| Commit and pull request | `/git-commit`, `/pull-request` | Tech Lead extension |

Apply these practices from the guides:

- **Start from the work item.** If you ran the Product Manager track in Level 2, open the parent issue. Its acceptance criteria match the fixed requirements in the prompts below. If you skipped the track, the prompts are your work item.
- **You are the gate between phases.** Read each phase output before you start the next one. Reject anything outside scope.
- **Clear context between phases when it fills up.** The Engineer guide recommends `/clear` between RPI phases: each phase saves its output to files, and the next phase reads those files instead of the chat history. This workshop keeps one session for simplicity. Use `/clear` when the agent drifts or the context is full.
- **Let the Tech Lead tools add judgement.** The Tech Lead guide adds architecture decision records (ADR Creator), multi-perspective review (Code Review) and coding standards that activate by file type. You try them in the optional Tech Lead extension after the Review phase.

### One agent runs the phases

The phase commands are not separate agents, and each one also works on its own without RPI Agent. **RPI Agent** is the HVE-Core agent that coordinates them. It runs `/rpi-research`, `/rpi-plan` and `/rpi-implement`, then `/rpi-review`, and saves each phase's output to files so the next phase and later sessions can pick up where it stopped.

You can drive it in two ways:

| Mode | How you start it | When to use it |
| --- | --- | --- |
| Phase by phase (this level) | Select **RPI Agent**, then run one `/rpi-*` command at a time | Learning RPI, or when you want to check each phase before the next one |
| Full loop | `/rpi task="..."` | A well-scoped task you trust the agent to carry through |

With `/rpi`, RPI Agent asks how much control you want, unless your request already says (for example, "use automatic mode"). It offers four choices: run end to end, keep going but check with you on unclear decisions, research and plan with you then stop before implementation, or work through each phase with you. In VS Code, the agent's **Full Auto** button starts the end-to-end choice. It still stops for safety confirmations and blockers. Use `/rpi continue=...` to resume a saved task, and `/rpi followUp=...` to start a new task from a review finding.

This level drives the phases one at a time so you see each output. Level 5 hands the full loop to RPI Agent on Copilot cloud agent.

### Context engineering: why RPI writes files

An agent only knows what is in its **context window**: the instructions loaded for the session, the files and tool results it read, and the conversation so far. The window is finite. As it fills, older details get summarized or dropped, and the agent starts to drift. RPI is built around that limit.

| Practice | Why it matters |
| --- | --- |
| Each phase writes its output to a file under `.copilot-tracking\` | The research and the plan become durable memory that you can read, correct and hand to the next phase, or to another session, without replaying the chat |
| `/clear` between phases | The next phase starts from the files, not from a long history full of dead ends. Use it when the agent drifts or the context is full |
| Phases with a narrow job | Research does not edit, plan does not edit, review does not refactor. A narrow job needs less context and is easier to check |
| Instructions in layers | Copilot combines several instruction sources: personal instructions, repository-wide `.github\copilot-instructions.md`, path-specific `*.instructions.md` files that apply by file pattern, and organization instructions. Personal instructions take precedence over repository instructions, which take precedence over organization instructions. HVE-Core adds coding standards that activate by file type in the same way |
| Skills and agents load on demand | A skill's full content enters the context only when the task matches its description, so the window holds what the current phase needs |

See [Context engineering](https://microsoft.github.io/hve-core/docs/rpi/context-engineering) in HVE-Core and [repository custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) on GitHub Docs.

<div class="tip" data-title="Check it yourself">

> After the research phase, open the newest research file under `.copilot-tracking\`. Ask yourself: could a colleague, or a fresh session after `/clear`, start the plan from this file alone? If not, the research is not done.

</div>

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

Expected research output: relevant files, implementation risks, tests to add, and open questions. Resolve open questions using the requirements above rather than asking me, except the duplicate-add user experience in the front end: list it as an open decision for the plan.
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

HVE-Core writes research notes under `.copilot-tracking\`, which is ignored. No commit is needed. Run:

```powershell
git status
```

Expected result:
- The working tree is clean, and `.copilot-tracking\` does not appear.

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
- Two options for the duplicate-add user experience, with one trade-off each and your recommendation:
  A. Keep every Add button enabled and show an accessible message when the API returns 409.
  B. Show tracks already in the playlist with a disabled, labelled control, and still show an accessible message if the API returns 409.
  Mark the choice as a decision for me to confirm.
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

### Step 3: Decide the duplicate-add experience

Read the two options and the agent's recommendation. Pick one, and write down why in one sentence: for example, discoverability, fewer error states, or how a screen reader user learns that a track is already in the playlist. If you pick the option the agent did not recommend, tell it:

```text
Use option B for the duplicate-add user experience. Update the plan accordingly. Do not edit source files.
```

Replace `B` with your choice.

Expected result:
- The plan states one option, and you know why you chose it.

### Step 4: Plan checkpoint

Run:

```powershell
git status
```

Expected result:
- The working tree is clean. Plan notes stay in the ignored `.copilot-tracking\` folder.

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
- Implement the duplicate-add user experience approved in the plan. Whatever the option, a 409 from the API must show a user-visible, accessible message.
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
- A duplicate add is prevented or reported, as you decided at the plan gate.

### Step 5: Commit implementation checkpoint

Run from the repository root. Check `git status` first: pending changes should be limited to the approved source, tests and necessary test setup files, never `.copilot-tracking\`. If the implementation was already committed and the working tree is clean, inspect those commits with `git log -3 --stat` and continue without creating an empty commit.

```powershell
git status
git add -A; git commit -m "Implement playlist slice with RPI"
```

Expected result:
- Pending implementation changes are committed and the working tree is clean.
- If the implementation was already committed, a clean working tree and the existing implementation commits satisfy this checkpoint; "nothing to commit" is not a failure.
- `.copilot-tracking\` is not included in any commit.
- A real staging or commit error must be resolved before continuing.

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
- The duplicate-add user experience matches the option approved in the plan, and its message and controls are accessible.
- dotnet test and npm test pass.

Return a review with: pass/fail summary, findings, smallest fixes, and validation evidence. If you make fixes, keep them minimal and rerun the relevant tests. List any finding you did not fix as a deferred finding.
```

Expected result:
- The review is tied to the fixed requirements.
- Any fixes are small and directly related to the feature.
- Deferred findings are listed separately. Keep one: in Level 5 it becomes an issue in your backlog.

### Step 2: Debrief the decision

Compare your duplicate-add choice with your neighbours, or with the room if your facilitator runs a quick poll:

- Which option did you pick, and why?
- Did the agent recommend the same option? Did its tests follow your choice, or the recommendation?
- Which option is easier to verify with Testing Library queries by role and name?

Expected result:
- You see that the same fixed prompts produced different, valid designs, because a human made a different call at the gate. That is where your judgement adds value.

### Step 3: Validate after review

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

### Step 4: Commit review checkpoint

Run from the repository root. Check `git status` first: review notes stay in the ignored `.copilot-tracking\` folder.

```powershell
git status
git add -A; git commit -m "Review playlist slice"
```

<div class="tip" data-title="Reference fallback">

> If your agent drifts too far, reset to the last checkpoint and ask it to implement only the API first, then the front end. The fixed prompts are designed to keep the room homogeneous, but generated output can still vary.

</div>

## Tech Lead extension (optional)

<div class="info" data-title="Extended track">

> This extension adds 10 to 15 minutes. Use it if you finish early or if your facilitator runs it as a demo.

</div>

### Step 1: Record the in-memory decision as an ADR

Select **ADR Creator**. Copy paste the following prompt:

```text
Capture an architecture decision record for the Music Catalog playlist slice: the playlist state is kept in memory in the API process, not in a database or in tracks.json.

Context: a workshop slice with a single playlist and no users. API tests use WebApplicationFactory.
Consequences to cover: the state is lost on restart, it works for a single API instance only, and a later persistence change would replace it.
Keep it short and ask at most two clarifying questions.
```

Expected result:
- ADR Creator drafts a decision record with context, decision, and consequences, then asks you to confirm it.
- When you confirm, it saves the final ADR as a numbered file in `docs\planning\adrs`, for example `0001-in-memory-playlist-state.md`. Keep it there; Step 3 commits it.

A sample ADR is in `solutions\afternoon-2\docs\planning\adrs\0001-in-memory-playlist-state.md`.

### Step 2: Review the change with the Code Review agent

Select **Code Review**. Copy paste the following prompt:

```text
Review the local commits for the playlist slice since the commit "Baseline Afternoon 2 starter".

Use the standard profile with the functional, standards, accessibility, and security perspectives at basic depth.
Report findings only. Do not edit files.
```

Code Review asks you to confirm the scope and the perspectives before it runs.

Expected result:
- A short walkthrough of the change, then one findings report merged from each perspective.
- Findings that `/rpi-review` missed, or a confirmation that there are none.

How it differs from `/rpi-review`:

| | `/rpi-review` | Code Review agent |
| --- | --- | --- |
| Reviews against | The plan, the requirements and the changes record | The diff, from several perspectives |
| Who steers | The RPI flow | You choose the scope, perspectives and depth |
| Typical use | Close the RPI loop | A Tech Lead check before a pull request |

In Level 6, Copilot code review adds a third reviewer on the pull request itself.

### Step 3: Commit with `/git-commit`

If Steps 1 and 2 left changes to keep, type:

```text
/git-commit
```

Expected result:
- The agent stages your changes and proposes a conventional commit message for you to accept or edit.

<div class="tip" data-title="Close the PM backlog from a commit">

> If you created issues in the Level 2 Product Manager track, add a line such as `Closes #12` to a commit message for each sub-issue this slice implements. GitHub closes those issues when the commit reaches the default branch, which happens when you push in Level 4.

</div>

### Step 4: Draft the pull request with `/pull-request`

Type:

```text
/pull-request action=prepare
```

Expected result:
- The agent reads the committed diff of your branch, runs quick checks on the changed areas, and shows you a pull request title and description.
- With `action=prepare`, nothing is written to GitHub. You do not push until Level 4, so keep the draft as the description for a pull request you open later.
---

# Break

Before leaving your machine, make sure the implementation is committed and tests pass.

Run:

```powershell
git status
```

Expected result:
- Your working tree is clean.
- Your latest commit contains the reviewed playlist feature.

<div class="tip" data-title="After the break">

> You have built the feature. The rest of the afternoon scales the method that built it, then closes the loop. Keep the playlist implementation as-is unless a later validation command fails.

</div>

---

# Level 4: APM, policy and plugin marketplace

## Topic

You will install HVE-Core as a repository-owned APM dependency pinned by commit SHA, audit it, inspect a policy failure, and add a team Copilot plugin marketplace containing local Music Catalog conventions.

**Why this level:** the HVE-Core plugin you installed in Level 1 lives in **your** Copilot environment. Copilot cloud agent and agentic workflows run on GitHub, in a fresh environment built from the repository: they cannot see your personal plugins, settings or `.copilot-tracking\` notes. A colleague who clones the repository cannot see them either. If the method is going to run in Levels 5 and 6, and for the whole team, it has to live in the repository, at a pinned version, under a policy.

| | Personal plugin (Level 1) | Repository dependency (this level) |
| --- | --- | --- |
| Who sees it | You, on your machine | Everyone who clones the repository, Copilot cloud agent, agentic workflows |
| Version | Whatever you installed last | Pinned in `apm.yml` and recorded in `apm.lock.yaml` |
| Governance | None | Policy and `apm audit` in CI |

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

### Step 3: Prepare the marketplace settings

Replace `YOUR-ORG/YOUR-REPO` in `.github\copilot\settings.json` with your repository, for example `octo-user/my-music-catalog`. Copilot CLI registers a GitHub marketplace from the remote repository, so you register it after the commit checkpoint pushes these files.

Expected result:
- `extraKnownMarketplaces.music-catalog-marketplace.source.repo` points to your repository.

### Step 4: VS Code Agent Plugins view

In VS Code, open Extensions and search:

```text
@agentPlugins @recommended
```

Expected result:
- When Agent Plugins are available, VS Code shows recommended or configured plugins.
- If the UI is unavailable, explain the configuration pattern and continue.

![VS Code Agent Plugins recommended view](assets/l4-vscode-agentplugins.png)

## Commit and push checkpoint

Run from the repository root:

```powershell
git status
git add apm.yml apm.lock.yaml apm-policy.yml .github plugins\music-catalog-conventions
git commit -m "Add governed HVE and plugin marketplace setup"
git push
```

Expected result:
- The APM manifest, lockfile, policy, marketplace, settings, and local plugin are committed.
- The HVE-Core agents, prompts, and skills that APM deployed under `.github` are committed too. Level 5 imports `.github\agents\backlog-manager.agent.md` and selects the RPI Agent from the default branch.
- No generated workflow lock files are committed in this level.
- `git status` is clean and your default branch on GitHub contains the marketplace.

## Register the team marketplace

### Step 1: Register, browse, and install in Copilot CLI

Run, replacing `<owner>/<repo>` with your repository:

```powershell
copilot plugin marketplace add <owner>/<repo>
copilot plugin marketplace browse music-catalog-marketplace
copilot plugin install music-catalog-conventions@music-catalog-marketplace
```

Expected result:
- The marketplace is registered from the pushed repository.
- The plugin appears as `music-catalog-conventions`.
- The install command uses the exact marketplace name from `marketplace.json`.

<div class="warning" data-title="Configuration versus install">

> `.github\copilot\settings.json` is repository configuration for known and enabled plugins. The CLI marketplace commands install into a user's Copilot environment. Managed organization policy may override local enable or disable commands.

</div>

---

# Level 5: Agentic workflows and delegation

## Topic

You will install gh-aw, initialize the repository, copy two workflow source files, and compile them to `.lock.yml`. You will seed the backlog from your own Level 2 and Level 3 artifacts, run the daily backlog workflow, and read the threat model behind it. Then you will make the tests a required check, prepare the agent's environment, and delegate one parallelizable issue to Copilot cloud agent. While it works, you inspect the accessibility workflow pattern. An extended track shows how to delegate a security review to Copilot cloud agent with the HVE-Core Security Reviewer.

**Why this level:** everything so far needed you at the keyboard to start a session. Agentic workflows run on a schedule or on events, and Copilot cloud agent works while you do something else. Both only work because Level 4 put the method in the repository, and both need guardrails because nobody watches them run.

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
- `.github\workflows\a11y-review.md` imports Accessibility Reviewer for assessment and specifies the bounded remediation plan in its own prompt.

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

- It imports only Accessibility Reviewer: gh-aw allows one agent file per workflow. The workflow prompt supplies the remediation-planning instructions without importing Accessibility Planner.
- It scopes review to `src\front\src\**`.
- It creates at most one issue and closes older matching issues.
- It says the result is not a conformance claim.

Expected result:
- Participants understand the workflow creates an actionable review issue, not an official accessibility certification.

<div class="warning" data-title="Architectural pattern">

> The single `imports:` agent file is a workshop pattern. gh-aw compilation verifies the syntax, while gh-aw `tools:` and `safe-outputs:` govern actual workflow capabilities. HVE agent files may contain tool names intended for other Copilot surfaces.

</div>

## Compile workflows

### Step 1: Compile

Run:

```powershell
gh aw compile
```

Expected result:
- gh-aw generates `.github\workflows\daily-backlog.lock.yml` and `.github\workflows\a11y-review.lock.yml`.
- Compile succeeds with the single HVE Reviewer import; the remediation plan is defined in the workflow prompt.

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
git add -A
git commit -m "Add agentic backlog and accessibility workflows"
```

Review `git status` before `git add -A`: it should list only the files created by `gh aw init` and the workflow sources and locks.

Expected result:
- The `gh aw init` outputs, the source `.md` files, and the generated `.lock.yml` files are committed together.

### Step 2: Push your branch

Run:

```powershell
git push
```

Expected result:
- GitHub can see the workflow files.

<div class="tip" data-title="Push rejected for workflow files">

> GitHub rejects pushes that change `.github\workflows` when your credential lacks the `workflow` scope. This can happen with some Codespaces or OAuth tokens. If it does, refresh your credential with `gh auth refresh --scopes workflow` and `gh auth setup-git`, then push again. In a Codespace, run `Remove-Item Env:GITHUB_TOKEN` (or `unset GITHUB_TOKEN` in bash) first so `gh` uses your own login.

</div>

### Step 3: File a follow-up feature request

A backlog is only useful if it reflects real work. Seed it from two artifacts you already have: the scope you deferred in Level 2, and the findings you deferred in Level 3. The daily backlog workflow noops when your repository has no open issues.

The first issue is the short form of what the Product Manager track produces with Backlog Manager. If you ran that track, your backlog already holds issues in this shape.

On GitHub, open **Issues > New issue > Feature request**. Use the repository issue form from `.github\ISSUE_TEMPLATE\feature.yml`.

Copy paste the following fixed content into the form fields.

Title:

```text
[Feature]: Remove a track from the playlist
```

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
- A small follow-up issue exists, with acceptance criteria an agent can be checked against.
- Remove was out of scope in Level 2. Deferred scope is a normal source of backlog items.

### Step 4: Turn a deferred review finding into an issue

Open the Level 3 review output: the newest review file under `.copilot-tracking\`, or the review in your chat history. Pick the deferred finding you kept. Create an issue for it, replacing the title and body with the finding:

```powershell
gh issue create --title "Review finding: SHORT-TITLE" --body "Deferred from the Level 3 RPI review. Finding: WHAT-AND-WHERE. Smallest fix: SMALLEST-FIX."
```

If your review deferred nothing, create these two issues instead. They are typical review findings for this slice:

```powershell
gh issue create --title "Show track count in the playlist panel" --body "Display the number of tracks currently in the in-memory playlist."
gh issue create --title "Add an API test for an unknown track id" --body "Cover adding an unknown track id to the playlist with an xUnit test."
```

Expected result:
- `gh issue list` shows at least two open issues, all traced to a decision or a review you made.
- If you ran the Level 2 Product Manager track, its issues are in the backlog too. Any issues you closed from a commit are no longer open.

### Step 5: Run daily backlog

Run:

```powershell
gh aw run daily-backlog
```

Expected result:
- gh-aw triggers the compiled workflow.
- The workflow creates one `[Daily backlog]` summary issue when there are open issues.
- The summary includes `## Recommended implementation order` and `## Can be developed in parallel`.

![Daily backlog summary issue](assets/l5-daily-backlog-issue.png)

### Step 6: Read the summary issue

Open the created issue. Look for:

- Recommended order.
- Parallelizable set.
- Needs human decision.
- Notes and assumptions.

Expected result:
- You can use the issue to decide what humans or agents should do next.
- You do not treat the workflow as an automatic delegation system. It labels and recommends; you delegate.

<div class="tip" data-title="Parallel work option">

> Each group under **Can be developed in parallel** is a candidate for a separate Copilot cloud agent session, or for `/fleet` sub-agents in Copilot CLI. Copilot CLI documents `/fleet` in supported versions. Use it only for bounded tasks with independent files, and verify the exact command behavior in your CLI version.

</div>

## Threat model: agents that run without you

The daily backlog workflow runs on a schedule, with nobody watching, and reads text that other people wrote. Anyone who can open an issue can write instructions into it. That is **prompt injection**: text that the agent may treat as a command. Open `.github\workflows\daily-backlog.md` and find the line that limits each risk:

| Risk | What limits it in `daily-backlog.md` |
| --- | --- |
| Injected text asks the agent to change code or settings | `permissions:` are read-only. The agent job cannot write to the repository |
| Injected text asks for many issues, or for labels that trigger other automation | `safe-outputs:` declare the only writes allowed: one summary issue with a fixed title prefix, and labels from an `allowed` list, each with a `max` |
| Injected text asks the agent to delegate work to another agent | The prompt forbids assignment, and no `assign-to-agent` safe output exists. Delegation stays a human decision |
| The agent sends repository content to an outside host | gh-aw restricts the agent's network access through the `network` frontmatter. See [network permissions](https://github.github.com/gh-aw/) |
| A leaked or over-broad token | `copilot-requests: write` lets the workflow call Copilot without a personal access token. Compare it with the extended security track, which needs a PAT for `assign-to-agent` |

Expected result:
- You can explain why the workflow can only **recommend**, and why that is a design choice, not a limitation.

## Delegate one parallelizable issue

You now hand one issue from the parallel group to Copilot cloud agent. You assign it **now**, so the agent works while you finish this level. You review its pull request in Level 6.

Before you delegate, two things must be true. The agent's work must be checked by the same contract as yours, and the agent's environment must match yours.

### Step 1: Choose the issue

In the summary issue, look at **Can be developed in parallel**. The instructions in Step 5 are written for the **Remove a track from the playlist** issue.

- If the summary lists it in a parallel group, choose it.
- If the summary puts it under **Needs a human decision**, or after a dependency, read the reason. That is the workflow doing its job. If the reason is not a real blocker, delegate it anyway and tell your facilitator what the workflow said.

Expected result:
- You know the number of the issue you will delegate, and why it can be developed in parallel.

### Step 2: Make the tests the contract

Today, `dotnet test` and `npm test` run only when someone remembers to run them. Before an agent works on your repository, make them a check that every pull request must pass. Run from the repository root:

```powershell
New-Item -ItemType Directory -Force .github\workflows | Out-Null
Copy-Item solutions\afternoon-2\.github\workflows\ci.yml .github\workflows\ci.yml
git add .github\workflows\ci.yml
git commit -m "Add CI for API and front-end tests"
git push
```

Open the **Actions** tab and wait for the **CI** run on `main` to pass. Then create a branch ruleset that requires its `test` job on the default branch:

```powershell
gh api --method POST "repos/{owner}/{repo}/rulesets" --input solutions\afternoon-2\rulesets\main-tests-required.json
```

Expected result:
- **Settings > Rules > Rulesets** shows the active ruleset **Tests must pass on main**, which requires the `test` status check.
- Repository administrators are on the bypass list, so your own checkpoint pushes to `main` keep working.
- A pull request, including the one Copilot opens, cannot merge until `test` passes. GitHub documents that Copilot cloud agent is subject to the repository's branch protections and required checks.

<div class="warning" data-title="Workshop shortcut">

> In a real team, keep the bypass list short and audited, and add required reviews. Rulesets on private repositories depend on your plan. If `gh api` reports that the feature is not available, watch the facilitator demo and continue: the CI run still reports on the pull request.

</div>

### Step 3: Match the agent's environment to yours

Copilot cloud agent starts in a fresh GitHub Actions environment. `.github\workflows\copilot-setup-steps.yml` prepares it before the agent starts: the job must be named `copilot-setup-steps`, and the file must be on the default branch. Anything the agent needs that is not installed here, it must download during the session, where the firewall may block it.

Open `.github\workflows\copilot-setup-steps.yml`. After the **Install front-end dependencies** step, add a build step at the same indentation as the other steps:

```yaml
      - name: Build the API
        run: dotnet build MusicCatalog.slnx --no-restore
```

Then run:

```powershell
git add .github\workflows\copilot-setup-steps.yml
git commit -m "Build the API in Copilot setup steps"
git push
```

Expected result:
- The push runs the **Copilot Setup Steps** workflow, because the workflow triggers on changes to its own file. It passes in the **Actions** tab.
- The agent starts from a solution that already builds. A broken build now fails here, before a session starts, instead of halfway through it.

See [Customize the agent environment](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent).

### Step 4: Confirm default branch prerequisites

Copilot cloud agent reads custom agents and setup steps from the default branch.

Check:
- `.github\workflows\copilot-setup-steps.yml` is on the default branch, with your build step.
- HVE-Core RPI Agent files from APM are committed, so they are available on the default branch before you select that custom agent.
- `plugins\music-catalog-conventions` is committed. The agent cannot use your installed plugins, but it can read the plugin files in the repository.
- Your organization allows Copilot cloud agent.

<div class="warning" data-title="Policy-dependent feature">

> Copilot cloud agent availability, custom agent selection, and network settings depend on licence and organization policy. If the UI is unavailable, watch the facilitator demo and keep your issue for manual implementation.

</div>

### Step 5: Assign the issue

On the issue page, use **Assignees** or the Copilot task control to assign the issue to Copilot. If the UI lets you choose a custom agent, choose **RPI Agent**.

![Assigning an issue to Copilot cloud agent](assets/l5-cloud-agent-assignment.png)

Copy paste the following additional instructions:

```text
Use the RPI workflow. Research the current playlist implementation, plan the smallest remove-from-playlist change, implement it with tests, and review against the issue acceptance criteria. For the new API endpoint, follow the team skill in plugins/music-catalog-conventions/skills/add-api-endpoint/SKILL.md. Keep state in memory only. Do not add persistence, users, multiple playlists, reorder, search, or a styling library. Run dotnet test and npm test from src/front before opening the PR.
```

Expected result:
- Copilot creates a branch and a draft pull request or task session, depending on current GitHub behavior.
- You do not wait for it. Continue with the accessibility workflow while the agent works: this is what asynchronous delegation looks like.

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

## Extended track: delegate a security review to Copilot cloud agent

<div class="info" data-title="Extended track">

> This track takes about 20 minutes, plus the time the agent runs. Your facilitator tells you whether to run it. It needs the Level 4 commit, which puts the HVE-Core agents on your default branch, and it needs Copilot cloud agent to be enabled.

</div>

This track follows the HVE-Core [Security Architect guide](https://microsoft.github.io/hve-core/docs/hve-guide/roles/security-architect). In that guide, a security architect:

1. Plans controls with **Security Planner**.
2. Adds supply-chain review with **SSSC Planner**.
3. Adds **RAI Planner** only when the system has AI components.
4. Tracks risks with `/risk-register`.
5. Checks the implementation with `/rpi-review` and **Security Reviewer**.
6. Uses `/incident-response` in operations.

Here, you hand the Security Reviewer run to Copilot cloud agent. The review runs on GitHub instead of on your machine, and comes back as a pull request that a human reviews.

<div class="warning" data-title="Assistive tools only">

> The HVE-Core security agents are assistive tools. They do not replace SAST, DAST, SCA, penetration testing, or review by a qualified person. A qualified person must validate every finding before anyone acts on it.

</div>

| Mechanism | Classification |
| --- | --- |
| Security Planner, SSSC Planner, RAI Planner, Security Reviewer | HVE-Core agents, documented by HVE-Core |
| Custom agents for Copilot cloud agent, read from `.github\agents` on the default branch | Documented capability |
| Assigning an issue to Copilot with a custom agent through the REST API (`agent_assignment.custom_agent`) | Documented capability, public preview |
| The gh-aw `assign-to-agent` safe output | Documented gh-aw capability, needs a fine-grained PAT |
| Security Reviewer and its subagents running inside Copilot cloud agent | Workshop pattern: check what the report says it ran |
| A report-only security pull request | Workshop pattern |

### Step 1: Check that Security Reviewer is on the default branch

Run:

```powershell
gh api "repos/{owner}/{repo}/contents/.github/agents" --jq ".[].name"
```

Expected result:
- `security-reviewer.agent.md` is listed.
- If it is missing, check that your Level 4 commit included `.github` and that you pushed it. You can still continue: assign the issue without a custom agent. The default Copilot agent follows the issue instructions, but without the HVE-Core orchestration.

### Step 2: Create the security review issue

Run:

```powershell
$body = @'
## Goal

Run a security review of the Music Catalog playlist slice with the HVE-Core Security Reviewer in audit mode.

## Scope

- src/api
- src/front/src

## Deliverable

- One pull request that adds docs/security/playlist-security-review.md.
- For each finding: severity, file and line, description, recommendation, and whether the finding was verified.
- Do not change application code. Fixes become separate issues after human review.

## Note

These findings are AI-assisted. A qualified person must validate them before anyone acts on them.
'@
$url = gh issue create --title "[Security]: Review the playlist slice" --body $body
$issue = $url.Split('/')[-1]
$url
```

Expected result:
- A new issue exists, and `$issue` holds its number.

### Step 3: Assign the issue to Copilot with Security Reviewer

Choose one option.

**Option A: GitHub UI.** Open the issue. Under **Assignees**, choose **Copilot**. When the dialog lets you choose a custom agent, choose **Security Reviewer**. Then copy paste the following additional instructions:

```text
Report only. Follow the issue: review src/api and src/front/src in audit mode, then open one pull request that adds docs/security/playlist-security-review.md. Do not change application code. List which security skills you applied and mark every finding as verified or unverified.
```

**Option B: command line.** This uses the documented REST API for assigning issues to Copilot, which is in public preview. Run from the same PowerShell session:

```powershell
$repo = gh repo view --json nameWithOwner --jq .nameWithOwner
$payload = @{
  assignees        = @('copilot-swe-agent[bot]')
  agent_assignment = @{
    target_repo         = $repo
    base_branch         = 'main'
    custom_agent        = 'security-reviewer'
    custom_instructions = 'Report only. Add docs/security/playlist-security-review.md and do not change application code. List which security skills you applied and mark every finding as verified or unverified.'
    model               = ''
  }
} | ConvertTo-Json -Depth 3
$payload | gh api --method POST "repos/$repo/issues/$issue/assignees" --input -
```

Expected result:
- Copilot is an assignee and opens a draft pull request.
- In the agent session, you can see it profile the code base and apply security skills.

<div class="info" data-title="Workshop note">

> This workshop passes the agent file name without `.agent.md` as `custom_agent`. That is the format the gh-aw examples use. If the assignment ignores the custom agent, use Option A and pick the agent in the UI.

</div>

### Step 4: Review the security pull request

When the pull request is ready, check:

- Only `docs\security\playlist-security-review.md` changed.
- Each finding points to a file and a line that you can open.
- The report lists the skills it applied.
- You verify at least one finding yourself and mark false positives.

A sample report with illustrative findings is in `solutions\afternoon-2\docs\security\playlist-security-review.md`. Use it to compare the shape, not the findings.

Expected result:
- Nothing merges without a human decision.
- Each finding you accept becomes an issue. You can create these issues with Backlog Manager, as in the Level 2 Product Manager track.

### Step 5 (facilitator demo): Delegate with a label and gh-aw

The solution workflow `solutions\afternoon-2\.github\workflows\security-review-delegation.md` automates Step 3, while a human still decides:

- **Trigger:** a person adds the `security-review` label to an issue.
- **Agent job:** it only reads the issue and checks that it is a scoped security review request. It cannot write to GitHub.
- **Safe output:** `assign-to-agent` performs the assignment with `custom-agent: security-reviewer`, `target: triggering`, and `max: 1`. The `names: [security-review]` trigger filter is the label gate.
- **Authentication:** assigning Copilot needs a fine-grained PAT stored as the `GH_AW_AGENT_TOKEN` secret. The PAT needs read access to metadata and write access to actions, contents, issues, and pull requests. The default `GITHUB_TOKEN` and GitHub App tokens are not accepted.

Run from the repository root:

```powershell
Copy-Item solutions\afternoon-2\.github\workflows\security-review-delegation.md .github\workflows\security-review-delegation.md
gh aw compile
gh label create security-review --description "Delegate a security review to Copilot cloud agent"
gh secret set GH_AW_AGENT_TOKEN
git add .github\workflows\security-review-delegation.md .github\workflows\security-review-delegation.lock.yml
git commit -m "Add label-gated security review delegation"
git push
```

`gh secret set` prompts for the value, so the PAT does not end up in your shell history. Then create a new security review issue, as in Step 2, and add the `security-review` label to it.

Expected result:
- The workflow runs, and Copilot is assigned with Security Reviewer.
- Without the label, or without the secret, nothing is assigned.

<div class="warning" data-title="Long-lived credential">

> A PAT is a long-lived credential. Limit it to this repository, set a short expiry, and delete it after the workshop.

</div>

---

# Level 6: Review the delegated work

## Topic

You will review the pull request that Copilot cloud agent opened for the issue you delegated in Level 5. You will follow the agent session, approve and run the required checks, compare the change with the issue, ask your team's test-writer agent for missing tests, and request a Copilot code review. Then you will see how secret scanning push protection stops a leaked credential.

**Why this level:** delegation only pays off when checking the work costs less than doing it. The contract you set in Level 5 (CI, the ruleset and the setup steps) and the reviewers in this level make that check fast and repeatable. A human still decides what merges.

![Copilot cloud agent pull request under review](assets/l6-cloud-agent-pr-review.png)

## Review the pull request

### Step 1: Follow the agent session

Open the issue you delegated, then the linked pull request. Open the agent session from the pull request timeline.

Expected result:
- The setup job prepared .NET 10 and Node 22 dependencies, and your **Build the API** step ran.
- The session shows the RPI phases, or the steps the agent followed if no custom agent was available.
- The pull request references the issue.
- If the agent is still working, read the session log until it finishes. Use the time to finish the Level 5 accessibility workflow.

### Step 2: Approve and run the required checks

By default, GitHub Actions workflows do not run on a pull request from Copilot cloud agent until a user with write access approves them. Workflows run code from the pull request, so read the diff first. Then click **Approve and run workflows**.

Expected result:
- The **CI** workflow runs on the pull request, and its `test` check is **Required**.
- The merge button stays blocked until `test` passes. The rule is the same for the agent as for you.

### Step 3: Check the change against the issue

When the pull request is ready, check:

- The implementation stayed within the issue scope.
- The new API endpoint follows the team `add-api-endpoint` skill: under `/api`, state in a singleton service, JSON bodies, and an xUnit test through `WebApplicationFactory<Program>`.
- Tests ran and passed, in the session and in the `test` check.
- The firewall did not block required dependency downloads.
- The PR body lists any blocked network requests if they occurred.
- The custom agent did not bypass human review.

<div class="info" data-title="Firewall default">

> GitHub documentation states that Copilot cloud agent internet access is limited by a firewall by default. Allowed hosts and organization policy determine whether dependency downloads work without extra configuration.

</div>

### Step 4: Ask your team's test-writer for missing tests

You installed the `music-catalog-conventions` plugin in Level 4. Use its test-writer agent as a second pair of eyes on the agent's tests. Run from the repository root, replacing `PR-NUMBER` with the pull request number:

```powershell
gh pr checkout PR-NUMBER
copilot
```

In Copilot CLI, run `/agent` and select **music-catalog-test-writer**. Copy paste the following prompt:

```text
Review the tests on this branch against the acceptance criteria of the remove-from-playlist issue. For each behaviour, check the happy path, one validation failure, and one empty state. List missing test cases only. Do not edit files.
```

Expected result:
- The test-writer lists missing cases, or confirms there are none, using the team conventions from its agent file.
- Add any real gap as a review comment on the pull request, and start it with `@copilot` so the agent picks it up.

Leave Copilot CLI with `/exit`, then return to `main`:

```powershell
git switch main
```

### Step 5: Request a Copilot code review

On the pull request, under **Reviewers**, click **Request** next to **Copilot**.

You can also run this from the repository root. Replace `PR-NUMBER` with the pull request number:

```powershell
gh pr edit PR-NUMBER --add-reviewer @copilot
```

Expected result:
- Copilot posts a review with comments and, where it can, suggested changes.
- The comments follow the conventions in `.github\copilot-instructions.md`: minimal API under `/api`, in-memory state, accessible markup, and tests for every behaviour change.
- The review is a **Comment**, not an approval. A human still approves and merges.

Compare it with the review phase you ran in Level 3:

| | RPI review (Level 3) | Copilot code review |
| --- | --- | --- |
| Where it runs | Your Copilot CLI or VS Code session | On the pull request on GitHub.com |
| What it checks | The plan, the acceptance criteria and the changes record | The diff, against the repository instructions |
| Output | A review log and findings to fix | Review comments and suggested changes on the PR |
| Who sees it | You | Everyone who reviews the PR |

<div class="info" data-title="Usage units and automatic reviews">

> Each Copilot code review consumes **AI credits**. On private repositories it also uses **GitHub Actions minutes**. A manual request is attributed to the user who requests it. Check the current rates in [Copilot billing](https://docs.github.com/en/copilot/concepts/billing-and-usage) instead of relying on workshop material. A repository administrator can request a review on every pull request with the **Automatically request Copilot code review** branch ruleset rule. See [Configuring code review by GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review).

</div>

### Step 6: Decide

Merge only when the `test` check passes, the issue acceptance criteria are met, and you have read the review comments. To ask for changes, mention `@copilot` in a pull request comment and describe the change.

Expected result:
- You merged the pull request, or asked for changes with a clear comment.
- If you merged, update your local branch with `git pull`.

## Threat model: the cloud agent

In Level 5, you limited what an unattended workflow can write. Copilot cloud agent writes code, so GitHub adds more limits around it. Match each risk with what you saw in this level:

| Risk | Mitigation documented by GitHub |
| --- | --- |
| Someone outside the team steers the agent | Only users with write access can assign the agent. Comments from users without write access are never passed to it |
| Hidden instructions in an issue or comment | Hidden characters are filtered, for example text in an HTML comment is not passed to the agent |
| The agent pushes where it should not | It pushes only to its own `copilot/` branch, cannot approve or merge, and is subject to branch protections and required checks |
| The agent's code runs in your CI unreviewed | Workflows wait for **Approve and run workflows** from a user with write access |
| The agent leaks code or secrets to the internet | The agent firewall limits internet access by default |
| Nobody can tell who did what | Commits are authored by Copilot, co-authored by the person who assigned the work, and link to the session log |

See [Risks and mitigations for Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/risks-and-mitigations).

Expected result:
- You can name the human decision points: writing the issue, assigning it, approving workflows, reviewing, and merging.

## Secret scanning and push protection

Copilot cloud agent already runs secret scanning on the code it generates. Push protection applies the same check to every push, whether it comes from a person, a Codespace or an agent.

<div class="warning" data-title="Licence-dependent: facilitator demo by default">

> Your workshop repository is **private**. For private repositories owned by an organization, secret scanning and push protection require **GitHub Secret Protection** to be enabled. On public repositories, secret scanning runs for free. If Secret Protection is not available, watch the facilitator demo. Use only the generated fake key below. **Never** use a real credential, even a revoked one.

</div>

### Step 1: Enable push protection

In the repository, open **Settings → Advanced Security**. Under **Secret Protection**, click **Enable**, then click **Enable** next to **Push protection**.

### Step 2: Add a workshop custom pattern

Generate a fake key from the repository root. It is not a real credential:

```powershell
"MCWS_" + -join ((48..57) + (65..90) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
```

Under **Secret Protection**, to the right of **Custom patterns**, click **New pattern**, then enter:
- Pattern name: `Music Catalog workshop key`
- Secret format: `MCWS_[A-Z0-9]{32}`
- Test string: the key you generated

Click **Save and dry run**, then **Publish pattern**, then **Enable** push protection for the pattern.

### Step 3: Try to push the fake key

Run from the repository root. Paste your generated key in place of `PASTE-KEY-HERE`:

```powershell
git switch -c demo/push-protection
Set-Content -Path demo.env -Value "MUSIC_CATALOG_KEY=PASTE-KEY-HERE"
git add demo.env
git commit -m "Demo: push protection"
git push -u origin demo/push-protection
```

Expected result:
- The push is **rejected**. The output names the **Music Catalog workshop key** pattern, the file and the commit.
- No alert is created, because nothing reached the repository.

<div class="important" data-title="Do not bypass">

> The rejection message offers a link to bypass the block. Do not use it. A bypass creates a secret scanning alert, and an administrator must review it.

</div>

### Step 4: Clean up

```powershell
git switch main
git branch -D demo/push-protection
Remove-Item demo.env -ErrorAction SilentlyContinue
```

Expected result:
- `git status` shows a clean working tree on `main`.
- The fake key never reached GitHub.

## Commit checkpoint

No local commit is required for this level unless you changed local files. Run:

```powershell
git status
```

Expected result:
- Local work remains clean.
- The delegated work is merged or tracked in its pull request, and the rest of the backlog is tracked in GitHub.

---

# Recap: Governed agentic SDLC

## Topic

You will connect the afternoon into one operating model, then look at it as an architect would: how to roll it out, measure it, apply it to existing code, and choose a method and a model.

## What you practiced

**Act 1, build the feature.** You started with a clean starter app. You used DT Coach to constrain the problem. You used RPI Agent to research, plan, implement, and review a full-stack slice, kept its context small with phase artifacts, and made one real design decision at the gate.

**Act 2, scale the method.** You converted the method into repository-owned dependencies with APM and a lockfile. You used policy to show how governance can block unapproved agent packages. You packaged team conventions as a Copilot plugin marketplace. You compiled gh-aw workflows, seeded the backlog from your own deferred scope and review findings, and saw why an unattended workflow may only recommend.

**Act 3, close the loop.** You made the tests a required check, prepared the agent's environment, and delegated one parallelizable issue to Copilot cloud agent while you kept working. You reviewed its pull request with required checks, your team's test-writer agent and Copilot code review, and saw push protection block a leaked key.

If you ran the extended tracks, you also worked in three roles: as a Product Manager, you went from BRD to PRD to tracked GitHub issues; as a Tech Lead, you added an ADR and a multi-perspective code review; as a Security Architect, you delegated a report-only security review to Copilot cloud agent.

## Operating model

| Layer | What it did today | Governance point |
| ----- | ----------------- | ---------------- |
| DT Coach | Framed the capability and boundaries. | Humans accepted fixed decisions. |
| PM agents (extended) | BRD Builder, PRD Builder, Functional Planner and Backlog Manager turned decisions into issues. | Planning is read-only; only a confirmed `/backlog-execute` writes to GitHub. |
| RPI Agent | Sequenced research, plan, implement, review. | Humans gate each phase; tests and commits verified progress. |
| APM | Installed HVE-Core into the repo with a SHA pin. | `apm.lock.yaml` and policy audit made it reproducible. |
| Plugin marketplace | Shared Music Catalog conventions. | Marketplace and settings made plugin enablement explicit. |
| gh-aw | Ranked a backlog seeded from your artifacts, and ran the accessibility workflow. | Read-only agent job; `safe-outputs` limited writes; no delegation. |
| CI and ruleset | Made `dotnet test` and `npm test` a required check on the default branch. | The same contract for humans and agents; bypasses are audited. |
| Security Reviewer (extended) | Ran a report-only security review in Copilot cloud agent. | A human labels or assigns, and a qualified person validates every finding. |
| Copilot cloud agent | Picked up one parallelizable issue and followed the team skill. | Human issue and assignment, setup steps, firewall, workflow approval, required checks, PR review. |
| Test-writer agent | Checked the agent's tests against team conventions. | Report only; a human decides what to ask for. |
| Copilot code review | Reviewed the agent's PR against repository instructions. | Comments only; a human approves and merges. |
| Secret scanning | Blocked a fake key at push time. | Push protection and audited bypasses (Secret Protection licence). |

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

## Architect capstone

Use this section as a short facilitated discussion, or read it on your own. Each part starts from what you did today and asks what changes at the scale of an organization.

### Roll out across the organization

| Today, in your repository | At organization or enterprise scale |
| --- | --- |
| You inherited the Copilot features, models and MCP access that your organization allows | Enterprise and organization **Copilot policies** decide which features, models, preview features and MCP servers are available. MCP access can be limited to servers from an [MCP registry](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-mcp-server-access) |
| `.github\copilot-instructions.md` and `.github\agents` in one repository | Organization custom instructions, and [organization or enterprise custom agents](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents) in a `.github` or `.github-private` repository |
| `apm.yml` and `apm-policy.yml` in one repository | An organization or enterprise APM policy that repositories extend. APM policy inheritance is designed to tighten only: a repository can add restrictions but not relax its parent. Check the current [APM documentation](https://microsoft.github.io/apm/), because the policy schema is evolving |
| One team marketplace registered in `.github\copilot\settings.json` | A curated organization marketplace repository, with plugins reviewed like any other dependency |
| One repository ruleset | Organization rulesets that apply the same required checks and reviews to many repositories |

### Measure the impact

- Use [Copilot usage metrics](https://docs.github.com/en/copilot/concepts/copilot-usage-metrics/copilot-metrics) for adoption and engagement: who uses which features, and how often.
- Adoption is not impact. Measure delivery outcomes that you already track, before and after: cycle time from issue to merge, review time, rework on pull requests, and change failure rate.
- Compare agent pull requests with human ones: merge rate, number of review rounds, and how often the required checks fail. A rising rework rate is a sign that issues are not scoped well enough for delegation.
- Keep usage units separate from outcome metrics. See **Choose a model and track usage** below.

### Adopt it on existing code

Today's starter was small and clean. Most of your repositories are not. A pattern that works on existing code:

1. **Research first.** Run research-only RPI on the area you want to change. Do not plan or implement yet.
2. **Write down what research found.** Turn the conventions it found into repository instructions, and into path-specific instructions for the riskiest folders.
3. **Make verification the contract** before any delegation: CI, required checks, and the setup steps the agent needs.
4. **Delegate low-risk work first:** tests, documentation, and small, well-scoped issues with clear acceptance criteria. Widen the scope as the review data in **Measure the impact** improves.

### Choose a method

RPI is one structured method among several. Choose by the kind of uncertainty you face:

| Method | The source of truth | Use it when |
| --- | --- | --- |
| Agent mode or a single prompt | The conversation | The change is small, local and easy to verify |
| RPI (today) | Research, plan and review artifacts for each task | The code is unfamiliar, or you need a human gate between understanding, deciding and changing |
| Spec-driven development, for example [GitHub Spec Kit](https://github.com/github/spec-kit) | A specification that lives with the code, from which plans and tasks are derived | The requirements are the hard part, and several people or agents implement against the same spec |

The methods combine: a spec can describe what to build, and RPI can carry out each task from it.

### Choose a model and track usage

| Task | A reasonable starting point |
| --- | --- |
| Routine edits, explanations, small fixes | **Auto**, or an efficiency-oriented model |
| Research and planning on unfamiliar code, reviews | A stronger reasoning model |
| Unattended workflows and delegated tasks | A model you choose explicitly, recorded for reproducibility |

Auto model selection is documented in VS Code, Copilot CLI, the Copilot App, and GitHub.com surfaces. Its documented tiers are **Efficiency** (prioritizes cost, for fast, straightforward tasks), **Balance** (cost, quality and latency, for everyday work) and **Intelligence** (prioritizes quality, for complex tasks). Auto excludes models that are not in your plan, models blocked by administrator policy, and models blocked by data residency or FedRAMP constraints. Do not assume that Auto, or any model, is always the cheapest, fastest or best: measure it on your own tasks with the **Controlled measurement experiment** in the Extra Credits, and record the model actually selected when you need reproducibility.

Different experiences consume different units. Keep them distinct when you report usage:

| Experience | Usage unit to track | Notes |
| ---------- | ------------------- | ----- |
| VS Code Chat and Agent | AI credits under the current Copilot billing model | Code completions are not billed on paid plans. |
| Copilot CLI | AI credits | Use `/usage` if your CLI version supports it. |
| Copilot cloud agent | AI credits plus separate GitHub Actions runner consumption where applicable | Keep AI credits and runner minutes separate. |
| Copilot code review | AI credits, plus GitHub Actions minutes on private repositories | See Level 6. |
| gh-aw with the Copilot engine | AI credits for Copilot requests; GitHub Actions workflow execution for compute | `permissions: copilot-requests: write` enables Copilot requests from the workflow pattern used here. |
| External APIs, MCP tools, or package registries | Provider-specific units | Do not blend third-party API fees with Copilot AI credits. |

Check current rates in [Copilot billing and usage](https://docs.github.com/en/copilot/concepts/billing-and-usage) rather than in workshop material.

---

# Extra Credits 🪙

Use this section only if you finish early or as a facilitator-led discussion. Do not add unverified prices or unpublished claims. The model-choice guide and the usage-unit matrix are in the **Architect capstone** of the recap.

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

If you faced any challenge or bug running this workshop, please let us know. Your help will be invaluable in making this workshop better, especially as we try to keep it up to date with fast-moving Copilot capabilities. [Report any problem here.](https://github.com/Justrebl/AI-SDLC-Workshop/issues) To propose a fix, see [CONTRIBUTING.md](https://github.com/Justrebl/AI-SDLC-Workshop/blob/main/CONTRIBUTING.md).
