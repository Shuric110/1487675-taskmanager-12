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
