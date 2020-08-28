export const COLORS = [`black`, `yellow`, `blue`, `green`, `pink`];

export const SORT_TYPES = {
  'default': {
    title: `DEFAULT`,
    compare: null
  },
  'date-up': {
    title: `DATE up`,
    compare({dueDate: a}, {dueDate: b}) {
      return (!a ? Infinity : a.getTime())
        - (!b ? Infinity : b.getTime());
    }
  },
  'date-down': {
    title: `DATE down`,
    compare({dueDate: a}, {dueDate: b}) {
      return (!b ? 0 : b.getTime())
        - (!a ? 0 : a.getTime());
    }
  },
};

export const UpdateAction = {
  TASK_UPDATE: `TASK_UPDATE`,
  TASK_ADD: `TASK_ADD`,
  TASK_DELETE: `TASK_DELETE`,
  SORT_UPDATE: `SORT_UPDATE`,
  FILTER_UPDATE: `FILTER_UPDATE`
};
