import React from 'react';
import { connect } from 'redux-bundler-react';
import { Delete } from '@mui/icons-material';

import DeleteConfirm from '../../app-components/delete-confirm';

const InstrumentRemove = connect(
  'doInstrumentGroupInstrumentsDelete',
  ({ doInstrumentGroupInstrumentsDelete, item }) => (
    <DeleteConfirm
      isOutline
      size='small'
      deleteTitle='Remove from Group'
      deleteText=''
      deleteIcon={<Delete fontSize='inherit' />}
      handleDelete={(_e) => doInstrumentGroupInstrumentsDelete(item)}
    />
  )
);

export default InstrumentRemove;
