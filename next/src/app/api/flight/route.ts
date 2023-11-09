import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from "@/db/db";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest) {

    try {
        const ballonId = parseInt(String(req.headers.get("apikey")));

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
        return new Response( 'Fehler bei der Verarbeitung der Anfrage', {status : 500});
    }
}



export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const balloonId = parseInt(String(body.apikey));

        if ('flightId' in body) {
            const flightId: number = JSON.parse(body.flightId);

            prisma.flight.update({
                where: {
                    id: flightId
                },
                data: {
                    end: new Date(String(body.end))
                }
            })

            return Response
        } else {
            const flight = await prisma.flight.create({
                data: {
                    ballonId: balloonId,
                    begin: new Date(String(body.begin)),
                }
            });
            return Response.json({id: flight.id})
        }


    } catch (error) {
        console.error('Fehler bei der Verarbeitung der POST-Anfrage:', error);
        return new Response( 'Fehler bei der Verarbeitung der Anfrage', {status : 500});
    }
}