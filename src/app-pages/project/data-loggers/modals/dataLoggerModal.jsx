import React, { useState } from 'react';
import { connect } from 'redux-bundler-react';

import * as Modal from '../../../../app-components/modal';
import DomainSelect from '../../../../app-components/domain-select';

const DataLoggerModal = connect(
  'doCreateNewDataLogger',
  'doUpdateDataLogger',
  ({
    doCreateNewDataLogger,
    doUpdateDataLogger,
    isEdit = false,
    callback = () => {},
    dataLogger = {
      id: '',
      sn: '',
      name: '',
      model_id: '',
      numberOfSegments: 0,
      segmentLength: '',
      bottomElevation: '',
    },
  }) => {
    const {
      id,
      sn: initSn,
      name: initName,
      model_id: initModelId,
      numberOfSegments: initNumberOfSegments,
      segmentLength: initSegmentLength,
      bottomElevation: initBottomElevation,
    } = dataLogger;
    const title = `${isEdit ? 'Edit' : 'Add New'} Data Logger`;
    
    const [sn, setSN] = useState(initSn);
    const [name, setName] = useState(initName);
    const [modelId, setModelId] = useState(initModelId);
    const [isSaaIpi, setIsSaaIpi] = useState(false);
    const [numberOfSegments, setNumberOfSegments] = useState(initNumberOfSegments);
    const [segmentLength, setSegmentLength] = useState(initSegmentLength);
    const [bottomElevation, setBottomElevation] = useState(initBottomElevation);

    const saveDataLoggerDetails = () => {
      if (isEdit) {
        doUpdateDataLogger({ name, dataLoggerId: id });
        callback({ label: name, value: id });
      } else {
        doCreateNewDataLogger({ sn, name, model_id: modelId });
      }
    };

    const isSaveDisabled = () => {
      if (!sn || !name || !modelId) return true;

      if (!isSaaIpi) return false;
      else return true;
    };

    return (
      <Modal.ModalContent style={{ overflow: 'visible' }}>
        <Modal.ModalHeader title={title} />
        <Modal.ModalBody style={{ overflow: 'visible' }}>
          <div className='form-group'>
            <label>Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className='form-control text-primary'
              type='text'
              placeholder='Name'
            />
          </div>
          {!isEdit ? (
            <>
              <div className='form-group'>
                <label>Serial Number</label>
                <input
                  value={sn}
                  onChange={e => setSN(e.target.value)}
                  className='form-control text-primary'
                  type='text'
                  placeholder='Serial Number'
                />
              </div>
              <div className='form-group'>
                <label>Model</label>
                <DomainSelect
                  defaultValue={modelId}
                  onChange={val => setModelId(val?.id)}
                  domain='datalogger_model'
                />
              </div>
              {modelId ? (
                <>
                  <div className='form-group'>
                    <input
                      type='checkbox'
                      checked={isSaaIpi}
                      onChange={() => setIsSaaIpi(prev => !prev)}
                    />
                    &nbsp;- Data Logger is Used for Inclinometer Data (SAA or IPI)
                  </div>
                  {/* @TODO: setup modal to create timeseries from uploaded TOA5 */}
                  {/* {isSaaIpi ? (
                    <>
                      <div className='form-group'>
                        <label>Number of Segments</label>
                        <input
                          type='number'
                          value={numberOfSegments}
                          onChange={e => setNumberOfSegments(e.target.value)}
                          className='form-control text-primary'
                        />
                      </div>
                      <div className='form-group'>
                        <label>Segment Length</label>
                        <input
                          type='text'
                          value={segmentLength}
                          onChange={e => setSegmentLength(e.target.value)}
                          className='form-control text-primary'
                          placeholder='Segment Length'
                        />
                      </div>
                      <div className='form-group'>
                        <label>Bottom Elevation</label>
                        <input
                          type='text'
                          value={bottomElevation}
                          onChange={e => setBottomElevation(e.target.value)}
                          className='form-control text-primary'
                          placeholder='Bottom Elevation'
                        />
                      </div>
                      Any other fields...
                    </>
                  ) : null} */}
                </>
              ) : null}
            </>
          ) : (
            <small>
              The <i><b>Serial Number</b></i> and <i><b>Model</b></i> fields are not editable. If they are not correct, please create a new data logger with the proper values and delete the invalid data logger.
            </small>
          )}
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          onSave={saveDataLoggerDetails}
          saveIsDisabled={isSaveDisabled()}
        />
      </Modal.ModalContent>
    );
  },
);

export default DataLoggerModal;
