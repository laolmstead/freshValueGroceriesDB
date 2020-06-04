from flask import json, jsonify, request, render_template, make_response
from app_package import app

from app_package.db_connector.db_connector import connect_to_database, execute_query

################################################
# Index
################################################
@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

################################################
# Customers
################################################
@app.route('/customers')
def customers_page():
    print('Fetching and rendering Customers page', flush=True)
    db_connection = connect_to_database()
    query = "SELECT CustomerID, Name, PhoneNumber, RewardsPts FROM Customers;"
    result = execute_query(db_connection, query).fetchall()
    print('Customers table query returns:', result, flush=True)
    return render_template('customers.html', rows=result)

@app.route('/new-customer', methods=['POST'])
def insert_new_customer():
    print('Inserting new customer into the database', flush=True)
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    query =  """INSERT INTO `Customers` 
                (`Name`, `PhoneNumber`, `RewardsPts`) 
                VALUES (%s, %s, %s);"""
    data = (info["name"], info["phone"], info["points"])
    execute_query(db_connection, query, data)
    return make_response('Customer added!', 200)

@app.route('/search-customers-name', methods=['POST'])
def search_customers_by_name():
    db_connection = connect_to_database()
    search_term = request.get_json(force=True)["input"]
    query =  """SELECT CustomerID, Name, PhoneNumber, RewardsPts 
                    FROM Customers WHERE Name = %s;"""
    data = (search_term,)
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/search-customers-phone', methods=['POST'])
def search_customers_by_phone_number():
    db_connection = connect_to_database()
    search_term = request.get_json(force=True)["input"]
    query =  """SELECT CustomerID, Name, PhoneNumber, RewardsPts 
                    FROM Customers WHERE PhoneNumber = %s;"""
    data = (search_term,)
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/search-customers-pts', methods=['POST'])
def search_customers_by_points():
    db_connection = connect_to_database()
    search_terms = request.get_json(force=True)
    query =  """SELECT `CustomerID`, `Name`, `PhoneNumber`, `RewardsPts` 
                FROM Customers WHERE `RewardsPts` >= %s AND `RewardsPts` <= %s;"""
    data = (search_terms["lower"], search_terms["upper"])
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/delete-customer', methods=['POST'])
def delete_customer():
    db_connection = connect_to_database()
    customer_id = request.get_json(force=True)["customer_id"]
    query =  """DELETE FROM `Customers` WHERE `CustomerID` = %s;"""
    data = (customer_id,)
    execute_query(db_connection, query, data).fetchall()
    message = 'Customer with ID ' + customer_id + ' removed from the database'
    return make_response(message, 200)

@app.route('/update-customer', methods=['POST'])
def update_customer():
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    data = (info["name"], info["phone"], info["points"], info["id"])
    query = """UPDATE `Customers` 
            SET `Name` = %s,
                `PhoneNumber` = %s,
                `RewardsPts` = %s
            WHERE `CustomerID` = %s;"""
    execute_query(db_connection, query, data)
    return make_response('Updated customer information', 200)

################################################
# Orders
################################################

@app.route('/orders')
def orders_page():
    print('Fetching and rendering Orders page', flush=True)
    db_connection = connect_to_database()
    query = """SELECT Orders.OrderID, Inventory.Name, Inventory.Description, Inventory.UnitCost, OrderItems.Quantity, (Inventory.UnitCost * OrderItems.Quantity), OrderItems.OrderItemID AS `Total`
                FROM Inventory
                JOIN OrderItems on OrderItems.PLU = Inventory.PLU
                JOIN Orders on OrderItems.OrderID = Orders.OrderID
                ORDER BY Orders.OrderID DESC;"""
    result = execute_query(db_connection, query).fetchall()
    print('Orders table query returns:', result, flush=True)
    return render_template('orders.html', results=result)

