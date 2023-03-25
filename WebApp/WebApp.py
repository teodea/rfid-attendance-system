from flask import Flask, render_template, redirect, url_for, request
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

def create_db_connection(host_name, user_name, user_password, db_name):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database=db_name
        )
        print("MySQL Database connection successful")
    except Error as err:
        print(f"Error: '{err}'")
    return connection

def execute_query(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Query successful")
    except Error as err:
        print(f"Error: '{err}'")

def read_query(connection, query):
    cursor = connection.cursor()
    result = None
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except Error as err:
        print(f"Error: '{err}'")

@app.route("/")
def home():
    return render_template("home.html")
    
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        query = """
        SELECT *
        FROM Users
        WHERE username='{}' AND password='{}';
        """
        query = query.format(username, password)
        credentials = read_query(connection, query)
        if credentials != []:
            return redirect(url_for('home'))
        else:
            error = 'Invalid Credentials. Please try again.'
    return render_template('login.html', error=error)

@app.route("/calendar")
def calendar():
    return render_template("calendar.html")

if __name__ == "__main__":
    connection = create_db_connection("52.3.222.145", "ece482", "ece482db", "EC2Test")
    app.run(host='0.0.0.0')
