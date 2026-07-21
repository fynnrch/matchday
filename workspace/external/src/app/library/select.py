

# ============
# Select views
# ============


def select_missing_teams(conn):    
    cursor = conn.cursor()
    
    cursor.execute("""SELECT idLeague, missingTeams FROM v_leagues_missing_teams""")

    result: dict[int, int] = {}
    for key, value in cursor.fetchall():
        result[key] = value

    return result

# =====================
# Environment variables
# =====================

def select_current_season(conn):
    cursor = conn.cursor()

    cursor.execute("""SELECT value_int FROM Environment WHERE `key` = 'season'""")

    return cursor.fetchone()[0]

def select_current_day(conn):
    cursor = conn.cursor()

    cursor.execute("""SELECT value_int FROM Environment WHERE `key` = 'day'""")

    return cursor.fetchone()[0]

# =============
# Select tables
# =============

def select_next_position(conn):
    cursor = conn.cursor()

    cursor.execute("""SELECT max(position) + 1 FROM Teams_Leagues""")

    return cursor.fetchone()[0] or 1