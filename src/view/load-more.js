import {createElementFromTemplate} from "../util.js";

export default class LoadMore {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElementFromTemplate(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return `
      <button class="load-more" type="button">load more</button>
    `;
  }
}
