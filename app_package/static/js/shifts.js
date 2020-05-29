// Insert a new shift into the Shifts table
function insertNewShift() {
    var day = document.getElementById('select-day').value;
    
    var start_time = document.getElementById('start-time').value;
    if (!start_time) {
        alert('Enter a valid start time in the format hh:mm:ss');
        return;
    }
    
    var end_time = document.getElementById('end-time').value;
    if (!end_time) {
        alert('Enter a valid end time in the format hh:mm:ss');
        return;
    }

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
        console.log('response text:', text);
        if (text == 'Shift already exists!') {
            alert('Shift already exists!');
        }
        // refresh the page to show updated table
        window.location.reload();
    });
}

// Clears the fields in the 'Add New Shift' modal
function clearInputs() {
    document.getElementById('start-time').value = '';
    document.getElementById('end-time').value = '';
}

// Removes 'View Employees on Shift' search results from the page
function closeEmployeesTable(event) {
    var parent_div = event.target.parentNode;
    for (var i = 0; i < 3; i++) {
        parent_div.removeChild(parent_div.lastChild); 
    }
}

// Creates a table for 'View Employees on Shift' search results
function generateEmployeesTable(employees) {
    console.log('Generating employees table');

    // create a table that will display the queried data
    var grandparent_div = document.getElementById('employees-table');
    var parent_div = document.createElement('div');
    grandparent_div.appendChild(parent_div);

    var table = document.createElement('table');
    table.classList.add("table");

    // create a header for the table
    var title = document.createElement('h3');
    title.innerText = "View Employees for " + employees[0][1] + ' (EmployeeID: ' + employees[0][0] + ')';
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
    // data parsed from JSON returns an array of arrays
    // array[0] = row 1 containing (shift ID, employee name)
    var num_employees = employees.length;
    for (var i = 0; i < num_employees; i++) {
        var row = document.createElement('tr');
        for (var j = 0; j < 2; j++) {
            var data = document.createElement('td');
            data.innerText = employees[i][j];
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

// Makes a request for the employees assigned to a particular shift
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
            generateEmployeesTable(employees);
        }
    });
}

// Clears the fields in the 'Assign Shift' modal
function clearAssignInputs() {
    document.getElementById('assign-shift').value = '';
    document.getElementById('assign-employee').value = '';
}

// Inserts a new relationship into the EmployeeShifts table
function assignShift() {
    shift_id = document.getElementById('assign-shift').value;
    employee_id = document.getElementById('assign-employee').value;
    if (!shift_id || !employee_id) {
        alert('Please provide valid shift and employee IDs');
        return;
    }

    info = {
        "shift_id": shift_id,
        "employee_id": employee_id
    }
    console.log("Shift assignment info:", info);

    // send assignment info to flask
    fetch('/assign-shift', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        console.log('Server response:', text);
        if (text == 'Invalid ShiftID') {
            alert('Invalid ShiftID');
        }
        else if (text == 'Invalid EmployeeID') {
            alert('Invalid EmployeeID');
        }
        else if (text == 'Employee already works this shift!') {
            alert('Employee already works this shift!');
        }
        else {
            clearAssignInputs();
            alert('Employee has been assigned to this shift');
        }
    });
}

// Deletes a shift from the Shifts table
function deleteShift(event) {
    // get the customer id for the row that the delete button was clicked
    var shift_id = event.target.parentNode.parentNode.children[0].innerText;
    console.log('Delete shift with id:', shift_id);

    // make a request to delete from the database
    fetch('/delete-shift', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"shift_id": shift_id})
    }).then(function (response) {
        return response.text();
    }).then(function (text) {
        console.log('server response:', text);
        // refresh the page to show updated table
        window.location.reload();
    });
}

