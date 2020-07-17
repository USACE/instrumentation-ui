exports.classnames = (opts) => {
  return Object.keys(opts)
    .map((key) => {
      return !!opts[key] ? key : "";
    })
    .join(" ");
};

exports.formatBytes = (bytes) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]})`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
};

exports.seriesStyles = {
  rainfall: {
    mode: "lines",
    line: { width: 1, color: "#0062ff" },
  },
  0: {
    mode: "lines",
    line: { width: 1, color: "#8E3B46" },
    marker: { symbol: "circle", color: "#8E3B46" },
  },
  1: {
    mode: "lines",
    line: { width: 1, color: "#E1DD8F" },
    marker: { symbol: "circle", color: "#E1DD8F" },
  },
  2: {
    mode: "lines",
    line: { width: 1, color: "#E0777D" },
    marker: { symbol: "circle", color: "#E0777D" },
  },
  3: {
    mode: "lines",
    line: { width: 1, color: "#4C86A8" },
    marker: { symbol: "circle", color: "#4C86A8" },
  },
  4: {
    mode: "lines",
    line: { width: 1, color: "#477890" },
    marker: { symbol: "circle", color: "#477890" },
  },
  5: {
    mode: "lines",
    line: { width: 1, color: "#1E212B" },
    marker: { symbol: "circle", color: "#1E212B" },
  },
  6: {
    mode: "lines",
    line: { width: 1, color: "#FF8427" },
    marker: { symbol: "circle", color: "#FF8427" },
  },
  7: {
    mode: "lines",
    line: { width: 1, color: "#395B50" },
    marker: { symbol: "circle", color: "#395B50" },
  },
  8: {
    mode: "lines",
    line: { width: 1, color: "#E4572E" },
    marker: { symbol: "circle", color: "#E4572E" },
  },
  9: {
    mode: "lines",
    line: { width: 1, color: "#29335C" },
    marker: { symbol: "circle", color: "#29335C" },
  },
  10: {
    mode: "lines",
    line: { width: 1, color: "#A8C686" },
    marker: { symbol: "circle", color: "#A8C686" },
  },
  11: {
    mode: "lines",
    line: { width: 1, color: "#669BBC" },
    marker: { symbol: "circle", color: "#669BBC" },
  },
};

const sum = (p, c) => {
  return p + c;
};

const rSquared = function (x, y) {
  const calcs = {
    x: x,
    y: y,
    xy: [],
    xsquared: [],
    ysquared: [],
  };
  for (var i = 0; i < calcs.x.length; i++) {
    calcs.xy[i] = calcs.x[i] * calcs.y[i];
    calcs.xsquared[i] = Math.pow(calcs.x[i], 2);
    calcs.ysquared[i] = Math.pow(calcs.y[i], 2);
  }
  const sumX = calcs.x.reduce(sum, 0);
  const sumY = calcs.y.reduce(sum, 0);
  const sumXY = calcs.xy.reduce(sum, 0);
  const sumXsquared = calcs.xsquared.reduce(sum, 0);
  const sumYsquared = calcs.ysquared.reduce(sum, 0);
  const N = calcs.x.length;

  const numerator = N * sumXY - sumX * sumY;
  const denomenator =
    Math.sqrt(N * sumXsquared - Math.pow(sumX, 2)) *
    Math.sqrt(N * sumYsquared - Math.pow(sumY, 2));

  const r = numerator / denomenator;

  return Math.pow(r, 2);
};

exports.trendline = function (x, y) {
  let sumX = 0,
    sumY = 0,
    sumXsquared = 0,
    sumYsquared = 0,
    sumXY = 0;
  let minX = Infinity,
    minY = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity;
  if (x.length !== y.length) return undefined;
  const N = x.length;

  for (var i = 0; i < x.length; i++) {
    sumX = sumX + x[i];
    sumY = sumY + y[i];
    sumXsquared = sumXsquared + x[i] * x[i];
    sumYsquared = sumYsquared + y[i] * y[i];
    sumXY = sumXY + x[i] * y[i];
    if (x[i] < minX) minX = x[i];
    if (x[i] > maxX) maxX = x[i];
    if (y[i] < minY) minY = y[i];
    if (y[i] > maxY) maxY = y[i];
  }

  const m = (N * sumXY - sumX * sumY) / (N * sumXsquared - sumX * sumX);
  const b = (sumY - m * sumX) / N;

  // if we use xmin and xmax and calculate our Y values
  const x1 = minX;
  const y1 = m * x1 + b;
  const x2 = maxX;
  const y2 = m * x2 + b;
  const rsquared = rSquared(x, y);

  return {
    name: "Trendline",
    x: [x1, x2],
    y: [y1, y2],
    rSquared: rsquared,
    annotations: [
      {
        x: x2,
        y: y2,
        xref: "x",
        yref: "y",
        text: `y = ${Math.round(m * 1000) / 1000}x + ${
          Math.round(b * 1000) / 1000
        }<br>r² = ${Math.round(rsquared * 10000) / 10000}`,
        showarrow: true,
        font: {
          family: "Courier New, monospace",
          size: 12,
        },
        align: "center",
        arrowhead: 2,
        arrowsize: 1,
        arrowwidth: 2,
        arrowcolor: "#636363",
        ax: 20,
        ay: -30,
      },
    ],
  };
};