@app.route('/search-orders-cust-id', methods=['POST'])
def search_orders_by_cust_id():
    db_connection = connect_to_database()
    search_term = request.get_json(force=True)["id"]
    query = """SELECT Orders.OrderID, Inventory.Name, Inventory.Description, Inventory.UnitCost, OrderItems.Quantity, (Inventory.UnitCost * OrderItems.Quantity) AS `Total`
                FROM Inventory
                JOIN OrderItems on OrderItems.PLU = Inventory.PLU
                JOIN Orders on OrderItems.OrderID = Orders.OrderID
                JOIN Customers on Orders.CustomerID = Customers.CustomerID
                AND Customers.CustomerID = %s
                ORDER BY Orders.OrderID DESC;"""
    data = (search_term,)
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/search-orders-name', methods=['POST'])
def search_orders_by_name():
    db_connection = connect_to_database()
    search_term = request.get_json(force=True)["name"]
    query = """SELECT Orders.OrderID, Inventory.Name, Inventory.Description, Inventory.UnitCost, OrderItems.Quantity, (Inventory.UnitCost * OrderItems.Quantity) AS `Total`
                FROM Inventory
                JOIN OrderItems on OrderItems.PLU = Inventory.PLU
                JOIN Orders on OrderItems.OrderID = Orders.OrderID
                JOIN Customers on Orders.CustomerID = Customers.CustomerID
                AND Customers.Name = %s
                ORDER BY Orders.OrderID DESC;"""
    data = (search_term,)
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/search-orders-phone', methods=['POST'])
def search_orders_by_phone():
    db_connection = connect_to_database()
    search_term = request.get_json(force=True)["phone"]
    query = """SELECT Orders.OrderID, Inventory.Name, Inventory.Description, Inventory.UnitCost, OrderItems.Quantity, (Inventory.UnitCost * OrderItems.Quantity) AS `Total`
                FROM Inventory
                JOIN OrderItems on OrderItems.PLU = Inventory.PLU
                JOIN Orders on OrderItems.OrderID = Orders.OrderID
                JOIN Customers on Orders.CustomerID = Customers.CustomerID
                AND Customers.PhoneNumber = %s
                ORDER BY Orders.OrderID DESC;"""
    data = (search_term["phone"],)
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/search-orders-employee', methods=['POST'])
def search_orders_by_employee():
    db_connection = connect_to_database()
    search_term = request.get_json(force=True)["name"]
    query = """SELECT Orders.OrderID, Inventory.Name, Inventory.Description, Inventory.UnitCost, OrderItems.Quantity, (Inventory.UnitCost * OrderItems.Quantity) AS `Total`
                FROM Inventory
                JOIN OrderItems on OrderItems.PLU = Inventory.PLU
                JOIN Orders on OrderItems.OrderID = Orders.OrderID
                JOIN Employees on Orders.EmployeeID = Employees.EmployeeID
                AND Employees.Name = %s
                ORDER BY Orders.OrderID DESC;"""
    data = (search_term,)
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/update-orders', methods=['POST'])
def update_orders():
    print("Updating OrderItems in database", flush=True)
    db_connection = connect_to_database()
    OrderItemID = request.get_json(force=True)['id']
    quantity = int(request.get_json(force=True)['quantity'])

    # Update Quantity of items ordered
    query = """UPDATE `OrderItems`
            SET
                `Quantity` = %s
            WHERE
                `OrderItemID` = %s;"""
    data = (quantity, OrderItemID)
    execute_query(db_connection, query, data)
    return make_response('Inventory added!', 200)

@app.route('/delete-order-item', methods=['POST'])
def delete_order_item():
    print("Deleting OrderItems from database", flush=True)
    db_connection = connect_to_database()
    OrderItemID = request.get_json(force=True)["info"]
    print("id:", OrderItemID)
    query = """DELETE FROM `OrderItems` WHERE `OrderItemID` = %s;"""
    data = (OrderItemID,)
    execute_query(db_connection, query, data)
    return make_response('OrderItem deleted!', 200)

@app.route('/customerOrder')
def customerOrder_page():
    print('Fetching and rendering Customer Orders ')
    return render_template('customerOrder.html')

