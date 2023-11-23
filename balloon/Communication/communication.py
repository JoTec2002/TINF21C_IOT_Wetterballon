import json

from loguru import logger
from smbus2 import SMBus

from Communication.Database_Buffer import DatabaseBuffer
from Communication.DirectConnection import DirectConnection
from Communication.LoRaConnection import LoRaConnection


class Communication:
    def __init__(self, bus: SMBus):
        # Define Communication stati
        self.database_buffer = DatabaseBuffer()
        self.directConnection = DirectConnection()
        self.loraConnection = LoRaConnection(bus)

        self.last_gps_data = {"longitude": 0, "latitude": 0, "altitude": 0}
        self.last_temp_pressure_humidity_data = {"temperature": 0, "humidity":0, "pressure":0}

        logger.info("Direct Connetion: " + str(self.directConnection.status))
        logger.info("Lora Module Connection: " + str(self.loraConnection.status))


    def send_data(self, gps_data, temp_pressure_humidity_data):
        return_gps = self.send_gps_data(gps_data)
        return_temp_pressure_humidity = self.send_temp_pressure_humidity_outdoor_data(temp_pressure_humidity_data)

        if return_gps == -2 or return_temp_pressure_humidity == -2:
            # on -2 return data should not be send via LoRa
            print("return")
            return

        if return_gps > 0 and return_temp_pressure_humidity > 0:
            #if both gps and temp_pressure_humidity cloudn't send directly

            #create new total dict
            #del (gps_data['status'])
            #del (gps_data['tiff'])
            del (gps_data['time'])
            del (temp_pressure_humidity_data['time'])
            lora_data = gps_data | temp_pressure_humidity_data
            lora_data_list = list(lora_data.values())

            print(lora_data_list)
            #send via Lora
            self.loraConnection.send_all_data(lora_data_list)

            #TODO Flag in DB as send via LoRa
            pass


    def send_gps_data(self, gps_data):
        #check if GPS Data status is 3D Fixed - just than save Datapoint
        if not gps_data['status'] == "Location 3D Fix":
            return -2

        del (gps_data['status'])
        del (gps_data['tiff'])

        # check for changed Sensor values
        new_data = {"longitude": gps_data["longitude"], "latitude": gps_data["latitude"], "altitude": gps_data["altitude"]}
        if new_data == self.last_gps_data:
            return -2
        else:
            self.last_gps_data = new_data
            #logger.info("new GPS data")

        # write all values to SD Card (SQLITE DB)
        row_id = self.database_buffer.add_gps_data(gps_data)

        gps_data_api = {'gpsdata': gps_data}
        gps_data_json = json.dumps(gps_data_api)

        if self.directConnection.status:
           self.directConnection.send_gps_data(gps_data_json)
           self.database_buffer.remove_gps_data(row_id)
           return -1

        return row_id


    def send_temp_pressure_humidity_outdoor_data(self, temp_pressure_humidity_data):
        # check for changed Sensor values
        new_data = {"temperature": temp_pressure_humidity_data["temperature"],
                    "humidity": temp_pressure_humidity_data["humidity"],
                    "pressure": temp_pressure_humidity_data["pressure"]}
        if new_data == self.last_temp_pressure_humidity_data:
            return -2
        else:
            self.last_gps_data = new_data

        # write all changed values to SD Card (SQLITE DB)
        row_id = self.database_buffer.add_temp_pressure_humidity_data(temp_pressure_humidity_data)

        #Try sending Data via direct Connection
        airpressure_data_api = {'airpressure': {'time': temp_pressure_humidity_data['time'],
                                                'value': temp_pressure_humidity_data['pressure']}}

        humidity_outdoor_data_api = {'humidity_outdoor': {'time': temp_pressure_humidity_data['time'],
                                                          'value': temp_pressure_humidity_data['humidity']}}

        temperature_outdoor_data_api = {'temperature_outdoor': {'time': temp_pressure_humidity_data['time'],
                                                                'value': temp_pressure_humidity_data['temperature']}}
        if self.directConnection.status:
            logger.info(self.directConnection.send_airpressure_data         (json.dumps(airpressure_data_api)))
            logger.info(self.directConnection.send_humidity_outdoor_data    (json.dumps(humidity_outdoor_data_api)))
            logger.info(self.directConnection.send_temperature_outdoor_data (json.dumps(temperature_outdoor_data_api)))
            self.database_buffer.remove_temp_pressure_humidity_data(row_id)
            return -1

        return row_id
