import ComponentView from "./component.js";
import {escapeHtml} from "../util/common.js";

export default class Filter extends ComponentView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return `
      <section class="main__filter filter container">
        ${this._filters.map(({code, title, tasksCount}) => `
          <input
            type="radio"
            id="filter__${code}"
            class="filter__input visually-hidden"
            name="filter"
            value="${code}"
            ${code === this._currentFilter.code ? `checked` : ``}
          />
          <label for="filter__${code}" class="filter__label">
            ${escapeHtml(title)} <span class="filter__${code}-count">${tasksCount}</span></label
          >
        `).join(``)}
      </section>
    `;
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
