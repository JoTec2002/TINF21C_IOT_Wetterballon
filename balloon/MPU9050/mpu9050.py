import time
from threading import Thread

import imufusion
import numpy
from loguru import logger

t0 = time.time()
start_bool = False  # boolean for connection
while (time.time() - t0) < 5:  # wait for 5-sec to connect to IMU
    try:
        from MPU9050.mpu9250_i2c import *

        start_bool = True  # True for forthcoming loop
        break
    except:
        continue


class MPU9050:
    def __init__(self):
        if not start_bool:  # make sure the IMU was started
            logger.error("IMU not Started, Check Wiring")  # check wiring if error
            return
        self.last_euler_axis = numpy.array([0, 0, 0])
        Thread(target=self.ahrs_function).start()

    def ahrs_function(self):
        sample_rate = 100  # 100 Hz

        # Instantiate algorithms
        offset = imufusion.Offset(sample_rate)
        ahrs = imufusion.Ahrs()

        ahrs.settings = imufusion.Settings(imufusion.CONVENTION_NWU,  # convention
                                           0.5,  # gain
                                           2000,  # gyroscope range
                                           10,  # acceleration rejection
                                           10,  # magnetic rejection
                                           5 * sample_rate)  # recovery trigger period = 5 seconds

        time_last_start = time.time_ns()
        while True:
            time_start = time.time_ns()
            current_data = self.read_position_data()
            current_data["gyro"] = offset.update(numpy.array(current_data["gyro"]))
            ahrs.update(numpy.array(current_data["gyro"]),
                        numpy.array(current_data["accel"]),
                        numpy.array(current_data["magnet"]),
                        (time_start - time_last_start))

            self.last_euler_axis = ahrs.quaternion.to_euler()

            # calc sleep time
            time_run = (time.time_ns() - time_start) / 1_000_000_000
            time_to_sleep = 0.01 - time_run
            if time_to_sleep > 0:
                time.sleep(time_to_sleep)
            else:
                # logger.warning("MPU9050 AHRS runtime to long")
                pass

    def read_position_data(self):
        try:
            ax, ay, az, wx, wy, wz = mpu6050_conv()  # read and convert mpu6050 data
            mx, my, mz = AK8963_conv()  # read and convert AK8963 magnetometer data

            return {"accel": [ax, ay, az], "gyro": [wx, wy, wz], "magnet": [mx, my, mz]}
        except Exception as e:
            print(e)
            pass
        # Exception("failed to read data")
        return False
