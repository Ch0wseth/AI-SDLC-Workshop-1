---
published: false
type: workshop
title: 'Agentic SDLC with GitHub Copilot — Afternoon 1: Copilot primitives'
short_title: Copilot primitives
description: Discover the GitHub Copilot primitives used by modern development teams before moving to agentic SDLC workflows.
level: beginner
authors: [Julien Strebler]
contacts: ['@justrebl']
duration_minutes: 240
tags: github copilot, agent mode, custom instructions, prompt files, custom agents, agent skills, mcp, copilot cli, plugins
banner_url: assets/banner.png
navigation_levels: 3
navigation_numbering: false
sections_title:
  - Agentic SDLC with GitHub Copilot — Afternoon 1: Copilot primitives
  - Setup: Prepare your workshop environment
  - Level 1: Code completions and Next Edit Suggestions
  - Level 2: Copilot Chat
  - Level 3: Custom instructions and prompt files
  - Break
  - Level 4: Custom agents and Agent Skills
  - Level 5: Model Context Protocol servers
  - Level 6: Copilot CLI
  - Level 7: Plugins and the Copilot App
  - Recap: Choose the right primitive
  - Extra Credits 🪙
---

# Agentic SDLC with GitHub Copilot — Afternoon 1: Copilot primitives

*Version 1.0 - September 2026*

The goal of this workshop is to learn the GitHub Copilot primitives that a development team can use before moving into advanced agentic SDLC practices. You will work in a small music catalog starter repository with a React front end, a .NET minimal API, and tests. You will practice completions, Chat, instructions, prompt files, custom agents, Agent Skills, MCP, Copilot CLI, plugins, and a short Copilot App tour. This is **Afternoon 1** of a two-afternoon series for technical staff in an insurance and reinsurance context. Afternoon 2 builds on these primitives with HVE-Core, Design Thinking, RPI, APM, agentic workflows, Coding Agent, and a dedicated music catalog feature. To keep both afternoons complementary, this workshop intentionally uses small non-overlapping tasks: a health endpoint, a footer component, unit tests, a README section, and a tiny refactor.

<div class="warning" data-title="Product evolution">

> GitHub Copilot, VS Code, Copilot CLI, MCP, Agent Plugins, and Copilot App evolve quickly. Screens, labels, commands, and availability may change after this workshop is written. When a feature looks different, check the current documentation linked in the relevant section and adapt without changing the learning objective.

</div>

## Minimal Pre-requisites

These are the minimal pre-requisites to run this workshop locally with the starter mono-repo.

|                                  |                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| GitHub account with Copilot licence | Business or Enterprise recommended for this workshop; some features need administrator policy enablement. |
| VS Code latest + GitHub Copilot Chat | Install the latest Visual Studio Code and the GitHub Copilot / GitHub Copilot Chat extensions.           |
| Git                             | Install Git and make sure you can clone and commit locally.                                               |
| Node.js 22 LTS                  | Required for the Vite + React front end and the Copilot CLI package installation.                         |
| .NET 10 SDK                     | Required for the minimal API and xUnit integration tests.                                                 |
| GitHub CLI                      | Required for repository authentication and useful validation commands.                                    |
| Copilot CLI                     | Install with npm install globally for the GitHub Copilot CLI package.                                    |
| GitHub org/account              | You need an account or organization where you can create repositories from a template.                    |

<div class="info" data-title="Repository shape">

> The starter repository is a template mono-repo. The front end lives in `src/front` and uses Vite, React 19, TypeScript 5.8, and Vitest. The API lives in `src/api` and uses .NET 10 minimal APIs on port 5080. The API currently serves `GET /api/hello`. API tests live in `tests/api` and use xUnit with `WebApplicationFactory`. The solution file is `MusicCatalog.slnx`.

</div>

<div class="important" data-title="Workshop boundary">

> Afternoon 1 must not implement track browsing or a playlist. The repository contains sample music data, but those features are reserved for Afternoon 2. If Copilot suggests using track listing or playlist behavior today, reject that part and keep the scope on the small primitives exercises.

</div>

---

# Setup: Prepare your workshop environment

You have **15 minutes** for this setup section.
## Topic

You will create your own repository from the template, clone it, run both applications, open the workspace in VS Code, and sign in to GitHub Copilot.

![Template repository use button](assets/setup-use-template.png)
## Create your repository from the template

### Step 1: Open the template repository
Go to the workshop template repository shared by your facilitator. Use the GitHub **Use this template** button rather than forking. This gives you a clean starting point where you can commit freely during the workshop.
### Step 2: Create your own repository
Choose your GitHub account or organization. Name the repository something easy to recognize, for example `music-catalog-copilot-afternoon-1`. Keep the repository private or internal if your organization requires it. Wait until GitHub finishes creating the repository.

![Template repository creation form](assets/setup-create-repo.png)
### Step 3: Clone the repository locally
Open PowerShell in the folder where you keep your workshop code. Run the following commands, replacing the URL with your repository URL.
```powershell
git clone https://github.com/<owner>/<repo>.git
cd <repo>
```

<div class="tip" data-title="Windows PowerShell 5">

> This workshop uses semicolons between commands when a single line is helpful. Windows PowerShell 5 does not support the `&&` operator. If a command fails, stop and read the error before running the next command.

</div>

## Run the API

### Step 1: Start the .NET minimal API
Open a terminal at the repository root. Run:
```powershell
cd src\api
dotnet run
```
Expected result:
- The API starts on port 5080.
- The `/api/hello` endpoint is available.
- The terminal stays busy because the API is running.

