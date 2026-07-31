from app.library.insert import insert_club, insert_team, insert_tactic, insert_team_to_league, insert_person, insert_player, insert_player_to_team
from app.library.select import select_missing_teams

def npc_fill(conn):
    for idLeague, missingTeams in missing_teams_fetch(conn).items():
        for i in range(missingTeams, 0, -1):
            club_create(conn, idLeague)

def missing_teams_fetch(conn):
    try:
        result = select_missing_teams(conn)
        
        print("Service: npc_fill/missing_teams_fetch -> Res: True")
        return result
    except Exception as e:
        print(f"Service: npc_fill/missing_teams_fetch -> Res: False\nException {e}")
        return {}


def club_create(conn, idLeague):
    try:
        idClub = insert_club(conn)
        idTeam = insert_team(conn, idClub)
        insert_tactic(conn, idTeam)
        insert_team_to_league(conn, idTeam, idLeague)
        
        playerAmount = 15
        for i in range(playerAmount, 0, -1):
            player_assign(conn, idTeam)

        conn.commit()
        print("Service: npc_fill/club_create -> Res: True")
        
    except Exception as e:
        conn.rollback()
        print(f"Service: npc_fill/club_create -> Res: False\nException: {e}")

def player_assign(conn, idTeam):
    try:
        idPerson = insert_person(conn)
        insert_player(conn, idPerson)
        insert_player_to_team(conn, idPerson, idTeam)

        conn.commit()
        print("Service: npc_fill/player_assign -> Res: True")
        
    except Exception as e:
        conn.rollback()
        print(f"Service: npc_fill/player_assign -> Res: False\nException: {e}")