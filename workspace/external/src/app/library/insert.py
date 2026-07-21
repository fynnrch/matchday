from faker import Faker
import random

from app.config import DB_NAME
from app.library.select import select_current_season, select_current_day, select_next_position

from app.models.club import Club
from app.models.team import Team
from app.models.team_league import Team_League

from app.models.person import Person
from app.models.clubstaff import Clubstaff
from app.models.clubstaff_club import Clubstaff_Club
from app.models.teamstaff import Teamstaff
from app.models.teamstaff_team import Teamstaff_Team
from app.models.player import Player
from app.models.player_team import Player_Team

# ===========
# Insert club
# ===========

def insert_club(conn):
    cseed = str(random.randint(0, 9)) + str(random.randint(0, 9)) + str(random.randint(0, 9)) + str(random.randint(0, 9)) + str(random.randint(0, 9))
    cname = "FC " + cseed
    cabbreviation = cseed

    club = Club(
        idClub=0,
        name=cname,
        abbreviation=cabbreviation,
        is_player=0
    )
    
    cursor = conn.cursor()

    cursor.execute(f"""
                INSERT INTO `{DB_NAME}`.`Clubs` (`name`, `abbreviation`, `is_player`)
                VALUES (%s, %s, %s);
            """, (
                club.name,
                club.abbreviation,
                club.is_player
    ))
    
    return cursor.lastrowid

def insert_team(conn, idClub):
    team = Team(
        idTeam=0,
        idClub=idClub,
        name="1. Team"
    )
    
    cursor = conn.cursor()

    cursor.execute(f"""
            INSERT INTO `{DB_NAME}`.`Teams` (`idClub`, `name`)
            VALUES (%s, %s);
        """, (
            team.idClub,
            team.name
    ))
    
    return cursor.lastrowid

def insert_team_to_league(conn, idTeam, idLeague):
    team_league = Team_League(
        idTeam=idTeam,
        idLeague=idLeague,
        season=select_current_season(conn),
        position=select_next_position(conn)
    )
    
    cursor = conn.cursor()

    cursor.execute(f"""
            INSERT INTO `{DB_NAME}`.`Teams_Leagues` (`idTeam`, `idLeague`, `season`, `position`)
            VALUES (%s, %s, %s, %s);
        """, (
            team_league.idTeam,
            team_league.idLeague,
            team_league.season,
            team_league.position
    ))

# =============
# Insert person
# =============

def insert_person(conn):
    fake = Faker("de_DE")

    person = Person(
        idPerson=0,
        first_name=fake.first_name(),
        last_name=fake.last_name(),
        age=random.randint(15, 30)
    )
    
    cursor = conn.cursor()

    cursor.execute(f"""
            INSERT INTO `{DB_NAME}`.`Persons` (`first_name`, `last_name`, `age`)
            VALUES (%s, %s, %s);
        """, (
            person.first_name,
            person.last_name,
            person.age
    ))
    
    return cursor.lastrowid
    
def insert_clubstaff(conn, idPerson):
    clubstaff = Clubstaff(
        idPerson=idPerson,
        value=random.randint(0, 50)
    )
    
    cursor = conn.cursor()

    cursor.execute(f"""
            INSERT INTO `{DB_NAME}`.`Clubstaff` (`idPerson`, `value`)
            VALUES (%s, %s);
        """, (
            clubstaff.idPerson,
            clubstaff.value
    ))

def insert_clubstaff_to_club(conn, idPerson, idTeam):
    clubstaff_Club = Clubstaff_Club(
        idPerson=idPerson,
        idTeam=idTeam,
        from_season=select_current_season(conn),
        from_day=select_current_day(conn),
        to_season=None,
        to_day=None
    )
    
    cursor = conn.cursor()

    cursor.execute(f"""
            INSERT INTO `{DB_NAME}`.`Clubstaff_Clubs` (`idPerson`, `idTeam`, `from_season`, `from_day`)
            VALUES (%s, %s, %s, %s);
        """, (
            clubstaff_Club.idPerson,
            clubstaff_Club.idTeam,
            clubstaff_Club.from_season,
            clubstaff_Club.from_day
    ))
    
def insert_teamstaff(conn, idPerson):
    teamstaff = Teamstaff(
        idPerson=idPerson,
        value=random.randint(0, 50)
    )
    
    cursor = conn.cursor()

    cursor.execute(f"""
            INSERT INTO `{DB_NAME}`.`Teamstaff` (`idPerson`, `value`)
            VALUES (%s, %s);
        """, (
            teamstaff.idPerson,
            teamstaff.value
    ))

def insert_teamstaff_to_team(conn, idPerson, idTeam):
    teamstaff_Team = Teamstaff_Team(
        idPerson=idPerson,
        idTeam=idTeam,
        from_season=select_current_season(conn),
        from_day=select_current_day(conn),
        to_season=None,
        to_day=None
    )
    
    cursor = conn.cursor()

    cursor.execute(f"""
            INSERT INTO `{DB_NAME}`.`Teamstaff_Teams` (`idPerson`, `idTeam`, `from_season`, `from_day`)
            VALUES (%s, %s, %s, %s);
        """, (
            teamstaff_Team.idPerson,
            teamstaff_Team.idTeam,
            teamstaff_Team.from_season,
            teamstaff_Team.from_day
    ))

def insert_player(conn, idPerson):
    player = Player(
        idPerson=idPerson,
        value=random.randint(0, 50)
    )
    
    cursor = conn.cursor()

    cursor.execute(f"""
            INSERT INTO `{DB_NAME}`.`Players` (`idPerson`, `value`)
            VALUES (%s, %s);
        """, (
            player.idPerson,
            player.value
    ))

def insert_player_to_team(conn, idPerson, idTeam):
    player_Team = Player_Team(
        idPerson=idPerson,
        idTeam=idTeam,
        from_season=select_current_season(conn),
        from_day=select_current_day(conn),
        to_season=None,
        to_day=None
    )
    
    cursor = conn.cursor()

    cursor.execute(f"""
            INSERT INTO `{DB_NAME}`.`Players_Teams` (`idPerson`, `idTeam`, `from_season`, `from_day`)
            VALUES (%s, %s, %s, %s);
        """, (
            player_Team.idPerson,
            player_Team.idTeam,
            player_Team.from_season,
            player_Team.from_day
    ))