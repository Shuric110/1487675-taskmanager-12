export default class ApiAdapter {
  constructor(api) {
    this._api = api;
  }

  getTasks() {
    return this._api.getTasks()
      .then(ApiAdapter.convertTasksApiToClient);
  }

  updateTask(task) {
    return this._api.updateTask(ApiAdapter.convertTaskClientToApi(task))
      .then(ApiAdapter.convertTaskApiToClient);
  }

  static convertTasksApiToClient(apiTasks) {
    return apiTasks.map((apiTask) => ApiAdapter.convertTaskApiToClient(apiTask));
  }

  static convertTaskApiToClient(apiTask) {
    const task = Object.assign(
        {},
        apiTask,
        {
          dueDate: apiTask.due_date !== null ? new Date(apiTask.due_date) : null,
          isArchive: apiTask.is_archived,
          isFavorite: apiTask.is_favorite,
          repeatingDays: apiTask.repeating_days
        }
    );

    delete task.due_date;
    delete task.is_archived;
    delete task.is_favorite;
    delete task.repeating_days;

    return task;
  }

  static convertTaskClientToApi(task) {
    const apiTask = Object.assign(
        {},
        task,
        {
          "due_date": task.dueDate instanceof Date ? task.dueDate.toISOString() : null,
          "is_archived": task.isArchive,
          "is_favorite": task.isFavorite,
          "repeating_days": task.repeatingDays
        }
    );

    delete apiTask.dueDate;
    delete apiTask.isArchive;
    delete apiTask.isFavorite;
    delete apiTask.repeatingDays;

    return apiTask;
  }
}
