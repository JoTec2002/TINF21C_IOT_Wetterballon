import time

from picamera2 import Picamera2

picam2 = Picamera2()

capture_config = picam2.create_still_configuration(main={"size": (1296, 972)})
picam2.configure(capture_config)

picam2.start()

# Give time for Aec and Awb to settle, before disabling them
time.sleep(1)
picam2.set_controls({"AeEnable": False, "AwbEnable": False, "FrameRate": 1.0})
# And wait for those settings to take effect
time.sleep(1)

start_time = time.time()
for i in range(1, 5):
    r = picam2.capture_request()
    r.save("main", f"image{i}.jpg")
    r.release()
    print(f"Captured image {i} of 50 at {time.time() - start_time:.2f}s")


picam2.stop()