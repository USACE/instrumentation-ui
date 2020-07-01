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
    line: { width: "1px", color: "#0062ff" },
  },
  0: {
    mode: "lines",
    line: { width: "1px", color: "#8E3B46" },
    marker: { symbol: "circle", color: "#8E3B46" },
  },
  1: {
    mode: "lines",
    line: { width: "1px", color: "#E1DD8F" },
    marker: { symbol: "circle", color: "#E1DD8F" },
  },
  2: {
    mode: "lines",
    line: { width: "1px", color: "#E0777D" },
    marker: { symbol: "circle", color: "#E0777D" },
  },
  3: {
    mode: "lines",
    line: { width: "1px", color: "#4C86A8" },
    marker: { symbol: "circle", color: "#4C86A8" },
  },
  4: {
    mode: "lines",
    line: { width: "1px", color: "#477890" },
    marker: { symbol: "circle", color: "#477890" },
  },
  5: {
    mode: "lines",
    line: { width: "1px", color: "#1E212B" },
    marker: { symbol: "circle", color: "#1E212B" },
  },
  6: {
    mode: "lines",
    line: { width: "1px", color: "#FF8427" },
    marker: { symbol: "circle", color: "#FF8427" },
  },
  7: {
    mode: "lines",
    line: { width: "1px", color: "#395B50" },
    marker: { symbol: "circle", color: "#395B50" },
  },
  8: {
    mode: "lines",
    line: { width: "1px", color: "#E4572E" },
    marker: { symbol: "circle", color: "#E4572E" },
  },
  9: {
    mode: "lines",
    line: { width: "1px", color: "#29335C" },
    marker: { symbol: "circle", color: "#29335C" },
  },
  10: {
    mode: "lines",
    line: { width: "1px", color: "#A8C686" },
    marker: { symbol: "circle", color: "#A8C686" },
  },
  11: {
    mode: "lines",
    line: { width: "1px", color: "#669BBC" },
    marker: { symbol: "circle", color: "#669BBC" },
  },
};
