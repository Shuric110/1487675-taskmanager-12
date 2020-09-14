import MenuView from "./view/menu.js";
import StatisticsView from "./view/statistics.js";

import BoardModel from "./model/board.js";
import TasksModel from "./model/tasks.js";

import BoardPresenter from "./presenter/board.js";
import FilterPresenter from "./presenter/filter.js";

import {RenderPosition, render, remove} from "./util/render.js";

import {MenuItem} from "./const.js";

import TasksApi from "./util/tasks-api.js";
import ApiAdapter from "./util/api-adapter.js";

const API_AUTH_TOKEN = `df5gd4lh3jh3ljk4j`;
const API_URL = `https://12.ecmascript.pages.academy/task-manager`;

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

const api = new TasksApi(API_URL, API_AUTH_TOKEN);
const apiAdapter = new ApiAdapter(api);

const boardModel = new BoardModel();
const tasksModel = new TasksModel();


const menuComponent = new MenuView();

const boardPresenter = new BoardPresenter(mainElement, tasksModel, boardModel, apiAdapter);
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

filterPresenter.init();
boardPresenter.init();

apiAdapter.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
  })
  .catch(() => {
    tasksModel.setTasks([]);
  })
  .finally(() => {
    menuComponent.setMenuClickHandler(onMenuClick);
    render(mainControlElement, menuComponent, RenderPosition.BEFOREEND);
  });
