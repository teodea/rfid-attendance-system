import mysql.connector
from mysql.connector import Error

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
        PRIMARY KEY(studentId, name)
    );
    """
    create_Classes_table = """
    CREATE TABLE Classes (
        courseId VARCHAR(16) NOT NULL,
        sectionId VARCHAR(8) NOT NULL,
        startCourseDay DATE NOT NULL,
        endCourseDay DATE NOT NULL,
        daysOfTheWeek VARCHAR(8) NOT NULL,
        startTime TIMESTAMP NOT NULL,
        endTime TIMESTAMP NOT NULL,
        location VARCHAR(32) NOT NULL,
        instructor VARCHAR(32) NOT NULL,
        instructionMode VARCHAR(16) NOT NULL,
        PRIMARY KEY(courseId, sectionId)
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
        FOREIGN KEY(studentId) REFERENCES Students
    );
    """
    execute_query(connection, create_Students_table)
    execute_query(connection, create_Classes_table)
    execute_query(connection, create_RFID_table)
    execute_query(connection, create_Attendance_table)

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
    execute_query(connection, delete_Attendance_table)
    execute_query(connection, delete_RFID_table)
    execute_query(connection, delete_Classes_table)
    execute_query(connection, delete_Students_table)

if __name__ == '__main__':
    connection = create_db_connection("localhost", "root", "ece482", "Attendance_DB")
    create_tables(connection)
    print("tables created")

    query = "INSERT INTO Students VALUES ('studentA','Matteo');"
    execute_query(connection, query)
    query = """
    SELECT *
    FROM Students;
    """
    read = read_query(connection, query)
    print(read)

    #delete_tables(connection)
    #print("tables deleted")
    #read = read_query(connection, query)