import {ImageObj} from "@/types/image";
import {useEffect, useState} from "react";
import {getImage} from "@/api/image";
import {Carousel, Spinner} from "flowbite-react";
import Image from "next/image";

const ImageGallery = ({images}: { images: ImageObj[] }) => {

    const [showedImage, setShowedImage] = useState(0)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        console.log('show image ' + showedImage)
        const openImage = async (numb: number) => {
            console.log('Check image' + numb)
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

    return (
        <>
            {
                images.length === 0 ? <>Keine Bilder vorhanden </> :/* */
                <div className="h-80 w-80 sm:h-96 sm:w-96 xl:h-96 xl:w-96 2xl:h-96 2xl:w-96">
                        {
                            images.length === 0 ? <>Keine Bilder vorhanden</> :
                                !loaded ? <Spinner /> :
                                    <Carousel onSlideChange={ (x) => (setShowedImage(x))} pauseOnHover>
                                        {
                                            images.map((image, index) => (
                                                <Image  key={image.id}
                                                        src={`data:image/jpeg;base64,${image.base64Image}`}
                                                        alt={"Image from RaspberryPi Camera"}
                                                        width={500}
                                                        height={200}
                                                />
                                            ))
                                        }
                                    </Carousel>
                        }
                    </div>
            }


        </>
    )
}

export default ImageGallery;