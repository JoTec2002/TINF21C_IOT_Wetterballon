'use client'
import Dashboard from "@/components/menu/dashboard";
import ChooseFlight from "@/components/menu/chooseFlight";
import ChooseBalloon from "@/components/menu/chooseBalloon";
import {useGlobalContext} from "@/components/globalProvider";

const Main = () => {
    const {balloonId, flightId} = useGlobalContext()
    return (
        <>
            { balloonId === -1 || balloonId === undefined ?
                <ChooseBalloon />
                : flightId === -1 || flightId === undefined ?
                    <ChooseFlight />
                : <Dashboard />}
        </>
    );
}

export default Main;