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

document.getElementById('search').addEventListener("click", displaySearch);