@app.route('/get-customer-id', methods=['POST'])
def get_customer_id():
    print('Fetching customer id', flush=True)
    db_connection = connect_to_database()
    search_term = request.get_json(force=True)["name"]
    query = """SELECT CustomerID FROM Customers WHERE Name = %s;"""
    data = (search_term,)
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/insert-order', methods=['POST'])
def insert_order():
    print('Inserting new order into the database', flush=True)
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    print("Info", info)
    query =  """INSERT INTO `Orders` 
                (`CustomerID`, `EmployeeID`)
                VALUES (%s, %s);"""
    data = (info["CustomerID"], info["EmployeeID"])
    execute_query(db_connection, query, data)
    return make_response('Order added!', 200)

@app.route('/get-order-id', methods=['POST'])
def get_order_id():
    print('Get more recent order id from database', flush=True)
    db_connection = connect_to_database()
    query = """ SELECT MAX(OrderID) FROM Orders;"""
    result = execute_query(db_connection, query).fetchall()
    print("result:",result)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/search-order-item', methods=['POST'])
def search_order_item():
    print('Fetching and rendering Order page', flush=True)
    db_connection = connect_to_database()
    search_term = request.get_json(force=True)["name"]
    query = """SELECT PLU, Name, Description, UnitCost
                FROM Inventory
                WHERE Name LIKE %s
                ORDER BY Name;"""
    data = (["%" + search_term + "%"])
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/place-order', methods=['POST'])
def place_order():
    print("Place an Order and update OrderItems database", flush=True)
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    for item in info:
        quantity = item['quantity']
        order_id = item['OrderID']
        plu = item['PLU']
        query = """INSERT INTO `OrderItems` 
                    (`Quantity`, `OrderID`, `PLU`) 
                    VALUES (%s, %s, %s);"""
        data = (quantity, order_id, plu)
        execute_query(db_connection, query, data)
    return make_response('Order added!', 200)

@app.route('/customer-order-dropdown', methods=['POST'])
def customer_order_dropdown():
    print('Fetching List of Customer names')
    db_connection = connect_to_database()
    query = """SELECT Name FROM `Customers` ORDER BY Name;"""
    result = execute_query(db_connection, query).fetchall()
    print('Customer name results')
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/employee-order-dropdown', methods=['POST'])
def employee_order_dropdown():
    print('Fetching List of Employee names')
    db_connection = connect_to_database()
    query = """SELECT EmployeeID FROM `Employees`;"""
    result = execute_query(db_connection, query).fetchall()
    print('Employee name results')
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/cust-order-inv-dropdown', methods=['POST'])
def cust_order_inv_dropdown():
    print('Fetching List of Inventory names')
    db_connection = connect_to_database()
    query = """SELECT Name FROM Inventory;"""
    result = execute_query(db_connection, query).fetchall()
    print('Inventory name results')
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

################################################
# Employees
################################################
@app.route('/employees')
def employees_page():
    print('Fetching and rendering Employees page', flush=True)
    db_connection = connect_to_database()
    query = "SELECT EmployeeID, Name, HourlyWage, Responsibilities, SickDays FROM Employees;"
    result = execute_query(db_connection, query).fetchall()
    print('Employees table query returns:', result, flush=True)
    return render_template('employees.html', rows=result)

@app.route('/get-shifts', methods=['POST'])
def get_shifts_for_employee():
    print('Fetching and returning shifts that a given employee works', flush=True)
    db_connection = connect_to_database()

    # Get the ID of the employee to view shifts for
    employee_id = request.get_json(force=True)['employee_id']
    print('Received this employee ID:', employee_id, flush=True)

    # Construct the query
    string_query = """SELECT Employees.Name, Shifts.ShiftID, Shifts.Day, 
            Shifts.StartTime, Shifts.EndTime FROM `Shifts`
            JOIN `EmployeeShifts` ON Shifts.ShiftID = EmployeeShifts.ShiftID
            JOIN `Employees` ON EmployeeShifts.EmployeeID = Employees.EmployeeID
            WHERE Employees.EmployeeID = {0};"""
    query = string_query.format(employee_id)
    result = execute_query(db_connection, query).fetchall()
    print('Get shifts query returns:', result, flush=True)

    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/new-employee', methods=['POST'])
