import React from 'react';
import { connect } from 'redux-bundler-react';

import Button from '../../app-components/button';
import Card from '../../app-components/card';
import TabContainer from '../../app-components/tab';

const apiURL = import.meta.env.DEV
  ? 'http://localhost:8080'
  : import.meta.env.VITE_API_URL;

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
  ['My Example Timeseries 1A', '2021-07-14T00:00:00', '2557.495189'],
  ['My Example Timeseries 1A', '2021-07-14T01:00:00', '2557.496789'],
  ['My Example Timeseries 1A', '2021-07-14T02:00:00', '2557.504244'],
];

const csvSampleInclinometerMeasurements = [
  ['Survey DateTime', 'Depth', 'A0', 'A180', 'B0', 'B180'],
  ['2020-10-08T11:48:00', '2', '36',	'-54',	'-180',	'225'],
  ['2020-10-08T11:48:00', '4',	'-229',	'206',	'-111',	'166'],
  ['2020-10-08T11:48:00', '6',	'-169',	'148',	'-105',	'159'],
  ['2020-10-08T11:48:00', '8',	'-85',	'65',	'-95',	'139'],
  ['2020-10-08T11:48:00', '10',	'-65',	'43',	'-73',	'122'],
];

const DownloadCSVButton = ({ csvContent, filename }) => {
  // Used as a reference:
  // https://code-maven.com/create-and-download-csv-with-javascript
  const handleClick = () => {
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
    const NotesInstruments = () => (
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
    const NotesProjects = () => <></>;
    const NotesTimeseries = () => (
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
        </ul>
      </div>
    );
    const NotesTimeseriesMeasurements = () => <></>;
    const NotesInclinometerMeasurements = () => <></>;
    const NotesAPI = () => (
      <div>
        <p className='text-primary'>Click the link below to view the Swagger Documentation for the API:</p>
        <a href={`${apiURL}/swagger/index.html`} target='_blank' rel='noreferrer'>{apiURL}/swagger/index.html</a>
      </div>
    );

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
        {csvData && (
          <>
            <div className='float-right'>
              <DownloadCSVButton
                csvContent={csvData}
                filename={`${title}.csv`}
              />
            </div>
            <CSV arr={csvData} />
          </>
        )}
        <section className='section has-background'>
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
      {
        title: 'Inclinometer Measurements',
        content: buildContent('Inclinometer Measurements', csvSampleInclinometerMeasurements, <NotesInclinometerMeasurements />),
      },
      {
        title: 'API',
        content: buildContent('API', null, <NotesAPI />),
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
            Glad you asked! The site supports .csv uploads of Instruments, Timeseries, Timeseries
            measurements and Inclinometer measurements at this time. Uploaders for Projects are coming soon. To get organized,
            start with <span className='has-text-weight-bold'>projects</span>{' '}
            and <span className='has-text-weight-bold'>instruments</span>.
            Create a separate .csv file for each. You can download the template
            .csv files below and modify them with your own data.
          </p>
          <p></p>
          <TabContainer tabs={tabs} />
        </Card.Body>
      </Card>
    );
  }
);
