// Display or hide form if button is clicked.
/*function displayForm(){
	var show = document.getElementById('addInventoryForm');
	if (show.style.display === 'block') {
		show.style.display = 'none';
	}
	else {
		show.style.display = 'block';
	}
 }

document.getElementById('addItem').addEventListener("click", displayForm);*/
document.getElementById('orderInventory').addEventListener("click", event => {
	location.href = "inventoryOrder"});