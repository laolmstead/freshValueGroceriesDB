/* Create an inventory table if one doesn't already exist.*/

DROP TABLE IF EXISTS `Inventory`;

CREATE TABLE `Inventory` (
	`PLU` int(11) NOT NULL AUTO_INCREMENT,
	`Name` varchar(255) NOT NULL,
	`Description` varchar(255) NOT NULL,
	`UnitCost` decimal(8,2) NOT NULL,
	`Quantity` int(11),
	PRIMARY KEY (`PLU`)
);


/* Insert values into the Inventory table*/

LOCK TABLES `Inventory` WRITE;

INSERT INTO `Inventory` VALUES (0, 'Organic Carrots', 'Price per Bundle of 4', 2.47, 9), 
								(0, 'Red Potatoes', 'Price per 5lb bag', 5.86, 25),
								(0, 'Fresh Peaches', 'Price per peach', 0.79, 54);
UNLOCK TABLES;



/* Create an orders table if one doesn't already exist.*/

DROP TABLE IF EXISTS `Orders`;

CREATE TABLE `Orders` (
	`OrderID` int(11) NOT NULL AUTO_INCREMENT,
	/*`CustomerID` int(11),
	`EmployeeID` int(11),*/
	PRIMARY KEY (`OrderID`)/*,
	CONSTRAINT `fk_cid`
	FOREIGN KEY (`CustomerID`) REFERENCES Customers(`CustomerID`)
	ON DELETE SET NULL,
	CONSTRAINT `fk_eid`
	FOREIGN KEY (`EmployeeID`) REFERENCES Employees(`EmployeeID`)
	ON DELETE SET NULL*/
);



/* Insert values into the Orders table*/

LOCK TABLES `Orders` WRITE;

INSERT INTO `Orders` VALUES (0/*, 1, 1*/), (0/*, 1, 3*/), (0/*, 2, 1*/);

UNLOCK TABLES;


/* Create an OrderItems table if one doesn't already exit.*/

DROP TABLE IF EXISTS `OrderItems`;

CREATE TABLE `OrderItems` (
	`OrderItemID` int(11) NOT NULL AUTO_INCREMENT,
	`Quantity` int(11) NOT NULL,
	`OrderID` int(11) NOT NULL,
	`PLU` int(11),
	PRIMARY KEY (`OrderItemID`),
	CONSTRAINT `fk_oid`
	FOREIGN KEY(`OrderID`) REFERENCES Orders(`OrderID`)
	ON DELETE CASCADE,
	CONSTRAINT `fk_plu`
	FOREIGN KEY(`PLU`) REFERENCES Inventory(`PLU`)
	ON DELETE SET NULL
);


/* Insert values into the Orders table*/

LOCK TABLES `OrderItems` WRITE;

INSERT INTO `OrderItems` VALUES (0, 4, 1, 2), (0, 6, 3, 3), (0, 1, 2, 1);

UNLOCK TABLES;
