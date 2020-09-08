import MenuView from "./view/menu.js";
import StatisticsView from "./view/statistics.js";

import BoardModel from "./model/board.js";
import TasksModel from "./model/tasks.js";

import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";

import {RenderPosition, render, remove} from "./util/render.js";

import {MenuItem} from "./const.js";

import {generateTasks} from "./mock/task.js";

const TASK_COUNT = 20;

const tasks = generateTasks(TASK_COUNT);

const boardModel = new BoardModel();
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

const menuComponent = new MenuView();

const boardPresenter = new BoardPresenter(mainElement, tasksModel, boardModel);
const filterPresenter = new FilterPresenter(mainElement, tasksModel, boardModel);

let statisticsComponent = null;

const onNewTaskFormClose = function () {
  menuComponent.setActiveItem(MenuItem.TASKS);
};

const onMenuClick = function (menuItem) {
  switch (menuItem) {
    case MenuItem.ADD_NEW_TASK:
      if (statisticsComponent) {
        remove(statisticsComponent);
        statisticsComponent = null;
        boardPresenter.init();
      }
      boardPresenter.createTask(onNewTaskFormClose);
      break;
    case MenuItem.TASKS:
      if (statisticsComponent) {
        remove(statisticsComponent);
        statisticsComponent = null;
        boardPresenter.init();
      }
      boardPresenter.cancelCreateTask();
      break;
    case MenuItem.STATISTICS:
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(tasksModel.getTasks());
      render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);
      statisticsComponent.renderCharts();
      break;
  }
};

menuComponent.setMenuClickHandler(onMenuClick);
render(mainControlElement, menuComponent, RenderPosition.BEFOREEND);

filterPresenter.init();
boardPresenter.init();
