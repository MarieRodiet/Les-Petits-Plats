import BadgeTemplate from "./BadgeTemplate.js";

export default class ListTemplate {
    constructor(list, btn, nav, type) {
        this._list = list;
        this._btn = btn;
        this._nav = nav;
        this._type = type;
        this._badges = [];

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
        let Template = new BadgeTemplate(newBadge);
        let badge = Template.getBadge();
        badge.addEventListener("click", () => this.DeleteBadge(badge));
        this.$badges.appendChild(badge);
        this._badges.push(newBadge)
        this.closeNavBar();
        console.log(this._badges);
    }

    DeleteBadge(badge) {
        let spanInBadge = badge.querySelector(".badge");
        let toBeDeleted = {
            category: spanInBadge.getAttribute("category"),
            item: spanInBadge.getAttribute("item")
        };
        badge.innerHTML = "";
        console.log(toBeDeleted);
        let index = -1;
        let removed = "";
        for (let badge of this._badges) {
            index++;
            if (badge.category === toBeDeleted.category && badge.item === toBeDeleted.item) {
                console.log(badge);
                console.log(index);
                removed = this._badges.splice(index, 1);
                index = 0;
                removed = "";
            }
        }
        console.log(removed);
        console.log(this._badges);
    }


}