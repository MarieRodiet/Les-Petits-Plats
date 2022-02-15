export default class ListTemplate {
    constructor(list) {
        this._list = list;
    }

    createList() {
        const ul = `<ul>
            ${this.makeList()}
        </ul>`;
        ul.className = "scroll";
        ul.setAttribute("role", "listbox");
    }

    makeList() {
        let list = "";
        this._ingredients.forEach(element => {
            const item = `
            <li role="option">${element}</li>`;
            list += item;
        });
        return list;
    }
}