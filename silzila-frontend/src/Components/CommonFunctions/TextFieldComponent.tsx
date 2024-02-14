import { TextField } from "@mui/material";
import React from "react";

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
	return (
		<TextField
			style={{ width: "35%" }}
			// className="formTF"
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
		/>
	);
};

export default TextFieldComponent;
