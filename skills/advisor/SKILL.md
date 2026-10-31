---
name: advisor
description: 'Escalate a hard, already-attempted problem to a read-only Claude Code advisor session that diagnoses root cause and returns a concrete plan. Use when repeated fix attempts or web search have failed, the root cause is unclear, or you suspect you are solving the wrong problem. Never use for problems not yet attempted, or for simple lookups answerable via Web Search. Structures the problem, attempts so far, global context, and relevant file:line pointers into a fixed prompt, spawns a read-only "claude -p" session restricted to inspection-only tools, and returns a plan to verify and implement yourself.'
license: MIT
---

# Escalate to Advisor

You are the executor. When stuck, you spawn a separate, more senior Claude Code
session ("the advisor") to diagnose your problem. The advisor is read-only —
it investigates and advises, it does not edit files or write code for you.
Treat it like asking your tech lead for help: come with a clear problem
statement, what you already tried, and why it failed. Vague escalations waste
the advisor's turns and yours.

## Step 0 — Confirm you should escalate

Only escalate if ALL of these are true:
- You've made at least 1–2 concrete attempts to fix/solve it yourself.
- You can state specifically why each attempt failed (not "it didn't work").
- You're stuck on cause/approach, not on a fact you could find with Read/Grep/Web Search yourself.

If any of these are false, keep investigating first.

## Step 1 — Write the prompt file

Write the prompt EXACTLY in this structure to `/tmp/advisor_prompt_<timestamp>.txt`.
The instructions/role section (top part, before `## Problem`) is fixed —
copy it verbatim. You only fill in the four context sections below it.

```
You are a senior tech lead advising an intern who is stuck. You have
read-only access to inspect the codebase (Read, Grep, Glob, LSP, restricted
Bash for inspection, WebSearch/WebFetch). You cannot and must not edit files
or write full solutions in code form — give diagnosis and a concrete plan,
the intern will implement it.

Your job:
1. Identify the actual root cause (state explicitly if it differs from what
   the intern thinks the problem is).
2. Point out anything wrong or missing in the attempts already made.
3. Give a concrete, ordered next-steps plan. Be specific: name files,
   functions, commands to run, things to check — not generic advice.
4. You cannot ask a follow-up question, so if there are multiple plausible
   root causes or fixes, give a separate ordered plan for each, ranked most
   likely first — don't stop at only one candidate.

## Problem
<what is stuck, and why it is a problem — see guidance below>

## Attempts so far
<what was tried, and specifically why each attempt did not work>

## Global context
<brief context so the advisor can judge whether "the problem" above is the
real problem, or a symptom of something else>

## Relevant files
<relative/path:start_line-end_line pointers, with a one-line note on why each
is relevant — do not paste huge blocks, point at ranges>

## What I need from you
Root cause diagnosis + a concrete next-steps plan.
```

### Filling in each section

**Problem** — One clear statement of the symptom, plus the actual error/observed
behavior. Say what you expected instead. State why this blocks you (e.g. tests
fail, feature can't ship, contradictory behavior).

**Attempts so far** — For each attempt: what you changed, what you expected,
what actually happened, your best guess at why it didn't work. If you have no
guess, say "unclear why this didn't work" rather than omitting it.

**Global context** — 3–6 sentences max. What is this codebase/feature for,
what were you trying to accomplish overall (the task the problem came up
during), any constraints (framework, language version, must-not-break
things). Enough for the advisor to judge if you're chasing the right problem.

**Relevant files** — List specific `path:start-end` ranges, not whole files.
Order by relevance. One line each on why it matters (e.g. `src/parser.py:40-75
— the function raising the error`).

## Step 2 — Run the advisor session

Use your own current session name as `--name` so the escalation is traceable
back to you. Copy the command below exactly, only substituting the prompt
file path and session name:

```
claude --model sonnet \
  --name "<your-current-session-name>" \
  --allowedTools "Agent" "EnterPlanMode" "ExitPlanMode" "Glob" "Grep" \
    "ListAgents" "ListMcpResourcesTool" "ReadMcpResourceTool" \
    "WaitForMcpServers" "LSP" "Read" "Skill" "TaskCreate" "TaskGet" \
    "TaskList" "TaskOutput" "TaskStop" "TaskUpdate" "TodoWrite" "ToolSearch" \
    "WebFetch" "WebSearch" "Workflow" \
    "Bash(ls:*)" "Bash(pwd:*)" "Bash(wc:*)" "Bash(head:*)" "Bash(tail:*)" \
    "Bash(cat:*)" "Bash(less:*)" "Bash(more:*)" "Bash(find:*)" "Bash(tree:*)" \
    "Bash(file:*)" "Bash(stat:*)" "Bash(du:*)" "Bash(df:*)" "Bash(which:*)" \
    "Bash(whoami:*)" "Bash(date:*)" "Bash(env:*)" "Bash(printenv:*)" \
    "Bash(echo:*)" "Bash(grep:*)" "Bash(egrep:*)" "Bash(fgrep:*)" \
    "Bash(rg:*)" "Bash(ag:*)" "Bash(diff:*)" "Bash(cmp:*)" \
    "Bash(git status:*)" "Bash(git log:*)" "Bash(git diff:*)" \
    "Bash(git show:*)" "Bash(git branch:*)" "Bash(git tag:*)" \
    "Bash(git remote:*)" "Bash(git blame:*)" "Bash(git describe:*)" \
    "Bash(git rev-parse:*)" "Bash(git ls-files:*)" "Bash(git ls-remote:*)" \
    "Bash(git shortlog:*)" "Bash(git stash list:*)" "Bash(git fetch:*)" \
    "Bash(git grep:*)" "Bash(git config:*)" \
  --output-format json \
  -p < /tmp/advisor_prompt_<timestamp>.txt

```

## Step 3 — Use the response

- The advisor's plan is guidance, not ground truth — verify its file/line
  claims against the actual code before acting on them.
- If the advisor gave multiple ranked options, try the first one and check
  if it resolves the problem. If yes, move to its next step. If not, move on
  to the next option rather than mixing steps across options.
- Implement the plan yourself; the advisor does not make edits.
- If the advisor's diagnosis contradicts your "Problem" framing, trust the 
  diagnosis — that's the point of asking.
