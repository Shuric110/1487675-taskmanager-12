import Observable from "../util/observable.js";
import {isTaskExpired, isTaskExpiresToday, isTaskRepeating} from "../util/task.js";
import {UpdateAction} from "../const.js";

export const SortType = {
  DEFAULT: `default`,
  DATE_UP: `date-up`,
  DATE_DOWN: `date-down`
};

export const FilterType = {
  ALL: `all`,
  OVERDUE: `overdue`,
  TODAY: `today`,
  FAVORITES: `favorites`,
  REPEATING: `repeating`,
  ARCHIVE: `archive`
};

const SORT_DEFINITIONS = {
  [SortType.DEFAULT]: {
    code: SortType.DEFAULT,
    title: `DEFAULT`,
    compare: null
  },
  [SortType.DATE_UP]: {
    code: SortType.DATE_UP,
    title: `DATE up`,
    compare({dueDate: a}, {dueDate: b}) {
      return (!a ? Infinity : a.getTime())
        - (!b ? Infinity : b.getTime());
    }
  },
  [SortType.DATE_DOWN]: {
    code: SortType.DATE_DOWN,
    title: `DATE down`,
    compare({dueDate: a}, {dueDate: b}) {
      return (!b ? 0 : b.getTime())
        - (!a ? 0 : a.getTime());
    }
  },
};

const FILTER_DEFINITIONS = {
  [FilterType.ALL]: {
    code: FilterType.ALL,
    title: `All`,
    filter: (task) => !task.isArchive
  },
  [FilterType.OVERDUE]: {
    code: FilterType.OVERDUE,
    title: `Overdue`,
    filter: (task) => !task.isArchive && isTaskExpired(task)
  },
  [FilterType.TODAY]: {
    code: FilterType.TODAY,
    title: `Today`,
    filter: (task) => !task.isArchive && isTaskExpiresToday(task)
  },
  [FilterType.FAVORITES]: {
    code: FilterType.FAVORITES,
    title: `Favorites`,
    filter: (task) => !task.isArchive && task.isFavorite
  },
  [FilterType.REPEATING]: {
    code: FilterType.REPEATING,
    title: `Repeating`,
    filter: (task) => !task.isArchive && isTaskRepeating(task)
  },
  [FilterType.ARCHIVE]: {
    code: FilterType.ARCHIVE,
    title: `Archive`,
    filter: (task) => task.isArchive
  },
};


export default class Board extends Observable {
  constructor() {
    super();
    this._filter = FILTER_DEFINITIONS[FilterType.ALL];
    this._sort = SORT_DEFINITIONS[SortType.DEFAULT];
  }

  setFilter(filter) {
    this._filter = FILTER_DEFINITIONS[filter];
    this._notify(UpdateAction.FILTER_UPDATE, this._filter);
  }

  getFilter() {
    return this._filter;
  }

  setSort(sort) {
    this._sort = SORT_DEFINITIONS[sort];
    this._notify(UpdateAction.SORT_UPDATE, this._sort);
  }

  getSort() {
    return this._sort;
  }

  getFilterDefinitions() {
    return Object.values(FILTER_DEFINITIONS);
  }

  getSortDefinitions() {
    return Object.values(SORT_DEFINITIONS);
  }
}
