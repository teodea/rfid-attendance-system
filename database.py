import mysql.connector
from mysql.connector import Error
import datetime
from datetime import datetime

def create_db_connection(host_name, user_name, user_password, db_name):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database=db_name
        )
        print("MyNigel-SQL Database connection successful")
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

def create_tables(connection):
    create_Students_table = """
    CREATE TABLE Students (
        studentId VARCHAR(32) NOT NULL,
        name VARCHAR(64) NOT NULL,
        PRIMARY KEY(studentId)
    );
    """
    create_Instructors_table = """
    CREATE TABLE Instructors (
        instructorId VARCHAR(32) NOT NULL,
        name VARCHAR(64) NOT NULL,
        PRIMARY KEY(instructorId)
    );
    """
    create_Semesters_table = """
    CREATE TABLE Semesters (
        semesterId VARCHAR(16) NOT NULL,
        startDay DATE NOT NULL,
        endDay DATE NOT NULL,
        academicYear VARCHAR(16) NOT NULL,
        PRIMARY KEY(semesterId, academicYear)
    );
    """
    create_Classes_table = """
    CREATE TABLE Classes (
        courseId VARCHAR(16) NOT NULL,
        sectionId VARCHAR(8) NOT NULL,
        semesterId VARCHAR(16) NOT NULL,
        academicYear VARCHAR(16) NOT NULL,
        daysOfTheWeek VARCHAR(128) NOT NULL,
        startTime TIME(0) NOT NULL,
        endTime TIME(0) NOT NULL,
        location VARCHAR(32) NOT NULL,
        instructorId VARCHAR(32) NOT NULL,
        instructionMode VARCHAR(16) NOT NULL,
        PRIMARY KEY(courseId, sectionId, semesterId, academicYear),
        FOREIGN KEY(semesterId, academicYear) REFERENCES Semesters(semesterId, academicYear),
        FOREIGN KEY(instructorId) REFERENCES Instructors(instructorId)
    );
    """
    create_RFID_table = """
    CREATE TABLE RFIDScanner (
        scannerId VARCHAR(32) NOT NULL,
        location VARCHAR(32) NOT NULL,
        PRIMARY KEY(scannerId)
    );
    """
    create_Attendance_table = """
    CREATE TABLE Attendance (
        studentID VARCHAR(32) NOT NULL,
        time TIMESTAMP NOT NULL,
        FOREIGN KEY(studentId) REFERENCES Students(studentId)
    );
    """
    create_Users_table = """
    CREATE TABLE Users(
        username VARCHAR(32) NOT NULL, 
        password VARCHAR(32) NOT NULL,
        instructorId VARCHAR(32) NOT NULL,
        PRIMARY KEY(username),
        FOREIGN KEY(instructorId) REFERENCES Instructors(instructorId)
    );
    """
    create_Enrollment_table = """
    CREATE TABLE Enrollment(
        studentId VARCHAR(32) NOT NULL,
        courseId VARCHAR(16) NOT NULL,
        sectionId VARCHAR(8) NOT NULL,
        semesterId VARCHAR(16) NOT NULL,
        academicYear VARCHAR(16) NOT NULL,
        FOREIGN KEY(studentId) REFERENCES Students(studentId),
        FOREIGN KEY(courseId, sectionId, semesterId, academicYear) REFERENCES Classes(courseId, sectionId, semesterId, academicYear)
    );
    """

    execute_query(connection, create_Students_table)
    execute_query(connection, create_Instructors_table)
    execute_query(connection, create_Semesters_table)
    execute_query(connection, create_Classes_table)
    execute_query(connection, create_RFID_table)
    #execute_query(connection, create_Attendance_table)
    execute_query(connection, create_Users_table)
    execute_query(connection, create_Enrollment_table)

def delete_tables(connection):
    delete_Students_table = """
    DROP TABLE Students;
    """
    delete_Classes_table = """
    DROP TABLE Classes;
    """
    delete_RFID_table = """
    DROP TABLE RFIDScanner;
    """
    delete_Attendance_table = """
    DROP TABLE Attendance;
    """
    delete_Users_table = """
    DROP TABLE Users;
    """
    delete_Semesters_table = """
    DROP TABLE Semesters;
    """
    delete_Instructors_table = """
    DROP TABLE Instructors;
    """
    delete_Enrollment_table = """
    DROP TABLE Enrollment;
    """
    execute_query(connection, delete_Enrollment_table)
    execute_query(connection, delete_Users_table)
    execute_query(connection, delete_Attendance_table)
    execute_query(connection, delete_RFID_table)
    execute_query(connection, delete_Classes_table)
    execute_query(connection, delete_Semesters_table)  
    execute_query(connection, delete_Students_table)
    execute_query(connection, delete_Instructors_table)

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
        currentDay = currentDay.format(year+str(1))
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

