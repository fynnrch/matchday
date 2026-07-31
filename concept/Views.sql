-- v_unemployed_persons
CREATE OR REPLACE VIEW v_unemployed_persons AS
SELECT p.*
FROM Persons p
WHERE NOT EXISTS (
    SELECT 1
    FROM Clubstaff_Clubs cc
    WHERE cc.idPerson = p.idPerson
      AND cc.to_season IS NULL
)
AND NOT EXISTS (
    SELECT 1
    FROM Teamstaff_Teams tt
    WHERE tt.idPerson = p.idPerson
      AND tt.to_season IS NULL
)
AND NOT EXISTS (
    SELECT 1
    FROM Players_Teams pt
    WHERE pt.idPerson = p.idPerson
      AND pt.to_season IS NULL
)
;

-- v_leagues_missing_teams
CREATE OR REPLACE VIEW v_leagues_missing_teams AS
SELECT idLeague, number_of_teams - COUNT(idTeam) AS missingTeams FROM Leagues
LEFT JOIN Teams_Leagues USING(idLeague)
WHERE season = (SELECT `value_int` FROM Environment WHERE `key` = "season") OR season IS NULL
;

-- v_players_teams_active
CREATE OR REPLACE VIEW v_players_teams_active AS
SELECT * FROM Players_Teams
WHERE to_season IS NULL AND to_day IS NULL
;
