# Agent rules and best practices

Guidance for AI agents working in this repo. Goal: game ideas and POCs toward a shippable, side-income game (mobile, Steam, itch.io, etc.).

## Repo structure

- **`IDEAS.md`** — Index of all ideas (name, one-line, platform, status, notes). Keep the table up to date when adding or changing ideas.
- **`ideas/<name>.md`** — One design doc per idea (pitch, core loop, scope, monetization, risks). Source of truth for that idea.
- **`ideas/<name>/`** — POC or full project for an idea. Only create when work moves beyond the doc. All code and project files for that idea live here.
- **`assets/`** — Shared art, audio, fonts. Use across ideas and POCs; do not duplicate into each POC.

## Rules

1. **Ideas index** — When creating or renaming an idea, add or update the corresponding row in `IDEAS.md` (Name, One-line, Platform, Status, Notes). Name in the table must match the filename `ideas/<name>.md` and folder `ideas/<name>/`.
2. **One idea, one doc** — Each idea has exactly one `ideas/<name>.md`. Use kebab-case for `<name>` (e.g. `endless-runner.md`, `tower-defense.md`).
3. **POC under the idea** — New code for an idea goes in `ideas/<name>/`, not at repo root. Keep `ideas/<name>.md` updated when design changes.
4. **Shared assets** — Reference or suggest `assets/` for reusable art/audio/fonts; do not assume assets live inside a POC folder unless they are idea-specific.
5. **Platform-agnostic** — Do not assume an engine or platform (Unity, Godot, web, etc.). Follow the user’s choice per idea or POC.
6. **Scope** — Prefer small, shippable steps. For ideas, distinguish POC vs MVP vs full scope; for code, keep POCs minimal and runnable.

## Best practices

- **Read before changing** — Check `IDEAS.md` and the relevant `ideas/<name>.md` before adding features or new ideas so changes stay consistent.
- **Link, don’t duplicate** — In `IDEAS.md`, link to the idea doc (e.g. `[name](ideas/name.md)`); avoid repeating long descriptions.
- **Status flow** — Use status values: Backlog → In progress → In POC → Shipped | Dropped. Update status when work advances or is abandoned.
- **Design doc first** — When proposing a new idea, add a row to `IDEAS.md` and create or outline `ideas/<name>.md` before creating `ideas/<name>/` and writing code.
