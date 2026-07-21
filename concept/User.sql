DROP USER IF EXISTS 'apiuser'@'%';
CREATE USER 'apiuser'@'%' IDENTIFIED BY 'apiuser';

GRANT SELECT, INSERT ON Users TO 'apiuser'@'%';
GRANT SELECT ON Environment TO 'apiuser'@'%';
GRANT SELECT, INSERT, UPDATE ON Clubs TO 'apiuser'@'%';
GRANT INSERT ON Teams TO 'apiuser'@'%';
GRANT SELECT, INSERT ON Teams_Leagues TO 'apiuser'@'%';
GRANT SELECT, INSERT, DELETE ON Persons TO 'apiuser'@'%';
GRANT INSERT ON Clubstaff TO 'apiuser'@'%';
GRANT INSERT ON Clubstaff_Clubs TO 'apiuser'@'%';
GRANT INSERT ON Teamstaff TO 'apiuser'@'%';
GRANT INSERT ON Teamstaff_Teams TO 'apiuser'@'%';
GRANT INSERT ON Players TO 'apiuser'@'%';
GRANT INSERT ON Players_Teams TO 'apiuser'@'%';
GRANT SELECT ON v_leagues_missing_teams TO 'apiuser'@'%';
GRANT SELECT, DELETE ON v_unemployed_persons TO 'apiuser'@'%';