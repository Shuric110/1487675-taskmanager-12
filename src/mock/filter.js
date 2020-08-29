import {isTaskExpired, isTaskExpiresToday, isTaskRepeating} from "../util/task.js";


export const generateFilters = function (tasks) {
  return Object.entries(TASK_FILTERS_MAP).map(([code, {displayName, filter}]) => {
    return {
      code,
      displayName,
      tasksCount: filter(tasks).length
    };
  });
};
