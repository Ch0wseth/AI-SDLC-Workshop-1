#!/usr/bin/env bash
# Orchestrates one workshop tester run from a GitHub Actions runner.
#
#   orchestrate.sh setup    create the sandbox repository and the Codespace, wait until the Codespace is ready
#   orchestrate.sh run      start run-lab.sh inside the Codespace and wait for it to finish
#   orchestrate.sh collect  copy the lab results back to $OUT_DIR/lab
#   orchestrate.sh cleanup  delete the Codespace, the sandbox repository and orphaned sandboxes from older runs
#
# Required environment:
#   GH_TOKEN              tester token (create/delete repositories, Codespaces, workflows, issues, Coding Agent)
#   COPILOT_GITHUB_TOKEN  Copilot CLI token (fine-grained PAT with Copilot Requests); defaults to GH_TOKEN
#   SANDBOX_OWNER         user or organization that owns sandboxes
#   SANDBOX_NAME          sandbox repository name, must start with "workshop-tester-"
#   OUT_DIR               local output directory (uploaded as the run artifact)
# Optional: CODESPACE_MACHINE (default standardLinux32gb), LAB_TIMEOUT_S (default 14400),
#           SOURCE_REPO, SOURCE_SHA, RUN_URL (metadata for the report)
set -u

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
: "${OUT_DIR:?}" "${SANDBOX_OWNER:?}" "${SANDBOX_NAME:?}"
case $SANDBOX_NAME in workshop-tester-*) ;; *) echo "SANDBOX_NAME must start with workshop-tester-" >&2; exit 2;; esac
SANDBOX_REPO="$SANDBOX_OWNER/$SANDBOX_NAME"
CODESPACE_MACHINE=${CODESPACE_MACHINE:-standardLinux32gb}
# Budget within the 360-minute lab_run job: setup (<= 72 min) + lab + collect (10) + cleanup (<= 17).
LAB_TIMEOUT_S=${LAB_TIMEOUT_S:-14400}
export COPILOT_GITHUB_TOKEN=${COPILOT_GITHUB_TOKEN:-${GH_TOKEN-}}
STATE="$OUT_DIR/state.env"
SANDBOX_MARKER="Ephemeral workshop tester sandbox (safe to delete)"
export GH_PROMPT_DISABLED=1
mkdir -p "$OUT_DIR"
export RESULTS_DIR="$OUT_DIR/infra"
# shellcheck source=lib.sh
. "$SCRIPT_DIR/lib.sh"
touch "$STATE"
# shellcheck disable=SC1090
. "$STATE"

save_state() { printf '%s=%q\n' "$1" "$2" >> "$STATE"; }

cs_ssh() {
  # cs_ssh <command> : runs a login shell command inside the Codespace
  gh codespace ssh -c "$CODESPACE" -- "bash -lc $(printf '%q' "$1")"
}

