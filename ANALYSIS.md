# Liar's Dice Roller Analysis

Source inspected: https://kevan.org/games/liarsdice

## Original Game

The original page is a private dice roller for physical, in-person Liar's Dice. It does not manage players, rooms, bids, turns, or challenges. Each player opens the page on their own device, keeps their roll hidden, and uses the page as a digital replacement for five physical dice.

Observed original behavior:

- Starts with five rolled dice.
- Shows a "Reroll dice" control.
- Shows a "Lose one die" control.
- Offers die display sizes: small, regular, large.
- Includes the full play rules on the page.
- Ones are wild and count as the bid face.
- On reload, the baize background cycles through six colors so players can sync colors and discourage illegal rerolls.
- A loser removes one die; zero dice means elimination.

## Remake Scope

This remake keeps the same gameplay model: every phone is still only a private dice tray for real-world table play. There is no online multiplayer state, no shared room, and no automatic challenge resolution because the original purpose is to support a physical group.

QoL and design updates added:

- Mobile-first layout with larger touch targets.
- CSS dice drawn locally, so the app has no image dependencies.
- Persisted dice count, size, and settings.
- Restore die button for mistakes or new games.
- Confirm-reroll dialog to reduce accidental rerolls.
- Privacy cover with hold-to-reveal behavior.
- Last-roll timestamp.
- Round color name for sync checks.
- Optional shake-to-roll support where the phone/browser allows it.
- Bid helper that shows normal raise examples and the 1s variant transition.
- No dependencies or build step.

## Files

- `index.html`: app markup and rules.
- `styles.css`: responsive felt-table visual design and dice rendering.
- `app.js`: dice rolling, persistence, privacy, settings, and bid helper.
- `serve.js`: optional local server for phones on the same network.
