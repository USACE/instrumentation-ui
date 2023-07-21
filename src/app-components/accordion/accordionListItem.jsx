import React, { useState } from 'react';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';

import { classArray } from '../../common/helpers/utils';

import './accordion.scss';

const AccordionListItem = ({
  isDefaultOpen = false,
  onToggle = () => {},
  headingText = '',
  children = null,
  className = '',
  contentClassname = ''
}) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  const itemClasses = classArray([
    'accordion-item',
    className,
  ]);

  const contentClasses = classArray([
    'accordion-collapse',
    'collapse',
    isOpen && 'show',
    contentClassname,
  ]);

  const headingClasses = classArray([
    'accordion-heading',
    isOpen && 'is-open',
  ]);

  const toggleAccordion = () => {
    onToggle(!isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <div className={itemClasses}>
      <div className={headingClasses} onClick={() => toggleAccordion()}>
        <p className='text-primary'>{headingText}</p>
        {isOpen
          ? <KeyboardArrowUp className='m-3 accordion-icon' fontSize='small' />
          : <KeyboardArrowDown className='m-3 accordion-icon' fontSize='small' />
        }
      </div>
      <div className={contentClasses}>
        <div className='accordion-body'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AccordionListItem;
