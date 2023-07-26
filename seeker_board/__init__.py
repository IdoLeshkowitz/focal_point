from otree.api import *
from datetime import datetime, timezone


class Player(BasePlayer):
    start_time = models.StringField(blank=True, initial="")
    end_time = models.StringField(blank=True, initial="")


class SeekerBoard(Page):
    @staticmethod
    def js_vars(player: Player):
        pass

    @staticmethod
    def live_method(player: Player, data):
        print(data)
        pass
    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        player.end_time = str(datetime.now(timezone.utc))
        player.participant.ended_successfully = True

class Group(BaseGroup):
    pass


class Subsession(BaseSubsession):
    pass


class C(BaseConstants):
    NAME_IN_URL = 'seeker_board'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1


class PreProcess(Page):
    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        player.start_time = str(datetime.now(timezone.utc))


page_sequence = [PreProcess, SeekerBoard]
