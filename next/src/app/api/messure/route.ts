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
        // Get ballon
        const balloonKey : String = JSON.parse(body.ballonId)
        const balloon    = await prisma.ballon.findFirst({
            where : {
                apikey : String(balloonKey)
            },
        })

        if(balloon === null){
            return new Response( 'Balloon not found', {status : 204});
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
            return new Response( 'Flight not found', {status : 204});
        }

        if ('gpsdata' in body) {
            const gpsdata : Gpsdata =  body.gpsdata.json();
            await prisma.gpsdata.create({data: {
                    flightId : flight.id,
                    time : gpsdata.time,
                    satellites : gpsdata.satellites,
                    speed : gpsdata.speed,
                    course : gpsdata.course,
                    altitude : gpsdata.altitude,
                    longitude : gpsdata.longitude,
                    latitude: gpsdata.latitude
                }
            })
        }

        if ('airpressure' in body) {
            const airpressure : ValueObj = body.airpressure.json();
            await prisma.airpressure.create({data: {
                    flightId : flight.id,
                    time : airpressure.time,
                    value : airpressure.value
                }})
        }

        if ('humidity_indoor' in body) {
            const humbidity: ValueObj = body.humidity_indoor.json();
            await prisma.humidityIndoor.create({data: {
                    flightId : flight.id,
                    time : humbidity.time,
                    value : humbidity.value
                }})
        }

        if ('humidity_outdoor' in body) {
            const humbidity: ValueObj = body.humidity_outdoor.json();
            await prisma.humidityOutdoor.create({data: {
                    flightId : flight.id,
                    time : humbidity.time,
                    value : humbidity.value
                }})
        }

        if ('temperature_indoor' in body) {
            const temperature: ValueObj = body.temperature_indoor.json();
            await prisma.temperatureIndoor.create({data: {
                    flightId : flight.id,
                    time : temperature.time,
                    value : temperature.value
                }})
        }

        if ('temperature_outdoor' in body) {
            const temperature: ValueObj = body.temperature_outdoor.json();
            await prisma.temperatureOutdoor.create({data: {
                    flightId : flight.id,
                    time : temperature.time,
                    value : temperature.value
                }})
        }
        return Response
    } catch (error) {
        console.error('Fehler bei der Verarbeitung der POST-Anfrage:', error);
        return new Response( 'Balloon not found', {status : 204});
    }
}
