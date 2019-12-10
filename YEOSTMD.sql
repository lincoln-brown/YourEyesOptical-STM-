DROP DATABASE YOUR_Eyes;
CREATE DATABASE YOUR_Eyes;
USE YOUR_Eyes;
DROP TABLE IF EXISTS `USERS`;
CREATE TABLE `USERS`
(
	`id` int(11) NOT NULL auto_increment,
    `firstname` char(35) NOT NULL,
    `lastname` char(35) NOT NULL,
    `password` VARCHAR(500) NOT NULL,
    `email` CHAR(35) NOT NULL,
    `date_joined` char(35) NOT NULL,
    `position` char(35) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

INSERT INTO `USERS` VALUES (1,'Admin','Administrator',SHA2('password123',0),'admin@links.com',CURDATE(),'Admin');

