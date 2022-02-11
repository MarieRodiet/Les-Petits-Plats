import Api from "./../api/api.js";

class App {
    constructor() {
        this.allData = null;
        this.allRecipeNames = null;
        this.allApliances = null;
        this.allIngredients = null;


    }

    async init() {
        await this.getData();
    }

    async getData() {
        const api = new Api("data/recipes.json");
        this.allData = await api.getJsonData();
        console.log("allData: ");
        console.log(this.allData);
        this.allRecipeNames = this.retrieveData("name", false);
        console.log("allRecipeNames: ");
        console.log(this.allRecipeNames);
        this.allApliances = this.retrieveData("appliance", true);
        console.log("allAppliances: ");
        console.log(this.allApliances);
        this.allIngredients = this.retrieveIngredients();
        console.log("allIngredients: ");
        console.log(this.allIngredients);



    }

    retrieveData(type, removeDouble) {
        let result = this.allData.map(element => element[type]);
        if (removeDouble) {
            let unique = result.filter((c, index) => {
                return result.indexOf(c) === index;
            })
            result = unique;
        }
        return result;
    }

    retrieveIngredients() {
        let result = this.allData.map((element) => element["ingredients"][0]["ingredient"]);
        return result;
    }
}

const app = new App();
app.init();