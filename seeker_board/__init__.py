import random

from otree.api import *
from datetime import datetime, timezone


class Player(BasePlayer):
    start_time = models.StringField(blank=True, initial="")
    end_time = models.StringField(blank=True, initial="")

    box0_multiplier = models.IntegerField(blank=True, initial=-1)
    box1_multiplier = models.IntegerField(blank=True, initial=-1)
    box2_multiplier = models.IntegerField(blank=True, initial=-1)
    box3_multiplier = models.IntegerField(blank=True, initial=-1)

    box0_is_selected = models.BooleanField(blank=True, initial=False)
    box1_is_selected = models.BooleanField(blank=True, initial=False)
    box2_is_selected = models.BooleanField(blank=True, initial=False)
    box3_is_selected = models.BooleanField(blank=True, initial=False)

    total_number_of_objects = models.IntegerField(blank=True, initial=-1)

    feedback = models.LongStringField(blank=True, initial="")


multipliers_sets_by_round = {
    1: [1, 1, 1, 1],
    2: [1, 1, 1, 3],
    3: [1, 2, 3, 4],
}

total_number_of_objects_by_round = {
    1: 48,
    2: 40,
    3: 25,
}


class SeekerBoard(Page):
    @staticmethod
    def js_vars(player: Player):
        return {
            'totalNumberOfObjects': total_number_of_objects_by_round[player.round_number],
            "multipliers":          multipliers_sets_by_round[player.round_number],
            'roundNumber':          player.round_number
        }

    @staticmethod
    def live_method(player: Player, data):
        print(data)
        action = data['action']
        if action == 'set_selection':
            selection = data['selection']
            for i in range(len(selection)):
                if i == 0:
                    player.box0_is_selected = selection[i]
                elif i == 1:
                    player.box1_is_selected = selection[i]
                elif i == 2:
                    player.box2_is_selected = selection[i]
                elif i == 3:
                    player.box3_is_selected = selection[i]




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
    NUM_ROUNDS = 3


class PreProcess(Page):
    @staticmethod
    def before_next_page(player: Player, timeout_happened):
        round_number = player.round_number
        multipliers = multipliers_sets_by_round[round_number]
        player.total_number_of_objects = total_number_of_objects_by_round[round_number]
        # random.shuffle(multipliers)
        player.box0_multiplier = multipliers[0]
        player.box1_multiplier = multipliers[1]
        player.box2_multiplier = multipliers[2]
        player.box3_multiplier = multipliers[3]
        player.start_time = str(datetime.now(timezone.utc))


class Feedback(Page):
    form_model = 'player'
    form_fields = ['feedback']

    @staticmethod
    def is_displayed(player: Player):
        return player.round_number == C.NUM_ROUNDS


page_sequence = [PreProcess, SeekerBoard, Feedback]
