export default class ListTemplate {
    constructor(list, type) {
        this._list = list;
        this._type = type;

    }

    getList() {
        let $ulElement = document.createElement("ul");
        $ulElement.className = "scroll";
        $ulElement.setAttribute("role", "listbox");
        $ulElement.setAttribute("aria-expanded", "false");
        $ulElement.setAttribute("aria-haspopup", "true");
        let list = "";
        this._list.forEach((element) => {
            const item = `<li category ="${this._type}" tabindex="0" class="list-unstyled" role="option" value="${element}">${element}</li>`;
            list += item;
        })
        $ulElement.innerHTML = list;
        return $ulElement;
    }
}