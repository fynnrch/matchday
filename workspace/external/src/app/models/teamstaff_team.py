from dataclasses import dataclass

@dataclass
class Teamstaff_Team:
    idPerson: int
    idTeam: int
    from_season: int
    from_day: int
    to_season: int
    to_day: int