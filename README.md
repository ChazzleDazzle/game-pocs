# Game POCs & Ideas

Experiments and proofs of concept toward a shippable game.

## Goal

Side income from a shipped game—mobile (App Store / Play Store), desktop (Steam, itch.io), or similar. This repo is for exploring ideas and building small POCs before committing to a full project.

## Repo structure

| Path | Description |
|------|-------------|
| `IDEAS.md` | Index of all ideas with status (backlog / in progress / in POC / shipped or dropped). |
| `ideas/` | One `.md` file per idea with details; when an idea moves to a POC, a subfolder `ideas/<idea-name>/` holds code and project files for that idea only. |
| `assets/` | Shared assets (art, audio, etc.) usable across ideas and POCs. |

## How to use

1. **Add or update ideas** in `IDEAS.md` (name, one-line, platform, status, notes).
2. **Flesh out a concept** in `ideas/<name>.md` (core loop, scope, monetization, risks).
3. **Start a POC** by creating `ideas/<name>/` and putting your project/code there; keep `ideas/<name>.md` as the design source of truth.
4. **Reuse assets** from `assets/` in any idea or POC.

## Platform / tech

Platform and engine (Unity, Godot, web, etc.) are chosen per POC. No single stack is assumed.

## Agent / AI instructions

See [AGENTS.md](AGENTS.md) for rules and best practices when working in this repo with an AI agent.
