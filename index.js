import { Plugin } from "@opencode/plugin"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.dirname(fileURLToPath(import.meta.url))

function stripFrontmatter(raw) {
  return raw.replace(/^---\n[\s\S]*?\n---\n*/, "").trimStart()
}

function frontmatterField(raw, field) {
  const match = raw.match(new RegExp(`^${field}:(?:\\s+|['"])((?:[^'"\n].*?))['"]?\\s*$`, "m"))
  return match ? match[1].trim() : undefined
}

async function exists(p) {
  return readdir(path.dirname(p))
    .then((entries) => entries.includes(path.basename(p)))
    .catch(() => false)
}

// Recursively collect every .md file under dir (skipped hidden dirs).
async function findMarkdownFiles(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...(await findMarkdownFiles(full)))
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      out.push(full)
    }
  }
  return out
}

export default Plugin.define({
  id: "skills",
  async setup(ctx) {
    // Auto-detect skills: skills/<name>/SKILL.md
    try {
      const skillsDir = path.join(root, "skills")
      const groups = await readdir(skillsDir, { withFileTypes: true })
      for (const group of groups) {
        // SKILL.md files may be nested in grouping directories, e.g. skills/engineering/tdd/SKILL.md
        const skillFile = path.join(skillsDir, group.name, "SKILL.md")
        const isDir = group.isDirectory()
        if (!(isDir && (await exists(skillFile)))) continue
        try {
          const raw = await readFile(skillFile, "utf8")
          const id = path.basename(group.name)
          await ctx.skill.transform((editor) => {
            editor.add({
              id,
              name: frontmatterField(raw, "name") ?? id,
              description: frontmatterField(raw, "description") ?? "",
              path: skillFile,
              content: stripFrontmatter(raw),
            })
          })
        } catch (error) {
          console.error(`[yash98/skills] failed to register skill ${group.name}:`, error)
        }
      }
    } catch {
      // No skills/ directory — nothing to register.
    }

    // Auto-detect commands: command/<name>.md or command/<name>/<name>.md,
    // including nested grouping directories (mirrors skills/ discovery).
    try {
      const commandsDir = path.join(root, "command")
      const files = await findMarkdownFiles(commandsDir)
      for (const commandFile of files) {
        try {
          const raw = await readFile(commandFile, "utf8")
          const name = path.basename(commandFile, ".md")
          const body = stripFrontmatter(raw)
          await ctx.command.transform((editor) => {
            editor.add({
              name,
              description: frontmatterField(raw, "description") ?? "",
              execute: async ({ sessionID }) => {
                await ctx.session.prompt({
                  sessionID,
                  text: `Run the /${name} command.\n\nFollow these instructions exactly:\n\n${body}`,
                })
              },
            })
          })
        } catch (error) {
          console.error(`[yash98/skills] failed to register command ${commandFile}:`, error)
        }
      }
    } catch {
      // No command/ directory — nothing to register.
    }
  },
})
