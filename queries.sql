/* Display Inventory table on Manage Inventory Page*/
SELECT `PLU`, `Name`, `Description`, `UnitCost` AS `Unit Cost` FROM Inventory;


/* Insert an item into the Inventory table*/
--Variables PLU, Name, Description, UnitCost, and Quantity
--to be passed to the database from Python/Flask app
LOCK TABLES `Inventory` WRITE;
INSERT INTO `Inventory` VALUES (:PLU, :Name, :Description, :UnitCost, :Quantity);
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


/* Display Orders table on Manage Orders Page*/
SELECT `OrderID` AS 'Order ID', `CustomerID` AS 'Rewards ID', `EmployeeID` AS 'Employee ID' FROM Orders;


/* Insert an item into the Orders table*/
--Variables OrderID, EmployeeID, and CustomerID
--to be passed to the database from Python/Flask app
LOCK TABLES `Orders` WRITE;
INSERT INTO `Orders` VALUES (0, :CustomerID, :EmployeeID);
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
--Variables OrderID, EmployeeID, and CustomerID
--to be passed to the database from Python/Flask app
DELETE FROM `Orders` WHERE `OrderID` = :OrderID;


/* Display Order Details table on Manage Orders Page when user searches by OrderID.*/
--Variable OrderID to be passed to the database from Python/Flask app.
SELECT Orders.OrderID, Inventory.PLU, Inventory.Name, Inventory.UnitCost AS `Unit Cost`, OrderItems.Quantity, (Inventory.UnitCost * OrderItems.Quantity) AS `Total`
FROM Inventory
JOIN OrderItems on OrderItems.PLU = Inventory.PLU
JOIN Orders on OrderItems.OrderID = Orders.OrderID
AND Orders.OrderID = :OrderID
ORDER BY Orders.OrderID DESC;


/* Display Order Details table on Manage Orders Page when user searches by CustomerID.*/
--Variable OrderID to be passed to the database from Python/Flask app.
SELECT Orders.OrderID, Inventory.PLU, Inventory.Name, Inventory.UnitCost AS `Unit Cost`, OrderItems.Quantity, (Inventory.UnitCost * OrderItems.Quantity) AS `Total`
FROM Inventory
JOIN OrderItems on OrderItems.PLU = Inventory.PLU
JOIN Orders on OrderItems.OrderID = Orders.OrderID 
JOIN Customers on Orders.CustomerID = Customers.CustomerID
AND Customers.CustomerID = :CustomerID
ORDER BY Orders.OrderID DESC;


/* Display Order Details table on Manage Orders Page when user searches by CustomerID.*/
--Variable OrderID to be passed to the database from Python/Flask app.
SELECT Orders.OrderID, Inventory.PLU, Inventory.Name, Inventory.UnitCost AS `Unit Cost`, OrderItems.Quantity, (Inventory.UnitCost * OrderItems.Quantity) AS `Total`
FROM Inventory
JOIN OrderItems on OrderItems.PLU = Inventory.PLU
JOIN Orders on OrderItems.OrderID = Orders.OrderID
JOIN Employees on Orders.EmployeeID = Employees.EmployeeID
AND Employees.EmployeeID = :EmployeeID
ORDER BY Orders.OrderID DESC;


/* Display Items in Inventory Order and Customer Order Form tables*/
--Pulls items one at a time from Inventory by searching by PLU or Item Name
--And stores data in a temporary list on Flask.
--Variable PLU to be passed to the database from Python/Flask app.
SELECT `PLU`, `Name`, `Description`, `UnitCost` AS 'Unit Cost' FROM `Inventory`
WHERE `PLU` = :PLU;


/* Create a new row in Orders and new rows in OrderItems when customer submits the Customer Order Form.*/
--CustomerID, OrderID, EmployeeID, PLU, Item Name, Description and 
LOCK TABLES `Orders` WRITE;
INSERT INTO `Orders` VALUES (0, :CustomerID, :EmployeeID);
UNLOCK TABLES;

LOCK TABLES `OrderItems` WRITE;
INSERT INTO `OrderItems` VALUES (0, :Quantity, :OrderID, :PLU);
UNLOCK TABLES;


/* Display Customer table on the View and Manage Customer Information page */
SELECT `CustomerID`, `Name`, `PhoneNumber`, `RewardsPts` FROM Customers;