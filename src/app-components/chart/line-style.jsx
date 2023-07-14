import React, { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
} from '@mui/icons-material';

export default ({ style, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState(style.line.color);
  const [width, setWidth] = useState(style.line.width);

  useEffect(() => {
    style.line.color = color;
    onChange(style);
  }, [color, onChange]);

  useEffect(() => {
    style.line.width = width;
    onChange(style);
  }, [width, onChange]);

  return (
    <div style={{ position: 'absolute', top: '-8px' }}>
      <div
        style={{ height: '15px', width: '20px' }}
        onClick={() => {
          if (width >= 1) {
            setWidth(width + 1);
          }
        }}
      >
        <span style={{ position: 'relative', top: '-3px' }}>
          <KeyboardArrowUp fontSize='medium' />
        </span>
      </div>
      <div
        style={{ height: '15px', width: '20px' }}
        onClick={() => {
          if (width > 1) {
            setWidth(width - 1);
          }
        }}
      >
        <span style={{ position: 'relative', top: '-5px' }}>
          <KeyboardArrowDown fontSize='medium' />
        </span>
      </div>
      <div
        onClick={() => {
          setShowPicker(!showPicker);
        }}
        style={{
          position: 'relative',
          top: '-28px',
          left: '20px',
          right: '0px',
          height: '25px',
          width: '24px',
          paddingRight: '3px',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            position: 'relative',
            top: '12px',
            borderBottom: `solid ${width}px ${color}`,
          }}
        ></div>
      </div>
      {showPicker ? (
        <div
          style={{
            position: 'absolute',
            zIndex: '2',
            top: '32px',
          }}
        >
          <div
            style={{
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
            }}
            onClick={() => {
              setShowPicker(false);
            }}
          />
          <SketchPicker
            color={color}
            onChange={(c) => {
              setColor(`rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
