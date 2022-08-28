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
        return { "game_state": game_state }
    else:
        return {"error": "Wager must be more than 100 {currency}."}

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
    
    success, game_state = casino_deal_blackjack(v, wager, currency)

    if success:
        return { "game_state": game_state }
    else:
        return {"error": "Wager must be more than 100 {currency}."}

@app.get("/casino/blackjack/<user_id>")
@auth_required
def get_player_blackjack_status(user_id, v):
    game = get_player_active_blackjack_game(int(user_id))

    if game:
        return {"active": True, "game_state": make_safe_blackjack_state(game.game_state)}
    else:
        return {"active": False}

@app.post("/casino/blackjack/action")
@auth_required
def player_took_blackjack_action(v):
    try:
        action = request.values.get("action")
    except:
        return {"error": "Invalid action."}

    game = get_player_active_blackjack_game(v.id)

    if not game:
        return {"error": "No game exists for player."}

    if action == 'stay':
        gambler_stayed(v)

    game = get_player_active_blackjack_game(v.id)

    if game.active:
        return {"active": True, "game_state": make_safe_blackjack_state(game.game_state)}
    else:
        return {"active": False, "game_state": game.game_state}


    