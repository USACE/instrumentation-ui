import React, { useState } from 'react';
// import { connect } from 'redux-bundler-react';

export default () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    isOpen && (
      <div className="alert-notification pointer" onClick={() => alert("go to profile page")}>
        <h5>New Alerts</h5>
        <p className="clamp-2"><i>
          You have (x) new alerts! Click here to go to your profile to view your alerts.
        </i ></p >
        <span className="pointer close-notification" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
          <i className="mdi mdi-close-circle-outline"></i>
        </span>
      </div >
    )
  );
}
