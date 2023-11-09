from Communication.DirectConnection import DirectConnection
from Communication.LoRaConnection import LoRaConnection


class Communication:
    def __init__(self, bus):
        # Define Communication stati
        self.directConnection = DirectConnection()
        self.loraConnection = LoRaConnection(bus)

        print(self.directConnection.status)
        print(self.loraConnection.status)



        pass

    pass