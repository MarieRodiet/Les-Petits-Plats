import BadgeTemplate from "./BadgeTemplate.js";

export default class ListTemplate {
    constructor(list) {
        this._list = list;
        this._badges = [];

        this.$ulElement = document.createElement("ul");
        this.$ingredientsNav = document.querySelector("#ingredients-nav");
        this.$ingredientsBtn = document.querySelector("#ingredients-btn");
        this.$badges = document.querySelector("#badges");
        //this.handleAddBadge = this.handleAddBadge.bind(this);
    }

    getList() {
        this.$ulElement.className = "rounded scroll";
        this.$ulElement.setAttribute("role", "listbox");
        this.$ulElement.setAttribute("aria-expanded", "false");
        this.$ulElement.setAttribute("aria-haspopup", "true");
        let list = "";
        this._list.forEach((element) => {
            const item = `<li category ="ingredients" tabindex="0" class="list-unstyled" role="option" value="${element}">${element}</li>`;
            list += item;
        })
        this.$ulElement.innerHTML = list;
        let liElements = this.$ulElement.querySelectorAll("li");
        for (const li of liElements) {
            li.addEventListener("click", () => this.handleAddBadge(event));
        }
        return this.$ulElement;
    }

    handleUlElement() {
        this.$ingredientsBtn.addEventListener("click", () => {
            this.toggleNavBar();
        })
    }

    toggleNavBar() {
        if (!this.$ulElement.getAttribute('style') || this.$ulElement.getAttribute('style') === 'display: none;') {
            this.$ulElement.style.display = "block";
            this.$ingredientsBtn.querySelector("svg").classList.add("up");
            this.$ingredientsBtn.querySelector("svg").classList.remove("down");
            this.$ulElement.setAttribute("aria-expanded", "true");
        }
        else {
            this.closeNavBar();

        }
    }

    closeNavBar() {
        this.$ulElement.style.display = "none";
        this.$ingredientsBtn.querySelector("svg").classList.add("down");
        this.$ingredientsBtn.querySelector("svg").classList.remove("up");
        this.$ulElement.setAttribute("aria-expanded", "false");
    }

    handleAddBadge(event) {
        let Template = new BadgeTemplate({
            category: event.srcElement.getAttribute("category"),
            item: event.srcElement.textContent
        });
        console.log(this.$badges);
        this.$badges.appendChild(Template.getBadge());
        /*this.$badges.querySelectorAll(".badge path.deleteSvg").addEventListener("click", (event) => {
            this.handleDeleteBadge(event);
        });*/
        this.closeNavBar();
    }

    handleDeleteBadge(event) {
        console.log("you want to deleted me?");
        console.log(event.srcElement.id);
    }


}