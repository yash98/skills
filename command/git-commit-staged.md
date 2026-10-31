---
name: git-commit-staged
description: 'Create a git commit from already-staged changes using multi-type extension for conventional commit conventions. Use when the user asks to commit staged changes, or mentions "commit staged". Never stage new or unstaged changes.
disable-model-invocation: true
---
# Git Commit Staged with Extension for Multi-type Extension for Conventional Commits
## Overview
Create standardized, semantic git commits using the Conventional Commits specification. Analyze the actual staged diff to determine appropriate types, scopes, and message. If there are multiple types separate them with a comma.

## Conventional Commit Format
```
<type>[optional scope]: <description>
[optional body]
[optional footer(s)]
```

## Commit Types
| Type       | Purpose                        |
| ---------- | ------------------------------ |
| `feat`     | New feature                    |
| `fix`      | Bug fix                        |
| `docs`     | Documentation only             |
| `style`    | Formatting/style (no logic)    |
| `refactor` | Code refactor (no feature/fix) |
| `perf`     | Performance improvement        |
| `test`     | Add/update tests               |
| `build`    | Build system/dependencies      |
| `ci`       | CI/config changes              |
| `chore`    | Maintenance/misc               |
| `revert`   | Revert commit                  |

## Example
```
# Exclamation mark after type/scope
feat!: remove deprecated endpoint
# BREAKING CHANGE footer
feat: allow config to extend other configs
BREAKING CHANGE: `extends` key behavior changed
# If multiple types (e.g. feat + fix in same staged diff)
feat, fix: add rate limiting and correct header parsing bug
```

## Workflow
### 1. Analyze Staged Diff
```bash
# Use staged diff
git diff --staged
# Also check status
git status --porcelain
```

### 2. Generate Commit Message
Analyze the diff to determine:
- **Type**: What kind of change is this?
- **Scope**: What area/module is affected?
- **Description**: One-line summary of what changed (present tense, imperative mood, <72 chars)

### 3. Execute Commit
```bash
# Single line
git commit -m "<type>[scope]: <description>"
# Multi-line with body/footer
git commit -m "$(cat <<'EOF'
<type>[scope]: <description>
<optional body>
<optional footer>
EOF
)"
```

## Best Practices
- Present tense: "add" not "added"
- Imperative mood: "fix bug" not "fixes bug"
- Reference issues: `Closes #123`, `Refs #456`
- Keep description under 72 characters

## Git Safety Protocol
- NEVER update git config
- NEVER run destructive commands (--force, hard reset) without explicit request
- NEVER skip hooks (--no-verify) unless user asks
- NEVER force push to main/master
- If commit fails due to hooks, fix and create NEW commit (don't amend)
