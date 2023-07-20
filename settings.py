from os import environ

from otree.project_template.settings import SESSION_CONFIG_DEFAULTS

SESSION_CONFIG_DEFAULTS = dict(
    real_world_currency_per_point=1.00, participation_fee=1, doc="", currency="GBP", DEBUG=True
)
SESSION_CONFIGS = [
    {
        'name':                  'hider',
        'display_name':          "hider",
        'num_demo_participants': 1,
        'app_sequence':          ['hider', 'consent', 'exit'],
    }
]
ROOMS = [
    {"name": "hider", "display_name": "hider"},
]

# if you set a property in SESSION_CONFIG_DEFAULTS, it will be inherited by all configs
# in SESSION_CONFIGS, except those that explicitly override it.
# the session config can be accessed from methods in your apps as self.session.config,
# e.g. self.session.config['participation_fee']


PARTICIPANT_FIELDS = [
    "consent",
]
SESSION_FIELDS = []

# ISO-639 code
# for example: de, fr, ja, ko, zh-hans
LANGUAGE_CODE = 'en'

# e.g. EUR, GBP, CNY, JPY
USE_POINTS = False

ADMIN_USERNAME = 'admin'
# for security, best to set admin password in an environment variable
ADMIN_PASSWORD = "semd-admin"

DEMO_PAGE_INTRO_HTML = """ """

SECRET_KEY = '6162084313426'