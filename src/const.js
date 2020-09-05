export const Color = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`
};

export const COLORS = Object.values(Color);

export const colorValues = {
  [Color.BLACK]: `#000000`,
  [Color.BLUE]: `#0c5cdd`,
  [Color.GREEN]: `#31b55c`,
  [Color.PINK]: `#ff3cb9`,
  [Color.YELLOW]: `#ffe125`
};

export const UpdateAction = {
  TASK_UPDATE: `TASK_UPDATE`,
  TASK_ADD: `TASK_ADD`,
  TASK_DELETE: `TASK_DELETE`,
  SORT_UPDATE: `SORT_UPDATE`,
  FILTER_UPDATE: `FILTER_UPDATE`
};

export const MenuItem = {
  ADD_NEW_TASK: `ADD_NEW_TASK`,
  TASKS: `TASKS`,
  STATISTICS: `STATISTICS`
};
