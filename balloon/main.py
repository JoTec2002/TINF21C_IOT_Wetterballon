"""
Main File for the weather balloon

author: Jonas Graubner
date: 19.10.2023
license: MIT
"""
import time
from threading import Thread

import smbus2
from RPi import GPIO
from loguru import logger

from BME280.Mbme280 import Mbme280
from Camera.camera import Camera
from Communication.communication import Communication
from GPS.gps import Gps
from MPU9050.mpu9050 import MPU9050
from SHT40.sht40 import SHT4x


class Main:
    def __init__(self):
        # I2C Bus
        port = 1
        bus = smbus2.SMBus(port)

        logger.add("Logs.log")

        self.Communication = Communication(bus)
        logger.info("Communication init successful")

        self.GPS = Gps()
        logger.info("GPS init successful")

        # BME280
        self.BME280 = Mbme280(bus, address=0x76)
        logger.info("BME280 init successful")

        #SMT40
        self.SHT40 = SHT4x()
        self.SHT40.reset()
        self.SHT40.mode = "high"
        logger.info("SMT40 init successful")

        # MPU 9050
        self.MPU9050 = MPU9050()
        logger.info("MPU9050 init successful")

        # Camera
        self.camera = Camera(communication=self.Communication)
        logger.info("Camera init successful")

    def loop(self):
        while True:
            time_start = time.time_ns()
            # get all sensor values
            gps_data = self.GPS.read_location()
            temp_pressure_humidity_outdoor_data = self.BME280.read_temp_pressure_humidity()
            temp_humidity_indoor_data = self.SHT40.update_and_read()
            rotation_data = self.MPU9050.last_euler_axis.tolist()

            logger.info(gps_data)
            logger.info(temp_pressure_humidity_outdoor_data)
            logger.info(temp_humidity_indoor_data)
            logger.info(rotation_data)

            Thread(target=self.Communication.send_data, args=(gps_data, temp_pressure_humidity_outdoor_data, temp_humidity_indoor_data, )).start()

            # sleep so that sensor values are read every 20 seconds
            time_run = (time.time_ns() - time_start) / 1_000_000_000
            time_to_sleep = 20 - time_run
            print(time_to_sleep)
            if time_to_sleep > 0:
                time.sleep(time_to_sleep)


if __name__ == "__main__":
    print("Start")
    main = Main()

    try:
        main.loop()
    except KeyboardInterrupt:
        GPIO.cleanup()
        print("End")
