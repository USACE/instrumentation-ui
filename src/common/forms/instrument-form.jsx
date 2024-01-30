/* eslint-disable no-mixed-operators */
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { connect } from 'redux-bundler-react';

import DomainSelect from '../../app-components/domain-select';
import Map from '../../app-components/classMap';
import { ModalFooter, ModalHeader } from '../../app-components/modal';

import 'react-datepicker/dist/react-datepicker.css';

export default connect(
  'doModalClose',
  'doInstrumentsSave',
  'doInstrumentDrawUpdateLoc',
  'doInstrumentDrawOnMapClose',
  'doMapsInitialize',
  'doMapsShutdown',
  'doProjSetDisplayProjection',
  'doProjTransformFromLonLat',
  'doProjTransformToLonLat',
  'doInstrumentsDelete',
  'selectInstrumentDrawLon',
  'selectInstrumentDrawLat',
  'selectInstrumentDrawReady',
  'selectMapsObject',
  'selectProjDisplayProjection',
  'selectProjOptions',
  'selectProjectsByRoute',
  'selectDomainsItemsByGroup',
  ({
    doModalClose,
    doInstrumentsSave,
    doInstrumentDrawUpdateLoc,
    doInstrumentDrawOnMapClose,
    doMapsInitialize,
    doMapsShutdown,
    doProjSetDisplayProjection,
    doProjTransformFromLonLat,
    doProjTransformToLonLat,
    doInstrumentsDelete,
    instrumentDrawLat,
    instrumentDrawLon,
    instrumentDrawReady,
    mapsObject,
    projDisplayProjection,
    projOptions,
    projectsByRoute: project,
    domainsItemsByGroup,
    item = {},
    isEdit = true,
  }) => {
    const [name, setName] = useState(item?.name || '');
    const [type_id, setTypeId] = useState(item?.type_id || '');
    const [station, setStation] = useState(item?.station || '');
    const [offset, setOffset] = useState(item?.offset || '');
    // @TODO - utilize this for setting offset
    // const [offsetDescriptor, setOffsetDescriptor] = useState(item?.offsetDescriptor || '');
    const [project_id] = useState(item?.project_id || project.id);
    const [status_id, setStatusId] = useState(item?.status_id || '');
    const [status_time, setStatusTime] = useState(new Date());
    const [opts, setOpts] = useState(item?.opts || {});

    const projected =
      instrumentDrawLon && instrumentDrawLat
        ? doProjTransformFromLonLat(
          [instrumentDrawLon, instrumentDrawLat],
          projOptions[projDisplayProjection]
        )
        : ['', ''];

    const [x, setX] = useState(projected[0]);
    const [y, setY] = useState(projected[1]);

    useEffect(() => {
      if (instrumentDrawReady && item && item.geometry) {
        const geom = item.geometry;
        const itemLon = geom.coordinates[0];
        const itemLat = geom.coordinates[1];
        doInstrumentDrawUpdateLoc({ lat: itemLat, lon: itemLon });
      }
      return () => doInstrumentDrawOnMapClose;
    }, [
      instrumentDrawReady,
      doInstrumentDrawUpdateLoc,
      doInstrumentDrawOnMapClose,
      item,
    ]);

    useEffect(() => {
      if (instrumentDrawLat && instrumentDrawLon) {
        const projected = doProjTransformFromLonLat(
          [instrumentDrawLon, instrumentDrawLat],
          projOptions[projDisplayProjection]
        );
        setX(projected[0]);
        setY(projected[1]);
      }
    }, [
      instrumentDrawLat,
      instrumentDrawLon,
      doProjTransformFromLonLat,
      projOptions,
      projDisplayProjection,
    ]);

    // look to see if status should be updated
    const statusHasChanged = status_id !== item.status_id;

    const findDomainItem = (group, name) => domainsItemsByGroup[group]?.find(item => item.value === name);

    const handleSave = (e) => {
      e.preventDefault();
      if (x && y) {
        const lonLat = doProjTransformToLonLat(
          [Number(x), Number(y)],
          projOptions[projDisplayProjection]
        );

        const instrumentObject = {
          ...item,
          ...{
            name,
            project_id,
            type_id: type_id ?? item.type_id,
            status_id: status_id ?? item.status_id,
            status_time,
            opts,
            station:
              station === null || station === ''
                ? null
                : isNaN(Number(station))
                  ? null
                  : Number(station),
            offset:
              offset === null || offset === ''
                ? null
                : isNaN(Number(offset))
                  ? null
                  : Number(offset),
            geometry: {
              type: 'Point',
              coordinates: [lonLat[0], lonLat[1]],
            },
          }
        };

        doInstrumentsSave(
          isEdit ? instrumentObject : [instrumentObject],
          doModalClose,
          true
        );
      }
    };

    const handleDelete = (e) => {
      e.preventDefault();

      if (item && item.id) {
        doInstrumentsDelete(
          item,
          () => doModalClose(),
          true
        );
      }
    };

    const currentProj = projOptions[projDisplayProjection];
    const units = currentProj.getUnits();

    const handleLocUpdate = () => {
      if (x && y) {
        const lonLat = doProjTransformToLonLat(
          [Number(x), Number(y)],
          currentProj
        );
        doInstrumentDrawUpdateLoc({ lon: lonLat[0], lat: lonLat[1] });
      }
    };

    const handleSetDisplayProjection = (e) => {
      doProjSetDisplayProjection(e.target.value);
    };

    return (
      <div className='modal-content' style={{ overflowY: 'auto' }}>
        <form id='instrument-form' onSubmit={handleSave}>
          <ModalHeader title={`${isEdit ? 'Edit' : 'Add'} Instrument`} />
          <section className='modal-body'>
            <div className='mb-3' style={{ position: 'relative', height: 300 }}>
              <Map
                mapKey='inst-edit'
                options={{
                  center: item && item.geometry && item.geometry.coordinates || [-98.6, 39.8],
                  zoom: 4
                }}
                mapsObject={mapsObject}
                doMapsInitialize={doMapsInitialize}
                doMapsShutdown={doMapsShutdown}
              />
            </div>
            <div className='form-group'>
              <label>Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='form-control'
                type='text'
                placeholder='Name'
              />
            </div>
            <div className='form-group'>
              <label>Type</label>
              <DomainSelect defaultValue={item?.type_id} onChange={(val) => setTypeId(val?.id)} domain='instrument_type' />
            </div>
            {(
              findDomainItem('instrument_type', 'SAA')?.id === type_id ||
              findDomainItem('instrument_type', 'IPI')?.id === type_id
            ) && (
              <div className='pl-4'>
                <div className='form-group'>
                  <label>Bottom Elevation</label>
                  <input
                    value={opts.bottom_elevation}
                    onChange={(e) => setOpts(prev => ({ ...prev, bottom_elevation: Number(e.target.value) }))}
                    className='form-control'
                    type='number'
                    placeholder='Bottom Elevation'
                  />
                </div>
                <div className='form-group'>
                  <label>Number of Segments</label>
                  <input
                    value={opts.num_segments}
                    onChange={(e) => setOpts(prev => ({ ...prev, num_segments: Number(e.target.value) }))}
                    className='form-control'
                    type='number'
                    placeholder='Number of Segments'
                  />
                </div>
                {/* <div className='form-group'>
                  <label>Segment Length</label>
                  <input
                    value={opts.segment_length}
                    onChange={(e) => setOpts(prev => ({ ...prev, segment_length: e.target.value }))}
                    className='form-control'
                    type='number'
                    placeholder='Segment Length'
                  />
                </div> */}
              </div>
            )}
            <div className='form-group'>
              <label>Status</label>
              <DomainSelect defaultValue={item?.status_id} onChange={(val) => setStatusId(val?.id)} domain='status' />
            </div>
            {statusHasChanged ? (
              <div className='form-group'>
                <label>Status current as of</label>
                <div className='control'>
                  <DatePicker
                    className='form-control'
                    selected={status_time}
                    onChange={(val) => setStatusTime(val)}
                    showTimeInput
                  />
                </div>
              </div>
            ) : null}
            <div className='form-group'>
              <label>Station</label>
              <input
                value={station}
                onChange={(e) => setStation(e.target.value)}
                className='form-control'
                type='number'
                placeholder='Station'
              />
            </div>
            <div className='form-group'>
              <label>Offset</label>
              <input
                value={offset}
                onChange={(e) => setOffset(e.target.value)}
                className='form-control'
                type='number'
                placeholder='Offset'
              />
              <small className='form-text text-muted'>
                Offset should be positive on land side, negative on water side
              </small>
            </div>

            <div className='form-group'>
              <label>Offset Descriptor</label>
              {/* TODO integrate with new domain */}
              <DomainSelect defaultValue={''} onChange={(_val) => {}} domain='offset_descriptor' />
            </div>

            <div className='form-group'>
              <label>Use Projection</label>
              <select
                onChange={handleSetDisplayProjection}
                value={projDisplayProjection}
                className='form-control'
              >
                {Object.keys(projOptions).map((key, i) => (
                  <option key={i} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className='form-group'>
              <label>
                {`${
                  units === 'degrees' ? 'Longitude' : 'X coordinate'
                } in ${units}`}
              </label>
              <input
                data-key='x'
                value={x}
                onChange={(e) => setX(e.target.value)}
                onBlur={handleLocUpdate}
                className='form-control'
                type='number'
                placeholder={`${
                  units === 'degrees' ? 'Longitude' : 'X coordinate'
                } in ${units}`}
              />
            </div>
            <div className='form-group'>
              <label>{`${
                units === 'degrees' ? 'Latitude' : 'Y coordinate'
              } in ${units}`}</label>

              <input
                data-key='y'
                value={y}
                onChange={(e) => setY(e.target.value)}
                onBlur={handleLocUpdate}
                className='form-control'
                type='number'
                placeholder={`${
                  units === 'degrees' ? 'Latitude' : 'Y coordinate'
                } in ${units}`}
              />
            </div>
          </section>
          <ModalFooter
            saveIsSubmit
            customClosingLogic
            onCancel={() => doModalClose()}
            onDelete={handleDelete}
          />
        </form>
      </div>
    );
  }
);
