'use client'
import {Dropdown} from "flowbite-react";
import {useGlobalContext} from "@/components/globalProvider";
import {useEffect, useState} from "react";
import {Flight} from "@/types/flight";
import {getFlights} from "@/api/flight";
import {DateToString} from "@/helpers/DateToString";

const FlightDropDown = () => {
    const {balloonId,flightId, setFlightId} = useGlobalContext()
    const [flights, setFlights]  = useState<Flight[]>([]);

    useEffect(() => {
        const fetchBalloons = async () => {
            const data = await getFlights(balloonId);
            setFlights(data);
        };

        fetchBalloons();
    }, [balloonId]);


    return (
        <Dropdown label={flightId === -1 || balloonId === -1 ? "Flug wählen" : "Flug: " + flights === undefined || flights.filter(x => x.id === flightId)[0] === undefined ? "Flug wählen" : DateToString(flights.filter(x => x.id === flightId)[0].begin) } dismissOnClick={true}>
            {
                flights.map((x) => (
                    <Dropdown.Item key={x.id.toString()} onClick={() => (setFlightId(parseInt(x.id.toString())))}>
                        {x.id.toString()}: {DateToString(x.begin)}
                    </Dropdown.Item>
                ))
            }
        </Dropdown>
    )
}

export default FlightDropDown;