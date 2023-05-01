from flask import Flask, render_template, request, jsonify
import mysql.connector
from mysql.connector import Error
import datetime
from datetime import timedelta
import json

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

def CalculateNextDay(currentDay):
    # currentDay = YYYY-MM-DD
    year = str(currentDay)[0:4]
    month = str(currentDay)[5:7]
    day = str(currentDay)[8:10]
    isLeapYear = False
    if (int(year) % 4 == 0):
        isLeapYear = True
    if (month == "12") and (day == "31"):
        currentDay = "{}-01-01"
        year = str(int(year)+1)
        currentDay = currentDay.format(year)
        return currentDay
    if (month == "01") and (day == "31"):
        currentDay = "{}-02-01"
        currentDay = currentDay.format(year)
        return currentDay
    if (month == "02") and (day == "28") and (isLeapYear == False):
        currentDay = "{}-03-01"
        currentDay = currentDay.format(year)
        return currentDay
    if (month == "02") and (day == "29"):
        currentDay = "{}-03-01"
        currentDay = currentDay.format(year)
        return currentDay
    if (month == "03") and (day == "31"):
        currentDay = "{}-04-01"
        currentDay = currentDay.format(year)
        return currentDay
    if (month == "04") and (day == "30"):
        currentDay = "{}-05-01"
        currentDay = currentDay.format(year)
        return currentDay
    if (month == "05") and (day == "31"):
        currentDay = "{}-06-01"
        currentDay = currentDay.format(year)
        return currentDay
    if (month == "06") and (day == "30"):
        currentDay = "{}-07-01"
        currentDay = currentDay.format(year)
        return currentDay
    if (month == "07") and (day == "31"):
        currentDay = "{}-07-01"
        currentDay = currentDay.format(year)
        return currentDay
    if (month == "08") and (day == "31"):
        currentDay = "{}-09-01"
        currentDay = currentDay.format(year)
        return currentDay
    if (month == "09") and (day == "30"):
        currentDay = "{}-10-01"
        currentDay = currentDay.format(year)
        return currentDay
    if (month == "10") and (day == "31"):
        currentDay = "{}-11-01"
        currentDay = currentDay.format(year)
        return currentDay
    if (month == "11") and (day == "30"):
        currentDay = "{}-12-01"
        currentDay = currentDay.format(year)
        return currentDay
    day = int(day) + 1
    currentDay = "{}-{}-{}"
    currentDay = currentDay.format(year, month, day)
    return currentDay

@app.route("/")
def home():
    return render_template("home.html")
    
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        query = "SELECT * FROM Users WHERE username='{}' AND password='{}';".format(username, password)
        credentials = read_query(connection, query)
        if credentials != []:
            instructorId = credentials[0][2]
            query = """SELECT * FROM Semesters;"""
            read = read_query(connection, query)
            now = datetime.datetime.now().date()
            temp = timedelta(days=9999)
            for x in read:
                if (now - x[1] > timedelta(days=0)) and (now - x[1] < temp):
                    s = x[0]
                    sd = x[1]
                    ed = x[2]
                    ay = x[3]
                    temp = now - sd
            query = "SELECT DISTINCT academicYear FROM Semesters;"
            academicYearList = [read[0] for read in read_query(connection, query)]
            query = "SELECT semesterId FROM Semesters WHERE academicYear='{}';".format(ay)
            semesterList = [read[0] for read in read_query(connection, query)]
            return render_template('calendar.html', instructor=instructorId, academicYearList=academicYearList, semesterList=semesterList, ay=ay, s=s, sd=sd, ed=ed)
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

@app.route('/get-classes-all')
def get_classes_all():
    instructorId = request.args.get('instructorId')
    academicYear = request.args.get('academicYear')
    semesterId = request.args.get('semesterId')
    query = "SELECT courseId, sectionId FROM Classes WHERE semesterId='{}' AND academicYear='{}' AND instructorId='{}';".format(semesterId, academicYear, instructorId)
    read = read_query(connection, query)
    classListAll = [{'courseId': x[0], 'sectionId': x[1]} for x in read]
    return jsonify(classListAll)

@app.route('/get-classes-day')
def get_classes_day():
    classListAll = request.args.get('classListAll')
    classListAll = json.loads(classListAll)
    day = request.args.get('day')
    day = day.zfill(2)
    month = request.args.get('month')
    month = datetime.datetime.strptime(month, '%B')
    month = month.strftime('%m')
    year = request.args.get('year')
    academicYear = request.args.get('academicYear')
    semesterId = request.args.get('semesterId')
    stringDay = "{}{}{}".format(year, month, day)
    classListDay = []
    for x in classListAll:
        query = """SELECT 1 FROM information_schema.tables WHERE table_name = 'Class_{}_{}_Day_{}' LIMIT 1;""".format(x[0], x[1], stringDay)
        readCheck = read_query(connection, query)
        if readCheck != []:
            classListDay.append({'courseId': x[0], 'sectionId': x[1], 'online': False})
        else:
            query = """SELECT * FROM Classes WHERE courseId='{}' AND sectionId='{}' AND semesterId='{}' AND academicYear='{}';""".format(x[0], x[1], semesterId, academicYear)
            readMode = read_query(connection, query)
            for y in readMode:
                formattedDay = datetime.datetime(int(year), int(month), int(day))
                if formattedDay.strftime("%A") in y[4]:
                    if y[9] == 'Online': classListDay.append({'courseId': x[0], 'sectionId': x[1], 'online': True})
    return jsonify(classListDay)

