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
    const reels = Array.from(document.querySelectorAll(".reel"));
    const symbols = response.symbols.split(",");

    for (let i = 0; i < 3; i++) {
      reels[i].innerHTML = symbols[i];
    }

    slotsResult.style.display = "block";
    slotsResult.innerText = response.text;

    if (response.text.includes("Won")) {
      if (response.text.includes("Jackpot")) {
        slotsResult.classList.add("text-warning");
      } else {
        slotsResult.classList.add("text-success");
      }
    } else if (response.text.includes("Lost")) {
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
function dealBlackjack() {
  const wager = document.getElementById("casinoBlackjackBet").value;
  const currency = document.querySelector(
    'input[name="casinoBlackjackCurrency"]:checked'
  ).value;

  document.getElementById("casinoBlackjackBet").disabled = true;
  document.getElementById("casinoBlackjackDeal").disabled = true;

  const xhr = new XMLHttpRequest();
  xhr.open("post", "/casino/blackjack");
  xhr.onload = handleBlackjackResponse.bind(null, xhr);

  const form = new FormData();
  form.append("formkey", formkey());
  form.append("wager", wager);
  form.append("currency", currency);

  xhr.send(form);
}

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
    console.log("Success.");
  } else {
    console.log("Failure.");
  }
}
