const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class TasksApi {
  constructor(baseUrl, authToken) {
    this._baseUrl = baseUrl;
    this._authToken = authToken;
  }

  getTasks() {
    return this._query({url: `tasks`})
      .then(TasksApi.toJSON);
  }

  updateTask(task) {
    return this._query({
      url: `tasks/${task.id}`,
      method: Method.PUT,
      body: JSON.stringify(task),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(TasksApi.toJSON);
  }

  addTask(task) {
    return this._query({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(TasksApi.toJSON);
  }

  deleteTask(task) {
    return this._query({
      url: `tasks/${task.id}`,
      method: Method.DELETE
    });
  }

  sync(tasks) {
    return this._query({
      url: `tasks/sync`,
      method: Method.POST,
      body: JSON.stringify(tasks),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(TasksApi.toJSON);
  }

  _query({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, `Basic ${this._authToken}`);

    return fetch(
        `${this._baseUrl}/${url}`,
        {method, body, headers}
    )
      .then(TasksApi.checkStatus)
      .catch(TasksApi.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
