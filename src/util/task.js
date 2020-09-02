import moment from "moment";

export const isTaskExpired = function (task) {
  if (task.dueDate === null) {
    return false;
  }

  return moment().isAfter(task.dueDate, `day`);
};

export const isTaskExpiresToday = function (task) {
  if (task.dueDate === null) {
    return false;
  }

  return moment().isSame(task.dueDate, `day`);
};

export const isTaskRepeating = function (task) {
  return Object.values(task.repeatingDays).some(Boolean);
};

export const formatTaskDueDate = function (dueDate) {
  return (dueDate instanceof Date)
    ? moment(dueDate).format(`D MMMM`)
    : ``;
};
