import React from "react";

export default ({ children }) => {
  return (
    <div style={{ position: "absolute", top: 0, right: 0, left: 0, bottom: 0 }}>
      {children}
    </div>
  );
};
