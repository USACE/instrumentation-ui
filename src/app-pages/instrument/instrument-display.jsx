import React, { useCallback } from 'react';
import { connect } from 'redux-bundler-react';

import TimelineList from './timeline-list';
import Button from '../../app-components/button';
import RoleFilter from '../../app-components/role-filter';
import AssignToProjectsModal from './assignToProjectsModal';

const stationDisplay = station => {
  if (!station) return 'N/A';

  if (station.length < 3) return station;
  const asStr = String(station);

  return `${asStr.slice(0, -2)}+${asStr.slice(-2)}`;
};

const offsetDisplay = (offset, descriptor) => {
  if (!offset) return 'N/A';
  if (!descriptor) return offset;

  const descriptorClean = descriptor.replace(/ /g, '');
  const match = descriptorClean.split(/[/]/g);

  if (match.length > 1) {
    if (match[0] === '+') {
      return `${offset >= 0 ? match[0] : match[1]}${Math.abs(offset)}`;
    } else {
      return `${Math.abs(offset)} ${offset >= 0 ? match[0] : match[1]}`;
    }
  }

  return 'N/A';
};

export default connect(
  'doModalOpen',
  'doInstrumentsFetch',
  'selectInstrumentStatusItems',
  'selectInstrumentGroupsItemsObjectById',
  'selectProjectsByRoute',
  ({
    doModalOpen,
    doInstrumentsFetch,
    instrumentStatusItems: status,
    instrumentGroupsItemsObjectById: groups,
    projectsByRoute: project,
    item,
  }) => {
    const statusItems = status
      .map((s) => ({
        status: s.status,
        text: s.status
          ? s.status.charAt(0).toUpperCase() + s.status.slice(1)
          : 'Saving...',
        date: new Date(s.time),
      }))
      .sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      });

    const onClose = useCallback(() => {
      doInstrumentsFetch();
    }, [doInstrumentsFetch]);

    return (
      <div className='p-3'>
        <div className='row mb-2'>
          <div className='col-4 text-right font-weight-light'>
            Instrument Type
          </div>
          <div className='col'>{item.type}</div>
        </div>

        <div className='row mb-2'>
          <div className='col-4 text-right font-weight-light'>Status</div>
          <div className='col'>
            <TimelineList items={statusItems} />
          </div>
        </div>

        <div className='row mb-2'>
          <div className='col-4 text-right font-weight-light'>Station</div>
          <div className='col'>{stationDisplay(item.station)}</div>
        </div>

        <div className='row mb-2'>
          <div className='col-4 text-right font-weight-light'>Offset</div>
          <div className='col'>{offsetDisplay(item.offset, item.offsetDescriptor) || 'N/A'}</div>
        </div>

        <div className='row mb-2'>
          <div className='col-4 text-right font-weight-light'>Created On</div>
          <div className='col'>
            {item.create_date
              ? new Date(item.create_date).toLocaleDateString()
              : 'N/A'}
          </div>
        </div>

        <div className='row mb-2'>
          <div className='col-4 text-right font-weight-light'>
            Last Modified On
          </div>
          <div className='col'>
            {item.update_date
              ? new Date(item.update_date).toLocaleDateString()
              : 'N/A'}
          </div>
        </div>

        <div className='row mb-2'>
          <div className='col-4 text-right font-weight-light'>Belongs to</div>
          <div className='col'>
            {!item.groups || !item.groups.length
              ? 'Not a member of any group yet.'
              : null}
            {item.groups.map((groupId, i) => {
              const group = groups[groupId];
              if (!group) return null;
              return (
                <a key={i} href={`/${project.slug}/groups/${group.slug}`}>
                  {group.name}
                </a>
              );
            })}
          </div>
        </div>
        <RoleFilter allowRoles={[`${project.slug.toUpperCase()}.ADMIN`]}>
          <hr />
          <div className='row'>
            <div className='col-12 d-flex justify-content-center'>
              <Button
                isOutline
                size='small'
                variant='info'
                text='Assign Instrument to Another Project'
                onClick={() => doModalOpen(AssignToProjectsModal, { instrument: item, callback: onClose }, 'lg')}
              />
            </div>
          </div>
        </RoleFilter>
      </div>
    );
  }
);
