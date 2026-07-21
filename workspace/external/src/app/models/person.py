from dataclasses import dataclass

@dataclass
class Person:
    idPerson: int
    first_name: str
    last_name: str
    age: int