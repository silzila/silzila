// Input component used in many components in chart controls section

import React, { useState } from "react";

const InputNumber = ({
	value,
	updateValue,
	disabled,
}: {
	value: any;
	updateValue: any;
	disabled: boolean;
}) => {
	const [inputValue, setInputValue] = useState<any>(value);

	const checkInput = (inputValue: string | number) => {
		if (Number.isInteger(Number(inputValue))) {
			updateValue(Number(inputValue));
		} else {
			setInputValue(" ");
		}
	};
	return (
		<form
			style={{ margin: "0 10px" }}
			onSubmit={(evt: any) => {
				evt.currentTarget.querySelector("input").blur();
				evt.preventDefault();
				// checkInput();
			}}
		>
			<input
				disabled={disabled}
				autoFocus
				className="inputValue"
				type="text"
				value={inputValue}
				onBlur={() => checkInput(inputValue)}
				onChange={e => {
					setInputValue(e.target.value);
				}}
			/>
		</form>
	);
};

export default InputNumber;