setup() {
  printf '{"source_repo":"%s","source_sha":"%s","run_url":"%s","sandbox":"%s","machine":"%s"}\n' \
    "${SOURCE_REPO-}" "${SOURCE_SHA-}" "${RUN_URL-}" "$SANDBOX_REPO" "$CODESPACE_MACHINE" > "$OUT_DIR/meta.json"

  step infra-tokens infra "Tester secrets are configured" translated 30 \
    '[ -n "${GH_TOKEN-}" ] && echo "GH_TOKEN set" || { echo "WORKSHOP_TESTER_TOKEN secret is missing"; exit 1; }; gh api user --jq .login'
  finish_step
  [ "$STEP_CODE" -eq 0 ] || return 1

  if [ -n "${SOURCE_REPO-}" ]; then
    step infra-template preflight "Source repository is marked as a template (Level 0 says 'created from the workshop template')" translated 30 \
      "gh api repos/$SOURCE_REPO --jq .is_template"
    if log_has '^true'; then finish_step; else
      note "the repository is not a template, so participants cannot use 'Use this template'; the tester pushes a snapshot instead"
      record "$STEP_ID" "$STEP_LEVEL" "$STEP_TITLE" "$STEP_MODE" "$STEP_CMD" "$STEP_CODE" "$STEP_DUR" warn
    fi
  fi

  # A snapshot of the tested commit, with a single fresh commit like a repository created from a template.
  step infra-sandbox infra "Create the private sandbox repository from a snapshot of the tested commit" translated 600 "
    set -e
    tmp=\$(mktemp -d)
    git -C '$GITHUB_WORKSPACE' archive HEAD | tar -x -C \"\$tmp\"
    cd \"\$tmp\"
    git init -q -b main
    git -c user.name='Workshop Tester' -c user.email='workshop-tester@users.noreply.github.com' add -A
    git -c user.name='Workshop Tester' -c user.email='workshop-tester@users.noreply.github.com' commit -q -m 'Workshop snapshot of ${SOURCE_REPO-}@${SOURCE_SHA-}'
    gh repo create '$SANDBOX_REPO' --private --description '$SANDBOX_MARKER for ${SOURCE_REPO-}@${SOURCE_SHA-}'
    git push -q \"https://x-access-token:\$GH_TOKEN@github.com/$SANDBOX_REPO.git\" main
    echo created $SANDBOX_REPO"
  finish_step
  [ "$STEP_CODE" -eq 0 ] || return 1
  save_state SANDBOX_CREATED 1

  step infra-codespace infra "Create the Codespace on the sandbox" translated 1200 \
    "gh codespace create -R '$SANDBOX_REPO' -b main -m '$CODESPACE_MACHINE' --idle-timeout 120m --retention-period 1h --default-permissions"
  # The sandbox is new, so its only Codespace is the one just created. Parsing the create output is a fallback.
  CODESPACE=$(gh codespace list -R "$SANDBOX_REPO" --json name --jq '.[0].name // empty' 2>/dev/null)
  if [ -z "$CODESPACE" ]; then
    CODESPACE=$(grep -Eo '^[a-z0-9]+(-[a-z0-9]+)+$' "$RESULTS_DIR/steps/infra-codespace.log" | tail -n1)
  fi
  [ -n "$CODESPACE" ] && { check "Codespace created" true "$CODESPACE"; save_state CODESPACE "$CODESPACE"; } || check "Codespace created" false
  finish_step
  [ -n "$CODESPACE" ] || return 1

  step infra-ready infra "Codespace available and postCreateCommand finished" translated 2400 "
    for i in \$(seq 1 60); do
      s=\$(gh codespace view -c '$CODESPACE' --json state --jq .state 2>/dev/null); echo \"state=\$s\"
      [ \"\$s\" = Available ] && break; sleep 20
    done
    for i in \$(seq 1 80); do
      gh codespace ssh -c '$CODESPACE' -- \"bash -lc 'command -v copilot && command -v apm && gh aw version && test -d /workspaces/$SANDBOX_NAME/src/front/node_modules'\" && exit 0
      sleep 15
    done
    exit 1"
  finish_step
  [ "$STEP_CODE" -eq 0 ] || return 1

  step infra-env infra "Send tester credentials to the Codespace (file mode 600)" translated 120 \
    "printf 'export GH_TOKEN=%q\nexport COPILOT_GITHUB_TOKEN=%q\nexport SANDBOX_REPO=%q\n' \"\$GH_TOKEN\" \"\$COPILOT_GITHUB_TOKEN\" '$SANDBOX_REPO' | gh codespace ssh -c '$CODESPACE' -- 'umask 077; cat > ~/.workshop-tester.env && echo stored'"
  finish_step
}

run() {
  [ -n "${CODESPACE-}" ] || { echo "no Codespace, skipping the lab run"; return 1; }
  step infra-lab-start infra "Start run-lab.sh in the Codespace" translated 120 \
    "gh codespace ssh -c '$CODESPACE' -- \"bash -lc 'set -a; . ~/.workshop-tester.env; set +a; cd /workspaces/$SANDBOX_NAME && setsid nohup bash tests/workshop/afternoon-2/run-lab.sh > /tmp/workshop-tester-runner.log 2>&1 < /dev/null & echo started'\""
  finish_step
  [ "$STEP_CODE" -eq 0 ] || return 1

  local start waited=0 failures=0 out
  start=$(date +%s)
  while [ "$waited" -lt "$LAB_TIMEOUT_S" ]; do
    sleep 60
    waited=$(( $(date +%s) - start ))
    if out=$(cs_ssh 'test -f /tmp/workshop-tester/done && echo LAB_DONE; tail -n 2 /tmp/workshop-tester-runner.log' 2>&1); then
      failures=0
      echo "[$((waited / 60)) min] $(echo "$out" | tail -n 1)"
      echo "$out" | grep -q LAB_DONE && break
    else
      failures=$((failures + 1))
      echo "ssh poll failed ($failures): $out"
      [ "$failures" -ge 10 ] && break
    fi
  done
  STEP_ID=infra-lab-wait STEP_LEVEL=infra STEP_TITLE="Lab run finished inside the Codespace" STEP_MODE=translated STEP_CMD="poll /tmp/workshop-tester/done" STEP_DUR=$waited
  if echo "${out-}" | grep -q LAB_DONE; then STEP_CODE=0; else
    STEP_CODE=1
    [ "$failures" -ge 10 ] && note "lost SSH access to the Codespace" || note "lab did not finish within ${LAB_TIMEOUT_S}s"
  fi
  finish_step
}

collect() {
  [ -n "${CODESPACE-}" ] || return 0
  mkdir -p "$OUT_DIR/lab"
  step infra-collect infra "Copy lab results from the Codespace" translated 600 \
    "gh codespace ssh -c '$CODESPACE' -- \"bash -lc 'tar -czf - -C /tmp workshop-tester workshop-tester-runner.log 2>/dev/null | base64 -w0'\" > '$OUT_DIR/lab.b64' && base64 -d '$OUT_DIR/lab.b64' | tar -xz -C '$OUT_DIR/lab' && rm -f '$OUT_DIR/lab.b64' && ls -R '$OUT_DIR/lab' | head -n 50"
  finish_step
}

cleanup() {
  if [ -n "${CODESPACE-}" ]; then
    step infra-delete-codespace infra "Delete the Codespace" translated 300 "gh codespace delete -c '$CODESPACE' --force"
    finish_step
  fi
  if [ -n "${SANDBOX_CREATED-}" ]; then
    step infra-delete-sandbox infra "Delete the sandbox repository" translated 120 "gh repo delete '$SANDBOX_REPO' --yes"
    finish_step
  fi
  # Sweep sandboxes and Codespaces left by earlier runs that could not clean up (cancelled jobs, runner loss).
  step infra-sweep infra "Delete orphaned sandboxes and Codespaces from earlier runs" translated 600 "
    gh codespace list --json name,repository --jq '.[] | select(.repository | test(\"/workshop-tester-\")) | select(.repository != \"$SANDBOX_REPO\") | .name' |
      while read -r cs; do echo \"delete codespace \$cs\"; gh codespace delete -c \"\$cs\" --force; done
    gh repo list '$SANDBOX_OWNER' --limit 200 --json nameWithOwner,description --jq '.[] | select(.nameWithOwner | test(\"/workshop-tester-\")) | select((.description // \"\") | startswith(\"$SANDBOX_MARKER\")) | select(.nameWithOwner != \"$SANDBOX_REPO\") | .nameWithOwner' |
      while read -r r; do echo \"delete repo \$r\"; gh repo delete \"\$r\" --yes; done
    true"
  finish_step
  # Last line of defence: no token may leave the runner inside the artifact.
  grep -rlE '(gh[pousr]_|github_pat_)[A-Za-z0-9_]{20,}' "$OUT_DIR" 2>/dev/null | while read -r f; do redact "$f"; done
}

case ${1-} in
  setup) setup ;;
  run) run ;;
  collect) collect ;;
  cleanup) cleanup ;;
  *) echo "usage: $0 setup|run|collect|cleanup" >&2; exit 2 ;;
esac
# Never fail the job: the validation agent reads the recorded results, including infrastructure failures.
exit 0
