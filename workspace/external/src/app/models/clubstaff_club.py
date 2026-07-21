from dataclasses import dataclass

@dataclass
class Clubstaff_Club:
    idPerson: int
    idTeam: int
    from_season: int
    from_day: int
    to_season: int
    to_day: int