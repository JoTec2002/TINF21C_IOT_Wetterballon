from smbus2 import smbus2

from Communication.LoRaConnection import LoRaConnection

port = 1
bus = smbus2.SMBus(port)
LoRaConnection(bus)