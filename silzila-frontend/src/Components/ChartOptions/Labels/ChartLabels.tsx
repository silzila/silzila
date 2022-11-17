// // This component provides following controls for label in charts
// // 	- Show/hide label
// // 	- Manual/Automatic label color
// // 	- Change font size for label

// import React, { useState } from "react";
// import { connect } from "react-redux";
// import "./chartLabels.css";
// import {
// 	updateLabelOption,
// 	updateLabelPadding,
// 	updateLabelPosition,
// 	updateTreeMapStyleOptions,
// } from "../../../redux/ChartProperties/actionsChartControls";
// import { SketchPicker } from "react-color";
// import SliderWithInput from "../SliderWithInput";
// import { FormControl, MenuItem, Popover, Select, Switch } from "@mui/material";
// import TreeMapLabelOptions from "./TreeMapLabelOptions";
// import SnakeyLabelOptions from "./SnakeyLabelOptions";
// import SwitchWithInput from "../SwitchWithInput";

// const ChartLabels = ({
// 	// state
// 	chartProp,
// 	tabTileProps,
// 	chartDetail,

// 	// dispatch
// 	updateLabelOption,
// 	updateLabelPosition,
// 	updateLabelPadding,
// 	updateTreeMapStyleOptions,
// }) => {
// 	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

// 	const [isColorPopoverOpen, setColorPopOverOpen] = useState(false);
// 	const [anchorEl, setAnchorEl] = useState("");

// 	const showLabel = chartProp.properties[propKey].labelOptions.showLabel;
// 	var labelOptions = chartProp.properties[propKey].labelOptions;

// 	const labelPositionOptions = [
// 		{ name: "Outside", value: "outside" },
// 		{ name: "Inside", value: "inside" },
// 		// { name: "Center", value: "center" },
// 	];

// 	const labelOptionsList = [
// 		{ name: "Show", value: true },
// 		{ name: "Hide", value: false },
// 	];
// 	const renderLabels = () => {
// 		return labelOptionsList.map((item, i) => {
// 			return (
// 				<button
// 					value={item.value}
// 					onClick={e => updateLabelOption(propKey, "showLabel", item.value)}
// 					className={item.value === showLabel ? "radioButtonSelected" : "radioButton"}
// 					key={i}
// 				>
// 					{item.name}
// 				</button>
// 			);
// 		});
// 	};

// 	return (
// 		<div className="optionsInfo">
// 			<div className="radioButtons">{renderLabels()}</div>
// 			{showLabel === true ? (
// 				<React.Fragment>
// 					<div style={{ display: "flex", paddingBottom: "8px", flexDirection: "column" }}>
// 						{chartDetail[propKey].chartType === "pie" ||
// 						chartDetail[propKey].chartType === "donut" ? (
// 							<React.Fragment>
// 								<div className="optionDescription">Label Position</div>
// 								<FormControl
// 									fullWidth
// 									size="small"
// 									style={{ fontSize: "12px", borderRadius: "4px" }}
// 								>
// 									<Select
// 										value={labelOptions.pieLabel.labelPosition}
// 										variant="outlined"
// 										onChange={e => {
// 											updateLabelPosition(propKey, e.target.value);
// 										}}
// 										sx={{
// 											fontSize: "12px",
// 											width: "90%",
// 											margin: "0 auto 0.5rem auto",
// 											backgroundColor: "white",
// 											height: "1.5rem",
// 											color: "#404040",
// 										}}
// 									>
// 										{labelPositionOptions.map(position => {
// 											return (
// 												<MenuItem
// 													value={position.value}
// 													key={position.name}
// 													sx={{
// 														padding: "2px 10px",
// 														fontSize: "12px",
// 													}}
// 												>
// 													{position.name}
// 												</MenuItem>
// 											);
// 										})}
// 									</Select>
// 								</FormControl>
// 								{labelOptions.pieLabel.labelPosition === "outside" ? (
// 									<>
// 										<div className="optionDescription">Label Padding</div>
// 										<SliderWithInput
// 											percent={false}
// 											sliderValue={labelOptions.pieLabel.labelPadding}
// 											sliderMinMax={{ min: 0, max: 40, step: 1 }}
// 											changeValue={value => {
// 												updateLabelPadding(propKey, value);
// 											}}
// 										/>
// 									</>
// 								) : null}
// 							</React.Fragment>
// 						) : null}

