import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../../app-components/button';
import InstrumentForm from '../forms/instrument-form';
import MultiSelect from '../../../app-components/multi-select/multi-select';
import Pagination, { handlePageChange } from '../../../app-components/pagination';
import RoleFilter from '../../../app-components/role-filter';

const titlize = str => str ? str.charAt(0).toUpperCase() + str.slice(1) : 'N/A';

const Table = connect(
  'doModalOpen',
  'selectProjectsByRoute',
  ({
    doModalOpen,
    projectsByRoute: project,
    instruments,
    tools,
  }) => {
    /** -- START -- Build Dynamic Dropdown options from current instruments (only show options that are available) */
    const statusOptions = [...new Set(instruments.map(instrument => titlize(instrument.status)))].map(status => ({ value: status }));
    const typeOptions = [...new Set(instruments.map(instrument => instrument.type))].map(type => ({ value: type }));
    const initialStatusOptions = statusOptions.map(o => o.value);
    const initialTypeOptions = typeOptions.map(o => o.value);
    /** -- END -- */

    const [statusFilter, setStatusFilter] = useState(initialStatusOptions);
    const [typeFilter, setTypeFilter] = useState(initialTypeOptions);
    const [filteredInstruments, setFilteredInstruments] = useState(instruments);
    const [upperLimit, setUpperLimit] = useState(10);
    const [lowerLimit, setLowerLimit] = useState(0);

    // If a filter changes, filter the current instruments based on user selection
    useEffect(() => {
      const filtered = instruments.filter(instrument => (
        statusFilter.includes(titlize(instrument.status)) &&
        typeFilter.includes(instrument.type)
      ));

      setFilteredInstruments(filtered);
    }, [statusFilter, typeFilter, instruments, setFilteredInstruments]);

    // If new instruments are added, update the filteredInstruments to include them
    useEffect(() => {
      setFilteredInstruments(instruments);
    }, [instruments, setFilteredInstruments]);

    return (
      <>
        <table className='table is-fullwidth'>
          <thead>
            <tr>
              <th>
                Status
                {statusOptions.length > 1 && (
                  <MultiSelect
                    withSelectAllOption
                    buttonSize='small'
                    className='d-inline pl-3'
                    options={statusOptions}
                    text={<span><i className='mdi mdi-filter' />({statusFilter.length})</span>}
                    initialValues={initialStatusOptions}
                    onChange={val => setStatusFilter(val)}
                  />
                )}
              </th>
              <th>Name</th>
              <th>
                Type
                {typeOptions.length > 1 && (
                  <MultiSelect
                    withSelectAllOption
                    buttonSize='small'
                    className='d-inline pl-3'
                    options={typeOptions}
                    text={<span><i className='mdi mdi-filter' />({typeFilter.length})</span>}
                    initialValues={initialTypeOptions}
                    onChange={val => setTypeFilter(val)}
                  />
                )}
              </th>
              <th>Tools</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstruments.map((instrument, i) => {
              if (i >= lowerLimit && i < upperLimit) {
                return (
                  <tr key={i}>
                    {instrument.status ? (
                      <td title={`Instrument is ${instrument.status}`}>
                        <i className={`mdi mdi-circle status-icon ${instrument.status} pr-2`} />
                        {titlize(instrument.status)}
                      </td>) : <td />
                    }
                    <td style={{ width: '30%' }}>
                      <a href={`/${project.slug}/instruments/${instrument.slug}`}>
                        {instrument.name}
                      </a>
                    </td>
                    <td>{instrument.type}</td>
                    <td style={{ width: '200px' }}>
                      <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.*`]}>
                        <Button
                          variant='info'
                          size='small'
                          isOutline
                          title='Edit'
                          className='mr-3'
                          handleClick={() => doModalOpen(InstrumentForm, { item: instrument })}
                          icon={<i className='mdi mdi-pencil' />}
                        />
                        {tools && (
                          tools.map((Tool, i) => <Tool key={i} item={instrument} />)
                        )}
                      </RoleFilter>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
        <Pagination
          itemCount={filteredInstruments.length}
          handlePageChange={(newPage, pageSize) => handlePageChange({ newPage, pageSize, setUpperLimit, setLowerLimit })}
        />
      </>
    );
  }
);

export default Table;
