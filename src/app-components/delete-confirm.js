import React, { useState } from 'react';

import Button from './button';

const DeleteConfirm = ({
  deleteText = 'Delete',
  deleteTitle = 'Delete',
  deleteIcon = null,
  confirmText = 'Confirm',
  confirmTitle = 'Confirm',
  confirmIcon = null,
  cancelText = 'Cancel',
  cancelTitle = 'Title',
  cancelIcon = null,
  size = '',
  isOutline = false,
  handleDelete,
  className = '',
  ...customProps
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const onDelete = (e) => {
    setIsConfirming(false);
    handleDelete(e);
  };

  return (
    isConfirming ? (
      <div className={`${className} btn-group`}>
        <Button
          size={size}
          isOutline={isOutline}
          variant='secondary'
          text={cancelText}
          title={cancelTitle}
          icon={cancelIcon}
          handleClick={() => setIsConfirming(false)}
        />
        <Button
          size={size}
          isOutline={isOutline}
          variant='danger'
          text={confirmText}
          title={confirmTitle}
          icon={confirmIcon}
          handleClick={onDelete}
        />
      </div>
    ) : (
      <Button
        {...customProps}
        className={className}
        variant='danger'
        size={size}
        isOutline={isOutline}
        text={deleteText}
        title={deleteTitle}
        icon={deleteIcon}
        handleClick={() => setIsConfirming(true)}
      />
    )
  );
};

export default DeleteConfirm;
