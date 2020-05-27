// Search for Inventory Item
function searchByName() {
	var quantity = document.getElementById('quantity').value;
	document.getElementById('quantity').value = '';
	var input = document.getElementById('item').value;
	document.getElementById('item').value = '';

	console.log("Searching for " + input + ".");
	console.log("Required quantity " + quantity);

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

// Add ordered items to inventory table.
function orderInventory() {
	invArray = [];
	table = document.getElementById("invOrderList");

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

document.getElementById('addInvOrder').addEventListener("click", searchByName);
document.getElementById('submitInv').addEventListener("click", orderInventory);

