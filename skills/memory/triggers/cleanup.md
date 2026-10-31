# Cleanup Memory

Use this workflow for `/memory cleanup`.

Follow the shared rules in `../SKILL.md`.

## 1. Discover

- Recursively enumerate Markdown files under `docs/memory/`.
- Exclude `index.md` files from individual content validation.
- Read the index hierarchy.
- Identify relevant source files, scripts, and external references.

## 2. Validate with Subagents

Spawn one read-only subagent per memory file, in parallel where possible.

For large collections, use bounded parallel batches.

Each subagent must:

1. Read its assigned memory file.
2. Inspect relevant code, scripts, configuration, and documentation.
3. Verify factual claims against the current codebase.
4. Check referenced paths and files.
5. Identify incorrect, outdated, redundant, or unverifiable information.
6. Identify implementation descriptions replaceable by script references.
7. Find overlapping or contradictory related memories.
8. Return proposed corrections with supporting file paths and line references.

Subagents must not modify files.

### Subagent Output

Each subagent should return:

```markdown
## File
docs/memory/architecture/decisions.md

## Findings
- Claim: ...
- Evidence: `src/module.py:42`
- Issue: Outdated / Incorrect / Duplicate / Unverified
- Proposed change: ...

## Related Memories
- [[architecture/overview]]
```

Report only actionable findings. If a file is valid, return a brief confirmation.

Do not assume a memory is incorrect merely because supporting evidence cannot be found.

## 3. Consolidate

The parent agent must:

- Collect subagent findings.
- Deduplicate overlapping findings.
- Resolve cross-file contradictions.
- Identify opportunities to merge or split memories.
- Validate index hierarchy and backlinks.
- Check for broken links and orphaned memories.
- Distinguish confirmed inaccuracies from uncertain findings.

## 4. Propose Changes

Present a concise cleanup report containing:

- Memory file.
- Problem identified.
- Supporting evidence.
- Proposed correction, merge, or deletion.

Group related changes.

Ask for user approval before modifying or deleting memories.

## 5. Apply Approved Changes

After approval:

1. Apply selected corrections.
2. Merge or delete approved memories.
3. Update indexes and backlinks.
4. Remove broken references.
5. Verify hierarchy, links, and consistency.

Do not delete memories merely because their supporting implementation cannot be located.

## Constraints

- Subagents are read-only.
- Only the parent agent applies approved changes.
- Never delete or rewrite memories without user approval during manual cleanup.
- Preserve useful historical rationale.
- Do not introduce status tracking, tombstones, or archival metadata.
- Do not trigger automatic memory capture during cleanup.
