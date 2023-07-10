import React, { useState } from 'react';

import * as Modal from '../../../../app-components/modal';
import Button from '../../../../app-components/button/button';

const reduceMaskedValues = (selectedRows = []) => {
  const maskedValues = selectedRows?.reduce((accum, current) => {
    const { masked } = current;
    
    return {
      ...accum,
      [masked]: accum[masked] + 1,
    };
  }, {
    'true': 0,
    'false': 0,
  });

  return maskedValues;
};

const determineDefaultValue = (maskedValues) => {
  const { 'false': maskedFalse } = maskedValues;

  if (!maskedFalse) return false;
  else return true;
};

const ToggleMaskedModal = ({
  selectedRows = [],
}) => {
  const maskedValues = reduceMaskedValues(selectedRows);
  const defaultValue = determineDefaultValue(maskedValues);
  const isMixedValues = maskedValues['true'] && maskedValues['false'];

  const [isMasked, setIsMasked] = useState(defaultValue);

  return (
    <Modal.ModalContent>
      <Modal.ModalHeader title='Toggle Masked on Selected Rows' />
      <Modal.ModalBody>
        <span>
          Currently setting selected rows <i>masked</i> value to <b>{String(isMasked)}</b>.
        </span>
        {isMixedValues ? (
          <>
            <hr />
            <span className='mt-3 d-block'>
              The selected rows contain a mix of true and false values.<br/>
              To toggle all selected rows to <b>{String(!isMasked)}</b>, click the button below.
            </span>
            <Button
              isOutline
              size='small'
              variant='info'
              className='mt-2'
              text={`Set to ${String(!isMasked)}`}
              handleClick={() => setIsMasked(prev => !prev)}
            />
          </>
        ) : (
          <>
            <hr />
            <span className='mt-3 d-block'>
              All selected rows current <i>masked</i> value is <b>{String(!isMasked)}</b>. If this is correct, you can safely close this modal and no action will be taken.
            </span>
          </>
        )}
      </Modal.ModalBody>
      <Modal.ModalFooter
        saveText='Confirm'
        showCancelButton
      />
    </Modal.ModalContent>
  );
};

export default ToggleMaskedModal;
