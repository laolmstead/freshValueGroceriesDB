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

function closeSearchResultsTable() {
    var parent_div = event.target.parentNode;
    // 3 items: header, table, close button
    for (var i = 0; i < 3; i++) {
        parent_div.removeChild(parent_div.lastChild); 
    }
}

function generateSearchResultsTable(input, customers) {
    console.log('Generating a search results table');

    var parent_div = document.getElementById('search-results');
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
    // data parsed from JSON returns an array
    // array[0] = customer ID, array[1] = name, 
    // array[2] = phone number, array[3] = rewards points
    var num_customers = customers.length / 4;
    for (var i = 0; i < num_customers; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < 4; j++) {
            var data = document.createElement('td');
            data.innerText = customers[i+j];
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
        response = JSON.parse(text)[0];
        console.log(response);
        if (response.length == 0) {
            alert('No results found for customers named ' + input);
        }
        else {
            generateSearchResultsTable(input, response);
        }
    });
}

document.getElementById('search').addEventListener("click", displaySearch);
document.getElementById('search-name').addEventListener("click", searchByName);

document.getElementById('insert-employee').addEventListener("click", insertNewCustomer);
document.getElementById('clear-inputs').addEventListener("click", clearInputs);

