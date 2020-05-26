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

/*function insertNewInventory() {
    var item = document.getElementById('itemName').value;
    var description = document.getElementById('description').value;
    var unit = document.getElementById('unitCost').value;
    var quantity = document.getElementById('quantity').value;

    var info = {
        "item": item,
        "description": description,
        "unit": unit,
        "quantity": quantity
    }
    console.log('Inventory info:', info);

    // send customer's info to flask
    fetch('/new-inventory', {
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
}*/


document.getElementById('orderInventory').addEventListener("click", event => {
	location.href = "inventoryOrder"});
document.getElementById('addInv').addEventListener("click", insertNewInventory);