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

document.getElementById('insert-shift').addEventListener("click", insertNewShift);
document.getElementById('clear-inputs').addEventListener("click", clearInputs);

