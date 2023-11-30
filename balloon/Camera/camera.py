from threading import Thread
import time

from loguru import logger
from picamera2 import Picamera2


class Camera:
    def __init__(self, communication):
        self.picam2 = Picamera2()
        self.count = 0

        capture_config = self.picam2.create_still_configuration(main={"size": (1296, 972)})
        self.picam2.configure(capture_config)

        self.picam2.start()

        # Give time for Aec and Awb to settle, before disabling them
        time.sleep(1)
        self.picam2.set_controls({"AeEnable": False, "AwbEnable": False, "FrameRate": 1})
        # And wait for those settings to take effect
        time.sleep(1)

        save_img_thread = Thread(target=self.save_image, args=(communication, ))
        save_img_thread.start()

    def save_image(self, communication):
        logger.info("Camera running")
        while True:
            time_start = time.time_ns()
            r = self.picam2.capture_request()
            cameraPath = f"Camera/images/image{self.count}.jpg"
            r.save("main", cameraPath)
            r.release()
            communication.send_picture(cameraPath)
            # (target=communication.send_picture, args=(cameraPath,))
            self.count += 1

            # sleep so that sensor values are read every 30 seconds
            time_run = (time.time_ns() - time_start) / 1_000_000_000
            time_to_sleep = 30 - time_run
            if time_to_sleep > 0:
                time.sleep(time_to_sleep)

    def get_image(self):
        return self.picam2.capture_image("main")
