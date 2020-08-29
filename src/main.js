import MenuView from "./view/menu.js";

import BoardModel from "./model/board.js";
import TasksModel from "./model/tasks.js";

import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";

import {RenderPosition, render} from "./util/render.js";

import {generateTasks} from "./mock/task.js";

const TASK_COUNT = 20;

const tasks = generateTasks(TASK_COUNT);

const boardModel = new BoardModel();
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(mainElement, tasksModel, boardModel);
const filterPresenter = new FilterPresenter(mainElement, tasksModel, boardModel);

render(mainControlElement, new MenuView(), RenderPosition.BEFOREEND);

filterPresenter.init();
boardPresenter.init();

document.querySelector(`#control__new-task`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  boardPresenter.createTask();
});
