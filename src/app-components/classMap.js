import React from "react";
import { connect } from "redux-bundler-react";
import { fromLonLat } from "ol/proj";

class Map extends React.Component {
  componentDidMount() {
    const { mapKey, options, doMapsInitialize } = this.props;
    // assume our options.center values are lon lat
    if (options && options.center) options.center = fromLonLat(options.center);
    doMapsInitialize(mapKey, this.el, options);
  }

  render() {
    const { height } = this.props;
    return (
      <div
        style={{ height: height }}
        ref={(el) => {
          this.el = el;
        }}
      />
    );
  }
}

export default connect("doMapsInitialize", Map);