![API running in terminal](assets/setup-api-running.png)
### Step 2: Validate the API
Open a second terminal. Run:
```powershell
curl http://localhost:5080/api/hello
```
Expected result:
```json
{"message":"Hello from the Music Catalog API"}
```
If the port is already in use, stop the process that owns it or ask your facilitator for help.
## Run the front end

### Step 1: Install dependencies
Open a new terminal at the repository root. Run:
```powershell
cd src\front
npm install
```
Expected result:
- npm restores the Vite, React, TypeScript, and Vitest dependencies.
- You may see audit information from npm; do not change dependencies during the workshop unless instructed.
### Step 2: Start Vite
Run:
```powershell
npm run dev
```
Expected result:
- Vite starts on port 5173.
- The front end proxy forwards `/api` calls to `http://localhost:5080`.
Open the local URL shown by Vite. You should see the Music Catalog page and the greeting returned by the API.

![Front end running in browser](assets/setup-front-running.png)
## Open the workspace in VS Code

### Step 1: Open the repository root
From the repository root, run:
```powershell
code .
```
Alternatively, use **File > Open Folder** in VS Code and select the repository root.
### Step 2: Sign in to GitHub and Copilot
In VS Code, make sure you are signed in to GitHub. Open the Copilot menu from the title bar or the Accounts icon. Confirm that GitHub Copilot Chat is enabled.

![VS Code Copilot signed in](assets/setup-copilot-signed-in.png)

<div class="warning" data-title="Policy checks">

> Some Copilot capabilities are controlled by your organization or enterprise policies. If a button or feature is missing, check with your GitHub administrator and continue with the closest available alternative.

</div>

## Validate the starting point

### Step 1: Run front-end tests
Stop the front-end dev server if you need the terminal, or open a new terminal. Run:
```powershell
cd src\front
npm test
```
Expected result:
- The Vitest suite passes.
- The existing `App` test confirms the API greeting is rendered.
### Step 2: Run API tests
Open a terminal at the repository root. Run:
```powershell
dotnet test
```
Expected result:
- The xUnit test suite passes.
- The existing test confirms `GET /api/hello` returns the greeting.
### Step 3: Commit checkpoint
If your repository starts with no commits after template creation, create a baseline commit. Run:
```powershell
git status
git add -A; git commit -m "Baseline workshop setup"
```
Expected result:
- Your working tree is clean.
- You have a known checkpoint before the exercises.

---

# Level 1: Code completions and Next Edit Suggestions

You have **20 minutes** for this level.
## Topic

You will use inline completions and Next Edit Suggestions to add a small `/api/health` endpoint to the .NET API. You will also practice comment-driven completion and a tiny rename refactor.

![Copilot inline completion in Program.cs](assets/level1-inline-completion.png)
## Start with ghost text

GitHub Copilot completions appear as ghost text directly in the editor. You can accept the current suggestion with `Tab`. You can reject it with `Esc`. You can keep typing to steer the suggestion.

<div class="info" data-title="Small prompts work best">

> Inline completion is optimized for local, fast assistance. Keep the task small, keep nearby code clean, and review every suggestion before accepting it.

</div>

## Add a health endpoint

### Step 1: Open the API entry point
Open `src/api/Program.cs`. You should see the existing minimal API route for `/api/hello`. Do not touch the front end for this exercise.
### Step 2: Add a comment prompt
Place your cursor after the existing `/api/hello` route. Copy paste the following prompt:
```text
// Add a GET /api/health endpoint that returns JSON with status set to ok.
```
Wait for Copilot to propose a completion. If the suggestion maps the endpoint as `/api/health` and returns an object with `status = "ok"`, accept it. If the suggestion is different, edit it manually. A valid result should look similar to:
```csharp
app.MapGet("/api/health", () => new { status = "ok" });
```

<div class="important" data-title="Review before accepting">

> Copilot may use slightly different formatting or property casing. For this workshop, keep the JSON property as `status` and the value as `ok`.

</div>

### Step 3: Run the API
Run:
```powershell
cd src\api
dotnet run
```
In another terminal, validate the endpoint:
```powershell
curl http://localhost:5080/api/health
```
Expected result:
```json
{"status":"ok"}
```
### Step 4: Add an API test with completion
Open `tests/api/HelloEndpointTests.cs`. Place your cursor after the existing test. Copy paste the following prompt:
```text
// Add a test that calls /api/health and asserts that status is ok.
```
Review the generated test. If Copilot creates a new record type, keep it near the existing `Hello` record. If Copilot duplicates too much code, simplify it. A good test should:
- Create a client from the factory.
- Call `/api/health`.
- Deserialize the JSON response.
- Assert the status value.
### Step 5: Validate the API tests
Run:
```powershell
dotnet test
```
Expected result:
- The existing hello endpoint test still passes.
- The new health endpoint test passes.
## Practice Next Edit Suggestions

### Step 1: Rename the local result type
In the health endpoint test, rename a generated record from `Health` to `HealthResponse`. Watch whether Copilot shows a Next Edit Suggestion in the usages. Accept the suggestion only if it updates the matching usage correctly.

![Next Edit Suggestion rename](assets/level1-nes-rename.png)
### Step 2: Rename a variable
Rename a local variable such as `health` to `healthResponse`. Again, watch for Next Edit Suggestions. If the suggestion is correct, accept it. If it is not correct, use VS Code rename refactoring instead.

<div class="tip" data-title="Copilot plus IDE tools">

> Copilot is not a replacement for compiler checks and IDE refactorings. Use Copilot suggestions when they help, and use built-in rename refactoring when you need deterministic symbol updates.

</div>

## Expected result

At the end of this level:
- `GET /api/health` returns `{ "status": "ok" }`.
- API tests cover both `/api/hello` and `/api/health`.
- You have seen Copilot inline completion and Next Edit Suggestions on a small C# change.
## Validate

