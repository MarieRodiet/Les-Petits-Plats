import ListTemplate from "./../Templates/listTemplate.js";
import RecipeTemplate from "./../Templates/RecipeTemplate.js";
import BadgeTemplate from "./../Templates/BadgeTemplate.js";
import Api from "./../api/api.js";

class App {
    constructor() {
        //variables from JSON file
        this._allRecipes = null;
        this._allAppliances = null;
        this._allIngredients = null;
        this._allUstensils = null;

        //variables for manipulating DOM
        this._allBadges = [];
        this._closeNavBar = false;
        this._navToBeClosed = null;

        //DOM element: main input
        this.$mainInput = document.querySelector("#main-input");

        //DOM element: badges
        this.$badges = document.querySelector("#badges");

        //DOM element: NAV bars
        this.$ingredientsNav = document.querySelector("#ingredients-nav");
        this.$equipmentsNav = document.querySelector("#equipments-nav");
        this.$ustensilsNav = document.querySelector("#ustensils-nav");

        //DOM element: INPUTS
        this.$ingredientsInput = document.querySelector("#input-ingredients");
        this.$equipmentsInput = document.querySelector("#input-equipments");
        this.$ustensilsInput = document.querySelector("#input-ustensils");

        //DOM element: BTNS
        this.$ingredientsBtn = document.querySelector("#ingredients-btn");
        this.$equipmentsBtn = document.querySelector("#equipments-btn");
        this.$ustensilsBtn = document.querySelector("#ustensils-btn");

        //DOM element: recipes
        this.$recipeContainer = document.querySelector("#recipes-container");
    }

    //let app = new App(); app.init();
    async init() {
        await this.getData().then(() => {
            this.renderRecipes(this._allRecipes);
        })
        this.handleMainInput();
        this.handleIngredientInput();
        this.handleEquipmentInput();
        this.handleUstensilsInput();
    }

    //instantiation of main variables
    async getData() {
        const API = new Api("data/recipes.json");
        this._allRecipes = await API.getJsonData();
        this._allAppliances = this.getAppliances(this._allRecipes);
        this._allUstensils = this.getUstensils(this._allRecipes);
        this._allIngredients = this.getIngredients(this._allRecipes);
    }

    //get ustensils from recipes
    getUstensils(allRecipes) {
        let ustensilsArrays = allRecipes.map(element => element["ustensils"]);
        let ustensils = ustensilsArrays.flat().map(element => this.getItCapitalized(element));
        let unique = this.removeDoubleFromArray(ustensils);
        return this.sortAlphabetically(unique);
    }

    //get appliances from recipes
    getAppliances(allRecipes) {
        let result = allRecipes.map(element => element["appliance"]);
        let unique = this.removeDoubleFromArray(result);
        result = unique;
        return this.sortAlphabetically(result);
    }

    //get ingredients from recipes
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

    //recipes inserted in DOM
    renderRecipes(recipes) {
        this.$recipeContainer.innerHTML = "";
        recipes.forEach(element => {
            const TEMPLATE = new RecipeTemplate(element);
            this.$recipeContainer.appendChild(TEMPLATE.renderRecipe());
        });
    }

    //filtrer recipes by badges
    filterRecipes() {
        let filtered = [];
        this._allBadges.forEach(badge => {
            this._allRecipes.forEach(recipe => {
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
                if (badge.category === "ustensils" && recipe[badge.category].includes(badge.item.toLowerCase())) {
                    filtered.push(recipe);
                }
            })
        })
        this.renderRecipes(this.removeDoubleFromArray(filtered));
    }

    //main input fonctionality
    handleMainInput() {
        let events = ["focus", "keyup", "change", "Backspace"];
        events.forEach(event => {
            let filtered = [];
            this.$mainInput.addEventListener(event, (event) => {
                let input = event.target.value.toLowerCase();
                if (input.length >= 3 || input.length > 0 && event.key === "Backspace") {
                    const regex = new RegExp(input);
                    const result = this._allRecipes.filter(element =>
                        regex.test(element.name.toLowerCase()) ||
                        regex.test(element.description.toLowerCase()) ||
                        this.findIngredient(element.ingredients, input)
                    );
                    filtered = result;

                    //extraction par propriétés
                    let filteredIngredients = this.getIngredients(filtered);
                    let filteredEquipments = filtered.map(element => element.appliance);
                    let filteredEquipmentsSingles = this.removeDoubleFromArray(filteredEquipments.flat())
                    let filteredUstensils = this.getUstensils(filtered);

                    this._allIngredients = filteredIngredients;
                    this._allAppliances = filteredEquipmentsSingles;
                    this._allUstensils = filteredUstensils;

                    this.handleIngredientInput();
                    this.handleEquipmentInput();
                    this.handleUstensilsInput();
                    this.renderRecipes(filtered);
                }
                if (input.length >= 3 && filtered.length === 0) {
                    this.getErrorMessage();
                    this.renderRecipes(this._allRecipes);
                    this._allAppliances = this.getAppliances(this._allRecipes);
                    this._allUstensils = this.getUstensils(this._allRecipes);
                    this._allIngredients = this.getIngredients(this._allRecipes);
                }
            })
        });
    }

