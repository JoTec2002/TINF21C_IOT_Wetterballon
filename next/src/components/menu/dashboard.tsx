'use client'
import {useGlobalContext} from "@/components/globalProvider";
import {useEffect, useState} from "react";
import {Messure} from "@/types/messure";
import {getMessure} from "@/api/messure";

import dynamic from "next/dynamic";
import HeightChart from "@/components/HeightChart";
const BalloonMap = dynamic(() => import("@/components/BalloonMap"), {
    loading: () => <p>loading...</p>,
    ssr: false
})

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
                <HeightChart locations={messure.gpsdata} />
            </>)


    )
}

export default Dashboard;