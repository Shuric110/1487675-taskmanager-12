import {createElementFromTemplate} from "../util/render.js";

const SHAKE_DURATION = 600;

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

  _createElement() {
    this._element = createElementFromTemplate(this.getTemplate());
  }

  getElement() {
    if (!this._element) {
      this._createElement();
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }

  getHasElement() {
    return this._element !== null;
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_DURATION / 1000}s`;
    this.getElement().style.zIndex = `1`;
    setTimeout(() => {
      this.getElement().style.animation = ``;
      this.getElement().style.zIndex = ``;
      callback();
    }, SHAKE_DURATION);
  }
}
