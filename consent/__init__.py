from otree.api import *
from datetime import datetime, timezone

doc = """
Your app description
"""


class C(BaseConstants):
    NAME_IN_URL = 'consent'
    PLAYERS_PER_GROUP = None
    NUM_ROUNDS = 1


class Subsession(BaseSubsession):
    pass


class Group(BaseGroup):
    pass


class Player(BasePlayer):
    start_time = models.StringField(initial=datetime.now(timezone.utc))
    end_time = models.StringField(blank=True, initial="")
    user_accepted_terms = models.BooleanField(label="Confirmation:", choices=[[True, "Yes, I agree to participate in the study"],
        [False, "No, I do not agree to participate in the study"]])
    prolific_id = models.StringField(label="Please enter your Prolific ID:", initial="")


# PAGES
class Consent(Page):
    form_model = "player"
    form_fields = ["user_accepted_terms", "prolific_id"]

    @staticmethod
    def app_after_this_page(player: Player, upcoming_apps):
        if player.user_accepted_terms == False:
            return upcoming_apps[-1]

    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        player.end_time = str(datetime.now(timezone.utc))
        player.participant.consent = player.user_accepted_terms


class PreProcess(Page):
    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        player.start_time = str(datetime.now(timezone.utc))


page_sequence = [PreProcess, Consent]
