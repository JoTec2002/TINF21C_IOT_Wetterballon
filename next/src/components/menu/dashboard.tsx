'use client'
import {useGlobalContext} from "@/components/globalProvider";
import {useEffect, useState} from "react";
import {Messure} from "@/types/messure";
import {getMessure} from "@/api/messure";

import dynamic from "next/dynamic";
import HeightTime from "@/components/charts/Time/HeightTime";
import TempTime from "@/components/charts/Time/TempTime";
import HumidityTime from "@/components/charts/Time/HumidityTIme";
import PressureTime from "@/components/charts/Time/PressureTime";
import HumidityHeight from "@/components/charts/Height/HumidityHeight";
import PressureHeight from "@/components/charts/Height/PressureHeight";


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
                <h1 className={"text-2xl font-bold text-blue-800"}>Karte</h1>
                <BalloonMap locations={messure.gpsdata} />
                <br/>
                <h1 className={"text-2xl font-bold text-blue-800"}>Graphen zu den gemessenen Werten:</h1>
                <div id={"chart-view"} className={"w-7/8"}>
                    <div className={"grid grid-cols-1"}>
                        <h2 className={"text-2xl font-bold text-blue-800"}>Messwerte im Bezug zu Zeit:</h2>
                        <HeightTime locations={messure.gpsdata} />
                        <TempTime tempIndoor={messure.temperature_indoor} tempOutdoor={messure.temperature_outdoor} />
                        <HumidityTime humIndoor={messure.humidity_indoor} humOutdoor={messure.humidity_outdoor} />
                        <PressureTime pressures={messure.airpressure} />
                    </div>
                    <div className={"grid grid-cols-1"}>
                        <h2 className={"text-2xl font-bold text-blue-800"}>Messwerte im Bezug zu Höhe:</h2>
                        
                    </div>
                </div>
            </>)


    )
}

export default Dashboard;