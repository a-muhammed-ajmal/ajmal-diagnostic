Follow `AGENTS.md` for repository engineering rules. Product behaviour and
requirements are governed by four documents. Cross-reference them by Document
ID, never by filename. The register is closed at four.

| ID | File | Governs |
| :---- | :---- | :---- |
| ANCHOR | `docs/ANCHOR.md` | Positioning, clients, sectors, commercial path, the four frameworks, claims. **Locked — never edit.** |
| PRODUCT | `docs/PRODUCT.md` | Business Health Check, the instrument, Business Clarity Audit |
| WEB | `docs/WEBSITE.md` | Public routes, navigation, pages, publishing |
| DESIGN | `.claude/skills/frontend-design/SKILL.md` | Colors, typography, components, accessibility |

Inspect the actual code and configuration before making assumptions. Before shipping, run the repository validation commands: `npm run lint`, `npm run test:coverage`, `npm run build`, and `npm run audit:type`. Follow `.claude/commands/ship.md` for the required documentation updates, verified commit identity, commit format, and direct `main` push.

## Rule Zero — verify, never assume

This rule outranks every other instruction, in this file or any other.

- Check whether a file exists. Do not assume it does.
- Read a file before editing it. Do not assume its contents.
- Diff a file before replacing it. Do not assume it matches.
- Run a command. Do not assume its result.

Anything said in any earlier message, in this conversation or any other,
is a claim to verify, not a fact to rely on. A file discussed before may
since have been edited, moved, or deleted. Verify before every action,
not once per session.

An instruction to move, edit, or delete a file that no longer exists is
NOT an error. Report "already absent" and continue.

Given a list of paths, verify every one before acting on any of them.

A task is complete only when you ran it and saw the output. Paste real
command output. Never summarize a run you did not perform. If you cannot
verify something, report "unverified" and stop. Absence of evidence is
not evidence.

Before deleting or overwriting any file, print enough of its contents
that the user can see what is being removed.
