import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Tooltip } from 'react-tooltip';
// import { toast } from 'react-toastify';

import * as Modal from '../../../../app-components/modal';
// import Button from '../../../../app-components/button';
import Icon from '../../../../app-components/icon';

const AddMappingRowsModal = connect(
  'selectDataLoggerEquivalencyTable',
  ({
    dataLoggerEquivalencyTable: equivalencyTable,
    fieldNames = [],
  }) => {
    const { rows = [] } = equivalencyTable;
    const newFieldNames = fieldNames.map(field => field.fieldName);
    const unusedRows = rows.map(row => {
      if (!newFieldNames.includes(row.field_name)) return row;
    });

    const [isDeleteChecked, setIsDeleteChecked] = useState(false);

    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title='Add Rows to Field Mapping Table' />
        <Modal.ModalBody>
          Unused Rows/Field Names:
          <ul>
            {unusedRows.map(row => (
              <li key={row.id}>
                {row.field_name}
              </li>
            ))}
          </ul>
          New Field Names to Map:
          <ul>
            {newFieldNames.map(name => (
              <li key={name}>
                {name}
              </li>
            ))}
          </ul>
          <hr />
          <label>
            <input
              type='checkbox'
              className='mr-2'
              checked={isDeleteChecked}
              onChange={() => setIsDeleteChecked(prev => !prev)}
            />
            Delete Unused Rows/Field Names
            <Icon
              id='delete-rows-help'
              className='pl-2 d-inline float-right'
              icon='help-circle-outline'
              style={{ fontSize: '18px' }}
            />
            <Tooltip
              anchorId='delete-rows-help'
              effect='solid'
              place='top'
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
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          saveText='Update Table'
        />
      </Modal.ModalContent>
    );
  },
);

export default AddMappingRowsModal;
