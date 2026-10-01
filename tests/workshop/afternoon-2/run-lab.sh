#!/usr/bin/env bash
# Replays the entire AI SDLC with GitHub and GitHub Copilot lab (docs/afternoon-2/workshop.md, Levels 0-6) inside a Codespace
# opened on a throwaway sandbox repository. Every step is recorded in $RESULTS_DIR/results.jsonl.
#
# Required environment:
#   SANDBOX_REPO          owner/name of the sandbox repository (the Codespace's own repository)
#   GH_TOKEN              token for gh (sandbox issues, workflow runs, Coding Agent assignment)
#   COPILOT_GITHUB_TOKEN  token for Copilot CLI (fine-grained PAT with the Copilot Requests permission)
# Optional:
#   RESULTS_DIR           default /tmp/workshop-tester
#   WORKFLOW_WAIT_S       max wait for each gh-aw run (default 1800)
#   CODING_AGENT_WAIT_S   max wait for the Coding Agent task and PR (default 3600)
set -u

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_DIR=$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)
export RESULTS_DIR=${RESULTS_DIR:-/tmp/workshop-tester}
WORKFLOW_WAIT_S=${WORKFLOW_WAIT_S:-1800}
CODING_AGENT_WAIT_S=${CODING_AGENT_WAIT_S:-3600}
export CI=true DOTNET_CLI_TELEMETRY_OPTOUT=1 DOTNET_NOLOGO=1 NPM_CONFIG_UPDATE_NOTIFIER=false GH_PROMPT_DISABLED=1
# shellcheck source=lib.sh
. "$SCRIPT_DIR/lib.sh"

finish() {
  local failed
  failed=$(grep -c '"status":"fail"' "$RESULTS_FILE" || true)
  printf '{"sandbox":"%s","finished_at":"%s","steps":%s,"failed":%s}\n' \
    "$SANDBOX_REPO" "$(date -u +%FT%TZ)" "$(wc -l < "$RESULTS_FILE")" "${failed:-0}" > "$RESULTS_DIR/summary.json"
  pkill -f 'dotnet run' 2>/dev/null; pkill -f 'vite' 2>/dev/null
  touch "$RESULTS_DIR/done"
}
trap finish EXIT

cd "$REPO_DIR" || exit 1
: "${SANDBOX_REPO:?SANDBOX_REPO is required}"
git config user.name >/dev/null || git config user.name "Workshop Tester"
git config user.email >/dev/null || git config user.email "workshop-tester@users.noreply.github.com"

# ---------------------------------------------------------------- Preflight
step pre-tools preflight "Workshop tools available in the Codespace" literal 60 \
  'for t in git dotnet node npm gh copilot apm curl; do printf "%s: " "$t"; command -v "$t" || exit 1; done; dotnet --version; node --version; gh --version | head -n1; copilot --version; apm --version'
finish_step

step pre-prompts preflight "Extract copy-paste prompts from workshop.md" translated 30 \
  "node '$SCRIPT_DIR/extract-prompts.mjs' docs/afternoon-2/workshop.md '$RESULTS_DIR/prompts'"
finish_step

# ---------------------------------------------------------------- Level 0
step l0-layout "Level 0" "Open the repository root and check the starter layout" translated 30 \
  'for p in src/front src/api tests/api MusicCatalog.slnx .github/copilot-instructions.md .github/workflows/copilot-setup-steps.yml .github/ISSUE_TEMPLATE/feature.yml solutions/afternoon-2; do [ -e "$p" ] && echo "ok $p" || { echo "missing $p"; exit 1; }; done'
grep -q '/api/hello' src/api/Program.cs && ! grep -q '/api/tracks' src/api/Program.cs \
  && check "Program.cs exposes GET /api/hello only" true || check "Program.cs exposes GET /api/hello only" false "$(grep -n 'Map' src/api/Program.cs)"
grep -q '/api/hello' src/front/src/App.tsx && ! grep -q '/api/tracks' src/front/src/App.tsx \
  && check "App.tsx fetches /api/hello only" true || check "App.tsx fetches /api/hello only" false
