import TaskEditorView from "../view/task-editor.js";

import {RenderPosition, render, remove} from "../util/render.js";
import {UpdateAction} from "../const.js";

export default class TaskNew {
  constructor(taskContainer) {
    this._taskContainer = taskContainer;

    this._taskEditorComponent = null;

    this._dataChangeHandler = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onFormSubmit = this._onFormSubmit.bind(this);
    this._onDeleteClick = this._onDeleteClick.bind(this);
  }

  setDataChangeHandler(dataChangeHandler) {
    this._dataChangeHandler = dataChangeHandler;
  }

  init(formCloseHandler) {
    this._formCloseHandler = formCloseHandler;

    this._taskEditorComponent = new TaskEditorView();
    this._taskEditorComponent.setFormSubmitHandler(this._onFormSubmit);
    this._taskEditorComponent.setDeleteClickHandler(this._onDeleteClick);

    render(this._taskContainer, this._taskEditorComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }

  _onDeleteClick() {
    if (this._dataChangeHandler) {
      this.destroy();
    }
  }

  _onFormSubmit(task) {
    if (this._dataChangeHandler) {
      this._dataChangeHandler(
          UpdateAction.TASK_ADD,
          task
      );
    }
  }

  setSaving() {
    this._taskEditorComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    this._taskEditorComponent.shake(() => {
      this._taskEditorComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    });
  }

  destroy() {
    if (this._taskEditorComponent) {
      remove(this._taskEditorComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      if (this._formCloseHandler) {
        this._formCloseHandler();
        this._formCloseHandler = null;
      }
      this._taskEditorComponent = null;
    }
  }
}
