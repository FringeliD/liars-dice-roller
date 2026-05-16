# Architecture

Liar's Dice Roller is a dependency-free static browser app. It supports in-person table play by giving each player a private local dice tray.

## Runtime Model

Production hosting serves static files only. The app runs entirely in the browser.

No backend exists. The app does not:

- create game rooms;
- synchronize players;
- enforce turns;
- resolve challenges;
- track total table dice;
- require accounts or network state.

## Main Files

- `index.html`: application shell, controls, dialog, rules, and script load.
- `app.js`: all runtime behavior and state management.
- `styles.css`: all visual styling and CSS-rendered dice.
- `standalone.html`: single-file build for sharing/offline use.
- `serve.js`: optional local-network preview server.

## State

Persistent browser state is stored in `localStorage`:

```text
liarsDiceRollerState
```

Round color cycling uses `sessionStorage`:

```text
liarsDiceRollerColorIndex
```

The app validates saved state on load so old or malformed local storage does not break startup.

## Randomness

Dice use browser cryptographic randomness:

```js
crypto.getRandomValues(values)
```

Generated integers are mapped to die faces with `(value % 6) + 1`. This is practical for a casual table helper.

## Privacy Model

Privacy is a user-interface affordance, not cryptographic security.

The privacy cover hides the tray until the reveal button is held long enough. This reduces accidental reveals during table play.

## Optional Motion Support

Shake-to-roll uses `devicemotion` when available and permitted by the browser/device.

Behavior:

- setting must be enabled;
- permission is requested on platforms that require it;
- threshold and cooldown prevent repeated accidental rolls;
- regular reroll button remains the primary control.

## Standalone Release

`standalone.html` should mirror the behavior and styling of:

- `index.html`
- `styles.css`
- `app.js`

When a feature or bug fix changes the multi-file app, sync the standalone file before finishing.

## Known Gotchas

- Some browsers do not support motion events or require explicit user permission.
- `<dialog>` support has fallback handling, but dialog behavior should be manually tested.
- Touch target size matters more than desktop density.
- The app is intentionally advisory for bids and does not encode every house rule.
