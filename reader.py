#!/usr/bin/env python
from mfrc522 import SimpleMFRC522
from datetime import datetime
import time
import RPi.GPIO as GPIO

reader = SimpleMFRC522()

try:
	while True:
		id, text = reader.read()
		timeScan = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
		print(id)
		print(text)
		print(timeScan)

		time.sleep(5)
		GPIO.cleanup()

except Exception as e:
	print(e)
