/**************************************/
-- INVENTORY
/**************************************/

/* Display Inventory table on Manage Inventory Page*/
SELECT `PLU`, `Name`, `Description`, `UnitCost` AS `Unit Cost` FROM Inventory;

/* Insert an item into the Inventory table*/
--Variables PLU, Name, Description, UnitCost, and Quantity
--to be passed to the database from Python/Flask app
LOCK TABLES `Inventory` WRITE;
INSERT INTO `Inventory` (Name, Description, UnitCost, Quantity) VALUES (:Name, :Description, :UnitCost, :Quantity);
UNLOCK TABLES;

/* Update a row in the Inventory table*/
--Variables PLU, Name, Description, UnitCost, and Quantity
--to be passed to the database from Python/Flask app
LOCK TABLES `Inventory` WRITE;
UPDATE `Inventory` 
SET
	`Name` = :Name,
	`Description` = :Description,
	`UnitCost` = :UnitCost
	`Quantity` = :Quantity
WHERE
	`PLU` = :PLU;
UNLOCK TABLES;

/* Delect a row in the Inventory table*/
--Variables PLU, Name, Description, UnitCost, and Quantity
--to be passed to the database from Python/Flask app
DELETE FROM `Inventory` WHERE `PLU` = :PLU;


/**************************************/
-- ORDERS
/**************************************/

/* Display Orders table on Manage Orders Page*/
SELECT `OrderID` AS 'Order ID', `CustomerID` AS 'Rewards ID', `EmployeeID` AS 'Employee ID' FROM Orders;

/* Insert an item into the Orders table*/
--Variables OrderID, EmployeeID, and CustomerID
--to be passed to the database from Python/Flask app
LOCK TABLES `Orders` WRITE;
INSERT INTO `Orders` (CustomerID, EmployeeID) VALUES (:CustomerID, :EmployeeID);
UNLOCK TABLES;

/* Update a row in the Orders table*/
--Variables OrderID, EmployeeID, and CustomerID
--to be passed to the database from Python/Flask app
LOCK TABLES `Orders` WRITE;
UPDATE `Orders`
SET
	`CustomerID` = :CustomerID,
	`EmployeeID` = :EmployeeID
WHERE
	`OrderID` = :OrderID;
UNLOCK TABLES;

/* Delect a row in the Orders table*/
-- Variables OrderID, EmployeeID, and CustomerID
-- to be passed to the database from Python/Flask app
DELETE FROM `Orders` WHERE `OrderID` = :OrderID;


/**************************************/
-- Orders / OrderItems
/**************************************/

/* Display Order Details table on Manage Orders Page when user searches by CustomerID.*/
--Variable OrderID to be passed to the database from Python/Flask app.
SELECT Orders.OrderID, Inventory.PLU, Inventory.Name, Inventory.UnitCost AS `Unit Cost`, OrderItems.Quantity, (Inventory.UnitCost * OrderItems.Quantity) AS `Total`
FROM Inventory
JOIN OrderItems on OrderItems.PLU = Inventory.PLU
JOIN Orders on OrderItems.OrderID = Orders.OrderID 
JOIN Customers on Orders.CustomerID = Customers.CustomerID
AND Customers.CustomerID = :CustomerID
ORDER BY Orders.OrderID DESC;

/* Display Order Details table on Manage Orders Page when user searches by Customer Name.*/
--Variable Customer.Name to be passed to the database from Python/Flask app.
SELECT Orders.OrderID, Inventory.Name, Inventory.Description, Inventory.UnitCost, OrderItems.Quantity, (Inventory.UnitCost * OrderItems.Quantity) AS `Total`
FROM Inventory
JOIN OrderItems on OrderItems.PLU = Inventory.PLU
JOIN Orders on OrderItems.OrderID = Orders.OrderID
JOIN Customers on Orders.CustomerID = Customers.CustomerID
AND Customers.Name = %s
ORDER BY Orders.OrderID DESC;

/* Display Order Details table on Manage Orders Page when user searches by CustomerID.*/
-- Variable OrderID to be passed to the database from Python/Flask app.
SELECT Orders.OrderID, Inventory.PLU, Inventory.Name, Inventory.UnitCost AS `Unit Cost`, OrderItems.Quantity, (Inventory.UnitCost * OrderItems.Quantity) AS `Total`
FROM Inventory
JOIN OrderItems on OrderItems.PLU = Inventory.PLU
JOIN Orders on OrderItems.OrderID = Orders.OrderID
JOIN Employees on Orders.EmployeeID = Employees.EmployeeID
AND Employees.EmployeeID = :EmployeeID
ORDER BY Orders.OrderID DESC;

