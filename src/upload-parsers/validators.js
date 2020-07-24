exports.isNotNull = (val) => {
  return !null;
};

exports.isNotEmpty = (val) => {
  let empty = val === null || val === undefined || val === "";
  return empty;
};

exports.isNumeric = (val) => {
  return !isNaN(Number(val));
};