n=$(node -e 'console.log(JSON.parse(require("fs").readFileSync("src/api/Data/tracks.json","utf8")).length)' 2>/dev/null)
[ "$n" = 12 ] && check "tracks.json contains 12 tracks" true || check "tracks.json contains 12 tracks" false "count=$n"
finish_step

step l0-dotnet-test "Level 0" "Run API tests" literal 900 'dotnet test'
finish_step

step l0-npm-test "Level 0" "Run front-end tests" translated 600 'cd src/front && npm test'
finish_step

step l0-baseline "Level 0" "Create a baseline checkpoint" translated 60 \
  'git status; git add -A; git commit -m "Baseline Afternoon 2 starter" || echo "nothing to commit (allowed by the lab)"'
tree_clean_check
finish_step

# ---------------------------------------------------------------- Level 1
step l1-marketplace-add "Level 1" "Register the HVE-Core marketplace" literal 300 \
  'copilot plugin marketplace add microsoft/hve-core'
if [ "$STEP_CODE" -ne 0 ] && log_has 'already'; then note "marketplace already registered (allowed)"; STEP_CODE=0; fi
finish_step

step l1-plugin-install "Level 1" "Install HVE-Core" literal 600 'copilot plugin install hve-core@hve-core'
if [ "$STEP_CODE" -ne 0 ] && log_has 'already'; then note "plugin already installed (allowed)"; STEP_CODE=0; fi
finish_step

step l1-plugin-browse "Level 1" "Browse plugin commands (/plugin)" emulated 120 'copilot plugin list'
note "interactive /plugin replaced by 'copilot plugin list'"
log_has 'hve-core' && check "hve-core plugin listed" true || check "hve-core plugin listed" false
finish_step

skip_step l1-vscode "Level 1" "VS Code alternative (ise-hve-essentials.hve-core)" "VS Code UI fallback, not executable headless"

step l1-git-status "Level 1" "Commit checkpoint: git status" literal 30 'git status'
tree_clean_check
finish_step

# ---------------------------------------------------------------- Level 2
copilot_prompt l2-dt-start "Level 2" "Start the DT project (/dt-start-project)" dt-start 1200
tree_clean_check
finish_step

copilot_prompt l2-dt-summary "Level 2" "Ask for the six-bullet decision summary" dt-summary 900 --continue
log_has 'playlist' && check "summary mentions the playlist capability" true || check "summary mentions the playlist capability" false
log_has '409|conflict|reject|duplicate' && check "summary states duplicate add is rejected" true || check "summary states duplicate add is rejected" false
log_has 'empty' && check "summary mentions the empty state" true || check "summary mentions the empty state" false
finish_step

step l2-git-status "Level 2" "Commit checkpoint: git status" literal 30 'git status'
tree_clean_check
finish_step

# ---------------------------------------------------------------- Level 3
copilot_prompt l3-research "Level 3" "RPI research (/rpi-research)" rpi-research 1800
for f in Program.cs tracks.json App.tsx; do
  log_has "$f" && check "research mentions $f" true || check "research mentions $f" false
done
tree_clean_check
finish_step

step l3-research-checkpoint "Level 3" "Research checkpoint (commit notes only if written)" translated 60 \
  'git status; if [ -n "$(git status --porcelain)" ]; then git add -A && git commit -m "Record RPI research notes"; else echo "no changes, no commit needed"; fi'
finish_step

copilot_prompt l3-plan "Level 3" "RPI plan (/rpi-plan)" rpi-plan 1800 --continue
log_has 'dotnet test' && check "plan includes dotnet test" true || check "plan includes dotnet test" false
log_has 'npm test' && check "plan includes npm test" true || check "plan includes npm test" false
tree_clean_check
finish_step

step l3-plan-checkpoint "Level 3" "Plan checkpoint: git status" translated 60 \
  'git status; if [ -n "$(git status --porcelain)" ]; then git add -A && git commit -m "Record RPI plan notes"; fi'
finish_step

