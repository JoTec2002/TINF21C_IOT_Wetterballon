import time
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
