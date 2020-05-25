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

// Removes shifts table that was generated for a given employee
function closeShiftsTable(event) {
    var parent_div = event.target.parentNode;
    for (var i = 0; i < 3; i++) {
        parent_div.removeChild(parent_div.lastChild); 
    }
}

// source: https://www.mysamplecode.com/2012/04/generate-html-table-using-javascript.html
function generateShiftsTable(shifts) {
    console.log('Generating shifts table');

    // create a table that will display the queried data
    var parent_div = document.getElementById('shifts-table');
    var table = document.createElement('table');
    table.classList.add("table");

    // create a header for the table
    var title = document.createElement('h3');
    title.innerText = "View Shifts for " + shifts[0];
    parent_div.appendChild(title);

    // construct table headers
    var table_head = document.createElement('thead');
    var headers = ['Name', 'ShiftID', 'Day', 'Start Time', 'End Time']
    for (var i = 0; i < 5; i++) {
        var th = document.createElement('th');
        th.innerText = headers[i];
        table_head.appendChild(th);
    }
    table.appendChild(table_head);

    // construct and populate table body
    var table_body = document.createElement('tbody');
    // data parsed from JSON returns an array
    // array[0] = Name, array[1] = shift ID, array[2] = day,
    // array[3] = start time, array[4] = end time
    var num_shifts = shifts.length / 5;
    for (var i = 0; i < num_shifts; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < 5; j++) {
            var data = document.createElement('td');
            data.innerText = shifts[i+j];
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
    close_button.addEventListener("click", closeShiftsTable);
}

function viewShiftsButtonClicked(event){
    // get the employee id for the row that the button was clicked
    var employee_id = event.target.parentNode.parentNode.children[0].innerText;
    console.log('A view shifts button was clicked', employee_id);
    
    // make a request for that employee's shifts
    fetch('/get-shifts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"employee_id": employee_id})
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        shifts = JSON.parse(text);
        if (shifts.length == 0) {
            alert('This employee has not been assigned any shifts!');
        }
        else {
            generateShiftsTable(shifts[0]);
        }
    });
}

function insertNewEmployee() {
    var first_name = document.getElementById('add-name').value;
    var hourly_wage = document.getElementById('add-wage').value;
    var sick_days = document.getElementById('add-sick-days').value;
    var duties = document.getElementById('add-duties').value;

    var info = {
        "name": first_name, 
        "wage": hourly_wage, 
        "sick_days": sick_days,
        "duties": duties
    }
    console.log("Employee info", info);

    // send employee's info to flask
    fetch('/new-employee', {
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

// Clears values the user may have entered in the 'add employee' modal
function clearInputs() {
    document.getElementById('add-first-name').value = '';
    document.getElementById('add-last-name').value = '';
    document.getElementById('add-wage').value = '';
    document.getElementById('add-sick-days').value = '';
    document.getElementById('add-duties').value = '';
}

document.getElementById('search').addEventListener("click", displaySearch);
document.getElementById('insert-employee').addEventListener("click", insertNewEmployee);
document.getElementById('clear-inputs').addEventListener("click", clearInputs);

// add event listeners to all 'view shifts' buttons
var num_buttons = document.getElementsByClassName('view-shifts').length;
var buttons = document.getElementsByClassName('view-shifts');
for (var i = 0; i < num_buttons; i++) {
    buttons[i].addEventListener("click", viewShiftsButtonClicked);
}
