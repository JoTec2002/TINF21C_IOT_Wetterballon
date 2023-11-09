import {Gpsdata} from "@/types/gpsdata";
import {ValueObj} from "@/types/valueObj";

export type Messure = {
    airpressure: ValueObj[],
    gpsdata : Gpsdata[],
    humidity_indoor: ValueObj[],
    humidity_outdoor: ValueObj[],
    temperature_indoor: ValueObj[],
    temperature_outdoor: ValueObj[],
}