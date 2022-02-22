import BadgeTemplate from "./BadgeTemplate.js";

export default class ListTemplate {
    constructor(list, btn, nav, type) {
        this._list = list;
        this._btn = btn;
        this._nav = nav;
        this._type = type;

        this._badges = [];
        this._currentAction = null;
        this._currentBadge = null;

        this.$ulElement = document.createElement("ul");
        this.$Nav = document.querySelector(this._nav);
        this.$Btn = document.querySelector(this._btn);
        this.$badges = document.querySelector("#badges");
    }

    getList() {
        this.$ulElement.className = "rounded scroll";
        this.$ulElement.setAttribute("role", "listbox");
        this.$ulElement.setAttribute("aria-expanded", "false");
        this.$ulElement.setAttribute("aria-haspopup", "true");
        let list = "";
        this._list.forEach((element) => {
            const item = `<li category ="${this._type}" tabindex="0" class="list-unstyled" role="option" value="${element}">${element}</li>`;
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
        this.$Btn.addEventListener("click", () => {
            this.toggleNavBar();
        })
    }

    toggleNavBar() {
        if (!this.$ulElement.getAttribute('style') || this.$ulElement.getAttribute('style') === 'display: none;') {
            this.$ulElement.style.display = "block";
            this.$Btn.querySelector("svg").classList.add("up");
            this.$Btn.querySelector("svg").classList.remove("down");
            this.$ulElement.setAttribute("aria-expanded", "true");
        }
        else {
            this.closeNavBar();

        }
    }

    closeNavBar() {
        this.$ulElement.style.display = "none";
        this.$Btn.querySelector("svg").classList.add("down");
        this.$Btn.querySelector("svg").classList.remove("up");
        this.$ulElement.setAttribute("aria-expanded", "false");
    }

    handleAddBadge(event) {
        let newBadge = {
            category: event.srcElement.getAttribute("category"),
            item: event.srcElement.textContent
        };
        if (this._badges.length === 0 || this.isNewBadge(newBadge)) {
            let Template = new BadgeTemplate(newBadge);
            let badge = Template.getBadge();
            badge.addEventListener("click", () => {
                this.DeleteBadge(badge);
                this.updateAllBadgeData();
            });
            this.$badges.appendChild(badge);
            this._badges.push(newBadge)
            this._currentAction = "ADD";
            this._currentBadge = newBadge;
        }
        this.closeNavBar();
    }

    isNewBadge(newBadge) {
        let isNew = true;
        for (let badge of this._badges) {
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
        for (let badge of this._badges) {
            index++;
            if (badge.category === toBeDeleted.category && badge.item === toBeDeleted.item) {
                this._currentBadge = this._badges.splice(index, 1);
                this._currentAction = "REMOVE";
                index = 0;
            }
        }


    }

    updateAllBadgeData() {
        return [this._currentAction, this._currentBadge];
    }


}