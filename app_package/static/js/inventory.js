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

document.getElementById('orderInventory').addEventListener("click", event => {
	location.href = "inventoryOrder"});
document.getElementById('addInv').addEventListener("click", insertNewInventory);