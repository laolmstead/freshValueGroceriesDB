// Display either add or search form based on which button is clicked.
function displayNew(){
	var makeCustomer = document.getElementById('newCustomer');
	if (makeCustomer.style.display === 'block') {
		makeCustomer.style.display = 'none';
	}
	else {
		newCustomer.style.display = 'block';
	}
 }

 document.getElementById('newButton').addEventListener("click", displayNew);

