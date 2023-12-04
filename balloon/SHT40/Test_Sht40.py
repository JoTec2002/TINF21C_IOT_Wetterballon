
from sht40 import SHT4x


sensor = SHT4x()


if sensor.reset():
    print("Sensor reset successful.")
else:
    print("Failed to reset the sensor.")


sensor.mode = "high"


if sensor.update():
    temperature = sensor.temperature
    humidity = sensor.humidity
    print(f"Temperature: {temperature}°C")
    print(f"Humidity: {humidity}% RH")
else:
    print("Failed to read data from the sensor.")