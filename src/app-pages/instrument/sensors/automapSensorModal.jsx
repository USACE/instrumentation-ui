import React from 'react';

import * as Modal from '../../../app-components/modal';
import { connect } from 'redux-bundler-react';

const tempRegex = /([\w\s_-])+(\(\d+,\d+\))/g;
const XYZRegex = /([\w\s_-])+(\(\d+,\d+,\d+\))/g;

const AutomapSensorModal = connect(
  'selectInstrumentSensors',
  'selectInstrumentTimeseriesItems',
  ({
    instrumentSensors,
    instrumentTimeseriesItems: timeseries,
  }) => {
    const xyzTimeseries = [];
    const tempTimeseries = []; 

    timeseries.forEach(ts => {
      const { name } = ts;

      if (name.match(XYZRegex)) xyzTimeseries.push(ts);
      else if (name.match(tempRegex)) tempTimeseries.push(ts);
    });

    const emptyAttrSensors = instrumentSensors.filter(el => {
      const keys = Object.keys(el);

      let ret = false;

      keys.forEach(key => {
        if (!el[key]) ret = true;
      });

      return ret;
    });
  
    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title='Automap Missing Sensor Timeseries' />
        <Modal.ModalBody>
          This form will attempt to assign timeseries within this instrument to a sensor's X, Y, Z, and Temperature attributes. This will only attempt
          to fill missing attributes and will not overwrite any previously saved attributes.

          <br/><br /><i>Note: If the timeseries format is not correct, it will not be available for automatic mapping.</i>
          <hr />
          {emptyAttrSensors.length ? (
            <>
              <span>The following sensors have empty attributes:</span><br />
              {emptyAttrSensors.map((sensor, i) => <span key={sensor.id}>{sensor.id}{i !== emptyAttrSensors.length - 1 ? ', ' : ''}</span>)}
            </>          
          ) : (
            <b>
              All sensor attributes are filled. If you need to make changes to the current assignments, either assign them manually in the
              previous screen or create a new instrument to utilize the automatic mapping functionality.
            </b>
          )}
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          showSaveButton={!!emptyAttrSensors.length}
          saveText='Update Sensors'
        />
      </Modal.ModalContent>
    );
  },
);

export default AutomapSensorModal;

