const stateKey = "liarsDiceRollerState";
const colorKey = "liarsDiceRollerColorIndex";

const tableColors = [
  ["green", "Green"],
  ["red", "Red"],
  ["blue", "Blue"],
  ["purple", "Purple"],
  ["gold", "Gold"],
  ["slate", "Slate"]
];

const pipMap = {
  1: ["p5"],
  2: ["p1", "p9"],
  3: ["p1", "p5", "p9"],
  4: ["p1", "p3", "p7", "p9"],
  5: ["p1", "p3", "p5", "p7", "p9"],
  6: ["p1", "p3", "p4", "p6", "p7", "p9"]
};

const elements = {
  tray: document.querySelector("#tray"),
  diceCount: document.querySelector("#diceCount"),
  tableColorName: document.querySelector("#tableColorName"),
  lastRollTime: document.querySelector("#lastRollTime"),
  rerollButton: document.querySelector("#rerollButton"),
  loseButton: document.querySelector("#loseButton"),
  gainButton: document.querySelector("#gainButton"),
  confirmReroll: document.querySelector("#confirmReroll"),
  shakeToRoll: document.querySelector("#shakeToRoll"),
  privacyToggle: document.querySelector("#privacyToggle"),
  privacyCover: document.querySelector("#privacyCover"),
  revealButton: document.querySelector("#revealButton"),
  rerollDialog: document.querySelector("#rerollDialog"),
  bidQuantity: document.querySelector("#bidQuantity"),
  bidFace: document.querySelector("#bidFace"),
  bidHint: document.querySelector("#bidHint"),
  clearBid: document.querySelector("#clearBid"),
  sizeButtons: [...document.querySelectorAll("[data-size]")]
};

let state = loadState();
let revealTimer = null;
let lastShake = 0;

applyRoundColor();
render();

elements.rerollButton.addEventListener("click", () => {
  if (state.confirmReroll && elements.rerollDialog.showModal) {
    elements.rerollDialog.showModal();
    return;
  }
  rollDice();
});

elements.rerollDialog.addEventListener("close", () => {
  if (elements.rerollDialog.returnValue === "roll") {
    rollDice();
  }
});

elements.loseButton.addEventListener("click", () => {
  if (state.count === 0) return;
  state.count -= 1;
  const removed = state.dice.pop();
  if (removed) state.lostDice.push(removed);
  saveAndRender();
});

elements.gainButton.addEventListener("click", () => {
  if (state.count >= 10) return;
  state.count += 1;
  state.dice.push(state.lostDice.pop() || roll(1)[0]);
  saveAndRender();
});

elements.confirmReroll.addEventListener("change", (event) => {
  state.confirmReroll = event.target.checked;
  saveAndRender();
});

elements.shakeToRoll.addEventListener("change", async (event) => {
  state.shakeToRoll = event.target.checked;
  saveAndRender();
  if (event.target.checked && typeof DeviceMotionEvent !== "undefined" && DeviceMotionEvent.requestPermission) {
    try {
      const result = await DeviceMotionEvent.requestPermission();
      if (result !== "granted") {
        state.shakeToRoll = false;
        saveAndRender();
      }
    } catch {
      state.shakeToRoll = false;
      saveAndRender();
    }
  }
});

window.addEventListener("devicemotion", (event) => {
  if (!state.shakeToRoll) return;
  const acc = event.accelerationIncludingGravity;
  if (!acc) return;
  const strength = Math.abs(acc.x || 0) + Math.abs(acc.y || 0) + Math.abs(acc.z || 0);
  const now = Date.now();
  if (strength > 34 && now - lastShake > 1400) {
    lastShake = now;
    rollDice();
  }
});

elements.sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.size = button.dataset.size;
    saveAndRender();
  });
});

elements.privacyToggle.addEventListener("click", () => {
  elements.privacyCover.hidden = false;
  elements.privacyToggle.setAttribute("aria-pressed", "true");
});

elements.revealButton.addEventListener("pointerdown", () => {
  revealTimer = window.setTimeout(() => {
    elements.privacyCover.hidden = true;
    elements.privacyToggle.setAttribute("aria-pressed", "false");
  }, 450);
});

["pointerup", "pointercancel", "pointerleave"].forEach((type) => {
  elements.revealButton.addEventListener(type, () => window.clearTimeout(revealTimer));
});

