export const isNotNull = (val) => val !== null;

export const isNotEmpty = (val) => {
  const empty = val === null || val === undefined || val === '';
  return !empty;
};

export const isNumeric = (val) => !isNaN(Number(val));