copilot_prompt l3-implement "Level 3" "RPI implement (/rpi-implement)" rpi-implement 3600 --continue
[ -n "$(changed_outside_tracking)" ] && check "agent edited repository files" true "$(changed_outside_tracking | head -n 20)" \
  || check "agent edited repository files" false "no change outside .copilot-tracking/"
grep -rqs 'Your playlist is empty. Add a track to get started.' src/front/src \
  && check "exact empty-state text present in src/front/src" true || check "exact empty-state text present in src/front/src" false
finish_step

step l3-dotnet-test "Level 3" "Validate API tests" literal 900 'dotnet test'
log_has 'Passed!|passed' && check "dotnet test reports passing tests" true || check "dotnet test reports passing tests" false
finish_step

step l3-npm-test "Level 3" "Validate front-end tests" translated 600 'cd src/front && npm test'
grep -rqsE 'getByRole|findByRole|getAllByRole|findAllByRole|getByLabelText' src/front/src \
  && check "Testing Library queries use roles or labels" true || check "Testing Library queries use roles or labels" false
finish_step

# Run the app: the API on 5080 and the Vite dev server on 5173 (proxying /api).
(cd src/api && nohup dotnet run > "$RESULTS_DIR/steps/l3-api-server.log" 2>&1 &)
(cd src/front && nohup npm run dev -- --host 127.0.0.1 > "$RESULTS_DIR/steps/l3-front-server.log" 2>&1 &)
step l3-run-app "Level 3" "Run the app and exercise the playlist API" translated 300 \
  'for u in http://localhost:5080/api/hello http://127.0.0.1:5173/; do for i in $(seq 1 90); do curl -fsS -o /dev/null "$u" && break; sleep 2; done; curl -fsS -o /dev/null "$u" && echo "up $u" || { echo "down $u"; exit 1; }; done'