def insert_new_employee():
    print('Inserting new employee into the database', flush=True)
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    string_query =  """INSERT INTO `Employees` 
                    (`Name`, `HourlyWage`, `Responsibilities`, `SickDays`) 
                    VALUES (%s, %s, %s, %s);"""
    data = (info["name"], info["wage"], info["duties"], info["sick_days"])
    execute_query(db_connection, string_query, data)
    return make_response('Employee added!', 200)

@app.route('/search-employees-id', methods=['POST'])
def search_employees_by_id():
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    query =  """SELECT `EmployeeID`, `Name`, `HourlyWage`, `Responsibilities`, 
                `SickDays` FROM `Employees` WHERE `EmployeeID` = %s;"""
    data = (info["id"],)
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/search-employees-name', methods=['POST'])
def search_employees_by_name():
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    query =  """SELECT `EmployeeID`, `Name`, `HourlyWage`, `Responsibilities`, 
                `SickDays` FROM `Employees` WHERE `Name` = %s;"""
    data = (info["name"],)
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/search-employees-duties', methods=['POST'])
def search_employees_by_duties():
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    query =  """SELECT `EmployeeID`, `Name`, `HourlyWage`, `Responsibilities`, 
                `SickDays` FROM `Employees` WHERE `Responsibilities` = %s;"""
    data = (info["duties"],)
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/search-employees-wage', methods=['POST'])
def search_employees_by_wage():
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    query =  """SELECT `EmployeeID`, `Name`, `HourlyWage`, `Responsibilities`, 
                `SickDays` FROM `Employees` WHERE `HourlyWage` = %s;"""
    data = (info["wage"],)
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/search-employees-sick-days', methods=['POST'])
def search_employees_by_sick_days():
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    query =  """SELECT `EmployeeID`, `Name`, `HourlyWage`, `Responsibilities`, 
                `SickDays` FROM `Employees` WHERE `SickDays` = %s;"""
    data = (info["sickdays"],)
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/delete-employee', methods=['POST'])
def delete_employee():
    db_connection = connect_to_database()
    employee_id = request.get_json(force=True)["employee_id"]

    # delete from the Employees table
    query =  """DELETE FROM `Employees` WHERE `EmployeeID` = %s;"""
    data = (employee_id,)
    execute_query(db_connection, query, data)

    # delete rows with null foreign keys from the EmployeeShifts table
    query = """DELETE FROM `EmployeeShifts` WHERE `EmployeeID` IS NULL OR `ShiftID` IS NULL"""
    execute_query(db_connection, query)

    message = 'Employee with ID ' + employee_id + ' removed from the database'
    return make_response(message, 200)

@app.route('/update-employee', methods=['POST'])
def update_employee():
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    data = (info["name"], info["wage"], info["duties"], info["sick_days"], info["id"])
    query = """UPDATE `Employees` 
                SET `Name` = %s,
                    `HourlyWage` = %s,
                    `Responsibilities` = %s,
                    `SickDays` = %s
                WHERE `EmployeeID` = %s;"""
    execute_query(db_connection, query, data)
    return make_response('Updated employee information', 200)


################################################
# Shifts
################################################
@app.route('/shifts')
def shifts_page():
    print('Fetching and rendering Shifts page', flush=True)
    db_connection = connect_to_database()
    query = "SELECT ShiftID, Day, StartTime, EndTime FROM Shifts;"
    result = execute_query(db_connection, query).fetchall()
    print('Shifts table query returns:', result, flush=True)
    return render_template('shifts.html', rows=result)

