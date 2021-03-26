import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../app-components/button';
import Card from '../../app-components/card';
import Tab from '../../app-components/tab';

const csvSampleProjects = [
  ['Project Name'],
  ['My Sample Project Name 1'],
  ['My Sample Project Name 2'],
];

const csvSampleInstruments = [
  [
    'Project',
    'Name',
    'Status',
    'Type',
    'Longitude',
    'Latitude',
    'ZReference',
    'Station',
    'Offset',
  ],
  [
    'My Sample Project Name 1',
    'My Example Piezometer 1A',
    'active',
    'Piezometer',
    -80.77,
    26.7,
    10.5,
    '100',
    '50',
  ],
  [
    'My Sample Project Name 1',
    'Piezometer at North Spillway Pool Side',
    'active',
    'Piezometer',
    -82.15,
    27.0,
    300.25,
    '100',
    '50',
  ],
];

const csvSampleTimeseries = [
  [
    'Instrument',
    'Name',
    'Parameter',
    'Unit'
  ],
  [
    'My Example Piezometer 1A',
    'My Example Timeseries 1A',
    'Precipitation',
    'Inches'
  ],
  [
    'My Example Piezometer 1A',
    'My Example Timeseries 1B',
    'Voltage',
    'Volts'
  ]
];

const csvSampleTimeseriesMeasurements = [
  ['Timeseries', 'Date', 'Reading'],
  ['My Example Timeseries 1A', '3/31/19 0:00', '2557.495189'],
  ['My Example Timeseries 1A', '3/31/19 1:00', '2557.496789'],
  ['My Example Timeseries 1A', '3/31/19 2:00', '2557.504244'],
];

const DownloadCSVButton = ({ csvContent, filename }) => {
  // Used as a reference:
  // https://code-maven.com/create-and-download-csv-with-javascript
  const handleClick = (e) => {
    var csv = '';
    csvContent.forEach((row) => {
      csv += `${row.join(',')}\n`;
    });
    const blob = new Blob([csv], { type: 'application/text' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Button
      variant='info'
      size='small'
      isOutline
      text='Download Template .CSV'
      handleClick={handleClick}
    />
  );
};

export default connect(
  'selectDomainsItemsByGroup',
  ({ domainsItemsByGroup }) => {
    // NotesXYZ are additional information to be included with each tab
    const NotesInstruments = ({ props }) => (
      <div>
        <p className='text-info'>Optional Fields:</p>
        <ul>
          <li key={1}>Station</li>
          <li key={2}>Offset</li>
        </ul>
        <p className='text-info'>Type can be one of the following:</p>
        <ul>
          {domainsItemsByGroup.instrument_type.map((t, idx) => (
            <li key={idx}>{t.value}</li>
          ))}
        </ul>
        <p className='text-info'>Status can be one of the following:</p>
        <ul>
          {domainsItemsByGroup.status.map((t, idx) => (
            <li key={idx}>{t.value}</li>
          ))}
        </ul>
      </div>
    );
    const NotesProjects = ({ props }) => <></>;
    const NotesTimeseries = ({ props }) => (
      <div>
        <p className='text-info'>Parameter can be one of the following:</p>
        <ul>
          {domainsItemsByGroup.parameter.map((t, idx) => (
            <li key={idx}>{t.value}</li>
          ))}
        </ul>
        <p className='text-info'>Unit can be one of the following:</p>
        <ul>
          {domainsItemsByGroup.unit.map((t, idx) => (
            <li key={idx}>{t.value}</li>
          ))}
          {/* <li>Inches</li>
          <li>Feet</li>
          <li>Volts</li>
          <li>Millibar</li>
          <li>Inches mercury (Hg)</li> */}
        </ul>
      </div>
    );
    const NotesTimeseriesMeasurements = ({ props }) => <></>;

    const CSV = ({ arr }) => (
      <pre>
        {arr.map((row, idx) => (
          <p className='m-0' key={idx}>
            {row.join(',')}
          </p>
        ))}
      </pre>
    );

    const buildContent = (title, csvData, notes) => (
      <div>
        <div className='float-right'>
          <DownloadCSVButton
            csvContent={csvData}
            filename={`${title}.csv`}
          />
        </div>
        <CSV arr={csvData} />
        <section className='section has-background-'>
          {notes}
        </section>
      </div>
    );

    const tabs = [
      {
        title: 'Projects',
        content: buildContent('Projects', csvSampleProjects, <NotesProjects />),
      },
      {
        title: 'Instruments',
        content: buildContent('Instruments', csvSampleInstruments, <NotesInstruments />),
      },
      {
        title: 'Timeseries',
        content: buildContent('Timeseries', csvSampleTimeseries, <NotesTimeseries />),
      },
      {
        title: 'Timeseries Measurements',
        content: buildContent('Timeseries Measurements', csvSampleTimeseriesMeasurements, <NotesTimeseriesMeasurements />),
      },
    ];

    return (
      <Card>
        <Card.Body>
          <p>
            <strong className='pr-3'>Q:</strong>I want to try the site with my
            own projects. How should I organize my dataset for upload?
          </p>
          <p className='text-muted'>
            Glad you asked! The site supports .csv uploads of Instruments at
            this time. Uploaders for Projects, Timeseries, and Timeseries
            measurements are coming in the next few weeks. To get organized,
            start with <span className='has-text-weight-bold'>projects</span>{' '}
            and <span className='has-text-weight-bold'>instruments</span>.
            Create a separate .csv file for each. You can download the template
            .csv files below and modify them with your own data.
          </p>
          <p></p>
          <Tab.Container tabs={tabs} />
        </Card.Body>
      </Card>
    );
  }
);
