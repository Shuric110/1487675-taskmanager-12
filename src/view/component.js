import {createElementFromTemplate} from "../util/render.js";

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate abstract class, only concrete one.`);
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElementFromTemplate(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}