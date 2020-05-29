// Insert new Inventory items into table.

function insertNewInventory() {
	var item = document.getElementById('itemName').value;
	var description = document.getElementById('description').value;
	var unit = document.getElementById('unitCost').value;
	var quantity = document.getElementById('quantity').value;

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

// Makes the cells editable.
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

	// Hide Submit Button and Hide Submit button.
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