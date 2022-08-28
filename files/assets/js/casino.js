// Slots
function pullSlots() {
  const wager = document.getElementById("casinoSlotsBet").value;
  const currency = document.querySelector(
    'input[name="casinoSlotsCurrency"]:checked'
  ).value;

  document.getElementById("casinoSlotsBet").disabled = true;
  document.getElementById("casinoSlotsPull").disabled = true;

  const xhr = new XMLHttpRequest();
  xhr.open("post", "/casino/slots");
  xhr.onload = handleSlotsResponse.bind(null, xhr);

  const form = new FormData();
  form.append("formkey", formkey());
  form.append("wager", wager);
  form.append("currency", currency);

  xhr.send(form);
}

function handleSlotsResponse(xhr) {
  let response;

  try {
    response = JSON.parse(xhr.response);
  } catch (error) {
    console.error(error);
  }

  const succeeded =
    xhr.status >= 200 && xhr.status < 300 && response && !response.error;
  const slotsResult = document.getElementById("casinoSlotsResult");
  slotsResult.classList.remove("text-success", "text-danger");

  if (succeeded) {
    const { game_state } = response;
    const state = JSON.parse(game_state);
    const reels = Array.from(document.querySelectorAll(".reel"));
    const symbols = state.symbols.split(",");

    for (let i = 0; i < 3; i++) {
      reels[i].innerHTML = symbols[i];
    }

    slotsResult.style.display = "block";
    slotsResult.innerText = state.text;

    if (state.text.includes("Won")) {
      if (state.text.includes("Jackpot")) {
        slotsResult.classList.add("text-warning");
      } else {
        slotsResult.classList.add("text-success");
      }
    } else if (state.text.includes("Lost")) {
      slotsResult.classList.add("text-danger");
    }
  } else {
    slotsResult.style.display = "block";
    slotsResult.innerText = response.error;
    slotsResult.classList.add("text-danger");

    console.error(response.error);
  }

  document.getElementById("casinoSlotsBet").disabled = false;
  document.getElementById("casinoSlotsPull").disabled = false;
}

// Blackjack
function handleBlackjackResponse(xhr) {
  let response;

  try {
    response = JSON.parse(xhr.response);
  } catch (error) {
    console.error(error);
  }

  const succeeded =
    xhr.status >= 200 && xhr.status < 300 && response && !response.error;
  const blackjackResult = document.getElementById("casinoBlackjackResult");
  blackjackResult.classList.remove("text-success", "text-danger");

  if (succeeded) {
    updateBlackjack(response.game_state);
  } else {
    blackjackResult.style.display = "block";
    blackjackResult.innerText = response.error;
    blackjackResult.classList.add("text-danger");

    console.error(response.error);
  }
}

function updateBlackjack(state) {
    const { player, dealer, status } = state;
    const lettersToSuits = {
      S: "♠️",
      H: "♥️",
      C: "♣️",
      D: "♦️",
    };
    const suitsToColors = {
      "♠️": "black",
      "♥️": "red",
      "♣️": "black",
      "♦️": "red",
    };

    // Clear everything.
    Array.from(document.querySelectorAll(".playing-card")).forEach((card) => {
      card.innerText = "";
      card.style.color = "unset";
      card.classList.remove("dealt");
    });

    // Show dealer cards.
    const dealerSlots = Array.from(
      document.querySelectorAll('.playing-card[data-who="dealer"]')
    );
    for (let i = 0; i < dealer.length; i++) {
      const slot = dealerSlots[i];

      if (slot) {
        // Technically, the dealer can use more than 5 cards, though it's rare.
        // In that case, the result message is good enough.
        // Thanks, Carp. 🐠
        slot.classList.add("dealt");

        if (i > 0 && status === "active") {
          break;
        }

        const rank = dealer[i][0];
        const suit = lettersToSuits[dealer[i][1]];
        const card = rank + suit;
        slot.innerText = card;
        slot.style.color = suitsToColors[suit];
      }
    }

    // Show player cards.
    const playerSlots = Array.from(
      document.querySelectorAll('.playing-card[data-who="player"]')
    );
    for (let i = 0; i < player.length; i++) {
      const slot = playerSlots[i];
      const rank = player[i][0];
      const suit = lettersToSuits[player[i][1]];
      const card = rank + suit;
      slot.innerText = card;
      slot.style.color = suitsToColors[suit];
      slot.classList.add("dealt");
    }

    updateBlackjackActions(state);
}

