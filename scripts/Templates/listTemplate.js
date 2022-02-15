export default class ListTemplate {
    constructor(list) {
        this._list = list;
    }

    createList() {
        const $ul = document.createElement("ul");
        $ul.className = "bg-primary rounded scroll";
        $ul.setAttribute("id", "ingredients-nav");
        $ul.setAttribute("role", "listbox");
        let list = "";
        this._list.forEach((element) => {
            const item = `<li class="list-unstyled text-white" role="option">${element}</li>`;
            list += item;
        })
        $ul.innerHTML = list;
        return $ul;
    }
}