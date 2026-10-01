# Agentic SDLC with GitHub Copilot — Workshop

This is a two-afternoon, fully hands-on workshop (4 hours each) that moves from individual GitHub Copilot primitives to a governed, agentic software development lifecycle.

| Afternoon | Focus | Content |
| --- | --- | --- |
| 1 | Copilot primitives: runs the official [GHCopilotHoL](https://moaw.dev/workshop/gh:Philess/GHCopilotHoL/main/docs/) lab on [Philess/gh-copilot-demo](https://github.com/Philess/gh-copilot-demo), then adds Agent Skills, Copilot CLI and plugins | [docs/afternoon-1/workshop.md](docs/afternoon-1/workshop.md) |
| 2 | HVE-Core, Design Thinking, RPI, APM and policy, plugin marketplace, agentic workflows, Coding Agent | [docs/afternoon-2/workshop.md](docs/afternoon-2/workshop.md) |

Supporting material:

- [Afternoon 2 prerequisites](docs/afternoon-2/prerequisites.md)
- [Facilitator runbook](docs/afternoon-2/facilitator-runbook.md)
- [Afternoon 2 solution files](solutions/afternoon-2)
- [Workshop tester](tests/workshop/afternoon-2/README.md): an agentic workflow that replays the full Afternoon 2 lab in a throwaway Codespace on every change to `main` and files an issue when a step fails

## Starter application

In Afternoon 2, each attendee works in their own copy of this repository, created from the template or by copying it (Level 0 Step 1). It is a small music catalog mono-repo:

- `src/api` is a .NET 10 minimal API. It exposes `GET /api/hello` and ships 12 synthetic tracks in `Data/tracks.json`.
- `src/front` is a React, TypeScript and Vite front end.
- `tests/api` holds the xUnit integration tests.

In Afternoon 2, attendees use HVE-Core's RPI workflow to build one capability: **browse tracks and add them to a single in-memory playlist**.

For a preconfigured environment, open the repository in GitHub Codespaces or use VS Code's **Dev Containers: Reopen in Container** command. The root `.devcontainer.json` provides Git, Node.js 22, .NET 10, GitHub CLI, GitHub Copilot CLI, APM CLI, the `gh-aw` extension, Copilot extensions, restored .NET dependencies and installed front-end dependencies. Authentication, Copilot licensing and organization policies must still be configured as described in the [Afternoon 2 prerequisites](docs/afternoon-2/prerequisites.md).

```bash
dotnet test
cd src/front
npm ci
npm test
```

## Publishing on MOAW

The workshop files follow the [MOAW contributing conventions](https://github.com/microsoft/moaw/blob/main/CONTRIBUTING.md). Preview them at `https://moaw.dev/workshop/gh:Justrebl/AI-SDLC-Workshop/main/docs/afternoon-2/`.

## Feedback

Open an issue at <https://github.com/Justrebl/AI-SDLC-Workshop/issues>.
