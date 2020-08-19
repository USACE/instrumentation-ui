export default {
  name: "modal",
  getReducer: () => {
    const initialData = {
      content: null,
      props: null,
      size: null,
    };

    return (state = initialData, { type, payload }) => {
      if (type === "MODAL_UPDATED") {
        return Object.assign({}, state, payload);
      }
      return state;
    };
  },
  doModalOpen: (content, props, size) => ({ dispatch }) => {
    dispatch({
      type: "MODAL_UPDATED",
      payload: {
        content: content,
        props: props,
      },
    });
  },
  doModalClose: () => ({ dispatch }) => {
    dispatch({
      type: "MODAL_UPDATED",
      payload: {
        content: null,
        props: null,
      },
    });
  },
  selectModalContent: (state) => {
    return state.modal.content;
  },
  selectModalProps: (state) => {
    return state.modal.props;
  },
  selectModalSize: (state) => {
    return state.modal.size;
  },
};