Run:
```powershell
dotnet test
```
Optionally keep the API running and call:
```powershell
curl http://localhost:5080/api/health
```
## Commit checkpoint

Run from the repository root:
```powershell
git status
git add -A; git commit -m "Add API health endpoint"
```

---

# Level 2: Copilot Chat

You have **35 minutes** for this level.
## Topic

You will use GitHub Copilot Chat in VS Code to understand the repository, compare Ask, Plan, and Agent modes, use context references, use slash commands, and let Agent add a small `Footer` React component with a Vitest test.

![Copilot Chat mode picker](assets/level2-chat-modes.png)
## Understand the chat modes

VS Code Copilot Chat offers built-in modes that may evolve over time. At the time of writing, the important modes for this workshop are:
- **Ask** for questions, explanations, and guidance.
- **Plan** for a structured implementation plan before code changes.
- **Agent** for making changes, running commands, and iterating.

<div class="warning" data-title="Edit mode evolution">

> Some older documentation and screenshots mention Edit mode. GitHub and VS Code are evolving the experience, and Edit mode is being deprecated in favor of Agent in some contexts. Check the current VS Code and GitHub Copilot documentation during delivery if your UI differs.

</div>

## Ask mode: explain the codebase

### Step 1: Open Chat
Open GitHub Copilot Chat in VS Code. Select **Ask** mode.
### Step 2: Ask about the repository
Copy paste the following prompt in the Chat:
```text
#codebase Explain the architecture of this repository in five bullets. Include the API project, the front-end project, the tests, and how the front end reaches the API during local development.

```
Expected result:
- Copilot identifies the React front end in `src/front`.
- Copilot identifies the .NET minimal API in `src/api`.
- Copilot identifies the API tests in `tests/api`.
- Copilot mentions the Vite proxy from `/api` to port 5080.
### Step 3: Ask with a file reference
Open `src/front/src/App.tsx`. Copy paste the following prompt in the Chat:
```text
#file:src/front/src/App.tsx /explain Explain how the current App component fetches and renders the API greeting. Keep the explanation beginner friendly.

```
Expected result:
- Copilot explains `useEffect`.
- Copilot explains the `fetch('/api/hello')` call.
- Copilot explains the loading, error, and success states.

![Chat file context](assets/level2-file-context.png)
## Slash commands

### Step 1: Use `/tests`
Select the body of the `App` component in `src/front/src/App.tsx`. Copy paste the following prompt in the Chat:
```text
/tests Based on the selected component, suggest the most important Vitest and Testing Library test cases. Do not edit files yet.
```
Expected result:
- Copilot proposes tests for loading, success, and error behavior.
- Copilot does not modify files in Ask mode.
### Step 2: Use `/fix`
Temporarily select a small area of code that you understand. Copy paste the following prompt in the Chat:
```text
/fix Review the selected code for obvious bugs or readability problems. Do not make changes; only explain what you would change.
```
Expected result:
- Copilot gives suggestions.
- You decide which suggestions are useful.

<div class="tip" data-title="Ask before Agent">

> For a new codebase, use Ask mode first. You get a low-risk explanation before asking Agent mode to modify files.

</div>

## Model picker and Auto

### Step 1: Open the model picker
In Chat, open the model picker. Your available models depend on your license, IDE version, and organization policy. You may see **Auto**, which lets Copilot select a model for the task. Read the official explanation at https://docs.github.com/en/copilot/concepts/auto-model-selection.

<div class="important" data-title="No cost assumptions">

> Do not assume Auto is the cheapest, fastest, or best option. Treat it as a convenience feature whose behavior is documented by GitHub and governed by your organization policies.

</div>

![Model picker with Auto](assets/level2-model-picker.png)
## Plan mode: prepare a small UI change

### Step 1: Select Plan mode
Open a new Chat session if you want a clean conversation. Select **Plan** mode.
### Step 2: Ask for a plan
Copy paste the following prompt in the Chat:
```text
#codebase Plan a small change that adds a Footer component to the React app. The footer should render the text "Built with GitHub Copilot". Include the files to edit, the tests to add, and the validation commands. Do not implement the change.

```
Expected result:
- Copilot proposes a small plan.
- The plan should mention `src/front/src` files.
- The plan should mention Vitest validation.
Review the plan before moving to Agent mode.
## Agent mode: implement the footer

### Step 1: Select Agent mode
Switch to **Agent** mode. Keep the scope small.
### Step 2: Ask Agent to implement
Copy paste the following prompt in the Chat:
```text
#codebase Add a small Footer React component without changing the API. Requirements:

- Create a Footer component that renders "Built with GitHub Copilot".
- Render it below the existing Music Catalog content.
- Add or update Vitest tests so the footer text is verified.
- Run the front-end test command and fix only issues caused by this change.
- Do not implement track listing, search, or playlist functionality.
```
Expected result:
- Agent edits the React front end.
- Agent adds or updates a test.
- Agent may run `npm test` from `src/front`.
- The page still renders the API greeting.

![Agent edits footer component](assets/level2-agent-footer.png)

<div class="warning" data-title="Keep the scope small">

> If Agent starts implementing track browsing, playlist behavior, or unrelated styling, stop it and restate the scope. Those features belong to Afternoon 2.

</div>

### Step 3: Review the diff
Open the Source Control view. Review every changed file. Check that the change is limited to the footer component and tests. Do not accept changes you cannot explain.
### Step 4: Validate
Run:
```powershell
cd src\front
npm test
```
Expected result:
- Vitest passes.
- The footer text test passes.
### Step 5: Run the app
Run the API and front end if they are not already running. Open the browser. Expected result:
- The existing greeting still appears.
- The footer text appears below the main content.

