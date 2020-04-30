/**
 * Where fieldMap:
 * {
 *  <dbField>: <jsonField>
 *  ...
 * }
 */
const parseStupidCoords = (stupid) => {
  const splitted = stupid.split(" ");
  let dd = 0;
  if (splitted[1]) dd = dd + Number(splitted[1]);
  if (splitted[2]) dd = dd + Number(splitted[2]) / 60;
  if (splitted[3]) dd = dd + Number(splitted[3]) / 60 / 60;
  if (splitted[0].toUpperCase() === "W" || splitted[0].toUpperCase() === "S")
    dd = dd * -1;
  return dd;
};

const model = {
  name: {
    label: "Name",
    type: "string",
    template: "",
  },
  type_id: {
    label: "Type",
    type: "domain",
    domainGroup: "instrument_type",
    template: "",
    helpText:
      'Acceptable data values include "Piezometer" or "Staff Gage" others will be ignored',
  },
  lon: {
    label: "Lon.",
    type: "coord",
    template: "",
  },
  lat: {
    label: "Lat.",
    type: "coord",
    template: "",
  },
  height: {
    label: "Height",
    type: "number",
    template: "",
  },
};

const parser = (json, fieldMap, ignoreRows, domains) => {
  return new Promise((resolve, reject) => {
    try {
      const fields = Object.keys(fieldMap);
      const out = json
        .map((rec, i) => {
          if (ignoreRows.indexOf(i + 1) !== -1) return null;
          const outRec = {
            geometry: { type: "Point", coordinates: [] },
          };
          fields.forEach((field) => {
            if (model[field] && model[field].type) {
              switch (model[field].type) {
                case "number":
                  outRec[field] = Number(rec[fieldMap[field]]);
                  break;
                case "coord":
                  if (isNaN(Number(rec[fieldMap[field]]))) {
                    outRec[field] = parseStupidCoords(rec[fieldMap[field]]);
                  } else {
                    outRec[field] = Number(rec[fieldMap[field]]);
                  }
                  break;
                case "domain":
                  const domainGroup = domains[model[field].domainGroup];
                  const val = rec[fieldMap[field]];
                  if (val) {
                    const filtered = domainGroup.filter((d) => {
                      return d.value.toUpperCase() === val.toUpperCase();
                    });
                    if (filtered.length) {
                      const found = filtered[0];
                      outRec[field] = found.id;
                    } else {
                      outRec[field] = null;
                    }
                  } else {
                    outRec[field] = null;
                  }
                  break;
                default:
                  outRec[field] = rec[fieldMap[field]].toString();
              }
            } else {
              outRec[field] = rec[fieldMap[field]];
            }
            if (field === "lon" && !isNaN(outRec["lon"])) {
              outRec.geometry.coordinates[0] = outRec["lon"];
              delete outRec["lon"];
            }
            if (field === "lat" && !isNaN(outRec["lat"])) {
              outRec.geometry.coordinates[1] = outRec["lat"];
              delete outRec["lat"];
            }
          });
          return outRec;
        })
        .filter((row) => !!row);
      resolve(out);
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  name: "Instruments",
  parser: parser,
  model: model,
};
