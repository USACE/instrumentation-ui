import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
import { Delete, Edit } from '@mui/icons-material';

import Button from '../../../../app-components/button';
import ConfigurationPanel from './configuration-panel';
import DeleteButton from '../../../../app-components/delete-confirm';
import Select from '../../../../app-components/select';
import usePrevious from '../../../../customHooks/usePrevious';

import '../batch-plotting.scss';

const DataConfiguration = connect(
  'selectBatchPlotConfigurationsItems',
  'selectBatchPlotConfigurationsItemsObject',
  'selectBatchPlotConfigurationsActiveId',
  'doBatchPlotConfigurationsDelete',
  'doBatchPlotConfigurationsSetActiveId',
  ({
    batchPlotConfigurationsItems,
    batchPlotConfigurationsItemsObject,
    batchPlotConfigurationsActiveId,
    doBatchPlotConfigurationsDelete,
    doBatchPlotConfigurationsSetActiveId,
    initialConfigurationId,
  }) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const previousConfigId = usePrevious(batchPlotConfigurationsActiveId);

    const configurations = batchPlotConfigurationsItems.map(config => ({
      text: config.name,
      value: config.id,
    })).sort((a, b) => a.text.localeCompare(b.text));

    const handleEditClick = () => {
      const currentItem = batchPlotConfigurationsItemsObject[batchPlotConfigurationsActiveId];

      if (currentItem) {
        setIsEditMode(true);
        setIsPanelOpen(true);
      }
    };

    const handleDeleteClick = () => {
      const currentItem = batchPlotConfigurationsItemsObject[batchPlotConfigurationsActiveId];

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

    useEffect(() => {
      if (initialConfigurationId) {
        doBatchPlotConfigurationsSetActiveId(initialConfigurationId);
      }
    }, [initialConfigurationId, doBatchPlotConfigurationsSetActiveId]);

    return (
      <div className='d-flex justify-content-around'>
        <div className='left-panel'>
          <Select
            defaultOption={initialConfigurationId || undefined}
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
                icon={<Edit fontSize='inherit' />}
                handleClick={() => handleEditClick()}
              />
              <DeleteButton
                isDisabled={isPanelOpen}
                isOutline
                size='small'
                className='mr-2'
                title='Delete Selected Configuration'
                deleteText=''
                deleteIcon={<Delete fontSize='inherit' />}
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

export default DataConfiguration;
