import ListTemplate from "../Templates/listTemplate.js";
import RecipeTemplate from "../Templates/RecipeTemplate.js";
import Api from "./../api/api.js";
import BadgeTemplate from "../Templates/BadgeTemplate.js";

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

        this.$ingredientsInput = document.querySelector("#input-ingredients");
        this.$equipmentsInput = document.querySelector("#input-equipments");
        this.$ustensilsInput = document.querySelector("#input-ustensils");

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

        console.log(this._allAppliances);
        console.log(this._allIngredients);
        console.log(this._allUstensils);
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
                    this.$badges.innerHTML = "";
                    const regex = new RegExp(input);
                    this._allData.filter((element) => {
                        if (regex.test(element.name.toLowerCase())) {
                            filtered.push(element);
                            console.log(element.name);
                        }
                        else if (regex.test(element.description.toLowerCase())) {
                            filtered.push(element);
                            console.log(element.description);
                        }
                        else if (this.findIngredient(element.ingredients, regex)) {
                            filtered.push(element);
                            console.log("among ingredients");
                        }
                        this.renderRecipes(filtered);
                        this._allIngredients = filtered.filter((element, index) => {
                            return filtered.indexOf(element) === index;
                        })
                        console.log(this._allAppliances);
                        console.log(this._allIngredients);
                        console.log(this._allUstensils);

                        this._allAppliances = filtered.forElement((element) => {
                            return element.appliance;
                        })
                        this._allUstensils = filtered.forElement((element) => {
                            return element.ustensils.flat();
                        })
                    });
                }
                if (input.length >= 3 && filtered.length === 0) {
                    this.$badges.innerHTML = "";
                    this.getErrorMessage();
                    filtered = this._allData;
                    this.renderRecipes(filtered);
                }

            })
        })
    }


    getErrorMessage() {
        const box = document.createElement("div");
        box.className = "noResultMessage alert alert-warning";
        box.innerHTML = `Aucune recherche ne correspond à votre critère ...  Vous pouvez chercher «tarte aux pommes», «poisson» etc ...`;
        this.$badges.appendChild(box);
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
        let Template = new ListTemplate(this._allIngredients, "#ingredients-btn", "#ingredients-nav", "ingredients");
        this.$ingredientsNav.appendChild(Template.getList());
        this.handleUlElement(this.$ingredientsBtn, this.$ingredientsNav);
        this.handleListClick(this.$ingredientsBtn, this.$ingredientsNav);
        this.$ingredientsInput.addEventListener("keyup", () => {
            let input = event.target.value;
            console.log(input);
            let filtered = [];
            const regex = new RegExp(input.toLowerCase());
            this._allIngredients.filter((element) => {
                if (regex.test(element.toLowerCase())) {
                    filtered.push(element);
                    console.log(element);
                }
            })
            console.log("filtered");
            console.log(filtered);
            this.$ingredientsNav.innerHTML = "";
            let Template = new ListTemplate(this._allIngredients, "#ingredients-btn", "#ingredients-nav", "ingredients");
            this.$ingredientsNav.appendChild(Template.getList());
        })
    }

    handleEquipmentInput() {
        let Template = new ListTemplate(this._allAppliances, "#equipments-btn", "#equipments-nav", "equipments");
        this.$equipmentsNav.appendChild(Template.getList());
        this.handleUlElement(this.$equipmentsBtn, this.$equipmentsNav);
        this.handleListClick(this.$equipmentsBtn, this.$equipmentsNav);
    }

    handleUstensilsInput() {
        let Template = new ListTemplate(this._allUstensils, "#ustensils-btn", "#ustensils-nav", "ustensils");
        this.$ustensilsNav.appendChild(Template.getList());
        this.handleUlElement(this.$ustensilsBtn, this.$ustensilsNav);
        this.handleListClick(this.$ustensilsBtn, this.$ustensilsNav);
    }

    handleUlElement(btn, nav) {
        btn.addEventListener("click", () => {
            this.toggleNavBar(btn, nav);
        })
    }

    toggleNavBar(btn, nav) {
        let $ulElement = nav.querySelector(" ul");
        let input = btn.previousElementSibling;
        let type = input.getAttribute("id");
        if (!$ulElement.getAttribute('style') || $ulElement.getAttribute('style') === 'display: none;') {
            $ulElement.style.display = "block";
            btn.querySelector("svg").classList.add("up");
            btn.querySelector("svg").classList.remove("down");
            btn.classList.add("buttonBottomRadiusRemoval");
            $ulElement.setAttribute("aria-expanded", "true");
            input.focus();
            input.placeholder = "Rechercher des " + this.getPlaceHolder(type);
            input.classList.add("inputBottomRadiusRemoval");
            let parent = input.parentNode;
            parent.classList.add("inputAndButtonExtended");
            let nav = parent.nextElementSibling;
            nav.classList.add("navExtended");
            let list = nav.childNodes[1];
            list.classList.add("listExtended");
        }
        else {
            this.closeNavBar(btn, nav, input);
        }
    }

    closeNavBar(btn, nav, input) {
        let type = input.getAttribute("id");
        let $ulElement = nav.querySelector("ul");
        $ulElement.style.display = "none";
        btn.querySelector("svg").classList.add("down");
        btn.querySelector("svg").classList.remove("up");
        $ulElement.setAttribute("aria-expanded", "false");
        input.placeholder = this.getPlaceHolder(type)[0].toUpperCase() + this.getPlaceHolder(type).slice(1);
        input.classList.remove("inputBottomRadiusRemoval");
        let parent = input.parentNode;
        parent.classList.remove("inputAndButtonExtended");
        btn.classList.remove("buttonBottomRadiusRemoval");
        nav.classList.remove("navExtended");

    }

    getPlaceHolder(id) {
        switch (id) {
            case "input-ingredients":
                return "ingrédients";
            case "input-equipments":
                return "appareils";
            case "input-ustensils":
                return "ustensiles";
        }
    }

    handleListClick(btn, nav) {
        let $ulElement = nav.querySelector("ul");
        let liElements = $ulElement.querySelectorAll("li");
        for (const li of liElements) {
            li.addEventListener("click", () => this.handleAddBadge(btn, nav));
        }
    }



    handleAddBadge(btn, nav) {
        let newBadge = {
            category: event.srcElement.getAttribute("category"),
            item: event.srcElement.textContent
        }
        if (this._allBadges.length === 0 || this.isNewBadge(newBadge)) {
            let Template = new BadgeTemplate(newBadge);
            let badge = Template.getBadge();
            badge.addEventListener("click", () => {
                this.DeleteBadge(badge);
            });
            this.$badges.appendChild(badge);
            this._allBadges.push(newBadge)

            console.log("just pushed a new badge to this._allBadges: ")
            console.log(this._allBadges);
            //this.filterRecipes();
        }
        else {
            console.log("you already have this item");
        }
        this.closeNavBar(btn, nav)
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
            }
        }
    }

}

const app = new App();
app.init();