// 						<div>
// 							<div className="optionDescription">Label Size</div>
// 							<SliderWithInput
// 								percent={false}
// 								sliderValue={chartProp.properties[propKey].labelOptions.fontSize}
// 								sliderMinMax={{ min: 8, max: 50, step: 1 }}
// 								changeValue={value => {
// 									updateLabelOption(propKey, "fontSize", value);
// 								}}
// 							/>
// 							<div className="optionDescription">Label Color</div>

// 							<div className="optionDescription">
// 								<label
// 									htmlFor="enableDisable"
// 									className="enableDisableLabel"
// 									style={{ marginRight: "10px" }}
// 								>
// 									Manual
// 								</label>
// 								<SwitchWithInput
// 									isChecked={
// 										chartProp.properties[propKey].labelOptions.labelColorManual
// 									}
// 									onSwitch={() => {
// 										updateLabelOption(
// 											propKey,
// 											"labelColorManual",
// 											!chartProp.properties[propKey].labelOptions
// 												.labelColorManual
// 										);
// 									}}
// 								/>

// 								{chartProp.properties[propKey].labelOptions.labelColorManual ? (
// 									<div
// 										style={{
// 											height: "1.25rem",
// 											width: "50%",
// 											marginLeft: "20px",
// 											backgroundColor:
// 												chartProp.properties[propKey].labelOptions
// 													.labelColor,
// 											color: chartProp.properties[propKey].labelOptions
// 												.labelColor,
// 											border: "2px solid darkgray",
// 											margin: "auto",
// 										}}
// 										onClick={e => {
// 											setColorPopOverOpen(!isColorPopoverOpen);
// 											setAnchorEl(e.currentTarget);
// 										}}
// 									>
// 										{"  "}
// 									</div>
// 								) : null}
// 							</div>
// 							{chartDetail[propKey].chartType === "treeMap" ? (
// 								<>
// 									<div
// 										style={{
// 											borderTop: "1px solid rgb(211,211,211)",
// 											margin: "0.5rem 6% 1rem",
// 										}}
// 									></div>
// 									<TreeMapLabelOptions />
// 								</>
// 							) : null}
// 							{chartDetail[propKey].chartType === "sankey" ? (
// 								<>
// 									<div
// 										style={{
// 											borderTop: "1px solid rgb(211,211,211)",
// 											margin: "0.5rem 6% 1rem",
// 										}}
// 									></div>
// 									<SnakeyLabelOptions />
// 								</>
// 							) : null}
// 						</div>
// 					</div>
// 				</React.Fragment>
// 			) : null}
// 			<Popover
// 				open={isColorPopoverOpen}
// 				onClose={() => setColorPopOverOpen(false)}
// 				onClick={() => setColorPopOverOpen(false)}
// 				anchorReference="anchorPosition"
// 				anchorPosition={{ top: 350, left: 1300 }}
// 			>
// 				<div>
// 					<SketchPicker
// 						color={chartProp.properties[propKey].labelOptions.labelColor}
// 						className="sketchPicker"
// 						width="16rem"
// 						styles={{ padding: "0" }}
// 						onChangeComplete={color => {
// 							updateLabelOption(propKey, "labelColor", color.hex);
// 						}}
// 						onChange={color => updateLabelOption(propKey, "labelColor", color.hex)}
// 						disableAlpha
// 					/>
// 				</div>
// 			</Popover>
// 		</div>
// 	);
// };
// const mapStateToProps = state => {
// 	return {
// 		chartProp: state.chartControls,
// 		tabTileProps: state.tabTileProps,
// 		chartDetail: state.chartProperties.properties,
// 	};
// };

// const mapDispatchToProps = dispatch => {
// 	return {
// 		updateLabelOption: (propKey, option, value) =>
// 			dispatch(updateLabelOption(propKey, option, value)),

// 		updateLabelPosition: (propKey, value) => dispatch(updateLabelPosition(propKey, value)),
// 		updateLabelPadding: (propKey, value) => dispatch(updateLabelPadding(propKey, value)),
// 		updateTreeMapStyleOptions: (propKey, option, value) =>
// 			dispatch(updateTreeMapStyleOptions(propKey, option, value)),
// 	};
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ChartLabels);
import React from "react";

const ChartLabels = () => {
	return <div>ChartLabels</div>;
};

export default ChartLabels;
