import {ImageObj} from "@/types/image";
import {getImage} from "@/api/image";
import {useEffect, useState} from "react";
import {Modal} from "flowbite-react";
import Image from "next/image";


const Imageview = ({images}: { images: ImageObj[] }) => {

    const [isVisible, setIsVisible] = useState(false);
    const [imageBase64, setImageBase64]  = useState('');
    const[imageId, setImageId] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false);




    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };




    useEffect(() => {
        const openImage = async () => {
            if(imageId !== 0)
            {
                const imageData = await getImage(imageId)
                if(imageData !== null){
                    setImageBase64(imageData.base64Image === undefined ? '': imageData.base64Image.toString());
                    setIsVisible(true);
                }
            }
        }
        openImage()

    }, [imageId]);

    const listItems = isExpanded
        ? images.map((image) => (
        <li key={image.id}>
            <button className={"hover:text-blue-400"} key={image.id} onClick={(e) => {setImageId(image.id)}}>{"Bild: " + image.id + " - Datum: " + image.time}</button>
        </li>
    ))
        : images.slice(0, 10).map((image, index) =>
        <li key={image.id}>
            <button className={"hover:text-blue-400"} key={image.id} onClick={(e) => {setImageId(image.id)}}>{"Bild: " + image.id + " - Datum: " + image.time}</button>
        </li>)

    return (
        <>
            <h1 className={"text-2xl font-bold text-blue-800 mb-0.5 mt-6 underline"}>Vorhandene Bilder:</h1>
            <ol> {listItems} </ol>
            {images.length > 10 && !isExpanded && <button className={"bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"} onClick={handleExpand}>Show all </button>}
            {isExpanded && <button className={"bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"} onClick={handleExpand}>Hide </button>}
            <Modal show={isVisible} onClose={() => {setIsVisible(false); setImageId(0)}}>
                <Modal.Header>Bild:</Modal.Header>
                <Modal.Body>
                    <Image
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
