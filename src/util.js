export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};


export const getRandomInteger = function (a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElement = function (elements) {
  return elements[getRandomInteger(0, elements.length - 1)];
};

export const escapeHtml = function (html) {
  return html
    .replace(/&/g, `&amp;`)
    .replace(/</g, `&lt;`)
    .replace(/>/g, `&gt;`)
    .replace(/"/g, `&quot;`)
    .replace(/'/g, `&#039;`);
};

export const formatTaskDueDate = function (dueDate) {
  return dueDate !== null
    ? dueDate.toLocaleString(`en-US`, {day: `numeric`, month: `long`})
    : ``;
};

export const isTaskExpired = function (task) {
  if (task.dueDate === null) {
    return false;
  }

  const now = new Date();
  const expireDate = new Date(task.dueDate);
  expireDate.setDate(expireDate.getDate() + 1);
  return now.getTime() >= expireDate.getTime();
};

export const isTaskExpiresToday = function (task) {
  if (task.dueDate === null) {
    return false;
  }

  const now = new Date();
  const expireDate = new Date(task.dueDate);
  expireDate.setDate(expireDate.getDate() + 1);
  return task.dueDate.getTime() <= now.getTime() && now.getTime() < expireDate.getTime();
};

export const isTaskRepeating = function (task) {
  return Object.values(task.repeatingDays).some(Boolean);
};


export const render = function (container, element, position) {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElementFromTemplate = function (template) {
  const container = document.createElement(`div`);
  container.innerHTML = template;
  return container.firstElementChild;
};
