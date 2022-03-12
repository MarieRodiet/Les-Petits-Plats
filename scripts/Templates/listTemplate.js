export default class ListTemplate {
    constructor(list, type, btn, nav, input) {
        this._list = list;
        this._type = type;
        this._btn = btn;
        this._nav = nav;
        this._input = input;
        this._inputParent = input.parentNode;
        this._navParent = nav.parentNode
        this.$ulElement = document.createElement("ul");
    }

    handleCloseNavBar(mainInput) {
        let events = ["click", "keyup"];
        mainInput.addEventListener("focus", () => {
            if (this.$ulElement.getAttribute('style') === 'display: block;') {
                this.closeNavBar();
            }
        })
        events.forEach(element => {
            this._btn.addEventListener(element, (event) => {
                if (event.key === "Enter" || event.type === "click") {
                    this.toggleNavBar();
                }
            })
        })

        this._input.addEventListener("keyup", (event) => {
            if (this.$ulElement.getAttribute('style') === 'display: block;' && event.key === "Escape") {
                this.closeNavBar();
            }
        })

    }

    getList(items) {
        this._nav.innerHTML = "";
        this.$ulElement.className = "scroll";
        this.$ulElement.setAttribute("role", "listbox");
        this.$ulElement.setAttribute("aria-expanded", "false");
        this.$ulElement.setAttribute("aria-haspopup", "true");
        let list = "";
        items.forEach((element) => {
            const item = `<li category ="${this._type}" tabindex="0" class="list-unstyled" role="option" value="${element}">${element}</li>`;
            list += item;
        })
        this.$ulElement.innerHTML = list;
        this._nav.appendChild(this.$ulElement);
    }

    getUpdatedList(event) {
        let filtered = [];
        const regex = new RegExp(event.target.value.toLowerCase());
        this._list.forEach((element) => {
            if (regex.test(element.toLowerCase())) {
                filtered.push(element);
            }
        })
        this.openNavBar();
        this.getList(filtered);
    }

    toggleNavBar() {
        if (!this.$ulElement.getAttribute('style') || this.$ulElement.getAttribute('style') === 'display: none;') {
            this.openNavBar();
        }
        else {
            this.closeNavBar();
        }
    }

    openNavBar() {
        this._btn.querySelector("svg").classList.add("up");
        this._btn.querySelector("svg").classList.remove("down");
        this._btn.classList.add("buttonBottomRadiusRemoval");
        this._input.focus();
        this._input.placeholder = "Rechercher des " + this.getPlaceHolder().toLowerCase();
        this._input.classList.add("inputBottomRadiusRemoval");
        this._inputParent.classList.add("inputAndButtonExtended");
        this._inputParent.parentNode.classList.add("input-groupExtanded");
        this._navParent.classList.add("navExtended");
        this._nav.classList.add("listExtended");
        this.$ulElement.style.display = "block";
        this.$ulElement.setAttribute("aria-expanded", "true");
    }

    closeNavBar() {
        this._btn.querySelector("svg").classList.add("down");
        this._btn.querySelector("svg").classList.remove("up");
        this._btn.classList.remove("buttonBottomRadiusRemoval");
        this._input.placeholder = this.getPlaceHolder();
        this._input.classList.remove("inputBottomRadiusRemoval");
        this._inputParent.parentNode.classList.remove("input-groupExtanded");
        this._inputParent.classList.remove("inputAndButtonExtended");
        this.$ulElement.setAttribute("aria-expanded", "false");
        this.$ulElement.style.display = "none";
        this._nav.classList.remove("navExtended");
    }

    getPlaceHolder() {
        switch (this._type) {
            case "ingredients":
                return "Ingrédients";
            case "equipments":
                return "Appareils";
            case "ustensils":
                return "Ustensiles";
        }
    }
}