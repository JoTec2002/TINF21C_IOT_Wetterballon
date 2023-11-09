import {prisma} from "@/db/db";
import {NextRequest} from "next/server";

export async function GET() {
    try {
        const data = await prisma.ballon.findMany({
            select : {
                id : true,
                name : true
            }
        })
        return Response.json(data)
    } catch (error) {
        console.error('Fehler bei der Verarbeitung der POST-Anfrage:', error);
        return new Response( 'Fehler bei der Verarbeitung der Anfrage', {status : 500});
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const ballon = await prisma.ballon.create({ data : {
                name : body.name,
                apikey : generateRandomString(20)
            }
        });
        return Response.json({apiKey: ballon.apikey})

    } catch (error) {
        console.error('Fehler bei der Verarbeitung der POST-Anfrage:', error);
        return new Response( 'Fehler bei der Verarbeitung der Anfrage', {status : 500});
    }
    return Response.json({ message : "aei" })
}

function generateRandomString(stringLength: number) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    for (let i = 0; i < stringLength; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset[randomIndex];
    }

    return randomString;
}