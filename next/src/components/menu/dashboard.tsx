'use client'
import {useGlobalContext} from "@/components/globalProvider";
import {useEffect, useState} from "react";
import {Messure} from "@/types/messure";
import {getMessure} from "@/api/messure";

import dynamic from "next/dynamic";
import HeightTime from "@/components/charts/HeightTime";
import TempTime from "@/components/charts/TempTime";


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
                Gewählter Ballon: {balloonId}
                <br/>
                Gewählter Flug: {flightId}
                <br/>
                <br/>
                Flugdaten:
                <br/>
                GPS-Anzahl: {messure.gpsdata.length}
                <br/>
                <h1>Map mit gemessenen Positionen</h1>
                <BalloonMap locations={messure.gpsdata} />
                <br/>
                <h1>Graphen zu den gemessenen Werten:</h1>
                <div id={"chart-view"} className={"grid grid-cols-1 w-3/4 ml-[10%] mt-5"}>
                    <HeightTime locations={messure.gpsdata} />
                    <TempTime tempIndoor={messure.temperature_indoor} tempOutdoor={messure.temperature_outdoor} />
                </div>
            </>)


    )
}

export default Dashboard;