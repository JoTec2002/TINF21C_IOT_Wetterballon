import {prisma} from "@/db/db";
import {Messure} from "@/types/messure";
import {NextRequest} from "next/server";
import {ValueObj} from "@/types/valueObj";
import {HeightValueObj} from "@/types/heightValueObj";
import {Gpsdata} from "@/types/gpsdata";
import {it} from "node:test";

export async function GET(req: NextRequest) {
    try {
        const flightid = parseInt(String(req.headers.get("flightid")));

        const gps = await prisma.gpsdata.findMany({where : { flightId : flightid}})
        const airpressure = await prisma.airpressure.findMany({where : { flightId : flightid}})
        const temp_indoor = await prisma.temperatureIndoor.findMany({where : { flightId : flightid}})
        const temp_outdoor = await prisma.temperatureOutdoor.findMany({where : { flightId : flightid}})
        const hum_indoor = await prisma.humidityIndoor.findMany({where : { flightId : flightid}})
        const hum_outdoor = await prisma.humidityOutdoor.findMany({where : { flightId : flightid}})

        const data : Messure = {
            gpsdata : gps,
            airpressure : airpressure,
            height_airpressure : MatchOnHeight(airpressure, gps),
            temperature_indoor : temp_indoor,
            height_temperature_indoor : MatchOnHeight(temp_indoor, gps),
            temperature_outdoor : temp_outdoor,
            height_temperature_outdoor : MatchOnHeight(temp_outdoor, gps),
            humidity_indoor :  hum_indoor,
            height_humidity_indoor : MatchOnHeight(hum_indoor, gps),
            humidity_outdoor : hum_outdoor,
            height_humidity_outdoor : MatchOnHeight(hum_outdoor, gps),
            image : await prisma.image.findMany({where: {flightId : flightid}, select : {id: true, time : true, source : true, base64Image: false}})
        }
        return Response.json(data)
    } catch (error) {
        console.error('Fehler bei der Verarbeitung der POST-Anfrage:', error);
        return new Response( 'Fehler bei der Verarbeitung der Anfrage', {status : 500});
    }
}

function MatchOnHeight(value : ValueObj[], gps : Gpsdata[]) : HeightValueObj[] {
    const ret : HeightValueObj[] = [];

    gps.map((item) => {
        const t1 =new Date(item.time)
        const find = value.find((v) => {
            const t2 = new Date(v.time)
            return (t1.getDate() == t2.getDate() && t1.getHours() == t2.getHours() && t1.getMinutes() == t2.getMinutes())
        })

        if(find !== undefined){
            ret.push({time : item.time, source: '', height : item.altitude, value : find.value})
        }
    })


    return ret;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        // Get balloon
        const balloonApiKey = String(req.headers.get("apikey"))

        if(balloonApiKey === null){
            return Response.json({error:'Apikey in header not found'}, {status : 404});
        }


        const balloon    = await prisma.ballon.findFirst({
            where : {
                apikey : balloonApiKey
            },
        })

        if(balloon === null){
            return Response.json({error:'No ballon for apikey found'}, {status : 404});
        }

        let flight = await prisma.flight.findFirst(
            {
                where : {
                    ballonId : balloon!.id,
                    end : null
                },

            }
        )

        if(flight === null){
             flight = await prisma.flight.create({
                data: {
                    ballonId: balloon!.id,
                    begin:  new Date(),
                }
            });

             flight = await prisma.flight.findFirst(
                {
                    where : {
                        ballonId : balloon!.id,
                        end : null
                    },

                }
            )
        }


        if (body.gpsdata !== undefined) {
            await prisma.gpsdata.create({data: {
                    flightId : flight!.id,
                    time : new Date(String(body.gpsdata.time)),
                    source : 'api',
                    satellites : parseInt(String(body.gpsdata.satellites)),
                    speed : parseFloat(String(body.gpsdata.speed)),
                    course : parseFloat(String(body.gpsdata.course)),
                    altitude : parseFloat(String(body.gpsdata.altitude)),
                    longitude : parseFloat(String(body.gpsdata.longitude)),
                    latitude: parseFloat(String(body.gpsdata.latitude))
                }
            })
        }

        if (body.airpressure !== undefined) {
            await prisma.airpressure.create({data: {
                    flightId : flight!.id,
                    time : new Date(String(body.airpressure.time)),
                    source : 'api',
                    value : parseInt(String(body.airpressure.value))
                }})
        }

        if (body.humidity_indoor !== undefined) {
            await prisma.humidityIndoor.create({data: {
                    flightId : flight!.id,
                    time : new Date(String(body.humidity_indoor.time)),
                    source : 'api',
                    value : parseFloat(String(body.humidity_indoor.value))
                }})
        }

       if (body.humidity_outdoor !== undefined) {
            await prisma.humidityOutdoor.create({data: {
                    flightId : flight!.id,
                    time : new Date(String(body.humidity_outdoor.time)),
                    source : 'api',
                    value : parseFloat(String(body.humidity_outdoor.value))
                }})
        }

        if (body.temperature_indoor !== undefined) {
            await prisma.temperatureIndoor.create({data: {
                    flightId : flight!.id,
                    time : new Date(String(body.temperature_indoor.time)),
                    source : 'api',
                    value : parseFloat(String(body.temperature_indoor.value))
                }})
        }

        if (body.temperature_outdoor !== undefined) {
            await prisma.temperatureOutdoor.create({data: {
                    flightId : flight!.id,
                    time : new Date(String(body.temperature_outdoor.time)),
                    source : 'api',
                    value : parseFloat(String(body.temperature_outdoor.value))
                }})
        }

        if(body.image !== undefined){
            await prisma.image.create({data: {
                    flightId : flight!.id,
                    source : 'api',
                    time : new Date(String(body.image.time)),
                    base64Image : String(body.image.base64Image)
                }})
        }

        return Response.json({}, {status : 200});
    } catch (error) {
        console.error('Fehler bei der Verarbeitung der POST-Anfrage:', error);
        return Response.json({error:'Fehler bei der Verarbeitung der POST-Anfrage:'}, {status : 404});
    }
}
