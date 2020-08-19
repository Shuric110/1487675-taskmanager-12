import {COLORS} from "../const.js";
import {getRandomInteger, getRandomElement} from "../util/common.js";

const MAX_DATE_GAP = 7;
const DESCRIPTIONS = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];


const generateRepeatingDays = function (noRepeating) {
  const days = {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false
  };

  if (!noRepeating) {
    const daysKeys = Object.keys(days);

    for (let i = getRandomInteger(0, 3); i > 0; i--) {
      days[getRandomElement(daysKeys)] = true;
    }
  }

  return days;
};

const generateTask = function () {
  const hasDate = Boolean(getRandomInteger(0, 1));
  let dueDate;
  if (hasDate) {
    dueDate = new Date();
    dueDate.setHours(0, 0, 0, 0);
    dueDate.setDate(dueDate.getDate() + getRandomInteger(-MAX_DATE_GAP, MAX_DATE_GAP));
  } else {
    dueDate = null;
  }

  return {
    description: getRandomElement(DESCRIPTIONS),
    dueDate,
    repeatingDays: generateRepeatingDays(hasDate),
    color: getRandomElement(COLORS),
    isArchive: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

export const generateTasks = function (tasksCount) {
  return new Array(tasksCount).fill().map(generateTask);
};
