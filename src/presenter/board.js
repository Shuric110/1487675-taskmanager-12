import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import NoTasksView from "../view/no-tasks.js";
import TaskListView from "../view/task-list.js";
import LoadMoreView from "../view/load-more.js";

import TaskPresenter from "./task.js";
import TaskNewPresenter from "./task-new.js";

import {SortType, FilterType} from "../model/board.js";

import {RenderPosition, render, remove} from "../util/render.js";
import {UpdateAction} from "../const.js";


const TASK_LOAD_COUNT = 8;

export default class Board {
  constructor(container, tasksModel, boardModel) {
    this._boardContainer = container;
    this._tasksModel = tasksModel;
    this._boardModel = boardModel;
    this._tasks = null;

    this._sortComponent = null;

    this._boardComponent = new BoardView();
    this._taskListComponent = new TaskListView();
    this._loadMoreComponent = new LoadMoreView();
    this._noTaskComponent = new NoTasksView();

    this._currentSort = null;
    this._currentFilter = null;

    this._onViewAction = this._onViewAction.bind(this);
    this._onModelEvent = this._onModelEvent.bind(this);
    this._onLoadMoreClick = this._onLoadMoreClick.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this._onTaskModeChange = this._onTaskModeChange.bind(this);

    this._taskPresenters = {};
    this._taskNewPresenter = new TaskNewPresenter(this._taskListComponent);
    this._taskNewPresenter.setDataChangeHandler(this._onViewAction);

    this._tasksModel.addObserver(this._onModelEvent);
    this._boardModel.addObserver(this._onModelEvent);
  }

  init() {
    this._currentSort = this._boardModel.getSort();
    this._currentFilter = this._boardModel.getFilter();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderBoardContent();
  }

  createTask() {
    this._boardModel.setFilter(FilterType.ALL);
    this._boardModel.setSort(SortType.DEFAULT);
    this._taskNewPresenter.init();
  }

  _getTasks() {
    if (this._tasks === null) {
      this._tasks = this._tasksModel.getTasks().slice().filter(this._currentFilter.filter);

      const {compare} = this._currentSort;
      if (compare) { // Если функция сравнения не определена, то не сортируем - подразумевается сортировка по умолчанию
        this._tasks.sort(compare);
      }
    }
    return this._tasks;
  }

  _onViewAction(updateAction, update) {
    switch (updateAction) {
      case UpdateAction.TASK_ADD:
        this._tasksModel.addTask(update);
        break;
      case UpdateAction.TASK_UPDATE:
        this._tasksModel.updateTask(update);
        break;
      case UpdateAction.TASK_DELETE:
        this._tasksModel.deleteTask(update);
        break;
    }
  }

  _onModelEvent(updateAction, update) {
    switch (updateAction) {
      case UpdateAction.TASK_ADD:
        this._refreshBoard(true);
        break;

      case UpdateAction.TASK_UPDATE:
        const oldTask = this._tasks.find((task) => task.id === update.id);
        const sortDiff = this._currentSort.compare ? this._currentSort.compare(oldTask, update) : 0;
        const isFiltered = this._currentFilter.filter
          ? this._currentFilter.filter(oldTask) !== this._currentFilter.filter(update)
          : false;

        if (sortDiff > 0 | sortDiff < 0 || isFiltered) {
          // Изменилось расположение согласно сортировке или фильтру - перерисовываем список задач
          this._refreshBoard(true);
        } else {
          // Задача на прежнем месте, просто обновим её
          const taskIndex = this._tasks.findIndex((task) => task.id === update.id);
          this._tasks[taskIndex] = update;
          if (this._taskPresenters[update.id]) {
            this._taskPresenters[update.id].init(update);
          }
        }
        break;

      case UpdateAction.TASK_DELETE:
        this._tasks = null;
        if (this._taskPresenters[update.id]) {
          this._taskPresenters[update.id].destroy();
          delete this._taskPresenters[update.id];
          this._renderedTasksCount--;
          this._renderTasks(1);
        } else {
          this._renderTasks(0);
        }
        break;

      case UpdateAction.FILTER_UPDATE:
        this._currentFilter = update;
        this._refreshBoard(false);
        break;

      case UpdateAction.SORT_UPDATE:
        this._currentSort = update;
        this._refreshBoard(false);
        break;
    }
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
    this._sortComponent = new SortView(this._boardModel.getSortDefinitions(), this._currentSort);
    render(this._boardComponent, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortChangeHandler(this._onSortChange);
  }

  _onTaskModeChange(editingTaskPresenter, isEditing) {
    if (isEditing) {
      this._taskNewPresenter.destroy();
      Object.values(this._taskPresenters).forEach(function (taskPresenter) {
        taskPresenter.resetView();
      });
    }
  }

  _onLoadMoreClick() {
    this._renderTasks(TASK_LOAD_COUNT);
  }

  _onSortChange(sortType) {
    if (sortType !== this._currentSort.code) {
      this._boardModel.setSort(sortType);
    }
  }

  _renderLoadMore() {
    render(this._boardComponent, this._loadMoreComponent, RenderPosition.BEFOREEND);
    this._loadMoreComponent.setButtonClickHandler(this._onLoadMoreClick);
  }

  _refreshBoard(keepRenderedTasksCount = false) {
    this._clearBoardContent();
    if (!keepRenderedTasksCount) {
      this._renderedTasksCount = 0;
    }
    this._tasks = null;
    this._renderBoardContent();
  }

  _clearBoardContent() {
    Object.values(this._taskPresenters).forEach(function (taskPresenter) {
      taskPresenter.destroy();
    });

    remove(this._taskListComponent);
    remove(this._sortComponent);
    remove(this._noTaskComponent);
    remove(this._loadMoreComponent);
  }

  _renderBoardContent() {
    const tasks = this._getTasks();

    if (tasks.length === 0) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();

    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND);

    const tasksToRender = this._renderedTasksCount || TASK_LOAD_COUNT;
    this._renderedTasksCount = 0;
    this._renderTasks(tasksToRender);

    if (this._renderedTasksCount < this._getTasks().length) {
      this._renderLoadMore();
    }
  }
}
