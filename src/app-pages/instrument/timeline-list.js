import React from 'react';

const TimelineList = ({ items }) => {
  return (
    <ul style={{ paddingLeft: '5px' }}>
      {items.map((item, i) => {
        return (
          <li className={`timeline-list-item ${item.status}`} key={i}>{`${
            item.text
          } ${i > 0 ? `(as of ${item.date.toLocaleDateString()})` : ''}`}</li>
        );
      })}
    </ul>
  );
};

export default TimelineList;
