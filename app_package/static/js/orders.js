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

 // Display either add or search form based on which button is clicked.
/*function displayOrders(){
	var order = document.getElementById('orderDetails');
	if (order.style.display === 'block') {
		order.style.display = 'none';
	}
	else {
		order.style.display = 'block';
	}
 }*/


function makeTable(input, orderInfo) {
    var searchResultsDiv = document.getElementById('searchResults');

    var innerDiv = document.createElement('div');
    searchResultsDiv.appendChild(innerDiv);

    // Create a header for the table.
    var header = document.createElement('h3');
    var headerText = document.createTextNode("Order details for " + input + ":");
    header.appendChild(headerText);
    innerDiv.appendChild(header);

    // Create the search results table.
    var newTable = document.createElement('table');
    newTable.classList.add("table");

    // Create header row and cells.
    var headerRow = document.createElement('TR');
    var headerCols = ['ORDER ID', 'ITEM', 'DESCRIPTION', 'UNIT COST', 'QUANTITY', 'COST'];
    for (var i = 0; i < headerCols.length; i++) {
        var headerCell = document.createElement('TH');
      	var headerText = document.createTextNode(headerCols[i]);
      	headerCell.appendChild(headerText);
    	headerRow.appendChild(headerCell);
    }
    newTable.appendChild(headerRow);

    // Create table body cells.
    for (var j = 0; j < orderInfo.length; j++) {
    	var tableRow = document.createElement("TR");
    	newTable.appendChild(tableRow);
	    for (var k = 0; k < headerCols.length; k++) {
	    	var tableCell = document.createElement("TD");
	        var tableText = document.createTextNode(orderInfo[j][k]);
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
    // 3 items: header, table, close button
    for (var i = 0; i < 3; i++) {
        parent_div.removeChild(parent_div.lastChild);
    }
}

function searchByID(input) {
    // Make a request for customers with a given id.
    fetch('/search-orders-cust-id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"id": input})
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        response = JSON.parse(text);
        console.log(response);
        if (response.length == 0) {
            alert('No results found for customers with Rewards ID number ' + input);
        }
        else {
            search = 'ID number ' + input;
            makeTable(search, response);
        }
    });
}

function searchByName(input) {
    // make a request for customer with the given name
    fetch('/search-orders-name', {
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
            alert('No results found for customers named ' + input);
        }
        else {
            search = 'Customers named ' + input
            makeTable(search, response);
        }
    });
}

function searchByPhone(input) {
    // make a request for customer with the given phone number
    fetch('/search-orders-phone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"phone": input})
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        response = JSON.parse(text);
        console.log(response);
        if (response.length == 0) {
            alert('No results found for customers with phone number ' + input);
        }
        else {
            search = 'Customers with phone number ' + input
            makeTable(search, response);
        }
    });
}

function searchByEmployee(input) {
    // make a request for employees with the given name
    fetch('/search-orders-employee', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"employee": input})
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        response = JSON.parse(text);
        console.log(response);
        if (response.length == 0) {
            alert('No results found for employees named ' + input);
        }
        else {
            search = 'Employees named ' + input
            makeTable(search, response);
        }
    });
}

function searchOrders() {
    var selection = document.getElementById('searchOptions').value;
    console.log("search mode:", selection);
    var input = document.getElementById('searchInput').value;
    document.getElementById('searchInput').value = '';

    if (selection == 'Rewards ID') {
        searchByID(input);
    }
    else if (selection == 'Customer Name') {
        searchByName(input);
    }
    else if (selection == 'Customer Phone Number') {
        searchByPhone(input);
    }
    else if (selection == 'Employee Name') {
        searchByEmployee(input);
    }
    else {
        console.log('invalid search mode');
    }
}

//document.getElementById('add').addEventListener("click", displayAdd);
document.getElementById('search').addEventListener("click", displaySearch);
document.getElementById('showOrders').addEventListener("click", searchOrders);
document.getElementById('add').addEventListener("click", event => {
	location.href = "customerOrder"});