def create_attendances_tables(connection):
    query = """SELECT * FROM Classes;"""
    readClasses = read_query(connection, query)
    for x in readClasses:
        instructionMode = x[9]
        if instructionMode == "online":
            continue
        semesterId = x[2]
        academicYear = x[3]
        query = """SELECT * FROM Semesters WHERE semesterId = '{}' AND academicYear='{}';""".format(semesterId, academicYear)
        readSemesters = read_query(connection, query)
        for y in readSemesters:
            startCourseDay = y[1]
            endCourseDay = y[2]
        courseId = x[0]
        sectionId = x[1]
        startCourseDay = startCourseDay.strftime('%Y-%m-%d')
        endCourseDay = endCourseDay.strftime('%Y-%m-%d')
        daysOfTheWeek = x[4]
        currentDay = startCourseDay
        while(True):
            year = currentDay[0:4]
            month = currentDay[5:7]
            day = currentDay[8:10].zfill(2)
            formattedDay = datetime(int(year), int(month), int(day))
            if formattedDay.strftime("%A") in daysOfTheWeek:
                stringDay = "{}{}{}"
                stringDay = stringDay.format(year, month, day)
                query = """
                CREATE TABLE Class_{}_{}_Day_{} (
                    studentId VARCHAR(32) NOT NULL,
                    checkIn TIMESTAMP,
                    FOREIGN KEY(studentId) REFERENCES Students(studentId)
                );
                """
                query = query.format(courseId, sectionId, stringDay)
                execute_query(connection, query)
            stringDayCheck = "{}-{}-{}".format(year, month, day)
            if stringDayCheck == endCourseDay:
                break
            currentDay = CalculateNextDay(currentDay)

def delete_attendances_tables(connection):
    query = """SELECT * FROM Classes;"""
    readClasses = read_query(connection, query)
    for x in readClasses:
        instructionMode = x[9]
        if instructionMode == "online":
            continue
        semesterId = x[2]
        academicYear = x[3]
        query = """SELECT * FROM Semesters WHERE semesterId = '{}' AND academicYear='{}';""".format(semesterId, academicYear)
        readSemesters = read_query(connection, query)
        for y in readSemesters:
            startCourseDay = y[1]
            endCourseDay = y[2]
        courseId = x[0]
        sectionId = x[1]
        startCourseDay = startCourseDay.strftime('%Y-%m-%d')
        endCourseDay = endCourseDay.strftime('%Y-%m-%d')
        daysOfTheWeek = x[4]
        currentDay = startCourseDay
        while(True):
            year = currentDay[0:4]
            month = currentDay[5:7]
            day = currentDay[8:10].zfill(2)
            formattedDay = datetime(int(year), int(month), int(day))
            if formattedDay.strftime("%A") in daysOfTheWeek:
                stringDay = "{}{}{}"
                stringDay = stringDay.format(year, month, day)
                query = """
                DROP TABLE Class_{}_{}_Day_{};
                """
                query = query.format(courseId, sectionId, stringDay)
                execute_query(connection, query)
            stringDayCheck = "{}-{}-{}".format(year, month, day)
            if stringDayCheck == endCourseDay:
                break
            currentDay = CalculateNextDay(currentDay)

def fill_attendances_tables(connection):
    query = """SELECT * FROM Enrollment;"""
    readEnrollment = read_query(connection, query)
    for x in readEnrollment:
        studentId = x[0]
        courseId = x[1]
        sectionId = x[2]
        semesterId = x[3]
        academicYear = x[4]
        query = """SELECT * FROM Semesters WHERE semesterId = '{}' AND academicYear='{}';""".format(semesterId, academicYear)
        readSemesters = read_query(connection, query)
        for y in readSemesters:
            startCourseDay = y[1]
            endCourseDay = y[2]
        startCourseDay = startCourseDay.strftime('%Y-%m-%d')
        endCourseDay = endCourseDay.strftime('%Y-%m-%d')
        query = """SELECT * FROM Classes WHERE courseId='{}' AND sectionId='{}' AND semesterId='{}' AND academicYear='{}';""".format(courseId, sectionId, semesterId, academicYear)
        readClasses = read_query(connection, query)
        for y in readClasses:
            daysOfTheWeek = x[4]
        currentDay = startCourseDay
        #while(True):

if __name__ == '__main__':
    connection = create_db_connection("3.208.87.91", "ece482", "ece482db", "Attendance_DB")

    #delete_tables(connection)
    #create_tables(connection)

    #delete_attendances_tables(connection)
    #create_attendances_tables(connection)
    #fill_attendances_tables(connection)

    query = """SHOW TABLES;"""
    #query = """SELECT * FROM Classes;"""
    #read = read_query(connection, query)
    #for x in read:
    #    print(x[0])

    query = """INSERT INTO Semesters VALUES ('test4', '2019-11-01', '2020-02-20', '2019-2020');"""
    #execute_query(connection, query)