![Footer rendered in app](assets/level2-footer-rendered.png)
## Commit checkpoint

Run from the repository root:
```powershell
git status
git add -A; git commit -m "Add footer component"
```

---

# Level 3: Custom instructions and prompt files

You have **30 minutes** for this level.
## Topic

You will customize Copilot with repository instructions, path-specific instructions, and a reusable prompt file. You will inspect the existing `.github/copilot-instructions.md` if the template includes one, extend it, create an API-specific instruction file, and create an `/add-endpoint` prompt file. Official docs:
- https://code.visualstudio.com/docs/copilot/customization/custom-instructions
- https://code.visualstudio.com/docs/copilot/customization/prompt-files

![Custom instructions folder](assets/level3-instructions-folder.png)
## Understand instruction layers

Instructions are durable guidance that Copilot can apply to future requests. Common layers include:
- Repository-wide instructions in `.github/copilot-instructions.md`.
- Path-specific instruction files in `.github/instructions`.
- Prompt files in `.github/prompts` that can be invoked as slash commands.

<div class="info" data-title="Instructions are not magic">

> Instructions improve consistency, but they do not remove the need to review generated code, run tests, and keep prompts scoped.

</div>

## Extend repository instructions

### Step 1: Inspect the existing instruction file
In VS Code, open `.github/copilot-instructions.md` if it exists. If the file does not exist in your template version, create it. Read the current content before editing.
### Step 2: Add workshop guidance
Append a short section for this workshop. Use your own editor, not Chat, for this tiny edit. Suggested content:
```markdown
## Workshop scope

This repository is used for the Agentic SDLC with GitHub Copilot workshop.
Keep Afternoon 1 exercises small and focused on primitives.
Do not implement track browsing or playlist behavior during Afternoon 1.
Prefer small, testable changes with explicit validation commands.
```
Expected result:
- Copilot now has repository-level context for future requests.
- The instruction is explicit about the Afternoon 1 boundary.
## Add API-specific instructions

### Step 1: Create the folder
Create `.github/instructions` if it does not exist.
### Step 2: Create an API instruction file
Create `.github/instructions/api.instructions.md`. Add the following content:
```markdown
---
applyTo: "src/api/**"
---

When editing the .NET minimal API:
- Keep endpoints small and explicit.
- Return anonymous objects for simple workshop responses.
- Keep route paths under /api.
- Add or update xUnit integration tests in tests/api for endpoint changes.
- Run dotnet test after API changes.
```
Expected result:
- Copilot can apply these instructions when working in `src/api`.
- The instruction file focuses on the API path only.

<div class="tip" data-title="Path-specific guidance">

> Path-specific instructions are useful when different parts of the repository use different frameworks, test runners, or conventions.

</div>

## Create a reusable prompt file

Prompt files let you save repeatable prompts as commands. In this exercise, you will create a prompt file for small endpoint additions.
### Step 1: Create the prompts folder
Create `.github/prompts` if it does not exist.
### Step 2: Create the prompt file
Create `.github/prompts/add-endpoint.prompt.md`. Add the following content:
```markdown
---
description: Add a small .NET minimal API endpoint with tests
---

You are helping with the Music Catalog workshop repository.
Add a small .NET minimal API endpoint based on the user's request.
Requirements:
- Keep the endpoint under /api.
- Keep the response shape simple and explicit.
- Add or update xUnit integration tests in tests/api.
- Run dotnet test.
- Do not implement track browsing, search, playlist, or persistent storage.
- Summarize changed files and validation results.
```
Expected result:
- Copilot can surface `/add-endpoint` in Chat when prompt files are enabled.
- The reusable prompt carries the same scope guard every time.
### Step 3: Invoke the prompt file without changing code
Open Copilot Chat. Copy paste the following prompt in the Chat:
```text
/add-endpoint Explain what you would do to add a GET /api/version endpoint that returns a version string. Do not edit files.
```
Expected result:
- Copilot uses the prompt file.
- Copilot describes a small endpoint and a test.
- Copilot does not edit files because you explicitly asked it not to.

![Prompt file command in Chat](assets/level3-prompt-command.png)

<div class="warning" data-title="Do not over-instruct">

> Long instruction files can become hard to maintain. Keep durable instructions focused on stable repository conventions, not one-off task details.

</div>

## Optional small README section

If the repository has a README, add a short section explaining local validation commands. If the repository does not have a README, create one with only the minimal workshop commands. Copy paste the following prompt in the Chat:
```text
#codebase Add a concise README section named "Local validation" that lists how to run front-end tests and API tests for this repository. Do not mention track browsing or playlist features.

```
Expected result:
- The README helps participants remember validation commands.
- The section stays concise.
## Validate

Run the relevant checks for the files you changed. For instruction and prompt files, validation is mostly review. If you also changed the README, preview the Markdown in VS Code. Run the baseline tests if you want an extra safety check:
```powershell
cd src\front
npm test
```
Then from the repository root:
```powershell
dotnet test
```
## Commit checkpoint

Run from the repository root:
```powershell
git status
git add -A; git commit -m "Add Copilot customization files"
```

---

# Break

You have **10 minutes** for this break. Stand up, refill your water, and keep the repository exactly as it is. Before leaving your machine, make sure your last commit succeeded. Run:
```powershell
git status
```
Expected result:
- Your working tree is clean.
- The API and front-end terminals are either stopped or intentionally running.

<div class="tip" data-title="After the break">

> The next section introduces custom agents and Agent Skills. These are more powerful than simple instructions, so we will keep the implementation task small and review the generated files carefully.

