---
published: false
type: workshop
title: 'GitHub Copilot Zero to Hero'
short_title: Copilot Zero to Hero
description: Run the official GitHub Copilot hands-on lab, then extend it with Agent Skills, Copilot CLI, and Agent Plugins before moving to agentic SDLC workflows.
level: beginner
authors: [Julien Strebler]
contacts: ['@justrebl']
duration_minutes: 240
tags: github copilot, code completion, copilot chat, agent mode, custom instructions, prompt files, mcp, coding agent, agent skills, copilot cli, plugins
banner_url: assets/banner.png
navigation_levels: 3
navigation_numbering: false
sections_title:
  - 'GitHub Copilot Zero to Hero'
  - 'Setup: Prepare your workshop environment'
  - 'Part 1: GitHub Copilot hands-on lab, Levels 1 to 4'
  - 'Break'
  - 'Part 2: GitHub Copilot hands-on lab, Levels 5 and 6'
  - 'Level 7: Agent Skills'
  - 'Level 8: Copilot CLI'
  - 'Level 9: Agent Plugins and marketplaces'
  - 'Recap: Choose the right primitive'
---

# GitHub Copilot Zero to Hero

*Version 1.2 - September 2026*

Welcome to **GitHub Copilot Zero to Hero**. In this lab you go from your first code suggestion to plugins that bundle a whole team setup. It is the first lab of a two-part series for technical staff in an insurance and reinsurance context. The second lab, **AI SDLC with GitHub and GitHub Copilot**, builds on everything you practise here.

