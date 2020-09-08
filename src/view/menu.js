import ComponentView from "./component.js";

import {MenuItem} from "../const.js";

export default class Menu extends ComponentView {
  constructor() {
    super();

    this._onMenuClick = this._onMenuClick.bind(this);
  }

  _onMenuClick(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.value);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`change`, this._onMenuClick);
  }

  setActiveItem(menuItem) {
    const itemElement = this.getElement().querySelector(`[value=${menuItem}]`);
    if (itemElement) {
      itemElement.checked = true;
    }
  }

  getTemplate() {
    return `
      <section class="control__btn-wrap">
        <input
          type="radio"
          name="control"
          id="control__new-task"
          class="control__input visually-hidden"
          value="${MenuItem.ADD_NEW_TASK}"
        />
        <label for="control__new-task" class="control__label control__label--new-task"
          >+ ADD NEW TASK</label
        >
        <input
          type="radio"
          name="control"
          id="control__task"
          class="control__input visually-hidden"
          value="${MenuItem.TASKS}"
          checked
        />
        <label for="control__task" class="control__label">TASKS</label>
        <input
          type="radio"
          name="control"
          id="control__statistic"
          class="control__input visually-hidden"
          value="${MenuItem.STATISTICS}"
        />
        <label for="control__statistic" class="control__label"
          >STATISTICS</label
        >
      </section>
    `;
  }
}
