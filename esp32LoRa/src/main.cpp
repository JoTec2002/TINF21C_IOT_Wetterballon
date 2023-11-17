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

/* Prepares the payload of the frame */
static void prepareTxFrame( uint8_t port )
{
    /*appData size is LORAWAN_APP_DATA_MAX_SIZE which is defined in "commissioning.h".
    *appDataSize max value is LORAWAN_APP_DATA_MAX_SIZE.
    *if enabled AT, don't modify LORAWAN_APP_DATA_MAX_SIZE, it may cause system hanging or failure.
    *if disabled AT, LORAWAN_APP_DATA_MAX_SIZE can be modified, the max value is reference to lorawan region and SF.
    *for example, if use REGION_CN470,
    *the max value for different DR can be found in MaxPayloadOfDatarateCN470 refer to DataratesCN470 and BandwidthsCN470 in "RegionCN470.h".
    */

    //TODO: Set appData[] to the Data I Wanna send
    appDataSize = 4;
    appData[0] = 0x00;
    appData[1] = 0x01;
    appData[2] = 0x02;
    appData[3] = 0x03;
}

RTC_DATA_ATTR bool firstrun = true;

float parseValues(const byte data[]){
    union float_tag{
        byte b[4];
        float fval;
    }ft{};

    ft.b[0] =data[0];
    ft.b[1] = data[1];
    ft.b[2] = data[2];
    ft.b[3] = data[3];

    //Serial.print("value: ");
    //Serial.println(ft.fval);
    return ft.fval;
}

//Sensor Values
float longitude = 0;
float latitude = 0;
float altitude = 0;

int cmd = 0;
void onIicRecive(int iicCount){
    /*  I2C Address Map
     *  0x1.    Range for Data Request
     *  0x2.    Range for Recieve Data
     *  0x3.    Commands
     *
     *  0x21    GPS Data Longitude
     *  0x22    GPS Data Latitude
     *  0x23    Altitude
     *
     *  0x31    Send GPS Data
     */
    Serial.print("iicCount: ");
    Serial.println(iicCount);

    cmd = Wire1.read();
    Serial.print("CMD: ");
    Serial.println(cmd);


    float data_value = 0;
    if(iicCount == 5){
        byte temp[4] = "";
        for (int i = 0; i < 4; i++) {
            temp[i] = Wire1.read();
        }
        data_value = parseValues(temp);
    }

    if (cmd == 0x21){
        longitude = data_value;
    } else if(cmd == 0x22){
        latitude = data_value;
    } else if(cmd == 0x23){
        altitude = data_value;
    }

    if (cmd == 0x31){
        Serial.print("Saved Data: ");
        Serial.print(longitude);
        Serial.print(" ");
        Serial.print(latitude);
        Serial.print(" ");
        Serial.println(altitude);
        Serial.println("Send GPS Data");
    }




}
void onIicRequest(){
    Serial.println("IIC Request");
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

    /*custom further Setup here*/
    //IIC inity
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
            break;
        }
        case DEVICE_STATE_SEND:
        {
            LoRaWAN.displaySending();
            //Tx Frame already prepared ad this point in future by onIicRecieve
            prepareTxFrame( appPort );
            LoRaWAN.send();
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
