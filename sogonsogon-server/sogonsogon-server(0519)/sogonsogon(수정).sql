SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema sogonsogon
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE DATABASE  `sogonsogon`;
USE `sogonsogon`;


DROP TABLE IF EXISTS `users`;
-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `no` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `region_bcode` VARCHAR(11) NOT NULL DEFAULT '',
  `sector_no` INT(11) UNSIGNED DEFAULT NULL,
  `email` VARCHAR(320) NOT NULL DEFAULT '',
  `password` CHAR(41) NOT NULL DEFAULT '',
  `nickname` VARCHAR(40) NOT NULL DEFAULT '',
  `image` VARCHAR(400) NOT NULL DEFAULT '',
  `create_datetime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_datetime` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `remove_datetime` DATETIME DEFAULT NULL,
  `enabled` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1',
  PRIMARY KEY (`no`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `boards`;
-- -----------------------------------------------------
-- Table `boards`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS .`boards` (
  `no` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_no` INT(11) UNSIGNED NOT NULL,
  `region_bcode` VARCHAR(11) DEFAULT NULL,
  `sector_no` INT(11) UNSIGNED DEFAULT NULL,
  `title` VARCHAR(100) NOT NULL DEFAULT '',
  `content` TEXT NOT NULL,
  `views` INT(11) UNSIGNED NOT NULL DEFAULT '0',
  `likes` INT(11) UNSIGNED NOT NULL DEFAULT '0',
  `create_datetime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_datetime` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `remove_datetime` DATETIME DEFAULT NULL,
  `enabled` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1',  
  PRIMARY KEY (`no`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `likes`;
-- -----------------------------------------------------
-- Table `boards`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS .`likes` (
  `no` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_no` INT(11) UNSIGNED NOT NULL,
  `board_no` INT(11) UNSIGNED NOT NULL,
  `create_datetime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`no`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



DROP TABLE IF EXISTS `comments`;
-- -----------------------------------------------------
-- Table `comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `comments` (
  `no` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_no` INT(11) UNSIGNED NOT NULL,
  `board_no` INT(11) UNSIGNED NOT NULL,
  `text` TEXT NOT NULL,
  `create_datetime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `remove_datetime` DATETIME DEFAULT NULL,
  `enabled` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1', 
  PRIMARY KEY (`no`))
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- -----------------------------------------------------
-- Table `region_1`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `region_1` (
  `no` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `bcode` INT(2) NOT NULL,
  `bname` VARCHAR(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`no`))
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `region_2`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `region_2` (
  `no` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `bcode` INT(5) NOT NULL,
  `bname` VARCHAR(20) NOT NULL DEFAULT '',
  `region_1_no` INT(11) NOT NULL,
  PRIMARY KEY (`no`))
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Table `region_3`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `region_3` (
  `no` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `bcode` INT(8) NOT NULL,
  `bname` VARCHAR(45) NOT NULL DEFAULT '',
  `region_2_no` INT(11) NOT NULL,
  PRIMARY KEY (`no`))
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table `region_4`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `region_4` (
  `no` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `bcode` INT(10) NOT NULL,
  `bname` VARCHAR(20) NOT NULL DEFAULT '',
  `region_3_no` INT(11) NOT NULL,
  PRIMARY KEY (`no`))
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- -----------------------------------------------------
-- Table `sectors`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sectors` (
  `no` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `sector_name` VARCHAR(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`no`))
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;






-- DROP TABLE IF EXISTS `shops`;
-- -- -----------------------------------------------------
-- -- Table `shops`
-- -- -----------------------------------------------------
-- CREATE TABLE IF NOT EXISTS `shops` (
--   `no` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
--   `user_no` INT(11) UNSIGNED NOT NULL,
--   `business_number` VARCHAR(13) NOT NULL DEFAULT '',
--   `create_datetime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `update_datetime` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
--   `remove_datetime` DATETIME DEFAULT NULL,
--   `enabled` TINYINT(1) UNSIGNED NOT NULL DEFAULT '1', 
--   PRIMARY KEY (`no`))
-- ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;