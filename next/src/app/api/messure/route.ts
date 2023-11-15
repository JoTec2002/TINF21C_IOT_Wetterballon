import {prisma} from "@/db/db";
import {Gpsdata} from "@/types/gpsdata";
import {ValueObj} from "@/types/valueObj";
import {Messure} from "@/types/messure";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest) {
    try {
        const flightid = parseInt(String(req.headers.get("flightid")));

        const data : Messure = {
            gpsdata : await prisma.gpsdata.findMany({where : { flightId : flightid}}),
            airpressure : await prisma.airpressure.findMany({where : { flightId : flightid}}),
            temperature_indoor : await prisma.temperatureIndoor.findMany({where : { flightId : flightid}}),
            temperature_outdoor : await prisma.temperatureOutdoor.findMany({where : { flightId : flightid}}),
            humidity_indoor : await prisma.humidityIndoor.findMany({where : { flightId : flightid}}),
            humidity_outdoor : await prisma.temperatureOutdoor.findMany({where : { flightId : flightid}}),
            image : await prisma.image.findMany({where: {flightId : flightid}, select : {id: true, time : true}})
        }
        return Response.json(data)
    } catch (error) {
        console.error('Fehler bei der Verarbeitung der POST-Anfrage:', error);
        return new Response( 'Fehler bei der Verarbeitung der Anfrage', {status : 500});
    }
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

        const flight = await prisma.flight.findFirst(
            {
                where : {
                    ballonId : balloon!.id,
                    end : null
                },

            }
        )

        if(flight === null){
            return Response.json({error:'Not flight found'}, {status : 404});
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
