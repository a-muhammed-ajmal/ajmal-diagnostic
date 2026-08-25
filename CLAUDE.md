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
Defined once in `AGENTS.md`. It outranks every other instruction in every file.
