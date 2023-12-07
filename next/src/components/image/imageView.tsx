import {ImageObj} from "@/types/image";
import {getImage} from "@/api/image";
import {useEffect, useState} from "react";
import {Carousel, Modal, Spinner} from "flowbite-react";
import Image from "next/image";


const Imageview = ({images}: { images: ImageObj[] }) => {

    const [isVisible, setIsVisible] = useState(false);
    const [imageBase64, setImageBase64]  = useState('');
    const[imageId, setImageId] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false);

    const [showedImage, setShowedImage] = useState(0)
    const [loaded, setLoaded] = useState(false)


    useEffect(() => {
        const openImage = async (numb: number) => {
            /* current */
            if(images[numb].base64Image === undefined || images[numb].base64Image === '') {
                console.log('Load image' + numb)
                const imageData = await getImage(images[numb].id)
                if (imageData !== null) {
                    images[numb].base64Image = imageData.base64Image;
                }
            }
            setLoaded(true)
        }
        /* current */
        openImage(showedImage)

        /* after */
        openImage((showedImage + 1 >= images.length ? 0 : showedImage + 1))

        /* before */
        openImage((showedImage - 1 < 0 ? images.length -1 : showedImage - 1))
    }, [showedImage]);


    const handleExpand = () => {
        setIsExpanded(!isExpanded);
    };




    useEffect(() => {
        const openImage = async () => {

            if(imageId !== 0)
            {
                const img = images.find(x => x.id == imageId)
                if(img !== undefined ) {
                    if (img.base64Image === undefined || img.base64Image === '') {
                        const imageData = await getImage(imageId)
                        if (imageData !== null) {
                            setImageBase64(imageData.base64Image === undefined ? '' : imageData.base64Image.toString());
                            setIsVisible(true);
                        }
                    } else {
                        setImageBase64(img.base64Image.toString());
                        setIsVisible(true);
                    }
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
            <div className={"grid grid-cols-2 justify-items-center"}>
                <div>

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
                </div>
                <div>
                    {
                        images.length === 0 ? <>Keine Bilder vorhanden </> :/* */
                            <div className="h-80 w-80 sm:h-96 sm:w-96 xl:h-96 xl:w-96 2xl:h-96 2xl:w-96">
                                {
                                    images.length === 0 ? <>Keine Bilder vorhanden</> :
                                        !loaded ? <Spinner /> :
                                            <Carousel onSlideChange={ (x) => (setShowedImage(x))} pauseOnHover>
                                                {
                                                    images.map((image, index) => (
                                                        <div key={image.id}>
                                                            {
                                                                image.base64Image === undefined || image.base64Image === '' ? <>Fehler beim Laden des Bilds</>:
                                                                    <>
                                                                        <Image
                                                                            src={`data:image/jpeg;base64,${image.base64Image}`}
                                                                            alt={"Image from RaspberryPi Camera"}
                                                                            width={500}
                                                                            height={200}
                                                                        />
                                                                        <h1>{"Bild: " + image.id + " - Datum: " + image.time}</h1>
                                                                    </>
                                                                    }

                                                        </div>
                                                    ))
                                                }
                                            </Carousel>
                                }
                            </div>
                    }

                </div>
            </div>
        </>


    )
}

export default Imageview;