</div>

---

# Level 4: Custom agents and Agent Skills

You have **35 minutes** for this level.
## Topic

You will create a repository custom agent for test writing and an Agent Skill for .NET endpoint work. You will select the agent from the picker and ask it to help with a small API test task. Official docs:
- https://code.visualstudio.com/docs/copilot/customization/custom-agents
- https://code.visualstudio.com/docs/copilot/customization/agent-skills

![Custom agent picker](assets/level4-agent-picker.png)
## What is a custom agent?

A custom agent is a Markdown file that defines a specialized Copilot persona, description, and tool access. Custom agents can live in a repository so the team can share them. They are useful when a task benefits from a repeatable role such as tester, reviewer, migration planner, or documentation assistant.

<div class="info" data-title="Handoffs">

> Some custom agent experiences support handoffs between agents. Handoffs are optional in this workshop. Afternoon 2 will go deeper into agentic workflows and governance.

</div>

## Create a test-writer agent

### Step 1: Create the agents folder
Create `.github/agents` if it does not exist.
### Step 2: Create the agent file
Create `.github/agents/test-writer.agent.md`. Add the following content:
```markdown
---
description: Writes focused tests for the Music Catalog workshop repository
tools: ['codebase', 'editFiles', 'runCommands', 'runTests', 'search']
---

You are a test writer for the Music Catalog workshop repository.
Focus on small, high-value tests that cover existing behavior or the requested change.
Prefer Vitest and Testing Library for src/front.
Prefer xUnit integration tests with WebApplicationFactory for tests/api.
Run the smallest relevant test command after edits.
Do not implement track browsing, playlist behavior, persistent storage, or unrelated features.
Summarize the changed files and validation result.
```
Expected result:
- The custom agent appears in the agent picker after VS Code reloads or refreshes custom agents.
- The description makes it clear when to use the agent.

![Test writer agent file](assets/level4-test-writer-file.png)
### Step 3: Select the agent
Open Copilot Chat. Open the agent picker. Select the test-writer agent. If it does not appear, reload VS Code or use the command palette to refresh Copilot customization.
### Step 4: Ask the agent to inspect tests
Copy paste the following prompt in the Chat:
```text
#codebase Review the current test coverage for the small endpoints and the React app. Suggest one missing test that would be useful after our Afternoon 1 changes. Do not edit files yet.

```
Expected result:
- The agent focuses on tests.
- It suggests a small, relevant test.
- It avoids unrelated features.
## What is an Agent Skill?

An Agent Skill is reusable task knowledge that Copilot can discover and apply. Skills are useful when a team wants to package procedure, domain rules, or implementation patterns. For this workshop, you will create a skill that reminds Copilot how to add .NET minimal API endpoints in this repository.
## Create a dotnet-endpoint skill

### Step 1: Create the skill folder
Create `.github/skills/dotnet-endpoint`.
### Step 2: Create the skill file
Create `.github/skills/dotnet-endpoint/SKILL.md`. Add the following content:
```markdown
---
name: dotnet-endpoint
description: Add or update small .NET minimal API endpoints with xUnit integration tests in the Music Catalog workshop repository.
---

Use this skill when adding a small endpoint to src/api/Program.cs.
Rules:
- Keep routes under /api.
- Keep responses simple and serializable.
- Add or update tests in tests/api.
- Use WebApplicationFactory for endpoint tests.
- Run dotnet test from the repository root.
- Do not implement track browsing, playlist behavior, database persistence, authentication, or authorization unless the user explicitly asks in a later workshop.
```
Expected result:
- The repository now has a reusable skill for endpoint tasks.
- The skill clearly states its trigger and boundaries.

![Agent Skill file](assets/level4-skill-file.png)

<div class="warning" data-title="Feature availability">

> Agent Skills are evolving. If your VS Code build or organization policy does not expose skills yet, still commit the file and discuss how the pattern would be used once enabled.

</div>

## Use the custom agent with the skill context

### Step 1: Ask for a tiny refactor test
Select the test-writer agent again. Copy paste the following prompt in the Chat:
```text
#codebase Add one focused test improvement for the API health endpoint if it is missing. Use the repository instructions and skills. Run dotnet test. Do not add new endpoints and do not change front-end behavior.

```
Expected result:
- The agent inspects or edits only the API tests.
- It uses the existing health endpoint work.
- It runs `dotnet test` if tools are available.
### Step 2: Review the changes
Open Source Control. Confirm the diff is limited to `.github/agents`, `.github/skills`, and possibly a focused test improvement. Reject any unrelated implementation.
## Validate

Run:
```powershell
dotnet test
```
If the agent changed front-end tests, also run:
```powershell
cd src\front
npm test
```
Expected result:
- Tests pass.
- Customization files are readable Markdown.
## Commit checkpoint

Run from the repository root:
```powershell
git status
git add -A; git commit -m "Add Copilot test agent and skill"
```

---

# Level 5: Model Context Protocol servers

You have **20 minutes** for this level.
## Topic

You will configure the GitHub MCP server in VS Code with `.vscode/mcp.json`, start it, and ask Copilot Chat to list open issues or create a workshop issue. Official docs:
- https://code.visualstudio.com/docs/copilot/customization/mcp-servers

![MCP server configuration](assets/level5-mcp-config.png)
## What is MCP?

MCP stands for Model Context Protocol. It standardizes how AI tools connect to external context and tools. In Copilot Chat, an MCP server can provide tools such as GitHub issue operations, repository queries, or browser automation, depending on the server.

<div class="warning" data-title="Security and policy">

> MCP servers can run code, access local resources, or call remote APIs depending on their implementation. Only use MCP servers you trust. Your organization may restrict which MCP servers are allowed.

