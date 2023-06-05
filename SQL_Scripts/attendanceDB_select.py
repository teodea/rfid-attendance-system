import mysql.connector

# Database credentials
db_config = {
    'user': 'ece482',
    'password': 'ece482db',
    'host': '3.208.87.91',
    'database': 'Attendance_DB'
}

try:
    # Establishing a connection to the database
    conn = mysql.connector.connect(**db_config)
    
    print("MySQL connection established!\n")
    
    # Creating a cursor object to execute SQL queries
    cursor = conn.cursor()
    
    # SQL query to fetch data from the Students table
    stmt = 'SELECT instructorId, name FROM Instructors'
    
    # Executing the query
    cursor.execute(stmt)
    
    print("Executing query\n")

    # Fetching all the rows from the result set
    rows = cursor.fetchall()
    
    # Iterating over the rows and printing the first and last names
    for row in rows:
        insID, name = row
        print("instructorId: {}, name: {}".format(insID, name))
    
except mysql.connector.Error as error:
    print("Error:", error)
    
finally:
    # Closing database connections and cursors
    if conn.is_connected():
        cursor.close()
        conn.close()
