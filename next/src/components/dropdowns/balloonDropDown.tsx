'use Client';
import {useGlobalContext} from "@/components/globalProvider";
import {useEffect, useState} from "react";
import {Balloon} from "@/types/ballon";
import {createBallon, getBalloons} from "@/api/balloon";
import {Dropdown, Modal, Button, Label, TextInput} from "flowbite-react";

const BalloonDropDown = () => {
    const {balloonId, setBalloonId, setFlightId} = useGlobalContext()
    const [balloons, setBalloons]  = useState<Balloon[]>([]);

    const [openModal, setOpenModal] = useState(false);
    const [balloonName, setBalloonName] = useState("");
    const [apikey, setApiKey] = useState("");

    useEffect(() => {
        const fetchBalloons = async () => {
            const data = await getBalloons();
            setBalloons(data);
        };

        fetchBalloons();
    }, []);


    return (
        <>

        <Dropdown label={balloonId === -1 ? "Ballon wählen" : "Ballon: " + balloons.filter(x => x.id === balloonId)[0].name} dismissOnClick={true}>
            {
                balloons.map((x) => (
                    <Dropdown.Item key={x.id.toString()} onClick={() => {
                        setBalloonId(parseInt(x.id.toString()))
                        setFlightId(-1)
                    }}>{x.name}</Dropdown.Item>
                ))
            }
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => {
                setOpenModal(true)
            }}>
                Neuen Ballon hinzufügen
            </Dropdown.Item>
        </Dropdown>

            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>Neuen Ballon anlegen:</Modal.Header>
                <Modal.Body>
                    <div className="mb-2 block">
                        <Label htmlFor="base" value="Name des Ballons:" />
                    </div>
                    <TextInput id="base" type="text" sizing="md" value={balloonName} onChange={(event) => (setBalloonName(event.target.value))} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {
                        setOpenModal(false);
                        const create = async () => {
                            const key = await createBallon(balloonName);
                            setApiKey(key.toString());
                            const data = await getBalloons();
                            setBalloons(data);
                            setBalloonName("");
                        };
                        create()
                    }} disabled={balloonName.length === 0}>Anlegen</Button>
                    <Button color="gray" onClick={() => setOpenModal(false)}>
                        Abbrechen
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={apikey !== ""} onClose={() => setApiKey("")}>
                <Modal.Header>Apikey:</Modal.Header>
                <Modal.Body>
                    Der Apikey für Anfragen lautet: {apikey}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setApiKey("")}>Ok</Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}

export default BalloonDropDown;