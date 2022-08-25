function pullSlots() {
  const wager = document.getElementById("casinoSlotsBet").value;

  document.getElementById("casinoSlotsBet").disabled = true;
  document.getElementById("casinoSlotsPull").disabled = true;

  const xhr = new XMLHttpRequest();
  xhr.open("post", "/casino/slots");
  xhr.onload = handleSlotsResponse.bind(null, xhr);

  const form = new FormData();
  form.append("formkey", formkey());
  form.append("wager", wager);

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
    slotsResult.classList.add('text-danger')

    console.error(response.error);
  }

  document.getElementById("casinoSlotsBet").disabled = false;
  document.getElementById("casinoSlotsPull").disabled = false;
}
