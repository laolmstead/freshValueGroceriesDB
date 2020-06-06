from flask import Flask

app = Flask(__name__)
# creates the application object as an instance of the Flask class
# the __name__ variable = the name of the module in which it is used
# this variable is the starting point Flask uses to load associated resources

# app_package is the directory that contains this Flask app and the __init__.py script
# the app variable is an instance of the Flask class and is a member of the app package

from app_package import routes