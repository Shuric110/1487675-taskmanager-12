import {nanoid} from "nanoid";

const getSyncedTasks = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTasks() {
    if (Provider.isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          this._store.setItems(createStoreStructure(tasks));
          return tasks;
        });
    }

    return Promise.resolve(Object.values(this._store.getItems()));
  }

  updateTask(task) {
    if (Provider.isOnline()) {
      return this._api.updateTask(task)
        .then((updatedTask) => {
          this._store.setItem(updatedTask.id, updatedTask);
          return updatedTask;
        });
    }

    this._store.setItem(task.id, task);
    return Promise.resolve(task);
  }

  addTask(task) {
    if (Provider.isOnline()) {
      return this._api.addTask(task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask);
          return newTask;
        });
    }

    const localNewTaskId = nanoid();
    const localNewTask = Object.assign({}, task, {id: localNewTaskId});

    this._store.setItem(localNewTask.id, localNewTask);

    return Promise.resolve(localNewTask);
  }

  deleteTask(task) {
    if (Provider.isOnline()) {
      return this._api.deleteTask(task)
        .then(() => this._store.removeItem(task.id));
    }

    this._store.removeItem(task.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storeTasks = Object.values(this._store.getItems());

      return this._api.sync(storeTasks)
        .then((response) => {
          const createdTasks = getSyncedTasks(response.created);
          const updatedTasks = getSyncedTasks(response.updated);

          const items = createStoreStructure([...createdTasks, ...updatedTasks]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
