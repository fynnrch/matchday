

# =================
# Delete from views
# =================

def delete_unemployed_persons(conn):
    conn.cursor().execute("""DELETE p FROM Persons p INNER JOIN v_unemployed_persons v USING (idPerson)""")