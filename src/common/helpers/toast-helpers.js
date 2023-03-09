import { toast } from 'react-toastify';

export const tLoading = (message, opts = {}) => toast.loading(message, { closeOnClick: true, ...opts });

export const tUpdateSuccess = (id, message) => {
  toast.update(id, {
    render: message,
    type: 'success',
    isLoading: false,
    autoClose: 2500,
    closeOnClick: true,
    draggable: true,
  });
};

export const tUpdateError = (id, message) => {
  toast.update(id, {
    render: message,
    type: 'error',
    isLoading: false,
    autoClose: 7500,
    closeOnClick: true,
    draggable: true,
  });
};

export const tUpdateWarning = (id, message) => {
  toast.update(id, {
    render: message,
    type: 'warning',
    isLoading: false,
    autoClose: 4000,
    closeOnClick: true,
    draggable: true,
  });
};
