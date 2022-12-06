import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';

const DateEditor = forwardRef(({ value }, ref) => {
  const [date, setDate] = useState(value);

  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getValue() {
      return date;
    },

    isPopup() {
      return true;
    },
  }));

  return (
    <DatePicker
      ref={containerRef}
      selected={new Date(date)}
      onChange={val => {
        const ISOdate = val.toISOString();
        setDate(ISOdate);
      }}
      dateFormat="MMMM dd, yyyy HH:mm 'GMT'XXX"
      showTimeInput
    />
  );
});

export default DateEditor;
