"use client";
import {MapContainer, Marker, Polyline, Popup, TileLayer,} from "react-leaflet";
import axios from "axios";
import {Messure} from "@/types/messure";
import { Gpsdata } from "@/types/gpsdata";

const getGPSData = async () => {
  const locData: Messure = (await axios.get("/api/messure", {headers: {"flightid": "2"}})).data
  return locData.gpsdata;
}

const parseDate = (value: Date) => {
  return value.getDay().toString() + '.' + value.getMonth().toString() + '.' + value.getFullYear().toString()
}

const parseClockTime = (value: Date) => {
  return value.getHours().toString() + ':' + value.getMinutes().toString() + ':' + value.getSeconds().toString()
}

// eslint-disable-next-line @next/next/no-async-client-component
const LeafletMap = async () => {
  let locations: Gpsdata[] = [];
  locations = await getGPSData();

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

export default LeafletMap;
