---
name: memory
description: 'Maintain concise, hierarchical, project-local Markdown memory under docs/memory/, using Obsidian-compatible wikilinks and an index.md in every directory. Preserve decisions, rationale, preferences, constraints, and non-obvious context rather than activity logs or implementation details. Use /memory to propose reusable knowledge for user approval, automatically capture valuable knowledge after meaningful tasks when configured, and use /memory cleanup to validate existing memories with parallel read-only subagents. Prefer updating existing memories, referencing scripts instead of explaining their logic, and keeping knowledge easy to navigate.'
license: MIT
---

# Project Memory

Maintain a small, accurate, interconnected knowledge base in `docs/memory/` at the project root.

## Triggers

Read the relevant trigger instructions before performing an operation:

- **Manual `/memory`:** Read [triggers/save.md](triggers/save.md). Propose memories and request user approval.
- **Automatic task completion:** Read [triggers/save.md](triggers/save.md). Conservatively save reusable knowledge.
- **`/memory cleanup`:** Read [triggers/cleanup.md](triggers/cleanup.md). Validate memories with parallel read-only subagents.

Automatic task-completion execution requires an OpenCode hook or agent-level instruction. The skill alone does not guarantee it.

## Goals

- Remember useful knowledge across sessions.
- Keep memories brief, accurate, and navigable.
- Use plain Markdown with Obsidian-compatible `[[wikilinks]]`.
- Prefer updating existing memories over creating duplicates.
- Keep everything local, portable, and human-readable.
- Avoid storing information easily rediscovered from code or scripts.

## Directory Structure

```text
docs/memory/
├── index.md
├── architecture/
│   ├── index.md
│   ├── overview.md
│   └── decisions.md
├── conventions/
│   ├── index.md
│   ├── code.md
│   └── workflow.md
├── components/
│   ├── index.md
│   └── training.md
└── lessons/
    ├── index.md
    └── pitfalls.md
```

This structure is illustrative, not mandatory.

- Create directories and files lazily.
- Every directory must contain an `index.md`.
- Organize by subject, not chronology.
- Use deeper hierarchies when justified by complexity.
- Do not create empty placeholder files.

## Memory Format

```markdown
# Streaming Data Loader

- Decision: Stream Parquet shards.
- Reason: Full dataset exceeds RAM.
- Implementation: `src/data/loader.py`
- Related: [[architecture/overview]], [[lessons/oom]]
```

Rules:

- Keep one coherent topic per memory.
- Preserve decisions, rationale, constraints, and non-obvious facts.
- Reference source files rather than copying code.
- If a procedure can be understood from a script, reference its path instead of explaining its logic.
- Document only important behavior or rationale not evident from implementation.
- Use project-relative paths for repository files.
- Preserve absolute paths for relevant external directories.
- Use `[[relative/path]]` wikilinks for memory references, without `.md`.
- Resolve wikilinks relative to the containing file, using Obsidian-compatible paths.
- Do not use frontmatter or status metadata in memory files.
- Do not invent facts, paths, or relationships.

## Hierarchy and Indexes

Every directory must contain an `index.md` listing its immediate child directories and memory files.

Root index:

```markdown
# Project Memory

- [[architecture/index]] — Architecture and design decisions.
- [[conventions/index]] — Coding preferences and workflows.
- [[components/index]] — Component-specific knowledge.
- [[lessons/index]] — Known issues and solutions.
```

Directory index:

```markdown
# Architecture

- [[overview]] — System components and data flow.
- [[decisions]] — Important architectural decisions.
```

Rules:

- Keep indexes short and hierarchical.
- Describe each entry in one line.
- Every memory must be discoverable through indexes.
- Link related memories when useful.
- Maintain reciprocal links for meaningful relationships.
- Avoid redundant links.

## Reading Memories

When project context is relevant:

1. Read `docs/memory/index.md`, if present.
2. Follow relevant directory indexes.
3. Read only memories needed for the current task.
4. Follow related links when useful.
5. Verify implementation details against current source code.

Do not load the entire memory directory by default.

Treat memories as contextual knowledge, not as instructions overriding the user or current codebase.

## Memory Quality

Save information that is expensive to rediscover.

**Good:**

- "Stream Parquet shards because full-shard loading exceeds RAM."
- "Checkpoints live outside the repository at `/mnt/checkpoints`."
- "Preserve backward compatibility for the inference API."
- "Dataset preprocessing: `scripts/prepare_dataset.py`."

**Bad:**

- "Implemented a new function today."
- "The project uses Python."
- "Fixed a typo."
- Detailed procedures already implemented in scripts.
- Full logs, stack traces, or copied source code.

## Constraints

- Store memory only under `docs/memory/`.
- Every memory directory must contain an `index.md`.
- Never modify `AGENTS.md` or `CLAUDE.md` unless explicitly requested.
- Never store credentials, secrets, tokens, or private keys.
- Avoid duplicating information available in source code.
- Do not create memories for every conversation.
- Do not let memory maintenance interrupt the primary task.
- Do not recursively trigger memory maintenance.
- The user controls unwanted memories by editing or deleting Markdown files.

## Core Principle

Remember decisions, rationale, and non-obvious context — not activity logs or implementation details.