/* Display Items in Inventory Order and Customer Order Form tables*/
-- Pulls items one at a time from Inventory by searching by PLU or Item Name
-- And stores data in a temporary list on Flask.
-- Variable PLU to be passed to the database from Python/Flask app.
SELECT `PLU`, `Name`, `Description`, `UnitCost` AS 'Unit Cost' FROM `Inventory`
WHERE `PLU` = :PLU;

/* Create a new row in Orders and new rows in OrderItems when customer submits the Customer Order Form.*/
-- CustomerID, OrderID, EmployeeID, PLU, Item Name, Description and 
LOCK TABLES `Orders` WRITE;
INSERT INTO `Orders` (CustomerID, EmployeeID) VALUES (:CustomerID, :EmployeeID);
UNLOCK TABLES;

LOCK TABLES `OrderItems` WRITE;
INSERT INTO `OrderItems` (Quantity, OrderID, PLU) VALUES (:Quantity, :OrderID, :PLU);
UNLOCK TABLES;


/**************************************/
-- CUSTOMERS
/**************************************/
/* Display the Customers table on the View and Manage Customer Information page */
SELECT `CustomerID`, `Name`, `PhoneNumber`, `RewardsPts` FROM Customers;

/* Search for Customers by name */
SELECT `CustomerID`, `Name`, `PhoneNumber`, `RewardsPts` FROM Customers
WHERE `Name` = :Name;

/* Search for Customers by ID */
SELECT `CustomerID`, `Name`, `PhoneNumber`, `RewardsPts` FROM Customers
WHERE `CustomerID` = :CustomerID;

/* Search for Customers by Phone Number */
SELECT `CustomerID`, `Name`, `PhoneNumber`, `RewardsPts` FROM Customers
WHERE `PhoneNumber` = :PhoneNumber;

/* Search for Customers by Rewards Points */
SELECT `CustomerID`, `Name`, `PhoneNumber`, `RewardsPts` FROM Customers
WHERE `RewardsPts` >= :RewardsLowerBound AND `RewardsPts` <= :RewardsUpperBound;

/* Insert a new Customer into the Customers table*/
-- Variables to be passed to the database from Python/Flask app
LOCK TABLES `Customers` WRITE;
INSERT INTO `Customers` (`Name`, `PhoneNumber`, `RewardsPts`) 
VALUES (:Name, :Phone, :Points);
UNLOCK TABLES;

/* Update a row in the Customers table*/
-- Variables Name, PhoneNumber, and RewardsPts
-- to be passed to the database from Python/Flask app
LOCK TABLES `Customers` WRITE;
UPDATE `Customers` 
SET
	`Name` = :Name,
	`PhoneNumber` = :PhoneNumber,
	`RewardsPts` = :RewardsPts
WHERE
	`CustomerID` = :CustomerID;
UNLOCK TABLES;

/* Delete a row from the Customers table */
DELETE FROM `Customers` WHERE `CustomerID` = :CustomerID;


/**************************************/
-- EMPLOYEES
/**************************************/

/* Display the Employees table on the Manage Employees page */
SELECT `EmployeeID`, `Name`, `HourlyWage`, `Responsibilities`, `SickDays` FROM `Employees`;

/* Search for Employees by name */
SELECT `EmployeeID`, `Name`, `HourlyWage`, `Responsibilities`, `SickDays` FROM `Employees`
WHERE `Name` = :Name;

/* Search for Employees by ID */
SELECT `EmployeeID`, `Name`, `HourlyWage`, `Responsibilities`, `SickDays` FROM `Employees`
WHERE `EmployeeID` = :EmployeeID;

/* Search for Employees by Responsibilities */
SELECT `EmployeeID`, `Name`, `HourlyWage`, `Responsibilities`, `SickDays` FROM `Employees`
WHERE `Responsibilities` = :Responsibilities;

/* Search for Employees by Hourly Wage */
SELECT `EmployeeID`, `Name`, `HourlyWage`, `Responsibilities`, `SickDays` FROM `Employees`
WHERE `HourlyWage` = :HourlyWage;

