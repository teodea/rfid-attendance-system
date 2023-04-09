from flask import Flask, render_template, redirect, url_for, request
from flask import jsonify
import mysql.connector
from mysql.connector import Error
import datetime

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
            query = """SELECT * FROM Semesters;"""
            read = read_query(connection, query)
            now = datetime.datetime.now().date()
            for x in read:
                sd = x[1]
                ed = x[2]
                if (now > sd) and (now < ed):
                    s = x[0]
                    ay = x[3]     
                    break
            query = "SELECT DISTINCT academicYear FROM Semesters;"
            academicYearList = [read[0] for read in read_query(connection, query)]
            query = "SELECT semesterId FROM Semesters WHERE academicYear='{}';".format(ay)
            semesterList = [read[0] for read in read_query(connection, query)]
            return render_template('calendar.html', academicYearList=academicYearList, semesterList=semesterList, ay=ay, s=s, sd=sd, ed=ed)
        else:
            error = 'Invalid Credentials. Please try again.'
    return render_template('login.html', error=error)

@app.route('/get-semester-list')
def get_semester_list():
    academicYear = request.args.get('academicYear')
    query = "SELECT semesterId FROM Semesters WHERE academicYear='{}';".format(academicYear)
    semesterList = [read[0] for read in read_query(connection, query)]
    return jsonify(semesterList)

@app.route('/get-semester-dates')
def get_semester_dates():
    academicYear = request.args.get('academicYear')
    semester = request.args.get('semester')
    query = "SELECT DATE_FORMAT(startDay, '%Y-%m-%d'), DATE_FORMAT(endDay, '%Y-%m-%d') FROM Semesters WHERE semesterId='{}' AND academicYear='{}'".format(semester, academicYear)
    read = read_query(connection, query)
    for x in read:
        startDay = x[0]
        endDay = x[1]
    data = {'startDay': startDay, 'endDay': endDay}
    return jsonify(data)

if __name__ == "__main__":
    connection = create_db_connection("3.208.87.91", "ece482", "ece482db", "Attendance_DB")
    app.run(host='0.0.0.0')