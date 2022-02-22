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
        this._allUstensils = null;
        this._allBadges = [];

        //DOM elements
        this.$mainInput = document.querySelector("#main-input");
        this.$recipeContainer = document.querySelector("#recipes-container");
        this.$badges = document.querySelector("#badges");

        this.$ingredientsNav = document.querySelector("#ingredients-nav");
        this.$equipmentsNav = document.querySelector("#equipments-nav");
        this.$ustensilsNav = document.querySelector("#ustensils-nav");

        this.$ingredientsBtn = document.querySelector("#ingredients-btn");
        this.$equipmentsBtn = document.querySelector("#equipments-btn");
        this.$ustensilsBtn = document.querySelector("#ustensils-btn");


    }

    async init() {
        await this.getData().then(() => {
            this.renderRecipes(this._allData);
        })
        this.handleMainInput();
        this.handleIngredientInput();
        this.handleEquipmentInput();
        this.handleUstensilsInput();
    }

    async getData() {
        const API = new Api("data/recipes.json");
        this._allData = await API.getJsonData();
        this._allRecipeNames = this.getDataChunk("name", false);
        this._allAppliances = this.getDataChunk("appliance", true);
        this._allUstensils = this.getUstensils();
        this._allIngredients = this.getIngredients();
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
        return this.sortAlphabetically(result);
    }

    getUstensils() {
        const ustensilsArray = this.getDataChunk("ustensils", true).flat()
        let ustensils = ustensilsArray.map(element =>
            element[0].toUpperCase() + element.slice(1).toLowerCase());
        let unique = ustensils.filter((element, index) => {
            return ustensils.indexOf(element) === index;
        })
        return this.sortAlphabetically(unique);
    }

    getIngredients() {
        const ingredientsArray = this.getDataChunk("ingredients", false);
        let ingredients = [];
        ingredientsArray.map(element =>
            element.forEach(val => {
                ingredients.push(val.ingredient[0].toUpperCase() + val.ingredient.slice(1).toLowerCase())
            }
            ));
        let unique = ingredients.filter((element, index) => {
            let withoutS = "";
            //element finishes with an s
            if (element[element.length - 1] === "s") {
                withoutS = element.slice(0, element.length - 1);
                //if there is a duplicate found, remove that duplicate from array
                if (ingredients.indexOf(withoutS) !== -1) {
                    ingredients.splice(ingredients.indexOf(withoutS), 1);
                    return ingredients.indexOf(element) === index;
                }
            }
            //element does not finish with an s
            else if (element[element.length - 1] !== "s") {
                //if there is a duplicate found, remove that duplicate from array
                if (ingredients.indexOf(element + "s") !== -1) {
                    ingredients.splice(ingredients.indexOf(element + "s"), 1);
                    return ingredients.indexOf(element) === index;
                }
            }
            //ingredients that finish
            return ingredients.indexOf(element) === index;
        });
        return this.sortAlphabetically(unique);
    }

    sortAlphabetically(array) {
        return array.sort((a, b) => {
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });
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

    //returns true ingredient matches the regex
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
        let Template = new ListTemplate(this._allIngredients, "#ingredients-btn", "#ingredients-nav", "ingredients");
        Template.handleUlElement();
        this.$ingredientsNav.appendChild(Template.getList());
        this.$ingredientsNav.addEventListener("click", () => {
            let result = Template.updateAllBadgeData();
            console.log(result);
            this.addBadge("ingredients", result);
            console.log(this._allBadges);
        })
    }

    addBadge(category, badgeInfo) {
        //if this._allBadges === 0, add the badge
        console.log(category);
        let action = badgeInfo[0];
        let currentBadge = badgeInfo[1];
        if (action === "ADD") {
            this._allBadges.push(currentBadge);
        }

    }

    handleEquipmentInput() {
        let Template = new ListTemplate(this._allAppliances, "#equipments-btn", "#equipments-nav", "equipments");
        Template.handleUlElement(this.$equipmentsBtn);
        this.$equipmentsNav.appendChild(Template.getList());
        /*this.$equipmentsNav.addEventListener("click", () => {
            let result = Template.updateAllBadgeData();
            console.log(result);
            this.getCurrentBadges("equipments", result);
            console.log(this._allBadges);
        })*/
    }

    handleUstensilsInput() {
        let Template = new ListTemplate(this._allUstensils, "#ustensils-btn", "#ustensils-nav", "ustensils");
        Template.handleUlElement(this.$ustensilsBtn);
        this.$ustensilsNav.appendChild(Template.getList());

    }


    //let filtered = [];
    //this._allBadges.push()
    //loop through allBadges
    /*
            if (this._allBadges.length === 0) {
            this._allBadges.push(badge);
        }
        else {
            //if this._allBadges contains the badge, remove it
            //if this._allBadges does not contain the badge, add it
            for (let b of this._allBadges) {
                if (b.category === category && b.item === badge.item) {
                    console.log("let's remove it since we already have it");
                }
                else if (b !== badge) {
                    console.log("let's add it since we can't find it");
                    this._allBadges.push(badge);
                }
            }
        }
        
        if (this._allBadges.length === 0) {
        this._allBadges.push(badge);
        console.log("we add a badge when this._allBadges is empty and action is ADD. RESULT: ");
        console.log(this._allBadges);
    }
    else {
        console.log("this._allBadges is not empty");
    }
    for (let badge of this._allBadges) {
        if (badge === undefined) {
            this._allBadges.push(badge);
            console.log("you are adding the first badge");
        }
        else if (badge.category === category) {
            console.log("there is already a badge and here it's his category")
        }
    }*/

    //let badges = this.$badges.querySelectorAll(".badgeContainer .badge");
    /*
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

    });*/


}

const app = new App();
app.init();