"use client";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";

const LeafletMap = () => {
  let locations = [
    { name: "Paris", lat: 48.8566, lng: 2.3522 },
    { name: "Stuttgart", lat: 48.7758, lng: 9.1829 },
    { name: "Zürich", lat: 47.3786, lng: 8.54 },
    { name: "Bratislava", lat: 48.1447, lng: 17.1128 },
  ];

  return (
    <MapContainer
      id="map"
      center={[locations[0].lat, locations[0].lng]}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location, index) => (
        <Marker key={index} position={[location.lat, location.lng]}>
          <Popup>
            <b>{location.name}</b>
          </Popup>
        </Marker>
      ))}
      <Polyline
        positions={locations.map((location) => [location.lat, location.lng])}
      />
    </MapContainer>
  );
};

export default LeafletMap;
