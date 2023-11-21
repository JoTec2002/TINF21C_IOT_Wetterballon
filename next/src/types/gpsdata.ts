export type Gpsdata  = {
    time:Date
    source:String
    satellites:number | null
    speed:number | null
    course: number | null
    altitude:   number
    longitude:  number
    latitude:  number
}