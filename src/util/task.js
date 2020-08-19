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

export const formatTaskDueDate = function (dueDate) {
  return dueDate !== null
    ? dueDate.toLocaleString(`en-US`, {day: `numeric`, month: `long`})
    : ``;
};