Rather than duplicating existing material, this lab runs the official hands-on lab **[GitHub Copilot, your new AI pair programmer](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/)** (GHCopilotHoL) on its companion application [Philess/gh-copilot-demo](https://github.com/Philess/gh-copilot-demo). This guide gives you the timed route through that lab and adds three short levels for primitives the lab does not cover yet: **Agent Skills**, **Copilot CLI**, and **Agent Plugins**.

During this lab you will:

- Accept and steer code completions.
- Use Copilot Chat to explain, fix, and test code.
- Let agent mode plan and implement a change, then review the diff.
- Shape Copilot with custom instructions, prompt files, MCP servers, and custom agents.
- Delegate a task to Copilot cloud agent on github.com.
- Package task knowledge as an Agent Skill.
- Drive the same primitives from the terminal with Copilot CLI.
- Install, inspect, and remove a plugin from a marketplace.

<div class="warning" data-title="Product evolution">

> GitHub Copilot, VS Code, Copilot CLI, MCP, and Agent Plugins evolve quickly. Copilot coding agent is now documented as **Copilot cloud agent**; the upstream lab may still use the old name. The upstream lab is also maintained independently of this guide. When a screen, label, or step looks different, check the linked documentation and adapt without changing the learning objective.

</div>

## 🎓 Key concepts

This is a quick reminder of what you will practise, not a lecture. Each concept links to its reference documentation.

### Interaction modes

| Mode | What it does | You stay in control by |
| --- | --- | --- |
| [Code completions](https://docs.github.com/en/copilot/concepts/completions/code-suggestions) | Suggests the next lines as you type | Accepting, rejecting, or rewording the comment |
| [Chat](https://code.visualstudio.com/docs/copilot/chat/copilot-chat) | Answers questions with your code as context | Choosing the context you attach |
| [Agent mode](https://code.visualstudio.com/docs/copilot/agents/overview) | Edits files and runs commands to reach a goal | Approving tools and reviewing the diff |
| [Plan](https://code.visualstudio.com/docs/copilot/agents/planning) | Writes a plan before any change | Reviewing the plan before implementation |
| [Copilot CLI](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-copilot-cli) | Runs the agent in your terminal | Approving tools and paths per session |
| [Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent) | Works on an issue in GitHub Actions and opens a pull request | Reviewing and merging the pull request |

The further you go down this table, the more autonomy you hand over, and the more the review step matters.

### Copilot primitives

Primitives are the files that carry your team's context to Copilot:

| Primitive | What it carries | Where it lives |
| --- | --- | --- |
| [Custom instructions](https://docs.github.com/en/copilot/how-tos/configure-custom-instructions/add-repository-instructions) | Always-on conventions | `.github\copilot-instructions.md`, `*.instructions.md` |
| [Prompt files](https://code.visualstudio.com/docs/copilot/customization/prompt-files) | Reusable tasks you invoke by name | `*.prompt.md` |
| [Custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents) | A persona with its own tools and rules | `*.agent.md` |
| [Agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) | Task knowledge loaded on demand | `skills\<name>\SKILL.md` |
| [MCP servers](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) | External tools and data | `mcp.json` |
| [Plugins](https://code.visualstudio.com/docs/copilot/customization/agent-plugins) and [marketplaces](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing) | A bundle of primitives and a catalogue to share it | `plugin.json`, `marketplace.json` |

Principles to keep in mind:

- **Context is the product.** The quality of the output depends on the context that you give. Primitives make that context explicit, reviewable, and versioned.
- **Small, well-scoped tasks win.** Split big asks into steps that you can verify.
- **You own the result.** Copilot proposes; you review, test, and commit.

### What comes next

**AI SDLC with GitHub and GitHub Copilot** reuses these primitives at team and organization scale: HVE-Core for Design Thinking and the Research, Plan, Implement, Review (RPI) workflow, APM to version and govern agent packages, GitHub agentic workflows for backlog automation, and controlled delegation to Copilot cloud agent.

## How to use this guide

You will work in two browser tabs:

1. **This guide**: the order of the blocks, links to the upstream lab, and the extra Levels 7 to 9.
2. **The upstream lab**: the step-by-step content for Levels 1 to 6.

When a section below says **Open upstream Level N**, switch to the lab tab, complete that level, then come back here for the next section.

| Upstream level | Link |
| -------------- | ---- |
| Setup and prerequisites | [GHCopilotHoL, introduction](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/) |
| Level 1: Code Completion | [step 1](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/?step=1) |
| Level 2: Copilot Chat | [step 2](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/?step=2) |
| Level 3: Copilot Agent Basics | [step 3](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/?step=3) |
| Level 4: Copilot Plan & Implement | [step 4](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/?step=4) |
| Level 5: Advanced Copilot Concepts | [step 5](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/?step=5) |
| Level 6: Leveraging agents on the platform | [step 6](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/?step=6) |

## 🚀 Dev Environment Setup

### Requirements

| | |
| --- | --- |
| GitHub account with a Copilot licence | Copilot Business or Enterprise recommended. Copilot cloud agent and plugins may need administrator enablement. |
| A fork of [Philess/gh-copilot-demo](https://github.com/Philess/gh-copilot-demo) | Every option below starts from your fork. |
| A browser | For this guide, the upstream lab, and github.com. |

Complete the [prerequisites and pre-D-Day checks](https://github.com/Justrebl/AI-SDLC-Workshop/blob/main/docs/prerequisites.md) before the session. They cover the licence, VS Code, Docker or Podman, network allowlist, and organization settings.

Fork the demo repository first: open [Philess/gh-copilot-demo](https://github.com/Philess/gh-copilot-demo), select **Fork**, and keep your own account as the owner.

Then choose **one** of the three options below. They are ordered from the fastest to the most hands-on.

### 🥇 Option 1: GitHub Codespaces

Nothing to install. The fork ships a [dev container](https://code.visualstudio.com/docs/devcontainers/containers) with .NET, Node.js, the Copilot extensions, and the project dependencies.

1. In your fork, select **Code** → **Codespaces** → **Create codespace on main**.
2. Wait until `postCreateCommand` prints `Setup complete`.
3. Install Copilot CLI in the Codespace terminal for Levels 8 and 9: `npm install -g @github/copilot`.

<div class="info" data-title="Codespaces usage">

> Codespaces usage is billed by compute and storage, separately from Copilot. Check what applies to your account in [About billing for GitHub Codespaces](https://docs.github.com/en/billing/managing-billing-for-your-products/about-billing-for-github-codespaces). Stop or delete the Codespace at the end of the lab.

</div>

### 🥈 Option 2: Dev container on your machine

Same environment as Option 1, running in Docker on your machine.

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) or a compatible engine, VS Code, and the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
2. Clone your fork and open it in VS Code.
3. Run **Dev Containers: Reopen in Container** from the Command Palette.
4. Install Copilot CLI in the container terminal: `npm install -g @github/copilot`.

### 🥉 Option 3: Local tools

Install the tools yourself, then clone your fork:

| Tool | Why |
| --- | --- |
| [VS Code](https://code.visualstudio.com/) with GitHub Copilot and GitHub Copilot Chat | Levels 1 to 7 and 9 |
| [Git](https://git-scm.com/downloads) | Commit checkpoints |
| [Node.js 22 LTS](https://nodejs.org/) | Upstream front end and Copilot CLI install |
| [.NET SDK](https://dotnet.microsoft.com/download) | Upstream `albums-api`. Use the version listed in the upstream README. |
| [GitHub CLI](https://cli.github.com/) | Sign-in and repository commands |
| [Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli) | Levels 8 and 9 |

<div class="tip" data-title="Recommendation">

> Use **Option 1** unless your organization blocks Codespaces. It removes local setup issues and gives every participant the same environment.

</div>
<div class="important" data-title="Synthetic data only">

> Do not paste customer data, confidential code, credentials, or production telemetry into prompts, issues, or Copilot cloud agent tasks. The demo application uses sample album data only.

</div>

---

# Setup: Prepare your workshop environment

## Topic

You will fork the upstream demo application, open it in Codespaces or locally, and check that Copilot is signed in.

## Follow the upstream setup

### Step 1: Open the upstream introduction

Open the [GHCopilotHoL introduction](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/) and follow these sections:

- **Get Access to GitHub Copilot**.
- **Fork the repository** to fork [Philess/gh-copilot-demo](https://github.com/Philess/gh-copilot-demo) into your own account.
- **OPTION 1: Work with GitHub Codespaces** or **OPTION 2: Work locally**.
- **How to run the code?** Run at least the front end, as the upstream lab requires.

Expected result:
- You own a fork of `gh-copilot-demo`.
- The repository contains `album-viewer`, `albums-api`, `iac`, `legacy`, and `.github`.
- Copilot is signed in in VS Code or in your Codespace.

### Step 2: Create a baseline checkpoint

Open a terminal at the repository root. Run:

```powershell
git status
git checkout -b afternoon-1
```

Expected result:
- Your working tree is clean.
- You work on a dedicated branch, so you can compare or reset at any time.

<div class="tip" data-title="Two tabs">

> Keep this guide open in one tab and the upstream lab in another. This guide tells you when to switch.

</div>

---

# Part 1: GitHub Copilot hands-on lab, Levels 1 to 4

## Topic

You will learn completions, Chat, agent mode, and the plan-then-implement loop using the upstream lab.

## Open upstream Level 1: Code Completion

Open [Level 1](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/?step=1).

Focus on:
- Ghost text and accepting suggestions.
- Comment-driven generation.
- **Big tasks vs small tasks**: why smaller, well-scoped prompts produce better results.

The side quests on commit messages and documentation are optional.

## Open upstream Level 2: Copilot Chat

Open [Level 2](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/?step=2).

Focus on:
- Chat participants, context variables, and slash commands.
- Everyday tasks: explaining, fixing, and testing code.

## Open upstream Level 3: Copilot Agent Basics

Open [Level 3](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/?step=3).

Focus on:
- When agent mode edits files and runs commands.
- Reviewing the diff before keeping changes.

## Open upstream Level 4: Copilot Plan & Implement

Open [Level 4](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/?step=4).

Focus on:
- Planning before implementing.
- The Code Review agent.

<div class="info" data-title="Link to AI SDLC with GitHub and GitHub Copilot">

> The plan-then-implement loop you practice here becomes the full **Research, Plan, Implement, Review** (RPI) workflow in **AI SDLC with GitHub and GitHub Copilot**.

</div>

## Commit checkpoint

Run from the repository root:

```powershell
git status
git add -A; git commit -m "Complete upstream Levels 1 to 4"
```

---

# Break

Before the break, make sure your working tree is committed. After the break, you will move to repository-level customization, MCP, and agents on github.com.

---

# Part 2: GitHub Copilot hands-on lab, Levels 5 and 6

## Topic

You will customize Copilot for the repository and delegate work to agents on github.com.

## Open upstream Level 5: Advanced Copilot Concepts

Open [Level 5](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/?step=5).

Focus on:
- **Custom Instructions**: `.github/copilot-instructions.md` and path-specific instructions.
- **Build your prompts library**: reusable prompt files and custom agent definitions.
- **Advanced Context Manipulations**: adding tools and context through MCP servers.

Prompt engineering techniques are a short read; skim them if time is tight.

## Open upstream Level 6: Leveraging agents on the platform

Open [Level 6](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/?step=6).

Focus on:
- Assigning an issue to Copilot cloud agent and reviewing its pull request.
- Using your custom agents on github.com.

<div class="warning" data-title="Copilot cloud agent availability">

> Copilot cloud agent needs a supported plan and may need to be enabled by an administrator. If it is not available in your account, follow along with the facilitator's demo and continue.

</div>

## Commit checkpoint

Pull any merged Copilot cloud agent changes, then run:

```powershell
git status
git add -A; git commit -m "Complete upstream Levels 5 and 6"
```

---

# Level 7: Agent Skills

## Topic

You will package reusable procedural knowledge as an Agent Skill in your fork and see Copilot load it on demand. Official docs:
- https://code.visualstudio.com/docs/copilot/customization/agent-skills
- https://docs.github.com/en/copilot/concepts/agents/about-agent-skills

## What is an Agent Skill?

A custom agent defines **who** is working: a role, tools, and behavior. An Agent Skill defines **how** to do a specific task: a folder containing a `SKILL.md` file, plus optional scripts or templates. Copilot reads the skill's `description` and loads the full content only when the task matches. This keeps context small until the knowledge is needed.

| Primitive | Loaded when | Good for |
| --------- | ----------- | -------- |
| Custom instructions | Always, or by file path | Stable conventions |
| Prompt files | When you invoke them | Repeatable requests |
| Custom agents | When you select them | Roles and tool boundaries |
| Agent Skills | When the task matches the description | Procedures and domain know-how |

## Create an albums-api endpoint skill

### Step 1: Create the skill folder

At the root of your fork, create the folder:

```text
.github\skills\albums-api-endpoint
```

### Step 2: Create the skill file

Create `.github\skills\albums-api-endpoint\SKILL.md` with this content:

```markdown
---
name: albums-api-endpoint
description: Add or change an HTTP endpoint in the albums-api .NET project. Use when asked to create, modify, or document an albums-api route.
---

## Albums API endpoint procedure

1. Read `albums-api/Controllers` and follow the existing controller style.
2. Keep models in `albums-api/Models`. Do not add a database; the sample data stays in memory.
3. Return typed results and appropriate status codes (200, 201, 400, 404).
4. After the change, run `dotnet build` from `albums-api` and report the result.
5. Summarize the new route, its verb, and an example `curl` call.
```

Expected result:
- The skill is a folder with a `SKILL.md` file, committed with the repository.

### Step 3: Use the skill from Chat

Open Copilot Chat in **Agent** mode. Copy paste the following prompt:

```text
Add a GET endpoint to albums-api that returns the number of albums. Follow the repository conventions.
```

Expected result:
- Copilot loads the `albums-api-endpoint` skill. Check the references or tool calls in the response.
- The change follows the five steps of the skill, including `dotnet build` and a `curl` example.

<div class="tip" data-title="Skill not picked up?">

> Skills are matched by their `description`. If Copilot does not load it, make the description more specific, or mention "use the albums-api-endpoint skill" in your prompt. Check that your VS Code version supports Agent Skills.

</div>

## Commit checkpoint

Review the diff, then run:

```powershell
git status
git add -A; git commit -m "Add albums-api endpoint skill"
```

---

# Level 8: Copilot CLI

## Topic

You will use GitHub Copilot CLI from the repository root. You will trust the folder, sign in, explain the repository, inspect model selection, make a change, use shell escape, reuse your custom agent and skill, and try programmatic mode carefully. Official docs:
- https://docs.github.com/en/copilot/how-tos/copilot-cli

![Copilot CLI in terminal](assets/level8-cli-start.png)

## Install and start the CLI

### Step 1: Install the CLI

If the CLI is not installed yet, run:

```powershell
npm install -g @github/copilot
```

Expected result:
- The `copilot` command is available in a new terminal.

### Step 2: Start from the repository root

Open a terminal at the root of your fork. Run:

```powershell
copilot
```

Expected result:
- The CLI opens an interactive session.
- You may be asked to trust the folder.

### Step 3: Trust the folder

Trust the folder only if it is your workshop fork.

<div class="warning" data-title="Folder trust">

> Trusting a folder allows the CLI to read files and, with your approval, run tools in that workspace. Do not trust random downloaded repositories.

</div>

## Sign in and inspect help

### Step 1: Sign in

In the CLI session, run:

```text
/login
```

Complete the browser authentication flow if prompted.

### Step 2: Open help

Run:

```text
/help
```

Expected result:
- The CLI lists available commands for your installed version. Use `/help` as the source of truth, since commands can change.

### Step 3: Check usage

Run:

```text
/usage
```

Expected result:
- The CLI shows the usage information available to your account and plan.

<div class="info" data-title="Usage units">

> Copilot usage is measured in units that depend on the experience and on your plan. **AI SDLC with GitHub and GitHub Copilot** covers how to read them. Do not compare CLI and VS Code usage without checking which unit each one reports.

</div>

## Ask the CLI to explain the repository

Copy paste the following prompt:

```text
Explain this repository in ten bullets. Include the front end, the albums API, the infrastructure folder, the legacy folder, and the commands to run the app. Do not modify files.
```

Expected result:
- The CLI mentions `album-viewer`, `albums-api`, `iac`, and `legacy`.
- It does not change any file.

![CLI repository explanation](assets/level8-cli-explain.png)

## Choose a model

In the CLI, run:

```text
/model
```

Expected result:
- The CLI shows the models available to your account. Availability depends on your plan and organization policy.

Keep the default or choose the model your facilitator recommends. Model comparison and Auto selection are covered in **AI SDLC with GitHub and GitHub Copilot**.

## Make a change from the CLI

### Step 1: Reuse your skill

Copy paste the following prompt:

```text
Add a GET endpoint to albums-api that returns albums filtered by artist name. Use the albums-api-endpoint skill. Do not change existing endpoints.
```

Expected result:
- The CLI asks for permission before editing files or running commands.
- It uses the skill you created in Level 7 and runs `dotnet build`.

### Step 2: Use shell escape

In the CLI, run:

```text
! git status --short
```

Expected result:
- The CLI prints the Git status without leaving the session.

### Step 3: Select a custom agent

Run:

```text
/agent
```

Select one of the custom agents you created in upstream Level 5 or 6, if listed. Ask it a short, read-only question about the change you just made.

Expected result:
- The CLI uses the same repository agents, instructions, and skills as VS Code.

<div class="tip" data-title="One set of customizations">

> Instructions, prompt files, agents, and skills committed in `.github` are shared by VS Code, the CLI, and agents on github.com when the surface supports them. Commit them so the whole team gets the same behavior.

</div>

## Programmatic mode

The CLI can run one prompt non-interactively with `-p`. Exit the interactive session, then run a read-only prompt:

```powershell
copilot -p "List the commands needed to build and run this repository. Do not edit files."
```

Expected result:
- The CLI prints a summary and exits.

<div class="warning" data-title="Tool allow flags">

> Programmatic mode is useful in scripts and pipelines. Documented flags such as `--allow-tool` and `--allow-all-tools` widen what the CLI may do without asking. Prefer the narrowest permission, and avoid `--allow-all-tools` unless the repository is trusted and your organization policy allows it.

</div>

## Commit checkpoint

Review the diff, then run:

```powershell
git status
git add -A; git commit -m "Add artist filter endpoint from Copilot CLI"
```

---

# Level 9: Agent Plugins and marketplaces

## Topic

You will learn what Agent Plugins bundle, browse a plugin marketplace from the CLI and from VS Code, install and inspect one plugin, then uninstall it. Official docs:
- https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing
- https://code.visualstudio.com/docs/copilot/customization/agent-plugins

![Agent Plugins marketplace](assets/level9-plugin-marketplace.png)

## What are Agent Plugins?

You created customizations one file at a time today. A plugin **bundles** them so a team can share them:

- Custom agents.
- Agent Skills.
- Prompt files.
- Hooks.
- MCP server configuration.

A **marketplace** is a GitHub repository that lists plugins. **AI SDLC with GitHub and GitHub Copilot** uses the HVE-Core marketplace and a repository-owned APM package to share an entire methodology.

<div class="warning" data-title="Hooks and MCP can run code">

> Treat plugins like code dependencies. Inspect what they add before trusting them. Hooks and MCP server configuration can execute commands or connect external tools.

</div>

## Browse and install from the CLI

### Step 1: List marketplaces

Run:

```powershell
copilot plugin marketplace list
```

Expected result:
- The CLI lists the configured marketplaces, such as `github/copilot-plugins` or `github/awesome-copilot`, depending on your version.

### Step 2: Browse a marketplace

Run, replacing the name with one from the previous list:

```powershell
copilot plugin marketplace browse <marketplace-name>
```

Pick one small plugin that does not request secrets or broad system access.

### Step 3: Install and inspect

Run:

```powershell
copilot plugin install <plugin>@<marketplace-name>
copilot plugin list
```

Then start `copilot` and copy paste the following prompt:

```text
Explain what the installed plugin added to my Copilot environment. Focus on agents, skills, prompts, hooks, and MCP configuration. Do not run plugin tools or modify files.
```

Expected result:
- You can name each asset the plugin added.

### Step 4: Uninstall

Exit the CLI and run:

```powershell
copilot plugin uninstall <plugin>
```

Expected result:
- Your environment returns to the repository customizations you created today.

## Browse from VS Code

In VS Code, open the Extensions view and search:

```text
@agentPlugins
```

Expected result:
- VS Code lists agent plugins from the configured marketplaces. If nothing appears, your build may require enabling the `chat.plugins.enabled` setting, or plugins may not be available for your account yet.

<div class="tip" data-title="Why uninstall?">

> Uninstalling keeps all participants aligned for **AI SDLC with GitHub and GitHub Copilot**. In real projects, keep only approved plugins and record why the team uses them. The second lab shows how APM and policies make that decision versioned and auditable.

</div>

---

# Recap: Choose the right primitive

## What you practiced

Today you used GitHub Copilot as a layered toolchain rather than one feature. You started with completions and Chat, moved to agent mode and plan-then-implement, stored durable guidance in instructions and prompt files, connected tools through MCP, delegated to Copilot cloud agent, packaged know-how as an Agent Skill, reused it from the CLI, and inspected how plugins bundle everything for sharing.

## Primitive selection table

| Primitive | Where it lives | When to use | Covered in |
| --------- | -------------- | ----------- | ---------- |
| Code completion | Editor | Fast local suggestions while you type | Upstream Level 1 |
| Copilot Chat | VS Code Chat | Explanations, fixes, and tests | Upstream Level 2 |
| Agent mode | VS Code Chat | Multi-file changes with commands | Upstream Level 3 |
| Plan, then implement | VS Code Chat | Scoping work before editing | Upstream Level 4 |
| Custom instructions | `.github` folder | Stable team conventions | Upstream Level 5 |
| Prompt files | `.github\prompts` | Repeatable requests | Upstream Level 5 |
| MCP servers | MCP configuration | External tools and context | Upstream Level 5 |
| Copilot cloud agent and custom agents | github.com | Asynchronous delegated work | Upstream Level 6 |
| Agent Skills | `.github\skills` | Procedures loaded on demand | Level 7 |
| Copilot CLI | Terminal | Repository work without leaving the shell | Level 8 |
| Agent Plugins | CLI or VS Code | Sharing bundles of customizations | Level 9 |

<div class="important" data-title="The operating model">

> The professional workflow is not "ask Copilot to do everything". It is: scope the task, provide the right context, choose the smallest capable primitive, review changes, validate, and commit a clean checkpoint.

</div>

## What is next

**AI SDLC with GitHub and GitHub Copilot** moves from primitives to a governed agentic SDLC on a new application: a **Music Catalog** mono-repo with a React + TypeScript front end in `src/front` and a .NET 10 API in `src/api`. The application changes because the second lab needs a repository that you copy and fully own, with tests and a Copilot cloud agent setup ready for HVE-Core, Design Thinking, RPI, APM policies, agentic workflows, and Copilot cloud agent delegation.

Continue with [AI SDLC with GitHub and GitHub Copilot](../afternoon-2/workshop.md).

## Help us improve this Workshop

If you have feedback on this guide, open an issue in [Justrebl/AI-SDLC-Workshop](https://github.com/Justrebl/AI-SDLC-Workshop/issues). For feedback on the upstream lab, use [Philess/GHCopilotHoL](https://github.com/Philess/GHCopilotHoL/issues). To propose a fix, see [CONTRIBUTING.md](https://github.com/Justrebl/AI-SDLC-Workshop/blob/main/CONTRIBUTING.md).
