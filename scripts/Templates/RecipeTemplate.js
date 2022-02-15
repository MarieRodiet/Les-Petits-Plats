export default class RecipeTemplate {
    constructor(recipe) {
        this._id = recipe.id;
        this._name = recipe.name;
        this._servings = recipe.servings;
        this._ingredients = recipe.ingredients;
        this._time = recipe.time;
        this._description = recipe.description;
        this._appliance = recipe.appliance;
        this._ustensils = recipe.ustensils;
        this.$recipeContainer = document.querySelector("#recipes-container");
        this.$list = this.$recipeContainer.querySelector(".recipe-content .recipe .list-ingredients ul");
    }

    renderRecipe() {
        const cardContainer = document.createElement("div");
        cardContainer.className = "recipe-box";
        const card = `
                <div class="recipe-picture rounded-top"></div>
                <div class="recipe-content rounded-bottom">
                    <header>
                        <h1 class="fs-6 fw-light recipe-name">${this._name}</h1>
                        <div class="time-box">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. -->
                                <path
                                    d="M256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512zM232 256C232 264 236 271.5 242.7 275.1L338.7 339.1C349.7 347.3 364.6 344.3 371.1 333.3C379.3 322.3 376.3 307.4 365.3 300L280 243.2V120C280 106.7 269.3 96 255.1 96C242.7 96 231.1 106.7 231.1 120L232 256z" />
                            </svg>
                            <span class="fs-6">${this._time} min</span>
                        </div>
                    </header>
                    <div class="recipe">
                        <div class="list-ingredients">
                            <ul class="list">
                            ${this.makeList()}
                            </ul>
                        </div>
                        <p class="instructions">${this._description}</p>
                    </div>
                </div>`;
        cardContainer.innerHTML = card;
        return cardContainer;
    }

    makeList() {
        let list = "";
        this._ingredients.forEach(element => {
            const item = this.generateListItem(element);
            list += item;
        });
        return list;
    }

    generateListItem(element) {
        return (element.unit) ? `
        <li class="item">
            <span class="name fw-bold">${element.ingredient}</span>
            :
            <span class="quantity">${element.quantity}${element.unit}</span>
        </li>`
            : (element.quantity) ? `
        <li class="item">
            <span class="name fw-bold">${element.ingredient}</span>
            :
            <span class="quantity">${element.quantity}</span>
        </li>`
                : `
        <li class="item">
            <span class="name fw-bold">${element.ingredient}</span>
        </li>`;
    }
}