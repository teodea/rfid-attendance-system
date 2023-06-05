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
    stmt = "INSERT INTO Instructors (instructorId, name) VALUES (%s, %s)"

    with open('instructor_data.txt', 'r') as file:
        # Loop through each line in the file
        for line in file:
            # Remove whitespace from the beginning and end of the line
            line = line.strip()
            
            # Split the line into instructor ID and name
            values = line.split(' ')
            data = {
                'instructorId': values[0],
                'name': ' '.join(values[1:])
            }

            # Data values to be inserted into the database
            values = (data['instructorId'], data['name'])
            
            try:
                # Executing the query
                cursor.execute(stmt, values)
            
                print("Inserted data: ", values)

                # Committing the changes to the database
                conn.commit()
                print('Data inserted successfully!')    
            except mysql.connector.IntegrityError:
                print(f"Row already exists in database: {values}")
     
    
finally:
    # Closing database connections and cursors
    if conn.is_connected():
        cursor.close()
        conn.close()
