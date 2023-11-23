import { type NextRequest } from 'next/server'
import {prisma} from "@/db/db";
import {headers} from "next/headers";


export async function GET(req: NextRequest) {

    try {
        const ballonId = parseInt(String(req.headers.get("id")));

        const data = await prisma.flight.findMany({
            where : {
                ballonId : ballonId
            },
            select : {
                id : true,
                begin : true,
                end: true
            }
        })
        return Response.json(data);
    } catch (error) {
        console.error('Fehler bei der Verarbeitung der POST-Anfrage:', error);
        return Response.json({error:'Fehler bei der Verarbeitung der Anfrage'}, {status : 500});
    }
}



export async function POST(req: NextRequest) {
    try {
        const flightString = String(req.headers.get('flightId'));
        if (flightString !== null) {
            const flightId: number = parseInt(flightString);
            const flight = await prisma.flight.update({
                where: {
                    id: flightId
                },
                data: {
                    end: new Date()
                }
            })

            return Response.json({'message': 'Flight closed', 'flight': flight}, {status: 200})
        } else {
            const balloonId = parseInt(String(req.headers.get('balloonId')));

            const flights = await prisma.flight.updateMany({
                where: {
                    ballonId: balloonId,
                    end : null
                },
                data : {
                    end: new Date()
                }
            })

            const flight = await prisma.flight.create({
                data: {
                    ballonId: balloonId,
                    begin:  new Date(),
                }
            });
            return Response.json({id: flight.id}, {status: 200})
        }


    } catch (error) {
        console.error('Fehler bei der Verarbeitung der POST-Anfrage:', error);
        return Response.json({error:'Fehler bei der Verarbeitung der Anfrage'}, {status : 500});
    }
}