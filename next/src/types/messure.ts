import {Gpsdata} from "@/types/gpsdata";
import {ValueObj} from "@/types/valueObj";
import {ImageObj} from "@/types/image";
import {HeightValueObj} from "@/types/heightValueObj";

export type Messure = {
    gpsdata : Gpsdata[],
    airpressure: ValueObj[],
    height_airpressure: HeightValueObj[],
    humidity_indoor: ValueObj[],
    height_humidity_indoor:  HeightValueObj[],
    humidity_outdoor: ValueObj[],
    height_humidity_outdoor: HeightValueObj[],
    temperature_indoor: ValueObj[],
    height_temperature_indoor: HeightValueObj[],
    temperature_outdoor: ValueObj[],
    height_temperature_outdoor: HeightValueObj[],
    image : ImageObj[]
}