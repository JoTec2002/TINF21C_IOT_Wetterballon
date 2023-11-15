import {NextRequest} from "next/server";
import {prisma} from "@/db/db";

export async function POST(req: NextRequest) {
    try {
        const body = await req.body;

        return Response.json("")
    } catch (error) {
        console.error('Fehler bei der Verarbeitung der POST-Anfrage:', error);
        return new Response( 'Fehler bei der Verarbeitung der Anfrage', {status : 500});
    }
}