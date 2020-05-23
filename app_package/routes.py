from flask import render_template
from app_package import app

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/customers')
def customers_page():
    return render_template('customers.html')

@app.route('/orders')
def orders_page():
    return render_template('orders.html')

@app.route('/customerOrder')
def customerOrder_page():
    return render_template('customerOrder.html')

@app.route('/employees')
def employees_page():
    return render_template('employees.html')

@app.route('/shifts')
def shifts_page():
    return render_template('shifts.html')

@app.route('/inventory')
def inventory_page():
    return render_template('inventory.html')

@app.route('/inventoryOrder')
def inventoryOrder_page():
    return render_template('inventoryOrder.html')

