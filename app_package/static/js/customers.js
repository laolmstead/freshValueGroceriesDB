function displaySearch(){
    var show = document.getElementById('searchForm');
    if (show.style.display === 'block') {
        show.style.display = 'none';
    }
    else {
        show.style.display = 'block';
    }
}

function insertNewCustomer() {
    var name = document.getElementById('add-name').value;
    var phone = document.getElementById('add-phone').value;
    var points = document.getElementById('add-pts').value;

    var info = {
        "name": name,
        "phone": phone,
        "points": points
    }
    console.log('Customer info:', info);

    // send customer's info to flask
    fetch('/new-customer', {
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
}

function clearInputs() {
    document.getElementById('add-name').value = '';
    document.getElementById('add-phone').value = '';
    document.getElementById('add-pts').value = '';
}

function closeSearchResultsTable(event) {
    var parent_div = event.target.parentNode;
    // 3 items: header, table, close button
    for (var i = 0; i < 3; i++) {
        parent_div.removeChild(parent_div.lastChild); 
    }
}

function generateSearchResultsTable(input, customers) {
    console.log('Generating a search results table');

    var grandparent_div = document.getElementById('search-results');
    var parent_div = document.createElement('div');
    grandparent_div.appendChild(parent_div);

    var table = document.createElement('table');
    table.classList.add("table");

    // create a header for the table
    var title = document.createElement('h3');
    title.innerText = "Results for '" + input + "'";
    parent_div.appendChild(title);

    // construct table headers
    var table_head = document.createElement('thead');
    var headers = ['CustomerID', 'Name', 'Phone Number', 'Rewards Points']
    for (var i = 0; i < 4; i++) {
        var th = document.createElement('th');
        th.innerText = headers[i];
        table_head.appendChild(th);
    }
    table.appendChild(table_head);

    // construct and populate table body
    var table_body = document.createElement('tbody');
    // data parsed from JSON returns an array of arrays
    // customers[0] = row 1 containing [customerID, name, phone, points]
    var num_customers = customers.length;
    for (var i = 0; i < num_customers; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < 4; j++) {
            var data = document.createElement('td');
            data.innerText = customers[i][j];
            row.appendChild(data);
        }
        table_body.appendChild(row);
    }
    table.appendChild(table_body);

    parent_div.appendChild(table);

    // create a 'close' button
    var close_button = document.createElement('button');
    close_button.setAttribute("type", "button");
    close_button.classList.add("btn", "btn-danger");
    close_button.innerText = "Close";
    parent_div.appendChild(close_button);
    close_button.addEventListener("click", closeSearchResultsTable);
}

function searchByName(event) {
    var input = event.target.parentNode.children[0].value;
    console.log('You entered:', input);

    // clear the input
    event.target.parentNode.children[0].value = '';

    // make a request for customers with given name
    fetch('/search-customers-name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"input": input})
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        response = JSON.parse(text);
        console.log(response);
        if (response.length == 0) {
            alert('No results found for customers named ' + input);
        }
        else {
            generateSearchResultsTable(input, response);
        }
    });
}

function searchByPhone(event) {
    var input = event.target.parentNode.children[0].value;
    console.log('You entered:', input);

    // clear the input
    event.target.parentNode.children[0].value = '';

    // make a request for customers with given phone number
    fetch('/search-customers-phone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"input": input})
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        response = JSON.parse(text);
        console.log(response);
        if (response.length == 0) {
            alert('No results found for customers with phone number ' + input);
        }
        else {
            generateSearchResultsTable(input, response);
        }
    });
}

function searchByPoints(event) {
    var lower = document.getElementById('search-pts-lower').value;
    var upper = document.getElementById('search-pts-upper').value;
    console.log('You entered:', lower, upper);

    // clear the inputs
    document.getElementById('search-pts-lower').value = '';
    document.getElementById('search-pts-upper').value = '';

    // assign appropriate lower and upper bounds if left unspecified
    if (!lower) lower = 0;
    if (!upper) upper = 100000;

    // make a request for customers with given points range
    fetch('/search-customers-pts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"lower": lower, "upper": upper})
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        response = JSON.parse(text);
        console.log(response);
        console.log('response length:', response.length);
        console.log(response[0]);
        console.log(response[1]);
        if (response.length == 0) {
            alert('No results found for customers with points between ' + lower + ' and ' + upper);
        }
        else {
            pts_range = lower + ' to ' + upper + ' points';
            generateSearchResultsTable(pts_range, response);
        }
    });
}

function deleteCustomer(event) {
    // get the customer id for the row that the delete button was clicked
    var customer_id = event.target.parentNode.parentNode.children[0].innerText;
    console.log('Delete customer with id:', customer_id);

    // make a request to delete from the database
    fetch('/delete-customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"customer_id": customer_id})
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        console.log('server response:', text);
        // refresh the page to show updated table
        window.location.reload();
    });
}


// Attach all event listeners

document.getElementById('search').addEventListener("click", displaySearch);
document.getElementById('search-name').addEventListener("click", searchByName);
document.getElementById('search-phone').addEventListener("click", searchByPhone);
document.getElementById('search-pts').addEventListener("click", searchByPoints);

document.getElementById('insert-employee').addEventListener("click", insertNewCustomer);
document.getElementById('clear-inputs').addEventListener("click", clearInputs);

// add event listeners to all 'delete' buttons
var num_buttons = document.getElementsByClassName('delete').length;
var buttons = document.getElementsByClassName('delete');
for (var i = 0; i < num_buttons; i++) {
    buttons[i].addEventListener("click", deleteCustomer);
}