</div>

## Add the GitHub MCP server

### Step 1: Create the VS Code folder
Create `.vscode` if it does not exist.
### Step 2: Create the MCP configuration
Create `.vscode/mcp.json`. Add the following content:
```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    }
  }
}
```
Expected result:
- VS Code detects the GitHub MCP server configuration.
- You may need to start or authorize the server from the MCP UI.
### Step 3: Start the MCP server
Use the VS Code MCP server controls to start the GitHub server. Authenticate if prompted. Grant only the permissions needed for the exercise.

![Start GitHub MCP server](assets/level5-start-mcp.png)
## Use MCP from Copilot Chat

### Step 1: List open issues
Open Copilot Chat in Agent mode. Copy paste the following prompt in the Chat:
```text
Use the GitHub MCP server to list the open issues in the current repository. Summarize the issue number, title, and state. Do not create or modify anything.
```
Expected result:
- Copilot asks to use a GitHub MCP tool if approval is required.
- Copilot lists open issues or reports that none exist.
### Step 2: Create a workshop issue
Only continue if your repository has issues enabled and your facilitator approves creating a test issue. Copy paste the following prompt in the Chat:
```text
Use the GitHub MCP server to create a new issue in the current repository. Title: "Workshop validation: review Copilot primitives". Body: "Created during Afternoon 1 to validate GitHub MCP issue creation. Close this issue after the workshop." Do not assign anyone and do not add labels.
```
Expected result:
- Copilot requests approval before creating the issue.
- The issue appears in GitHub.
- You can close it after the workshop.

![MCP issue created](assets/level5-issue-created.png)

<div class="important" data-title="Tool consent">

> Read every tool approval prompt. Confirm that the tool, repository, and requested operation match your intent before approving.

</div>

## Validate

Open the repository on GitHub. Confirm that the issue list matches what Copilot reported. If you created the test issue, close it manually or ask Copilot to close it with MCP after confirming the operation.
## Commit checkpoint

Run from the repository root:
```powershell
git status
git add -A; git commit -m "Configure GitHub MCP server"
```

---

# Level 6: Copilot CLI

You have **35 minutes** for this level.
## Topic

You will use the GitHub Copilot CLI from the repository root. You will trust the folder, sign in, ask for a repository explanation, inspect model selection, add an xUnit health endpoint test from the CLI, use shell escape, select the custom agent, and try programmatic mode carefully. Official docs:
- https://docs.github.com/en/copilot/how-tos/copilot-cli

![Copilot CLI in terminal](assets/level6-cli-start.png)
## Install and start the CLI

### Step 1: Install the CLI
If you have not installed the CLI yet, run:
```powershell
npm install -g @github/copilot
```
Expected result:
- The `copilot` command is available in a new terminal.
### Step 2: Start from the repository root
Open PowerShell at the repository root. Run:
```powershell
copilot
```
Expected result:
- The CLI opens an interactive Copilot session.
- You may be asked to trust the folder.
### Step 3: Trust the folder
When prompted, trust the repository folder only if it is the workshop repository you created.

<div class="warning" data-title="Folder trust">

> Trusting a folder allows the CLI to reason about and potentially use tools in that workspace. Do not trust random downloaded repositories.

</div>

## Sign in and inspect help

### Step 1: Sign in
In the Copilot CLI session, run:
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
- The CLI lists available commands for your installed version.
- Commands and flags can change, so use `/help` as the source of truth during delivery.
### Step 3: Check usage
Run:
```text
/usage
```
Expected result:
- The CLI shows usage information available to your account and plan.
## Ask the CLI to explain the repository

Copy paste the following prompt:
```text
Explain this repository in ten bullets. Include the React front end, the .NET API, the tests, the local ports, and the commands to run the app. Do not modify files.
```
Expected result:
- The CLI summarizes the repo.
- It should mention `src/front`, `src/api`, port 5173, and port 5080.

![CLI repository explanation](assets/level6-cli-explain.png)
## Choose a model

### Step 1: Open model selection
In the CLI, run:
```text
/model
```
Expected result:
- The CLI shows available model options for your account.
- Availability depends on your plan and organization policy.
### Step 2: Pick a model or keep the default
Choose a model that your facilitator recommends, or keep the default. Do not make cost or quality assumptions beyond the official documentation.
## Add an API test from the CLI

### Step 1: Ask for the test change
Copy paste the following prompt:
```text
Add or verify an xUnit integration test for GET /api/health. The test should use WebApplicationFactory, call /api/health, and assert that the status value is ok. Run dotnet test. Do not change API behavior and do not add track or playlist features.
```
Expected result:
- The CLI edits or confirms the API test.
- It may run `dotnet test`.
- It reports validation results.
### Step 2: Review the diff
Exit the CLI if needed. Run:
```powershell
git diff
```
Expected result:
- The diff is limited to the intended test if any change was necessary.

<div class="tip" data-title="CLI plus repository customization">

> The Copilot CLI can use repository customization such as instructions, agents, skills, and prompt files when supported by your installed version. Keep those files committed so the behavior is repeatable for the team.

</div>

## Use shell escape

In the CLI, shell escape lets you run a command from inside the session. Run:
```text
! git status --short
```
Expected result:
- The CLI prints the current Git status.
- You stay in the Copilot CLI session.
## Select a custom agent

Run:
```text
/agent
```
Select the test-writer agent if it is listed. Copy paste the following prompt:
```text
Using the selected test-writer agent, review whether the current front-end tests cover the Footer component. If coverage is missing, add the smallest test and run npm test from src/front.
```
Expected result:
- The CLI uses the selected agent when available.
- It keeps the task focused on tests.

