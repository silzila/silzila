// This component provides following controls for label in charts
// 	- Show/hide label
// 	- Manual/Automatic label color
// 	- Change font size for label

import React, { useState } from "react";
import { connect } from "react-redux";
import "./chartLabels.css";
import "../ChartOptions.css";
import { ColorResult, SketchPicker } from "react-color";
import SliderWithInput from "../SliderWithInput";
import { FormControl, MenuItem, Popover, Select } from "@mui/material";
import TreeMapLabelOptions from "./TreeMapLabelOptions";
import SnakeyLabelOptions from "./SnakeyLabelOptions";
import SwitchWithInput from "../SwitchWithInput";
import { Dispatch } from "redux";
import {
	updateLabelOption,
	updateLabelPadding,
	updateLabelPosition,
} from "../../../redux/ChartPoperties/ChartControlsActions";
import {
	ChartConLabelOptions,
	ChartControl,
	ChartControlStateProps,
} from "../../../redux/ChartPoperties/ChartControlsInterface";
import {
	TabTileStateProps,
	TabTileStateProps2,
} from "../../../redux/TabTile/TabTilePropsInterfaces";
import {
	ChartPropertiesStateProps,
	ChartPropProperties,
} from "../../../redux/ChartPoperties/ChartPropertiesInterfaces";

interface OptionsInterface {
	name: string;
	value: string | boolean;
}

interface ChartLabelsProps {
	chartControl: ChartControl;
	tabTileProps: TabTileStateProps;
	chartProp: ChartPropProperties;

	updateLabelOption: (propKey: number | string, option: string, value: any) => void;
	updateLabelPosition: (propKey: number | string, value: any) => void;
	updateLabelPadding: (propKey: number | string, value: any) => void;
}

