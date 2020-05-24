from flask import render_template
from app_package import app

from app_package.db_connector.db_connector import connect_to_database, execute_query

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/customers')
def customers_page():
    print('Fetching and rendering Customers page', flush=True)
    db_connection = connect_to_database()
    query = "SELECT CustomerID, Name, PhoneNumber, RewardsPts FROM Customers;"
    result = execute_query(db_connection, query).fetchall()
    print('Customers table query returns:', result, flush=True)
    return render_template('customers.html', rows=result)

@app.route('/orders')
def orders_page():
    return render_template('orders.html')

@app.route('/customerOrder')
def customerOrder_page():
    return render_template('customerOrder.html')

@app.route('/employees')
def employees_page():
    print('Fetching and rendering Employees page', flush=True)
    db_connection = connect_to_database()
    query = "SELECT EmployeeID, Name, HourlyWage, Responsibilities, SickDays FROM Employees;"
    result = execute_query(db_connection, query).fetchall()
    print('Employees table query returns:', result, flush=True)
    return render_template('employees.html', rows=result)

@app.route('/shifts')
def shifts_page():
    print('Fetching and rendering Shifts page', flush=True)
    db_connection = connect_to_database()
    query = "SELECT ShiftID, Day, StartTime, EndTime FROM Shifts;"
    result = execute_query(db_connection, query).fetchall()
    print('Shifts table query returns:', result, flush=True)
    return render_template('shifts.html', rows=result)

@app.route('/inventory')
def inventory_page():
    return render_template('inventory.html')

@app.route('/inventoryOrder')
def inventoryOrder_page():
    return render_template('inventoryOrder.html')

