import {createElementFromTemplate} from "../util.js";

export default class TaskList {
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
    return `<div class="board__tasks"></div>`;
  }
}
