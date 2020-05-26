function insertNewInventory() {
	var name = document.getElementById('item');
	var description = document.getElementById('description');
	var unit = document.getElementById('unitCost');
	var quantity = document.getElementById('quantity');

	var insert = {
		"name": name,
		"description": description,
		"unit": unit,
		"quantity": quantity
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