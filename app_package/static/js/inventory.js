// Insert new Inventory items into table.
function insertNewInventory() {
	var item = document.getElementById('itemName').value;
	var description = document.getElementById('description').value;
	var unit = document.getElementById('unitCost').value;
	var quantity = document.getElementById('quantity').value;

	if (!item) {
		alert('Enter a valid item name.');
		return;
	}

	if (!description) {
		alert('Enter a valid description for the item.');
		return;
	}

	if (!unit) {
		alert('Enter a valid unit cost.');
		return;
	}

	if (!quantity) {
		alert('Enter a valid quantity.');
		return;
	}

	var insert = {
		"item": item,
		"description": description,
		"unit": Number(unit),
		"quantity": Number(quantity)
	}
	console.log("Inventory item:", insert);

	fetch('/new-inventory', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(insert)
	}).then(function(response) {
		return response.text();
	}).then(function (text) {
		console.log('Server response:', text);
		window.location.reload();
	});
}

// Display or hide form if button is clicked.
function displaySearch(){
	var show = document.getElementById('searchForm');
	if (show.style.display === 'block') {
		show.style.display = 'none';
	}
	else {
		show.style.display = 'block';
	}
 }

// Make a request for inventory with the given name.
 function searchInventory() {
 	var input = document.getElementById('searchInput').value;
 	document.getElementById('searchInput').value = '';

 	fetch('/search-inventory-name', {
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
            alert('No results found for inventory item named ' + input);
        }
        else {
            search = input
            makeTable(search, response);
        }
    });
}

// Make a table to display inventory item.
function makeTable(input, inventoryInfo) {
    var searchResultsDiv = document.getElementById('searchResults');

    var innerDiv = document.createElement('div');
    searchResultsDiv.appendChild(innerDiv);

    // Create a header for the table.
    var header = document.createElement('h3');
    var headerText = document.createTextNode("Inventory details for " + input + ":");
    header.appendChild(headerText);
    innerDiv.appendChild(header);

    // Create the search results table.
    var newTable = document.createElement('table');
    newTable.classList.add("table");

    // Create header row and cells.
    var headerRow = document.createElement('TR');
    var headerCols = ['PLU', 'NAME', 'DESCRIPTION', 'UNIT COST', 'QUANTITY'];
    for (var i = 0; i < headerCols.length; i++) {
        var headerCell = document.createElement('TH');
      	var headerText = document.createTextNode(headerCols[i]);
      	headerCell.appendChild(headerText);
    	headerRow.appendChild(headerCell);
    }
    newTable.appendChild(headerRow);

    // Create table body cells.
    for (var j = 0; j < inventoryInfo.length; j++) {
    	var tableRow = document.createElement("TR");
    	newTable.appendChild(tableRow);
	    for (var k = 0; k < headerCols.length; k++) {
	    	var tableCell = document.createElement("TD");
	        var tableText = document.createTextNode(inventoryInfo[j][k]);
	        tableCell.appendChild(tableText);
	        tableRow.appendChild(tableCell);
	    }
    }
	innerDiv.appendChild(newTable);

    // Create a 'close' button
    var close_button = document.createElement('button');
    close_button.setAttribute("type", "button");
    close_button.classList.add("btn", "btn-danger", "mb-5");
    close_button.innerText = "Close";
    searchResultsDiv.appendChild(close_button);
    close_button.addEventListener("click", closeSearchResultsTable);
}

// Closes Search Results Table
function closeSearchResultsTable(event) {
    var parent_div = event.target.parentNode;
    // 2 items: div, close button
    for (var i = 0; i < 2; i++) {
        parent_div.removeChild(parent_div.lastChild);
    }
}

// Makes the cells editable so that UPDATE can be implemented.
function makeEditable(button) {
	var td = button.parentNode;
	var tr = td.parentNode;

	// Source: https://www.golangprograms.com/highlight-and-get-the-details-of-table-row-on-click-using-javascript.html
	var currentRow = tr.cells;
	for (var i = 1; i < 5; i++) {
		currentRow.item(i).contentEditable = "true";
		currentRow.item(i).classList.add("form-cell-style");
	}

	// Hide Update Button and Show Submit button.
	var updateButton = currentRow.item(5).childNodes[1];
	updateButton.style.display = 'none';
	var submitButton = currentRow.item(5).childNodes[3];
	submitButton.style.display = 'block';

	// Hide Delete Button and Show Cancel Button.
	var deleteButton = currentRow.item(6).childNodes[1];
	deleteButton.style.display = 'none';
	var cancelButton = currentRow.item(6).childNodes[3];
	cancelButton.style.display = 'block';
}

// Cancels table edit.
function cancelEdit(button) {
	var td = button.parentNode;
	var tr = td.parentNode;

	// Remove cell's editability.
	var currentRow = tr.cells;
	for (var i = 1; i < 5; i++) {
		currentRow.item(i).contentEditable = "false";
		currentRow.item(i).classList.remove("form-cell-style");
	}

	// Show Update Button and Hide Submit button.
	var updateButton = currentRow.item(5).childNodes[1];
	updateButton.style.display = 'block';
	var submitButton = currentRow.item(5).childNodes[3];
	submitButton.style.display = 'none';

	// Show Delete Button and Hide Cancel Button.
	var deleteButton = currentRow.item(6).childNodes[1];
	deleteButton.style.display = 'block';
	var cancelButton = currentRow.item(6).childNodes[3];
	cancelButton.style.display = 'none';

	window.location.reload();
}

// Submit data to be updated to server.
function submitEdit(button) {
	var td = button.parentNode;
	var tr = td.parentNode;
	var currentRow = tr.cells;

	var plu = currentRow.item(0).innerHTML;
	var item = currentRow.item(1).innerHTML;
	var description = currentRow.item(2).innerHTML;
	var unit = currentRow.item(3).innerHTML;
	var quantity = currentRow.item(4).innerHTML;

	var info = {
		"plu": Number(plu),
		"item": item,
		"description": description,
		"unit": Number(unit),
		"quantity": Number(quantity)
	}
	console.log("Inventory item PLU:", info);

	fetch('/update-inventory', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(info)
	}).then(function(response) {
		return response.text();
	}).then(function (text) {
		console.log('Server response:', text);
		window.location.reload();
	});
}

// Delete data from server.
function deleteInventory(button) {
	var td = button.parentNode;
	var tr = td.parentNode;
	var currentRow = tr.cells;

	var plu = currentRow.item(0).innerHTML;

	console.log("Inventory item PLU:", plu);

	fetch('/delete-inventory', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({"info": plu})
	}).then(function(response) {
		return response.text();
	}).then(function (text) {
		console.log('Server response:', text);
		window.location.reload();
	});
}

document.getElementById('orderInventory').addEventListener("click", event => {
	location.href = "inventoryOrder"});
document.getElementById('addInv').addEventListener("click", insertNewInventory);
document.getElementById('search').addEventListener("click", displaySearch);
document.getElementById('showInventory').addEventListener("click", searchInventory);


