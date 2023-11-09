import requests
from requests import HTTPError

__BASE_URL__ = "https://nas.graubner-bayern.de"
__APP_URL__ = "/api/messure"

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

    def send_data(self, data):
        try:
            res = requests.post(url=__BASE_URL__+__APP_URL__, data=data)
            if res.status_code == 200:
                self.status = True
                return True
            else:
                self.status = False
        except HTTPError:
            print("Http disconnected")
            self.status = False
        return False

    pass