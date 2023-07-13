import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import * as Modal from '../../../../app-components/modal';
import HelperTooltip from '../../../../app-components/helper-tooltip';

const AddMappingRowsModal = connect(
  'doCreateDataLoggerEquivalency',
  'selectDataLoggerEquivalencyTable',
  ({
    doCreateDataLoggerEquivalency,
    dataLoggerEquivalencyTable: equivalencyTable,
    fieldNames = [],
    dataLoggerId,
  }) => {
    const { rows = [] } = equivalencyTable;
    const newFieldNames = fieldNames.map(field => field.fieldName);
    const oldFieldNames = rows.map(row => row?.field_name);

    const unusedRows = rows.map(row => {
      if (!newFieldNames.includes(row?.field_name)) return row;
    }).filter(e => e);
    const newRows = newFieldNames.map(fieldName => {
      if (!oldFieldNames.includes(fieldName)) return fieldName;
    }).filter(e => e);

    const [isDeleteChecked, setIsDeleteChecked] = useState(false);

    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title='Add Rows to Field Mapping Table' />
        <Modal.ModalBody>
          {unusedRows?.length ? (
            <>
            Unused Rows/Field Names:
              <ul>
                {unusedRows.map(row => (
                  <li key={row?.id}>
                    {row?.field_name}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {newRows?.length ? (
            <>
              New Field Names to Map:
              <ul>
                {newRows.map(name => (
                  <li key={name}>
                    {name}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          {unusedRows?.length ? (
            <>
              <hr />
              <label>
                <input
                  type='checkbox'
                  className='mr-2'
                  checked={isDeleteChecked}
                  onChange={() => setIsDeleteChecked(prev => !prev)}
                />
                Delete Unused Rows/Field Names
                <HelperTooltip
                  id='delete-rows-help'
                  className='pl-2 d-inline float-right'
                  content={
                    <span>
                      Unused rows/field names will not receive any data <br/>
                      from the data logger as they are not a part of the<br />
                      provided JSON. Select this option to automatically<br />
                      remove these rows from the table.
                    </span>
                  }
                />
              </label>
            </>
          ) : null}
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          saveText='Update Table'
          onSave={() => doCreateDataLoggerEquivalency({ dataLoggerId, newRows, unusedRows, isDeleteChecked })}
        />
      </Modal.ModalContent>
    );
  },
);

export default AddMappingRowsModal;
