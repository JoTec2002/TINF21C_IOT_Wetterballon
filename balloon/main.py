"""
Main File for the weather balloon

author: Jonas Graubner
date: 19.10.2023
license: MIT
"""
import time
from loguru import logger
from GPS.gps import Gps


class Main:
    def __init__(self):
        logger.add("gps.log")
        self.GPS = Gps()
        logger.info("GPS init")

    def loop(self):
        while True:
            logger.info(self.GPS.read_location())
            time.sleep(20)

if __name__ == "__main__":
    print("Start")
    main = Main()

    try:
        main.loop()
    except KeyboardInterrupt:
        print("End")

