import RecipeTemplate from "../Templates/RecipeTemplate.js";
import Api from "./../api/api.js";

class App {
    constructor() {
        this.allData = null;
        this.allRecipeNames = null;
        this.allApliances = null;
        this.allIngredients = null;

        this.$recipeContainer = document.querySelector("#recipes-container");

    }

    async init() {
        await this.getData().then(() => {
            this.renderRecipes();
        })
    }

    async getData() {
        const api = new Api("data/recipes.json");
        this.allData = await api.getJsonData();
        console.log("allData: ");
        console.log(this.allData);
        this.allRecipeNames = this.retrieveData("name", false);
        this.allApliances = this.retrieveData("appliance", true);
        this.allIngredients = this.retrieveIngredients();
    }

    renderRecipes() {
        this.allData.forEach(element => {
            const Template = new RecipeTemplate(element);
            this.$recipeContainer.appendChild(Template.renderRecipe());
        });
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