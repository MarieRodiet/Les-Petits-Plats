import Api from "./../api/api.js";

class App {
    constructor() {
        this.data = null;
        
    }

    async init() {
        const data = await this.getData();
        this.data = data;
        console.log(this.data);
    }

    async getData() {
        const api = new Api("data/recipes.json");
        const data = await api.getJsonData();
        return data;
    }
}

const app = new App();
app.init();