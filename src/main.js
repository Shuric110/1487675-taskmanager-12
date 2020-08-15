import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";

import BoardPresenter from "./presenter/board.js";

import {RenderPosition, render} from "./util/render.js";

import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";

const TASK_COUNT = 20;

let tasks = generateTasks(TASK_COUNT);
let filters = generateFilters(tasks);

const mainElement = document.querySelector(`.main`);
const mainControlElement = mainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(mainElement);

render(mainControlElement, new MenuView(), RenderPosition.BEFOREEND);
render(mainElement, new FilterView(filters), RenderPosition.BEFOREEND);

boardPresenter.init(tasks);
