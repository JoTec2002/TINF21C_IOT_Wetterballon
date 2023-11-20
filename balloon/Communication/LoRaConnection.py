__ESP_Address__=0x08

from smbus2 import SMBus

def string_to_bytes(val):
    ret_val = []
    for c in val:
        ret_val.append(ord(c))
    return ret_val


class LoRaConnection:
    def __init__(self, bus: SMBus):
        self.bus = bus
        self.LoRa_status = 0
        #self.write_string_data(0x00, "Hello")
        try:
            self.LoRa_status = bus.read_byte_data(__ESP_Address__, 0x00)
            self.status = True
        except:
            self.status = False
            self.LoRa_status = 0

        self.status = True
        pass

    def write_data(self, register, byte_buffer):
        #read current LoraDevice State
        self.LoRa_status = self.bus.read_byte_data(__ESP_Address__, 0x00)
        if self.LoRa_status == 0x03:
            try:
                self.bus.write_i2c_block_data(__ESP_Address__, register, byte_buffer)
            except:
                self.status = False
                self.LoRa_status = 0

    # http://www.raspberry-projects.com/pi/programming-in-python/i2c-programming-in-python/using-the-i2c-interface-2
    def write_string_data(self, register: int, value: str):
        byte_value = string_to_bytes(value)
        print(len(byte_value))
        self.write_data(register, byte_value)

    def write_float_data(self, register: int, value: float):
        byte_value = (int(value*10000)).to_bytes(3, 'big')
        self.write_data(register, byte_value)

    def write_floats_data(self, register: int, value: list):
        byte_buffer = []
        for i in value:
            byte_buffer += (int(i * 10000)).to_bytes(3, 'big')
        self.write_data(register, byte_buffer)

    def send_gps_data_minified(self, gps_data):
        gps_data_minified = [gps_data['longitude'], gps_data['latitude'], gps_data['altitude']]

        self.write_floats_data(0x21, gps_data_minified)
        pass


