import MenuView from "./view/menu.js";

import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort.js";
import TaskListView from "./view/task-list.js";
import TaskEditorView from "./view/task-editor.js";
import TaskView from "./view/task.js";
import LoadMoreView from "./view/load-more.js";

import {RenderPosition, render} from "./util.js";

import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";

const TASK_COUNT = 20;
const TASK_LOAD_COUNT = 8;

let tasks = generateTasks(TASK_COUNT);
let filters = generateFilters(tasks);

let renderedTasks = 0;
let loadMoreButton;

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

const renderTask = function (task) {
  const taskComponent = new TaskView(task);
  let taskEditorComponent;

  const switchToEdit = function () {
    if (!taskEditorComponent) {
      taskEditorComponent = new TaskEditorView(task);

      taskEditorComponent.getElement().querySelector(`form`).addEventListener(`submit`, function (evt) {
        evt.preventDefault();
        switchToView();
      });

      taskListElement.replaceChild(taskEditorComponent.getElement(), taskComponent.getElement());
    }
  };

  const switchToView = function () {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditorComponent.getElement());
    taskEditorComponent = null;
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, function () {
    switchToEdit();
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderTasks = function (count) {
  const firstTaskIndex = renderedTasks;
  const lastTaskIndex = Math.min(tasks.length - 1, firstTaskIndex + count - 1);

  for (let i = firstTaskIndex; i <= lastTaskIndex; i++) {
    renderTask(tasks[i]);
  }

  renderedTasks = lastTaskIndex + 1;

  if (renderedTasks >= tasks.length) {
    loadMoreButton.remove();
  }
};

render(mainControlElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

const boardElement = new BoardView().getElement();
const taskListElement = new TaskListView().getElement();

render(mainElement, boardElement, RenderPosition.BEFOREEND);
render(boardElement, new SortView().getElement(), RenderPosition.BEFOREEND);
render(boardElement, taskListElement, RenderPosition.BEFOREEND);

renderTasks(TASK_LOAD_COUNT);

if (renderedTasks < tasks.length) {
  loadMoreButton = new LoadMoreView().getElement();
  render(boardElement, loadMoreButton, RenderPosition.BEFOREEND);

  loadMoreButton.addEventListener(`click`, function (evt) {
    evt.preventDefault();
    renderTasks(TASK_LOAD_COUNT);
  });
}
