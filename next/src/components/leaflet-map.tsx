'use client'
import {MapContainer, Marker, Popup, TileLayer, useMap} from 'react-leaflet'
import dynamic from "next/dynamic";


const centerCoords: any = [48.7758, 9.1829]

const LeafletMap = () => {
    return (

            <MapContainer id="map" center={centerCoords} zoom={10} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={centerCoords}>
                    <Popup>
                        Stuttgart Mitte
                    </Popup>
                </Marker>
            </MapContainer>

        )
}


export default LeafletMap;