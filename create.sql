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
INSERT INTO `Inventory` (`PLU`, `Name`, `Description`, `UnitCost`, `Quantity`) 
VALUES  (0, 'Organic Carrots', 'Price per Bundle of 4', 2.47, 9),
		(0, 'Red Potatoes', 'Price per 5lb bag', 5.86, 25),
		(0, 'Fresh Peaches', 'Price per peach', 0.79, 54);
UNLOCK TABLES;


/* Create an Customers table if one doesn't already exist.*/
DROP TABLE IF EXISTS `Customers`;
CREATE TABLE `Customers` (
	`CustomerID` int(11) NOT NULL AUTO_INCREMENT,
	`Name` varchar(255), 
	`PhoneNumber` varchar(255),
	`RewardsPts` int(11),
	PRIMARY KEY (`CustomerID`)
);

/* Insert values into the Customers table */
LOCK TABLES `Customers` WRITE;
INSERT INTO `Customers` VALUES  (0, 'Toph', '123-456-7890', 100), 
								(1, 'Katara', '987-654-3210', 300), 
								(2, 'Zuko', '999-888-7777', 250);
UNLOCK TABLES;

/* Create an Employees table if one doesn't already exist.*/
DROP TABLE IF EXISTS `Employees`;
CREATE TABLE `Employees` (
	`EmployeeID` int(11) NOT NULL AUTO_INCREMENT,
	`Name` varchar(255), 
	`HourlyWage` decimal(6,2),
	`Responsibilities` varchar(255),
	`SickDays` int(11),
	PRIMARY KEY (`EmployeeID`)
);

/* Insert values into the Employees table */
LOCK TABLES `Employees` WRITE;
INSERT INTO `Employees` VALUES  (1, 'Will', 15, 'Restock shelves', 4), 
								(2, 'Tessa', 15, 'Cashier', 6), 
								(3, 'Jem', 15, 'Customer service', 5);
UNLOCK TABLES;


/* Create an Orders table if one doesn't already exist.*/
DROP TABLE IF EXISTS `Orders`;
CREATE TABLE `Orders` (
	`OrderID` int(11) NOT NULL AUTO_INCREMENT,
	`CustomerID` int(11),
	`EmployeeID` int(11),
	PRIMARY KEY (`OrderID`),
	CONSTRAINT `fk_cid`
	FOREIGN KEY (`CustomerID`) REFERENCES Customers(`CustomerID`)
	ON DELETE SET NULL,
	CONSTRAINT `fk_eid`
	FOREIGN KEY (`EmployeeID`) REFERENCES Employees(`EmployeeID`)
	ON DELETE SET NULL
);

/* Insert values into the Orders table*/
LOCK TABLES `Orders` WRITE;
INSERT INTO `Orders` (`OrderID`, `CustomerID`, `EmployeeID`)
VALUES (0, 0, 1), (0, 1, 2), (0, 2, 3);
UNLOCK TABLES;


/* Create an OrderItems table if one doesn't already exist.*/
DROP TABLE IF EXISTS `OrderItems`;
CREATE TABLE `OrderItems` (
	`OrderItemID` int(11) NOT NULL AUTO_INCREMENT,
	`Quantity` int(11) NOT NULL,
	`OrderID` int(11),
	`PLU` int(11),
	PRIMARY KEY (`OrderItemID`),
	CONSTRAINT `fk_oid`
	FOREIGN KEY (`OrderID`) REFERENCES Orders(`OrderID`)
	ON DELETE SET NULL,
	CONSTRAINT `fk_plu`
	FOREIGN KEY (`PLU`) REFERENCES Inventory(`PLU`)
	ON DELETE SET NULL
);

/* Insert values into the Orders table*/
LOCK TABLES `OrderItems` WRITE;
INSERT INTO `OrderItems` (`OrderItemID`, `Quantity`, `OrderID`, `PLU`)
VALUES (0, 4, 1, 2), (0, 6, 0, 0), (0, 1, 2, 1);
UNLOCK TABLES;


/* Create an Shifts table if one doesn't already exist.*/
DROP TABLE IF EXISTS `Shifts`;
CREATE TABLE `Shifts` (
	`ShiftID` int(11) NOT NULL AUTO_INCREMENT,
	`Day` varchar(255), 
	`StartTime` time(0),
	`EndTime` time(0),
	PRIMARY KEY (`ShiftID`)
);

/* Insert values into the Shifts table */
LOCK TABLES `Shifts` WRITE;
INSERT INTO `Shifts` VALUES (1, 'Monday', '08:00:00', '12:00:00'), 
							(2, 'Tuesday', '10:00:00', '14:00:00'), 
							(3, 'Wednesday', '14:00:00', '18:00:00');
UNLOCK TABLES;


/* Create an EmployeeShifts table if one doesn't already exist.*/
DROP TABLE IF EXISTS `EmployeeShifts`;
CREATE TABLE `EmployeeShifts` (
	`EmployeeShiftID` int(11) NOT NULL AUTO_INCREMENT,
	`EmployeeID` int(11),
	`ShiftID` int(11),
	PRIMARY KEY (`EmployeeShiftID`),
	CONSTRAINT `fk_es_eid`
	FOREIGN KEY (`EmployeeID`) REFERENCES Employees(`EmployeeID`)
	ON DELETE SET NULL,
	CONSTRAINT `fk_es_sid`
	FOREIGN KEY (`ShiftID`) REFERENCES Shifts(`ShiftID`)
	ON DELETE SET NULL
);

/* Insert values into the EmployeeShifts table */
LOCK TABLES `EmployeeShifts` WRITE;
INSERT INTO `EmployeeShifts` VALUES (0, 1, 1), (1, 2, 2), (2, 3, 3);
UNLOCK TABLES;
