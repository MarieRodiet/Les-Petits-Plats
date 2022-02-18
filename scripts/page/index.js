import ListTemplate from "../Templates/listTemplate.js";
import RecipeTemplate from "../Templates/RecipeTemplate.js";
import Api from "./../api/api.js";

class App {
    constructor() {
        //private data variables
        this._allData = null;
        this._allRecipeNames = null;
        this._allAppliances = null;
        this._allIngredients = null;

        //DOM elements
        this.$mainInput = document.querySelector("#main-input");
        this.$ingredientInput = document.querySelector("#input-ingredients");
        this.$ingredientsList = document.querySelector("#ingredients-list");
        this.$recipeContainer = document.querySelector("#recipes-container");
        this.$ingredientsNav = document.querySelector("#ingredients-nav");
        this.$ingredientsBtn = document.querySelector("#ingredients-btn");

    }

    async init() {
        await this.getData().then(() => {
            this.renderRecipes(this._allData);
        })
        this.handleMainInput();
        this.handleIngredientInput();
    }

    async getData() {
        const API = new Api("data/recipes.json");
        this._allData = await API.getJsonData();
        console.log("allData: ");
        console.log(this._allData);
        this._allRecipeNames = this.getDataChunk("name", false);
        this._allAppliances = this.getDataChunk("appliance", true);
        this._allIngredients = this.getIngredients();
        console.log(this._allIngredients);
    }

    renderRecipes(recipes) {
        this.$recipeContainer.innerHTML = "";
        recipes.forEach(element => {
            const TEMPLATE = new RecipeTemplate(element);
            this.$recipeContainer.appendChild(TEMPLATE.renderRecipe());
        });
    }

    handleMainInput() {
        let events = ["keyup", "change", "Backspace"];
        events.forEach((element) => {
            this.$mainInput.addEventListener(element, (event) => {
                let input = event.target.value;
                let filtered = [];
                if (input.length >= 3 || input.length > 0 && event.key === "Backspace") {
                    const regex = new RegExp(input);
                    this._allData.filter((element) => {
                        if (regex.test(element.name.toLowerCase())) {
                            filtered.push(element);
                        }
                        else if (regex.test(element.description.toLowerCase())) {
                            filtered.push(element);
                        }
                        else if (this.findIngredient(element.ingredients, regex)) {
                            filtered.push(element);
                        }
                        this.renderRecipes(filtered);
                    });
                }
            })
        })
    }

    //returns if ingredient matches the regex
    findIngredient(ingredientsArray, regex) {
        let isFound = false;
        let ingredientsNames = [];
        for (let i = 0; i < ingredientsArray.length; i++) {
            ingredientsNames.push(ingredientsArray[i].ingredient.toLowerCase());
        }
        for (let i = 0; i < ingredientsNames.length; i++) {
            if (regex.test(ingredientsNames[i])) {
                isFound = true;
            }
        }
        return isFound;
    }

    handleIngredientInput() {
        //create dropdown, and its functionality
        let Template = new ListTemplate(this._allIngredients);
        Template.handleUlElement();
        this.$ingredientsNav.appendChild(Template.getList());
    }

    getDataChunk(type, isDouble) {
        //creer regex avec les caracteres differents
        let result = this._allData.map(element => element[type]);
        if (isDouble) {
            let unique = result.filter((c, index) => {
                return result.indexOf(c) === index;
            })
            result = unique;
        }
        return result;
    }

    getIngredients() {
        const ingredientsArray = this.getDataChunk("ingredients", false);
        let ingredients = [];
        ingredientsArray.map(element =>
            element.forEach(val => ingredients.push(val.ingredient)));
        let unique = ingredients.filter((element, index) => {
            return ingredients.indexOf(element) === index;
        })
        return unique.sort((a, b) => {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });
    }
}

const app = new App();
app.init();