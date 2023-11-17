"use client";
import axios from "axios";
import {ImageObj} from "@/types/image";

export const getImage = async (imageId: Number) => {
    const imageData : ImageObj = (await axios.get("/api/image", {headers: {"imageid": imageId.toString()}})).data
    return imageData;
}