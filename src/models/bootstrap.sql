CREATE TABLE IF NOT EXISTS `Admin` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` VARCHAR(50) NULL,
    `languageId` INT(11) NOT NULL,
    `code` VARCHAR(50) NOT NULL
    );

CREATE TABLE IF NOT EXISTS `Guest` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `nameSecondLine` VARCHAR(150) NULL,
    `languageId` INT(11) NOT NULL,
    `lastUpdatedByAdminId` INT(11) NULL,
    `lastUpdatedByAdminTime` TIMESTAMP NULL,
    `lastUpdatedByGuestTime` TIMESTAMP NULL,
    `meta` TEXT NULL,
    `isTest` TINYINT(1) NULL DEFAULT 0,
    `created` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS `GuestHasProperty` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `guestId` INT(11) NOT NULL,
    `propertyId` INT(11) NOT NULL,
    `value` VARCHAR(100) NULL,
    `minimumIntValue` INT NULL,
    `maximumIntValue` INT NULL,
    `lastUpdatedByAdminId` INT(11) NULL,
    `lastUpdatedByAdminTime` TIMESTAMP NULL,
    `lastUpdatedByGuestTime` TIMESTAMP NULL
    );

CREATE TABLE IF NOT EXISTS `Property` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `key` VARCHAR(50) NOT NULL UNIQUE,
    `translationKey` VARCHAR(50) NOT NULL UNIQUE,
    `minimumIntValue` INT NULL,
    `maximumIntValue` INT NULL,
    `required` TINYINT(1) NULL DEFAULT 0,
    `lastUpdatedByAdminId` INT(11) NULL,
    `lastUpdatedByAdminTime` TIMESTAMP NULL,
    `lastUpdatedByGuestTime` TIMESTAMP NULL
    );

CREATE TABLE IF NOT EXISTS `PropertyType` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` VARCHAR(150) NOT NULL
    );

CREATE TABLE IF NOT EXISTS `Language` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `code` VARCHAR(10) NOT NULL,
    `name` VARCHAR(50) NOT NULL
    );

CREATE TABLE IF NOT EXISTS `Translation` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `languageId` INT NOT NULL,
    `key` VARCHAR(50) NOT NULL,
    `text` TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS `Setting` (
   `id` INTEGER PRIMARY KEY AUTOINCREMENT,
   `key` VARCHAR(50) NULL,
   `value` TEXT NULL,
   `lastUpdatedByAdminId` INT(11) NULL,
   `updated` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO 'Language' ('name', 'code') VALUES
    ('English', 'en-us'),
    ('German', 'de-de'),
    ('Hungarian', 'hu-hu');

INSERT INTO 'Setting' ('key', 'value') VALUES
    ('eventDate', null),
    ('guestModificationEndDate', null),
    ('postEventSiteEnabled', null);
