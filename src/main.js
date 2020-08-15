import MenuView from "./view/menu.js";

import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort.js";
import NoTasksView from "./view/no-tasks.js";
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

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

const renderTask = function (taskListElement, task) {
  const taskComponent = new TaskView(task);
  let taskEditorComponent;

  const onEscKeyDown = function (evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      switchToView();
    }
  };

  const switchToEdit = function () {
    if (!taskEditorComponent) {
      taskEditorComponent = new TaskEditorView(task);

      taskEditorComponent.getElement().querySelector(`form`).addEventListener(`submit`, function (evt) {
        evt.preventDefault();
        switchToView();
      });

      taskListElement.replaceChild(taskEditorComponent.getElement(), taskComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    }
  };

  const switchToView = function () {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditorComponent.getElement());
    taskEditorComponent = null;
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, function () {
    switchToEdit();
  });

  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderBoard = function (boardContainer, boardTasks) {
  const boardElement = new BoardView().getElement();
  render(boardContainer, boardElement, RenderPosition.BEFOREEND);

  if (boardTasks.every((task) => task.isArchive)) {
    render(boardContainer, new NoTasksView().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  let renderedTasksCount = 0;
  let loadMoreButton;

  const renderTasks = function (count) {
    const firstTaskIndex = renderedTasksCount;
    const lastTaskIndex = Math.min(boardTasks.length - 1, firstTaskIndex + count - 1);

    for (let i = firstTaskIndex; i <= lastTaskIndex; i++) {
      renderTask(taskListElement, boardTasks[i]);
    }

    renderedTasksCount = lastTaskIndex + 1;

    if (renderedTasksCount >= boardTasks.length) {
      loadMoreButton.remove();
    }
  };

  const taskListElement = new TaskListView().getElement();

  render(boardElement, new SortView().getElement(), RenderPosition.BEFOREEND);
  render(boardElement, taskListElement, RenderPosition.BEFOREEND);

  renderTasks(TASK_LOAD_COUNT);

  if (renderedTasksCount < boardTasks.length) {
    loadMoreButton = new LoadMoreView().getElement();
    render(boardElement, loadMoreButton, RenderPosition.BEFOREEND);

    loadMoreButton.addEventListener(`click`, function (evt) {
      evt.preventDefault();
      renderTasks(TASK_LOAD_COUNT);
    });
  }
};

render(mainControlElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

renderBoard(mainElement, tasks);
