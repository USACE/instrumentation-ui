import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { roundToNearestMinutes } from 'date-fns';
import { Add, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import Button from '../../app-components/button';
import Card from '../../app-components/card';
import CollectionGroupForm from '../../common/forms/collection-group-form';
import CollectionGroupTimeseriesPicker from './collectiongroup-timeseries-picker';
import LoginMessage from '../../app-components/login-message';
import RoleFilter from '../../app-components/role-filter';
import TimeseriesList from './collectiongroup-timeseries-list';
import TimestampModeSwitcher from './collectiongroup-timestamp-mode-switcher';

export default connect(
  'doModalOpen',
  'doNotificationFire',
  'doCollectionGroupRemoveTimeseries',
  'doTimeseriesMeasurementsSave',
  'selectAppTime',
  'selectCollectionGroupDetailByRoute',
  'selectProjectsByRoute',
  ({
    doModalOpen,
    doNotificationFire,
    doCollectionGroupRemoveTimeseries,
    doTimeseriesMeasurementsSave,
    appTime,
    collectionGroupDetailByRoute: detail,
    projectsByRoute: project,
  }) => {
    const [isShown, setIsShown] = useState(true);
    const [timestampMode, setTimestampMode] = useState('now'); // One of ['now', 'choose']
    const [date, setDate] = useState(new Date());

    useEffect(() => {
      if (timestampMode === 'now') {
        const d = roundToNearestMinutes(new Date());
        setDate(d);
      }
    }, [timestampMode, appTime]);

    const handleTimeseriesSaveValue = (
      { id, instrument, name, unit },
      value
    ) => {
      const success = {
        type: 'success',
        title: `Saved ${instrument} | ${name} `,
        message: `${value} ${unit}  @  ${date.toISOString()}`,
      };
      const fail = {
        type: 'error',
        title: 'Missing Value',
        message: 'Enter a value before clicking add',
      };

      if (!value) {
        doNotificationFire(fail);
      } else {
        doTimeseriesMeasurementsSave(
          {
            timeseries_id: id,
            items: [
              {
                time: date.toISOString(),
                value: parseFloat(value),
              },
            ],
          },
          doNotificationFire(success),
          false,
          true
        );
      }
    };

    return (
      <div style={{ marginBottom: '200px' }}>
        {detail && (
          <section className='container'>
            <div className='d-flex flex-row align-items-center'>
              <h4 className='py-4'>{detail.name}</h4>
              <RoleFilter
                allowRoles={[`${project.slug.toUpperCase()}.*`]}
                alt={() => <LoginMessage className='p-2' />}
              >
                <Button
                  variant='link'
                  size='small'
                  className='text-left'
                  handleClick={(e) => {
                    doModalOpen(CollectionGroupForm, { item: detail });
                    e.stopPropagation();
                  }}
                  text='Edit'
                />
              </RoleFilter>
            </div>
            {/* CONFIGURATION DETAILS */}
            <div className='row'>
              <div className='col'>
                <Card>
                  <Card.Header
                    className='bg-light p-2 px-3'
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    onClick={(_e) => setIsShown(!isShown)}
                  >
                    <div className='d-flex flex-row align-items-center'>
                      {isShown
                        ? <KeyboardArrowUp sx={{ fontSize: '24px', marginRight: '5px' }} />
                        : <KeyboardArrowDown sx={{ fontSize: '24px', marginRight: '5px' }} />
                      }
                      <h5 className='p-0 m-0'>Timeseries</h5>
                      <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                        <Button
                          variant='link'
                          size='small'
                          handleClick={(e) => {
                            doModalOpen(CollectionGroupTimeseriesPicker);
                            e.stopPropagation();
                          }}
                          text='Add'
                          icon={<Add sx={{ marginBottom: '2px', fontSize: '18px' }} />}
                        />
                      </RoleFilter>
                    </div>
                    <TimestampModeSwitcher
                      timestampMode={timestampMode}
                      setTimestampMode={setTimestampMode}
                      date={date}
                      setDate={setDate}
                    />
                  </Card.Header>

                  {isShown ? (
                    <Card.Body>
                      <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                        <TimeseriesList
                          date={date}
                          items={detail.timeseries}
                          handleItemSaveValue={handleTimeseriesSaveValue}
                          handleItemDelete={(item) => {
                            doCollectionGroupRemoveTimeseries({
                              projectId: detail.project_id,
                              collectionGroupId: detail.id,
                              timeseriesId: item.id,
                            });
                          }}
                        />
                      </div>
                    </Card.Body>
                  ) : null}
                </Card>
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }
);
