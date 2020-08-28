import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import NoTasksView from "../view/no-tasks.js";
import TaskListView from "../view/task-list.js";
import LoadMoreView from "../view/load-more.js";

import TaskPresenter from "./task";

import {RenderPosition, render, remove} from "../util/render.js";
import {SORT_TYPES} from "../const.js";


const TASK_LOAD_COUNT = 8;

export default class Board {
  constructor(container, tasksModel) {
    this._boardContainer = container;
    this._tasksModel = tasksModel;
    this._tasks = null;

    this._boardComponent = new BoardView();
    this._taskListComponent = new TaskListView();
    this._loadMoreComponent = new LoadMoreView();
    this._sortComponent = new SortView();
    this._noTaskComponent = new NoTasksView();

    this._currentSortMode = `default`;

    this._taskPresenters = {};

    this._onViewAction = this._onViewAction.bind(this);
    this._onModelEvent = this._onModelEvent.bind(this);
    this._onLoadMoreClick = this._onLoadMoreClick.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this._onTaskChange = this._onTaskChange.bind(this);
    this._onTaskModeChange = this._onTaskModeChange.bind(this);

    this._tasksModel.addObserver(this._onModelEvent);
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderBoardContent();
  }


  _getTasks() {
    if (this._tasks === null) {
      this._tasks = this._tasksModel.getTasks().slice();

      const {compare} = SORT_TYPES[this._currentSortMode];
      if (compare) { // Если функция сравнения не определена, то не сортируем - подразумевается сортировка по умолчанию
        this._tasks.sort(compare);
      }
    }
    return this._tasks;
  }

  _onViewAction(updateAction, update) {

  }

  _onModelEvent(updateAction, update) {

  }

  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent);
    taskPresenter.init(task);
    taskPresenter.setDataChangeHandler(this._onViewAction);
    taskPresenter.setModeChangeHandler(this._onTaskModeChange);

    this._taskPresenters[task.id] = taskPresenter;
  }

  _renderTasks(count) {
    const nextTasks = this._getTasks().slice(this._renderedTasksCount, this._renderedTasksCount + count);
    nextTasks.forEach((task) => {
      this._renderTask(task);
    });

    this._renderedTasksCount += nextTasks.length;

    if (this._renderedTasksCount >= this._getTasks().length) {
      remove(this._loadMoreComponent);
    }
  }

  _renderNoTasks() {
    render(this._boardContainer, this._noTaskComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortChangeHandler(this._onSortChange);
  }

  _onTaskChange(newTask) {
    // ****** тут обновление таска через модель!

    this._taskPresenters[newTask.id].init(newTask);
  }

  _onTaskModeChange(editingTaskPresenter, isEditing) {
    if (isEditing) {
      Object.values(this._taskPresenters).forEach(function (taskPresenter) {
        taskPresenter.resetView();
      });
    }
  }

  _onLoadMoreClick() {
    this._renderTasks(TASK_LOAD_COUNT);
  }

  _onSortChange(sortMode) {
    // ****** потом здесь вызывать изменение сортировки в модели
    if (sortMode === this._currentSortMode) {
      return;
    }

    this._sortTasks(sortMode);
    this._clearTaskListContent();
    this._renderTaskListContent();
  }

  _sortTasks(sortMode) {
    this._currentSortMode = sortMode;
    this._tasks = null;
  }

  _renderLoadMore() {
    render(this._boardComponent, this._loadMoreComponent, RenderPosition.BEFOREEND);
    this._loadMoreComponent.setButtonClickHandler(this._onLoadMoreClick);
  }

  _renderTaskListContent() {
    this._renderedTasksCount = 0;
    this._renderTasks(TASK_LOAD_COUNT);

    if (this._renderedTasksCount < this._getTasks().length && !this._loadMoreComponent.getHasElement()) {
      this._renderLoadMore();
    }
  }

  _clearTaskListContent() {
    this._taskListComponent.getElement().innerHTML = ``;
    Object.values(this._taskPresenters).forEach(function (taskPresenter) {
      taskPresenter.destroy();
    });

  }

  _renderBoardContent() {
    if (this._getTasks().every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND);
    this._renderTaskListContent();
  }
}
