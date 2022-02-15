import RecipeTemplate from "../Templates/RecipeTemplate.js";
import Api from "./../api/api.js";

class App {
    constructor() {
        this.allData = null;
        this.allRecipeNames = null;
        this.allApliances = null;
        this.allIngredients = null;
        this.$mainInput = document.querySelector("#main-input");
        this.$ingredientInput = document.querySelector("#input-ingredients");
        this.$ingredientsList = document.querySelector("#ingredients-list");

        this.$recipeContainer = document.querySelector("#recipes-container");

    }

    async init() {
        this.handleMainInput();
        this.handleIngredientInput();
        await this.getData().then(() => {
            this.renderRecipes(this.allData);
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
        console.log(this.allIngredients);
    }

    renderRecipes(recipes) {
        this.$recipeContainer.innerHTML = "";
        recipes.forEach(element => {
            const Template = new RecipeTemplate(element);
            this.$recipeContainer.appendChild(Template.renderRecipe());
        });
    }

    handleMainInput() {
        let events = ["keydown", "change"];
        events.forEach((element) => {
            this.$mainInput.addEventListener(element, (event) => {
                let input = event.target.value;
                let filtered = [];
                if (input.length >= 2) {
                    console.log("find recipe");
                    this.allData.filter((element) => {
                        if ((element.name.toLowerCase()).includes(input.toLowerCase()) === true) {
                            filtered.push(element);
                        }
                        if ((element.description.toLowerCase()).includes(input.toLowerCase()) === true) {
                            filtered.push(element);
                        }

                        if ((element.ingredients[0].ingredient.toLowerCase()).includes(input.toLowerCase()) === true) {
                            console.log("similar ingredient");
                            console.log(element.ingredients[0].ingredient);
                        }
                        this.renderRecipes(filtered);
                    });
                }
                if (event.key === "Backspace") {
                    this.allData.filter((element) => {
                        if ((element.name.toLowerCase()).includes(input.toLowerCase()) === true) {
                            filtered.push(element);
                        }
                        if ((element.description.toLowerCase()).includes(input.toLowerCase()) === true) {
                            filtered.push(element);
                        }
                        this.renderRecipes(filtered);
                    });
                }
            })
        })
    }

    handleIngredientInput() {
        let events = ["keydown", "change"];
        events.forEach((element) => {
            this.$ingredientInput.addEventListener(element, (event) => {
                let input = event.target.value;
                console.log("you clicked, or changed or pressed a key down" + input);
            })
        })
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
        const ingredientsArray = this.retrieveData("ingredients", false);
        let ingredients = [];
        ingredientsArray.map(element =>
            element.forEach(val => ingredients.push(val.ingredient)));
        let unique = ingredients.filter((element, index) => {
            return ingredients.indexOf(element) === index;
        })
        return unique;
    }
}

const app = new App();
app.init();