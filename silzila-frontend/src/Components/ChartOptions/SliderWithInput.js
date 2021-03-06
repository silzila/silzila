// This is a slider component, with option to input values.
// Used in many chart control options

import React, { useState } from "react";
import "./SliderWithInput.css";

const SliderWithInput = ({
	sliderValue,
	sliderMinMax,
	changeValue,
	percent,
	degree,
	pointNumbers,
}) => {
	// console.log( sliderMinMax);
	const [showInputText, setShowInputText] = useState(false);
	return (
		<div className="sliderWithInput">
			{showInputText ? (
				<form
					onSubmit={(evt) => {
						evt.currentTarget.querySelector("input").blur();
						evt.preventDefault();
					}}
				>
					<input
						autoFocus
						className="inputValue"
						type="text"
						value={sliderValue}
						onBlur={() => setShowInputText(false)}
						onChange={(e) => {
							changeValue(Number(e.target.value));
						}}
					/>
				</form>
			) : (
				<span
					className="textValue"
					onClick={(e) => {
						// console.log(e.target);
						setShowInputText(true);
					}}
					title="Click to edit value"
				>
					{percent ? (
						`${sliderValue} %`
					) : degree ? (
						<span>{sliderValue} &#176;</span>
					) : pointNumbers ? (
						<span>{sliderValue}</span>
					) : (
						`${sliderValue} px`
					)}
				</span>
			)}
			<input
				className="inputRange"
				type="range"
				min={sliderMinMax.min}
				max={sliderMinMax.max}
				step={sliderMinMax.step}
				value={sliderValue}
				onInput={(e) => {
					changeValue(Number(e.target.value));
				}}
				title={sliderValue}
			/>
		</div>
	);
};

export default SliderWithInput;
