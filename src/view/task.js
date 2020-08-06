import {escapeHtml, formatTaskDueDate, isTaskExpired, isTaskRepeating} from "../util.js";

export const createTaskTemplate = function (task) {
  const {description, dueDate, color, isArchive, isFavorite} = task;

  const displayDueDate = formatTaskDueDate(dueDate);
  const colorClass = `card--${color}`;
  const archiveClass = isArchive ? `card__btn--disabled` : ``;
  const favoriteClass = isFavorite ? `card__btn--disabled` : ``;
  const deadlineClass = isTaskExpired(task) ? `card--deadline` : ``;
  const repeatingClass = isTaskRepeating(task) ? `card--repeat` : ``;

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
};
