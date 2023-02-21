/*

Extractor name format:

Part 1: Model Name
Part 2: _fieldNameExtractor

This can be used programatically to select the function.
If a mapping function exists that matches the expected JSON output of your datalogger,
  export that function with the proper naming convention for your datalogger.

Ex:

import * as extractorFns from '/path/to/dataLoggerFieldMappers';

const myExtractor = extractorFns[`${model}_fieldNameExtractor`];
const mapperRows = myExtractor(rawData);

All functions should return an Array of objects formatted as the folowing:

[
  { fieldName: 'xxx' },
  { fieldName: 'yyy' },
  { fieldName: 'zzz' },
]

*/


/**
 *  Campbell Scientific’s JSON schema standard
 *  Expected field_name location:
 *    {
 *      "head": {
 *        "fields": [
 *          {
 *            "name": *,
 *            ...
 *          }
 *        ]
 *        ...
 *      }
 *    }
 */
const CSIJSON = rawData => {
  const dataKeys = Object.keys(rawData);
  if (!dataKeys.length) return [];

  const { head = {} } = rawData;
  const { fields = [] } = head;

  return fields.map(el => ({ fieldName: el.name }));
};

export {
  CSIJSON as CR6_fieldNameExtractor,
  CSIJSON as CR1000X_fieldNameExtractor,
};