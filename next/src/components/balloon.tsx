import React from "react";

export class Balloon {
    name = "";
    apiKey = null;

    constructor(name: string, apiKey: any) {
        this.name = name;
        this.apiKey = apiKey;
    }
}