/* Search for Employees by Number of Sick Days */
SELECT `EmployeeID`, `Name`, `HourlyWage`, `Responsibilities`, `SickDays` FROM `Employees`
WHERE `SickDays` = :SickDays;

/* Update a row in the Employees table*/
-- Variables Name, HourlyWage, Responsibilities, and SickDays
-- to be passed to the database from Python/Flask app
LOCK TABLES `Employees` WRITE;
UPDATE `Employees` 
SET
	`Name` = :Name,
	`HourlyWage` = :HourlyWage,
	`Responsibilities` = :Responsibilities,
	`SickDays` = :SickDays
WHERE
	`EmployeeID` = :EmployeeID;
UNLOCK TABLES;

/* Delete a row from the Employees table */
DELETE FROM `Employees` WHERE `EmployeeID` = :EmployeeID;

/* Display Shifts assigned to selected Employee */
SELECT Employees.Name, Shifts.ShiftID, Shifts.Day, Shifts.StartTime, Shifts.EndTime
FROM `Shifts`
JOIN `EmployeeShifts` ON Shifts.ShiftID = EmployeeShifts.ShiftID
JOIN `Employees` ON EmployeeShifts.EmployeeID = Employees.EmployeeID
WHERE Employees.EmployeeID = :EmployeeID;

/* Insert a new Employee into the Employees table*/
-- Variables to be passed to the database from Python/Flask app
LOCK TABLES `Employees` WRITE;
INSERT INTO `Employees` (`Name`, `HourlyWage`, `Responsibilities`, `SickDays`) 
VALUES (:Name, :HourlyWage, :Responsibilities, :SickDays);
UNLOCK TABLES;


/**************************************/
-- SHIFTS
/**************************************/

/* Display the Shifts table on the Manage Shifts page */
SELECT `ShiftID`, `Day`, `StartTime`, `EndTime` FROM `Shifts`;

/* Search for Shifts by ID */
SELECT `ShiftID`, `Day`, `StartTime`, `EndTime` FROM `Shifts`
WHERE `ShiftID` = :ShiftID;

/* Search for Shifts by day */
SELECT `ShiftID`, `Day`, `StartTime`, `EndTime` FROM `Shifts`
WHERE `Day` = :Day;

/* Search for Shifts by Start Time */
SELECT `ShiftID`, `Day`, `StartTime`, `EndTime` FROM `Shifts`
WHERE `StartTime` = :StartTime;

/* Search for Shifts by Start Time */
SELECT `ShiftID`, `Day`, `StartTime`, `EndTime` FROM `Shifts`
WHERE `StartTime` = :StartTime;

/* Update a row in the Shifts table*/
-- Variables to be passed to the database from Python/Flask app
LOCK TABLES `Shifts` WRITE;
UPDATE `Shifts` 
SET
	`Day` = :Day,
	`StartTime` = :StartTime,
	`EndTime` = :EndTime,
WHERE
	`ShiftID` = :ShiftID;
UNLOCK TABLES;

/* Delete a row from the Shifts table */
DELETE FROM `Shifts` WHERE `ShiftID` = :ShiftID;

/* Display Employees assigned to selected Shift */
SELECT Employees.Name, Shifts.ShiftID
FROM `Shifts`
JOIN `EmployeeShifts` ON Shifts.ShiftID = EmployeeShifts.ShiftID
JOIN `Employees` ON EmployeeShifts.EmployeeID = Employees.EmployeeID
WHERE Shifts.ShiftID = :ShiftID;

/* Insert a new Shift into the Shifts table*/
-- Variables to be passed to the database from Python/Flask app
LOCK TABLES `Shifts` WRITE;
INSERT INTO `Shifts` (`Day`, `StartTime`, `EndTime`) 
VALUES (:Day, :StartTime, :EndTime);
UNLOCK TABLES;

/* Assign a Shift to an Employee */
-- Variables ShiftID and EmployeeID to be passed to
-- the database from Python/Flask app.
-- Equivalent to inserting new row into the EmployeeShifts table.
LOCK TABLES `EmployeeShifts` WRITE;
INSERT INTO `EmployeeShifts` (`EmployeeID`, `ShiftID`) 
VALUES (:EmployeeID, :ShiftID);
UNLOCK TABLES;
