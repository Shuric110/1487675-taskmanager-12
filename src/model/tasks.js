import Observable from "../util/observable.js";
import {UpdateAction} from "../const.js";

export default class Tasks extends Observable {
  constructor() {
    super();
    this._tasks = [];
  }

  setTasks(tasks) {
    this._tasks = tasks.slice();
  }

  getTasks() {
    return this._tasks;
  }

  updateTask(update) {
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._tasks = this._tasks.slice();
    this._tasks.splice(index, 1, update);

    this._notify(UpdateAction.TASK_UPDATE, update);
  }

  addTask(update) {
    this._tasks = this._tasks.slice();
    this._tasks.splice(0, 0, update);

    this._notify(UpdateAction.TASK_ADD, update);
  }

  deleteTask(update) {
    const index = this._tasks.findIndex((task) => task.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._tasks = this._tasks.slice();
    this._tasks.splice(index, 1);

    this._notify(UpdateAction.TASK_DELETE, update);
  }
}