// Makes the cells in the table editable.
function makeEditable(button) {
    var td = button.parentNode;
    var tr = td.parentNode;

    // Source: https://www.golangprograms.com/highlight-and-get-the-details-of-table-row-on-click-using-javascript.html
    var currentRow = tr.cells;
    for (var i = 1; i < 4; i++) {
        currentRow.item(i).contentEditable = "true";
        currentRow.item(i).classList.add("form-cell-style");
    }

    // Hide Update Button and Show Submit button.
    var updateButton = currentRow.item(5).childNodes[1];
    updateButton.style.display = 'none';
    var submitButton = currentRow.item(5).childNodes[3];
    submitButton.style.display = 'block';

    // Hide Delete Button and Show Cancel Button.
    var deleteButton = currentRow.item(6).childNodes[1];
    deleteButton.style.display = 'none';
    var cancelButton = currentRow.item(6).childNodes[3];
    cancelButton.style.display = 'block';
}

// Cancels table edit.
function cancelEdit(button) {
	var td = button.parentNode;
	var tr = td.parentNode;

	// Remove cell's editability.
	var currentRow = tr.cells;
	for (var i = 1; i < 4; i++) {
		currentRow.item(i).contentEditable = "false";
		currentRow.item(i).classList.remove("form-cell-style");
	}

	// Show Update Button and Hide Submit button.
	var updateButton = currentRow.item(5).childNodes[1];
	updateButton.style.display = 'block';
	var submitButton = currentRow.item(5).childNodes[3];
	submitButton.style.display = 'none';

	// Show Delete Button and Hide Cancel Button.
	var deleteButton = currentRow.item(6).childNodes[1];
	deleteButton.style.display = 'block';
	var cancelButton = currentRow.item(6).childNodes[3];
	cancelButton.style.display = 'none';

	window.location.reload();
}

// Submit data to the server to update the database
function submitEdit(button) {
	var td = button.parentNode;
	var tr = td.parentNode;
	var currentRow = tr.cells;

    var id = currentRow.item(0).innerText;
    
    // grab and verify valid input for day of week
    var day = currentRow.item(1).innerText;
    console.log('day of the week entered:', day);
    if (day != 'Monday' && day != 'Tuesday' && day != 'Wednesday'
        && day != 'Thursday' && day != 'Friday' && day != 'Saturday'
        && day != 'Sunday') {
            cancelEdit(button);
            alert('Please enter a valid day of the week');
            return;
        }

    // grab and verify valid input for start time
    var start_time = currentRow.item(2).innerText;
    if (start_time.length < 7 || start_time.length > 8) {
        cancelEdit(button);
        alert('Please enter a valid start time in the format hh:mm:ss (24-hour clock)');
        return;
    }

    // grab and verify valid input for end time
    var end_time = currentRow.item(3).innerText;
    if (end_time.length < 7 || end_time.length > 8) {
        cancelEdit(button);
        alert('Please enter a valid end time in the format hh:mm:ss (24-hour clock)');
        return;
    }
    
    var info = {
        "id": id,
        "day": day,
        "start_time": start_time,
        "end_time": end_time
    }
    console.log('Updated shift info:', info);

    // send updated customer info to flask
    fetch('/update-shift', {
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

// Attach all event listeners

document.getElementById('insert-shift').addEventListener("click", insertNewShift);
document.getElementById('clear-inputs').addEventListener("click", clearInputs);

document.getElementById('insert-employee-shift').addEventListener("click", assignShift);
document.getElementById('clear-assign-inputs').addEventListener("click", clearAssignInputs);

// document.getElementById('save-update').addEventListener("click", updateShift);
// document.getElementById('clear-update').addEventListener("click", closeUpdateForm);

// add event listeners to all 'view employees' buttons
var num_buttons = document.getElementsByClassName('view-employees').length;
var buttons = document.getElementsByClassName('view-employees');
for (var i = 0; i < num_buttons; i++) {
    buttons[i].addEventListener("click", viewEmployeesButtonClicked);
}

// add event listeners to all 'delete' buttons
var num_buttons = document.getElementsByClassName('delete').length;
var buttons = document.getElementsByClassName('delete');
for (var i = 0; i < num_buttons; i++) {
    buttons[i].addEventListener("click", deleteShift);
}

// add event listeners to all 'update' buttons
// var num_buttons = document.getElementsByClassName('show-update').length;
// var buttons = document.getElementsByClassName('show-update');
// for (var i = 0; i < num_buttons; i++) {
//     buttons[i].addEventListener("click", showUpdateForm);
// }

