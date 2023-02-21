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

*/

const CR6_fieldNameExtractor = rawData => {
  console.log('test rawData:', rawData);
};

export {
  CR6_fieldNameExtractor,
  CR6_fieldNameExtractor as CR1000X_fieldNameExtractor,
};