![CLI custom agent selection](assets/level6-cli-agent.png)
## Programmatic mode

The CLI can also run one prompt non-interactively with `-p`. Use this cautiously because flags that allow tools can grant broader autonomy. From the repository root, run a read-only prompt:
```powershell
copilot -p "Summarize the validation commands for this repository. Do not edit files."
```
Expected result:
- The CLI prints a summary and exits.
If you need to allow one specific tool, consult `/help` and the official docs. The documented flags include `--allow-tool` and `--allow-all-tools`.

<div class="warning" data-title="Tool allow flags">

> Prefer the narrowest permission possible. Avoid `--allow-all-tools` unless you are in a trusted repository, understand the requested operation, and your organization policy allows it.

</div>

## Preview of Afternoon 2

Run:
```text
/delegate
```
If your CLI version supports it, read the help text. If it is not available, note that delegation and advanced agentic workflows are part of Afternoon 2. Do not use delegation for today's exercises unless your facilitator explicitly asks.
## Validate

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
## Commit checkpoint

Run from the repository root:
```powershell
git status
git add -A; git commit -m "Validate Copilot CLI workflow"
```

---

# Level 7: Plugins and the Copilot App

You have **25 minutes** for this level.
## Topic

You will learn what Agent Plugins bundle, enable the VS Code plugin experience, browse plugin marketplaces, install and inspect one plugin from the awesome-copilot marketplace, uninstall it, and take a brief Copilot App tour if available. Official docs:
- https://code.visualstudio.com/docs/agent-customization/agent-plugins
- https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-finding-installing

![Agent Plugins marketplace](assets/level7-plugin-marketplace.png)
## What are Agent Plugins?

Agent Plugins can bundle several Copilot customization assets together. A plugin can include:
- Agents.
- Skills.
- Prompts.
- Hooks.
- MCP server configuration.
This makes plugins a packaging mechanism for reusable development practices.

<div class="warning" data-title="Hooks and MCP can run code">

> Treat plugins like code dependencies. Inspect what they add before trusting them. Hooks and MCP server configuration can execute commands or connect tools.

</div>

## Enable plugins in VS Code

### Step 1: Enable the setting
Open VS Code Settings. Search for `chat.plugins.enabled`. Enable the setting if your build exposes it. If the setting is unavailable, your VS Code version may not include this preview yet.

![Enable chat plugins setting](assets/level7-enable-setting.png)
### Step 2: Browse extensions
Open the Extensions view. Search:
```text
@agentPlugins
```
Expected result:
- VS Code shows available agent plugins from configured marketplaces.
Default marketplaces include:
- `github/copilot-plugins`
- `github/awesome-copilot`
### Step 3: Add an extra marketplace if needed
If your facilitator provides a marketplace, configure it with `chat.plugins.marketplaces`. Only add marketplaces you trust.
### Step 4: Install from source
Open the command palette. Run **Chat: Install Plugin From Source** if available. Use this option only for a trusted source repository. Expected result:
- VS Code shows a trust prompt.
- You can inspect the plugin before using it.
## Exercise: browse awesome-copilot and install one plugin

### Step 1: Browse the marketplace
In the Extensions view, browse plugins from `github/awesome-copilot`. Pick one small plugin that is relevant to your interests. Do not pick a plugin that asks for secrets or broad system access during the workshop.
### Step 2: Install the plugin
Install the selected plugin. Read the trust prompt carefully.

![Plugin trust prompt](assets/level7-plugin-trust.png)
### Step 3: Inspect what it added
Open the plugin details. Look for:
- Agents.
- Skills.
- Prompts.
- Hooks.
- MCP configuration.
Copy paste the following prompt in the Chat:
```text
Explain what the installed plugin added to my Copilot environment. Focus on agents, skills, prompts, hooks, and MCP configuration. Do not run plugin tools or modify files.
```
Expected result:
- Copilot summarizes plugin contents.
- No files are changed by this explanation prompt.
### Step 4: Uninstall the plugin
Uninstall the plugin after inspecting it. Expected result:
- Your workshop environment returns to the repository customizations you created earlier.

<div class="tip" data-title="Why uninstall?">

> Uninstalling keeps all participants aligned for the recap. In real projects, you would keep approved plugins and document why the team uses them.

</div>

## CLI plugin commands

The Copilot CLI also supports plugin marketplace commands. Run these commands only if your installed CLI version supports them. List marketplaces:
```powershell
copilot plugin marketplace list
```
Browse a marketplace:
```powershell
copilot plugin marketplace browse <name>
```
Install a plugin:
```powershell
copilot plugin install <plugin>@<marketplace>
```
List installed plugins:
```powershell
copilot plugin list
```
Inside an interactive CLI session, you can also inspect plugin help with:
```text
/plugin
```
Expected result:
- You know how to discover plugins from the CLI.
- You do not keep unnecessary plugins installed after the exercise.
## Brief Copilot App tour

GitHub is expanding Copilot experiences beyond the editor and CLI. If the Copilot App is available for your account and plan, open it for a short tour. Look for:
- How it connects to repositories or work items.
- How it presents sessions or tasks.
- What permissions it asks for.
- How it differs from VS Code Chat and the CLI.

<div class="info" data-title="Availability">

> Copilot App availability depends on your plan, tenant, preview enrollment, and administrator settings. Skip this tour if it is not enabled for you.

</div>

![Copilot App tour](assets/level7-copilot-app.png)
## Teaser for Afternoon 2

Afternoon 2 will use these primitives in a governed workflow. You will see how custom marketplaces, APM governance, HVE-Core, RPI, and Coding Agent combine into an agentic SDLC flow. The implementation feature for Afternoon 2 is separate from today and will cover browsing tracks and adding them to a single in-memory playlist.
## Validate

