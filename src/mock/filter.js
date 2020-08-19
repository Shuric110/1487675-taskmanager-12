import {isTaskExpired, isTaskExpiresToday, isTaskRepeating} from "../util/task.js";

const TASK_FILTERS_MAP = {
  all: {
    displayName: `All`,
    filter: (tasks) => tasks.filter((task) => !task.isArchive)
  },
  overdue: {
    displayName: `Overdue`,
    filter: (tasks) => tasks.filter((task) => !task.isArchive && isTaskExpired(task))
  },
  today: {
    displayName: `Today`,
    filter: (tasks) => tasks.filter((task) => !task.isArchive && isTaskExpiresToday(task))
  },
  favorites: {
    displayName: `Favorites`,
    filter: (tasks) => tasks.filter((task) => !task.isArchive && task.isFavorite)
  },
  repeating: {
    displayName: `Repeating`,
    filter: (tasks) => tasks.filter((task) => !task.isArchive && isTaskRepeating(task))
  },
  archive: {
    displayName: `Archive`,
    filter: (tasks) => tasks.filter((task) => task.isArchive)
  },
};

export const generateFilters = function (tasks) {
  return Object.entries(TASK_FILTERS_MAP).map(([code, {displayName, filter}]) => {
    return {
      code,
      displayName,
      tasksCount: filter(tasks).length
    };
  });
};
