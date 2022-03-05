import ListTemplate from "../Templates/listTemplate.js";
import RecipeTemplate from "../Templates/RecipeTemplate.js";
import Api from "./../api/api.js";
import BadgeTemplate from "../Templates/BadgeTemplate.js";

class App {
    constructor() {
        //private data variables
        this._allRecipes = null;
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
        this.$AllNavs = [this.$ingredientsNav, this.$equipmentsNav, this.$ustensilsNav];

        this.$ingredientsInput = document.querySelector("#input-ingredients");
        this.$equipmentsInput = document.querySelector("#input-equipments");
        this.$ustensilsInput = document.querySelector("#input-ustensils");
        this.$AllInputs = [this.$ingredientsInput, this.$equipmentsInput, this.$ustensilsInput];

        this.$ingredientsBtn = document.querySelector("#ingredients-btn");
        this.$equipmentsBtn = document.querySelector("#equipments-btn");
        this.$ustensilsBtn = document.querySelector("#ustensils-btn");
        this.$AllBtns = [this.$ingredientsBtn, this.$equipmentsBtn, this.$ustensilsBtn];
    }

    async init() {
        await this.getData().then(() => {
            this.renderRecipes(this._allRecipes);
        })
        this.handleMainInput();
        this.handleIngredientInput();
        this.handleEquipmentInput();
        this.handleUstensilsInput();
    }

    async getData() {
        const API = new Api("data/recipes.json");
        this._allRecipes = await API.getJsonData();
        this._allAppliances = this.getAppliances(this._allRecipes);
        this._allUstensils = this.getUstensils(this._allRecipes);
        this._allIngredients = this.getIngredients(this._allRecipes);
    }


    getUstensils(allRecipes) {
        let ustensilsArrays = allRecipes.map(element => element["ustensils"]);
        let ustensils = ustensilsArrays.flat().map(element => this.getItCapitalized(element));
        let unique = this.removeDoubleFromArray(ustensils);
        return this.sortAlphabetically(unique);
    }

    getAppliances(allRecipes) {
        let result = allRecipes.map(element => element["appliance"]);
        let unique = this.removeDoubleFromArray(result);
        result = unique;
        return this.sortAlphabetically(result);
    }