const ChartLabels = ({
	// state
	chartControl,
	tabTileProps,
	chartProp,

	// dispatch
	updateLabelOption,
	updateLabelPosition,
	updateLabelPadding,
}: ChartLabelsProps) => {
	var propKey: number = parseFloat(
		`${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`
	);

	console.log(chartControl.properties[propKey].labelOptions.fontSize);

	const [isColorPopoverOpen, setColorPopOverOpen] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<string | any>("");

	const showLabel: boolean = chartControl.properties[propKey].labelOptions.showLabel;
	var labelOptions: ChartConLabelOptions = chartControl.properties[propKey].labelOptions;

	console.log(labelOptions);

	const labelPositionOptions: OptionsInterface[] = [
		{ name: "Outside", value: "outside" },
		{ name: "Inside", value: "inside" },
	];

	const labelOptionsList: OptionsInterface[] = [
		{ name: "Show", value: true },
		{ name: "Hide", value: false },
	];
	const renderLabels = () => {
		return labelOptionsList.map((item: OptionsInterface, i: number) => {
			return (
				<button
					onClick={() => updateLabelOption(propKey, "showLabel", item.value)}
					className={item.value === showLabel ? "radioButtonSelected" : "radioButton"}
					key={i}
				>
					{item.name}
				</button>
			);
		});
	};

	return (
		<div className="optionsInfo">
			<div className="radioButtons">{renderLabels()}</div>
			{showLabel === true ? (
				<React.Fragment>
					<div style={{ display: "flex", paddingBottom: "8px", flexDirection: "column" }}>
						{chartProp[propKey].chartType === "pie" ||
						chartProp[propKey].chartType === "donut" ? (
							<React.Fragment>
								<div className="optionDescription">Label Position</div>
								<FormControl
									fullWidth
									size="small"
									style={{ fontSize: "12px", borderRadius: "4px" }}
								>
									<Select
										value={labelOptions.pieLabel.labelPosition}
										variant="outlined"
										onChange={e => {
											console.log(e.target.value);
											updateLabelPosition(propKey, e.target.value);
										}}
										sx={{
											fontSize: "12px",
											width: "90%",
											margin: "0 auto 0.5rem auto",
											backgroundColor: "white",
											height: "1.5rem",
											color: "#404040",
										}}
									>
										{labelPositionOptions.map((position: OptionsInterface) => {
											return (
												<MenuItem
													// value={position.value}
													key={position.name}
													sx={{
														padding: "2px 10px",
														fontSize: "12px",
													}}
												>
													{position.name}
												</MenuItem>
											);
										})}
									</Select>
								</FormControl>
								{labelOptions.pieLabel.labelPosition === "outside" ? (
									<>
										<div className="optionDescription">Label Padding</div>
										<SliderWithInput
											percent={false}
											sliderValue={labelOptions.pieLabel.labelPadding}
											sliderMinMax={{ min: 0, max: 40, step: 1 }}
											changeValue={(value: number) => {
												updateLabelPadding(propKey, value);
											}}
										/>
									</>
								) : null}
							</React.Fragment>
						) : null}

						<div>
							<div className="optionDescription">Label Size</div>
							<SliderWithInput
								percent={false}
								sliderValue={chartControl.properties[propKey].labelOptions.fontSize}
								sliderMinMax={{ min: 8, max: 50, step: 1 }}
								changeValue={(value: number) => {
									console.log(value);
									updateLabelOption(propKey, "fontSize", value);
								}}
							/>
							<div className="optionDescription">Label Color</div>

							<div className="optionDescription">
								<label
									htmlFor="enableDisable"
									className="enableDisableLabel"
									style={{ marginRight: "10px" }}
								>
									Manual
								</label>
								<SwitchWithInput
									isChecked={
										chartControl.properties[propKey].labelOptions
											.labelColorManual
									}
									onSwitch={() => {
										updateLabelOption(
											propKey,
											"labelColorManual",
											!chartControl.properties[propKey].labelOptions
												.labelColorManual
										);
									}}
								/>

								{chartControl.properties[propKey].labelOptions.labelColorManual ? (
									<div
										style={{
											height: "1.25rem",
											width: "50%",
											marginLeft: "20px",
											backgroundColor:
												chartControl.properties[propKey].labelOptions
													.labelColor,
											color: chartControl.properties[propKey].labelOptions
												.labelColor,
											border: "2px solid darkgray",
											margin: "auto",
										}}
										onClick={e => {
											setColorPopOverOpen(!isColorPopoverOpen);
											setAnchorEl(e.currentTarget);
										}}
									>
										{"  "}
									</div>
								) : null}
							</div>
							{chartProp[propKey].chartType === "treeMap" ? (
								<>
									<div
										style={{
											borderTop: "1px solid rgb(211,211,211)",
											margin: "0.5rem 6% 1rem",
										}}
									></div>
									<TreeMapLabelOptions />
								</>
							) : null}
							{chartProp[propKey].chartType === "sankey" ? (
								<>
									<div
										style={{
											borderTop: "1px solid rgb(211,211,211)",
											margin: "0.5rem 6% 1rem",
										}}
									></div>
									<SnakeyLabelOptions />
								</>
							) : null}
						</div>
					</div>
				</React.Fragment>
			) : null}
			<Popover
				open={isColorPopoverOpen}
				onClose={() => setColorPopOverOpen(false)}
				onClick={() => setColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={chartControl.properties[propKey].labelOptions.labelColor}
						className="sketchPicker"
						width="16rem"
						onChangeComplete={(color: ColorResult) => {
							updateLabelOption(propKey, "labelColor", color.hex);
						}}
						onChange={(color: ColorResult) => {
							updateLabelOption(propKey, "labelColor", color.hex);
						}}
						disableAlpha
					/>
				</div>
			</Popover>
		</div>
	);
};
const mapStateToProps = (
	state: ChartControlStateProps & TabTileStateProps2 & ChartPropertiesStateProps
) => {
	return {
		chartControl: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProp: state.chartProperties.properties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateLabelOption: (propKey: number | string, option: string, value: any) =>
			dispatch(updateLabelOption(propKey, option, value)),

		updateLabelPosition: (propKey: number | string, value: any) =>
			dispatch(updateLabelPosition(propKey, value)),
		updateLabelPadding: (propKey: number | string, value: any) =>
			dispatch(updateLabelPadding(propKey, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartLabels);
