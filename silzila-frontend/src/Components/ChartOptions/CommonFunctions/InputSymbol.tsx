import React, { useEffect, useState } from "react";

const InputSymbol = ({
	value,
	updateValue,
	disabled,
}: {
	value: any;
	updateValue: (value: any) => void;
	disabled?: boolean;
}) => {
	const [inputValue, setInputValue] = useState<any>(value);

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	const checkInput = (inputValue: any) => {
		if (value !== inputValue) {
			updateValue(inputValue);
		}
	};

	return (
		<form
			style={{ margin: "0 10px" }}
			onSubmit={(evt: any) => {
				evt.currentTarget.querySelector("input").blur();
				evt.preventDefault();
			}}
		>
			<input
				disabled={disabled}
				autoFocus
				className="inputValue"
				type="text"
				value={inputValue}
				onBlur={() => checkInput(inputValue)}
				onChange={(e: any) => {
					setInputValue(e.target.value);
				}}
			/>
		</form>
	);
};

export default InputSymbol;

