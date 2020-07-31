import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createBoardTemplate} from "./view/board.js";
import {createSortTemplate} from "./view/sort.js";
import {createTaskEditorTemplate} from "./view/task-editor.js";
import {createTaskTemplate} from "./view/task.js";
import {createLoadMoreTemplate} from "./view/load-more.js";

const TASK_COUNT = 3;

const renderTemplate = function (container, position, template) {
  container.insertAdjacentHTML(position, template);
};


const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

renderTemplate(mainControlElement, `beforeend`, createMenuTemplate());
renderTemplate(mainElement, `beforeend`, createFilterTemplate());
renderTemplate(mainElement, `beforeend`, createBoardTemplate());

const boardElement = mainElement.querySelector(`.board`);
const boardSortListElement = boardElement.querySelector(`.board__filter-list`);
const boardTaskListElement = boardElement.querySelector(`.board__tasks`);

renderTemplate(boardSortListElement, `beforeend`, createSortTemplate());
renderTemplate(boardTaskListElement, `beforeend`, createTaskEditorTemplate());

for (let i = 0; i < TASK_COUNT; i++) {
  renderTemplate(boardTaskListElement, `beforeend`, createTaskTemplate());
}

renderTemplate(boardElement, `beforeend`, createLoadMoreTemplate());
