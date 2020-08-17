import {createElementFromTemplate, escapeHtml} from "../util.js";

export default class Filter {
  constructor(filters) {
    this._element = null;
    this._filters = filters;
  }

  getElement() {
    if (!this._element) {
      this._element = createElementFromTemplate(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return `
      <section class="main__filter filter container">
        ${this._filters.map(({code, displayName, tasksCount}) => `
          <input
            type="radio"
            id="filter__${code}"
            class="filter__input visually-hidden"
            name="filter"
            checked
          />
          <label for="filter__${code}" class="filter__label">
            ${escapeHtml(displayName)} <span class="filter__${code}-count">${tasksCount}</span></label
          >
        `).join(``)}
      </section>
    `;
  }
}
