import React, { useState } from 'react';

import * as Modal from '../../../../app-components/modal';
import Button from '../../../../app-components/button/button';

const reduceValidatedValues = (selectedRows = []) => {
  const validatedValues = selectedRows?.reduce((accum, current) => {
    const { validated } = current;
    
    return {
      ...accum,
      [validated]: accum[validated] + 1,
    };
  }, {
    'true': 0,
    'false': 0,
  });

  return validatedValues;
};

const determineDefaultValue = (validatedValues) => {
  const { 'false': validatedFalse } = validatedValues;

  if (!validatedFalse) return false;
  else return true;
};

const ToggleValidatedModal = ({
  selectedRows = [],
}) => {
  const validatedValues = reduceValidatedValues(selectedRows);
  const defaultValue = determineDefaultValue(validatedValues);
  const isMixedValues = validatedValues['true'] && validatedValues['false'];

  const [isValidated, setIsValidated] = useState(defaultValue);

  return (
    <Modal.ModalContent>
      <Modal.ModalHeader title='Toggle Validated on Selected Rows' />
      <Modal.ModalBody>
        <span>
          Currently setting selected rows <i>validated</i> value to <b>{String(isValidated)}</b>.
        </span>
        {isMixedValues ? (
          <>
            <hr />
            <span className='mt-3 d-block'>
              The selected rows contain a mix of true and false values.<br/>
              To toggle all selected rows to <b>{String(!isValidated)}</b>, click the button below.
            </span>
            <Button
              isOutline
              size='small'
              variant='info'
              className='mt-2'
              text={`Set to ${String(!isValidated)}`}
              handleClick={() => setIsValidated(prev => !prev)}
            />
          </>
        ) : (
          <>
            <hr />
            <span className='mt-3 d-block'>
              All selected rows current <i>validated</i> value is <b>{String(!isValidated)}</b>. If this is correct, you can safely close this modal and no action will be taken.
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

export default ToggleValidatedModal;
