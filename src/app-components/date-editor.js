import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import { DateTime } from 'luxon';

export default class DateEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: DateTime.fromISO(props.value, { zone: 'utc' }),
    };
  }

  componentDidMount() {
    this.focus();
  }

  componentDidUpdate() {
    this.focus();
  }

  focus() {
    window.setTimeout(() => {
      let container = ReactDOM.findDOMNode(this.refs.container);
      if (container) {
        container.focus();
      }
    });
  }

  getValue() {
    return this.state.value;
  }

  isPopup() {
    return true;
  }

  render() {
    return (
      <DatePicker
        ref='container'
        className='form-control'
        selected={new Date(this.state.value)}
        onChange={(value) => {
          this.setState({ value });
        }}
        dateFormat='MMMM d, yyyy h:mm aa zzzz'
        showTimeInput
      />
    );
  }
}
