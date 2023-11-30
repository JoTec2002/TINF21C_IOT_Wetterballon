import {ImageObj} from "@/types/image";
import {getImage} from "@/api/image";
import {useEffect, useState} from "react";
import Image from "next/image";
import {createBallon, getBalloons} from "@/api/balloon";
import {Button, Label, Modal, TextInput} from "flowbite-react";


const Imageview = ({images}: { images: ImageObj[] }) => {

    const [isVisible, setIsVisible] = useState(false);
    const [imageBase64, setImageBase64]  = useState('');
    const[imageId, setImageId] = useState(0)






    useEffect(() => {
        const openImage = async () => {
            if(imageId !== 0)
            {
                const imageData = await getImage(imageId)
                if(imageData !== null){
                    setImageBase64(imageData.base64Image === null ? '': imageData.base64Image.toString());
                    setIsVisible(true);
                }
            }
        }
        openImage()

    }, [imageId]);

    return (
        <>
            <h1 className={"text-2xl font-bold text-blue-800 mb-0.5 mt-6 underline"}>Vorhandene Bilder:</h1>
            <li >
                {
                    images.map((image) => (
                        <li key={image.id}>
                            <button className={"hover:text-blue-400"} key={image.id} onClick={(e) => {setImageId(image.id)}}>{"Bild: " + image.id + " - Datum: " + image.time}</button>
                        </li>
                    ))
                }
            </li>
            <Modal show={isVisible} onClose={() => setIsVisible(false)}>
                <Modal.Header>Bild:</Modal.Header>
                <Modal.Body>
                    <img
                        src={`data:image/jpeg;base64,${imageBase64}`}
                        alt={"Image from RaspberryPi Camera"}
                        width={500}
                        height={200}
                        hidden={!isVisible}
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Imageview;
