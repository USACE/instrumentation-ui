export const determineStatus = (submittals = [], alertConfigId) => {
  if (!submittals) return 'gray';
  
  const filteredSubmittals = submittals?.filter(el => el.alert_config_id === alertConfigId);
  const sortedSubmittals = filteredSubmittals?.reduce((accum, current) => {
    const { submittal_status_name, marked_as_missing } = current;

    if (submittal_status_name === 'green') {
      return {
        ...accum,
        green: [...accum.green, current],
      };
    } else if (marked_as_missing) {
      return {
        ...accum,
        validatedRed: [...accum.validatedRed, current],
      };
    } else {
      return {
        ...accum,
        invalidatedRed: [...accum.invalidatedRed, current],
      };
    }
  }, {
    invalidatedRed: [],
    validatedRed: [],
    green: [],
  });

  return sortedSubmittals.invalidatedRed?.length ? 'red' : 'green';
};
