import serial
import os, time

#value for changed posotion
change = 0.2
#infos about the last send values
lastSendLat = 0.0
lastSendLong = 0.0
lastSendAlt = 0.0
lastSendTimeStamp = 0.0

#current values (not needed)
lat =0.0
long = 0.0
alt = 0.0
timeStamp = 0.0

#resets the GPS Modul via AT Command
def reset():
    port.flush
    port.write(str.encode('AT+CGPSRST=1'+'\r\n'))
    pass

#Activates the GPS Module
def setPWRtoGPS():
    print("PWR")
    port.flush()
    port.write(str.encode('AT+CGPSPWR=1'+'\r\n'))
    time.sleep(1)
    pass

#recieves the current GPS state of the GPS module
def getLocationParams():
    port.write(str.encode('AT+CGPSINF=0'+'\r\n'))
    "port.write(str.encode('AT+CGPSSTATUS'+'\r\n'))"
    print("INF")
    time.sleep(5)
    rcv="EMPTY"
    if port.inWaiting()>0:
        rcv = port.read(port.inWaiting())
    else:
        print("no data to read")
    return str(rcv)

#decodes the recieved GPS value to an array, that only includes longitude, latitude, altitude and the current UTC timestamp and returns the array
def decodeAnswer(_answer):
    print (_answer)
    if _answer.count('OK') == 1:
        tmp = _answer[_answer.find('+CGPSINF: ')+10:]
        tmp = tmp.split(',')
        return tmp[1:5]
    else:
        "raise ValueError"
        time.sleep(0.1)

#checks wheater the location has changed
def locationChanged():
    global long, lat, alt, lastSendLong, lastSendLat, lastSendAlt, change
    print("Long: " + str(long) + "Last: " + str(lastSendLong) + "change: " + str(change))
    if (long < (lastSendLong -change)) or (long > (lastSendLong + change)):
        print("long changed")
        return True
    elif (lat < (lastSendLat - change)) or (lat > (lastSendLat + change)):
        print("lat changed")
        return True
    elif (alt <(lastSendAlt - change)) or (alt > (lastSendAlt + change)):
        print("alt changed")
        return True
    else:
        print("nothing changed")
        return False

#the current "main" function of the GPS method to test its functionality
def GPSmain():
    global long, lat, alt, timeStamp, lastSendLong, lastSendLat, lastSendAlt, lastSendTimeStamp
    port.read(port.inWaiting())
    port.write(str.encode('AT+CGPSPWR?'+'\r\n'))
    time.sleep(5)
    tmp = str(port.read(port.inWaiting()))
    print (tmp)
    tmp = str(tmp).find('CGPSPWR: 1')
    print (tmp)
    if tmp != -1:
        erg= decodeAnswer(getLocationParams())
    else:
        setPWRtoGPS()
        port.read(port.inWaiting())
        #pruefung ob GPS Value existiert fehlt noch
        #in while schleife pruefen, fehlt so auch oben, vielleicht in die getLocationParams einbauen
        print('setPower')
        time.sleep(30)
        erg= decodeAnswer(getLocationParams())
    long = float(erg[0])
    lat = float(erg[1])
    alt = float(erg[2])
    timeStamp = float(erg[3])
#    print (erg) #only for testing
    print ("Long " + str(long))
    print ("Lat: " + str(lat))
    print ("Alt: " + str(alt))

    _tmp = locationChanged()
    print(_tmp)
    if _tmp:
        print("Location has changed")
        lastSendLong = long
        lastSendLat = lat
        lastSendAlt = alt
        lastSendTimeStamp = timeStamp
        #Neuen Standort senden
    else:
        #pruefen auf zeit seit letzem senden und ggf. senden wiederholen um zu vermeiden, dass eine Stoerung nicht erkannt wird
        print("Location has not changed")

try:
    print("START")
    port = serial.Serial(port='/dev/ttyS0', baudrate=115200, timeout=1, xonxoff=True, exclusive=True)
    print("OPEN")
    port.write(str.encode('AT'+'\r\n'))
    print("WRITE")
    time.sleep(0.5)
    print(port.read(10))
    print("START-2")
    while(1):
        m = input("1 pwr oder 2 gps 3 reset 4 decodedString")
        print(m)
        if m == '1':
            setPWRtoGPS()
        elif m == '2':
            print(getLocationParams())
        elif m == '3':
            reset()
        elif m == '4':
            GPSmain()
        else:
            print("ERROR__")

except KeyboardInterrupt:
    port.close()
    print("End")