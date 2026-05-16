# Liar's Dice Roller Project Notes

This file is durable context for future coding agents. Read it before changing the repo.

## Project Identity

- Project: Liar's Dice Roller
- Owner and credited maintainer: FringeliD <fringeli.d@gmail.com>
- GitHub repo: https://github.com/FringeliD/liars-dice-roller
- Purpose: mobile-friendly private dice tray for in-person Liar's Dice games.

## Product Goals

- Give each player a private browser-based dice tray.
- Avoid online rooms, accounts, player synchronization, or turn enforcement.
- Work well on phones.
- Keep the project dependency-free and easy to share.
- Maintain both the multi-file app and the standalone single-file release.

## Repository Structure

- `index.html`: main multi-file app shell.
- `app.js`: dice logic, state, privacy cover, motion support, bid helper, rendering.
- `styles.css`: mobile-first felt-table UI and dice drawing.
- `standalone.html`: self-contained release version.
- `serve.js`: optional local-network static server.
- `ANALYSIS.md`: original inspiration and remake notes.
- `CONNECTION_TEST.md`: connection/testing notes.
- `docs/technical-guide.md`: detailed implementation and maintenance guide.
- `docs/ARCHITECTURE.md`: future-agent architecture and operating notes.

## Local Commands

Run syntax checks:

```powershell
node --check app.js
node --check serve.js
```

Start local network server:

```powershell
node serve.js
```

Default URL:

```text
http://localhost:4174
```

There is no install step, build step, package manager, backend, or automated test runner.

## Important Maintenance Rule

If behavior changes in the multi-file app, update `standalone.html` in the same change so the shareable offline version stays in sync.

## Safety Rules

- Use browser APIs only unless the owner asks for a larger architecture.
- Keep dice rolls private and local to the device.
- Do not add networking or multiplayer state without explicit direction.
- Preserve secure browser randomness via `crypto.getRandomValues`.
- Manually test core flows after behavior changes.

## Documentation Rule

Keep docs updated with every durable change.

Update at least one of these when setup, architecture, commands, gameplay behavior, or maintenance behavior changes:

- `README.md` for user-facing overview and usage.
- `AGENTS.md` for future-agent context and project rules.
- `docs/ARCHITECTURE.md` for internal structure and design decisions.
- `docs/technical-guide.md` for detailed implementation notes.
