export const formReducer = (state, action) => {
  const { type, payload } = action;
  const { key, value } = payload;

  switch (type) {
    case 'UPDATE':
      return {
        ...state,
        [key]: value,
      };
    case 'CUSTOM_ACTION': return action.payload(state);
    default: throw new Error();
  };
};

export const initState = (data) => {
  const ret = {};
  const keys = Object.keys(data);

  keys.forEach(key => {
    ret[key] = {
      val: data[key],
      isDirty: false,
    };
  });

  return ret;
};

export const reduceState = (state, action) => {
  const { type, key, data } = action;

  switch (type) {
    case 'update': return {
      ...state,
      [key]: {
        val: data,
        isDirty: true,
      }
    };
    default: {
      throw new Error();
    }
  }
};

export const extractState = state => {
  const keys = Object.keys(state);

  return keys.reduce((accum, current) => ({
    ...accum,
    [current]: state[current]?.val,
  }), {});
};

export const isError = (data, key) => {
  if (data[key]?.isDirty) {
    if (!data[key]?.val) return true;
  }

  return false;
};

export const isSaveDisabled = (data, optionalFields = []) => {
  let disabled = false;
  const keys = Object.keys(data);

  keys.forEach(key => {
    if (!data[key]?.val && !optionalFields.includes(key)) {
      disabled = true;
    }
  });

  return disabled;
};
