import { isNumeric } from './validators';

const parseStupidCoords = (stupid) => {
  const splitted = stupid.split(' ');
  let dd = 0;
  if (splitted[1]) dd = dd + Number(splitted[1]);
  if (splitted[2]) dd = dd + Number(splitted[2]) / 60;
  if (splitted[3]) dd = dd + Number(splitted[3]) / 60 / 60;
  if (splitted[0].toUpperCase() === 'W' || splitted[0].toUpperCase() === 'S')
    dd = dd * -1;
  return dd;
};

/**
 * Each parser is an object that helps drive how the form is drawn
 * and provides methods for previewing, validating, and parsing data
 * once fields are mapped over.
 */

const instrumentParser = {
  name: 'Instruments',
  url: `/projects/:projectId/instruments`,
  postProcess: (rows) => {
    // convert lat and lon to geojson geometry
    rows.forEach((row) => {
      row.geometry = { type: 'Point', coordinates: [] };
      if (!isNaN(row.lon)) {
        row.geometry.coordinates[0] = parseFloat(row.lon);
        delete row.lon;
      }
      if (!isNaN(row.lat)) {
        row.geometry.coordinates[1] = parseFloat(row.lat);
        delete row.lat;
      }
    });
    return rows;
  },
  model: {
    name: {
      label: 'Name',
      type: 'string',
      required: true,
      parse: (val) => {
        return val;
      },
      validate: (val, state) => {
        const existingInstruments = Object.keys(state.instruments);
        return existingInstruments.indexOf(val.toLowerCase()) === -1;
      },
      helpText:
        'Instrument Names must be unique for a project, these will be compared to all names within the database and show an error if a duplicate is found.',
    },
    status_id: {
      label: 'Status',
      type: 'domain',
      domainGroup: 'status',
      required: true,
      template: '',
      helpText: `Acceptable data values include 'active', 'inactive', 'lost', 'destroyed', or 'abandoned' and are case-insensitive, all others will be ignored`,
    },
    type_id: {
      label: 'Type',
      type: 'domain',
      domainGroup: 'instrument_type',
      required: true,
      template: '',
      helpText: `Acceptable data values include 'Piezometer' or 'Staff Gage' others will be ignored`,
    },
    lon: {
      label: 'Lon.',
      type: 'coord',
      required: true,
      template: '',
      parse: (val) => {
        if (val.toUpperCase().indexOf('W') !== -1)
          return parseStupidCoords(val);
        if (val.toUpperCase().indexOf('E') !== -1)
          return parseStupidCoords(val);
        return val;
      },
      validate: isNumeric,
    },
    lat: {
      label: 'Lat.',
      type: 'coord',
      required: true,
      template: '',
      parse: (val) => {
        if (val.toUpperCase().indexOf('N') !== -1)
          return parseStupidCoords(val);
        if (val.toUpperCase().indexOf('S') !== -1)
          return parseStupidCoords(val);
        return val;
      },
      validate: isNumeric,
    },
    station: {
      label: 'Station',
      type: 'number',
      required: false,
      template: '',
      helpText: `Station notation i.e. 100+50 will be parsed to numeric values in feet, only the + character is allowed.`,
      parse: (val) => {
        return Number(val.replace('+', ''));
      },
      validate: isNumeric,
    },
    offset: {
      label: 'Offset',
      type: 'number*100',
      required: false,
      template: '',
      helpText:
        'Only numeric values will be parsed, positive values are water-side and negative values are land-side',
    },
  },
};

export default instrumentParser;