function buildBlackjackAction(id, method, title) {
  return `
    <button
      type="button"
      class="btn btn-secondary lottery-page--action"
      id="${id}"
      onclick="${method}()"
    >
      ${title}
    </button>
  `;
}

function updateBlackjackActions(state) {
  // Clear all actions first.
  const actionWrapper = document.getElementById("casinoBlackjackActions");
  actionWrapper.innerHTML = "";

  if (state.status === "active") {
    const actions = [];
    const hit = buildBlackjackAction(
      "casinoBlackjackHit",
      "hitBlackjack",
      "Hit"
    );
    const stay = buildBlackjackAction(
      "casinoBlackjackStay",
      "stayBlackjack",
      "Stay"
    );
    const double = buildBlackjackAction(
      "casinoBlackjackDouble",
      "doubleBlackjack",
      "Double Down"
    );

    actions.push(hit, stay, double);

    if (state.dealer[0][0] === "A" && !state.insured) {
      const insure = buildBlackjackAction(
        "casinoBlackjackInsure",
        "insureBlackjack",
        "Insure"
      );

      actions.push(insure);
    }

    actionWrapper.innerHTML = actions.join("\n");
  } else {
    // Game is over, deal a new game.
    document.getElementById("casinoBlackjackWager").style.display = "block";

    const deal = buildBlackjackAction(
      "casinoBlackjackDeal",
      "dealBlackjack",
      "Deal"
    );

    actionWrapper.innerHTML = deal;
  }
}

// == Blackjacktions
function dealBlackjack() {
  const wager = document.getElementById("casinoBlackjackBet").value;
  const currency = document.querySelector(
    'input[name="casinoBlackjackCurrency"]:checked'
  ).value;

  document.getElementById("casinoBlackjackBet").disabled = true;
  document.getElementById("casinoBlackjackDeal").disabled = true;
  document.getElementById("casinoBlackjackWager").style.display = "none";

  const xhr = new XMLHttpRequest();
  xhr.open("post", "/casino/blackjack");
  xhr.onload = handleBlackjackResponse.bind(null, xhr);

  const form = new FormData();
  form.append("formkey", formkey());
  form.append("wager", wager);
  form.append("currency", currency);

  xhr.send(form);
}

function takeBlackjackAction(action) {
  const xhr = new XMLHttpRequest();
  xhr.open("post", "/casino/blackjack/action");
  xhr.onload = handleBlackjackResponse.bind(null, xhr);

  const form = new FormData();
  form.append("formkey", formkey());
  form.append("action", action);

  xhr.send(form);
}

const hitBlackjack = takeBlackjackAction.bind(null, "hit");
const stayBlackjack = takeBlackjackAction.bind(null, "stay");
const doubleBlackjack = takeBlackjackAction.bind(null, "double");
const insureBlackjack = takeBlackjackAction.bind(null, "insure");

// When the casino loads, look up the "blackjack status" of a player to either start a new game or continue an existing game.
function checkBlackjackStatus() {
  const xhr = new XMLHttpRequest();
  xhr.open("get", "/casino/blackjack/1");
  xhr.onload = handleBlackjackStatusResponse.bind(null, xhr);
  xhr.send();
}

function handleBlackjackStatusResponse(xhr) {
  let response;

  try {
    response = JSON.parse(xhr.response);
  } catch (error) {
    console.error(error);
  }

  const succeeded =
    xhr.status >= 200 && xhr.status < 300 && response && !response.error;

  if (succeeded) {
    if (response.active) {
      updateBlackjack(response.game_state)
    }
  } else {
    console.error("error");
  }
}

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  checkBlackjackStatus();
} else {
  document.addEventListener("DOMContentLoaded", checkBlackjackStatus);
}
