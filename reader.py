#!/usr/bin/env python
from mfrc522 import SimpleMFRC522
from datetime import datetime
import time
import RPi.GPIO as GPIO
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

if __name__ == '__main__':
    reader = SimpleMFRC522()
    connection = create_db_connection("44.200.118.80", "ece482", "ece482db", "EC2Test")
    try:
        while True:
            id, text = reader.read()
            timeScan = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            query = "INSERT INTO TABLE VALUES ('{}','{}','{}');"
            query = query.format(id, text, timeScan)
            execute_query(connection, query)
            time.sleep(5)
            GPIO.cleanup()
    except Exception as e:
        print(e)
