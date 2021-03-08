import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import ConfigurationPanel from './configuration-panel';
import DeleteButton from '../../../app-components/delete-confirm';
import Icon from '../../../app-components/icon';
import Select from '../../../app-components/select';
import usePrevious from '../../../customHooks/usePrevious';

import '../reporting.scss';

const ChartSettings = connect(
  'selectBatchPlotConfigurationsItems',
  'selectBatchPlotConfigurationsObject',
  'selectBatchPlotConfigurationsActiveId',
  'doBatchPlotConfigurationsDelete',
  'doBatchPlotConfigurationsSetActiveId',
  ({
    batchPlotConfigurationsItems,
    batchPlotConfigurationsObject,
    batchPlotConfigurationsActiveId,
    doBatchPlotConfigurationsDelete,
    doBatchPlotConfigurationsSetActiveId,
  }) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const previousConfigId = usePrevious(batchPlotConfigurationsActiveId);

    const configurations = batchPlotConfigurationsItems.map(config => ({
      text: config.name,
      value: config.id,
    }));

    const handleEditClick = () => {
      const currentItem = batchPlotConfigurationsObject[batchPlotConfigurationsActiveId];

      if (currentItem) {
        setIsEditMode(true);
        setIsPanelOpen(true);
      }
    };

    const handleDeleteClick = () => {
      const currentItem = batchPlotConfigurationsObject[batchPlotConfigurationsActiveId];

      if (currentItem) {
        doBatchPlotConfigurationsDelete(currentItem);
      }
    };

    const handleNewClick = () => {
      setIsEditMode(false);
      setIsPanelOpen(true);
    };

    const handleSelectChange = val => {
      if (val && val !== previousConfigId) {
        doBatchPlotConfigurationsSetActiveId(val);
      }
    };

    // Set active id to empty before we start. makes sure certain actions aren't available to the user that shouldn't be
    useEffect(() => {
      doBatchPlotConfigurationsSetActiveId('');
    }, [doBatchPlotConfigurationsSetActiveId]);

    return (
      <div className='d-flex justify-content-around'>
        <div className='left-panel'>
          <Select
            isDisabled={isPanelOpen}
            style={{ maxWidth: '350px' }}
            className='mr-2'
            placeholderText='Select a configuration...'
            options={configurations}
            onChange={handleSelectChange}
          />
          {batchPlotConfigurationsActiveId && (
            <>
              <Button
                isDisabled={isPanelOpen}
                isOutline
                size='small'
                variant='info'
                className='mr-2'
                title='Edit Selected Configuration'
                icon={<Icon icon='pencil' />}
                handleClick={() => handleEditClick()}
              />
              <DeleteButton
                isDisabled={isPanelOpen}
                isOutline
                size='small'
                className='mr-2'
                title='Delete Selected Configuration'
                deleteText=''
                deleteIcon={<Icon icon='trash-can' />}
                handleDelete={() => handleDeleteClick()}
              />
            </>
          )}
          <Button
            isDisabled={isPanelOpen}
            isOutline
            size='small'
            variant='success'
            text='+ Create New'
            handleClick={() => handleNewClick()}
          />
        </div>
        <ConfigurationPanel
          isOpen={isPanelOpen}
          isEditMode={isEditMode}
          configurations={configurations}
          closePanel={() => setIsPanelOpen(false)}
        />
      </div>
    );
  }
);

export default ChartSettings;
