exports.toInt = (value) => {
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
};

exports.toIntOrNull = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isInteger(n) ? n : null;
};
