# Kick-off call: live organization checklist

Use this page during the kick-off call to walk through the checks on screen with the organization owner and a volunteer attendee. Each step names who does it, where to click, and what you should see. Tick a box only after you have seen the expected state.

Steps tagged **[Codespaces only]** apply only if your organization chose the Codespaces delivery option. Every other step applies to all three options. The detailed per-option guides are [before-d-day-codespace.md](before-d-day-codespace.md), [before-d-day-devcontainer.md](before-d-day-devcontainer.md) and [before-d-day-local.md](before-d-day-local.md). The full settings table is in [prerequisites, section 7](prerequisites.md#7-organization-and-enterprise-settings-admin).

> **Before the call:** the person sharing their screen must be an **organization owner** (and, if the organization belongs to an enterprise, have an enterprise owner reachable). Enterprise policies take precedence: if a setting is greyed out at organization level, the enterprise owner has fixed it. See [GitHub Copilot policies for enterprises and organizations](https://docs.github.com/en/copilot/concepts/policies).

Replace `ORG` with your organization name in every link and command below.

## Step 0: Decide on the delivery option (2 minutes)

- [ ] Delivery option chosen: **Codespaces**, **local dev container**, or **local tools**. Write it down; it decides which steps below apply.
- [ ] Organization used on the day identified (the one that grants the attendees' Copilot seats).
- [ ] Owners named for the follow-up actions: organization owner, enterprise owner (if any), network team.

## Step 1: Licences and seats (organization owner)

Where: **Organization → Settings → Copilot → Access** (`https://github.com/organizations/ORG/settings/copilot/seat_management`).

- [ ] The organization has a **Copilot Business** or **Copilot Enterprise** plan.
- [ ] Seat assignment is set to **all members** or to **selected members**, and every attendee is in the list (or in an assigned team).
- [ ] Every attendee shows a recent **last activity** date, or none yet if they have never signed in. A missing attendee means no seat.
- [ ] Facilitators also have seats.

Optional command-line check (needs the `manage_billing:copilot` or `read:org` scope):

```bash
gh api /orgs/ORG/copilot/billing --jq '{plan: .plan_type, seats: .seat_breakdown}'
gh api /orgs/ORG/copilot/billing/seats --paginate --jq '.seats[].assignee.login'
```

Docs: [Granting access to Copilot for members of your organization](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-access/grant-access) · [REST API: Copilot user management](https://docs.github.com/en/rest/copilot/copilot-user-management).

## Step 2: Copilot feature policies (organization owner)

Where: **Organization → Settings → Copilot → Policies**. For each policy, check the selected enforcement option.

- [ ] **Copilot CLI** enabled. Used in Afternoon 1 (Levels 8–9) and throughout Afternoon 2.
- [ ] **MCP servers in Copilot** enabled. MCP tools in VS Code, Copilot CLI and the Copilot cloud agent.
- [ ] **Preview features** allowed, if you plan to show preview features in Afternoon 2.
- [ ] Policies that control **plugins, extensions or marketplaces** (names vary as the product evolves) allow installing plugins from `microsoft/hve-core` and from a repository marketplace. Afternoon 1 Level 9; Afternoon 2 Levels 1 and 4.
- [ ] Any greyed-out policy noted with the enterprise owner as follow-up.

Docs: [Managing policies and features for Copilot in your organization](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-organization/manage-policies).

## Step 3: Models (organization owner)

Where: **Organization → Settings → Copilot → Models**.

- [ ] The models the facilitator plans to show are enabled. Auto model selection only chooses from models your policies allow.
- [ ] Decision recorded: may attendees use **Auto**, and which explicit models are allowed.
- [ ] Nobody quotes prices on the call. Additional models may consume premium requests; point to [GitHub Copilot billing](https://docs.github.com/en/copilot/concepts/billing) for your tenant's terms.

## Step 4: Copilot cloud agent (organization owner)

Where: **Organization → Settings → Copilot → Cloud agent**.

- [ ] **Copilot cloud agent** is enabled for the organization.
- [ ] Repository access allows **all repositories**, or the attendees' forks and template copies will be added. Used in Afternoon 1 Level 6 and Afternoon 2 Level 6.
- [ ] Volunteer attendee: in any repository they own in the organization, **Settings → Copilot → Cloud agent** is visible.

Docs: [About Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent).

## Step 5: Repositories and members (organization owner)

Where: **Organization → Settings → Member privileges**.

- [ ] Members can create **private** repositories (Afternoon 2 template copies).
- [ ] **Forking** of repositories is allowed (Afternoon 1 fork).
- [ ] Members can create repositories from a **template** (`Justrebl/AI-SDLC-Workshop` is a public template).

Where: **Organization → Settings → Packages** (if your organization restricts packages).

- [ ] Members can pull public images from `ghcr.io` (the prebuilt dev container image).

## Step 6: GitHub Actions (organization owner)

Where: **Organization → Settings → Actions → General**.

- [ ] Actions are enabled for **all repositories** or for the attendees' repositories.
- [ ] Allowed actions include `actions/*` and `github/gh-aw-actions/*`, or all actions are allowed.
- [ ] **Workflow permissions** let workflows create issues and comments, or the attendees accept that the workflow files declare them explicitly.

Docs: [Disabling or limiting GitHub Actions for your organization](https://docs.github.com/en/organizations/managing-organization-settings/disabling-or-limiting-github-actions-for-your-organization).

## Step 7: Codespaces settings [Codespaces only] (organization owner)

Where: **Organization → Settings → Codespaces → General** and **Policies**.

- [ ] **[Codespaces only]** Codespaces enabled for **all members** or for the attendees.
- [ ] **[Codespaces only]** Machine types allowed include **2-core** and **4-core**.
- [ ] **[Codespaces only]** Idle timeout and retention policies reviewed (a short idle timeout is fine; the default stops a codespace after 30 minutes of inactivity).

Docs: [Enabling or disabling GitHub Codespaces for your organization](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization/enabling-or-disabling-github-codespaces-for-your-organization) · [Restricting machine types](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization/restricting-access-to-machine-types).

## Step 8: IP allow list [Codespaces only] (organization owner)

Where: **Organization → Settings → Authentication security → IP allow list**.

- [ ] **[Codespaces only]** The organization **IP allow list is not enabled**. If it is enabled, codespaces cannot be created for the organization's repositories: switch to the local dev container option.

Docs: [Managing allowed IP addresses for your organization](https://docs.github.com/en/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/managing-allowed-ip-addresses-for-your-organization).

## Step 9: Billing and budgets (billing manager or owner)

Where: **Organization → Settings → Billing and licensing** (or the enterprise billing pages).

- [ ] Budgets reviewed for **Copilot** usage (premium requests), **Actions** minutes, and, **[Codespaces only]**, **Codespaces** compute and storage. Each product uses its own usage unit.
- [ ] **[Codespaces only]** Codespaces **billing owner** chosen: the organization or the user.
- [ ] **[Codespaces only]** Codespaces **spending limit above zero** if the organization pays.
- [ ] No prices quoted: point to [GitHub billing documentation](https://docs.github.com/en/billing) and to your contract.

## Step 10: Attendee self-checks (volunteer attendee, on screen)

- [ ] [github.com/settings/copilot](https://github.com/settings/copilot) shows a Business or Enterprise seat and the organization that grants it.
- [ ] VS Code: the Copilot Chat view answers a question while signed in with the right account (check the **Accounts** menu).
- [ ] Terminal:

  ```bash
  gh auth status
  gh auth refresh --scopes workflow   # needed on D-1 for pushing workflow files
  ```

- [ ] **[Codespaces only]** [github.com/codespaces](https://github.com/codespaces) → **New codespace** on the workshop template opens in the browser. Delete it afterwards.
- [ ] Local dev container option: Docker or Podman runs `docker run --rm hello-world`.

## Step 11: Network checks (network team, can be async)

- [ ] Copilot endpoints allowed: the [Copilot allowlist reference](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference), plus `github.com`. Current list:

  ```bash
  gh api meta --jq '.domains | .website, .copilot'
  ```

- [ ] `ghcr.io` reachable (dev container image).
- [ ] **[Codespaces only]** Codespaces domains allowed from attendee workstations:

  ```bash
  gh api meta --jq '.domains.codespaces'
  ```

- [ ] **[Codespaces only]** WebSockets allowed and no TLS inspection on `*.github.dev`. Codespace outbound traffic needs no extra rules.
- [ ] TLS inspection exclusions in place, or the proxy root certificate installed on machines and inside containers.

Docs: [Troubleshooting your connection to GitHub Codespaces](https://docs.github.com/en/codespaces/troubleshooting/troubleshooting-your-connection-to-github-codespaces) · [prerequisites, section 6](prerequisites.md#6-network-and-firewall).

## Wrap-up: actions and dates

| Gap found | Owner | Due |
| --- | --- | --- |
| | | D-7 |
| | | D-7 |
| | | D-1 |

- **D-7:** licences, policies and network rules confirmed.
- **D-1:** every attendee opens their environment, both labs' apps run, and Copilot answers.