    //INGREDIENTS
    handleIngredientInput() {
        let listTemplate = new ListTemplate(this._allIngredients, "ingredients", this.$ingredientsBtn, this.$ingredientsNav, this.$ingredientsInput);
        listTemplate.getList(this._allIngredients);
        this.handleInput(this.$ingredientsNav.firstChild, this.$ingredientsInput, listTemplate);
        this.handleListClick(this.$ingredientsNav.firstChild, listTemplate)
        listTemplate.handleCloseNavBar(this.$mainInput);

    }
    //EQUIPMENT
    handleEquipmentInput() {
        let listTemplate = new ListTemplate(this._allAppliances, "equipments", this.$equipmentsBtn, this.$equipmentsNav, this.$equipmentsInput);
        listTemplate.getList(this._allAppliances);
        this.handleInput(this.$equipmentsNav.firstChild, this.$equipmentsInput, listTemplate);
        this.handleListClick(this.$equipmentsNav.firstChild, listTemplate);
        listTemplate.handleCloseNavBar(this.$mainInput);
    }
    //USTENSILS
    handleUstensilsInput() {
        let listTemplate = new ListTemplate(this._allUstensils, "ustensils", this.$ustensilsBtn, this.$ustensilsNav, this.$ustensilsInput);
        listTemplate.getList(this._allUstensils);
        this.handleInput(this.$ustensilsNav.firstChild, this.$ustensilsInput, listTemplate);
        this.handleListClick(this.$ustensilsNav.firstChild, listTemplate);
        listTemplate.handleCloseNavBar(this.$mainInput);
    }

    //input entered by the user updates list in nav
    handleInput(ul, input, listTemplate) {
        input.addEventListener("keyup", (event) => {
            listTemplate.getUpdatedList(event);
            this.handleListClick(ul, listTemplate)
        })
    }

    //li elements can add new badge
    handleListClick(ul, listTemplate) {
        let events = ["click", "keyup"];
        let liElements = ul.querySelectorAll("li");
        for (const li of liElements) {
            events.forEach(eventListener => {
                li.addEventListener(eventListener, (event) => {
                    if (event.key === "Enter" || event.type === "click") {
                        listTemplate.closeNavBar();
                        let badge = this.createBadge(event.srcElement);
                        this.handleAddBadge(badge, listTemplate)
                    }
                    if (event.key === "Escape") {
                        listTemplate.closeNavBar();
                    }
                }
                );
            })
        }
    }

    getErrorMessage() {
        const box = document.createElement("div");
        box.className = "h-100 noResultMessage alert alert-warning w-100 p-4";
        box.innerHTML = `Aucune recherche ne correspond à votre critère ...  Vous pouvez chercher «tarte aux pommes», «poisson» etc ...`;
        this.$badges.appendChild(box);
    }

    //true if search is found
    findIngredient(ingredientsArray, search) {
        let isFound = false;
        let ingredientsNames = [];
        for (let i = 0; i < ingredientsArray.length; i++) {
            ingredientsNames.push(ingredientsArray[i].ingredient);
        }
        for (let j = 0; j < ingredientsNames.length; j++) {
            if (ingredientsNames[j].includes(search)) {
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
    //new badge creation
    createBadge(data) {
        return {
            category: data.getAttribute("category"),
            item: data.textContent
        }
    }

    //add new badge, filter recipes and closeNav()
    handleAddBadge(newBadge, listTemplate) {
        let events = ["click", "keypress"];
        if (this._allBadges.length === 0 || this.isNewBadge(newBadge)) {
            let badgeTemplate = new BadgeTemplate(newBadge);
            let badge = badgeTemplate.getBadge();
            events.forEach(eventListener => {
                badge.addEventListener(eventListener, () => {
                    this.DeleteBadge(badge);
                })
            });
            this.$badges.appendChild(badge);
            this._allBadges.push(newBadge)
            this.filterRecipes();
        }
        listTemplate.closeNavBar()
    }
}

let app = new App();
app.init();