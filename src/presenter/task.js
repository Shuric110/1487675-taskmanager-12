import TaskView from "../view/task.js";
import TaskEditorView from "../view/task-editor.js";

import {RenderPosition, replace, replaceOrRender, remove} from "../util/render.js";

export default class Task {
  constructor(taskContainer) {
    this._taskContainer = taskContainer;

    this._taskComponent = null;
    this._taskEditorComponent = null;

    this._dataChangeHandler = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onEditClick = this._onEditClick.bind(this);
    this._onEditorFavouriteClick = this._onEditorFavouriteClick.bind(this);
    this._onEditorArchiveClick = this._onEditorArchiveClick.bind(this);
  }

  setDataChangeHandler(dataChangeHandler) {
    this._dataChangeHandler = dataChangeHandler;
  }

  init(task) {
    this._task = task;

    const oldTaskComponent = this._taskComponent;
    const oldTaskEditorComponent = this._taskEditorComponent;

    this._taskComponent = new TaskView(task);
    this._taskEditorComponent = null;

    this._taskComponent.setEditClickHandler(this._onEditClick);
    this._taskComponent.setFavouriteClickHandler(this._onEditorFavouriteClick);
    this._taskComponent.setArchiveClickHandler(this._onEditorArchiveClick);

    if (oldTaskEditorComponent) {
      this._makeEditor(oldTaskEditorComponent);
    } else {
      replaceOrRender(this._taskContainer, this._taskComponent, oldTaskComponent, RenderPosition.BEFOREEND);
    }

    remove(oldTaskComponent);
    remove(oldTaskEditorComponent);
  }

  _makeEditor(insteadComponent) {
    this._taskEditorComponent = new TaskEditorView(this._task);
    this._taskEditorComponent.setFormSubmitHandler(this._onFormSubmit);
    document.addEventListener(`keydown`, this._onEscKeyDown);

    replace(this._taskEditorComponent, insteadComponent);
  }

  _switchToView() {
    replace(this._taskComponent, this._taskEditorComponent);

    this._taskEditorComponent = null;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._switchToView();
    }
  }

  _onFormSubmit() {
    this._switchToView();
  }

  _onEditClick() {
    this._makeEditor(this._taskComponent);
  }

  _onEditorFavouriteClick() {
    if (this._dataChangeHandler) {
      this._dataChangeHandler(Object.assign({}, this._task, {isFavorite: !this._task.isFavorite}));
    }
  }

  _onEditorArchiveClick() {
    if (this._dataChangeHandler) {
      this._dataChangeHandler(Object.assign({}, this._task, {isArchive: !this._task.isArchive}));
    }
  }

  destroy() {
    remove(this._taskComponent);
    remove(this._taskEditorComponent);
  }
}
