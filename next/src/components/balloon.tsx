export class Balloon {
    name = "";
    id = 0;
    apiKey = null;

    constructor(name: string, id: number, apiKey: any) {
        this.name = name;
        this.id = id;
        this.apiKey = apiKey;
    }
}