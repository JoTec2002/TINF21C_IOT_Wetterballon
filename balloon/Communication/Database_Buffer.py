import sqlite3
from sqlite3 import Error

__SQL_CREATE_GPS_TABLE__ = """CREATE TABLE IF NOT EXISTS `gpsdata` (
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

__SQL_INSERT_GPS_ROW__ = """INSERT INTO `gpsdata` (
        `time`, `satellites`, `speed`, `course`, `altitude`, `longitude`, `latitude`)
         VALUES (:time, :satellites, :speed, :course, :altitude, :longitude, :latitude);"""

class DatabaseBuffer:
    def __init__(self):
        """ create a database connection to a SQLite database
            init needed Tables
         """
        try:
            self.db_conn = sqlite3.connect("db/databuffer.db", check_same_thread=False)
            print(sqlite3.version)
        except Error as e:
            print(e)

        #create needed tables
        self.create_table(__SQL_CREATE_GPS_TABLE__)

    def create_table(self, create_table_sql: str):
        """ create a table from the create_table_sql statement
        :param create_table_sql: a CREATE TABLE statement
        :return:
        """
        try:
            c = self.db_conn.cursor()
            c.execute(create_table_sql)
        except Error as e:
            print(e)
    pass

    def add_gps_data(self, data):
        cursor = self.db_conn.cursor()
        cursor.execute(__SQL_INSERT_GPS_ROW__, data)
        self.db_conn.commit()
        return cursor.lastrowid
