import React from "react";

export default ({ items }) => {
  return (
    <ul>
      {items.map((item, i) => {
        return (
          <li className={`timeline-list-item ${item.status}`} key={i}>{`${
            item.text
          } ${i > 0 ? `(as of ${item.date.toLocaleDateString()})` : ""}`}</li>
        );
      })}
    </ul>
  );
};