    getIngredients(allRecipes) {
        const ingredientsArray = allRecipes.map(element => element["ingredients"]);
        let ingredients = [];
        ingredientsArray.map(element =>
            element.forEach(val => {
                ingredients.push(this.getItCapitalized(val.ingredient))
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
            //remove double for the rest
            return ingredients.indexOf(element) === index;
        });
        return this.sortAlphabetically(unique);
    }


    getItCapitalized(element) {
        return element[0].toUpperCase() + element.slice(1).toLowerCase();
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

    removeDoubleFromArray(array) {
        let unique = array.filter((element, index) => {
            return array.indexOf(element) === index;
        })
        return unique;
    }

    renderRecipes(recipes) {
        this.$recipeContainer.innerHTML = "";
        recipes.forEach(element => {
            const TEMPLATE = new RecipeTemplate(element);
            this.$recipeContainer.appendChild(TEMPLATE.renderRecipe());
        });
    }

    filterRecipes() {
        let filtered = [];
        this._allBadges.forEach(badge => {
            this._allRecipes.map(recipe => {
                if (badge.category === "ingredients") {
                    if (this.findIngredient(recipe[badge.category], badge.item)) {
                        filtered.push(recipe);
                    }
                }
                if (badge.category === "equipments") {
                    if (recipe["appliance"] === badge.item) {
                        filtered.push(recipe);
                    }
                }
                if (badge.category === "ustensils") {
                    for (let ustensils of recipe[badge.category]) {
                        if (badge.item === ustensils) {
                            filtered.push(recipe);
                        }
                    }
                }

            })
        })
        this.renderRecipes(this.removeDoubleFromArray(filtered));
    }

    handleMainInput() {
        let events = ["focus", "keyup", "change", "Backspace"];
        events.forEach((element) => {
            this.$mainInput.addEventListener(element, (event) => {
                let input = event.target.value.toLowerCase();
                let filtered = [];
                if (input.length >= 3 || input.length > 0 && event.key === "Backspace") {
                    this.$badges.innerHTML = "";
                    const regex = new RegExp(input);
                    this._allRecipes.forEach((element) => {
                        if (regex.test(element.name.toLowerCase())) {
                            filtered.push(element);
                        }
                        else if (regex.test(element.description.toLowerCase())) {
                            filtered.push(element);
                        }
                        else if (this.findIngredient(element.ingredients, input)) {
                            filtered.push(element);
                        }
                        let filteredIngredients = this.getIngredients(filtered);
                        let filteredEquipments = filtered.map(element => element.appliance);
                        let filteredEquipmentsSingles = this.removeDoubleFromArray(filteredEquipments.flat())
                        let filteredUstensils = this.getUstensils(filtered);
                        this.handleIngredientInput(filteredIngredients);
                        this.handleEquipmentInput(filteredEquipmentsSingles);
                        this.handleUstensilsInput(filteredUstensils);
                        this.renderRecipes(filtered);

                    });
                }
                if (input.length >= 3 && filtered.length === 0) {
                    this.$badges.innerHTML = "";
                    this.getErrorMessage();
                    filtered = this._allRecipes;
                    this.renderRecipes(filtered);
                }
                let index = 0;
                this.$AllNavs.forEach(nav => {
                    let ulElement = nav.querySelector(" ul");
                    if (ulElement.ariaExpanded === "true") {
                        let btn = this.$AllBtns[index];
                        let input = this.$AllInputs[index];
                        this.closeNavBar(btn, nav, input);
                    }
                    index++;
                })
            })
        })
    }

    handleIngredientInput() {
        let listTemplate = new ListTemplate(this._allIngredients, "ingredients", this.$ingredientsBtn, this.$ingredientsNav, this.$ingredientsInput);
        listTemplate.getList(this._allIngredients);
        listTemplate.handleInput();
        this.handleListClick(this.$ingredientsNav.firstChild, listTemplate)
    }

    handleEquipmentInput() {
        let listTemplate = new ListTemplate(this._allAppliances, "equipments", this.$equipmentsBtn, this.$equipmentsNav, this.$equipmentsInput);
        listTemplate.getList(this._allAppliances);
        listTemplate.handleInput();
        this.handleListClick(this.$equipmentsNav.firstChild, listTemplate);
    }

    handleUstensilsInput() {
        let listTemplate = new ListTemplate(this._allUstensils, "ustensils", this.$ustensilsBtn, this.$ustensilsNav, this.$ustensilsInput);
        listTemplate.getList(this._allUstensils);
        listTemplate.handleInput();
        this.handleListClick(this.$ustensilsNav.firstChild, listTemplate);
    }


    getErrorMessage() {
        const box = document.createElement("div");
        box.className = "noResultMessage alert alert-warning";
        box.innerHTML = `Aucune recherche ne correspond à votre critère ...  Vous pouvez chercher «tarte aux pommes», «poisson» etc ...`;
        this.$badges.appendChild(box);
    }

    //returns true ingredient matches the regex
    findIngredient(ingredientsArray, search) {
        let isFound = false;
        let ingredientsNames = ingredientsArray.map(r => r.ingredient);
        for (let ingredient of ingredientsNames) {
            if (ingredient.includes(search)) {
                isFound = true;
            }
        }
        return isFound;
    }



    isNewBadge(newBadge) {
        let isNew = true;
        for (let badge of this._allBadges) {
            if (badge.category === newBadge.category && badge.item === newBadge.item) {
                isNew = false;
            }
        }
        return isNew;
    }

    DeleteBadge(badge) {
        let spanInBadge = badge.querySelector(".badge");
        let toBeDeleted = {
            category: spanInBadge.getAttribute("category"),
            item: spanInBadge.getAttribute("item")
        };
        badge.innerHTML = "";
        let index = -1;
        for (let badge of this._allBadges) {
            index++;
            if (badge.category === toBeDeleted.category && badge.item === toBeDeleted.item) {
                this._allBadges.splice(index, 1);
                index = 0;
                this._allBadges.length === 0 ? this.renderRecipes(this._allRecipes) : this.filterRecipes();
            }
        }
    }

    createBadge(data) {
        return {
            category: data.getAttribute("category"),
            item: data.textContent
        }
    }

    handleAddBadge(newBadge, listTemplate) {
        if (this._allBadges.length === 0 || this.isNewBadge(newBadge)) {
            let badgeTemplate = new BadgeTemplate(newBadge);
            let badge = badgeTemplate.getBadge();
            badge.addEventListener("click", () => {
                this.DeleteBadge(badge);
            });
            this.$badges.appendChild(badge);
            this._allBadges.push(newBadge)
            this.filterRecipes();
        }
        listTemplate.closeNavBar()
    }

    handleListClick(ul, listTemplate) {
        let liElements = ul.querySelectorAll("li");
        for (const li of liElements) {
            li.addEventListener("click", (event) => {
                listTemplate.closeNavBar();
                let badge = this.createBadge(event.srcElement);
                this.handleAddBadge(badge, listTemplate)
            }
            );
        }
    }


}

const app = new App();
app.init();