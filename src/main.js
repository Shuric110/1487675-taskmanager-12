import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort.js";
import NoTasksView from "./view/no-tasks.js";
import TaskListView from "./view/task-list.js";
import TaskEditorView from "./view/task-editor.js";
import TaskView from "./view/task.js";
import LoadMoreView from "./view/load-more.js";

import {RenderPosition, render, replace, remove} from "./util/render.js";

import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";

const TASK_COUNT = 20;
const TASK_LOAD_COUNT = 8;

let tasks = generateTasks(TASK_COUNT);
let filters = generateFilters(tasks);

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

const renderTask = function (taskListComponent, task) {
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

      taskEditorComponent.setFormSubmitHandler(function () {
        switchToView();
      });

      replace(taskEditorComponent, taskComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    }
  };

  const switchToView = function () {
    replace(taskComponent, taskEditorComponent);
    taskEditorComponent = null;
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  taskComponent.setEditClickHandler(function () {
    switchToEdit();
  });

  render(taskListComponent, taskComponent, RenderPosition.BEFOREEND);
};

const renderBoard = function (boardContainer, boardTasks) {
  const boardComponent = new BoardView();
  render(boardContainer, boardComponent, RenderPosition.BEFOREEND);

  if (boardTasks.every((task) => task.isArchive)) {
    render(boardContainer, new NoTasksView(), RenderPosition.BEFOREEND);
    return;
  }

  let renderedTasksCount = 0;
  let loadMoreButton;

  const renderTasks = function (count) {
    const firstTaskIndex = renderedTasksCount;
    const lastTaskIndex = Math.min(boardTasks.length - 1, firstTaskIndex + count - 1);

    for (let i = firstTaskIndex; i <= lastTaskIndex; i++) {
      renderTask(taskListComponent, boardTasks[i]);
    }

    renderedTasksCount = lastTaskIndex + 1;

    if (renderedTasksCount >= boardTasks.length) {
      remove(loadMoreButton);
    }
  };

  const taskListComponent = new TaskListView();

  render(boardComponent, new SortView(), RenderPosition.BEFOREEND);
  render(boardComponent, taskListComponent, RenderPosition.BEFOREEND);

  renderTasks(TASK_LOAD_COUNT);

  if (renderedTasksCount < boardTasks.length) {
    loadMoreButton = new LoadMoreView();
    render(boardComponent, loadMoreButton, RenderPosition.BEFOREEND);

    loadMoreButton.setButtonClickHandler(function () {
      renderTasks(TASK_LOAD_COUNT);
    });
  }
};

render(mainControlElement, new MenuView(), RenderPosition.BEFOREEND);
render(mainElement, new FilterView(filters), RenderPosition.BEFOREEND);

renderBoard(mainElement, tasks);
