import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { roundToNearestMinutes } from 'date-fns';
import { Add, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

import Button from '../../app-components/button';
import Card from '../../app-components/card';
import collectionGroupForm from '../../common/forms/collection-group-form';
import collectionGroupTimeseriesPicker from './collectiongroup-timeseries-picker';
import LoginMessage from '../../app-components/login-message';
import RoleFilter from '../../app-components/role-filter';
import TimeseriesList from './collectiongroup-timeseries-list';
import TimestampModeSwitcher from './collectiongroup-timestamp-mode-switcher';

export default connect(
  'doCollectionGroupRemoveTimeseries',
  'doCollectionGroupDetailsTimeseriesUpdate',
  'doModalOpen',
  'doNotificationFire',
  'doTimeseriesMeasurementsSave',
  'selectAppTime',
  'selectCollectionGroupDetailByRoute',
  'selectProjectsByRoute',
  ({
    doCollectionGroupRemoveTimeseries,
    doCollectionGroupDetailsTimeseriesUpdate,
    doModalOpen,
    doNotificationFire,
    doTimeseriesMeasurementsSave,
    appTime,
    collectionGroupDetailByRoute: detail,
    projectsByRoute: project,
  }) => {
    const [isShown, setIsShown] = useState(true);
    const [timestampMode, setTimestampMode] = useState('now'); // One of ['now', 'choose']
    const [date, setDate] = useState(new Date());
    const [localTimeseriesOrder, setLocalTimeseriesOrder] = useState([]);

    useEffect(() => {
      if (timestampMode === 'now') {
        const d = roundToNearestMinutes(new Date());
        setDate(d);
      }
    }, [timestampMode, appTime]);

    useEffect(
      () => {
        setLocalTimeseriesOrder(detail?.timeseries.sort((a, b) =>
          (a.list_order === null) - (b.list_order === null) || a.list_order - b.list_order
        ));
      },
      [detail]
    );

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

    const updateLocalTimeseriesOrder = (newLocalTimeseriesOrder) => {
      setLocalTimeseriesOrder(
        newLocalTimeseriesOrder.map((item, index) => {
          item.list_order = index;
          return item;
        })
      );
    };

    const handleLocalTimeseriesOrderChange = (
      item,
      type
    ) => {
      switch (type) {
        case '++': {
          updateLocalTimeseriesOrder([item, ...localTimeseriesOrder.filter(x => x != item)]);
          break;
        }
        case '+': {
          const idx = localTimeseriesOrder.indexOf(item);

          if (idx === 0) {
            const newLocalTimeseriesOrder = [...localTimeseriesOrder.filter(x => x != item), item];
            updateLocalTimeseriesOrder(newLocalTimeseriesOrder);
          } else {
            const newLocalTimeseriesOrder = localTimeseriesOrder.slice();
            [newLocalTimeseriesOrder[idx], newLocalTimeseriesOrder[idx-1]] = [newLocalTimeseriesOrder[idx-1], newLocalTimeseriesOrder[idx]];
            updateLocalTimeseriesOrder(newLocalTimeseriesOrder);
          }
          break;
        }
        case '-': {
          const idx = localTimeseriesOrder.indexOf(item);

          if (idx === (localTimeseriesOrder.length - 1)) {
            const newLocalTimeseriesOrder = [item, ...localTimeseriesOrder.filter(x => x != item)];
            updateLocalTimeseriesOrder(newLocalTimeseriesOrder);
          } else {
            const newLocalTimeseriesOrder = localTimeseriesOrder.slice();
            [newLocalTimeseriesOrder[idx], newLocalTimeseriesOrder[idx+1]] = [newLocalTimeseriesOrder[idx+1], newLocalTimeseriesOrder[idx]];
            updateLocalTimeseriesOrder(newLocalTimeseriesOrder);
          }
          break;
        }
        case '--':
          updateLocalTimeseriesOrder([...localTimeseriesOrder.filter(x => x != item), item]);
          break;
        default:
      }
    };

    const handleTimeseriesOrderSave = () => {
      const success = {
        type: 'success',
        title: `Save Successful`,
        message: `Timeseries order updated`,
      };

      doCollectionGroupDetailsTimeseriesUpdate({
        id: detail.id,
        timeseries: localTimeseriesOrder
      });

      doNotificationFire(success);
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
                    doModalOpen(collectionGroupForm, { item: detail });
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
                          handleClick={e => {
                            doModalOpen(collectionGroupTimeseriesPicker);
                            e.stopPropagation();
                          }}
                          text='Add'
                          icon={<Add sx={{ marginBottom: '2px', fontSize: '18px' }} />}
                        />
                        <Button
                          variant='success'
                          size='small'
                          handleClick={e => {
                            handleTimeseriesOrderSave();
                            e.stopPropagation();
                          }}
                          text='Save Order'
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

                  {isShown && localTimeseriesOrder ? (
                    <Card.Body>
                      <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                        <TimeseriesList
                          items={detail.timeseries}
                          date={date}
                          handleItemDelete={(item) => {
                            doCollectionGroupRemoveTimeseries({
                              projectId: detail.project_id,
                              collectionGroupId: detail.id,
                              timeseriesId: item.id,
                            });
                          }}
                          handleItemSaveValue={handleTimeseriesSaveValue}
                          handleLocalTimeseriesOrderChange={handleLocalTimeseriesOrderChange}
                          localTimeseriesOrder={localTimeseriesOrder}
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
