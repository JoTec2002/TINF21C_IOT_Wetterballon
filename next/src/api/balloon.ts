'use Client';

import axios from "axios";
import {Balloon} from "@/types/ballon";

export const getBalloons = async () => {
    const locData: Balloon[] = (await axios.get("/api/ballon")).data
    return locData;
}

export const createBallon = async (name: String) => {
    const locData: { apiKey : String } = (await axios.post("/api/ballon",  {'name': name})).data
    return locData.apiKey;
}