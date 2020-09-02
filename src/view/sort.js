import ComponentView from "./component.js";

export default class Sort extends ComponentView {
  constructor(definitions, currentSort) {
    super();

    this._definitions = definitions;
    this._currentSort = currentSort;

    this._sortChangeHandler = this._sortChangeHandler.bind(this);
  }

  getTemplate() {
    return `
      <div class="board__filter-list">
        ${this._definitions.map(({code, title}) => `
          <a href="#" class="board__filter ${code === this._currentSort.code ? `board__filter--active` : ``}" data-sort="${code}">SORT BY ${title}</a>
        `).join(``)}
      </div>
    `;
  }

  _sortChangeHandler(evt) {
    if (!evt.target.dataset.sort) {
      return;
    }

    evt.preventDefault();
    this._callback.sortChange(evt.target.dataset.sort);
  }

  setSortChangeHandler(callback) {
    this.getElement().addEventListener(`click`, this._sortChangeHandler);
    this._callback.sortChange = callback;
  }
}
