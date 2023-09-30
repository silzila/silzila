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
}

const TextFieldComponent = ({ onChange, onFocus, onBlur, value, viewMode, lable, type}:Props) => {
	return (
		<TextField
			style={{ width: "60%" }}
			// className="formTF"
			type={type}
			label={lable}
			disabled={viewMode}
			value={value}
			required
			onChange={onChange}
			onFocus={onFocus}
			onBlur={onBlur}
		/>
	);
};

export default TextFieldComponent;
