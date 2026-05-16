# Liar's Dice Roller Technical Guide

This document explains how the app works internally and what to keep in mind when changing it.

## Project Type

This is a dependency-free static browser app. It does not use a frontend framework, package manager, compiler, bundler, backend, database, service worker, or online multiplayer layer.

The production app can be hosted as plain static files.

## Main Runtime Files

### `index.html`

Defines the application shell:

- top bar with privacy toggle
- current hand status panel
- dice tray
- reroll, lose, and restore actions
- display settings
- bid helper
- rules section
- privacy overlay
- reroll confirmation dialog
- script load for `app.js`

The JavaScript expects the current element IDs and `data-size` controls to exist. If markup IDs change, update the `elements` map in `app.js`.

### `app.js`

Contains all app behavior:

- state loading and validation
- cryptographic dice rolling
- local persistence
- dice count changes
- reroll confirmation flow
- shake-to-roll handling
- round color assignment
- privacy cover reveal timer
- display size switching
- bid helper calculation
- DOM rendering for dice pips

### `styles.css`

Provides all visual design:

- felt-table background
- color themes
- mobile-first layout
- status panels
- dice drawing
- action controls
- settings controls
- privacy cover
- dialog styling
- small-screen breakpoints

Dice are pure HTML/CSS. No dice image assets are required.

### `standalone.html`

Self-contained version of the app. It should mirror the behavior and styling of:

- `index.html`
- `styles.css`
- `app.js`

When making a feature change, update the multi-file app first, then sync the standalone file.

### `serve.js`

Optional development and local play server.

It:

- serves files from the repository directory
- listens on `0.0.0.0`
- defaults to port `4174`
- prints `localhost` and LAN phone URLs
- blocks path traversal outside the project directory

## State Model

Persistent state is stored in `localStorage` under:

```text
liarsDiceRollerState
```

Round color cycling uses `sessionStorage` under:

```text
liarsDiceRollerColorIndex
```

The saved state shape is:

| Field | Type | Meaning |
| --- | --- | --- |
| `count` | number | Number of active dice, clamped from 0 to 10. |
| `dice` | number[] | Current active dice faces. |
| `lostDice` | number[] | Removed dice values retained so restore can bring one back. |
| `size` | string | One of `small`, `regular`, or `large`. |
| `confirmReroll` | boolean | Whether rerolls require dialog confirmation. |
| `shakeToRoll` | boolean | Whether motion events can trigger rolls. |
| `lastRoll` | number | Timestamp in milliseconds for the last full roll. |

`loadState()` validates saved data so malformed or old local storage does not break startup.

## Randomness

Dice rolls use:

```js
crypto.getRandomValues(values)
```

This is preferable to `Math.random()` for a game utility because it uses the browser's cryptographic random source. Each generated integer is mapped to a die face with:

```js
(value % 6) + 1
```

This is simple and practical for this app. If the app were used for high-stakes fairness, rejection sampling would avoid modulo bias completely, but that is beyond the scope of a casual table helper.

## Privacy Cover

The privacy flow uses:

- `#privacyToggle` to cover the tray.
- `#privacyCover` as a full-screen overlay.
- `#revealButton` with a hold timer.

The reveal button must be held for 450ms before the cover hides. Pointer cancel/up/leave clears the timer.

This protects against quick accidental taps but is not meant as a security boundary. It is a table-play convenience.

## Shake To Roll

Shake support uses the `devicemotion` event.

Important behavior:

- It only rolls when `state.shakeToRoll` is enabled.
- iOS-style `DeviceMotionEvent.requestPermission()` is requested when available.
- A strength threshold and cooldown prevent rapid repeated rolls.
- If permission is denied or throws, the setting is disabled again.

Some desktop browsers and mobile browsers will not provide motion events. The regular reroll button remains the primary control.

## Bid Helper

The bid helper is deliberately advisory. It does not track the full game state or validate every possible table rule.

Given a previous bid quantity and face, it shows:

- normal raise examples
- the variant transition to or from 1s

Current examples:

- same face: increase quantity
- higher face: keep quantity and increase face when possible
- from non-1s to 1s: halve quantity, round down, then add one
- from 1s to another face: double quantity, then add one

If a group uses different house rules, update `updateBidHint()`.

## Browser Compatibility

The app relies on modern browser APIs:

- `crypto.getRandomValues`
- `localStorage`
- `sessionStorage`
- `<dialog>` with a fallback path when `showModal` is absent
- pointer events
- optional `DeviceMotionEvent`
- CSS grid and custom properties

The core rolling flow works without motion support.

## Maintenance Checklist

When changing behavior:

1. Update `app.js`.
2. Confirm `index.html` still contains the IDs and controls used by JavaScript.
3. Update `standalone.html` with the same behavior.
4. Run syntax checks:

```powershell
node --check app.js
node --check serve.js
```

5. Test at least these flows manually:

- initial load
- reroll with confirmation
- reroll without confirmation
- lose die
- restore die
- zero-dice state
- small, regular, and large dice sizes
- privacy cover and hold-to-reveal
- bid helper empty and populated states

When changing styling:

1. Test phone width around 360px.
2. Test tablet/desktop width around 780px.
3. Confirm buttons remain easy to tap.
4. Confirm dice do not overflow the tray.
5. Confirm status text truncates cleanly.

## Release Notes

The app is small enough that releases can be made by committing directly to `main` or tagging known-good states.

The existing `v0.1` tag preserves the first multi-file release. Future tags should note whether `standalone.html` was synced with the multi-file version.
