# Save Memory

Use this workflow for manual `/memory` invocation and automatic task-completion memory capture.

Follow the shared rules in `../SKILL.md`.

## Manual: `/memory`

### 1. Discover

Review the current conversation and recent work.

Identify candidate memories involving:

- Architectural or design decisions.
- User preferences and coding conventions.
- Important constraints and dependencies.
- Relevant project and external directory relationships.
- Recurring problems, root causes, and solutions.
- Component contracts and invariants.

### 2. Search Existing Memories

- Read relevant indexes.
- Search for related or overlapping memories.
- Read existing entries before proposing changes.
- Identify duplicates, contradictions, and outdated information.

### 3. Propose

Present each candidate with:

- **Memory:** What should be remembered.
- **Reason:** Why it is useful.
- **Existing context:** Related memories, their paths, and relevant contents.
- **Action:** Create, update, or merge.
- **Proposed changes:** Exact content and destination file.

Group closely related candidates.

Prefer updating existing files over creating new ones.

### 4. Ask for Approval

Ask the user which candidates qualify for saving.

Allow the user to:

- Approve individual candidates.
- Reject candidates.
- Edit proposed content.
- Request merging with existing memories.

Do not write anything before approval.

### 5. Apply

After approval:

1. Apply only approved changes.
2. Create missing directories and indexes.
3. Update related wikilinks and backlinks.
4. Update affected directory indexes.
5. Verify links and consistency.

## Automatic: Task Completion

After a meaningful task finishes:

1. Identify reusable knowledge learned during the task.
2. Filter out trivial, temporary, speculative, or obvious information.
3. Search existing memories for related entries.
4. Update existing memories or create distinct new ones.
5. Update indexes and backlinks.
6. Verify consistency.

Automatic saving does not require user approval.

Be conservative: saving nothing is preferable to saving low-value information.

Do not silently overwrite contradictory user preferences. Ask when the correct interpretation is unclear.

Skip automatic capture during memory maintenance to avoid recursive triggering.

## Deduplication

Before writing:

- Check whether the information already exists.
- Update existing memories when appropriate.
- Merge overlapping content.
- Avoid contradictory active information.
- Preserve important rationale when decisions change.
- Do not accumulate task-by-task history.

## Final Verification

- All new memories are reachable through indexes.
- Every directory contains `index.md`.
- Wikilinks resolve.
- Referenced project paths are valid when verifiable.
- No unnecessary duplication exists.
- Memories remain concise and factual.
