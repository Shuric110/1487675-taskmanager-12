import he from "he";

export const getRandomInteger = function (a = 0, b = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomElement = function (elements) {
  return elements[getRandomInteger(0, elements.length - 1)];
};

export const escapeHtml = function (html) {
  return he.encode(html);
};
