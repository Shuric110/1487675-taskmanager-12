export const COLORS = [`black`, `yellow`, `blue`, `green`, `pink`];

export const SORT_TYPES = {
  'default': {
    title: `DEFAULT`,
    compare: null
  },
  'date-up': {
    title: `DATE up`,
    compare(a, b) {
      return (!a ? 0 : a.getTime())
        - (!b ? 0 : b.getTime());
    }
  },
  'date-down': {
    title: `DATE down`,
    compare(a, b) {
      return (!b ? 0 : b.getTime())
        - (!a ? 0 : a.getTime());
    }
  },
};
