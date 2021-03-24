import React from 'react';
import { connect } from 'redux-bundler-react';

import DeleteConfirm from '../../app-components/delete-confirm';
import Icon from '../../app-components/icon';

const InstrumentRemove = connect(
  'doInstrumentGroupInstrumentsDelete',
  ({ doInstrumentGroupInstrumentsDelete, item }) => (
    <DeleteConfirm
      isOutline
      size='small'
      deleteTitle='Remove from Group'
      deleteText=''
      deleteIcon={<Icon icon='delete' />}
      handleDelete={(_e) => doInstrumentGroupInstrumentsDelete(item)}
    />
  )
);

export default InstrumentRemove;
