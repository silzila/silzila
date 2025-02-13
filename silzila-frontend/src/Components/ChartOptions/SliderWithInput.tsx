// This is a slider component, with option to input values.
// Used in many chart control options

import { Slider } from "@mui/material";
import React, { useState } from "react";
import "./SliderWithInput.css";

const SliderWithInput = ({
	sliderValue,
	sliderMinMax,
	changeValue,
	percent,
	degree,
	pointNumbers,
}: {
	sliderValue: number;
	sliderMinMax: { min: number; max: number; step: number };
	changeValue: (value: any) => void;
	percent?: boolean;
	degree?: boolean;
	pointNumbers?: boolean;
}) => {
	const [showInputText, setShowInputText] = useState<boolean>(false);
	return (
		<div className="sliderWithInput">
			{showInputText ? (
				<form
					onSubmit={(evt: any) => {
						evt.currentTarget.querySelector("input").blur();
						evt.preventDefault();
					}}
				>
					<input
						autoFocus
						className="inputValue"
						type="number"
						value={sliderValue}
						onBlur={() => setShowInputText(false)}
						onChange={e => {
							changeValue(Number(e.target.value));
						}}
					/>
				</form>
			) : (
				<span
					className="textValue"
					onClick={e => {
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
			<Slider
				sx={{
					flex: 3,
					height: "5px",
					alignSelf: "center",
					margin: "0px 4px 0px 2px",
					color: "rgb(157, 156, 156)",
					"& .MuiSlider-thumb": {
						boxShadow: "0 1px 2px 1px #9c9c9c",
						height: "13px",
						width: "13px",
					},
					"& .MuiSlider-track": {
						color: "#9c9c9c",
					},
					"& .MuiSlider-rail": {
						color: "#c6c6c6",
					},
				}}
				min={sliderMinMax.min}
				max={sliderMinMax.max}
				step={sliderMinMax.step}
				value={sliderValue}
				onChange={(e: any) => {
					changeValue(Number(e.target.value));
				}}
				// title={sliderValue}
			/>
		</div>
	);
};

export default SliderWithInput;
{
	/* <input
				// className="inputRange"
				// style={{ backgroundColor: "red", color: "red", fill: "red", background: "red" }}
				type="range"
				min={sliderMinMax.min}
				max={sliderMinMax.max}
				step={sliderMinMax.step}
				value={sliderValue}
				onInput={(e) => {
					changeValue(Number(e.target.value));
				}}
				title={sliderValue}
			/> */
}
