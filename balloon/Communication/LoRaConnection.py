
__ESP_Address__=0x08

import json
import struct

from smbus2 import SMBus


def string_to_bytes(val):
    ret_val = []
    for c in val:
        ret_val.append(ord(c))
    return ret_val

def float_to_bytes(val: float):
    return bytearray(struct.pack("f", val))


class LoRaConnection:
    def __init__(self, bus: SMBus):
        self.bus = bus
        self.write_string_data(0x00, "Hello")
        read = bus.read_word_data(__ESP_Address__, 0x01)
        print(read)

        self.status = True
        pass

    # http://www.raspberry-projects.com/pi/programming-in-python/i2c-programming-in-python/using-the-i2c-interface-2
    def write_string_data(self, register: int, value: str):
        byte_value = string_to_bytes(value)
        print(len(byte_value))
        self.bus.write_i2c_block_data(__ESP_Address__, register, byte_value)
        return 0

    def write_float_data(self, register: int, value: float):
        byte_value = float_to_bytes(value)
        self.bus.write_i2c_block_data(__ESP_Address__, register, byte_value)
        return 0

    def send_gps_data_minified(self, gps_data):
        gps_data_minified = {"lo": gps_data["longitude"],
                             "la": gps_data["latitude"],
                             "a": gps_data["altitude"]}

        self.write_float_data(0x21, gps_data['longitude'])
        self.write_float_data(0x22, gps_data['latitude'])
        self.write_float_data(0x23, gps_data['altitude'])

        self.write_float_data(0x31, 0)
        pass


