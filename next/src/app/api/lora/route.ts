import {NextRequest} from "next/server";
import {prisma} from "@/db/db";

export async function POST(req: NextRequest) {
    try {

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

        const body = await req.json();

        if(body.decoded_payload !== undefined)
        {
            if(body.decoded_payload.GPS !== undefined) {
                await  prisma.gpsdata.create({data:{
                    flightId : flight!.id,
                    time : new Date(String(body.received_at)),
                    source : 'lora',
                    satellites: null,
                    speed: null,
                    course : null,
                    altitude : parseFloat(String(body.decoded_payload.GPS.altitude)),
                    longitude : parseFloat(String(body.decoded_payload.GPS.longitude)),
                    latitude: parseFloat(String(body.decoded_payload.GPS.latitude))
                }})
            }


            if (body.decoded_payload.airpressure !== undefined) {
                await prisma.airpressure.create({data: {
                        flightId : flight!.id,
                        time : new Date(String(body.received_at)),
                        source : 'lora',
                        value : parseInt(String(body.airpressure.value))
                    }})
            }

            if (body.decoded_payload.humidity_indoor !== undefined) {
                await prisma.humidityIndoor.create({data: {
                        flightId : flight!.id,
                        time : new Date(String(body.received_at)),
                        source : 'lora',
                        value : parseFloat(String(body.humidity_indoor.value))
                    }})
            }

            if (body.decoded_payload.humidity_outdoor !== undefined) {
                await prisma.humidityOutdoor.create({data: {
                        flightId : flight!.id,
                        time : new Date(String(body.received_at)),
                        source : 'lora',
                        value : parseFloat(String(body.humidity_outdoor.value))
                    }})
            }

            if (body.decoded_payload.temperature_indoor !== undefined) {
                await prisma.temperatureIndoor.create({data: {
                        flightId : flight!.id,
                        time : new Date(String(body.received_at)),
                        source : 'lora',
                        value : parseFloat(String(body.temperature_indoor.value))
                    }})
            }

            if (body.decoded_payload.temperature_outdoor !== undefined) {
                await prisma.temperatureOutdoor.create({data: {
                        flightId : flight!.id,
                        time : new Date(String(body.received_at)),
                        source : 'lora',
                        value : parseFloat(String(body.temperature_outdoor.value))
                    }})
            }

            if(body.image !== undefined){
                await prisma.image.create({data: {
                        flightId : flight!.id,
                        source : 'lora',
                        time : new Date(String(body.received_at)),
                        base64Image : String(body.image.base64Image)
                    }})
            }
        }

        return Response.json("")
    } catch (error) {
        console.error('Fehler bei der Verarbeitung der POST-Anfrage:', error);
        return new Response( 'Fehler bei der Verarbeitung der Anfrage', {status : 500});
    }
}