import { TextField,InputLabel,IconButton, InputAdornment } from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useRef } from "react";

type Props={
onChange:(e: React.ChangeEvent<HTMLInputElement>)=>void, 
onFocus:() => void, 
onBlur:any, 
value:string | number, 
viewMode:any, 
lable:string, 
type?:string,
multiline?:boolean,
rows?:number,
placeholder?:string,
}

const TextFieldComponent = ({ onChange, onFocus, onBlur, value, viewMode, lable, type, multiline, rows, placeholder}:Props) => {
 
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleIconClick = () => {
	  fileInputRef.current?.click();
	};

	return (
	<div style={{ width: "60%" }}>     
      {type === "file" ? (
		<>
        <TextField
		  style={{ width: "60%" }}
          type="text"
          label={lable}
          disabled={viewMode}
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <input
				  ref={fileInputRef}
                  type="file"
                  style={{ display: 'none'}}
                  onChange={onChange}
                  disabled={viewMode}
                />
                <IconButton component="span" onClick={handleIconClick}>
                  <AttachFileIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
		  
        />
		</>
      ) : (
        <TextField
          type={type}
          label={lable}
          disabled={viewMode}
          value={value}
          rows={rows}
          placeholder={placeholder}
          multiline={multiline}
          required
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{ width: "60%" }}
        
        />
      )}
    </div>
  );
};

export default TextFieldComponent;