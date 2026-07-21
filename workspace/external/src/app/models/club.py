from dataclasses import dataclass

@dataclass
class Club:
    idClub: int
    name: str
    abbreviation: str
    is_player: int