import React, { useState } from 'react';

import Button from './button';

const DeleteButton = ({
  deleteText = 'Delete',
  deleteIcon = null,
  confirmText = 'Confirm',
  confirmIcon = null,
  cancelText = 'Cancel',
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
          variant='danger'
          text={confirmText}
          icon={confirmIcon}
          handleClick={onDelete}
        />
        <Button
          size={size}
          isOutline={isOutline}
          variant='secondary'
          text={cancelText}
          icon={cancelIcon}
          handleClick={() => setIsConfirming(false)}
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
        icon={deleteIcon}
        handleClick={() => setIsConfirming(true)}
      />
    )
  );
};

export default DeleteButton;
