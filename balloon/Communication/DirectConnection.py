import requests
from loguru import logger
from requests import HTTPError

__BASE_URL__ = "https://tinf-21-c-iot-wetterballon.vercel.app"
__APP_URL__ = "/api/messure"
__API_KEY__ = "65Z60oSyECPdlcCwa6LZ"

from urllib3.exceptions import MaxRetryError


class DirectConnection:
    def __init__(self):
        self.status = False
        self.check_connection()

        pass

    def check_connection(self):
        try:
            res = requests.get(url="https://icanhazip.com/")
            if res.status_code == 200:
                self.status = True
            else:
                self.status = False
        except HTTPError:
            print("Http disconnected")
            self.status = False
        except MaxRetryError:
            print("Http disconnected")
            self.status = False
        except ConnectionError:
            print("Http disconnected")
            self.status = False


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
        except HTTPError:
            logger.info("Http disconnected")
            self.status = False
        except MaxRetryError:
            print("Http disconnected")
            self.status = False
        except ConnectionError:
            print("Http disconnected")
            self.status = False
        return False

    def send_gps_data(self, gpsdata):
        return self.send_data(gpsdata)

    def send_airpressure_data(self, airpressure_data):
        return self.send_data(airpressure_data)

    def send_humidity_outdoor_data(self, humidity_outdoor_data):
        return self.send_data(humidity_outdoor_data)

    def send_temperature_outdoor_data(self, temperature_outdoor_data):
        return self.send_data(temperature_outdoor_data)