import bme280
from loguru import logger


class Mbme280:
    def __init__(self, bus, address):
        self.bus = bus
        self.address = address
        try:
            self.calibration_params = bme280.load_calibration_params(bus, address)
        except OSError:
            logger.warning("BME 280 not reachable")

    def read_temp_pressure_humidity(self):
        data = bme280.sample(self.bus, self.address, self.calibration_params)

        return {"time": data.timestamp.isoformat(), "temperature": data.temperature, "pressure": data.pressure, "humidity": data.humidity}
