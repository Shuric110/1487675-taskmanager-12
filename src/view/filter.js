import ComponentView from "./component.js";
import {escapeHtml} from "../util/common.js";

export default class Filter extends ComponentView {
  constructor(filters) {
    super();
    this._filters = filters;
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
