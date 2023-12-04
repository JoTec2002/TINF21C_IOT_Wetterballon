import base64
import json
import datetime
import time

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
        self.last_temp_pressure_humidity_outdoor_data = {"temperature": 0, "humidity": 0, "pressure": 0}
        self.last_temp_humidity_indoor_data = {"temperature": 0, "humidity": 0}

        logger.info("Direct Connetion: " + str(self.directConnection.status))
        logger.info("Lora Module Connection: " + str(self.loraConnection.status))

    def send_data(self, gps_data, temp_pressure_humidity_outdoor_data, temp_humidity_indoor_data):
        """
        Sending Data
        :param gps_data:
        :param temp_pressure_humidity_outdoor_data:
        :param temp_humidity_indoor_data:
        :return:
        """
        """
            return meanings:
            - -2 -> value unchanged
            - -1 -> send via direct connection
            - >=0 -> could be send -> SQLite row_id
        """
        logger.info("begin send")
        return_gps = self.send_gps_data(gps_data)
        return_temp_pressure_humidity_outdoor = self.send_temp_pressure_humidity_outdoor_data(temp_pressure_humidity_outdoor_data)
        return_temp_humidity_indoor = self.send_temp_humidity_indoor_data(temp_humidity_indoor_data)
        logger.info("GPS: "+str(return_gps))
        logger.info("temp_pressure_humidity_outdoor: "+str(return_temp_pressure_humidity_outdoor))
        logger.info("temp_humidity_indoor: "+str(return_temp_humidity_indoor))

        if return_gps == -2 or return_temp_pressure_humidity_outdoor == -2 or return_temp_humidity_indoor == -2:
            # on -2 return data should not be send via LoRa
            # print("return")
            return

        if return_gps > 0 and return_temp_pressure_humidity_outdoor > 0 and return_temp_humidity_indoor > 0:
            # if all sensor data cloudn't send directly and are updated

            # create new total dict
            # del (gps_data['status'])
            # del (gps_data['tiff'])
            del (gps_data['time'])
            del (gps_data['satellites'])
            del (temp_pressure_humidity_outdoor_data['time'])
            del (temp_humidity_indoor_data['time'])
            lora_data = gps_data | temp_pressure_humidity_outdoor_data
            lora_data["temperature_indoor"] = temp_humidity_indoor_data["temperature"]
            lora_data["humidity_indoor"] = temp_humidity_indoor_data["humidity"]
            lora_data_list = list(lora_data.values())
            print(lora_data)

            self.loraConnection.update_status()
            #send via Lora if LoRa Module is sleeping
            if not self.loraConnection.LoRa_status == 0x03:
                return
            self.loraConnection.send_all_data(lora_data_list)

            self.loraConnection.update_status()
            while not self.loraConnection.LoRa_status == 0x03:
                time.sleep(1)
                self.loraConnection.update_status()
                print(1)

            logger.info("send via lora successfully")

            # remove sent data from local Database Buffer
            self.database_buffer.remove_gps_data(return_gps)
            self.database_buffer.remove_temp_pressure_humidity_outdoor_data(return_temp_pressure_humidity_outdoor)
            self.database_buffer.remove_temp_humidity_indoor_data(return_temp_humidity_indoor)

    def send_gps_data(self, gps_data):
        # check if GPS Data status is 3D Fixed - just than save Datapoint
        if not gps_data['status'] == "Location 3D Fix":
            return -2

        del (gps_data['status'])
        del (gps_data['tiff'])

        # check for changed Sensor values
        new_data = {"longitude": gps_data["longitude"], "latitude": gps_data["latitude"],
                    "altitude": gps_data["altitude"]}
        if new_data == self.last_gps_data:
            return -2
        else:
            self.last_gps_data = new_data
            # logger.info("new GPS data")

        # write all values to SD Card (SQLITE DB)
        row_id = self.database_buffer.add_gps_data(gps_data)

        gps_data_api = {'gpsdata': gps_data}
        gps_data_json = json.dumps(gps_data_api)

        return_gps = False
        if self.directConnection.status:
            return_gps = self.directConnection.send_gps_data(gps_data_json)

        if return_gps:
            self.database_buffer.remove_gps_data(row_id)
            return -1

        return row_id

    def send_temp_pressure_humidity_outdoor_data(self, temp_pressure_humidity_outdoor_data):
        # check for changed Sensor values
        new_data = {"temperature": temp_pressure_humidity_outdoor_data["temperature"],
                    "humidity": temp_pressure_humidity_outdoor_data["humidity"],
                    "pressure": temp_pressure_humidity_outdoor_data["pressure"]}
        if new_data == self.last_temp_pressure_humidity_outdoor_data:
            return -2
        else:
            self.last_gps_data = new_data

        # write all changed values to SD Card (SQLITE DB)
        row_id = self.database_buffer.add_temp_pressure_humidity_outdoor_data(temp_pressure_humidity_outdoor_data)

        # Try sending Data via direct Connection
        airpressure_data_api = {'airpressure': {'time': temp_pressure_humidity_outdoor_data['time'],
                                                'value': temp_pressure_humidity_outdoor_data['pressure']}}

        humidity_outdoor_data_api = {'humidity_outdoor': {'time': temp_pressure_humidity_outdoor_data['time'],
                                                          'value': temp_pressure_humidity_outdoor_data['humidity']}}

        temperature_outdoor_data_api = {'temperature_outdoor': {'time': temp_pressure_humidity_outdoor_data['time'],
                                                                'value': temp_pressure_humidity_outdoor_data['temperature']}}

        airpressure_return = False
        humidity_outdoor_return = False
        temperature_outdoor_return = False

        if self.directConnection.status:
            airpressure_return = self.directConnection.send_airpressure_data(json.dumps(airpressure_data_api))
        if self.directConnection.status:
            humidity_outdoor_return = self.directConnection.send_humidity_outdoor_data(json.dumps(humidity_outdoor_data_api))
        if self.directConnection.status:
            temperature_outdoor_return = self.directConnection.send_temperature_outdoor_data(json.dumps(temperature_outdoor_data_api))

        if airpressure_return and humidity_outdoor_return and temperature_outdoor_return:
            self.database_buffer.remove_temp_pressure_humidity_outdoor_data(row_id)
            return -1

        return row_id

    def send_temp_humidity_indoor_data(self, temp_humidity_indoor_data):
        # check for changed Sensor values
        new_data = {"temperature": temp_humidity_indoor_data["temperature"],
                    "humidity": temp_humidity_indoor_data["humidity"]}
        if new_data == self.last_temp_humidity_indoor_data:
            return -2
        else:
            self.last_gps_data = new_data

        # write all changed values to SD Card (SQLITE DB)
        row_id = self.database_buffer.add_temp_humidity_indoor_data(temp_humidity_indoor_data)

        # Try sending Data via direct Connection
        humidity_indoor_data_api = {'humidity_indoor': {'time': temp_humidity_indoor_data['time'],
                                                          'value': temp_humidity_indoor_data['humidity']}}

        temperature_indoor_data_api = {'temperature_indoor': {'time': temp_humidity_indoor_data['time'],
                                                                'value': temp_humidity_indoor_data['temperature']}}

        humidity_indoor_return = False
        temperature_indoor_return = False

        if self.directConnection.status:
            humidity_indoor_return = self.directConnection.send_humidity_indoor_data(json.dumps(humidity_indoor_data_api))
        if self.directConnection.status:
            temperature_indoor_return = self.directConnection.send_temperature_indoor_data(json.dumps(temperature_indoor_data_api))

        if humidity_indoor_return and temperature_indoor_return:
            self.database_buffer.remove_temp_pressure_humidity_outdoor_data(row_id)
            return -1

        return row_id

    def send_picture(self, picturepath):
        img_binary = open(picturepath, 'rb')
        img_base64_bytes = base64.b64encode(img_binary.read())
        img_base64_string = img_base64_bytes.decode("ascii")

        date_string = datetime.datetime.now().isoformat()
        img_json = json.dumps({"image": {"base64Image": img_base64_string, "time": date_string}})
        logger.info(self.directConnection.send_base64_picture_data(img_json))