elements.bidQuantity.addEventListener("input", updateBidHint);
elements.bidFace.addEventListener("change", updateBidHint);
elements.clearBid.addEventListener("click", () => {
  elements.bidQuantity.value = "";
  elements.bidFace.value = "";
  updateBidHint();
});

function loadState() {
  const fallback = {
    count: 5,
    dice: roll(5),
    lostDice: [],
    size: "regular",
    confirmReroll: true,
    shakeToRoll: false,
    lastRoll: Date.now()
  };

  try {
    const saved = JSON.parse(localStorage.getItem(stateKey));
    if (!saved || !Array.isArray(saved.dice)) return fallback;
    const savedCount = Number(saved.count);
    const loaded = {
      ...fallback,
      ...saved,
      count: Number.isFinite(savedCount) ? clamp(savedCount, 0, 10) : fallback.count,
      dice: saved.dice.filter(isDieFace).slice(0, 10),
      lostDice: Array.isArray(saved.lostDice) ? saved.lostDice.filter(isDieFace).slice(0, 10) : []
    };
    while (loaded.dice.length < loaded.count) loaded.dice.push(roll(1)[0]);
    loaded.dice = loaded.dice.slice(0, loaded.count);
    return loaded;
  } catch {
    return fallback;
  }
}

function applyRoundColor() {
  const current = Number(sessionStorage.getItem(colorKey) || 0);
  const next = Number.isFinite(current) ? current : 0;
  sessionStorage.setItem(colorKey, String((next + 1) % tableColors.length));
  const [className, colorName] = tableColors[next % tableColors.length];
  document.body.classList.add(`color-${className}`);
  elements.tableColorName.textContent = colorName;
}

function rollDice() {
  state.dice = roll(state.count);
  state.lostDice = [];
  state.lastRoll = Date.now();
  saveAndRender();
  if (navigator.vibrate) navigator.vibrate(35);
}

function roll(count) {
  const values = new Uint32Array(count);
  crypto.getRandomValues(values);
  return [...values].map((value) => (value % 6) + 1);
}

function saveAndRender() {
  localStorage.setItem(stateKey, JSON.stringify(state));
  render();
}

function render() {
  elements.diceCount.textContent = String(state.count);
  elements.lastRollTime.textContent = state.lastRoll ? new Date(state.lastRoll).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "New game";
  elements.confirmReroll.checked = state.confirmReroll;
  elements.shakeToRoll.checked = state.shakeToRoll;
  elements.loseButton.disabled = state.count === 0;
  elements.gainButton.disabled = state.count >= 10;
  document.documentElement.style.setProperty("--die-size", sizeToPixels(state.size));

  elements.sizeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.size === state.size);
  });

  elements.tray.replaceChildren(...state.dice.map(createDie));
  if (state.dice.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "No dice left";
    empty.className = "empty";
    elements.tray.append(empty);
  }

  updateBidHint();
}

function createDie(face) {
  const die = document.createElement("div");
  die.className = "die";
  die.dataset.face = String(face);
  die.setAttribute("role", "img");
  die.setAttribute("aria-label", `Die showing ${face}`);

  pipMap[face].forEach((position) => {
    const pip = document.createElement("span");
    pip.className = `pip ${position}`;
    die.append(pip);
  });

  return die;
}

function sizeToPixels(size) {
  if (size === "small") return "56px";
  if (size === "large") return "104px";
  return "76px";
}

function updateBidHint() {
  elements.bidQuantity.value = elements.bidQuantity.value.replace(/\D/g, "").slice(0, 2);
  const quantity = Number(elements.bidQuantity.value);
  const face = Number(elements.bidFace.value);
  if (!quantity || !face) {
    elements.bidHint.textContent = "Enter the previous bid to show legal raise examples.";
    return;
  }

  const sameFace = `${quantity + 1} ${face}s`;
  const higherFace = face < 6 ? `${quantity} ${face + 1}s` : null;
  const variant = face === 1
    ? `${quantity * 2 + 1} 2s or higher`
    : `${Math.floor(quantity / 2) + 1} 1s`;

  const examples = higherFace ? `${sameFace}, ${higherFace}` : sameFace;
  elements.bidHint.textContent = `Normal raises: ${examples}. Variant move: ${variant}.`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isDieFace(value) {
  return Number.isInteger(value) && value >= 1 && value <= 6;
}
