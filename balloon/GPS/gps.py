import serial
import time
from datetime import datetime


def parse_response(response, message_command):
    """
    Parses the response from the GPS Module
    :param response: the Response from the GPS Module
    :param message_command: The Beginning of the response message usually "Command="
    :return: returns a parsed message
    """
    response = str(response) #Make sure response is string
    #check first if there is exactly one OK
    if not response.count('OK') == 1:
        # Error Message not correctly Formatted
        return False

    #try Parse Real Message beging
    try:
        start_index = response.index(message_command) + len(message_command)
        response = response[start_index:]

        end_index = response.index('\\r\\n')
        response = response[:end_index]
        return response.strip()
    except ValueError:
        return False
def parse_gps_to_decimal(gps_in_degree):
    """
    Parses the GPS from dddmm.mmmmmm to decimal
    :param gps_in_degree:
    :return: gps_in_decimal
    """
    gps_in_degree = str(gps_in_degree)

    index = (gps_in_degree.index(".") - 2)
    ddd = float(gps_in_degree[:index])
    mmm = (float(gps_in_degree[index:]))/60

    return ddd+mmm
def parese_date_from_string_to_datetime(string_time):
    datetime_object = datetime.strptime(string_time, '%Y%m%d%H%M%S.%f')
    return datetime_object

class Gps:
    def __init__(self):
        """
        Defines class wide variables
        :return:
        """
        self.Connection = serial.Serial(port='/dev/ttyS0', baudrate=115200, timeout=1, xonxoff=True, exclusive=True)
        self.power = False


        if not self.power_up():
            # GPS power up not successful
            # TODO: throw and Handle Error here
            pass
        print("GPS Powered UP!")

        #Set GPS to correct output mode
        res = self.send_command('AT+CGPSOUT?')
        res = parse_response(res, 'CGPSOUT:')
        if not res == str(0):
            print(self.send_command('AT+CGPSOUT=0'))
        print("GPS Output Mode set")


        pass

    def send_command(self, command):
        """
        Send command to GPS Interface and return native response
        :param command: AT+Command
        :return: response
        """
        self.Connection.write(str.encode(command + '\r\n'))
        time.sleep(1)
        return str(self.Connection.read(self.Connection.inWaiting()))

    def power_up(self):
        """
        Makes sure the GPS Module is powered up.
        :return: bool (successful response)
        """
        #Flush Buffer
        self.Connection.read(self.Connection.inWaiting())
        for x in range(5):
            # Request Power State
            self.Connection.write(str.encode('AT+CGPSPWR?' + '\r\n'))
            #Wait and Check Response
            time.sleep(1)
            res = str(self.Connection.read(self.Connection.inWaiting()))
            if 'CGPSPWR: 1' in res:
                #gps powered up
                return True
            else:
                # power up gps
                print("GPS Power up Attempt: "+str(x))
                self.Connection.write(str.encode('AT+CGPSPWR=1' + '\r\n'))
                time.sleep(5)
        # GPS not running after 5 Startup Attempts
        return False

    def read_location(self):
        """
        Read GPS Location Data
        :return: Location Array
        """
        ret_array = {}

        #get current gps status
        status = self.send_command('AT+CGPSSTATUS?')
        status_parsed = parse_response(status, "CGPSSTATUS:")
        ret_array["status"] = status_parsed



        location = self.send_command('AT+CGPSINF=0')
        location_parsed = parse_response(location, "CGPSINF:")
        location_array = location_parsed.split(',')
        #location_array[0] = operating mode
        if not location_array[0] == str(0):
            # TODO: Error Handling
            print("Error in Location Data")
            return False

        ret_array["tiff"] =             location_array[5]
        ret_array["num_satellites"] =    location_array[6]
        ret_array["speed"] =            location_array[7]
        ret_array["course"] =           location_array[8]
        ret_array["altitude"] =         float(location_array[3])

        if not location_array[1] == '0.000000':
            ret_array["longitude"] = (parse_gps_to_decimal(location_array[1]))

        if not location_array[2] == '0.000000':
            ret_array["latitude"] = (parse_gps_to_decimal(location_array[2]))

        ret_array["utc_time"] = parese_date_from_string_to_datetime(location_array[4])

        return ret_array
