from sqlalchemy import *
from files.__main__ import Base
from files.helpers.lazy import lazy
from files.helpers.const import *
import time


# --
# -- Name: casino_game_kind; Type: ENUM; Schema: public; Owner: -
# --

# CREATE TYPE public.casino_game_kind AS ENUM ('blackjack', 'slots');

# --
# -- Name: casino_game_currency; Type: ENUM; Schema: public; Owner: -
# --

# CREATE TYPE public.casino_game_currency AS ENUM ('coins', 'procoins');

# --
# -- Name: casino_games; Type: TABLE; Schema: public; Owner: -
# --

# CREATE TABLE public.casino_games (
#     id SERIAL PRIMARY KEY,
#     user_id integer NOT NULL REFERENCES public.users(id),
#     created_utc integer NOT NULL,
#     active boolean NOT NULL DEFAULT true,
#     currency public.casino_game_currency NOT NULL,
#     wager integer NOT NULL,
#     winnings integer NOT NULL, -- doubles as result, Δwinnings
#     kind public.casino_game_kind NOT NULL,
#     game_state jsonb NOT NULL
# );

class Casino_Game(Base):
    __tablename__ = "casino_games"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_utc = Column(Integer)
    active = Column(Boolean, default=True)
    currency = Column(String)
    wager = Column(Integer)
    winnings = Column(Integer)
    kind = Column(String)
    game_state = Column(JSON)

    def __init__(self, *args, **kwargs):
        if "created_utc" not in kwargs:
            kwargs["created_utc"] = int(time.time())
        super().__init__(*args, **kwargs)

    def __repr__(self):
        return f"<CasinoGame(id={self.id})>"
