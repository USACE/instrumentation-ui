import React, { forwardRef, useImperativeHandle, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { DateTime } from 'luxon';

const DateEditor = forwardRef(({ value }, ref) => {
  const [date, setDate] = useState(DateTime.fromISO(value, { zone: 'utc' }));
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
      onChange={val => setDate(val)}
      dateFormat="MMMM dd, yyyy hh:mm 'GMT'XXX"
      showTimeInput
    />
  );
});

export default DateEditor;

// export default class DateEditor extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       value: DateTime.fromISO(props.value, { zone: 'utc' }),
//     };
//   }

//   componentDidMount() {
//     this.focus();
//   }

//   componentDidUpdate() {
//     this.focus();
//   }

//   focus() {
//     window.setTimeout(() => {
//       let container = ReactDOM.findDOMNode(this.refs.container);
//       if (container) {
//         container.focus();
//       }
//     });
//   }

//   getValue() {
//     return this.state.value;
//   }

//   isPopup() {
//     return true;
//   }

//   render() {
//     return (
//       <DatePicker
//         ref={containerRef}
//         selected={new Date(this.state.value)}
//         onChange={value => this.setState({ value })}
//         dateFormat='MMMM d, yyyy h:mm aa zzzz'
//         showTimeInput
//       />
//     );
//   }
// }
