export default class Api {
    constructor(url, content) {
        this._url = url;
        this._content = content
    }

    async getJsonData() {
        return fetch(this._url)
            .then(res => res.json())
            .then(res => res.recipes)
            .catch(err => console.log('an error occurs', err))
    }
}