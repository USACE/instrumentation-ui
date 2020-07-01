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

  componentWillUnmount() {
    const { mapKey, doMapsShutdown } = this.props;
    doMapsShutdown(mapKey);
  }

  render() {
    return (
      <div
        style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0 }}
        ref={(el) => {
          this.el = el;
        }}
      />
    );
  }
}

export default connect("doMapsInitialize", "doMapsShutdown", Map);