Run:
```powershell
git status
```
Expected result:
- Plugin installation and uninstallation did not leave unexpected repository changes.
- If VS Code wrote local settings, review them before committing.
## Commit checkpoint

If no repository files changed, no commit is required. If you intentionally committed VS Code plugin configuration for the team, run:
```powershell
git status
git add -A; git commit -m "Document Copilot plugin workflow"
```

---

# Recap: Choose the right primitive

You have **15 minutes** for this recap.
## Topic

You will summarize what each Copilot primitive is for, where it lives, and when to use it.
## What you practiced

Today you used GitHub Copilot as a layered toolchain rather than one feature. You started with fast local completion. You moved to Chat for explanation and scoped edits. You stored durable guidance in instructions and prompt files. You created a test-oriented custom agent. You packaged endpoint knowledge as an Agent Skill. You connected GitHub through MCP. You used the Copilot CLI for terminal-based work. You inspected Agent Plugins and learned why trust matters.
## Primitive selection table

| Primitive | Where it lives | When to use |
| --------- | -------------- | ----------- |
| Inline completions | Editor buffer | Fast local code suggestions while you type. |
| Next Edit Suggestions | Editor buffer | Follow-up edits after a nearby change, especially renames or repeated patterns. |
| Ask mode | VS Code Chat | Explanations, codebase questions, and low-risk guidance. |
| Plan mode | VS Code Chat | Breaking a task into steps before implementation. |
| Agent mode | VS Code Chat | Small implementation tasks where Copilot may edit files and run commands. |
| Repository instructions | Repository GitHub folder | Stable team guidance that should apply broadly. |
| Path-specific instructions | Repository instructions folder | Framework-specific rules for a subset of files. |
| Prompt files | Repository prompts folder | Repeatable prompts that should appear as commands. |
| Custom agents | Repository agents folder | Specialized roles such as test writer, reviewer, or planner. |
| Agent Skills | Repository skills folder | Reusable task knowledge and procedural guidance. |
| MCP servers | VS Code MCP configuration | External tools and context such as GitHub issue operations. |
| Copilot CLI | Terminal | Repository assistance without leaving the shell. |
| Agent Plugins | VS Code or CLI plugin installation | Bundling agents, prompts, skills, hooks, and MCP for reuse. |
| Copilot App | GitHub Copilot app surface | Plan-dependent agent and task experiences outside the editor. |

<div class="important" data-title="The operating model">

> The professional workflow is not "ask Copilot to do everything". It is: scope the task, provide the right context, choose the smallest capable primitive, review changes, validate with tests, and commit a clean checkpoint.

</div>

## What is next

Afternoon 2 will build on this foundation. You will move from primitives to governed agentic workflows. You will use HVE-Core and Design Thinking to shape the task. You will use RPI to ground implementation decisions. You will use APM and agentic workflows to manage reusable governance. You will use Coding Agent to implement the next feature. The Afternoon 2 feature is intentionally not implemented today: browse tracks and add tracks to a single in-memory playlist.
## Final validation

Run both test suites one more time. From the repository root:
```powershell
dotnet test
```
Then:
```powershell
cd src\front
npm test
```
Expected result:
- API tests pass.
- Front-end tests pass.
- Your working tree contains only intentional changes since the last checkpoint.
## Final commit checkpoint

If you have uncommitted workshop changes, run:
```powershell
git status
git add -A; git commit -m "Complete Afternoon 1 Copilot primitives"
```
If your working tree is already clean, you are done.

---

# Extra Credits 🪙

If you finish early, choose one optional bonus exercise. Do not start Afternoon 2 features.
## Bonus 1: Add a `/api/version` endpoint

Use the `/add-endpoint` prompt file you created earlier. Copy paste the following prompt in the Chat:
```text
/add-endpoint Add GET /api/version that returns { "version": "1.0" }. Add an xUnit integration test and run dotnet test. Do not change existing endpoints.
```
Expected result:
- A small endpoint returns the workshop version.
- A focused test validates it.
Validate:
```powershell
dotnet test
```
Commit checkpoint:
```powershell
git add -A; git commit -m "Add version endpoint"
```
## Bonus 2: Improve README validation guidance

Ask Copilot to make the README clearer for local validation. Copy paste the following prompt in the Chat:
```text
#file:README.md Improve the Local validation section for a beginner. Keep it concise, include separate API and front-end commands, and do not mention track browsing or playlist features.

```
Expected result:
- The README remains concise.
- Validation commands are easy to find.
Validate by previewing the Markdown. Commit checkpoint:
```powershell
git add -A; git commit -m "Improve validation documentation"
```
## Bonus 3: Ask Copilot to explain your customizations

Use Ask mode. Copy paste the following prompt in the Chat:
```text
#codebase Explain the Copilot customization files in this repository. Include repository instructions, path-specific instructions, prompt files, custom agents, and skills. Do not edit files.

```
Expected result:
- Copilot explains the role of each customization file.
- No code changes are made.
No commit is required.
## Bonus 4: Try CLI read-only automation

From the repository root, run:
```powershell
copilot -p "List the Copilot customization files in this repository and explain their purpose. Do not edit files."
```
Expected result:
- The CLI returns a concise inventory.
- No files are changed.
No commit is required.
## Help us improve this Workshop

If you faced any challenge or bug running this workshop, please let us know. Your help will be invaluable in making this workshop better, especially as we try to keep it up to date with fast-moving Copilot capabilities. [Report any problem here.](https://github.com/Justrebl/AI-SDLC-Workshop/issues)
