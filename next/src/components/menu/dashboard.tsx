'use client'
import {useGlobalContext} from "@/components/globalProvider";
import {useEffect, useState} from "react";
import {Messure} from "@/types/messure";
import {getMessure} from "@/api/messure";
import dynamic from "next/dynamic";
import HeightTime from "@/components/charts/Time/HeightTime";
import TempTime from "@/components/charts/Time/TempTime";
import HumidityTime from "@/components/charts/Time/HumidityTime";
import PressureTime from "@/components/charts/Time/PressureTime";
import HumidityHeight from "@/components/charts/Height/HumidityHeightInside";
import PressureHeight from "@/components/charts/Height/PressureHeight";
import TempHeightInside from "@/components/charts/Height/TempHeightInside";
import TempHeightOutside from "@/components/charts/Height/TempHeightOutside";
import HumidityHeightInside from "@/components/charts/Height/HumidityHeightInside";
import HumidityHeightOutside from "@/components/charts/Height/HumidityHeightOutside";


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
                <BalloonMap locations={messure.gpsdata} />
                <br/>
                <div id={"chart-view"} className={"content-center"}>
                    <div className={"grid grid-cols-1"}>
                        <h1 className={"text-2xl font-bold text-blue-800 mb-0.5 mt-6 underline"}>Messwerte im Bezug zu Zeit:</h1>
                        <HeightTime locations={messure.gpsdata} />
                        <TempTime tempIndoor={messure.temperature_indoor} tempOutdoor={messure.temperature_outdoor} />
                        <HumidityTime humIndoor={messure.humidity_indoor} humOutdoor={messure.humidity_outdoor} />
                        <PressureTime pressures={messure.airpressure} />
                    </div>
                    <h1 className={"text-2xl font-bold text-blue-800 mb-0.5 mt-6 underline"}>Messwerte im Bezug zu Höhe:</h1>
                    <div className={"grid grid-cols-2"}>
                        <TempHeightInside tempIndoor={messure.height_temperature_indoor} />
                        <TempHeightOutside tempOutdoor={messure.height_temperature_outdoor} />

                        <HumidityHeightInside humIndoor={messure.height_humidity_indoor} />
                        <HumidityHeightOutside humOutdoor={messure.height_humidity_outdoor} />

                        <PressureHeight measures={messure.height_airpressure} />
                    </div>
                </div>
            </>)
    )
};

export default Dashboard;