import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import NoTasksView from "../view/no-tasks.js";
import TaskListView from "../view/task-list.js";
import TaskEditorView from "../view/task-editor.js";
import TaskView from "../view/task.js";
import LoadMoreView from "../view/load-more.js";

import {RenderPosition, render, replace, remove} from "../util/render.js";


const TASK_LOAD_COUNT = 8;

export default class Board {
  constructor(container) {
    this._boardContainer = container;

    this._boardComponent = new BoardView();
    this._taskListComponent = new TaskListView();
    this._loadMoreComponent = new LoadMoreView();
    this._sortComponent = new SortView();
    this._noTaskComponent = new NoTasksView();

    this._onLoadMoreClick = this._onLoadMoreClick.bind(this);
  }

  init(tasks) {
    this._tasks = tasks.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    this._renderBoardContent();
  }


  _renderTask(task) {
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

    render(this._taskListComponent, taskComponent, RenderPosition.BEFOREEND);
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
  }

  _onLoadMoreClick() {
    this._renderTasks(TASK_LOAD_COUNT);
  }

  _renderLoadMore() {
    render(this._boardComponent, this._loadMoreComponent, RenderPosition.BEFOREEND);
    this._loadMoreComponent.setButtonClickHandler(this._onLoadMoreClick);
  }

  _renderTaskList() {
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND);
    this._renderedTasksCount = 0;
    this._renderTasks(TASK_LOAD_COUNT);

    if (this._renderedTasksCount < this._tasks.length) {
      this._renderLoadMore();
    }
  }

  _renderBoardContent() {
    if (this._tasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderTaskList();
  }
}
