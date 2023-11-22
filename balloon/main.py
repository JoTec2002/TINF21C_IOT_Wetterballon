"""
Main File for the weather balloon

author: Jonas Graubner
date: 19.10.2023
license: MIT
"""
import time
from threading import Thread

import smbus2
from loguru import logger

from BME280.Mbme280 import Mbme280
from Camera.camera import Camera
from Communication.communication import Communication
from GPS.gps import Gps
from MPU9050.mpu9050 import MPU9050


class Main:
    def __init__(self):
        #I2C Bus
        port = 1
        bus = smbus2.SMBus(port)

        logger.add("Logs.log")

        self.GPS = Gps()
        logger.info("GPS init successful")

        #BME280
        self.BME280 = Mbme280(bus, address = 0x76)
        logger.info("BME280 init successful")

        #MPU 9050
        self.MPU9050 = MPU9050()
        logger.info("MPU9050 init successful")

        #Camera
        self.camera = Camera()
        logger.info("Camera init successful")

        self.Communication = Communication(bus)

    def loop(self):
        while True:
            time_start = time.time_ns()
            # get all sensor values
            gps_data = self.GPS.read_location()
            temp_pressure_humidity_outdoor_data = self.BME280.read_temp_pressure_humidity()
            logger.info(gps_data)
            logger.info(temp_pressure_humidity_outdoor_data)
            logger.info(self.MPU9050.read_position_data())
            #self.camera.get_image()

            Thread(target=self.Communication.send_gps_data, args=(gps_data,)).start()
            Thread(target=self.Communication.send_temp_pressure_humidity_outdoor_data,
                   args=(temp_pressure_humidity_outdoor_data,)).start()

            #sleep so that sensor values are read every 30 seconds
            time_run = (time.time_ns() - time_start) / 1_000_000_000
            time_to_sleep = 20-time_run
            print(time_to_sleep)
            if time_to_sleep > 0:
                time.sleep(time_to_sleep)

if __name__ == "__main__":
    print("Start")
    main = Main()

    try:
        main.loop()
    except KeyboardInterrupt:
        print("End")

