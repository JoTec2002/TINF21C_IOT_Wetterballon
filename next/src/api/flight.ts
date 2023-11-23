'use client'
import axios from "axios";
import {Flight} from "@/types/flight";

export const getFlights = async (balloonId: Number) => {

    const imageData : Flight[] = (await axios.get("/api/flight", {headers: {"id": balloonId.toString()}})).data
    return imageData;
}

export const createFlight = async (balloonId: Number) => {
    const res = await axios.post("/api/flight", {headers: {"balloonId": balloonId.toString()}})
    return res.status === 200;
}

export const endFlight = async (flightId: Number) => {
    const res = await axios.post("/api/flight", {},{headers: {"flightId": flightId.toString()}})
    return res.status === 200;
}