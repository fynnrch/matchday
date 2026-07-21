from app.library.delete import delete_unemployed_persons
from app.library.insert import insert_person, insert_clubstaff, insert_teamstaff, insert_player

def pool_refresh(conn):
    pool_cleanup(conn)
    clubstaff_refresh(conn)
    teamstaff_refresh(conn)
    players_refresh(conn)

def pool_cleanup(conn):
    try:
        delete_unemployed_persons(conn)

        conn.commit()
        print("Service: pool_refresh/pool_cleanup -> Res: True")

    except Exception as e:
        conn.rollback()
        print(f"Service: pool_refresh/pool_cleanup -> Res: False\nException: {e}")

# 5per refresh
def clubstaff_refresh(conn):
    index = 5

    for i in range(index, 0, -1):
        try:
            idPerson = insert_person(conn)
            insert_clubstaff(conn, idPerson)

            conn.commit()
            print("Service: pool_refresh/clubstaff_refresh -> Res: True")
            
        except Exception as e:
            conn.rollback()
            print(f"Service: pool_refresh/clubstaff_refresh -> Res: False\nException: {e}")

# 5per refresh
def teamstaff_refresh(conn):
    index = 5

    for i in range(index, 0, -1):
        try:
            idPerson = insert_person(conn)
            insert_teamstaff(conn, idPerson)

            conn.commit()
            print("Service: pool_refresh/teamstaff_refresh -> Res: True")
            
        except Exception as e:
            conn.rollback()
            print(f"Service: pool_refresh/teamstaff_refresh -> Res: False\nException: {e}")

# 20per refresh
def players_refresh(conn):
    index = 20

    for i in range(index, 0, -1):
        try:
            idPerson = insert_person(conn)
            insert_player(conn, idPerson)

            conn.commit()
            print("Service: pool_refresh/players_refresh -> Res: True")
            
        except Exception as e:
            conn.rollback()
            print(f"Service: pool_refresh/players_refresh -> Res: False\nException: {e}")