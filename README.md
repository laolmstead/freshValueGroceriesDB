# freshValueGroceriesDB
A database for managing Employees, Shifts, Inventory, and Orders at Fresh Value Groceries.


# Notes for using pipenv (after much trial and error):

1. Install pipenv on the server using 'python3 -m pip install pipenv'.
    -Note: In case of permissions error, use the command  ```python3 -m pip install --user pipenv```
2. Install dependencies listed in Pipfile using 'python3 -m pipenv install'.
3. Activate a virtual environment using 'python3 -m pipenv shell'. You can exit the shell using 'exit'. 
4. Inside the shell, run 'pip install python-dotenv' to be able to make use of the .flaskenv file, which just declares 'FLASK_APP=webapp.py'.
5. After that, you can run 'flask run -h 0.0.0.0 -p 55722'. The port number can be changed to anything else. I just thought 55722 was sufficiently high and random enough of a number that it wouldn't be in use.
6. Connect to flip#.engr.oregonstate.edu:55722 to see the website!

