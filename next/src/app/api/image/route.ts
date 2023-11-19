import {NextRequest} from "next/server";
import {prisma} from "@/db/db";

export async function GET(req: NextRequest) {
    try {
        const imageId = parseInt(String(req.headers.get("imageid")));

        const image = await  prisma.image.findFirst({where: {id: imageId}});

        return Response.json(image)
    } catch (error) {
        console.error('Fehler bei der Verarbeitung der POST-Anfrage:', error);
        return new Response( 'Fehler bei der Verarbeitung der Anfrage', {status : 500});
    }
}