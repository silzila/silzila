import React, { useState } from 'react';
import { Button, SvgIconProps, Tooltip } from '@mui/material';

interface ToggleButtonProps {
  button1Label: React.ReactElement<SvgIconProps>;
  button1LabelTxt:string;
  button2Label: React.ReactElement<SvgIconProps>; 
  button2labelTxt:string;
  onSelect: (selectedButton: string) => void;
  selectedLabel:string,
  tooltip1?:string;
  tooltip2?:string;
  disableBtn1?:boolean;
  disableBtn2?:boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ button1Label, button2Label, onSelect ,button1LabelTxt,button2labelTxt,selectedLabel,tooltip1,tooltip2,disableBtn1,disableBtn2}) => {
  const handleSelect = (button:string) => {
    onSelect(button);
  };

  return (
    <div style={{ display: 'flex', width: '50%' }}>
     <Tooltip title={selectedLabel === button1LabelTxt ?"":`${tooltip1?tooltip1:""}`}>     
      <Button
      disabled={disableBtn1}
      size='small'
        onClick={() => handleSelect(button1LabelTxt)}
        sx={{
          backgroundColor: selectedLabel === button1LabelTxt ? 'rgb(224, 224, 224)' : 'white',
          color:'black',
          borderRadius: '5px',
          border: '1px solid lightgray',
          borderRight:"none",
          borderTopRightRadius:0,
          borderBottomRightRadius:0,
          cursor: selectedLabel === button1LabelTxt ?'default':'pointer',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          '&:hover':{
            backgroundColor:selectedLabel === button1LabelTxt ? 'rgb(224, 224, 224)' : 'white',
          }
        }}
      >
        {button1Label}
      </Button>
     </Tooltip>

      <Tooltip title={selectedLabel === button2labelTxt ?"":`${tooltip2?tooltip2:""}`}>
      <Button
      disabled={disableBtn2}
      size='small'
        onClick={() => handleSelect(button2labelTxt)}
        sx={{
          backgroundColor: selectedLabel === button2labelTxt ? 'rgb(224, 224, 224)' : 'white',
          color: 'black',
          borderRadius: '5px',
          border: '1px solid lightgray',
          borderLeft:"none",
          borderTopLeftRadius:0,
          borderBottomLeftRadius:0,
          cursor: selectedLabel === button2labelTxt ? 'default':'pointer',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&:hover':{
            backgroundColor:selectedLabel === button2labelTxt ? 'rgb(224, 224, 224)' : 'white',
          }
        }}
      >
        {button2Label}
      </Button>
      </Tooltip>
    </div>
  );
};

export default ToggleButton;
