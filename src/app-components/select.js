import React, { useEffect, useState } from 'react';
import usePrevious from '../customHooks/usePrevious';

const Option = ({ value, text = '' }) => (
  <option value={value}>{text || value}</option>
);

/**
 * A component that wraps the default html `<select>` elements. Creates `<option>`(s) based on the array of options provided and handles state internally. Provides
 * callback for consumers to track the selected option if needed (not required to use the component).
 * 
 * @param {string} title The title of the select element, read by screen readers and provides text on hover.
 * @param {function} onChange A function that is executed when the value of the select changes, `option.value` is provided as a parameter.
 * @param {boolean} showPlaceholderOption Whether or not the placeholder option is shown. Defaulted to `true`.
 * @param {boolean} showPlaceholderWhileValid Whether or not the placeholder option is shown if a value is selected. Defaulted to `false`.
 * @param {string} defaultOption Set to specify an option that should be selected by default, use the `option.value` property.
 * @param {string} placeholderText Provide custom text to display in the placeholder option.
 * @param {string} className Classes to provide to the `<select>` element.
 * @param {array} options A list of options `{ value: string, text: string }` or `{ value: string }` provided within the select element.
 * @param {string} value The value the `<select>` should set. Should only be set if you have a use case to override the internal state. Not needed for the component to function.
 */
const Select = ({
  title = '',
  onChange = () => {},
  showPlaceholderOption = true,
  showPlaceholderWhileValid = false,
  defaultOption = '',
  value = '',
  placeholderText = 'Select an option...',
  className = '',
  options = [],
}) => {
  const [currentOption, setCurrentOption] = useState(defaultOption);
  const previousOption = usePrevious(currentOption);
  const previousValue = usePrevious(value);

  const placeholderOption = <Option value='' text={placeholderText} />;
  const showPlaceholder = showPlaceholderOption && (showPlaceholderWhileValid || !currentOption);

  const handleChange = e => setCurrentOption(e.target.value);

  /** Allow user to manually override internal currentOption state if value changes but internal state does not. */
  useEffect(() => {
    if (value !== previousValue && currentOption === previousOption) {
      setCurrentOption(value);
    }
  }, [value, previousValue, currentOption, previousOption, setCurrentOption]);

  /** Execute parent's onChange function after our interal state has changed. */
  useEffect(() => {
    onChange(currentOption);
  }, [currentOption, onChange])

  return (
    <select
      className={`custom-select ${className}`}
      onChange={(e) => handleChange(e)}
      title={title}
      value={currentOption}
    >
      {showPlaceholder && placeholderOption}
      {options.map(option => <Option value={option.value} text={option.text} key={option.value} />)}
    </select>
  );
};

export default Select;
