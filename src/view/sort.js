import ComponentView from "./component.js";
import {SORT_TYPES} from "../const.js";

export default class Sort extends ComponentView {
  constructor() {
    super();
    this._sortChangeHandler = this._sortChangeHandler.bind(this);
  }

  getTemplate() {
    return `
      <div class="board__filter-list">
        ${Object.entries(SORT_TYPES).map(([code, {title}]) => `
          <a href="#" class="board__filter" data-sort="${code}">SORT BY ${title}</a>
        `).join(``)}
      </div>
    `;
  }

  _sortChangeHandler(evt) {
    evt.preventDefault();
    this._callback.sortChange();
  }

  setSortChangeHandler(callback) {
    this.getElement().addEventListener(`click`, this._sortChangeHandler);
    this._callback.sortChange = callback;
  }
}
