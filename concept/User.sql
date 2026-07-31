DROP USER IF EXISTS 'apiuser'@'%';
CREATE USER 'apiuser'@'%' IDENTIFIED BY 'apiuser';
GRANT ALL PRIVILEGES ON *.* TO 'apiuser'@'%';