"use client"
import {MapContainer, Marker, Polyline, Popup, TileLayer} from "react-leaflet";
import { Gpsdata } from "@/types/gpsdata";
import {parseClockTime, parseDate} from "@/helpers/DateToString";

const BalloonMap = ({locations}: { locations:Gpsdata[] }) => {
  return (
      <MapContainer
          id="map"
          center={[locations[0].latitude, locations[0].longitude]}
          zoom={13}
          scrollWheelZoom={true}
      >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location, index) => (
            <Marker key={index} position={[location.latitude, location.longitude]}>
              <Popup>
                <b>Datum:   {parseDate(new Date(location.time.toString()))}</b> <br/>
                <b>Uhrzeit: {parseClockTime(new Date(location.time.toString()))}</b> <br/>
                <b>Satteliten: {location.satellites}</b> <br/>
                <b>Kurs: {location.course}</b> <br/>
                <b>Geschwindigkeit: {location.speed}</b> <br/>
                <b>Höhe: {location.altitude}</b> <br/>
                <b>Latitude: {location.latitude}</b> <br/>
                <b>Longitude: {location.longitude}</b> <br/>
                <b>Modul: {location.source == 'api' ? 'Mobilfunk' : 'LoraModul'}</b>
                </Popup>
            </Marker>
        ))}
        <Polyline
            positions={locations.map((location) => [location.latitude, location.longitude])}
        />
      </MapContainer>
  );
};

export default BalloonMap;