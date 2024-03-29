'use client'
import {Button, Dropdown} from "flowbite-react";
import {useGlobalContext} from "@/components/globalProvider";
import {useEffect, useState} from "react";
import {Flight} from "@/types/flight";
import {endFlight, getFlights} from "@/api/flight";
import {DateToString} from "@/helpers/DateToString";

const FlightDropDown = () => {
    const {balloonId,flightId, setFlightId, setBalloonId} = useGlobalContext()
    const [flights, setFlights]  = useState<Flight[]>([]);

    useEffect(() => {
        const fetchBalloons = async () => {
            const data = await getFlights(balloonId);
            setFlights(data);
        };

        fetchBalloons();
    }, [balloonId]);



    return (
        <>
            <Dropdown label={flightId === -1 || balloonId === -1 ? "Flug wählen" : "Flug: " + flights === undefined || flights.filter(x => x.id === flightId)[0] === undefined ? "Flug wählen" : DateToString(flights.filter(x => x.id === flightId)[0].begin) } dismissOnClick={true}>
                {
                    flights.map((x) => (
                        <Dropdown.Item key={x.id.toString()} onClick={() => {
                            setFlightId(parseInt(x.id.toString()));

                        }}>
                            {x.id.toString()}: {DateToString(x.begin)}
                        </Dropdown.Item>
                    ))
                }
            </Dropdown>
            {
                flightId !== -1 && flights.filter(x => x.id === flightId)[0].end === null ? <>
                    <Button color="failure" onClick={() => {endFlight(flightId);
                        const cacheBallon = balloonId;
                        const cacheFight = flightId;
                        setBalloonId(-1);
                        setFlightId(-1);
                        }}>Flug beenden</Button>
                </> : <>
                </>
            }
        </>

    )
}

export default FlightDropDown;