import json

from loguru import logger
from smbus2 import SMBus

from Communication.DirectConnection import DirectConnection
from Communication.LoRaConnection import LoRaConnection


class Communication:
    def __init__(self, bus: SMBus):
        # Define Communication stati
        self.directConnection = DirectConnection()
        self.loraConnection = LoRaConnection(bus)

        logger.info(self.directConnection.status)
        logger.info(self.loraConnection.status)


    def send_gps_data(self, gps_data):
        #TODO check if GPS Data status is 3D Fixed - just than save Datapoint

        # write all values to SD Card (SQLITE DB)
        # TODO

        # check for changed Sensor values
        # TODO

        del (gps_data['status'])
        del (gps_data['tiff'])

        gps_data_api = {'gpsdata': gps_data}
        gps_data_json = json.dumps(gps_data_api)

        if self.directConnection.status:
           logger.info(self.directConnection.send_gps_data(gps_data_json))

        self.loraConnection.send_gps_data_minified(gps_data)
        pass

    def send_temp_pressure_humidity_outdoor_data(self, temp_pressure_humidity_data):
        # write all values to SD Card (SQLITE DB)
        # TODO

        # check for changed Sensor values
        # TODO

        airpressure_data_api = {'airpressure': {'time':temp_pressure_humidity_data['time'],
                                                'value':temp_pressure_humidity_data['pressure']}}

        humidity_outdoor_data_api = {'humidity_outdoor': {'time': temp_pressure_humidity_data['time'],
                                                'value': temp_pressure_humidity_data['humidity']}}

        temperature_outdoor_data_api = {'temperature_outdoor': {'time': temp_pressure_humidity_data['time'],
                                                'value': temp_pressure_humidity_data['temperature']}}

        if self.directConnection.status:
            logger.info(self.directConnection.send_airpressure_data         (json.dumps(airpressure_data_api)))
            logger.info(self.directConnection.send_humidity_outdoor_data    (json.dumps(humidity_outdoor_data_api)))
            logger.info(self.directConnection.send_temperature_outdoor_data (json.dumps(temperature_outdoor_data_api)))
