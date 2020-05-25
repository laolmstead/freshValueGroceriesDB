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

document.getElementById('search').addEventListener("click", displaySearch);
document.getElementById('insert-employee').addEventListener("click", insertNewCustomer);
document.getElementById('clear-inputs').addEventListener("click", clearInputs);

