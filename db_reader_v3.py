#!/usr/bin/env python
from mfrc522 import SimpleMFRC522
from datetime import datetime
import time
import RPi.GPIO as GPIO
import mysql.connector
from mysql.connector import Error

with open('location_data.txt', 'r') as file:
        # Loop through each line in the file
        for line in file:
            # Remove whitespace from the beginning and end of the line
            line = line.strip()
            
            # Split the line into instructor ID and name
            values = line.split(' ')
            data = {
                'location': values[0]
            }
        
            values = (data['location'])

# Connect to the MySQL database
mydb = mysql.connector.connect(
  host="3.208.87.91",
  user="ece482",
  password="ece482db",
  database="Attendance_DB"
)

# Create a cursor object to execute queries
mycursor = mydb.cursor()

# Execute a SELECT query
mycursor.execute("SELECT courseId, sectionId, startTime, endTime FROM Classes WHERE location = '{}'".format(values))

# Fetch the results
result = mycursor.fetchall()

# Print the results
for row in result:
  courseId = row[0]
  sectionId = row[1]
  startTime = row[2]
  endTime = row[3]
  #print("courseId: {}, sectionId: {}, startTime: {}, endTime: {}".format(courseId, sectionId, startTime, endTime))

timeScan = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

#print(timeScan)

# Split the string into separate substrings based on the space character
date, stime = timeScan.split(" ")

# Split the date string into separate substrings based on the dash character
year, month, day = date.split("-")

# Print the separate substrings as strings
#print(year)  # Output: "2023"
#print(month)  # Output: "04"
#print(day)  # Output: "19"

fullDate = str(year) + str(month).zfill(2) + str(day).zfill(2)
#print(fullDate)

printQuery = "CREATE TABLE Class_{}_{}_Day_{}".format(courseId, sectionId, fullDate)
#print(printQuery)

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

if __name__ == '__main__':
    reader = SimpleMFRC522()
    print("Ready to scan attendance for courses located in:", values)
    try:
        while True:
            studentId  = reader.read_id()
            #timeScan = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print("stuID:")
            print(studentId)
            print("tstamp:")
            print(timeScan)
            query = "INSERT INTO Class_{}_{}_Day_{} VALUES ('{}', '{}')".format(courseId, sectionId, fullDate, studentId, timeScan)
            #query = "INSERT INTO AttendanceLogTest VALUES ('{}','{}');"
            #query = query.format(studentId, timeScan)
            execute_query(mydb, query)
            time.sleep(5)
            GPIO.cleanup()
    except mysql.connector.IntegrityError:
                print(f"Row already exists in database")

    mydb.close()


