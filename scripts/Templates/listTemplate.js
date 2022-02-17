export default class ListTemplate {
    constructor(list) {
        this._list = list;
        this.$ulElement = document.createElement("ul");
        this.$ingredientsBtn = document.querySelector("#ingredients-btn");
    }

    getList() {
        this.$ulElement.className = "rounded scroll";
        this.$ulElement.setAttribute("role", "listbox");
        this.$ulElement.setAttribute("aria-expanded", "false");
        this.$ulElement.setAttribute("aria-haspopup", "true");
        let list = "";
        this._list.forEach((element) => {
            const item = `<li tabindex="0" class="list-unstyled" role="option" value=${element}>${element}</li>`;
            list += item;
        })
        this.$ulElement.innerHTML = list;
        return this.$ulElement;
    }

    handleUlElement() {
        let events = ["click"];
        events.forEach((element) => {
            this.$ingredientsBtn.addEventListener(element, () => {
                this.toggleNavBar();
            })
        })
    }
    handleListItems(inputBtn) {
        let events = ["keydown", "click"];
        events.forEach((element) => {
            inputBtn.querySelector("ul li").addEventListener(element, (event) => {
                console.log(event);
                console.log("you clicked on me");
            })
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
            this.$ulElement.style.display = "none";
            this.$ingredientsBtn.querySelector("svg").classList.add("down");
            this.$ingredientsBtn.querySelector("svg").classList.remove("up");
            this.$ulElement.setAttribute("aria-expanded", "false");
        }
    }
}