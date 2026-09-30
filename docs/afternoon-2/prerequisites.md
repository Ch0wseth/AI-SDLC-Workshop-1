# Afternoon 2 — Full pre-requisites checklist

Use this checklist **at least one week before** the session. Items marked **Admin** need an organization or enterprise owner. Many Afternoon 2 features are previews or depend on policy settings, so check each one in the target tenant. Do not assume a feature is available because it works on a personal account.

## Attendee workstation

| Item | Check | Command or location |
| --- | --- | --- |
| Git | Version 2.40 or later | `git --version` |
| Node.js | 22 LTS | `node --version` |
| .NET SDK | 10.x | `dotnet --version` |
| VS Code | Latest stable, signed in to GitHub | Accounts menu |
| GitHub Copilot Chat extension | Latest | Extensions view |
| GitHub CLI | Authenticated | `gh auth status` |
| Copilot CLI | Installed and signed in | `copilot --version` |
| APM CLI | Installed | `apm --version` ([install guide](https://microsoft.github.io/apm/)) |
| gh-aw extension | Installed | `gh extension install github/gh-aw` then `gh aw version` |
| Starter build | API and front end build and test green | `dotnet test` and, in `src/front`, `npm ci` then `npm test` |

## GitHub account and licence

| Item | Why it matters | Owner |
| --- | --- | --- |
| Copilot Business or Enterprise seat | Required for Coding Agent and org policy controls | Admin |
| Each attendee owns a repository created from the workshop template | Workflows, issues and Coding Agent runs happen in the attendee's own repository | Attendee |
| Actions enabled on attendee repositories | gh-aw workflows compile to GitHub Actions | Admin |
| Copilot Coding Agent enabled for the repositories | Level 6 delegation | Admin |
| Copilot CLI allowed by policy | Levels 1, 3 and 4 | Admin |
| Allowed models policy reviewed | Auto only picks from models your policy allows | Admin |
| Plugin and marketplace policy reviewed | Level 4 installs plugins from `microsoft/hve-core` and a repository marketplace | Admin |

## Network and firewall

| Endpoint or source | Used by |
| --- | --- |
| `github.com`, `api.github.com`, `raw.githubusercontent.com` | APM resolution, plugin marketplaces, gh-aw |
| `microsoft/hve-core` repository | HVE-Core CLI plugin and APM dependency |
| `registry.npmjs.org`, `api.nuget.org` | Starter app restore, including the Coding Agent `copilot-setup-steps` job |
| `w3.org` | Accessibility review workflow (`network.allowed` in `a11y-review.md`) |

<div class="warning" data-title="Restricted networks">

> `apm audit --ci` replays the install to detect drift, which needs network access. On restricted networks it can be very slow. The facilitator should record a passing and a failing audit ahead of time as a fallback.

</div>

## Usage and billing readiness

- Confirm which usage unit applies to your tenant for each experience (VS Code, CLI, Coding Agent, gh-aw). See [GitHub Copilot billing](https://docs.github.com/copilot/concepts/billing) and your enterprise billing settings. **Do not rely on prices written in workshop material.**
- Decide whether attendees may use Auto model selection, and which explicit models are allowed.
- If a budget or spending limit is set, check that a 4-hour session with ~20 attendees and the gh-aw runs fits inside it.
- HydraFusion is a **Research Preview**. Include it only if your tenant has access, and present it as optional.

## Day-before smoke test (facilitator)

1. Create a fresh repository from the template and run Level 0 end to end.
2. Run `copilot plugin marketplace add microsoft/hve-core` and `copilot plugin install hve-core@hve-core`.
3. Run `apm install` with the pinned `apm.yml`, then `apm policy status --policy-source apm-policy.yml`.
4. Run `gh aw compile` and `gh aw run daily-backlog`, and confirm the summary issue is created.
5. Assign a test issue to Copilot and confirm a pull request opens.
