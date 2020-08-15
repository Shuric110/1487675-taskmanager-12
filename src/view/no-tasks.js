import {createElementFromTemplate} from "../util.js";

export default class NoTasks {
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
      <p class="board__no-tasks">
        Click «ADD NEW TASK» in menu to create your first task
      </p>
    `;
  }
}
