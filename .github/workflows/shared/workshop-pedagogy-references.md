---
# Shared import for agentic workflows that review workshop guides.
# It has no `on:` field, so it is not compiled on its own.
---

## Pedagogy references

Judge every `workshop.md` against these published hands-on labs. They set the house style for how much to explain, how much information to give, and how the story unfolds step by step:

| Reference | What to borrow |
|-----------|----------------|
| [Azure Managed Redis hands-on lab](https://github.com/microsoft/hands-on-lab-azure-managed-redis/blob/main/docs/workshop.md) | One lab = one outcome. A short context paragraph and an architecture view come first. Theory is only as long as the next command needs. Each lab ends with a takeaway. |
| [Azure Serverless hands-on lab](https://github.com/microsoft/hands-on-lab-serverless/blob/main/docs/workshop.md) | An explicit reading contract up front: what a task box looks like, which panels the fast path can skip, and where the deep dive lives. Required inputs are stated; everything else stays default. |
| [GitHub Copilot hands-on lab (Philess/GHCopilotHoL)](https://github.com/Philess/GHCopilotHoL) | Levels that build on each other. Each step is one action, its prompt, and what you should observe. Side quests are clearly optional. |

All three use the same MOAW building blocks: front matter, `---` page separators between labs, `<details><summary>📚 Toggle solution</summary>` blocks for worked solutions and longer explanations, and short admonitions for warnings and tips.

## Review rubric

Apply each criterion level by level. Give a concrete location (file, heading, line) and the smallest fix.

1. **Progressive disclosure.** The visible path is: purpose (one or two sentences), then the next action, then **Success Criteria**. Definitions, comparisons, architecture background and methodology go into default-closed `<details>` blocks with a descriptive `<summary>`. Required commands, starter prompts, safety or licensing warnings and human approval gates are never hidden.
2. **Step-by-step learning.** One action per step, in execution order. Each command or prompt is introduced by what it does and why now. Success Criteria are observable (a file, an output, a behavior, a recorded decision), never "you understand X". No step relies on something introduced later.
3. **Storyline.** Each level opens by linking to what the learner just finished and ends with what it unlocks next. The scenario, names and artifacts stay consistent across levels. A learner can always tell where they are and why.
4. **Additional reading.** Deeper material is linked or folded, not inlined. Prefer one authoritative link per concept over several. Optional tracks and side quests are labelled as optional.
5. **Amount of information.** Flag passages that repeat, over-explain, list options the learner does not need, or mix two levels of detail. Prefer cutting or folding content over adding it. A shorter, clearer path that keeps the exercise contract is an improvement.
6. **Form and precision.** Flag ambiguous instructions, missing expected outputs, inconsistent terminology, broken anchors or images, and prompts or commands that can be misread. Keep MOAW page separators outside `<details>` blocks.

Any proposed change must keep the exercise contract: the prompts the workshop tester extracts from ` ```text ` blocks, the Success Criteria, page separators and approval gates.