@app.route('/new-shift', methods=['POST'])
def insert_new_shift():
    print('Inserting new shift into the database', flush=True)
    db_connection = connect_to_database()
    info = request.get_json(force=True)

    # check if the shift already exists
    query = """SELECT Day, StartTime, EndTime FROM `Shifts` 
            WHERE Day = %s AND StartTime = %s AND EndTime = %s;"""
    data = (info["day"], info["start_time"], info["end_time"])
    result = execute_query(db_connection, query, data).fetchall()
    print('result:', result, flush=True)
    if result:
        return make_response('Shift already exists!', 500)
    else:
        query = """INSERT INTO `Shifts` 
                (`Day`, `StartTime`, `EndTime`)  
                VALUES (%s, %s, %s);"""
        data = (info["day"], info["start_time"], info["end_time"])
        execute_query(db_connection, query, data)
        return make_response('Shift added!', 200)

@app.route('/get-employees', methods=['POST'])
def get_employees_for_shift():
    print('Fetching and returning employees assigned to a given shift', flush=True)
    db_connection = connect_to_database()

    # Get the ID of the employee to view shifts for
    shift_id = request.get_json(force=True)['shift_id']
    print('Received this shift ID:', shift_id, flush=True)

    # Construct the query
    string_query =  """SELECT Shifts.ShiftID, Employees.Name FROM `Shifts`
                    JOIN `EmployeeShifts` ON Shifts.ShiftID = EmployeeShifts.ShiftID
                    JOIN `Employees` ON EmployeeShifts.EmployeeID = Employees.EmployeeID
                    WHERE Shifts.ShiftID = {0};"""
    query = string_query.format(shift_id)
    result = execute_query(db_connection, query).fetchall()
    print('Get employees query returns:', result, flush=True)

    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/assign-shift', methods=['POST'])
def assign_shift():
    print('Inserting new entry into EmployeeShifts')
    db_connection = connect_to_database()

    shift_id = request.get_json(force=True)['shift_id']
    employee_id = request.get_json(force=True)['employee_id']
    print('Received shiftID:', shift_id, flush=True)
    print('Received employeeID:', employee_id, flush=True)

    # check if shiftID is valid
    query = """SELECT ShiftID FROM `Shifts` WHERE ShiftID = %s"""
    data = (shift_id,)
    result = execute_query(db_connection, query, data).fetchall()
    if result == ():
        return make_response('Invalid ShiftID', 500)

    # check if employeeID is valid
    query = """SELECT EmployeeID FROM `Employees` WHERE EmployeeID = %s"""
    data = (employee_id,)
    result = execute_query(db_connection, query, data).fetchall()
    if result == ():
        return make_response('Invalid EmployeeID', 500)

    # check if assignment already exists
    query = """SELECT EmployeeID, ShiftID FROM `EmployeeShifts` 
            WHERE EmployeeID = %s AND ShiftID = %s;"""
    data = (employee_id, shift_id)
    result = execute_query(db_connection, query, data).fetchall()
    print('result:', result, flush=True)
    if result:
        return make_response('Employee already works this shift!', 500)
    else:
        query = """INSERT INTO `EmployeeShifts` (`EmployeeID`, `ShiftID`) VALUES (%s, %s);"""
        data = (employee_id, shift_id)
        execute_query(db_connection, query, data)
        return make_response('Assigned a shift to an employee!', 200)

@app.route('/delete-shift', methods=['POST'])
def delete_shift():
    db_connection = connect_to_database()
    shift_id = request.get_json(force=True)["shift_id"]

    # delete from the Employees table
    query =  """DELETE FROM `Shifts` WHERE `ShiftID` = %s;"""
    data = (shift_id,)
    execute_query(db_connection, query, data)

    # delete rows with null foreign keys from the EmployeeShifts table
    query = """DELETE FROM `EmployeeShifts` WHERE `EmployeeID` IS NULL OR `ShiftID` IS NULL"""
    execute_query(db_connection, query)

    message = 'Shift with ID ' + shift_id + ' removed from the database'
    return make_response(message, 200)

@app.route('/update-shift', methods=['POST'])
def update_shift():
    print("Updating Shift in database", flush=True)
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    data = (info["day"], info["start_time"], info["end_time"], info["id"])
    query = """UPDATE `Shifts` 
                SET `Day` = %s,
                    `StartTime` = %s,
                    `EndTime` = %s
                WHERE `ShiftID` = %s;"""
    execute_query(db_connection, query, data)
    return make_response('Updated shift information', 200)

