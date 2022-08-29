import json
from files.__main__ import app
from files.helpers.wrappers import *
from files.helpers.alerts import *
from files.helpers.get import *
from files.helpers.const import *
from files.helpers.wrappers import *
from files.helpers.blackjack import *
from files.helpers.slots import *
from files.helpers.lottery import *


@app.get("/casino")
@auth_required
def casino(v):
    participants = get_users_participating_in_lottery()
    return render_template("casino.html", v=v, participants=participants)


@app.post("/casino/slots")
@auth_required
def pull_slots(v):
    try:
        wager = int(request.values.get("wager"))
    except:
        return {"error": "Invalid wager."}

    try:
        currency = request.values.get("currency")
    except:
        return {"error": "Invalid currency (expected 'dramacoin' or 'marseybux')."}

    if (currency == "dramacoin" and wager > v.coins) or (currency == "marseybux" and wager > v.procoins):
        return {"error": f"Not enough {currency} to make that bet."}

    success, game_state = casino_slot_pull(v, wager, currency)

    if success:
        return {"game_state": game_state}
    else:
        return {"error": "Wager must be more than 100 {currency}."}

@app.get("/casino/blackjack")
@auth_required
def get_player_blackjack_status(v):
    game_state = get_safe_game_state(v)

    if game_state is not None:
        return {"active": True, "game_state": game_state}
    else:
        return {"active": False}

@app.post("/casino/blackjack")
@auth_required
def deal_blackjack(v):
    try:
        wager = int(request.values.get("wager"))
    except:
        return {"error": "Invalid wager."}

    try:
        currency = request.values.get("currency")
    except:
        return {"error": "Invalid currency (expected 'dramacoin' or 'marseybux')."}

    if (currency == "dramacoin" and wager > v.coins) or (currency == "marseybux" and wager > v.procoins):
        return {"error": f"Not enough {currency} to make that bet."}

    game = get_active_game(v)

    if game:
        return {"error": "This play is already playing a game."}

    success = deal_blackjack_game(v, wager, currency)

    if success:
        game_state = get_safe_game_state(v)

        return {"game_state": game_state}
    else:
        return {"error": "Wager must be more than 100 {currency}."}


@app.post("/casino/blackjack/action")
@auth_required
def player_took_blackjack_action(v):
    try:
        action = request.values.get("action")
    except:
        return {"error": "Invalid action."}

    game_state = get_safe_game_state(v)

    if not game_state:
        return {"error": "No game exists for player."}

    elif action == 'hit':
        gambler_hit(v)
    elif action == 'stay':
        gambler_stayed(v)
    elif action == 'double_down':
        gambler_doubled_down(v)
    elif action == 'insure':
        gambler_purchased_insurance(v)

    game_state = get_safe_game_state(v)

    if game_state:
        return {"active": True, "game_state": game_state}
    else:
        return {"active": False}
