import {escapeHtml} from "../util.js";

export const createFilterTemplate = function (filters) {
  return `
    <section class="main__filter filter container">
      ${filters.map(({code, displayName, tasksCount}) => `
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
};
