// TODO: Enhance or move to profile notification similar to MacOS notifications (red circle w/ number of new nnotifications)

import React, { useState } from 'react';

export default () => {
  const [isOpen, setIsOpen] = useState(true);
  const alertCount = 2;

  const closeAlert = (e) => {
    e.stopPropagation();
    e.preventDefault();

    setIsOpen(false);
  }

  return (
    isOpen && (
      <a className="alert-notification" href="/profile">
        <h5>New Alerts</h5>
        <p className="clamp-2"><i>
          {`You have ${alertCount} new alert${alertCount === 1 ? '' : 's'}! Click here to go to your profile to view your alerts.`}
        </i ></p >
        <span className="pointer close-notification" onClick={closeAlert}>
          <i className="mdi mdi-close-circle-outline"></i>
        </span>
      </a>
    )
  );
}
