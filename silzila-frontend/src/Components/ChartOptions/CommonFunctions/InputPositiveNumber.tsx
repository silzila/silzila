import React, { useEffect, useState } from "react";

interface InputPositiveNumberProps {
	value: number;
	updateValue: (value: number) => void;
	disabled?: any;
}

const InputPositiveNumber = ({ value, updateValue, disabled }: InputPositiveNumberProps) => {
	const [inputValue, setInputValue] = useState<number | string>(value);

	useEffect(() => {
		checkInput();
	}, [inputValue]);

	const checkInput = () => {
		if (Number.isInteger(Number(inputValue))) {
			updateValue(Number(inputValue));
		} else {
			setInputValue("");
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
				className="inputValue"
				type="number"
				value={inputValue}
				onBlur={checkInput}
				onChange={e => {
					if (Number(e.target.value) >= 0) setInputValue(e.target.value);
					else setInputValue(0);
				}}
			/>
		</form>
	);
};

export default InputPositiveNumber;
