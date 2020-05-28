// Implement new customer add function on customerOrders page.

function insertNewCustomer() {
    var name = document.getElementById('addName').value;
    var phone = document.getElementById('addPhone').value;

    document.getElementById('addName').value = '';
    document.getElementById('addPhone').value = '';

    var info = {
        "name": name,
        "phone": phone,
        "points": 0
    }
    console.log('Customer info:', info);

    // send customer's info to flask
    fetch('/new-order-customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        console.log('Server response:', text);
        // refresh the page to show updated table
        window.location.reload();
    });
}

function startOrder() {
    var employeeID = Number(document.getElementById('employeeID').value);
    var customerName = document.getElementById('custName').value;
    var newOrder = {};

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
    var input = document.getElementById('item').value;
    document.getElementById('item').value = '';

    console.log("Searching for " + input + ".");
    console.log("Required quantity " + quantity);

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


// Add item to order form.
function addToInvForm(orderItem, quantItem){
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

// This function will have the same issue as above.
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

/* DELETE
    var employeeID = Number(document.getElementById('employeeID').value);
    var customerName = document.getElementById('custName').value;
    var newOrder = {};

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
*/

document.getElementById('startOrder').addEventListener("click", startOrder);
document.getElementById('addToOrder').addEventListener("click", searchByName);
document.getElementById('placeOrder').addEventListener("click", placeOrder);
document.getElementById('newButton').addEventListener("click", event => {
    location.href = "customers"});


