// src/utils/helpers.js
export const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};
