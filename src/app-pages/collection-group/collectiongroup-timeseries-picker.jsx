import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import Dropdown from '../../app-components/dropdown';
import { ModalFooter, ModalHeader } from '../../app-components/modal';

export default connect(
  'doModalClose',
  'doCollectionGroupAddTimeseries',
  'selectCollectionGroupByRoute',
  'selectNonComputedTimeseriesItemsByRoute',
  ({
    doModalClose,
    doCollectionGroupAddTimeseries,
    collectionGroupByRoute: collectionGroup,
    nonComputedTimeseriesItemsByRoute: timeseries,
  }) => {
    const [timeseriesSelected, setTimeseriesSelected] = useState(null);

    const handleClickAdd = (e) => {
      e.preventDefault();

      if (timeseriesSelected) {
        doCollectionGroupAddTimeseries({
          projectId: collectionGroup.project_id,
          collectionGroupId: collectionGroup.id,
          timeseriesId: timeseriesSelected.id,
        });
      } else {
        // eslint-disable-next-line no-console
        console.log('No Timeseries Selected; Skipping POST');
      }
    };

    return (
      <div className='modal-content' style={{ overflow: 'visible' }}>
        <ModalHeader title='Add Field' />
        <section className='modal-body' style={{ overflow: 'visible' }}>
          <Dropdown.Menu
            buttonClasses={['btn-outline-primary', 'w-100']}
            buttonContent={(
              timeseriesSelected &&
              timeseriesSelected.name &&
              timeseriesSelected.instrument &&
              `${timeseriesSelected.instrument}  |  ${timeseriesSelected.name}`
            ) || 'Select a Timeseries'}
          >
            {timeseries.map((t, idx) => (
              <Dropdown.Item key={idx} onClick={() => setTimeseriesSelected(t)}>
                {`${t.instrument}  |  ${t.name}`}
              </Dropdown.Item>
              
            ))}
          </Dropdown.Menu>
        </section>
        <ModalFooter
          customClosingLogic
          saveText='Add'
          onSave={(e) => handleClickAdd(e)}
          onCancel={(e) => {
            e.preventDefault();
            doModalClose();
          }}
        />
      </div>
    );
  }
);
