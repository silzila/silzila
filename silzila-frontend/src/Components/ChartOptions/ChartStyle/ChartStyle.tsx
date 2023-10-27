// This component provides following controls for style in charts
// 	- Manual/Automatic label color
// 	- Change cell font size for label
//  - Cell size
//  - Change header style

import React, { useState } from "react";
import { connect } from "react-redux";
import "./chartStyle.css";

import { SketchPicker } from "react-color";
import SliderWithInput from "../SliderWithInput";
import { Popover } from "@mui/material";
import { Dispatch } from "redux";
import {
	updateCrossTabCellLabelOptions,
	updateCrossTabHeaderLabelOptions,
	updateCrossTabStyleOptions,
} from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";

const ChartStyle = ({
	// state
	chartControls,
	tabTileProps,

	// dispatch
	updateCrossTabHeaderLabelOptions,
	updateCrossTabCellLabelOptions,
	updateCrossTabStyleOptions,
}: ChartOptionsProps & {
	updateCrossTabHeaderLabelOptions: (propKey: string, option: string, value: any) => void;
	updateCrossTabCellLabelOptions: (propKey: string, option: string, value: any) => void;
	updateCrossTabStyleOptions: (propKey: string, option: string, value: any) => void;
}) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [isColorPopoverOpen, setColorPopOverOpen] = useState<boolean>(false);
	const [optionName, setOptionName] = useState<string>("Header");
	let options: any = {};

	const labelOptionsList = [
		{ name: "Header", value: true },
		{ name: "Cell", value: false },
	];

	if (optionName === "Header") {
		options = chartControls.properties[propKey].crossTabHeaderLabelOptions;
	} else {
		options = chartControls.properties[propKey].crossTabCellLabelOptions;
	}

	const renderLabels = () => {
		return labelOptionsList.map((item, i) => {
			return (
				<button
					onClick={() => setOptionName(item.name)}
					className={item.name === optionName ? "radioButtonSelected" : "radioButton"}
					key={i}
				>
					{item.name}
				</button>
			);
		});
	};

	return (
		<div className="optionsInfo">
			<div className="optionDescription">BORDER WIDTH</div>
			<SliderWithInput
				percent={false}
				sliderValue={chartControls.properties[propKey].crossTabStyleOptions.borderWidth}
				sliderMinMax={{ min: 1, max: 15, step: 1 }}
				changeValue={value => {
					updateCrossTabStyleOptions(propKey, "borderWidth", value);
				}}
			/>

			<div className="optionDescription">LINE HEIGHT</div>
			<SliderWithInput
				percent={false}
				sliderValue={chartControls.properties[propKey].crossTabStyleOptions.lineHeight}
				sliderMinMax={{ min: 1, max: 20, step: 0.5 }}
				changeValue={value => {
					updateCrossTabStyleOptions(propKey, "lineHeight", value);
				}}
			/>

			<div className="radioButtons">{renderLabels()}</div>
			<React.Fragment>
				<div style={{ display: "flex", paddingBottom: "8px", flexDirection: "column" }}>
					<div>
						<div className="optionDescription">LABEL COLOR</div>

						<div className="optionDescription">
							<input
								type="checkbox"
								id="enableDisable"
								checked={options.labelColorManual}
								onChange={() => {
									if (optionName === "Header") {
										updateCrossTabHeaderLabelOptions(
											propKey,
											"labelColorManual",
											!options.labelColorManual
										);
									} else {
										updateCrossTabCellLabelOptions(
											propKey,
											"labelColorManual",
											!options.labelColorManual
										);
									}
								}}
							/>
							<label htmlFor="enableDisable" style={{ padding: "5px" }}>
								Manual
							</label>
							{options.labelColorManual ? (
								<div
									style={{
										height: "100%",
										width: "50%",
										backgroundColor: options.labelColor,
										color: options.labelColor,
										border: "2px solid darkgray",
										margin: "auto",
									}}
									onClick={() => {
										setColorPopOverOpen(!isColorPopoverOpen);
										//setAnchorEl(e.currentTarget);
									}}
								>
									{" c "}
								</div>
							) : null}
						</div>
					</div>
					<div className="optionDescription">FONT SIZE</div>
					<SliderWithInput
						percent={false}
						sliderValue={options.fontSize}
						sliderMinMax={{ min: 8, max: 50, step: 1 }}
						changeValue={value => {
							if (optionName === "Header") {
								updateCrossTabHeaderLabelOptions(propKey, "fontSize", value);
							} else {
								updateCrossTabCellLabelOptions(propKey, "fontSize", value);
							}
						}}
					/>

					<div className="optionDescription">FONT WEIGHT</div>
					<SliderWithInput
						percent={false}
						sliderValue={options.fontWeight}
						sliderMinMax={{ min: 400, max: 900, step: 100 }}
						changeValue={value => {
							if (optionName === "Header") {
								updateCrossTabHeaderLabelOptions(propKey, "fontWeight", value);
							} else {
								updateCrossTabCellLabelOptions(propKey, "fontWeight", value);
							}
						}}
					/>
				</div>
			</React.Fragment>
			<Popover
				open={isColorPopoverOpen}
				onClose={() => setColorPopOverOpen(false)}
				// anchorEl={anchorEl}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={options.labelColor}
						className="sketchPicker"
						width="16rem"
						// styles={{ padding: 0 }}
						onChangeComplete={color => {
							if (optionName === "Header") {
								updateCrossTabHeaderLabelOptions(propKey, "labelColor", color.hex);
							} else {
								updateCrossTabCellLabelOptions(propKey, "labelColor", color.hex);
							}
						}}
						onChange={color => {
							if (optionName === "Header") {
								updateCrossTabHeaderLabelOptions(propKey, "labelColor", color.hex);
							} else {
								updateCrossTabCellLabelOptions(propKey, "labelColor", color.hex);
							}
						}}
						disableAlpha
					/>
				</div>
			</Popover>
		</div>
	);
};
const mapStateToProps = (state: ChartOptionsStateProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateCrossTabHeaderLabelOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateCrossTabHeaderLabelOptions(propKey, option, value)),
		updateCrossTabCellLabelOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateCrossTabCellLabelOptions(propKey, option, value)),
		updateCrossTabStyleOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateCrossTabStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartStyle);
