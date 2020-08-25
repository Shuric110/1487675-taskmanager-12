import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import NoTasksView from "../view/no-tasks.js";
import TaskListView from "../view/task-list.js";
import LoadMoreView from "../view/load-more.js";

import TaskPresenter from "./task";

import {RenderPosition, render, remove} from "../util/render.js";
import {updateItem} from "../util/common.js";
import {SORT_TYPES} from "../const.js";


const TASK_LOAD_COUNT = 8;

export default class Board {
  constructor(container) {
    this._boardContainer = container;

    this._boardComponent = new BoardView();
    this._taskListComponent = new TaskListView();
    this._loadMoreComponent = new LoadMoreView();
    this._sortComponent = new SortView();
    this._noTaskComponent = new NoTasksView();

    this._currentSortMode = `default`;

    this._taskPresenters = {};

    this._onLoadMoreClick = this._onLoadMoreClick.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this._onTaskChange = this._onTaskChange.bind(this);
    this._onTaskModeChange = this._onTaskModeChange.bind(this);
  }

  init(tasks) {
    this._tasks = tasks.slice();
    this._sourceTasks = tasks.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderBoardContent();
  }


  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent);
    taskPresenter.init(task);
    taskPresenter.setDataChangeHandler(this._onTaskChange);
    taskPresenter.setModeChangeHandler(this._onTaskModeChange);

    this._taskPresenters[task.id] = taskPresenter;
  }

  _renderTasks(count) {
    const firstTaskIndex = this._renderedTasksCount;
    const lastTaskIndex = Math.min(this._tasks.length - 1, firstTaskIndex + count - 1);

    for (let i = firstTaskIndex; i <= lastTaskIndex; i++) {
      this._renderTask(this._tasks[i]);
    }

    this._renderedTasksCount = lastTaskIndex + 1;

    if (this._renderedTasksCount >= this._tasks.length) {
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
    updateItem(this._tasks, newTask);
    updateItem(this._sourceTasks, newTask);
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
    if (sortMode === this._currentSortMode) {
      return;
    }

    this._sortTasks(sortMode);
    this._clearTaskListContent();
    this._renderTaskListContent();

    this._currentSortMode = sortMode;
  }

  _sortTasks(sortMode) {
    const {compare} = SORT_TYPES[sortMode];
    if (!compare) {
      // Если функция сравнения не определена, то подразумевается сортировка по умолчанию
      this._tasks = this._sourceTasks.slice();
    } else {
      this._tasks.sort(compare);
    }
  }

  _renderLoadMore() {
    render(this._boardComponent, this._loadMoreComponent, RenderPosition.BEFOREEND);
    this._loadMoreComponent.setButtonClickHandler(this._onLoadMoreClick);
  }

  _renderTaskListContent() {
    this._renderedTasksCount = 0;
    this._renderTasks(TASK_LOAD_COUNT);

    if (this._renderedTasksCount < this._tasks.length && !this._loadMoreComponent.getHasElement()) {
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
    if (this._tasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND);
    this._renderTaskListContent();
  }
}
