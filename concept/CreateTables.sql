DROP DATABASE server_1;

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema server_1
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema server_1
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `server_1` DEFAULT CHARACTER SET utf8 ;
USE `server_1` ;

-- -----------------------------------------------------
-- Table `server_1`.`Clubs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Clubs` (
  `idClub` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  `abbreviation` VARCHAR(5) NOT NULL,
  `is_player` TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (`idClub`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE,
  UNIQUE INDEX `short_name_UNIQUE` (`abbreviation` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Users` (
  `idUser` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idClub` BIGINT UNSIGNED NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `username` VARCHAR(64) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idUser`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  INDEX `fk_Users_idClub_idx` (`idClub` ASC) VISIBLE,
  CONSTRAINT `fk_Users_idClub`
    FOREIGN KEY (`idClub`)
    REFERENCES `server_1`.`Clubs` (`idClub`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Persons`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Persons` (
  `idPerson` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(64) NOT NULL,
  `last_name` VARCHAR(64) NOT NULL,
  `age` TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (`idPerson`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Players`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Players` (
  `idPerson` BIGINT UNSIGNED NOT NULL,
  `pace` SMALLINT UNSIGNED NOT NULL,
  `endurance` SMALLINT UNSIGNED NOT NULL,
  `strength` SMALLINT UNSIGNED NOT NULL,
  `positioning` SMALLINT UNSIGNED NOT NULL,
  `ball_control` SMALLINT UNSIGNED NOT NULL,
  `passing` SMALLINT UNSIGNED NOT NULL,
  `shooting` SMALLINT UNSIGNED NOT NULL,
  `duel` SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (`idPerson`),
  CONSTRAINT `fk_Players_idPerson`
    FOREIGN KEY (`idPerson`)
    REFERENCES `server_1`.`Persons` (`idPerson`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Teams`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Teams` (
  `idTeam` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idClub` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`idTeam`),
  INDEX `fk_Teams_idClub_idx` (`idClub` ASC) VISIBLE,
  CONSTRAINT `fk_Teams_idClub`
    FOREIGN KEY (`idClub`)
    REFERENCES `server_1`.`Clubs` (`idClub`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Teamstaff`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Teamstaff` (
  `idPerson` BIGINT UNSIGNED NOT NULL,
  `value` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idPerson`),
  CONSTRAINT `fk_Teamstaff_idPerson`
    FOREIGN KEY (`idPerson`)
    REFERENCES `server_1`.`Persons` (`idPerson`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Clubstaff`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Clubstaff` (
  `idPerson` BIGINT UNSIGNED NOT NULL,
  `value` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`idPerson`),
  CONSTRAINT `fk_Clubstaff_idPerson`
    FOREIGN KEY (`idPerson`)
    REFERENCES `server_1`.`Persons` (`idPerson`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Clubstaff_Clubs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Clubstaff_Clubs` (
  `idPerson` BIGINT UNSIGNED NOT NULL,
  `idClub` BIGINT UNSIGNED NOT NULL,
  `from_season` INT UNSIGNED NOT NULL,
  `from_day` TINYINT UNSIGNED NOT NULL,
  `to_season` INT UNSIGNED NULL,
  `to_day` TINYINT UNSIGNED NULL,
  INDEX `fk_CC_idClub_idx` (`idClub` ASC) VISIBLE,
  INDEX `fk_CC_idPerson_idx` (`idPerson` ASC) VISIBLE,
  PRIMARY KEY (`from_season`, `from_day`, `idPerson`, `idClub`),
  CONSTRAINT `fk_CC_idPerson`
    FOREIGN KEY (`idPerson`)
    REFERENCES `server_1`.`Clubstaff` (`idPerson`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_CC_idClub`
    FOREIGN KEY (`idClub`)
    REFERENCES `server_1`.`Clubs` (`idClub`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Teamstaff_Teams`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Teamstaff_Teams` (
  `idPerson` BIGINT UNSIGNED NOT NULL,
  `idTeam` BIGINT UNSIGNED NOT NULL,
  `from_season` INT UNSIGNED NOT NULL,
  `from_day` TINYINT UNSIGNED NOT NULL,
  `to_season` INT UNSIGNED NULL,
  `to_day` TINYINT UNSIGNED NULL,
  INDEX `fk_TT_idPerson_idx` (`idPerson` ASC) VISIBLE,
  INDEX `fk_TT_idTeam_idx` (`idTeam` ASC) VISIBLE,
  PRIMARY KEY (`idPerson`, `idTeam`, `from_season`, `from_day`),
  CONSTRAINT `fk_TT_idPerson`
    FOREIGN KEY (`idPerson`)
    REFERENCES `server_1`.`Teamstaff` (`idPerson`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_TT_idTeam`
    FOREIGN KEY (`idTeam`)
    REFERENCES `server_1`.`Teams` (`idTeam`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Players_Teams`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Players_Teams` (
  `idPerson` BIGINT UNSIGNED NOT NULL,
  `idTeam` BIGINT UNSIGNED NOT NULL,
  `from_season` INT UNSIGNED NOT NULL,
  `from_day` TINYINT UNSIGNED NOT NULL,
  `to_season` INT UNSIGNED NULL COMMENT 'Direkt beim Abgang setzen',
  `to_day` TINYINT UNSIGNED NULL COMMENT 'Direkt beim Abgang setzen',
  INDEX `fk_PT_idPerson_idx` (`idPerson` ASC) VISIBLE,
  INDEX `fk_PT_idTeam_idx` (`idTeam` ASC) VISIBLE,
  PRIMARY KEY (`from_day`, `idTeam`, `from_season`, `idPerson`),
  CONSTRAINT `fk_PT_idPerson`
    FOREIGN KEY (`idPerson`)
    REFERENCES `server_1`.`Players` (`idPerson`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_PT_idTeam`
    FOREIGN KEY (`idTeam`)
    REFERENCES `server_1`.`Teams` (`idTeam`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Leagues`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Leagues` (
  `idLeague` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(64) NOT NULL,
  `number_of_teams` TINYINT UNSIGNED NOT NULL,
  PRIMARY KEY (`idLeague`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Teams_Leagues`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Teams_Leagues` (
  `idTeam` BIGINT UNSIGNED NOT NULL,
  `idLeague` BIGINT UNSIGNED NOT NULL,
  `season` INT UNSIGNED NOT NULL,
  `position` TINYINT UNSIGNED NOT NULL,
  INDEX `fk_TL_idTeam_idx` (`idTeam` ASC) VISIBLE,
  INDEX `fk_TL_idLeague_idx` (`idLeague` ASC) VISIBLE,
  PRIMARY KEY (`season`, `idTeam`, `idLeague`),
  CONSTRAINT `fk_TL_idTeam`
    FOREIGN KEY (`idTeam`)
    REFERENCES `server_1`.`Teams` (`idTeam`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_TL_idLeague`
    FOREIGN KEY (`idLeague`)
    REFERENCES `server_1`.`Leagues` (`idLeague`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Environment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Environment` (
  `key` VARCHAR(64) NOT NULL,
  `value_string` VARCHAR(64) NULL,
  `value_int` INT NULL,
  PRIMARY KEY (`key`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Lineups`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Lineups` (
  `idTeam` BIGINT UNSIGNED NOT NULL COMMENT 'Wenn Poition nicht besetzt -> existiert kein Datensatz\nEin Team hat mehrere Personen aufgestellt\nEin Team ist Unique mit der jeweiligen Position\n\nRevoke Slot -> lösche Datensatz nach (idTeam, positionCode)\nAssign Slot -> erzeuge neuen Datensatz',
  `idPerson` BIGINT UNSIGNED NOT NULL,
  `positionCode` ENUM('LW', 'LF', 'ST', 'RF', 'RW', 'LAM', 'CAM', 'RAM', 'LM', 'LCM', 'CM', 'RCM', 'RM', 'LDM', 'CDM', 'RDM', 'LWB', 'RWB', 'LB', 'LCB', 'CB', 'RCB', 'RB', 'GK', 'S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12') NOT NULL,
  PRIMARY KEY (`idTeam`, `idPerson`),
  UNIQUE INDEX `UNIQUE` (`idTeam` ASC, `positionCode` ASC) VISIBLE,
  CONSTRAINT `fk_Lineups_idTeam`
    FOREIGN KEY (`idTeam`)
    REFERENCES `server_1`.`Teams` (`idTeam`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Lineups_idPerson`
    FOREIGN KEY (`idPerson`)
    REFERENCES `server_1`.`Persons` (`idPerson`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `server_1`.`Tactics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `server_1`.`Tactics` (
  `idTeam` BIGINT UNSIGNED NOT NULL,
  `pace` SMALLINT UNSIGNED NOT NULL DEFAULT 1250 COMMENT 'Alle folgenden Werte werden val * 100 gespeichert mit max 2 Nachkommastellen\nBeispiel:\npace: 75,74\nin DB; 7574',
  `endurance` SMALLINT UNSIGNED NOT NULL DEFAULT 1250,
  `strength` SMALLINT UNSIGNED NOT NULL DEFAULT 1250,
  `positioning` SMALLINT UNSIGNED NOT NULL DEFAULT 1250,
  `ball_control` SMALLINT UNSIGNED NOT NULL DEFAULT 1250,
  `passing` SMALLINT UNSIGNED NOT NULL DEFAULT 1250,
  `shooting` SMALLINT UNSIGNED NOT NULL DEFAULT 1250,
  `duel` SMALLINT UNSIGNED NOT NULL DEFAULT 1250,
  PRIMARY KEY (`idTeam`),
  CONSTRAINT `fk_Tactics_idTeam`
    FOREIGN KEY (`idTeam`)
    REFERENCES `server_1`.`Teams` (`idTeam`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
