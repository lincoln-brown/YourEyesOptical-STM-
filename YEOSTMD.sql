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

INSERT INTO `USERS` VALUES (1,'Admin','Administrator',SHA2('Password123',0),'links1155@gmail.com',CURDATE(),'Admin');

DROP TABLE IF EXISTS `Stocks`;
CREATE TABLE `Stocks`(
	`id` int(11) NOT NULL auto_increment,
	`itemname` char(50) NOT NULL,
	`framecode` char(15) NOT NULL,
	`framesize` char(15) NOT NULL,
	`framecolor` char(15) NOT NULL,
	`amount` int(11) NOT NULL,
	`cost` int(11) NOT NULL,
	`username`CHAR(35) NOT NULL,
	`fullname`CHAR(35) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;

DROP TABLE IF EXISTS `Payments`;
CREATE TABLE `Payments`(
	`id` int(11) NOT NULL auto_increment,
	`customername` char(50) NOT NULL,
	`customerNumber` char(50) NOT NULL,
	`itemname` char(50) NOT NULL,
	`item_cost` int(11) NOT NULL,
	`amount_of_items` int(11) NOT NULL,
	`total_cost_of_items` int(11) NOT NULL,
	`paidbyinsurance` int(11) NOT NULL,
	`Paidbycash` int(11) NOT NULL,
	`balance` int(11) NOT NULL,	
	`date_of_purchase` char(35) NOT NULL,
	PRIMARY KEY (`id`)
)ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `Sales`;
CREATE TABLE `Sales`(
	`id` int(11) NOT NULL auto_increment,
	`soldby` char(50) NOT NULL,
	`amount_sold` int(11) NOT NULL,
	`date_of_sale` char(50) NOT NULL,
	`itemname` char(50) NOT NULL,
	`paidbyinsurance` int(11) NOT NULL,
	`Paidbycash` int(11) NOT NULL,
	`total_sale` int(11) NOT NULL,
	`customername` char(50) NOT NULL,
	`customerNumber` char(50) NOT NULL,
	PRIMARY KEY (`id`)
)ENGINE=MyISAM DEFAULT CHARSET=utf8mb4;