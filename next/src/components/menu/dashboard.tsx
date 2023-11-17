import {useGlobalContext} from "@/components/globalProvider";
import {useEffect, useState} from "react";
import {Messure} from "@/types/messure";
import {getMessure} from "@/api/messure";
import BalloonMap from "@/components/BalloonMap";

const Dashboard = () => {
    const {balloonId, flightId} = useGlobalContext()
    const [messure, setMessure]  = useState<Messure>();
    useEffect(() => {
        const fetchBalloons = async () => {
            const data = await getMessure(flightId);
            setMessure(data);
        };

        fetchBalloons();
    }, [flightId]);

    return (
        (messure === undefined ?
           <>Daten werden geladen</>
            :
            <>
                Gewählter Ballon: {balloonId} <br/>
                Gewählter Flug: {flightId} <br/>
                <br/>
                Flugdaten: <br/>
                GPS-Anzahl: {messure.gpsdata.length}<br/>
                <BalloonMap locations={messure.gpsdata} />
            </>)


    )
}

export default Dashboard;