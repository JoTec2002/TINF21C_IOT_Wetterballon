from threading import Thread
import time
from picamera2 import Picamera2

class Camera:
    def __init__(self):
        self.picam2 = Picamera2()
        self.count=1

        capture_config = self.picam2.create_still_configuration(main={"size": (1296, 972)})
        self.picam2.configure(capture_config)

        self.picam2.start()

        # Give time for Aec and Awb to settle, before disabling them
        time.sleep(1)
        self.picam2.set_controls({"AeEnable": False, "AwbEnable": False, "FrameRate": 0.5})
        # And wait for those settings to take effect
        time.sleep(1)

        save_img_thread = Thread(target=self.save_image)
        save_img_thread.start()

    def save_image(self):
        while True:
            r = self.picam2.capture_request()
            r.save("main", f"Camera/images/image{self.count}.jpg")
            r.release()
            self.count += 1

    def get_image(self):
        return self.picam2.capture_image("main")

