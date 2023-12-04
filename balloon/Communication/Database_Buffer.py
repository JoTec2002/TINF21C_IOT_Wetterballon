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
  `latitude` double NOT NULL
)"""

__SQL_CREATE_TEMP_PRESSURE_HUMIDITY_OUTDOOR_TABLE__ = """
CREATE TABLE IF NOT EXISTS `temp_pressure_humidity_outdoor` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `time` datetime(3) NOT NULL,
  `temperature` double NOT NULL,
  `humidity` double NOT NULL,
  `airpressure` double NOT NULL
)"""

__SQL_CREATE_TEMP_HUMIDITY_INDOOR_TABLE__ = """
CREATE TABLE IF NOT EXISTS `temp_humidity_indoor` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `time` datetime(3) NOT NULL,
  `temperature` double NOT NULL,
  `humidity` double NOT NULL
)"""

__SQL_INSERT_GPS_ROW__ = """INSERT INTO `gpsdata` (
        `time`, `satellites`, `speed`, `course`, `altitude`, `longitude`, `latitude`)
         VALUES (:time, :satellites, :speed, :course, :altitude, :longitude, :latitude);"""

__SQL_INSERT_TEMP_PRESSURE_HUMIDITY_OUTDOOR_ROW__ = """INSERT INTO `temp_pressure_humidity_outdoor` (
    `time`, `temperature`, `humidity`,  `airpressure`) VALUES (:time, :temperature, :humidity, :pressure);"""

__SQL_INSERT_TEMP_HUMIDITY_INDOOR_ROW__ = """INSERT INTO `temp_humidity_indoor` (
    `time`, `temperature`, `humidity`) VALUES (:time, :temperature, :humidity);"""

__SQL_DELETE_GPS_ROW__ = """DELETE FROM `gpsdata` WHERE `id`=?"""

__SQL_DELETE_TEMP_PRESSURE_HUMIDITY_OUTDOOR_ROW__ = """DELETE FROM `temp_pressure_humidity_outdoor` WHERE `id`=?"""

__SQL_DELETE_TEMP_HUMIDITY_INDOOR_ROW__ = """DELETE FROM `temp_humidity_indoor` WHERE `id`=?"""


class DatabaseBuffer:
    def __init__(self):
        """ create a database connection to a SQLite database
            init needed Tables
         """
        try:
            self.db_conn = sqlite3.connect("db/databuffer.db", check_same_thread=False)
        except Error as e:
            logger.error(e)

        # create needed tables
        self.create_table(__SQL_CREATE_GPS_TABLE__)
        self.create_table(__SQL_CREATE_TEMP_PRESSURE_HUMIDITY_OUTDOOR_TABLE__)
        self.create_table(__SQL_CREATE_TEMP_HUMIDITY_INDOOR_TABLE__)

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

    # GPS
    def add_gps_data(self, data):
        return self.db_sql_operation(__SQL_INSERT_GPS_ROW__, data)

    def remove_gps_data(self, row_id):
        return self.db_sql_operation(__SQL_DELETE_GPS_ROW__, (row_id,))

    # temp_pressure_humidity_outdoor (BME 280)
    def add_temp_pressure_humidity_outdoor_data(self, data):
        return self.db_sql_operation(__SQL_INSERT_TEMP_PRESSURE_HUMIDITY_OUTDOOR_ROW__, data)

    def remove_temp_pressure_humidity_outdoor_data(self, row_id):
        return self.db_sql_operation(__SQL_DELETE_TEMP_PRESSURE_HUMIDITY_OUTDOOR_ROW__, (row_id,))

    # temp_humidity_indoor (SMT40)
    def add_temp_humidity_indoor_data(self, data):
        return self.db_sql_operation(__SQL_INSERT_TEMP_HUMIDITY_INDOOR_ROW__, data)

    def remove_temp_humidity_indoor_data(self, row_id):
        return self.db_sql_operation(__SQL_DELETE_TEMP_HUMIDITY_INDOOR_ROW__  , (row_id,))
