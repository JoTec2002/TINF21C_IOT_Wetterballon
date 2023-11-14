'use client'
import {MapContainer, Marker, Polyline, Popup, TileLayer} from 'react-leaflet'


const locations = [
    {name: "CENTER", lat: 48.7758, lng:  9.1829},
    {name: "LOCATION_1", lat: 48.8312, lng: 10.1829},
    {name: "LOCATION_2", lat: 48.9804, lng: 11.1829},
];

const LeafletMap = () => {
    return (
            <MapContainer id="map" center={[locations[0].lat, locations[0].lng]} zoom={13} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((location, index) => (
                    <Marker key={index} position={[location.lat, location.lng]}>
                        <Popup><b>{location.name}</b></Popup>
                    </Marker>
                ))}
                <Polyline positions={locations.map(location => [location.lat, location.lng])} />




            </MapContainer>

        )
}


export default LeafletMap;