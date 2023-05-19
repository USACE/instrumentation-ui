import { toast } from 'react-toastify';

import { tUpdateError, tUpdateSuccess } from '../common/helpers/toast-helpers';

export default {
  name: 'qualityControl',
  getReducer: () => {
    const initialState = {
      evaluations: [],
    };
    
    return (state = initialState, { type, payload }) => {
      switch (type) {
        case 'EVALUATIONS_UPDATED':
          return {
            ...state,
            evaulations: payload,
          };
        default:
          return state;
      }
    };
  },

  selectQualityControlRaw: (state) => state.qualityControl,
  selectQualityControlEvaluations: (state) => state.qualityControl.evaulations,

  doFetchQualityControlEvaluations: () => ({ dispatch, store, apiGet }) => {
    dispatch({ type: 'EVALUATIONS_FETCH_START' });
    const { projectId } = store.selectProjectsIdByRoute();

    const url = `/projects/${projectId}/evaluations`;

    apiGet(url, (err, body) => {
      if (err) {
        console.log('error: ', err);
      } else {
        dispatch({
          type: 'EVALUATIONS_UPDATED',
          payload: body,
        });
      }

      dispatch({ type: 'EVALUATIONS_FETCH_FINISHED' });
    });
  },

  doCreateQualityControlEvaluation: (formState) => ({ dispatch, store, apiPost }) => {
    dispatch({ type: 'EVALUATIONS_CREATE_START' });
    console.log('test formState: ', formState);


    const formData = Object.keys(formState).reduce((accum, current) => {
      if (current === 'instruments') {
        const ids = formState[current].val.map(el => ({ instrument_id: el.value }));
        return {
          ...accum,
          [current]: ids,
        };
      } else return ({
        ...accum,
        [current]: formState[current].val,
      });
    }, {});

    const toastId = toast.loading('Submitting evaluation...');
    const { projectId } = store.selectProjectsIdByRoute();

    const url = `/projects/${projectId}/evaluations`;

    apiPost(url, formData, (err, _body) => {
      dispatch({ type: 'EVALUATIONS_CREATE_FINISHED' });
      if (err) {
        console.log('error: ', err);
        tUpdateError(toastId, 'Failed to submit evaluation. Try again later.');
      } else {
        tUpdateSuccess(toastId, 'Successfully submitted evaluation!');
        store.doFetchQualityControlEvaluations();
      }
    });
  },
};
