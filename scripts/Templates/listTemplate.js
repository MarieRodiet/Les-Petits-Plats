export default class ListTemplate {
    constructor(list) {
        this._list = list;
    }

    getList() {
        let ulElement = document.createElement("ul");
        ulElement.className = "rounded scroll";
        ulElement.setAttribute("role", "listbox");
        let list = "";
        this._list.forEach((element) => {
            const item = `<li class="list-unstyled text-white" role="option" value=${element}>${element}</li>`;
            list += item;
        })
        ulElement.innerHTML = list;
        return ulElement;
    }
}