import { toast } from 'react-toastify';

export const tLoading = (message, opts = {}) => toast.loading(message, { closeOnClick: true, ...opts });

export const tUpdateManual = (id, message, opts) => {
  toast.update(id, {
    render: message,
    autoClose: 2500,
    closeOnClick: true,
    draggable: true,
    ...opts,
  });
}

export const tUpdateSuccess = (id, message, opts) => {
  toast.update(id, {
    render: message,
    type: 'success',
    isLoading: false,
    autoClose: 2500,
    closeOnClick: true,
    draggable: true,
    ...opts,
  });
};

export const tUpdateError = (id, message, opts) => {
  toast.update(id, {
    render: message,
    type: 'error',
    isLoading: false,
    autoClose: 7500,
    closeOnClick: true,
    draggable: true,
    ...opts,
  });
};

export const tUpdateWarning = (id, message, opts) => {
  toast.update(id, {
    render: message,
    type: 'warning',
    isLoading: false,
    autoClose: 4000,
    closeOnClick: true,
    draggable: true,
    ...opts,
  });
};
