from dataclasses import dataclass

@dataclass
class Tactic:
    idTeam: int
    pace: int = 1250
    endurance: int = 1250
    strength: int = 1250
    positioning: int = 1250
    ball_control: int = 1250
    passing: int = 1250
    shooting: int = 1250
    duel: int = 1250