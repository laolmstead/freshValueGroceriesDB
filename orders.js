// Display either add or search form based on which button is clicked.
function displaySearch(){
	var show = document.getElementById('searchForm');
	if (show.style.display === 'block') {
		show.style.display = 'none';
	}
	else {
		show.style.display = 'block';
	}
 }

 // Display either add or search form based on which button is clicked.
function displayOrders(){
	var order = document.getElementById('orderDetails');
	if (order.style.display === 'block') {
		order.style.display = 'none';
	}
	else {
		order.style.display = 'block';
	}
 }

//document.getElementById('add').addEventListener("click", displayAdd);
document.getElementById('search').addEventListener("click", displaySearch);
document.getElementById('showOrders').addEventListener("click", displayOrders);
document.getElementById('add').addEventListener("click", event => {
	location.href = "customerOrder"});