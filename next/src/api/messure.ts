"use client";
import {Messure} from "@/types/messure";
import axios from "axios";

export const getMessure = async (flightId : number) => {
    const messures : Messure = (await axios.get("/api/messure", {headers: {"flightid": flightId.toString()}})).data
    return messures;
}