@app.route('/get-attendance-day')
def get_attendance_day():
    courseId = request.args.get('courseId')
    sectionId = request.args.get('sectionId')
    year = request.args.get('year')
    month = request.args.get('month')
    day = request.args.get('day')
    month = datetime.datetime.strptime(month, '%B')
    month = month.strftime('%m')
    day = day.zfill(2)
    stringDay = "{}{}{}".format(year, month, day)
    studentsAttendance = []
    query = """SELECT * FROM Class_{}_{}_Day_{}""".format(courseId, sectionId, stringDay)
    while(True):
        readAttendance = read_query(connection, query)
        if readAttendance != None:
            break
    for x in readAttendance:
        query = """SELECT name FROM Students WHERE studentId='{}'""".format(x[0])
        readName = read_query(connection, query)
        for y in readName:
            studentsAttendance.append({'studentName': y[0], 'checkIn': x[1]})
    return jsonify(studentsAttendance)

@app.route('/get-percentage-attendance-day')
def get_percentage_attendance_day():
    courseId = request.args.get('courseId')
    sectionId = request.args.get('sectionId')
    year = request.args.get('year')
    month = request.args.get('month')
    day = request.args.get('day')
    month = datetime.datetime.strptime(month, '%B')
    month = month.strftime('%m')
    day = day.zfill(2)
    stringDay = "{}{}{}".format(year, month, day)
    query = """SELECT * FROM Class_{}_{}_Day_{}""".format(courseId, sectionId, stringDay)
    countPresent = 0
    countTotal = 0
    while(True):
        readAttendance = read_query(connection, query)
        if readAttendance != None:
            break
    for x in readAttendance:
        countTotal = countTotal + 1
        if x[1] is not None:
            countPresent = countPresent + 1
    if countTotal > 0:
        percentage = (countPresent / countTotal) * 100
        percentage = round(percentage)
    else:
        percentage = 0
    return str(percentage)

@app.route('/get-course-status')
def get_course_status():
    courseId = request.args.get('courseId')
    sectionId = request.args.get('sectionId')
    academicYear = request.args.get('academicYear')
    semesterId = request.args.get('semesterId')
    query = """SELECT * FROM Classes WHERE courseId='{}' AND sectionId='{}' AND semesterId='{}' AND academicYear='{}';""".format(courseId, sectionId, semesterId, academicYear)
    readClass = read_query(connection, query)
    for x in readClass:
        daysOfTheWeek = x[4]
        instructionMode = x[9]
        data = {'daysOfTheWeek': daysOfTheWeek, 'instructionMode': instructionMode}
        return jsonify(data)

@app.route('/get-percentage-attendance-course-semester')
def get_percentage_attendance_course_semester():
    courseId = request.args.get('courseId')
    sectionId = request.args.get('sectionId')
    academicYear = request.args.get('academicYear')
    semesterId = request.args.get('semesterId')
    query = """SELECT * FROM Classes WHERE courseId='{}' AND sectionId='{}' AND semesterId='{}' AND academicYear='{}';""".format(courseId, sectionId, semesterId, academicYear)
    readClass = read_query(connection, query)
    for x in readClass:
        instructionMode = x[9]
        if instructionMode == "Online":
            return("Online")
        query = """SELECT * FROM Semesters WHERE semesterId = '{}' AND academicYear='{}';""".format(semesterId, academicYear)
        readSemesters = read_query(connection, query)
        for y in readSemesters:
            startCourseDay = y[1]
            endCourseDay = y[2]
        startCourseDay = startCourseDay.strftime('%Y-%m-%d')
        endCourseDay = endCourseDay.strftime('%Y-%m-%d')
        daysOfTheWeek = x[4]
        currentDay = startCourseDay
        countPresent = 0
        countTotal = 0
        while(True):
            year = currentDay[0:4]
            month = currentDay[5:7]
            day = currentDay[8:10].zfill(2)
            formattedDay = datetime.datetime(int(year), int(month), int(day))
            if formattedDay.strftime("%A") in daysOfTheWeek:
                stringDay = "{}{}{}"
                stringDay = stringDay.format(year, month, day)
                query = """SELECT * FROM Class_{}_{}_Day_{}""".format(courseId, sectionId, stringDay)
                while(True):
                    readAttendance = read_query(connection, query)
                    if readAttendance != None:
                        break
                for y in readAttendance:
                    countTotal = countTotal + 1
                    if y[1] is not None:
                        countPresent = countPresent + 1
            stringDayCheck = "{}-{}-{}".format(year, month, day)
            if stringDayCheck == endCourseDay:
                if countTotal > 0:
                    percentage = (countPresent / countTotal) * 100
                    percentage = round(percentage)
                else:
                    percentage = 0
                return str(percentage)
            currentDay = CalculateNextDay(currentDay)

if __name__ == "__main__":
    connection = create_db_connection("3.208.87.91", "ece482", "ece482db", "Attendance_DB")
    app.run(host='0.0.0.0')