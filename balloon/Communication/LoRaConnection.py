__ESP_Address__=0x08

from loguru import logger
from smbus2 import SMBus

def string_to_bytes(val):
    ret_val = []
    for c in val:
        ret_val.append(ord(c))
    return ret_val


class LoRaConnection:
    def __init__(self, bus: SMBus):
        self.bus = bus
        self.LoRa_status = 0 # 0: unknown, 1: Joining, 2: Sending, 3: sleeping
        self.status = False
        self.update_status()

    def update_status(self):
        try:
            self.LoRa_status = self.bus.read_byte_data(__ESP_Address__, 0x00)
            self.status = True
        except OSError:
            logger.warning("LoRa Module not reachable")
            self.status = False
            self.LoRa_status = 0

    def write_data(self, register, byte_buffer):
        #read current LoraDevice State
        try:
            self.LoRa_status = self.bus.read_byte_data(__ESP_Address__, 0x00)
        except OSError:
            logger.warning("LoRa Module not reachable")
            self.status = False
            self.LoRa_status = 0
            return
        if self.LoRa_status == 0x03:
            try:
                self.bus.write_i2c_block_data(__ESP_Address__, register, byte_buffer)
            except OSError:
                logger.warning("LoRa Module not reachable")
                self.status = False
                self.LoRa_status = 0

    # http://www.raspberry-projects.com/pi/programming-in-python/i2c-programming-in-python/using-the-i2c-interface-2
    def write_string_data(self, register: int, value: str):
        byte_value = string_to_bytes(value)
        print(len(byte_value))
        self.write_data(register, byte_value)

    def write_floats_data(self, register: int, value: list):
        byte_buffer = []
        for i in value:
            byte_buffer += (int(i * 10000)).to_bytes(3, 'big')
        self.write_data(register, byte_buffer)

    def send_all_data(self, data):
        self.write_floats_data(0x20, data)
