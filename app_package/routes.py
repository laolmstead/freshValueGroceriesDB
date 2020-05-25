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

################################################
# Orders
################################################
@app.route('/orders')
def orders_page():
    print('Fetching and rendering Orders page', flush=True)
    db_connection = connect_to_database()
    query = "SELECT OrderID, CustomerID, EmployeeID FROM Orders;"
    result = execute_query(db_connection, query).fetchall()
    print('Orders table query returns:', result, flush=True)
    return render_template('orders.html', results=result)

@app.route('/customerOrder')
def customerOrder_page():
    print('Fetching and rendering Customer Orders ')
    return render_template('customerOrder.html')

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
    query =  """INSERT INTO `Shifts` 
                    (`Day`, `StartTime`, `EndTime`)  
                    VALUES (%s, %s, %s);"""
    data = (info["day"], info["start_time"], info["end_time"])
    execute_query(db_connection, query, data)
    return make_response('Shift added!', 200)

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

@app.route('/inventoryOrder')
def inventoryOrder_page():
    return render_template('inventoryOrder.html')

