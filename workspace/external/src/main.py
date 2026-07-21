import sys

from app.database import get_connection

from app.services.npc_fill import npc_fill
from app.services.pool_refresh import pool_refresh

def main():
    #establish mariadb connection
    try:
        conn = get_connection()
        print("mariadb connection established")
    except Exception as e:
        print(f"mariadb connection failed\nException: {e}")
        return

    # ========
    # Building
    # ========

    # i - initial build
    # d - daily build

    if "-i" in sys.argv or "-d" in sys.argv:

        #Service: npc_fill
        #Loopt durch alle Ligen und fülle ggfs. mit NPC Clubs auf
        try:
            npc_fill(conn)
            print("Service: npc_fill -> Res: True")
        except Exception as e:
            print(f"Service: npc_fill -> Res: False\nException: {e}")
        
    if "-d" in sys.argv:

        #Service: pool_refresh
        #Löscht alle arbeitslosen NPC und erschafft täglich einen neuen Rutsch NPC
        try:
            pool_refresh(conn)
            print("Service: pool_refresh -> Res: True")
        except Exception as e:
            print(f"Service: pool_refresh -> Res: False\nException: {e}")
            
    #close mariadb connection
    conn.close()
    print("mariadb connection closed")

if __name__ == "__main__":
    main()