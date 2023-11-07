import React, { useState } from 'react';

import * as Modal from '../../../app-components/modal';
import { connect } from 'redux-bundler-react';
import { Checkbox, FormControlLabel } from '@mui/material';

const tempRegex = /[\w\s_-]+(\((\d+),(\d+)\))/g;
const XYZRegex = /[\w\s_-]+(\(\d+,(\d+),(\d+)\))/g;

const AutomapSensorModal = connect(
  'doUpdateInstrumentSensor',
  'selectInstrumentSensors',
  'selectInstrumentTimeseriesItems',
  ({
    doUpdateInstrumentSensor,
    instrumentSensors,
    instrumentTimeseriesItems: timeseries,
  }) => {
    const [overwriteExisting, setOverwriteExisting] = useState(false);
    const xyzTimeseries = [];
    const tempTimeseries = []; 

    timeseries.forEach(ts => {
      const { name } = ts;

      const xyzMatches = [...name.matchAll(XYZRegex)];
      const tempMatches = [...name.matchAll(tempRegex)];

      try {
        if (xyzMatches?.length) xyzTimeseries.push({ sensorId: xyzMatches[0][2], typeId: xyzMatches[0][3], timeseries: ts });
        else if (tempMatches?.length) tempTimeseries.push({ sensorId: tempMatches[0][3], timeseries: ts });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed assigning matches.', e);
      }
    });

    const emptyAttrSensors = instrumentSensors.filter(el => {
      const keys = Object.keys(el);

      let ret = false;

      keys.forEach(key => {
        if (!el[key]) ret = true;
      });

      return ret;
    });

    const assignTimeseriesToSensors = () => {
      const formData = [];

      instrumentSensors.forEach(sensor => {
        const { id } = sensor;
        const current = { ...sensor };

        const filteredXYZ = xyzTimeseries.filter(el => String(el.sensorId) === String(id));
        filteredXYZ.forEach(el => {
          switch (el.typeId) {
            case '1':
              if (!current.x_timeseries_id || overwriteExisting)
                current.x_timeseries_id = el?.timeseries?.id;
              break;
            case '2':
              if (!current.y_timeseries_id || overwriteExisting)
                current.y_timeseries_id = el?.timeseries?.id;
              break;
            case '3':
              if (!current.z_timeseries_id || overwriteExisting)
                current.z_timeseries_id = el?.timeseries?.id;
              break;
          }
        });

        const temp = tempTimeseries.find(el => String(el.sensorId) === String(id));
        current.temp_timeseries_id = temp?.timeseries?.id;

        formData.push(current);
      });

      doUpdateInstrumentSensor(formData);
    };
  
    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title='Automap Missing Sensor Timeseries' />
        <Modal.ModalBody>
          This process will attempt to assign timeseries within this instrument to all sensor's X, Y, Z, and Temperature attributes. Select
          the checkbox below to include assignment to attributes that already have a timeseries saved, overwriting them.

          <br/><br /><i>Note: If the timeseries naming format is not correct, it will not be available for automatic mapping.</i>
          <hr />
          <FormControlLabel
            label='Overwrite Existing Mappings'
            control={(
              <Checkbox
                size='small'
                defaultChecked={false}
                onChange={() => setOverwriteExisting(prev => !prev)}
                label='Overwrite Existing Mappings'
              />
            )}
          /><br />
          {emptyAttrSensors.length || overwriteExisting ? (
            <>
              <span>The following sensors will be updated:</span><br />
              {(overwriteExisting ? instrumentSensors : emptyAttrSensors).map((sensor, i) => <span key={sensor.id}>{sensor.id}{i !== emptyAttrSensors.length - 1 ? ', ' : ''}</span>)}
            </>          
          ) : (
            <b>
              No sensor attributes to update.
            </b>
          )}
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          showSaveButton={!!emptyAttrSensors.length || overwriteExisting}
          saveText='Update Sensors'
          onSave={() => assignTimeseriesToSensors()}
        />
      </Modal.ModalContent>
    );
  },
);

export default AutomapSensorModal;

