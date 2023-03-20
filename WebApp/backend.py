from flask import Flask, render_template, request, redirect
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

if __name__ == '__main__':
    connection = create_db_connection("52.3.222.145", "ece482", "ece482db", "EC2Test")