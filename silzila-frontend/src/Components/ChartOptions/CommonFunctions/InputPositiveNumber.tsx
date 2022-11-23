import React, { useEffect, useState } from "react";

const InputPositiveNumber = ({
	value,
	updateValue,
	disabled,
}: {
	value: any;
	updateValue: any;
	disabled?: boolean;
}) => {
	const [inputValue, setInputValue] = useState<any>(value);

	useEffect(() => {
		checkInput();
	}, [inputValue]);

	const checkInput = () => {
		if (Number.isInteger(Number(inputValue))) {
			//for preventing unnecessary dispatch
			if (Number(value) !== Number(inputValue)) {
				updateValue(Number(inputValue));
			}
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
				onBlur={() => checkInput()}
				onChange={e => {
					if (Number(e.target.value) >= 0) setInputValue(e.target.value);
					else setInputValue(0);
				}}
			/>
		</form>
	);
};

export default InputPositiveNumber;
