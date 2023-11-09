"""
Main File for the weather balloon

author: Jonas Graubner
date: 19.10.2023
license: MIT
"""
import time

import smbus2
from loguru import logger
from BME280.Mbme280 import Mbme280
from Communication.communication import Communication
from GPS.gps import Gps
from MPU9050.mpu9050 import MPU9050


class Main:
    def __init__(self):
        logger.add("Logs.log")

        self.GPS = Gps()
        logger.info("GPS init successful")

        #BME280
        port = 1
        bus = smbus2.SMBus(port)
        self.BME280 = Mbme280(bus, address = 0x76)
        logger.info("BME280 init successful")


        self.MPU9050 = MPU9050()
        logger.info("MPU9050 init successful")

        Communication(bus)

    def loop(self):
        while True:
            logger.info(self.GPS.read_location())
            logger.info(self.BME280.read_temp_pressure_humidity())
            logger.info(self.MPU9050.read_position_data())
            time.sleep(20)

if __name__ == "__main__":
    print("Start")
    main = Main()

    try:
        main.loop()
    except KeyboardInterrupt:
        print("End")

