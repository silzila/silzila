// import React, { useEffect, useState } from "react";

// const InputPositiveNumber = ({
// 	value,
// 	updateValue,
// 	disabled,
// }: {
// 	value: any;
// 	updateValue: any;
// 	disabled?: boolean;
// }) => {
// 	const [inputValue, setInputValue] = useState<any>(value);

// 	useEffect(() => {
// 		checkInput();
// 	}, [inputValue]);

// 	const checkInput = () => {
// 		if (Number.isInteger(Number(inputValue))) {
// 			//for preventing unnecessary dispatch
// 			if (Number(value) !== Number(inputValue)) {
// 				updateValue(Number(inputValue));
// 			}
// 		} else {
// 			setInputValue("");
// 		}
// 	};
// 	return (
// 		<form
// 			style={{ margin: "0 10px" }}
// 			onSubmit={(evt: any) => {
// 				evt.currentTarget.querySelector("input").blur();
// 				evt.preventDefault();
// 			}}
// 		>
// 			<input
// 				disabled={disabled}
// 				className="inputValue"
// 				type="number"
// 				value={inputValue}
// 				onBlur={() => checkInput()}
// 				onChange={e => {
// 					if (Number(e.target.value) >= 0) setInputValue(e.target.value);
// 					else setInputValue(0);
// 				}}
// 			/>
// 		</form>
// 	);
// };

// export default InputPositiveNumber;

import React, { useEffect, useState } from "react";

const InputPositiveNumber = ({
  value,
  updateValue,
  disabled,
}: {
  value: number;
  updateValue: (value: number) => void;
  disabled?: boolean;
}) => {

  const [inputValue, setInputValue] = useState<string>(value.toString());

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numericValue = Number(newValue);
    if (!isNaN(numericValue) && numericValue >= 0) {
      updateValue(numericValue);
    }
  };

  return (
    <form
      style={{ margin: "0 10px" }}
      onSubmit={(evt: React.FormEvent) => {
        evt.preventDefault();
        (evt.currentTarget.querySelector("input") as HTMLInputElement)?.blur();
      }}
    >
      <input
        disabled={disabled}
        className="inputValue"
        style={{ paddingRight: '15px' }}
        type="number"
        value={inputValue}
        onChange={handleChange}
        min="0"
      />
    </form>
  );
};

export default InputPositiveNumber;