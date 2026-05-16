# Liar's Dice Roller

Mobile-friendly private dice tray for in-person Liar's Dice games.

The app is inspired by the physical-table helper at `https://kevan.org/games/liarsdice`. It does not run an online game room or manage players. Each player opens the app on their own phone, privately rolls their own dice, and reveals only when the table calls a challenge.

## Features

- Five-dice starting hand.
- Secure browser-side random rolls using `crypto.getRandomValues`.
- Dice count tracking from 0 to 10.
- Lose one die and restore die controls.
- Reroll confirmation dialog.
- Local persistence for dice, count, size, and settings.
- Round color cycling through session storage to help players notice reloads/rerolls.
- Privacy cover with hold-to-reveal behavior.
- Last-roll timestamp.
- Optional shake-to-roll support on browsers/devices that allow motion permission.
- Bid helper for normal raises and the 1s variant transition.
- Responsive mobile-first design.
- CSS-rendered dice with no image assets.
- Standalone single-file version for easy sharing or offline use.

## Repository Layout

| Path | Purpose |
| --- | --- |
| `index.html` | Main multi-file app markup, controls, dialog, and rules. |
| `app.js` | Dice state, random rolling, persistence, privacy cover, motion handling, and bid helper. |
| `styles.css` | Mobile-first felt-table UI, responsive layout, dice rendering, and color themes. |
| `standalone.html` | Self-contained version with HTML, CSS, and JavaScript in one file. |
| `serve.js` | Optional local-network static server for testing on phones. |
| `ANALYSIS.md` | Notes from inspecting the original Liar's Dice helper and remake scope. |
| `CONNECTION_TEST.md` | Connection/testing notes retained from development. |
| `docs/technical-guide.md` | Deeper implementation, state, and maintenance documentation. |

## How To Use

### Direct Browser Use

Open either file in a browser:

- `standalone.html` for the single-file version.
- `index.html` for the multi-file version.

The standalone file is the easiest option to copy to a phone, send to another player, or host as one file.

### Local Network Use

Run the included server:

```powershell
node serve.js
```

Default local URL:

```text
http://localhost:4174
```

The server also prints LAN URLs for available IPv4 network interfaces, so phones on the same Wi-Fi can open the app.

## Gameplay Model

The app supports real-world table play:

1. Every player opens the app on their own device.
2. Everyone rolls privately.
3. Players make bids aloud.
4. A turn can raise the bid or challenge the previous bid.
5. On a challenge, everyone reveals their dice.
6. The loser removes one die.
7. A player with zero dice is out.

The app intentionally does not synchronize players, enforce turns, resolve challenges, or know how many total dice are on the table.

## Development Notes

No install step is required. The project uses only browser APIs and Node's built-in modules for the optional development server.

Useful checks:

```powershell
node --check app.js
node --check serve.js
```

Because there is no build step, changes to `index.html`, `styles.css`, or `app.js` are immediately reflected after refreshing the browser.

If behavior changes are made in the multi-file app, update `standalone.html` so the single-file release stays in sync.

## Version Notes

- `v0.1` preserves the first multi-file release.
- `main` includes the standalone HTML version.

See [docs/technical-guide.md](docs/technical-guide.md) for implementation details and maintenance guidance.

## Project Documentation

Future development context is kept in:

- [AGENTS.md](AGENTS.md) for durable project notes and maintenance rules.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for internal structure and design decisions.
- [docs/technical-guide.md](docs/technical-guide.md) for deeper implementation guidance.

Keep these docs updated when setup, architecture, gameplay behavior, commands, or maintenance procedures change.
