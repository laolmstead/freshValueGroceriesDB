function insertNewShift() {
    var day = document.getElementById('select-day').value;
    var start_time = document.getElementById('start-time').value;
    var end_time = document.getElementById('end-time').value;

    var info = {
        "day": day,
        "start_time": start_time,
        "end_time": end_time
    }
    console.log("Shift info:", info);
    
    // send shift info to flask
    fetch('/new-shift', {
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
    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';
}

function closeEmployeesTable(event) {
    var parent_div = event.target.parentNode;
    for (var i = 0; i < 3; i++) {
        parent_div.removeChild(parent_div.lastChild); 
    }
}

function generateEmployeesTable(employees) {
    console.log('Generating employees table');

    // create a table that will display the queried data
    var parent_div = document.getElementById('employees-table');
    var table = document.createElement('table');
    table.classList.add("table");

    // create a header for the table
    var title = document.createElement('h3');
    title.innerText = "View Employees for " + employees[0];
    parent_div.appendChild(title);

    // construct table headers
    var table_head = document.createElement('thead');
    var headers = ['ShiftID', 'Employee Name']
    for (var i = 0; i < 2; i++) {
        var th = document.createElement('th');
        th.innerText = headers[i];
        table_head.appendChild(th);
    }
    table.appendChild(table_head);

    // construct and populate table body
    var table_body = document.createElement('tbody');
    // data parsed from JSON returns an array
    // array[0] = shift ID, array[1] = employee name
    var num_employees = employees.length / 2;
    for (var i = 0; i < num_employees; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < 2; j++) {
            var data = document.createElement('td');
            data.innerText = employees[i+j];
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
    close_button.addEventListener("click", closeEmployeesTable);
}

function viewEmployeesButtonClicked() {
    // get the shift id for the row the button was clicked
    var shift_id = event.target.parentNode.parentNode.children[0].innerText;
    console.log('View Employees button was clicked for shift id:', shift_id);

    // make a request for the employees working that shift
    fetch('/get-employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"shift_id": shift_id})
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        var employees = JSON.parse(text);
        console.log("Response:", employees);
        if (employees.length == 0) {
            alert('There are no employees assigned to work this shift!');
        }
        else {
            generateEmployeesTable(employees[0]);
        }
    });
}

document.getElementById('insert-shift').addEventListener("click", insertNewShift);
document.getElementById('clear-inputs').addEventListener("click", clearInputs);

// add event listeners to all 'view employees' buttons
var num_buttons = document.getElementsByClassName('view-employees').length;
var buttons = document.getElementsByClassName('view-employees');
for (var i = 0; i < num_buttons; i++) {
    buttons[i].addEventListener("click", viewEmployeesButtonClicked);
}
