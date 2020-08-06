import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createBoardTemplate} from "./view/board.js";
import {createSortTemplate} from "./view/sort.js";
import {createTaskEditorTemplate} from "./view/task-editor.js";
import {createTaskTemplate} from "./view/task.js";
import {createLoadMoreTemplate} from "./view/load-more.js";

import {render} from "./util.js";

import {generateTasks} from "./mock/task.js";

const TASK_COUNT = 20;
const TASK_LOAD_COUNT = 8;

let tasks = generateTasks(TASK_COUNT);
let renderedTasks = 0;
let loadMoreButton;

const renderTasks = function (count) {
  const firstTaskIndex = renderedTasks;
  const lastTaskIndex = Math.min(tasks.length - 1, firstTaskIndex + count - 1);

  for (let i = firstTaskIndex; i <= lastTaskIndex; i++) {
    render(boardTaskListElement, `beforeend`, createTaskTemplate(tasks[i]));
  }

  renderedTasks = lastTaskIndex + 1;

  if (renderedTasks >= tasks.length) {
    loadMoreButton.remove();
  }
};

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

render(mainControlElement, `beforeend`, createMenuTemplate());
render(mainElement, `beforeend`, createFilterTemplate());
render(mainElement, `beforeend`, createBoardTemplate());

const boardElement = mainElement.querySelector(`.board`);
const boardSortListElement = boardElement.querySelector(`.board__filter-list`);
const boardTaskListElement = boardElement.querySelector(`.board__tasks`);

render(boardSortListElement, `beforeend`, createSortTemplate());

render(boardTaskListElement, `beforeend`, createTaskEditorTemplate(tasks[0]));
renderedTasks++;
renderTasks(TASK_LOAD_COUNT - 1);

if (renderedTasks < tasks.length) {
  render(boardElement, `beforeend`, createLoadMoreTemplate());
  loadMoreButton = boardElement.querySelector(`.load-more`);

  loadMoreButton.addEventListener(`click`, function (evt) {
    evt.preventDefault();
    renderTasks(TASK_LOAD_COUNT);
  });
}
