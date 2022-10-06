import { TextField } from "@mui/material";
import React from "react";

const TextFieldComponent = ({ onChange, onFocus, onBlur, value, viewMode, lable, type }) => {
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
