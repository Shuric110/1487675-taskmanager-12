import ComponentView from "./component.js";
import {formatTaskDueDate, isTaskExpired, isTaskRepeating} from "../util/task.js";
import {escapeHtml} from "../util/common.js";

export default class Task extends ComponentView {
  constructor(task) {
    super();
    this._task = task;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favouriteClickHandler = this._favouriteClickHandler.bind(this);
    this._archiveClickHandler = this._archiveClickHandler.bind(this);
  }

  getTemplate() {
    const {description, dueDate, color, isArchive, isFavorite} = this._task;

    const displayDueDate = formatTaskDueDate(dueDate);
    const colorClass = `card--${color}`;
    const archiveClass = isArchive ? `card__btn--disabled` : ``;
    const favoriteClass = isFavorite ? `card__btn--disabled` : ``;
    const deadlineClass = isTaskExpired(this._task) ? `card--deadline` : ``;
    const repeatingClass = isTaskRepeating(this._task) ? `card--repeat` : ``;

    return `
      <article class="card ${colorClass} ${deadlineClass} ${repeatingClass}">
        <div class="card__form">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--edit">
                edit
              </button>
              <button type="button" class="card__btn card__btn--archive ${archiveClass}">
                archive
              </button>
              <button
                type="button"
                class="card__btn card__btn--favorites ${favoriteClass}"
              >
                favorites
              </button>
            </div>

            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>

            <div class="card__textarea-wrap">
              <p class="card__text">${escapeHtml(description)}</p>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <div class="card__date-deadline">
                    <p class="card__input-deadline-wrap">
                      <span class="card__date">${displayDueDate}</span>

                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  _favouriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favouriteClick();
  }

  _archiveClickHandler(evt) {
    evt.preventDefault();
    this._callback.archiveClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, this._editClickHandler);
  }

  setFavouriteClickHandler(callback) {
    this._callback.favouriteClick = callback;
    this.getElement().querySelector(`.card__btn--favorites`).addEventListener(`click`, this._favouriteClickHandler);
  }

  setArchiveClickHandler(callback) {
    this._callback.archiveClick = callback;
    this.getElement().querySelector(`.card__btn--archive`).addEventListener(`click`, this._archiveClickHandler);
  }
}
