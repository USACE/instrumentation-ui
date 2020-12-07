exports.isNotNull = (val) => val !== null;

exports.isNotEmpty = (val) => {
  const empty = val === null || val === undefined || val === "";
  return !empty;
};

exports.isNumeric = (val) => !isNaN(Number(val));
