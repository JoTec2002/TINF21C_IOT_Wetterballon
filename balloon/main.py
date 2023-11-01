"""
Main File for the weather balloon

author: Jonas Graubner
date: 19.10.2023
license: MIT
"""
import time
from loguru import logger
from GPS.gps import Gps
from MPU9050.mpu9050 import MPU9050


class Main:
    def __init__(self):
        logger.add("Logs.log")
        self.GPS = Gps()
        self.MPU9050 = MPU9050()
        logger.info("GPS init")

    def loop(self):
        while True:
            logger.info(self.GPS.read_location())
            logger.info(self.MPU9050.read_position_data())
            time.sleep(20)

if __name__ == "__main__":
    print("Start")
    main = Main()

    try:
        main.loop()
    except KeyboardInterrupt:
        print("End")

