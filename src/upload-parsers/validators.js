exports.isNotNull = (val) => {
  return val !== null;
};

exports.isNotEmpty = (val) => {
  const empty = val === null || val === undefined || val === "";
  return !empty;
};

exports.isNumeric = (val) => {
  return !isNaN(Number(val));
};