################################################
# Inventory
################################################
@app.route('/inventory')
def inventory_page():
    print('Fetching and rendering Inventory page', flush=True)
    db_connection = connect_to_database()
    query = "SELECT PLU, Name, Description, UnitCost, Quantity FROM Inventory;"
    result = execute_query(db_connection, query).fetchall()
    print('Inventory table query returns: ', result, flush=True)
    return render_template('inventory.html', results=result)

@app.route('/new-inventory', methods=['POST'])
def insert_new_inventory():
    print("Inserting new inventory into database", flush=True)
    db_connection = connect_to_database()
    item = request.get_json(force=True)['item']
    description = request.get_json(force=True)['description']
    unit = float(request.get_json(force=True)['unit'])
    quantity = int(request.get_json(force=True)['quantity'])
    query = """INSERT INTO `Inventory` (`Name`, `Description`, `UnitCost`, `Quantity`) VALUES (%s, %s, %s, %s);"""
    data = (item, description, unit, quantity)
    execute_query(db_connection, query, data)
    return make_response('Inventory added!', 200)

@app.route('/update-inventory', methods=['POST'])
def update_inventory():
    print("Updating Inventory in database", flush=True)
    db_connection = connect_to_database()
    plu = request.get_json(force=True)['plu']
    item = request.get_json(force=True)['item']
    description = request.get_json(force=True)['description']
    unit = float(request.get_json(force=True)['unit'])
    quantity = int(request.get_json(force=True)['quantity'])
    query = """UPDATE `Inventory`
            SET
                `Name` = %s,
                `Description` = %s,
                `UnitCost` = %s,
                `Quantity` = %s
            WHERE
                `PLU` = %s;"""
    data = (item, description, unit, quantity, plu)
    execute_query(db_connection, query, data)
    return make_response('Inventory added!', 200)

@app.route('/delete-inventory', methods=['POST'])
def delete_inventory():
    print("Deleting Inventory from database", flush=True)
    db_connection = connect_to_database()
    plu = request.get_json(force=True)["info"]
    print("plu:", plu)
    query = """DELETE FROM `Inventory` WHERE `PLU` = %s;"""
    data = (plu,)
    execute_query(db_connection, query, data)
    return make_response('Inventory deleted!', 200)

@app.route('/inventoryOrder')
def inventoryOrder_page():
    return render_template('inventoryOrder.html')

@app.route('/orders-inv-dropdown', methods=['POST'])
def orders_inv_dropdown():
    print('Fetching List of Inventory names')
    db_connection = connect_to_database()
    query = """SELECT Name FROM `Inventory` ORDER BY Name ASC;"""
    result = execute_query(db_connection, query).fetchall()
    print('Inventory name results')
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/search-inventory-item', methods=['POST'])
def search_inventory_item():
    print('Fetching and rendering Inventory page', flush=True)
    db_connection = connect_to_database()
    search_term = request.get_json(force=True)["name"]
    query = """SELECT PLU, Name, Description, UnitCost
                FROM Inventory
                WHERE Name LIKE %s
                ORDER BY Name;"""
    data = ("%" + search_term + "%")
    result = execute_query(db_connection, query, data).fetchall()
    print('Query returns:', result, flush=True)
    return make_response(json.dumps(result, indent=4, sort_keys=True, default=str), 200)

@app.route('/new-inventory-order', methods=['POST'])
def new_inventory_order():
    print("Ordering new inventory and adding into database", flush=True)
    db_connection = connect_to_database()
    info = request.get_json(force=True)
    for item in info:
        inv_id = item['id']
        quantity = item['quantity']
        print("Updating Inventory Table item", inv_id, "with", quantity, "additional items.")
        query = """UPDATE `Inventory`
                    SET
                        `Quantity` = (SELECT Quantity FROM Inventory WHERE PLU = %s) + %s
                    WHERE
                        `PLU` = %s;"""
        data = (inv_id, quantity, inv_id)
        execute_query(db_connection, query, data)
    return make_response('Inventory added!', 200)
