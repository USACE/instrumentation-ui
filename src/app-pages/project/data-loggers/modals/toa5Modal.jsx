import React, { useCallback, useRef, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { readString } from 'react-papaparse';
import { Difference, UploadFile } from '@mui/icons-material';

import * as Modal from '../../../../app-components/modal';
import Button from '../../../../app-components/button';
import HelperTooltip from '../../../../app-components/helper-tooltip';
import { pluralize } from '../../../../common/helpers/utils';

const parseFile = async (file, onComplete) => {
  const text = await file.text();

  readString(text, {
    worker: true,
    header: false,
    skipEmptyLines: true,
    complete: (results) => {
      onComplete(results);
    },
  });
};

const determineEquivalency = (equivalencyTable = {}, data = []) => {
  const equivalency = {
    fieldNames: [],
    errors: {
      notFound: [],
      noTimeseries: [],
    },
    matches: [],
  };

  const { rows = [] } = equivalencyTable;
  const oldFieldNames = rows.map(row => row?.field_name);

  if (data.length >= 2) {
    const clone = [...data[1]];
    clone.splice(0, 2);
    equivalency.fieldNames = clone;

    equivalency.fieldNames.forEach(field => {
      if (!oldFieldNames.includes(field)) {
        equivalency.errors.notFound.push(field);
      } else {
        const el = rows.find(el => el.field_name === field);
        if (!el?.timeseries_id) {
          equivalency.errors.noTimeseries.push(field);
        } else {
          equivalency.matches.push({
            field,
            timeseriesId: el.timeseries_id,
          });
        }
      }
    });
  }

  return equivalency;
};

const uploadToaMeasurements = (data, equivalency, doPostTimeseriesMeasurements) => {
  const { matches } = equivalency;
  const fieldIndexes = data[1];

  data.splice(0, 4);

  const measurements = matches.map(el => {
    const { timeseriesId, field } = el;
    const index = fieldIndexes.findIndex(datum => datum === field);

    return {
      timeseries_id: timeseriesId,
      items: data.map(datum => ({
        time: new Date(datum[0]).toISOString(),
        value: Number(datum[index]),
      })),
    };
  });

  doPostTimeseriesMeasurements({ measurements });
};

const Toa5Modal = connect(
  'doModalClose',
  'doCreateDataLoggerEquivalency',
  'doPostTimeseriesMeasurements',
  'selectDataLoggerEquivalencyTable',
  ({
    doModalClose,
    doCreateDataLoggerEquivalency,
    doPostTimeseriesMeasurements,
    dataLoggerEquivalencyTable: equivalencyTable,
    dataLoggerInfo,
  }) => {
    const { id } = dataLoggerInfo;

    const inputEl = useRef(null);
    const [file, setFile] = useState(null);
    const [fileData, setFileData] = useState({});
    const [ignoreErrors, setIgnoreErrors] = useState(false);
    const { data = [] } = fileData;

    const handleClick = (_e) => {
      inputEl.current.click();
    };

    const handleInputChange = (_e) => {
      setFile(inputEl.current.files[0]);

      parseFile(
        inputEl.current.files[0],
        (results) => setFileData(results),
      );
    };

    const equivalency = useCallback(determineEquivalency(equivalencyTable, data), [equivalencyTable, data]);

    return (
      <Modal.ModalContent>
        <Modal.ModalHeader title='Upload TOA5 File' />
        <Modal.ModalBody>
          <>
            {file && (
              <b className='mr-2'>
                {file.name}
              </b>
            )}
            <Button
              className=''
              handleClick={handleClick}
              variant='success'
              size='small'
              text={file ? 'Change File' : 'Choose File'}
              icon={
                file
                  ? <Difference fontSize='inherit' sx={{ marginBottom: '2px' }} />
                  : <UploadFile fontSize='inherit' sx={{ marginBottom: '2px' }} />
              }
            />
            <input
              accept='.dat'
              style={{ display: 'none' }}
              ref={inputEl}
              type='file'
              onChange={handleInputChange}
            />
            {!!data.length && (
              <div className='mt-3 w-100'>
                <hr />
                <h6>TOA5 File Metadata</h6>
                <span className='d-block mt-2'><b>File Format: </b>{data[0][0]}</span>
                <span className='d-block mt-1'><b>Data Logger Model: </b>{data[0][2]}</span>
                <span className='d-block mt-1'><b>Data Logger Serial Number: </b>{data[0][3]}</span>
                {/* <span className='d-block mt-1'><b>Mapping Table: </b>{data[0][7]}</span> */}
                <hr />
                {(!!equivalency?.errors?.notFound?.length || !!equivalency?.errors?.noTimeseries?.length) ? (
                  <>
                    {!!equivalency?.errors?.notFound?.length && (
                      <>
                        <span className='text-danger'>
                          <i>Found the following fields that are not mapped in the Field Mapping Table for this data logger:</i>
                          <br />
                          {equivalency.errors.notFound.map((error, i) => {
                            if (i < 5)
                              return <span key={error}>{error}, </span>;
                          })}
                          {equivalency.errors.notFound.length > 5 && (
                            <span>and {equivalency.errors.notFound.length - 5} other(s)... </span>
                          )}
                        </span>
                        <span className='d-block mt-2'>
                          <Button
                            isOutline
                            variant='info'
                            size='small'
                            text='Add Missing Fields'
                            title='Add Missing Fields to Field Mapping Table'
                            handleClick={() => {
                              doCreateDataLoggerEquivalency({ dataLoggerId: id, newRows: equivalency.errors.notFound });
                              doModalClose();
                            }}
                          />
                          <HelperTooltip
                            id='missing-fields-help'
                            content={
                              <span>
                                Clicking this button will add all missing fields to the Field Mapping Table. <br />
                                This will also close the modal giving you the opportunity to add the <br />
                                associated instruments and timeseries to each new field in the field <br />
                                mapping table in the data logger page view.
                              </span>
                            }
                          />
                        </span>
                      </>
                    )}
                    {!!equivalency?.errors?.noTimeseries?.length && (
                      <>
                        <span className='text-danger d-block'>
                          <i>Found the following fields that do not have associated timeseries:</i>
                          <br />
                          {equivalency.errors.noTimeseries.map((error, i) => {
                            if (i < 5)
                              return <span key={error}>{error}, </span>;
                          })}
                          {equivalency.errors.noTimeseries.length > 5 && (
                            <span>and {equivalency.errors.noTimeseries.length - 5} other(s)... </span>
                          )}
                        </span>
                        <>
                          <Button
                            className='p-0 pr-1 mb-1'
                            variant='link'
                            text='Close'
                            handleClick={() => doModalClose()}
                          />
                          <span className='d-inline-block mt-2'>this modal to add timeseries to the Field Mapping Table.</span>
                        </>
                      </>
                    )}
                    <div className='mt-2'>
                      <input
                        type='checkbox'
                        className='mr-2'
                        checked={ignoreErrors}
                        onChange={() => setIgnoreErrors(prev => !prev)}
                      />
                      Ignore Errors <i>({equivalency?.matches?.length + pluralize(' match', ' matches', equivalency?.matches?.length)})</i>
                      <HelperTooltip
                        id='ignore-errors-help'
                        content={
                          <span>
                            Selecting this option will enable you to save any data that <br />
                            can find a matching field in the Field Mapping Table. Any data <br />
                            that cannot find a matching field will be ignored and will <b>NOT</b><br/>
                            be uploaded.
                          </span>
                        }
                      />
                    </div>
                  </>
                ) : <i>No Errors Found!</i>}
              </div>
            )}
          </>
        </Modal.ModalBody>
        <Modal.ModalFooter
          showCancelButton
          saveIsDisabled={!(data.length && ((!equivalency.errors.notFound.length && !equivalency.errors.noTimeseries.length) || ignoreErrors))}
          cancelText='Close'
          saveText='Upload'
          onSave={() => uploadToaMeasurements(data, equivalency, doPostTimeseriesMeasurements)}
        />
      </Modal.ModalContent>
    );
  },
);

export default Toa5Modal;
