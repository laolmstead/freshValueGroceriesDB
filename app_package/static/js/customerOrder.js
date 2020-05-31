// Create a dropdown menu for Customer Name search.
function customerDropdown() {
    // Get all of the Inventory IDs and names to populate dropdown.
    fetch('/customer-order-dropdown', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        response = JSON.parse(text);
        if (response.length == 0) {
            alert('No Customers by that name exist.');
        }
        else {
            for (var i = 0; i < response.length; i++) {
                var value = response[i][0];
                if (value) {
                    var select = document.getElementById("customerDropdown");
                    var option = document.createElement("option");
                    select.appendChild(option);
                    option.text = value;
                    select.add(option);
                }
            }
        }
    })
}

// Create a dropdown menu for Customer Name search.
function employeeDropdown() {
    // Get all of the Inventory IDs and names to populate dropdown.
    fetch('/employee-order-dropdown', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        response = JSON.parse(text);
        if (response.length == 0) {
            alert('No Employees with that ID exist.');
        }
        else {
            for (var i = 0; i < response.length; i++) {
                var value = response[i][0];
                if (value) {
                    var select = document.getElementById("employeeDropdown");
                    var option = document.createElement("option");
                    select.appendChild(option);
                    option.text = value;
                    select.add(option);
                }
            }
        }
    })
}

// Create a dropdown menu for Item Name search.
function inventoryDropdown() {
    // Get all of the Inventory IDs and names to populate dropdown.
    input = "Get Inventory names"
    fetch('/cust-order-inv-dropdown', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"message": input})
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        response = JSON.parse(text);
        if (response.length == 0) {
            alert('No Inventory items available.');
        }
        else {
            for (var i = 0; i < response.length; i++) {
                var value = response[i][0];
                if (value) {
                    var select = document.getElementById("inventoryDropdown");
                    var option = document.createElement("option");
                    select.appendChild(option);
                    console.log(value);
                    option.text = value;
                    select.add(option);
                }
            }
        }
    })
}

// Start a new customer order by getting Customer Info and Employee Info if applicable.
function startOrder() {
    var employeeID = Number(document.getElementById('employeeDropdown').value);
    var customerName = document.getElementById('customerDropdown').value;
    var newOrder = {};

    var existingCustomer = document.getElementById("startOrderForm");
    existingCustomer.style.display = 'none';

    var getHeader = document.getElementById("insertHeader");
    getHeader.innerText = "Hello, " + customerName + "! Add items to your order below."

    var addItems = document.getElementById("addItems");
    addItems.style.display = 'block';

    // make a request for customer id with the given name
    fetch('/get-customer-id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"name": customerName})
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        response = JSON.parse(text);
        if (response.length == 0) {
            alert('Customer does not exist. \nRegister by clicking the "New Customer" button and signing up.');
        }
        else {
            var customerID = Number(response[0][0]);

            newOrder.CustomerID = customerID;
            newOrder.EmployeeID = employeeID;
        }
        return newOrder;
    }).then(function(newOrder) {

        return fetch('/insert-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newOrder)
        });
    }).then(function(data) {
        return data.text();
    }).then(function(text) {
        console.log('Server response', text);
    });
}

// Search for Order Item and add to table
function searchByName() {
    var quantity = document.getElementById('quantity').value;
    document.getElementById('quantity').value = '';
    var input = document.getElementById('inventoryDropdown').value;

    console.log("Searching for " + input + ".");
    console.log("Required quantity " + quantity);

    if (Number(quantity) < 1) {
        alert('Quantity must be greater than zero.');
    }
    else {
        // make a request for inventory with the given name
        fetch('/search-order-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"name": input})
        }).then(function (response) {
            return response.text();
        }).then(function (text) {
            response = JSON.parse(text);
            console.log(response);
            if (response.length == 0) {
                alert('Inventory item does not exist. \nCreate new item on Inventory page before adding to order.');
            }
            else {
                addToInvForm(response, quantity);
            }
        });
    }
}


// Add item to order form.
function addToInvForm(orderItem, quantItem){
    var orderList = document.getElementById('orderList');
    orderList.style.display = 'block';

    var addTable = document.getElementById('orderTable');

    var newRow = document.createElement("TR");
    addTable.appendChild(newRow);

    // Populate row with order details
    for (var i = 0; i < 4; i++) {
        var tableCell = document.createElement("TD");
        var tableText = document.createTextNode(orderItem[0][i]);
        tableCell.appendChild(tableText);
        newRow.appendChild(tableCell);
    }

    // Add Quantity
    var quantCell = document.createElement("TD");
    var quantText = document.createTextNode(quantItem);
    quantCell.appendChild(quantText);
    newRow.appendChild(quantCell);

    // Add Cost
    var costCell = document.createElement("TD");
    var costText = document.createTextNode(orderItem[0][3] * quantItem);
    costCell.appendChild(costText);
    newRow.appendChild(costCell);

    // Add Update Button
    var updateTD = document.createElement("TD");
    var updateButton = document.createElement('button');
    updateButton.setAttribute("type", "button");
    updateButton.classList.add("btn", "btn-success");
    updateButton.innerText = "Update";
    updateTD.appendChild(updateButton);
    newRow.appendChild(updateTD);

    // Add Delete Button
    var deleteTD = document.createElement("TD");
    var deleteButton = document.createElement('button');
    deleteButton.setAttribute("type", "button");
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.innerText = "Delete";
    deleteTD.appendChild(deleteButton);
    newRow.appendChild(deleteTD);
}

function placeOrder() {
    var orderID;
    // get OrderID from Flask
    fetch('/get-order-id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        response = JSON.parse(text);
        console.log(response);
        if (response.length == 0) {
            alert('Order failed. Please try again.');
        }
        else {
            orderID = Number(response[0][0]);
        }

        return orderID;
    }).then(function(orderID) {
        orderArray = [];
        table = document.getElementById("orderTable");

        // Loop through each of the rows after the header and add to array.
        for (var i = 1; i < table.rows.length; i++) {
            var currentRow = table.rows.item(i).cells;
            var newItem = {
                "quantity": currentRow.item(4).innerHTML,
                "OrderID": orderID,
                "PLU": currentRow.item(0).innerHTML
            };
            orderArray.push(newItem);
        }
        console.log("To be added to inventory: " + orderArray);

        // Clear table contents.
        for (var i = 1; i < table.rows.length; i++) {
            table.deleteRow(i);
        }

        // Send data to Inventory table.
        console.log("Order items:", orderArray);

        fetch('/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderArray)
        }).then(function(response) {
            return response.text();
        }).then(function (text) {
            console.log('Server response:', text);
            window.location.reload();
        });
    });
}

customerDropdown();
employeeDropdown();
inventoryDropdown();
document.getElementById('startOrder').addEventListener("click", startOrder);
document.getElementById('addToOrder').addEventListener("click", searchByName);
document.getElementById('placeOrder').addEventListener("click", placeOrder);
document.getElementById('newButton').addEventListener("click", event => {
    location.href = "customers"});


