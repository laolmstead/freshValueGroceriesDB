// Create a dropdown menu for Item Name search.
function dropdownMenu() {
    // Get all of the Inventory IDs and names to populate dropdown.
    input = "Get Inventory names"
    fetch('/orders-inv-dropdown', {
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
                    var select = document.getElementById("dropdown");
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

// Search for Inventory Item
function searchByName() {
	var quantity = document.getElementById('quantity').value;
	document.getElementById('quantity').value = '';
	var input = document.getElementById('dropdown').value;

	console.log("Searching for " + input + ".");
	console.log("Required quantity " + quantity);

    if (Number(quantity) < 1) {
        alert('Quantity must be greater than zero.');
    }
    else {
        // make a request for inventory with the given name
        fetch('/search-inventory-item', {
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

// Add item to inventory order form.
function addToInvForm(invItem, quantItem){
	var addTable = document.getElementById('invOrderList');

	var newRow = document.createElement("TR");
    addTable.appendChild(newRow);

    // Populate row with inventory items.
    for (var i = 0; i < 4; i++) {
    	var tableCell = document.createElement("TD");
        var tableText = document.createTextNode(invItem[0][i]);
        tableCell.appendChild(tableText);
        newRow.appendChild(tableCell);
    }

    // Add Quantity
    var quantCell = document.createElement("TD");
    var quantText = document.createTextNode(quantItem);
    quantCell.appendChild(quantText);
    newRow.appendChild(quantCell);

    // Add Update Button
    var updateTD = document.createElement("TD");
    var updateButton = document.createElement('button');
    updateButton.setAttribute("type", "button");
    updateButton.classList.add("btn", "btn-success");
    updateButton.innerText = "Update";
    updateButton.style.display = 'block';
    updateTD.appendChild(updateButton);
    //Attach Update function
    updateButton.onclick = function(updateButton) {
        var table = document.getElementById("invOrderList");
        var tr = updateButton.path[2];
        var currentRow = tr.cells;

        // Make Quantity cell editable.
        currentRow.item(4).contentEditable = "true";
        currentRow.item(4).classList.add("form-cell-style");

        // Hide Update Button and Show Submit button.
        var ub = currentRow.item(5).childNodes[0];
        ub.style.display = 'none';
        var sb = currentRow.item(5).childNodes[1];
        sb.style.display = 'block';

        // Hide Delete Button.
        var db = currentRow.item(6).childNodes[0];
        db.style.display = 'none';
    }

    // Add Submit Button
    var submitButton = document.createElement('button');
    submitButton.setAttribute("type", "button");
    submitButton.classList.add("btn", "btn-success");
    submitButton.innerText = "Submit";
    submitButton.style.display = 'none';
    updateTD.appendChild(submitButton);
    // Attach Submit Button
    submitButton.onclick = function(submitButton) {
        var table = document.getElementById("invOrderList");
        var tr = submitButton.path[2];
        var currentRow = tr.cells;

        // Make Quantity cell uneditable.
        currentRow.item(4).contentEditable = "false";
        currentRow.item(4).classList.remove("form-cell-style");

        // Show Update Button and Hide Submit button.
        var ub = currentRow.item(5).childNodes[0];
        ub.style.display = 'block';
        var sb = currentRow.item(5).childNodes[1];
        sb.style.display = 'none';

        // Show Delete Button.
        var db = currentRow.item(6).childNodes[0];
        db.style.display = 'block';
    }
    newRow.appendChild(updateTD);

    // Add Delete Button
    var deleteTD = document.createElement("TD");
    var deleteButton = document.createElement('button');
    deleteButton.setAttribute("type", "button");
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.innerText = "Delete";
    deleteButton.style.display = 'block';
    deleteTD.appendChild(deleteButton);
    // Attach Delete function
    deleteButton.onclick = function(deleteButton) {
        var table = document.getElementById("invOrderList");
        var tr = deleteButton.path[2];
        var row = tr.rowIndex;
        table.deleteRow(row);
    };

    newRow.appendChild(deleteTD);
}

// Add ordered items to inventory table.
function orderInventory() {
	var invArray = [];
	var table = document.getElementById("invOrderList");

	// Loop through each of the rows after the header and add to array.
	for (var i = 1; i < table.rows.length; i++) {
		var currentRow = table.rows.item(i).cells;
		var newItem = {
			"id": Number(currentRow.item(0).innerHTML),
			"quantity": Number(currentRow.item(4).innerHTML)
		};
		invArray.push(newItem);
	}
	console.log("To be added to inventory: " + invArray);

	// Clear table contents.
	for (var i = 1; i < table.rows.length; i++) {
		table.deleteRow(i);
	}

	// Send data to Inventory table.
	console.log("Updated inventory items:", invArray);

	fetch('/new-inventory-order', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(invArray)
	}).then(function(response) {
		return response.text();
	}).then(function (text) {
		console.log('Server response:', text);
		window.location.reload();
	});
}

dropdownMenu();
document.getElementById('addInvOrder').addEventListener("click", searchByName);
document.getElementById('submitInv').addEventListener("click", orderInventory);