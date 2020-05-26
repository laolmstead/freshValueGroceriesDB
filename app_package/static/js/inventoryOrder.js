// Search for Inventory Item
function searchByName() {
	var quantity = document.getElementById('quantity').value;
	var input = document.getElementById('item').value;

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

    // Populate row with 
    for (var i = 0; i < 4; i++) {
    	var tableCell = document.createElement("TD");
        var tableText = document.createTextNode(invItem[i]);
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


document.getElementById('addInvOrder').addEventListener("click", searchByName);
