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

function placeOrder() {
    var employeeID = document.getElementById('employeeID').value;
    var customerName = document.getElementById('custName').value;

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

            newOrder = {
                "CustomerID": customerID,
                "EmployeeID": employeeID
            };
            return newOrder;
        }
    });
}

function insertNewOrder(order) {

    // send order info to flask
    fetch('/insert-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderInfo)
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        console.log('Server response:', text);
        // refresh the page to show updated table
        window.location.reload();
    });
}

function manageOrder() {
    // Calling both of these functions leads to a Promise conflict
    // which results in the insertNewOrder() not being called properly.
    // Reearch how to handle this.

    orderInfo = placeOrder();
    console.log(orderInfo);

    if (orderInfo > 0) {
        insertNewOrder(orderInfo);
    }
}


// This function will have the same issue as above.
function getOrderID() {
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
            var orderID = response[0][0];
        }
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

document.getElementById('registerCustomer').addEventListener("click", insertNewCustomer);
document.getElementById('startOrder').addEventListener("click", manageOrder);
document.getElementById('addToOrder').addEventListener("click", searchByName);

