import sqlite3
from sqlite3 import Error
from loguru import logger

__SQL_CREATE_GPS_TABLE__ = """
CREATE TABLE IF NOT EXISTS `gpsdata` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `time` datetime(3) NOT NULL,
  `satellites` int(11) NOT NULL,
  `speed` double NOT NULL,
  `course` double NOT NULL,
  `altitude` double NOT NULL,
  `longitude` double NOT NULL,
  `latitude` double NOT NULL,
  `send_state` int(1) DEFAULT 0 NOT NULL
)"""

__SQL_CREATE_TEMP_OUTDOOR_TABLE__ = """
CREATE TABLE IF NOT EXISTS `temperatureOutdoor` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `time` datetime(3) NOT NULL,
  `value` double NOT NULL
)"""

__SQL_CREATE_HUMID_OUTDOOR_TABLE__ = """
CREATE TABLE IF NOT EXISTS `humidityOutdoor` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `time` datetime(3) NOT NULL,
  `value` double NOT NULL
)"""

__SQL_CREATE_AIRPRESSURE_TABLE__ = """
CREATE TABLE IF NOT EXISTS `airpressure` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `time` datetime(3) NOT NULL,
  `value` double NOT NULL
)"""

__SQL_INSERT_GPS_ROW__ = """INSERT INTO `gpsdata` (
        `time`, `satellites`, `speed`, `course`, `altitude`, `longitude`, `latitude`)
         VALUES (:time, :satellites, :speed, :course, :altitude, :longitude, :latitude);"""

__SQL_INSERT_TEMP_OUTDOOR_ROW__ = """INSERT INTO `temperatureOutdoor` (
    `time`, `value`) VALUES (:time, :value);"""

__SQL_INSERT_HUMID_OUTDOOR_ROW__ = """INSERT INTO `humidityOutdoor` (
    `time`, `value`) VALUES (:time, :value);"""

__SQL_INSERT_AIRPRESSURE_ROW__ = """INSERT INTO `airpressure` (
    `time`, `value`) VALUES (:time, :value);"""

__SQL_DELETE_GPS_ROW__ = """DELETE FROM `gpsdata` WHERE `id`=?"""


class DatabaseBuffer:
    def __init__(self):
        """ create a database connection to a SQLite database
            init needed Tables
         """
        try:
            self.db_conn = sqlite3.connect("db/databuffer.db", check_same_thread=False)
        except Error as e:
            logger.error(e)

        #create needed tables
        self.create_table(__SQL_CREATE_GPS_TABLE__)
        self.create_table(__SQL_CREATE_AIRPRESSURE_TABLE__)
        self.create_table(__SQL_CREATE_TEMP_OUTDOOR_TABLE__)
        self.create_table(__SQL_CREATE_HUMID_OUTDOOR_TABLE__)

        logger.info("Database Buffer init successful")

    def create_table(self, create_table_sql: str):
        """ create a table from the create_table_sql statement
        :param create_table_sql: a CREATE TABLE statement
        :return:
        """
        try:
            c = self.db_conn.cursor()
            c.execute(create_table_sql)
        except Error as e:
            logger.error(e)
    pass

    def db_sql_operation(self, insert_row_sql: str, data):
        cursor = self.db_conn.cursor()
        cursor.execute(insert_row_sql, data)
        lastrowid = cursor.lastrowid
        cursor.close()
        return lastrowid

    def add_gps_data(self, data):
        return self.db_sql_operation(__SQL_INSERT_GPS_ROW__, data)

    def add_humidity_outdoor_data(self, data):
        return self.db_sql_operation(__SQL_INSERT_HUMID_OUTDOOR_ROW__, data)

    def add_temperature_outdoor_data(self, data):
        return self.db_sql_operation(__SQL_INSERT_TEMP_OUTDOOR_ROW__, data)

    def add_airpressure_data(self, data):
        return self.db_sql_operation(__SQL_INSERT_AIRPRESSURE_ROW__, data)

    def remove_gps_data_(self, row_id):
        return self.db_sql_operation(__SQL_DELETE_GPS_ROW__, (row_id, ))

