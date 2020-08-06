import {escapeHtml, formatTaskDueDate, isTaskExpired, isTaskRepeating} from "../util.js";
import {COLORS} from "../const.js";

const createTaskEditorDateTemplate = function (task) {
  return `
    <button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${task.dueDate ? `yes` : `no`}</span>
    </button>

    ${task.dueDate ? `
        <fieldset class="card__date-deadline">
          <label class="card__input-deadline-wrap">
            <input
              class="card__date"
              type="text"
              placeholder=""
              name="date"
              value="${formatTaskDueDate(task.dueDate)}"
            />
          </label>
        </fieldset>
      ` : ``}
  `;
};

const createTaskEditorRepeatingDaysTemplate = function (task) {
  return `
    <button class="card__repeat-toggle" type="button">
      repeat:<span class="card__repeat-status">${isTaskRepeating(task) ? `yes` : `no`}</span>
    </button>

    <fieldset class="card__repeat-days">
      <div class="card__repeat-days-inner">
        ${Object.entries(task.repeatingDays).map(([day, repeat]) => `
          <input
            class="visually-hidden card__repeat-day-input"
            type="checkbox"
            id="repeat-${day}"
            name="repeat"
            value="${day}"
            ${repeat ? `checked` : ``}
          />
          <label class="card__repeat-day" for="repeat-${day}"
            >${day}</label
          >
        `).join(``) }
      </div>
    </fieldset>
  `;
};

const createTaskEditorColorsTemplate = function (task) {
  return COLORS.map((color) => `
    <input
      type="radio"
      id="color-${color}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${color === task.color ? `checked` : ``}
    />
    <label
      for="color-${color}"
      class="card__color card__color--${color}"
      >${color}</label
    >
  `).join(``);
};

export const createTaskEditorTemplate = function (task) {
  if (!task) {
    task = {
      description: ``,
      dueDate: null,
      color: `black`,
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false
      },
      isArchive: false,
      isFavorite: false
    };
  }

  const {description, color} = task;

  const taskDateTemplate = createTaskEditorDateTemplate(task);
  const taskRepeatingDaysTemplate = createTaskEditorRepeatingDaysTemplate(task);
  const taskColorsTemplate = createTaskEditorColorsTemplate(task);

  const deadlineClass = isTaskExpired(task) ? `card--deadline` : ``;
  const repeatingClass = isTaskRepeating(task) ? `card--repeat` : ``;
  const colorClass = `card--${color}`;

  return `
    <article class="card card--edit ${colorClass} ${repeatingClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${escapeHtml(description)}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                ${taskDateTemplate}
                ${taskRepeatingDaysTemplate}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${taskColorsTemplate}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>
  `;
};
