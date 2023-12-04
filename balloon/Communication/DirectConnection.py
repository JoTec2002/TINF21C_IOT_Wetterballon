import time
from threading import Thread

import requests
from loguru import logger
from requests import HTTPError

__BASE_URL__ = "https://tinf-21-c-iot-wetterballon.vercel.app"
__APP_URL__ = "/api/messure"
__API_KEY__ = "65Z60oSyECPdlcCwa6LZ"

from urllib3.exceptions import MaxRetryError


def check_connection():
    try:
        res = requests.get(url="https://icanhazip.com/")
        if res.status_code == 200:
            return True
    except:
        logger.warning("Http Disconnected")
    return False

class DirectConnection:
    def __init__(self):
        self.status = check_connection()
        if not self.status:
            Thread(target=self.wait_on_reconnection).start()

    def wait_on_reconnection(self):
        while not self.status:
            self.status = check_connection()
            time.sleep(20)
        logger.info("HTTP Connection reestablished")
        #TODO send all Bufferd Data now

    def send_data(self, data):
        try:
            res = requests.post(url=__BASE_URL__+__APP_URL__, data=data, headers={'apikey': __API_KEY__})
            if res.status_code == 200:
                self.status = True
                return True
            else:
                print(res.content)
                #TODO realy handle error
                self.status = False
        except:
            logger.warning("Http Disconnected")
            self.status = False
            Thread(target=self.wait_on_reconnection).start()
        return False

    def send_gps_data(self, gpsdata):
        return self.send_data(gpsdata)

    def send_airpressure_data(self, airpressure_data):
        return self.send_data(airpressure_data)

    def send_humidity_outdoor_data(self, humidity_outdoor_data):
        return self.send_data(humidity_outdoor_data)

    def send_temperature_outdoor_data(self, temperature_outdoor_data):
        return self.send_data(temperature_outdoor_data)

    def send_humidity_indoor_data(self, humidity_indoor_data):
        return self.send_data(humidity_indoor_data)

    def send_temperature_indoor_data(self, temperature_indoor_data):
        return self.send_data(temperature_indoor_data)

    def send_base64_picture_data(self, base64_picture):
        return self.send_data(base64_picture)