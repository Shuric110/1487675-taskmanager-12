import SmartComponentView from "./smart-component.js";
import {isTaskRepeating, formatTaskDueDate} from "../util/task.js";
import {escapeHtml} from "../util/common.js";
import {COLORS} from "../const.js";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_TASK = {
  description: ``,
  dueDate: null,
  color: `black`,
  repeatingDays: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false
  },
  isArchive: false,
  isFavorite: false
};

const createTaskEditorDateTemplate = function (data) {
  return `
    <button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${data.hasDueDate ? `yes` : `no`}</span>
    </button>

    ${data.hasDueDate ? `
        <fieldset class="card__date-deadline">
          <label class="card__input-deadline-wrap">
            <input
              class="card__date"
              type="text"
              placeholder=""
              name="date"
              value="${formatTaskDueDate(data.dueDate)}"
            />
          </label>
        </fieldset>
      ` : ``}
  `;
};

const createTaskEditorRepeatingDaysTemplate = function (data) {
  return `
    <button class="card__repeat-toggle" type="button">
      repeat:<span class="card__repeat-status">${data.isRepeating ? `yes` : `no`}</span>
    </button>

    ${data.isRepeating ? `
      <fieldset class="card__repeat-days">
        <div class="card__repeat-days-inner">
          ${Object.entries(data.repeatingDays).map(([day, repeat]) => `
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
    ` : ``}
  `;
};

const createTaskEditorColorsTemplate = function (data) {
  return COLORS.map((color) => `
    <input
      type="radio"
      id="color-${color}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${color === data.color ? `checked` : ``}
    />
    <label
      for="color-${color}"
      class="card__color card__color--${color}"
      >${color}</label
    >
  `).join(``);
};

const createTaskEditorTemplate = function (data) {
  const {description, color, isRepeating} = data;

  const taskDateTemplate = createTaskEditorDateTemplate(data);
  const taskRepeatingDaysTemplate = createTaskEditorRepeatingDaysTemplate(data);
  const taskColorsTemplate = createTaskEditorColorsTemplate(data);

  const repeatingClass = isRepeating ? `card--repeat` : ``;
  const colorClass = `card--${color}`;

  const saveDisabledAttribute =
    data.isRepeating && !isTaskRepeating(data)
    || data.hasDueDate && data.dueDate === null
      ? `disabled` : ``;

  return `
    <article class="card card--edit ${colorClass} ${repeatingClass}">
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
            <button class="card__save" type="submit" ${saveDisabledAttribute}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>
  `;
};

export default class TaskEditor extends SmartComponentView {
  constructor(task = BLANK_TASK) {
    super();

    this._data = TaskEditor.convertTaskToData(task);

    this._datePicker = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._repeatingButtonClickHandler = this._repeatingButtonClickHandler.bind(this);
    this._dueDateButtonClickHandler = this._dueDateButtonClickHandler.bind(this);
    this._descriptionChangeHandler = this._descriptionChangeHandler.bind(this);
    this._colorChangeHandler = this._colorChangeHandler.bind(this);
    this._repeatChangeHandler = this._repeatChangeHandler.bind(this);
    this._dueDateChangeHandler = this._dueDateChangeHandler.bind(this);
  }

  getTemplate() {
    return createTaskEditorTemplate(this._data);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _repeatingButtonClickHandler(evt) {
    evt.preventDefault();
    this._updateData({
      isRepeating: !this._data.isRepeating,
      hasDueDate: false
    });
  }

  _dueDateButtonClickHandler(evt) {
    evt.preventDefault();
    this._updateData({
      hasDueDate: !this._data.hasDueDate,
      isRepeating: false
    });
  }

  _descriptionChangeHandler(evt) {
    this._updateData({description: evt.target.value}, false);
  }

  _colorChangeHandler(evt) {
    this._updateData({color: evt.target.value});
  }

  _repeatChangeHandler(evt) {
    this._updateData({
      repeatingDays: Object.assign(
          {},
          this._data.repeatingDays,
          {[evt.target.value]: evt.target.checked}
      )
    }, false);
  }

  _dueDateChangeHandler(selectedDates) {
    this._updateData({
      dueDate: selectedDates[0]
    });
  }

  _setDatePicker() {
    if (this._datePicker) {
      this._datePicker.destroy();
      this._datePicker = null;
    }

    if (this._data.hasDueDate) {
      this._datePicker = flatpickr(
          this.getElement().querySelector(`.card__date`),
          {
            dateFormat: `j F`,
            defaultDate: this._data.dueDate,
            onChange: this._dueDateChangeHandler
          }
      );
    }
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._repeatingButtonClickHandler);
    this.getElement().querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._dueDateButtonClickHandler);

    this.getElement().querySelector(`.card__text`).addEventListener(`change`, this._descriptionChangeHandler);
    this.getElement().querySelector(`.card__colors-wrap`).addEventListener(`change`, this._colorChangeHandler);
    if (this._data.isRepeating) {
      this.getElement().querySelector(`.card__repeat-days-inner`).addEventListener(`change`, this._repeatChangeHandler);
    }

    this._setDatePicker();
  }

  static convertTaskToData(task) {
    return Object.assign(
        {},
        task,
        {
          isRepeating: isTaskRepeating(task),
          hasDueDate: Boolean(task.dueDate)
        }
    );
  }

  static convertDataToTask(data) {
    const result = Object.assign({}, data);

    if (!result.isRepeating) {
      Object.assign(result.repeatingDays, BLANK_TASK.repeatingDays);
    }
    if (!result.hasDueDate) {
      result.dueDate = null;
    }

    delete result.isRepeating;
    delete result.hasDueDate;

    return result;
  }
}
