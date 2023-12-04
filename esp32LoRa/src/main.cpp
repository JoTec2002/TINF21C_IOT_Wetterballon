#include "Arduino.h"
#include "LoRaWan_APP.h"
#include <Wire.h>

/* OTAA para*/
uint8_t devEui[] = { 0x70, 0xB3, 0xD5, 0x7E, 0xD0, 0x06, 0x23, 0x9C };
uint8_t appEui[] = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
uint8_t appKey[] = { 0xDA, 0x11, 0x3C, 0x31, 0x78, 0xEC, 0x6E, 0x97, 0x53, 0x27, 0x9F, 0x95, 0x13, 0x6E, 0x05, 0x9A };

/*LoraWan channelsmask*/
uint16_t userChannelsMask[6]={ 0x00FF,0x0000,0x0000,0x0000,0x0000,0x0000 };

/*LoraWan region, select in arduino IDE tools*/
LoRaMacRegion_t loraWanRegion = ACTIVE_REGION;

/*LoraWan Class, Class A and Class C are supported*/
DeviceClass_t  loraWanClass = CLASS_A;

/*the application data transmission duty cycle.  value in [ms].*/
uint32_t appTxDutyCycle = 15000;

/*OTAA or ABP*/
bool overTheAirActivation = true;

/*ADR enable*/
bool loraWanAdr = true;

/* Indicates if the node is sending confirmed or unconfirmed messages */
bool isTxConfirmed = true;

/* Application port */
uint8_t appPort = 2;
/*!
* Number of trials to transmit the frame, if the LoRaMAC layer did not
* receive an acknowledgment. The MAC performs a datarate adaptation,
* according to the LoRaWAN Specification V1.0.2, chapter 18.4, according
* to the following table:
*
* Transmission nb | Data Rate
* ----------------|-----------
* 1 (first)       | DR
* 2               | DR
* 3               | max(DR-1,0)
* 4               | max(DR-1,0)
* 5               | max(DR-2,0)
* 6               | max(DR-2,0)
* 7               | max(DR-3,0)
* 8               | max(DR-3,0)
*
* Note, that if NbTrials is set to 1 or 2, the MAC will not decrease
* the datarate, in case the LoRaMAC layer did not receive an acknowledgment
*/
uint8_t confirmedNbTrials = 4;

RTC_DATA_ATTR bool firstrun = true;

int parseValue(const byte data[]){
    int val = data[2] + (data[1] << 8) + (data[0] << 16);

    //Serial.print("value: ");
    //Serial.println(val);
    return val;
}
enum customDeviceState
{
    JOIN,
    SEND,
    SLEEP
};
enum customDeviceState CustomDeviceState = JOIN;

int cmd = 0;
void onIicRecive(int iicCount){
    /*  I2C Address Map
     *  0x1.    Range for Data Request
     *  0x2.    Range for Recieve Data
     *
     */
    //Serial.print("iicCount: ");
    //Serial.println(iicCount);

    cmd = Wire1.read();
    Serial.print("CMD: ");
    Serial.println(cmd);

    byte data_bytes[30] = "";
    for (int i = 0; i < (iicCount-1); i++) {
        data_bytes[i] = Wire1.read();
    }

    Serial.print("Device State: ");
    switch (CustomDeviceState) {
        case JOIN:
            Serial.println("Join");
            break;
        case SEND:
            Serial.println("Send");
            break;
        case SLEEP:
            Serial.println("Sleep");
            break;
    }
    if (cmd == 0x20 && CustomDeviceState == SLEEP){
        Serial.println("Sending Data");
        appDataSize = 30;
        for (int i = 0; i < appDataSize; i++) {
            appData[i] = data_bytes[i];
        }

        CustomDeviceState = SEND;
        deviceState = DEVICE_STATE_SEND;

        return;
    } else{
        Serial.println("LoRa is not sleeping");
    }
}

void onIicRequest(){
    // Update Custom Device State
    // TODO check if functionality
    if (CustomDeviceState == JOIN && IsLoRaMacNetworkJoined){
        CustomDeviceState = SLEEP;
    }
    //Serial.println("IIC Request");
    switch (CustomDeviceState) {
        case JOIN:
            Wire1.write(0x01);
            break;
        case SEND:
            Wire1.write(0x02);
            break;
        case SLEEP:
            Wire1.write(0x03);
            break;
    }
}

void setup() {
    //Serial init
    Serial.begin(115200);

    //Lora init
    Mcu.begin();
    if(firstrun)
    {
        LoRaWAN.displayMcuInit();
        firstrun = false;
    }
    deviceState = DEVICE_STATE_INIT;

    //IIC init
    Wire1.begin(0x8, 21, 22, 100000);
    Wire1.onReceive(onIicRecive);
    Wire1.onRequest(onIicRequest);
}

void loop()
{
    switch( deviceState )
    {
        case DEVICE_STATE_INIT:
        {
#if(LORAWAN_DEVEUI_AUTO)
            LoRaWAN.generateDeveuiByChipID();
#endif
            LoRaWAN.init(loraWanClass,loraWanRegion);
            break;
        }
        case DEVICE_STATE_JOIN:
        {
            LoRaWAN.displayJoining();
            LoRaWAN.join();
            // Just inits Join and than enters Sleep state
            break;
        }
        case DEVICE_STATE_SEND:
        {
            LoRaWAN.displaySending();
            //Tx Frame already prepared ad this point in future by onIicRecieve
            //prepareTxFrame( appPort );
            LoRaWAN.send();
            CustomDeviceState = SLEEP;
            deviceState = DEVICE_STATE_SLEEP;
            break;
        }
        case DEVICE_STATE_CYCLE:
        {
            Serial.write("cycle");
            // Schedule next packet transmission
            txDutyCycleTime = appTxDutyCycle + randr( 0, APP_TX_DUTYCYCLE_RND );
            LoRaWAN.cycle(txDutyCycleTime);
            deviceState = DEVICE_STATE_SLEEP;
            break;
        }
        case DEVICE_STATE_SLEEP:
        {
            //TODO: Doensn't block thread -> i2c communication can run
            //Serial.write("sleep");
            LoRaWAN.displayAck();
            LoRaWAN.sleep(loraWanClass);
            break;
        }
        default:
        {
            deviceState = DEVICE_STATE_INIT;
            break;
        }
    }
}
