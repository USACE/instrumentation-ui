const ModalBundle = {
  name: 'modal',
  getReducer: () => {
    const initialData = {
      content: null,
      props: null,
      size: null,
    };

    return (state = initialData, { type, payload }) => {
      if (type === 'MODAL_UPDATED') {
        return Object.assign({}, state, payload);
      }
      return state;
    };
  },

  doModalOpen: (content, props, size) => ({ dispatch }) => {
    dispatch({
      type: 'MODAL_UPDATED',
      payload: {
        content,
        props,
        size,
      },
    });
  },

  doModalClose: () => ({ store, dispatch }) => {
    const { callback = () => {} } = store.selectModalProps() || {};

    callback();

    dispatch({
      type: 'MODAL_UPDATED',
      payload: {
        content: null,
        props: null,
        size: null,
      },
    });
  },

  selectModalContent: (state) => state.modal.content,
  selectModalProps: (state) => state.modal.props,
  selectModalSize: (state) => state.modal.size,
};

export default ModalBundle;
