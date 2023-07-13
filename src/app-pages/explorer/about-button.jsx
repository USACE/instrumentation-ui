import React, { useState } from 'react';
import { HighlightAlt, InfoOutlined } from '@mui/icons-material';

import Button from '../../app-components/button';
import Card from '../../app-components/card';

const AboutButton = () => {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button
        variant='info'
        className={show ? 'active' : ''}
        handleClick={() => setShow(!show)}
        icon={<InfoOutlined fontSize='small' />}
        title='About this tool'
      />
      {show ? (
        <Card className='w-75'>
          <Card.Body>
            <p className='mb-2'>
              Select Instruments on the map to include their data in the
              charting tools at the right.
            </p>
            <p className='mb-2'>
              Individual instruments may be selected by clicking on them. You
              may select multiple by holding down the shift key and clicking
              multiple instruments.
            </p>
            <p className='mb-2'>
              Clicking on the instrument group polygons will select all
              instruments in that group, hold shift while selecting groups to
              add instruments from multiple groups to the active selection.
            </p>
            <p className='mb-2'>
              Use the select by box tool <HighlightAlt fontSize='inherit' /> to
              select instruments by drawing a box on the map. Note: The
              normal pan/zoom interactions are disabled while in select-by-box
              mode.
            </p>
            <p className='mb-2'>
              Press <b>Shift</b>+<b>V</b> to toggle between landscape and portrait mode.
            </p>
          </Card.Body>
        </Card>
      ) : null}
    </>
  );
};

export default AboutButton;
