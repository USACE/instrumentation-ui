import React from 'react';
import { connect } from 'redux-bundler-react';

import { ModalHeader, ModalFooter } from '../../../app-components/modal';

const DeleteFormulaModal = connect(
  'doModalClose',
  'doInstrumentFormulasDelete',
  ({
    doModalClose,
    doInstrumentFormulasDelete,
    formulaItem,
  }) => {
    const { formula_name } = formulaItem;

    const deleteFormula = () => {
      doInstrumentFormulasDelete(formulaItem, () => doModalClose(), false);
    };

    return (
      <div className='modal-content'>
        <ModalHeader title='Delete Formula' />
        <section className='modal-body'>
          Are you sure you want to delete this formula:
          <b className='d-block mt-2'>{formula_name}</b>
        </section>
        <ModalFooter
          showSaveButton={false}
          showCancelButton
          showDeleteButton
          customClosingLogic
          onCancel={() => doModalClose()}
          onDelete={() => deleteFormula()}
        />
      </div>
    );
  }
);

export default DeleteFormulaModal;