if [ "$STEP_CODE" -eq 0 ]; then
  s=$(http_status GET http://localhost:5080/api/tracks)
  c=$(node -e 'try{console.log(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).length)}catch{console.log(-1)}' "$RESULTS_DIR/http-last.json")
  [ "$s" = 200 ] && [ "$c" = 12 ] && check "GET /api/tracks returns 12 tracks" true || check "GET /api/tracks returns 12 tracks" false "status=$s count=$c"
  first=$(node -e 'try{const t=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));console.log(t[0].id)}catch{}' "$RESULTS_DIR/http-last.json")
  s=$(http_status GET http://localhost:5080/api/playlist)
  [ "$s" = 200 ] && check "GET /api/playlist returns 200" true "$(head -c 300 "$RESULTS_DIR/http-last.json")" || check "GET /api/playlist returns 200" false "status=$s"
  s=$(http_status POST http://localhost:5080/api/playlist/does-not-exist-999)
  [ "$s" = 404 ] && check "POST unknown track returns 404" true "$(head -c 300 "$RESULTS_DIR/http-last.json")" || check "POST unknown track returns 404" false "status=$s"
  s=$(http_status POST "http://localhost:5080/api/playlist/$first")
  case $s in 2??) check "POST existing track succeeds" true "status=$s";; *) check "POST existing track succeeds" false "status=$s id=$first";; esac
  s=$(http_status POST "http://localhost:5080/api/playlist/$first")
  [ "$s" = 409 ] && check "POST duplicate returns 409" true "$(head -c 300 "$RESULTS_DIR/http-last.json")" || check "POST duplicate returns 409" false "status=$s"
  s=$(http_status GET http://127.0.0.1:5173/api/tracks)
  [ "$s" = 200 ] && check "Vite dev server proxies /api" true || check "Vite dev server proxies /api" false "status=$s"
fi
note "browser checks (rendered list, empty state, duplicate message) are covered by Vitest and by the source checks above"
finish_step
pkill -f 'dotnet run' 2>/dev/null; pkill -f 'vite' 2>/dev/null

step l3-implement-commit "Level 3" "Commit implementation checkpoint" translated 60 \
  'git status; git add -A; git commit -m "Implement playlist slice with RPI"'
finish_step

copilot_prompt l3-review "Level 3" "RPI review (/rpi-review)" rpi-review 2400 --continue
log_has 'pass|fail' && check "review returns a pass/fail summary" true || check "review returns a pass/fail summary" false
finish_step

step l3-review-dotnet "Level 3" "Validate after review: dotnet test" literal 900 'dotnet test'
finish_step
step l3-review-npm "Level 3" "Validate after review: npm test" translated 600 'cd src/front && npm test'
finish_step

step l3-review-commit "Level 3" "Commit review checkpoint" translated 60 \
  'git status; git add -A; git commit -m "Review playlist slice" || echo "nothing to commit"'
tree_clean_check
finish_step

step break-status "Break" "Working tree clean before the break" literal 30 'git status'
tree_clean_check
finish_step

# ---------------------------------------------------------------- Level 4
step l4-copy-apm "Level 4" "Copy the solution manifest" translated 30 'cp solutions/afternoon-2/apm.yml ./apm.yml && cat apm.yml'
grep -q 'microsoft/hve-core#1dbd6a7ea90b74accaf8c809262e38952bd4c359' apm.yml \
  && check "apm.yml pins HVE-Core by SHA" true || check "apm.yml pins HVE-Core by SHA" false
finish_step

step l4-apm-install "Level 4" "Install the APM dependency" literal 1200 'apm install --target copilot'
[ -f apm.lock.yaml ] && check "apm.lock.yaml created" true || check "apm.lock.yaml created" false
grep -q 'resolved_commit' apm.lock.yaml 2>/dev/null && check "lockfile records resolved_commit" true "$(grep -m3 'resolved_commit' apm.lock.yaml)" \
  || check "lockfile records resolved_commit" false
finish_step

step l4-apm-audit "Level 4" "Audit in CI mode" literal 1200 'apm audit --ci'
finish_step

step l4-copy-policy "Level 4" "Copy the policy" translated 30 'cp solutions/afternoon-2/apm-policy.yml ./apm-policy.yml'
grep -q 'self_defined: deny' apm-policy.yml && check "policy denies self-defined MCP" true || check "policy denies self-defined MCP" false
grep -q '^targets:' apm-policy.yml && check "no top-level targets key" false || check "no top-level targets key" true
finish_step

step l4-policy-status "Level 4" "Confirm APM parses the policy" literal 300 'apm policy status --policy-source apm-policy.yml'
log_has 'found' && check "Outcome: found" true || check "Outcome: found" false
log_has 'block' && check "Enforcement: block" true || check "Enforcement: block" false
log_has 'warnings?[^a-z]*none' && check "Warnings: none" true || check "Warnings: none" false
finish_step

step l4-policy-audit "Level 4" "Audit with policy" literal 1200 'apm audit --ci --policy apm-policy.yml'
finish_step

step l4-deny-edit "Level 4" "Temporarily deny microsoft/hve-core in the policy" translated 30 \
  'awk '"'"'BEGIN{skip=0} /^dependencies:/{print "dependencies:\n  deny:\n    - \"microsoft/hve-core\"\n  require_pinned_constraint: true"; skip=1; next} skip && /^[^ #]/{skip=0} !skip{print}'"'"' apm-policy.yml > apm-policy.tmp && mv apm-policy.tmp apm-policy.yml && cat apm-policy.yml'
finish_step

step l4-deny-audit "Level 4" "Policy audit fails with exit code 1" literal 1200 'apm audit --ci --policy apm-policy.yml'
finish_step 1

step l4-restore-policy "Level 4" "Restore the solution policy and audit again" translated 1200 \
  'cp solutions/afternoon-2/apm-policy.yml ./apm-policy.yml && apm audit --ci --policy apm-policy.yml'
finish_step

step l4-copy-marketplace "Level 4" "Copy marketplace files" translated 30 \
  'mkdir -p .github/plugin .github/copilot && cp solutions/afternoon-2/.github/plugin/marketplace.json .github/plugin/marketplace.json && cp solutions/afternoon-2/.github/copilot/settings.json .github/copilot/settings.json && cp -R solutions/afternoon-2/plugins ./plugins'
grep -q 'music-catalog-marketplace' .github/plugin/marketplace.json && check "marketplace.json defines music-catalog-marketplace" true || check "marketplace.json defines music-catalog-marketplace" false
[ -f plugins/music-catalog-conventions/plugin.json ] && check "local plugin.json present" true || check "local plugin.json present" false
for f in agents/music-catalog-test-writer.agent.md skills/add-api-endpoint/SKILL.md; do
  [ -f "plugins/music-catalog-conventions/$f" ] && check "plugin file $f present" true || check "plugin file $f present" false
done
finish_step

step l4-settings-repo "Level 4" "Replace YOUR-ORG/YOUR-REPO in settings.json" translated 30 \
  "sed -i 's#YOUR-ORG/YOUR-REPO#$SANDBOX_REPO#g' .github/copilot/settings.json && cat .github/copilot/settings.json"
grep -q "$SANDBOX_REPO" .github/copilot/settings.json && check "settings.json points to the sandbox repository" true || check "settings.json points to the sandbox repository" false
finish_step

# push_fallback <step-id>: retry a rejected push with the tester token so later levels can still run.
push_fallback() {
  if [ "$STEP_CODE" -ne 0 ]; then
    note "git push with the Codespace credential failed; retrying with the tester token to continue the run"
    git -c credential.helper= -c credential.helper='!gh auth git-credential' push >> "$RESULTS_DIR/steps/$1.log" 2>&1 \
      && check "push succeeded with the tester token (fallback)" true || check "push succeeded with the tester token (fallback)" false
  fi
}

step l4-commit "Level 4" "Commit and push governed HVE and marketplace setup" translated 300 \
  'git status; git add apm.yml apm.lock.yaml apm-policy.yml .github plugins/music-catalog-conventions && git commit -m "Add governed HVE and plugin marketplace setup" && git push'
push_fallback l4-commit
git ls-files --error-unmatch .github/workflows/daily-backlog.lock.yml >/dev/null 2>&1 \
  && check "no workflow lock files committed in Level 4" false || check "no workflow lock files committed in Level 4" true
gh api "repos/$SANDBOX_REPO/contents/.github/plugin/marketplace.json" --jq .path >/dev/null 2>&1 \
  && check "marketplace.json is on the default branch" true || check "marketplace.json is on the default branch" false
untracked=$(git status --porcelain | head -n 30)
[ -n "$untracked" ] && note "left uncommitted after Level 4: $(echo "$untracked" | tr '\n' ' ')"
finish_step

step l4-marketplace-add "Level 4" "Register the team marketplace" literal 300 \
  "copilot plugin marketplace add $SANDBOX_REPO"
finish_step
step l4-marketplace-browse "Level 4" "Browse the team marketplace" literal 300 'copilot plugin marketplace browse music-catalog-marketplace'
finish_step
step l4-plugin-install "Level 4" "Install music-catalog-conventions" literal 300 'copilot plugin install music-catalog-conventions@music-catalog-marketplace'
finish_step

# ---------------------------------------------------------------- Level 5
step l5-ghaw-install "Level 5" "Install the gh-aw extension" literal 300 'gh extension install github/gh-aw'
if [ "$STEP_CODE" -ne 0 ] && log_has 'already installed'; then note "gh-aw already installed by the dev container (allowed)"; STEP_CODE=0; fi
gh aw version >/dev/null 2>&1 && check "gh aw command available" true || check "gh aw command available" false
finish_step

step l5-ghaw-init "Level 5" "Initialize the repository (gh aw init)" literal 300 'gh aw init'
finish_step

step l5-copy-workflows "Level 5" "Copy the solution workflows" translated 30 \
  'cp solutions/afternoon-2/.github/workflows/daily-backlog.md .github/workflows/daily-backlog.md && cp solutions/afternoon-2/.github/workflows/a11y-review.md .github/workflows/a11y-review.md'
finish_step

step l5-compile "Level 5" "Compile workflows (gh aw compile)" literal 600 'gh aw compile'
for w in daily-backlog a11y-review; do
  [ -f ".github/workflows/$w.lock.yml" ] && check "$w.lock.yml generated" true || check "$w.lock.yml generated" false
done
finish_step

step l5-review-diff "Level 5" "Review generated files without editing" translated 60 \
  'git status; git diff -- .github/workflows/daily-backlog.md .github/workflows/a11y-review.md'
finish_step

step l5-commit "Level 5" "Commit workflow sources and locks" translated 60 \
  'git status; git add -A && git commit -m "Add agentic backlog and accessibility workflows"'
for w in daily-backlog a11y-review; do
  git ls-files --error-unmatch ".github/workflows/$w.lock.yml" >/dev/null 2>&1 \
    && check "$w.lock.yml committed" true || check "$w.lock.yml committed" false
done
finish_step

step l5-push "Level 5" "Push your branch (Codespace credentials)" literal 300 'git push'
push_fallback l5-push
finish_step

step l5-seed-issues "Level 5" "Seed the backlog" translated 120 \
  "gh issue create -R $SANDBOX_REPO --title 'Show track count in the playlist panel' --body 'Display the number of tracks currently in the in-memory playlist.' && gh issue create -R $SANDBOX_REPO --title 'Add an API test for an unknown track id' --body 'Cover adding an unknown track id to the playlist with an xUnit test.'"
note "-R added so gh targets the sandbox repository explicitly"
seeded=$(gh issue list -R "$SANDBOX_REPO" --state open --json number --jq 'length' 2>/dev/null)
[ "${seeded:-0}" -ge 2 ] && check "at least two open issues" true "open=$seeded" || check "at least two open issues" false "open=${seeded:-unknown}"
finish_step

# wait_aw_run <step-id> <workflow> <title>
wait_aw_run() {
  local id=$1 wf=$2 title=$3 since run_id state concl
  # Two minutes of margin for clock skew between the Codespace and GitHub.
  since=$(date -u -d '-2 minutes' +%FT%TZ)
  step "$id" "Level 5" "$title" literal 300 "gh aw run $wf"
  local run_code=$STEP_CODE run_dur=$STEP_DUR
  run_id=""
  for _ in $(seq 1 30); do
    run_id=$(gh run list -R "$SANDBOX_REPO" --workflow "$wf.lock.yml" --event workflow_dispatch --limit 5 \
      --json databaseId,createdAt --jq "[.[] | select(.createdAt >= \"$since\")][0].databaseId // empty" 2>/dev/null)
    [ -n "$run_id" ] && break; sleep 10
  done
  if [ -z "$run_id" ]; then
    check "workflow run started" false "no $wf run found after gh aw run"
  else
    check "workflow run started" true "run $run_id"
    local waited=0
    while [ "$waited" -lt "$WORKFLOW_WAIT_S" ]; do
      state=$(gh run view "$run_id" -R "$SANDBOX_REPO" --json status --jq .status 2>/dev/null)
      [ "$state" = completed ] && break; sleep 30; waited=$((waited + 30))
    done
    concl=$(gh run view "$run_id" -R "$SANDBOX_REPO" --json conclusion --jq .conclusion 2>/dev/null)
    [ "$concl" = success ] && check "workflow run concluded success" true || check "workflow run concluded success" false "conclusion=${concl:-timeout}"
    gh run view "$run_id" -R "$SANDBOX_REPO" --log > "$RESULTS_DIR/steps/$id.run.log" 2>&1 || gh run view "$run_id" -R "$SANDBOX_REPO" --log-failed > "$RESULTS_DIR/steps/$id.run.log" 2>&1
    redact "$RESULTS_DIR/steps/$id.run.log"
  fi
  STEP_CODE=$run_code STEP_DUR=$run_dur
}

gh issue list -R "$SANDBOX_REPO" --state open --json number,title > "$RESULTS_DIR/issues-before-daily-backlog.json" 2>/dev/null
wait_aw_run l5-run-daily-backlog daily-backlog "Run daily backlog (gh aw run daily-backlog)"
# Filter titles locally instead of using --search, whose index can lag behind a just-created issue.
issue=""
for _ in 1 2 3 4 5 6; do
  issue=$(gh issue list -R "$SANDBOX_REPO" --state open --limit 50 --json number,title,body \
    --jq '[.[] | select(.title | startswith("[Daily backlog]"))][0] // empty' 2>/dev/null)
  [ -n "$issue" ] && break; sleep 10
done
if [ -n "$issue" ] && [ "$issue" != null ]; then
  echo "$issue" > "$RESULTS_DIR/daily-backlog-issue.json"
  echo "$issue" | grep -q 'Recommended implementation order' && check "summary has ## Recommended implementation order" true || check "summary has ## Recommended implementation order" false
  echo "$issue" | grep -q 'Can be developed in parallel' && check "summary has ## Can be developed in parallel" true || check "summary has ## Can be developed in parallel" false
else
  open=$(grep -o '"number"' "$RESULTS_DIR/issues-before-daily-backlog.json" 2>/dev/null | wc -l)
  note "no [Daily backlog] issue created; open issues before the run: $open (the workflow is designed to noop when there are none)"
  [ "$open" -eq 0 ] && check "noop expected because the sandbox had no open issues" true || check "[Daily backlog] issue created" false
fi
finish_step

wait_aw_run l5-run-a11y a11y-review "Run the accessibility workflow (gh aw run a11y-review)"
a11y=$(gh issue list -R "$SANDBOX_REPO" --state open --label accessibility --json number,title --jq 'length' 2>/dev/null)
note "accessibility issues open after the run: ${a11y:-unknown} (one issue or a noop are both expected)"
finish_step

step l5-git-status "Level 5" "Commit checkpoint: git status" literal 30 'git status'
tree_clean_check
finish_step

# ---------------------------------------------------------------- Level 6
P=$RESULTS_DIR/prompts
step l6-create-issue "Level 6" "Create the follow-up issue from the feature form" emulated 120 \
  "printf '### Problem statement\n\n%s\n\n### Expected outcome\n\n%s\n\n### Acceptance criteria\n\n%s\n\n### Area\n\n%s\n\n### Out of scope\n\n%s\n' \"\$(cat $P/issue-problem.txt)\" \"\$(cat $P/issue-outcome.txt)\" \"\$(cat $P/issue-acceptance.txt)\" \"\$(cat $P/issue-area.txt)\" \"\$(cat $P/issue-out-of-scope.txt)\" > $RESULTS_DIR/issue-body.md && gh issue create -R $SANDBOX_REPO --title \"\$(cat $P/issue-title.txt)\" --label enhancement --body-file $RESULTS_DIR/issue-body.md"
note "web issue form replaced by gh issue create with the lab's title and the same field labels"
ISSUE_URL=$(grep -Eo 'https://github.com/[^ ]+/issues/[0-9]+' "$RESULTS_DIR/steps/l6-create-issue.log" | tail -n1)
ISSUE_NUMBER=${ISSUE_URL##*/}
[ -n "$ISSUE_NUMBER" ] && check "issue created" true "$ISSUE_URL" || check "issue created" false
finish_step

step l6-prereqs "Level 6" "Confirm default-branch prerequisites" translated 120 \
  "gh api repos/$SANDBOX_REPO/contents/.github/workflows/copilot-setup-steps.yml --jq .path; gh api repos/$SANDBOX_REPO/contents/.github/agents --jq '.[].name' || true"
log_has 'copilot-setup-steps.yml' && check "copilot-setup-steps.yml on the default branch" true || check "copilot-setup-steps.yml on the default branch" false
RPI_AGENT=""
if log_has 'rpi-agent'; then RPI_AGENT=rpi-agent; check "RPI Agent file on the default branch" true; else
  check "RPI Agent file on the default branch" false "HVE-Core agent files deployed by APM are not committed by the Level 4 git add list"
fi
OWNER=${SANDBOX_REPO%%/*}; NAME=${SANDBOX_REPO##*/}
gh api graphql -f query="query{repository(owner:\"$OWNER\",name:\"$NAME\"){suggestedActors(capabilities:[CAN_BE_ASSIGNED],first:100){nodes{login}}}}" \
  --jq '.data.repository.suggestedActors.nodes[].login' >> "$RESULTS_DIR/steps/l6-prereqs.log" 2>&1
log_has 'copilot' && check "Coding Agent assignable in the repository" true || check "Coding Agent assignable in the repository" false
finish_step

if [ -z "${ISSUE_NUMBER:-}" ]; then
  skip_step l6-assign "Level 6" "Assign the issue to Coding Agent" "no issue was created"
else
  node -e '
    const fs=require("fs");
    const [repo, agent, file, out]=process.argv.slice(1);
    fs.writeFileSync(out, JSON.stringify({assignees:["copilot-swe-agent[bot]"],agent_assignment:{target_repo:repo,base_branch:"main",custom_instructions:fs.readFileSync(file,"utf8").trim(),custom_agent:agent,model:""}}));
  ' "$SANDBOX_REPO" "$RPI_AGENT" "$P/agent-instructions.txt" "$RESULTS_DIR/assign.json"
  step l6-assign "Level 6" "Assign the issue to Coding Agent with the RPI Agent" emulated 120 \
    "gh api --method POST -H 'Accept: application/vnd.github+json' repos/$SANDBOX_REPO/issues/$ISSUE_NUMBER/assignees --input $RESULTS_DIR/assign.json --jq '.assignees[].login'"
  note "UI assignment replaced by the documented REST call with agent_assignment (custom_agent='${RPI_AGENT:-none}')"
  finish_step

  # Wait for Copilot to open a PR that references the issue, then for the task to finish.
  step l6-pr "Level 6" "Coding Agent opens a PR that references the issue" emulated 60 'true'
  PR="" waited=0
  while [ "$waited" -lt "$CODING_AGENT_WAIT_S" ]; do
    # The sandbox is new, so any Copilot-authored PR is the one for this issue; avoids search-index lag.
    PR=$(gh pr list -R "$SANDBOX_REPO" --state all --limit 20 --json number,author \
      --jq '[.[] | select(.author.login | test("copilot"; "i"))][0].number // empty' 2>/dev/null)
    [ -n "$PR" ] && break; sleep 60; waited=$((waited + 60))
  done
  if [ -z "$PR" ]; then
    check "Copilot opened a PR" false "no PR after ${CODING_AGENT_WAIT_S}s"
  else
    check "Copilot opened a PR" true "PR #$PR"
    while [ "$waited" -lt "$CODING_AGENT_WAIT_S" ]; do
      title=$(gh pr view "$PR" -R "$SANDBOX_REPO" --json title --jq .title 2>/dev/null)
      case $title in \[WIP\]*) sleep 60; waited=$((waited + 60));; *) break;; esac
    done
    gh pr view "$PR" -R "$SANDBOX_REPO" --json number,title,body,isDraft,files,headRefName,url > "$RESULTS_DIR/coding-agent-pr.json" 2>&1
    gh pr checks "$PR" -R "$SANDBOX_REPO" > "$RESULTS_DIR/coding-agent-pr-checks.txt" 2>&1
    grep -q "#$ISSUE_NUMBER" "$RESULTS_DIR/coding-agent-pr.json" && check "PR references the issue" true || check "PR references the issue" false
    case $title in \[WIP\]*) check "Coding Agent finished within the wait budget" false "still WIP after ${CODING_AGENT_WAIT_S}s";; *) check "Coding Agent finished within the wait budget" true;; esac
    if grep -qE '"path":"(apm|\.copilot-tracking|README)' "$RESULTS_DIR/coding-agent-pr.json"; then note "PR touches files outside src/ and tests/; the validator should review scope"; fi
  fi
  STEP_DUR=$waited
  finish_step
fi

step l6-git-status "Level 6" "Commit checkpoint: git status" literal 30 'git status'
tree_clean_check
finish_step
