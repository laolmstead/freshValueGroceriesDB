// If it doesn't work after editing, clear the browser's cache

// source: https://stackoverflow.com/questions/26979733/how-to-include-an-external-javascript-file-conditionally
function include(filename)
{
   var head = document.getElementsByTagName('head')[0];

   var script = document.createElement('script');
   script.src = filename;
   script.type = 'text/javascript';

   head.appendChild(script)
}

// source: http://www.javascriptkit.com/javatutors/loadjavascriptcss2.shtml
function remove(filename, filetype){
    var targetelement= "script"
    var targetattr= "src"
    var allsuspects=document.getElementsByTagName(targetelement)
    for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
            allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
}

// if employees page, load the employees.js script
if (document.getElementById('employees-page')) {
    include('../static/js/employees.js');
}
else {
    remove('../static/js/employees.js');
}

// if inventory page, load the inventory.js script
if (document.getElementById('inventory-page')) {
    include('../static/js/inventory.js');
}
else {
    remove('../static/js/inventory.js');
}

// if orders page, load the orders.js script
if (document.getElementById('orders-page')) {
    include('../static/js/orders.js');
}
else {
    remove('../static/js/orders.js');
}

// if shifts page, load the shifts.js script
if (document.getElementById('shifts-page')) {
    include('../static/js/shifts.js');
}
else {
    remove('../static/js/shifts.js');
}

// if customers page, load the customers.js script
if (document.getElementById('customers-page')) {
    include('../static/js/customers.js');
}
else {
    remove('../static/js/customers.js');
}

// if customerOrder page, load the customerOrder.js script
if (document.getElementById('customerOrder-page')) {
    include('../static/js/customerOrder.js');
}
else {
    remove('../static/js/customerOrder.js');
}