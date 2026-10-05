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

Create your repository from the template: open [Justrebl/AI-SDLC-Workshop](https://github.com/Justrebl/AI-SDLC-Workshop), select **Use this template** → **Create a new repository**, and choose a **private** repository under your account. [Learn more about template repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).

<details>
<summary>Create the repository with GitHub CLI, or use the copy fallback</summary>

After signing in with `gh auth login`, replace `my-music-catalog` with any name:

```powershell
gh repo create my-music-catalog --private --template Justrebl/AI-SDLC-Workshop --clone
cd my-music-catalog
```

If template creation is blocked in your organization, copy the repository with a fresh history. Run these commands only in the new copy:

```powershell
git clone https://github.com/Justrebl/AI-SDLC-Workshop my-music-catalog
cd my-music-catalog
Remove-Item -Recurse -Force .git
git init -b main; git add -A; git commit -m "Workshop starter"
gh repo create my-music-catalog --private --source . --remote origin --push
```

`gh repo view` should show your own repository with a `main` branch. If the push is rejected for missing the `workflow` scope, follow the tip in Level 5 "Push your branch", then run `git push -u origin main`.

</details>

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

From your workshop repository root, sign in to GitHub CLI, and then to Copilot CLI. Copilot CLI asks you to run `/login` on first start.

```bash
gh auth login
copilot
> `From Copilot` : exit
```

If **Confirm folder trust** appears, check that the displayed path is your workshop repository. Select **Yes** for this session, or **Yes, and remember this folder for future sessions** if you want to retain that trust, then press **Enter**. Choose **No (Esc)** if the path is unexpected or you do not trust the files. The screenshot shows a session started from `src/front`; use the repository root for the workshop.

![Copilot CLI folder-trust prompt showing the folder path and trust choices](../assets/copilot-trust-folder.png)

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

## Starter readiness (prerequisite)

Complete this once before the workshop, after opening your copy and restoring its dependencies. If you already completed these checks, go straight to Level 1; there is no separate app-validation level.

From the repository root, check both test suites and the working tree:

```powershell
dotnet test
npm --prefix src/front test
git status
```

Expected result:
- xUnit and Vitest pass.
- The working tree is clean before agents edit the repository. A fresh template copy already has an initial commit; no extra baseline commit is needed.
- The starter only serves and displays `/api/hello`. The 12 synthetic tracks in `src\api\Data\tracks.json` are not exposed by an endpoint yet, and the playlist capability is not implemented.

The application lives in `src\api` and `src\front`, with API tests in `tests\api` and reference solutions in `solutions\afternoon-2`. If a check fails, resolve it using your [delivery-option prerequisites](https://github.com/Justrebl/AI-SDLC-Workshop/blob/main/docs/prerequisites.md) before starting Level 1.

![Starting repository in VS Code](assets/starter-repository.png)

<div class="info" data-title="Documented capability labels">

> This workshop labels mechanisms as **documented capability**, **configuration**, **experimental**, **architectural recommendation**, or **workshop simulation**. Keep those labels when you adapt the material so participants do not confuse a verified product feature with a teaching pattern.

</div>

<div class="important" data-title="Synthetic data only">

> The 12 tracks in `src\api\Data\tracks.json` are synthetic sample data. Do not paste customer data, confidential backlog items, credentials, or production telemetry into prompts, issues, workflow runs, screenshots, or plugin manifests.

</div>

![AI SDLC with GitHub and GitHub Copilot route map](assets/a2-route-map.png)

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

**For every skill or prompt command in this workshop:** send the slash command on its own, then send the task or options as a separate message. If the short name is not recognized, select the matching HVE-Core entry from the slash-command menu. Built-in CLI commands such as `/agent <name>`, `/model auto intelligence`, and `/settings experimental on` retain their command arguments, but are still sent separately from task prompts.

### Step 4: VS Code alternative

<div class="warning" data-title="Prefer the direct plugin">

> The direct HVE-Core Copilot CLI plugin is recommended: it is updated more often than the VS Code extension, which may lag behind the latest agents, commands, and skills. Use the extension as a fallback when the plugin path is blocked.

</div>

If the Copilot CLI plugin path is blocked, install the VS Code extension instead:

```text
ise-hve-essentials.hve-core
```

Expected result:
- You can select HVE agents from Copilot Chat in VS Code.
- The remaining prompts still work, but the UI path is different.

![VS Code Marketplace showing the HVE Core extension by ISE HVE Essentials and its Install Pre-Release button](../assets/vscode-hve-core.png)

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

You will experiment with HVE-Core DT Coach through a short tour of its **nine Design Thinking methods**. Start with a user problem, not a prescribed feature: how might someone choose music for a listening moment? You choose the person, context, ideas, and concept to explore. The coach helps you question assumptions, sketch alternatives, and decide what you would learn next.

**Why this level:** good delivery starts with a worthwhile problem, not just a detailed coding prompt. Experience the coach helping you think rather than asking it to fill in predetermined answers. After exploration, you will explicitly map your concept to the small playlist slice used by the rest of the workshop; ideas outside that slice remain future possibilities, not rejected brainstorming.

The exercise is a **10–15 minute sampler**, not completion of nine full methods. Methods 1–3 explore the problem, 4–6 explore possible solutions, and 7–9 consider implementation, testing, and iteration. You will plan or simulate the activities that need more time, real users, or working prototypes. These shortcuts do not satisfy the full methods' evidence gates.

An extended Product Manager track then turns these decisions into a BRD, a PRD, and GitHub issues with the HVE-Core planning agents.

| Artifact | What it explains | What it is used for |
| --- | --- | --- |
| **BRD — Business Requirements Document** | Why the business needs a capability, who benefits, and which outcomes matter. | Align stakeholders on the need, value, and investment before defining a solution. |
| **PRD — Product Requirements Document** | What the product must do, its boundaries, and what counts as acceptable. | Give engineers, designers, and testers shared behaviour and acceptance criteria. |
| **GitHub issues** | The bounded work items that deliver the agreed requirements. | Track ownership, dependencies, and progress, with links back to the BRD and PRD. |

<details>
<summary>How a Product Manager uses HVE Principles</summary>

### BRD: why the business needs the capability

A **Business Requirements Document (BRD)** explains the problem worth solving, who benefits, and what a successful outcome would mean. It gives stakeholders a shared basis for deciding whether to invest in the work before the team commits to a solution.

A useful BRD records the business context, stakeholder and user needs, intended outcomes, scope, constraints, assumptions, risks, and unresolved questions. It distinguishes evidence from hypotheses: an agent must not invent customer interviews, adoption figures, or a return on investment. Success measures need stakeholder agreement; writing a metric into a document does not validate it.

For this synthetic Music Catalog exercise, the BRD explains why participants need a small, bounded playlist capability to practise a governed agentic delivery workflow. It records the learning context and the single-playlist, in-memory boundary. It does **not** claim that real customers have requested the feature or that it will generate revenue.

Use the BRD to align sponsors and stakeholders, compare proposed scope with the agreed need, and revisit the rationale when priorities change. It is not a technical implementation plan or a collection of coding tasks.

### PRD: what the product must do

A **Product Requirements Document (PRD)** turns the agreed business need into a clear description of the product behaviour. It answers what users should be able to do, which states and failure cases must be handled, and how the team will decide that the capability is acceptable.

A useful PRD describes the user journey, functional requirements, relevant non-functional requirements such as accessibility, acceptance criteria, dependencies, and explicit exclusions. It should be detailed enough for engineers, designers, and testers to work from the same intent without unnecessarily prescribing the implementation.

For the playlist slice, the PRD specifies browsing tracks, adding a track to the single playlist, rejecting duplicate adds, displaying the empty state, and providing labelled, accessible controls. It also preserves the exclusions: no users, authentication, persistence, reorder, remove, search, or playlist creation. Those behaviours become acceptance criteria that the implementation and tests must satisfy.

Use the PRD to review proposed designs, plan delivery, derive test cases, and assess changes. It is not proof that a feature works: implementation, testing, and human review still provide that evidence. Architecture choices and the coding sequence belong in the subsequent technical plan or an architecture decision record when needed.

The chain is **framed need → BRD → PRD → reviewed backlog → implementation and validation**. Keep the documents proportional to the decision: this workshop uses short artifacts for a small slice, not paperwork for its own sake. If the scope changes, update the affected requirements and work items together rather than letting the backlog silently diverge from the agreed intent.

### How a Product Manager uses HVE principles

HVE-Core's principle is **"AI carries the rules, humans keep the judgment."** For a PM, this means delegating repeatable structuring and consistency work while retaining responsibility for the product decisions. The following is a practical interpretation for this workshop, not an additional HVE-Core policy.

1. **Frame before specifying.** Use DT Coach to make the problem, user need, assumptions, and boundaries explicit. In real product work, bring research and stakeholder evidence; the coach can organize that evidence but cannot substitute for it.
2. **Turn intent into reviewable artifacts.** Use BRD Builder and PRD Builder to draft structured requirements and surface gaps or contradictions. Review the drafts with the relevant stakeholders; generated text is a proposal, not approval.
3. **Make scope and success explicit.** Ask agents to preserve exclusions and produce observable acceptance criteria. The PM decides which outcomes matter, how to prioritize competing needs, and which trade-offs are acceptable.
4. **Separate planning from action.** Use Functional Planner to propose an issue hierarchy and Backlog Manager to recommend ordering and dependencies. Inspect the handoff before authorizing `/backlog-execute` to create or change issues in the confirmed repository.
5. **Preserve traceability and curate the handoff.** Keep the reviewed BRD, PRD, and decisions linked to the backlog. Commit useful, agreed deliverables rather than raw agent conversations, sensitive meeting notes, or unsupported claims.
6. **Close the feedback loop.** Compare delivered behaviour and review findings with the PRD, then evaluate outcomes using actual evidence. Accept, reject, or revise follow-up work deliberately; passing tests does not by itself establish business value.

The PM's role therefore shifts from repeatedly formatting documents and tickets to checking evidence, resolving ambiguity, aligning stakeholders, and owning prioritization. HVE provides a repeatable path between those decisions and engineering work; it does not make the decisions authoritative merely because an agent produced them.

The [extended Product Manager track](#extended-track-product-manager-with-hve-core) demonstrates this handoff with BRD Builder, PRD Builder, Functional Planner, and Backlog Manager. It is optional: the core workshop proceeds with a reviewed implementation handoff after the open exploration.

</details>

![DT Coach framing the playlist capability](assets/l2-dt-coach-framing.png)

## Start a DT project

### Step 1: Set Auto with the intelligence profile for the rest of the lab

Before starting the Design Thinking exercise, switch to **Auto** model selection with the **intelligence** profile. Keep this setting for the remaining interactive lab work, including the RPI phases.

In Copilot CLI, start `copilot` from the repository root and enter:

```text
/model auto intelligence
```

Confirm that **Auto** and the **intelligence** profile are selected. If your CLI version opens a selection menu instead, use `/model` to select **Auto** and its **intelligence** profile. You can also start a new session with the explicit runtime options:

```powershell
copilot --model auto --auto-tier intelligence
```

Auto chooses an available model allowed by your account and organization policies; it does not guarantee a particular model. This setting applies to your interactive session, not to separate cloud-agent or workflow runs. If you start a new session later, confirm the setting again.

If you use VS Code Chat, select **Auto** in the model picker and **intelligence** if your version offers the profile. If that profile is unavailable, use Copilot CLI for the workshop's Auto intelligence configuration.

### Step 2: Select DT Coach in Copilot CLI or VS Code Chat

Use the surface where you installed HVE-Core in Level 1.

**Copilot CLI:** there is no persistent agent-picker dropdown. In the session configured above, open the agent selection menu with:

```text
/agent dt-coach
```

If this opens a picker or the direct name is not recognized, run `/agent`, find **DT Coach** (it may appear as **DT-Coach** or a plugin-prefixed name), select it with the arrow keys, and press **Enter**. Confirm that DT Coach is the active agent before pasting the project prompt.

If your instructions refer to `/agents`, check `/help` for the command supported by your installed version; Copilot CLI 1.0.90-3 lists the singular `/agent`. If DT Coach is missing, check `/plugin` and complete the HVE-Core installation from Level 1 before continuing.

**VS Code Chat:** open Chat, use the agent picker, and select **DT Coach**. If it is missing, confirm that the HVE-Core extension is installed and enabled.

### Step 3: Start a learner-led nine-method sampler

Choose a listening situation you want to explore: a commute, focused work, a shared evening, or your own example. These are starting points, not personas or validated research. Set your own 10–15 minute timer; the coach cannot reliably enforce elapsed time.

First, invoke the project-start prompt and let DT Coach respond:

```text
/dt-start-project
```

Then send this short project brief as a separate message:

```text
Project name: Music Catalog listening experience — a workshop demonstration POC.
Starting question: How might we help someone choose music for a listening moment?
Help me brainstorm and sample all nine HVE Design Thinking methods within a 10–15 minute learning exercise. I will manage the timer. Keep proposed specifications POC-sized: no authentication, database, persistence, or external services; retain the existing src/api and src/front setup.
```

This is a **workshop demonstration**, not a production product specification. Explore different ideas within the starter's simple ASP.NET Core API and React front end; do not propose replacing its architecture or adding infrastructure. DT coaching notes belong under `.copilot-tracking/dt/music-catalog-listening-experience/`, not directly under `.copilot-tracking/dt/`. No application implementation is requested at this stage.

**Now follow the chat for the next 10 minutes.** Read DT Coach's responses, answer its questions in your own words, contribute ideas, and ask follow-up questions. Do not just paste the brief and move to the next lab step: the conversation is the exercise. If time allows, continue up to 15 minutes, then use the recap in Step 4.

You do not need to prescribe the coach's process. Keep any working-note edits limited to `.copilot-tracking/`; application code, tests, and published documentation stay unchanged during exploration.

Expected result:
- You supply the user/context and make choices rather than accepting a prewritten feature definition.
- DT Coach guides small activities across the nine methods, or explicitly reports which were only previewed or not reached.
- It does not implement code.
- It separates your observations from assumptions, and proposed tests from actual results.
- Any agent-written working notes stay under the local, ignored `.copilot-tracking/` folder.

<div class="tip" data-title="Choose how to approve local working-note edits">

> If DT Coach requests permission to create or update its `.copilot-tracking/` notes, you may approve that edit for the session when your client offers the option. Check the requested path and permission scope first; prefer an approval limited to the tracking folder rather than all repository writes.
>
> If you want fewer repeated permission prompts, you may instead enable **autoapproved / AI-assisted permissions** in your client's permission controls, where available. This lets the permission system assess requests with less interruption; it is not a guarantee that every request will be allowed. It is optional and separate from **Auto intelligence**, which selects the model.
>
> In either mode, DT Coach's write boundary remains `.copilot-tracking/` only. Decline requests to edit application code, tests, or published documentation during this exercise. Do not use unrestricted **allow-all / YOLO** permissions as a substitute for AI-assisted approval.

</div>

#### Optional: enable AI-assisted permissions in Copilot CLI

Copilot CLI **1.0.90-3** provides an **assisted** permission mode. A safety check approves requests it judges safe and asks you about others. Availability depends on your CLI version and organization policy; it may require experimental features.

1. In your existing session, enter `/permissions` and select **assisted** if it is offered.
2. If assisted mode is unavailable and your organization permits experimental features, enter `/settings experimental on`, then reopen `/permissions` and select **assisted**.
3. Confirm the session shows assisted permissions before continuing the DT conversation. To return to explicit approvals, reopen `/permissions` and select **manual**.

Alternatively, start a new session from the repository root with:

```powershell
copilot --experimental --assisted-approval --model auto --auto-tier intelligence
```

Then select DT Coach again with `/agent dt-coach`. This starts a new conversation; use `/resume` if you need to return to your earlier session, and check its permission mode after resuming. If your CLI does not recognize these options or policy blocks them, keep manual approvals; assisted mode is not required for the lab.

**Assisted approval is not a tracking-folder sandbox.** It assesses permission requests but does not enforce the `.copilot-tracking/`-only boundary for you. Keep that boundary in your instructions and inspect the files afterwards. Do not add `--allow-all`, `--yolo`, or `/allow-all`. Enabling experimental features changes a client setting; you can turn it off later with `/settings experimental off`.

### Example outcome after visiting all nine methods

This example explores a mood-based listening experience for hi-fi enthusiasts at home. The recap distinguishes **Methods 1–6 sampled** from **Methods 7–9 planned** and states that no method met its full completion criteria. Your context, ideas, and recap can differ; this is not an answer to reproduce or an expansion of the Level 3 implementation scope.

![DT Coach recap of a nine-method sampler, describing a mood-filter concept, remaining research and testing, and locally saved working notes](../assets/dt-coach-nine-methods-recap.png)

<details>
<summary>Toggle solution: example prompts for the nine methods</summary>

These nine prompts group and rephrase the conversation shown in the example. They are **illustrative learner contributions**, not nine official method commands or proof that the methods are complete. Start the project and send the short brief above first. Then use a prompt when the coach reaches the relevant method, adapting it to your own idea rather than pasting the whole sequence.

**1. Scope Conversations — choose the listener and context**

```text
I would like to explore the experience of tech-savvy hi-fi enthusiasts listening at home. They choose music as they go and want to start listening immediately, then add upcoming tracks during the session. Help me clarify their goal without assuming the solution.
```

**2. Design Research — distinguish observations from assumptions**

```text
I have not identified a major frustration yet; I am exploring ways to modernize the experience. Treat this as a hypothesis, not validated research. What would we ask or observe to understand how these listeners choose their next tracks?
```

**3. Input Synthesis — frame an opportunity**

```text
Help me turn that context into a focused opportunity: how might we help listeners see what is coming next and adapt the music to their current mood without interrupting playback? Separate what we know from what we still need to learn.
```

**4. Brainstorming — explore contrasting ideas**

```text
Let us explore several approaches before choosing one: a preview of upcoming tracks, a mood filter such as "upbeat songs only", voice controls, or smartwatch interaction. Help me compare these ideas and suggest a contrasting alternative.
```

**5. User Concepts — choose a direction**

```text
For this exploration, I would like to try a mood filter using simple song tags such as "upbeat", "chill", and "lounge". The listener could use a toggle or dropdown. Help me describe the short user journey and the main trade-off.
```

**6. Low-Fidelity Prototypes — sketch the behaviour**

```text
Sketch the interaction in text. Keep the current song playing when the mood changes. Dim and skip only upcoming tracks that do not match, and show a reason such as "Skipped: current mood is upbeat." Help me spot a confusing state in this flow.
```

**7. High-Fidelity Prototypes — plan what to prove**

```text
Do not build a functional prototype yet. Help me plan what one would need to prove. I would enter mood tags manually in song metadata for now; automatic tagging could be a future option. What technical assumptions should we test first?
```

**8. User Testing — prepare a test, not invented results**

```text
Write a short test plan for the mood selector. Include a neutral listening task, what to observe, and questions to ask after about ten minutes of use. Distinguish observed behaviour from direct feedback, and do not invent test results.
```

**9. Iteration at Scale — choose signals and recap**

```text
For a future experiment, consider simple thumbs-up or thumbs-down feedback and the proportion of listening sessions that use the mood filter. Help me define what those signals could tell us and when we should revisit the idea. Then recap what we actually tried, what was only planned, and what remains across all nine methods.
```

The example is a discovery direction, not a request to implement filtering, voice controls, smartwatch integration, or automatic tagging. Keep it in local coaching notes; the shared playlist handoff later in this level remains separate.

</details>

### Step 4: Experiment, challenge, and move between methods

Use the table as a route map, not nine prompts to paste at once. Spend more of your time generating and comparing ideas; keep later implementation and rollout work as plans.

| Method | Small activity you can try | What the shortcut does not establish |
| --- | --- | --- |
| 1. Scope Conversations | Choose a listener and situation; describe what feels difficult. | Stakeholder agreement or validated demand. |
| 2. Design Research | Share an observation, or ask what neutral question you would ask a listener. | Research that nobody conducted. |
| 3. Input Synthesis | Separate observations from assumptions and write a "How might we…" question. | A representative research synthesis. |
| 4. Brainstorming | Add your own ideas, request contrasting alternatives, and resist choosing immediately. | That the first plausible solution is the best one. |
| 5. User Concepts | Choose a concept and describe the listener's short journey and its trade-off. | User validation of that concept. |
| 6. Low-Fidelity Prototypes | Sketch the flow in text or on paper; notice a confusing state. | A working application. |
| 7. High-Fidelity Prototypes | Identify what a functional prototype would need to prove and plan it. | Technical feasibility; no hi-fi prototype is built here. |
| 8. User Testing | Ask a peer to walk through the sketch, or plan a neutral task and observation. | Full Method 8 testing of a functional prototype. |
| 9. Iteration at Scale | Choose a next experiment, success signal, and reason to revisit an earlier method. | Scaled rollout or measured impact. |

Try saying **"Challenge my assumption"**, **"Give me a contrasting idea"**, **"Let's revisit research"**, or **"Next method"**. Before moving on, contribute an answer, decision, sketch, or question of your own. The nine methods are not a one-way checklist: discovering a weak assumption is a reason to revisit an earlier method.

When your timer ends, say **"Timebox: recap what we actually tried and preview what remains."** Do not rush through fabricated research or pretend you completed prototyping just to tick every method. If latency prevents nine interactive stops, keep the recap explicit about guided previews.

<div class="important" data-title="Workshop simulation">

> This is a compressed learning exercise, not validated customer research or a completed nine-method project. A fictional user response is a simulation, a text sketch is low fidelity, and a test plan is not a test result. The learner controls the exploration; the shared implementation contract below is a separate facilitator-owned constraint.

</div>

## Debrief and hand off to the shared implementation slice

Keep your explored concept and learning notes, even if they differ from a playlist. To make Level 3 comparable across the room, everyone implements the same technical slice: browse tracks and add them to **one in-memory playlist**, reject duplicates, show an empty state, and use accessible controls. No users, authentication, persistence, reorder, remove, search, or playlist creation are added in this slice.

This is a workshop delivery boundary, **not the conclusion of your user research**. Map what fits from your concept into the slice and keep other ideas as deferred possibilities. The duplicate-add user experience remains a real choice at Level 3's plan gate.

### Step 1: Separate exploration from the implementation handoff

HVE includes prompts for extending the coaching work beyond this sampler. Type `/dt-` to discover them in your client; Copilot CLI may show the namespaced form `/hve-core:dt-….prompt`.

- **`dt-handoff-problem-space.prompt`** packages completed Methods 1–3 discovery evidence for `/rpi-research`.
- **`dt-handoff-solution-space.prompt`** packages completed Methods 4–6 concept and low-fidelity prototype evidence for `/rpi-research`.
- **`dt-handoff-implementation-space.prompt`** packages completed Methods 7–9 technical, testing, and scaling evidence, plus earlier discovery lineage, for `/rpi-research`.
- **`dt-canonical-deck.prompt`** creates or refreshes a canonical snapshot and can optionally build a presentation from available artifacts.
- **`dt-figma-export.prompt`** exports suitable artifacts to FigJam or Figma for collaborative review; it requires the Figma MCP server and permission to create the external file.

For an Implementation Space handoff, select **`dt-handoff-implementation-space.prompt`** from the prompt picker. Send the command on its own:

```text
/hve-core:dt-handoff-implementation-space.prompt
```

Then supply your actual project slug in a separate message, for example:

```text
Use project slug music-catalog-listening-experience for the Implementation Space handoff.
```

The prompt checks coaching state and readiness before producing a research-ready handoff. **Sampling a method is not completing it:** if no Implementation Space method is complete, resume coaching for a real handoff, or continue with the workshop-only recap below. Do not mark simulated tests or planned prototypes as completed evidence. An eligible handoff produces `handoff-summary-implementation-space.md` in your DT project folder and a research topic under `.copilot-tracking/research/`; it does not start implementation.

For the workshop, keep the following six bullets as the reviewed Level 3 delivery contract, separate from any richer DT handoff:

- **User-visible capability:** browse tracks and add them to one in-memory playlist.
- **API endpoints:** `GET /api/tracks`, `GET /api/playlist`, and `POST /api/playlist/tracks`.
- **Front-end states:** visible catalog, playlist, and empty playlist state.
- **Duplicate handling:** reject duplicate adds with HTTP 409; leave the feedback UX open for the RPI plan gate.
- **Accessibility:** accessible, labelled controls and perceivable status feedback.
- **Out of scope:** users, authentication, persistence, reorder, remove, search, and playlist creation.

Ask the coach to recap the mapping, whether or not the formal handoff was eligible:

```text
Summarize the final decisions for the Music Catalog playlist slice in exactly six bullets:
This is the shared implementation handoff, not a claim that my explored concept was validated.
Use this facilitator-owned contract: browse tracks and add to one in-memory playlist; GET /api/tracks, GET /api/playlist, POST /api/playlist/tracks; reject duplicate adds with HTTP 409; show the empty state; use accessible labelled controls; exclude users, authentication, persistence, reorder, remove, search, and playlist creation.
Leave the duplicate-feedback UX choice open for the RPI plan gate.
Cover capability, endpoints, front-end states, duplicate handling, accessibility, and out-of-scope items.
After those six bullets, add a separate exploration recap: my chosen context/concept, one idea I changed my mind about, deferred ideas, and the nine methods marked sampled, simulated, planned, or not reached. Do not invent any missing session history.
You may create or update local working notes only under .copilot-tracking/. Do not create or modify files elsewhere.
```

Expected result:
- The summary includes browse tracks and add-to-playlist.
- It states duplicate add returns a rejection, not a silent success.
- It states the empty playlist state is visible.
- The separate recap preserves your exploration without treating it as validated research or silently changing the implementation scope.

### Step 2: Review the mapping, not the creativity

Check that the six implementation bullets respect the shared contract. Keep broader ideas in the exploration recap rather than deleting them. Tell the coach where you disagree with its framing and ask it to revise the recap. Name one assumption that would need real research and one next experiment; do not commit invented evidence.

### Step 3: Explore the local coaching notes

DT Coach maintains its working state during the conversation; you do not need to send a separate save prompt. Once it has finished writing, expand `.copilot-tracking` > `dt` > your project folder in VS Code Explorer and inspect what it created.

The example below includes `coaching-state.md`, `sampler-recap.md`, `implementation-handoff.md`, and a Method 8 `test-plan.md`. Your files depend on the conversation and methods visited; these filenames are examples, not a required checklist. Open the coaching state and any recap or method notes that actually exist.

![VS Code Explorer showing project-specific DT coaching state, sampler recap, implementation handoff, and user-testing notes under the local tracking folder](../assets/dt-coach-tracking-folder.png)

If the folder is hidden by your Explorer settings, use **File > Open File** with a path reported by the coach. From a PowerShell terminal at the repository root, you can also list the files:

```powershell
Get-ChildItem .copilot-tracking -Recurse -File | Select-Object FullName, LastWriteTime
git status --short
```

Read the contents, not just the filenames. Check that the coach-generated notes reflect **your listening-experience exploration** and separate observations, assumptions, open questions, planned tests, and any peer feedback. If a recap or implementation handoff exists, check it against the conversation. Use the project folder and modification times to distinguish this session's notes from older tracking files. **You are inspecting the coach's output, not manually creating or saving notes.**

Expected result:
- At least one coach-generated working-state file exists under `.copilot-tracking/` and reflects the conversation; no manual save step is required.
- No application code, tests, or published documentation were changed.
- `git status --short` does not list the tracking files, because the template ignores the folder.

If no files exist, check whether a write permission is still awaiting approval and let the coach finish. Do not create placeholder notes yourself. Do not treat an empty folder or a chat-only answer as persisted state; ask the facilitator if the coach produced no artifacts. If tracking files appear in Git status, resolve the ignore rule in [Curate what you commit](https://github.com/Justrebl/AI-SDLC-Workshop/blob/main/docs/afternoon-2/workshop.md#curate-what-you-commit) before staging anything.

These are **local working notes**, not the deliverable. Later in this level, you will curate a short, reviewed decision record for the repository instead of committing the tracking folder.

![DT decisions summary](assets/l2-dt-decisions.png)

## Extended track: Product Manager with HVE-Core

<div class="info" data-title="Extended track">

> This track adds about 40 minutes. Your facilitator tells you whether the room runs it hands-on, watches it as a demo, or skips it. Level 3 works without it: if you skip it, go to [Curate what you commit](https://github.com/Justrebl/AI-SDLC-Workshop/blob/main/docs/afternoon-2/workshop.md#curate-what-you-commit).

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
| 6 | Execution | **Backlog Manager** or `/backlog-execute` | GitHub issues and sub-issues | **Yes**, after you confirm |
| 7 | Sprint planning | **Backlog Manager** with `/backlog-plan` | A recommended order and dependencies | No, read-only |

Why this order:

- **Why before what.** The BRD states the business need and who benefits. The PRD states what the product does and how to test it. The TPM guide recommends writing the BRD before creating any work item.
- **Planning is separate from writing.** Functional Planner and `/backlog-plan` cannot change the tracker. Only `/backlog-execute` writes to GitHub, and only after you review the handoff and confirm the repository.
- **One owner per role.** In the Business Program Manager guide (beta), a BPM stops at the BRD and user stories, then works with a TPM, who manages the issues. In this track, you play both roles.

<div class="important" data-title="Workshop simulation">

> The role guides and agent behaviour are documented by HVE-Core. The stakeholder facts, the short question rounds, and one person playing both PM roles are a workshop simulation. Agent output still needs your review before it reaches GitHub.

</div>

### Step 1: Prepare your Copilot surface

For this PM track, use **VS Code Copilot Chat in the workshop Codespace or dev container**, with HVE-Core from Level 1. Local VS Code setup without a dev container is deferred.

**Before using the backlog agents, connect the GitHub MCP server and verify its tools are available.** HVE-Core supplies the agents, not your GitHub authorization. This connection is needed for the optional PM track's GitHub operations, not for the core DT brainstorming exercise.

The repository's `.devcontainer.json` adds the **GitHub HTTP MCP server** automatically when the container is created. Do not add another server. If your container predates this configuration, rebuild it.

1. Run **MCP: List Servers**, select `github`, and choose **Start Server** if it is not running.
2. Review any trust prompt and complete GitHub sign-in if requested, using the account that can access your workshop repository.
3. In Copilot Chat, open **Configure Tools** and enable the GitHub tools needed for the backlog exercise.
4. Ask the agent to read your repository's open issues **without changing anything**. An empty list is fine; resolve any connection or permission error before continuing.

The container configures the server, not your permissions. Organization policies still apply, and you must review proposed writes before confirming them. Never paste credentials into chat or repository files. If the server fails to connect, use **Show Output** and share only the redacted error with the facilitator.

To switch agents in Copilot CLI, enter `/agent <agent-name>` using the command shown at each step below. If your plugin exposes a namespaced identifier or the direct name is not recognized, run `/agent` and choose the matching agent from the list. In VS Code, use the agent picker instead.

### Step 2 (facilitator demo, optional): Meeting Analyst

**Meeting Analyst** reads meeting transcripts from Microsoft 365 through the WorkIQ MCP server, extracts requirements, and hands off to PRD Builder. It needs a Microsoft 365 Copilot licence and WorkIQ, and it cannot read a local transcript file.

For this optional demo, run `/agent meeting-analyst` in Copilot CLI, or select **Meeting Analyst** in the VS Code agent picker.

The playlist slice has no real meetings, so attendees skip this step. The stakeholder facts in the next prompt stand in for a transcript.

### Step 3: Write the BRD

In Copilot CLI, run `/agent brd-builder`; in VS Code, select **BRD Builder** in the agent picker. Then copy paste the following prompt:

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
Save the BRD in docs/project-planning/music-catalog-playlist-slice-brd.md and confirm the saved file path.
```

Follow the conversation to work through each BRD section. Use the shared playlist scope as the delivery boundary; mark unknown business facts as assumptions or open questions rather than inventing answers.

<details>
<summary>Toggle example: a step-by-step BRD conversation</summary>

This is a curated example, not a script for manufacturing approval. Send each message separately and wait for the agent's response. The starter above is step 1; do not send it twice. Steps 3–9 restate the supplied facts or clarify their limits: use them only if relevant to the agent's response, and combine them if it asks a grouped question. The three-question limit still applies; these messages are example contributions, not seven required clarifying questions.

**1. Start the BRD process.** Select BRD Builder with `/agent brd-builder` and send the starter prompt above.

**2. Acknowledge the disclaimer after reading it.**

```text
I understand the requirements-planning disclaimer. Continue.
```

**3. Explain the business problem.**

```text
Business problem: Workshop participants need one small, realistic feature to practise a governed agentic SDLC end to end.
```

**4. Identify the stakeholders.**

```text
Stakeholders: The sponsor is the workshop facilitator. Users are workshop participants acting as listeners of a synthetic music catalog. Do not add other stakeholders.
```

**5. State the objective.**

```text
Business objective: A listener can browse the catalog and collect tracks in a single playlist during a session.
```

**6. Confirm the success criteria without claiming they are already achieved.**

```text
Success criteria: Every participant ships the slice with passing tests during the workshop; a duplicate add is rejected with a visible message; the empty playlist state is visible; controls are accessible by role and label. These are acceptance targets, not observed results. Record any unconfirmed measurement details as open questions.
```

**7. Confirm the scope.**

```text
Scope and source: Use the locked Design Thinking decisions for the shared playlist slice, as defined by the facilitator-owned workshop contract. Keep mood filtering and other exploration ideas deferred; do not imply the sampler validated them.
```

**8. Confirm the constraints.**

```text
Constraints: One playlist, in-memory state only, and no users, authentication, persistence, reorder, remove, search, or playlist creation.
```

**9. Record the risks.**

```text
Risks: No additional risk facts were supplied. Mark any proposed risks as assumptions to review, and record unresolved questions without inventing owners, metrics, or dates.
```

**10. Request the reviewed draft as a repository document.**

```text
Draft the BRD from our reviewed answers in docs/project-planning/music-catalog-playlist-slice-brd.md. Separate evidence, assumptions, and open questions, and confirm the saved file path.
```

**11. Review the summary and unresolved items.**

```text
Summarize the BRD in five bullets and list each open question with its target phase. Explain any quality-review findings that prevent a clean sign-off.
```

**12. Approve the handoff only after inspecting the document.** Send this only if you accept the actual review findings:

```text
I have reviewed the saved BRD and approve its handoff to PRD Builder for this workshop POC. Preserve the supplied success criteria and any remaining open questions. Present any required waiver for my explicit approval; this is not production approval or a claim that the success criteria have already been achieved.
```

**13. Inspect the handoff evidence.**

```text
Show the handoff file path and sign-off status. Explain each waiver in one sentence and identify anything that still blocks the handoff.
```

The agent may maintain session and handoff metadata under `.copilot-tracking/`; the shareable BRD belongs in `docs/project-planning/`. A waiver is not a clean pass. If the review identifies unresolved gaps, inspect them and approve any waiver explicitly rather than asking the agent to force a particular status or version. The supplied success criteria remain in the BRD even when their achievement has not yet been demonstrated.

If the agent exceeds the clarification limit, send:

```text
Record unresolved details as open questions and proceed with the draft. Do not invent answers or bypass required review and approval gates.
```

</details>

**Check and share the saved result:** open `docs/project-planning/music-catalog-playlist-slice-brd.md` in Explorer (or the actual path confirmed by the agent). Verify the file exists and contains the reviewed problem, objectives, scope, constraints, risks, and open questions—not just a chat summary. Check that the shared playlist boundary is preserved and no invented metrics or customer validation appear. Ask for corrections before approving the handoff. Share this reviewed document with PRD Builder in Step 4; include it in the curated planning-document commit later in this level, not the private `.copilot-tracking/` session files.

Expected result:
- BRD Builder shows its requirements-planning disclaimer, then creates a BRD such as `docs\project-planning\music-catalog-playlist-slice-brd.md`. The exact file name can differ.
- Objectives and success criteria trace back to the supplied facts, with assumptions and open questions clearly identified.
- Out-of-scope items are listed as out of scope.
- BRD Builder offers a handoff to PRD Builder.

### Step 4: Turn the BRD into a PRD

After reviewing the saved BRD, **explicitly switch to PRD Builder** before sending the next prompt. In Copilot CLI, enter this command as a separate message:

```text
/agent hve-core:prd-builder
```

Confirm that **PRD Builder** is active. If your installation uses an unprefixed name, run `/agent prd-builder` or choose it from `/agent`; in VS Code, select **PRD Builder** in the agent picker. Then send the following prompt to move from the BRD work into product requirements:

```text
Move from the BRD work to a PRD for the Music Catalog playlist slice. Read the reviewed BRD at docs/project-planning/music-catalog-playlist-slice-brd.md, carry forward its constraints and open questions, and save the PRD in docs/project-planning.

Product requirements:
- GET /api/tracks returns the 12 tracks from src/api/Data/tracks.json.
- GET /api/playlist returns the single in-memory playlist.
- POST /api/playlist/tracks adds a track, returns 404 for an unknown id, and returns 409 for a duplicate.
- The front end shows the track list with accessible Add buttons, a playlist panel, the empty-state text "Your playlist is empty. Add a track to get started.", and a visible duplicate message.
- xUnit tests cover the API. Vitest and Testing Library tests cover the UI.

Non-functional requirements: in-memory state only, no new libraries or external services, accessible markup.

Write each requirement with testable acceptance criteria. Ask at most 3 clarifying questions, one at a time.
Before sign-off, show the saved draft path, summarize the scope you derived from the BRD, and highlight any differences or unresolved questions. Wait for my scope confirmation before running validation and requesting final approval.
```

**Validate the scope PRD Builder actually presents.** When the agent shares its draft path and asks you to confirm the scope or proceed with validation and sign-off, open that file first. Compare it with the reviewed BRD and the shared implementation contract: catalog browsing, one in-memory playlist, the three API endpoints, unknown-track and duplicate rejection, visible empty and duplicate states, accessible controls, and API/UI tests. Confirm that users, authentication, persistence, reorder, remove, search, and playlist creation remain excluded. Keep deferred DT ideas out of the delivery scope.

Do not select **Yes** merely because the agent says "scope is unchanged." If the draft matches, send:

```text
I have reviewed the saved PRD and compared the scope you presented with the BRD and shared workshop contract. The scope is aligned. Run validation, show any findings or required waivers, and ask for my final approval before recording sign-off.
```

If the scope differs or the file is missing, select **No** or the freeform answer in the confirmation dialog and explain the correction:

```text
Do not sign off yet. Correct these scope differences against the reviewed BRD and shared workshop contract: <list the differences>. Save the revised PRD and show the updated scope for my review.
```

Review validation findings before giving final approval. A request to sign off as **v1.0.0** is an approval gate, not evidence that validation passed; do not force a version, waive unresolved findings silently, or treat a scope confirmation as blanket approval.

Expected result:
- PRD Builder creates a PRD such as `docs\project-planning\music-catalog-playlist-slice.md`, with functional requirements, acceptance criteria, and non-functional requirements.
- The requirements match the fixed behaviour of Level 3, so the PM and the developer share one contract.
- You inspect the saved draft, explicitly confirm or correct the presented scope, and review validation findings before final sign-off.

Read both documents before you continue. Remove any scope creep. The issues you create next link to these documents.

### Step 5: Plan the GitHub issue hierarchy

Run `/agent functional-planner` in Copilot CLI, or select **Functional Planner** in VS Code. Copy paste the following prompt, replacing `<owner>/<repo>` with your repository and `<your-prd-file>.md` with the reviewed PRD filename confirmed in Step 4:

```text
Plan a GitHub issue hierarchy for <owner>/<repo> from the reviewed playlist PRD at docs/project-planning/<your-prd-file>.md.
Keep this planning-only and prepare the handoff for my review. Do not plan labels, milestones, or assignees.
```

Expected result:
- Functional Planner confirms the repository, reads the existing issues, and writes a planning log and a `handoff.md`. It tells you where they are.
- No new issue is created on GitHub during planning; existing issues may be read.

Open the handoff at the path Functional Planner reports. Review the proposed decomposition, requirement coverage, acceptance criteria, dependencies, and any unresolved findings against your saved PRD. Ask the planner to explain or revise anything that does not fit. There is no prescribed issue count or reference hierarchy to reproduce; the reviewed plan determines what the next step creates.

### Step 6: Create the issues

After reviewing Functional Planner's handoff, **explicitly switch to Backlog Manager**. In Copilot CLI, send this command as a separate message:

```text
/agent hve-core:backlog-manager
```

Confirm that **Backlog Manager** is active. If your installation uses an unprefixed name, run `/agent backlog-manager` or choose it from `/agent`; in VS Code, select **Backlog Manager** in the agent picker. Then send the following prompt, replacing `<owner>/<repo>` with your workshop repository and `<reviewed-handoff-path>` with the path Functional Planner reported:

```text
Execute the plan in the reviewed PRD handoff at <reviewed-handoff-path> and create the corresponding issues in GitHub repository <owner>/<repo>.
```

Expected result:
- Backlog Manager confirms GitHub and your repository, then hands the operations to its GitHub Backlog Executor subagent.
- After you confirm, Backlog Manager creates the approved issues in your repository and reports their URLs. Any planned sub-issue relationships match the reviewed handoff; failures or blocked operations are reported explicitly.
- No issue is assigned to Copilot. Delegation stays a human decision, which you make in Level 5.

<div class="tip" data-title="Write tools missing">

If GitHub write tools are missing, exit the current Copilot CLI session. From a terminal in your workshop repository, start a **fresh session**:

```sh
copilot --enable-all-github-mcp-tools
```

In that new session, use the default agent rather than switching back to the read-only Backlog Manager. Send this command **on its own**:

```text
/backlog-execute
```

Then send a separate prompt, replacing the handoff path and repository:

```text
Run the reviewed plan at <reviewed-handoff-path> and create the corresponding issues in GitHub repository <owner>/<repo>.
```

Review the proposed operations before approving writes. If authentication or write tools are still unavailable, stop and ask the facilitator for help.

</div>

### Step 7: Verify the backlog on GitHub

Run:

```powershell
gh issue list --state open
```

Then open the created issues on GitHub, including any parent tracking issue.

Expected result:
- The created issues match the approved operations in the handoff; reconcile their URLs and count with that plan rather than a fixed number.
- Any planned parent issue shows the expected sub-issues and their progress.

### Step 8: Get a sprint order (read-only)

Run `/agent backlog-manager` in Copilot CLI, or select **Backlog Manager** in VS Code. Send the following command **on its own**, without a mode or task prompt:

```text
/backlog-plan
```

If the short command is not recognized, select **hve-core:backlog-plan** from the slash-command menu. Then send this as a **separate message**, replacing `<owner>/<repo>`:

```text
Use sprint mode to plan the next iteration for <owner>/<repo> from the open playlist slice issues.
Read-only: recommend an implementation order with dependencies and say which issues can be developed in parallel. Do not change any issue.
```

If the agent still reports missing GitHub MCP tools, stop and check the server connection and tool enablement from Step 1; changing the prompt does not grant tool access.

Expected result:
- An order such as the tracks API, then the playlist API, then the front end, with tests alongside each step.
- Nothing changes on GitHub.
- In Level 5, the daily backlog workflow automates this same triage every weekday.

![Sprint planner output showing issue dependencies, recommended implementation order, and parallel work waves](assets/l2-sprint-planner.png)

Example captured during a workshop run. Your issue numbers and ordering will differ. The dependencies shown here come from issue text; they are not enforced by GitHub's structured dependency feature.

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

### Step 1: Write the Design Thinking record

Run `/agent dt-coach` in Copilot CLI, or select **DT Coach** in VS Code. Copy paste the following prompt:

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

### Step 2: Review and commit the deliverables

Read the curated documents before committing: keep the agreed scope, remove personal or raw notes, and do not link to local tracking files. Agent output remains a draft until you approve it.

Stage the reviewed folder by path, not with `git add -A`:

```powershell
git add docs\project-planning
git status
```

In VS Code's Source Control file tree, **Staged Changes should contain only the reviewed files under `docs/project-planning/`**. No `.copilot-tracking/` file should be included. If other files are staged, leave them out of this commit.

The tracking folder stays local and ignored because it contains agent session state, draft reasoning, and potentially sensitive raw notes, not reviewed deliverables. Commit the curated outcomes instead; other readers cannot rely on links to your local working state.

Once the staged tree is correct, commit:

```powershell
git commit -m "Add playlist slice design record, BRD and PRD"
```

HVE-Core references:

- [Install HVE-Core as an extension](https://microsoft.github.io/hve-core/docs/getting-started/methods/extension) and [Setup in the lifecycle guide](https://microsoft.github.io/hve-core/docs/hve-guide/lifecycle/setup): `.copilot-tracking/` is local working state and belongs in `.gitignore`.
- [Copilot tracking instructions](https://github.com/microsoft/hve-core/blob/main/.github/instructions/hve-core/copilot-tracking.instructions.md): what agents write to the tracking folder, and why committed content must not reference it.
- [Context engineering](https://microsoft.github.io/hve-core/docs/rpi/context-engineering): why RPI keeps research and plans as files outside the conversation.
- [Security model](https://microsoft.github.io/hve-core/docs/security/security-model): sensitive meeting content and the gitignore mitigation.
- [Product definition](https://microsoft.github.io/hve-core/docs/hve-guide/lifecycle/product-definition), [TPM guide](https://microsoft.github.io/hve-core/docs/hve-guide/roles/tpm) and [Business Program Manager guide](https://microsoft.github.io/hve-core/docs/hve-guide/roles/business-program-manager): where the BRD and PRD live and who reviews them.
- [Design Thinking](https://microsoft.github.io/hve-core/docs/design-thinking/) and the [agents catalog](https://microsoft.github.io/hve-core/docs/agents/).
- [HVE-Core custom agents](https://github.com/microsoft/hve-core/blob/main/.github/CUSTOM-AGENTS.md) and the [HVE-Core planning documents](https://github.com/microsoft/hve-core/tree/main/docs/planning), as examples of committed, curated planning content.

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
| Phase by phase (this level) | Run `/agent rpi-agent` in Copilot CLI (select **RPI Agent** in VS Code), then run one `/rpi-*` command at a time | Learning RPI, or when you want to check each phase before the next one |
| Full loop | Send `/rpi` alone, then describe the task in a separate message | A well-scoped task you trust the agent to carry through |

With `/rpi`, RPI Agent asks how much control you want, unless your separate task message already says (for example, "use automatic mode"). It offers four choices: run end to end, keep going but check with you on unclear decisions, research and plan with you then stop before implementation, or work through each phase with you. In VS Code, the agent's **Full Auto** button starts the end-to-end choice. It still stops for safety confirmations and blockers. To resume a saved task or start a follow-up from a review finding, send `/rpi` alone, then identify the saved task or finding and your requested action in a separate message.

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

Run `/agent rpi-agent` in Copilot CLI, or select **RPI Agent** in the VS Code agent picker. Send the skill command on its own:

```text
/rpi-research
```

Then send the task prompt as a separate message:

```text
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

Send the skill command on its own:

```text
/rpi-plan
```

Then send the task prompt as a separate message:

```text
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

Send the skill command on its own:

```text
/rpi-implement
```

Then send the task prompt as a separate message:

```text
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
- The RPI flow runs the API and front-end tests to validate the implementation, then checks validation evidence during review and reruns relevant tests after fixes. Check the reported results; a skipped or blocked test run is not a pass.

![Playlist feature implemented locally](assets/l3-playlist-implemented.png)

### Step 2: Run the app

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

### Step 3: Commit implementation checkpoint

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

Send the skill command on its own:

```text
/rpi-review
```

Then send the task prompt as a separate message:

```text
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

### Step 3: Commit review checkpoint

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

Run `/agent adr-creation` in Copilot CLI, or select **ADR Creator** in VS Code. Copy paste the following prompt:

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

Run `/agent code-review` in Copilot CLI, or select **Code Review** in VS Code. Copy paste the following prompt:

```text
Review the local commits for the playlist slice since the initial commit of this workshop repository (the template copy or "Workshop starter" commit).

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

Send the skill command on its own:

```text
/pull-request
```

Then send the preparation request as a separate message:

```text
Prepare a pull request title and description for the committed changes. Do not publish a pull request or push the branch.
```

Expected result:
- The agent reads the committed diff of your branch, runs quick checks on the changed areas, and shows you a pull request title and description.
- This is preparation only: nothing is written to GitHub. You do not push until Level 4, so keep the draft as the description for a pull request you open later.
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

In the summary issue, look at **Can be developed in parallel**. Choose the **Remove a track from the playlist** issue from the parallel group. The instructions in Step 5 are written for it.

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

Open the **Actions** tab and wait for the **CI** run on `main` to pass. Then create a branch ruleset that requires its `test` job on the default branch.

```powershell
gh api --method POST "repos/{owner}/{repo}/rulesets" --input solutions\afternoon-2\rulesets\main-tests-required.json
```

Expected result:
- **Settings > Rules > Rulesets** shows the active ruleset **Tests must pass on main**, which requires the `test` status check.
- Repository administrators are on the bypass list, so your own checkpoint pushes to `main` keep working.
- A pull request, including the one Copilot opens, cannot merge until `test` passes. GitHub documents that Copilot cloud agent is subject to the repository's branch protections and required checks.

<div class="warning" data-title="Workshop shortcut">

> In a real team, keep the bypass list short and audited, and add required reviews.

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

In Copilot CLI, run `/agent music-catalog-test-writer`. Copy paste the following prompt:

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
