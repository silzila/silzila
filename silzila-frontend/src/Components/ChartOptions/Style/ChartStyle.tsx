// // This component provides following controls for style in charts
// // 	- Manual/Automatic label color
// // 	- Change cell font size for label
// //  - Cell size
// //  - Change header style

// import React, { useState } from "react";
// import { connect } from "react-redux";
// import "./chartStyle.css";
// import {
// 	updateCrossTabHeaderLabelOptions,
// 	updateCrossTabCellLabelOptions,
// 	updateCrossTabStyleOptions
// } from "../../../redux/ChartProperties/actionsChartControls";
// import { SketchPicker } from "react-color";
// import SliderWithInput from "../SliderWithInput";
// import { FormControl, MenuItem, Popover, Select } from "@mui/material";

// const ChartStyle = ({
// 	// state
// 	chartProp,
// 	tabTileProps,
// 	chartDetail,

// 	// dispatch
// 	updateCrossTabHeaderLabelOptions,
// 	updateCrossTabCellLabelOptions,
// 	updateCrossTabStyleOptions
// }) => {
// 	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

// 	const [isColorPopoverOpen, setColorPopOverOpen] = useState(false);
// 	const [anchorEl, setAnchorEl] = useState("");
//     const [optionName, setOptionName] = useState("Header");
//     let options = {};

// 	const labelOptionsList = [
// 		{ name: "Header", value: true },
// 		{ name: "Cell", value: false },
// 	];

// 	if(optionName === "Header"){
// 		options = chartProp.properties[propKey].crossTabHeaderLabelOptions;
// 	}
// 	else{
// 		options =  chartProp.properties[propKey].crossTabCellLabelOptions;
// 	}

// 	const renderLabels = () => {
// 		return labelOptionsList.map((item, i) => {
// 			return (
// 				<button
// 					value={item.value}
// 					onClick={(e) => setOptionName(item.name)}
// 					className={item.name === optionName ? "radioButtonSelected" : "radioButton"}
// 					key={i}
// 				>
// 					{item.name}
// 				</button>
// 			);
// 		});
// 	};

// 	return (
// 		<div className="optionsInfo">
// 		<div className="optionDescription">BORDER WIDTH</div>
// 		<SliderWithInput
// 			percent={false}
// 			sliderValue={chartProp.properties[propKey].crossTabStyleOptions.borderWidth }
// 			sliderMinMax={{ min: 1, max: 15, step: 1 }}
// 			changeValue={(value) => {
// 					updateCrossTabStyleOptions(propKey, "borderWidth", value);
// 			}}
// 		/>

// 		<div className="optionDescription">LINE HEIGHT</div>
// 		<SliderWithInput
// 			percent={false}
// 			sliderValue={chartProp.properties[propKey].crossTabStyleOptions.lineHeight }
// 			sliderMinMax={{ min: 1, max: 20, step: 0.5 }}
// 			changeValue={(value) => {
// 				updateCrossTabStyleOptions(propKey, "lineHeight", value);
// 			}}
// 		/>

// 			<div className="radioButtons">{renderLabels()}</div>
// 				<React.Fragment>
// 					<div style={{ display: "flex", paddingBottom: "8px", flexDirection: "column" }}>
// 						<div>
// 							<div className="optionDescription">LABEL COLOR</div>

// 							<div className="optionDescription">
// 								<input
// 									type="checkbox"
// 									id="enableDisable"
// 									checked={
// 										options.labelColorManual
// 									}
// 									onChange={() => {
//                                         if(optionName === "Header"){
// 										updateCrossTabHeaderLabelOptions(
// 											propKey,
// 											"labelColorManual",
// 											!options
// 												.labelColorManual
// 										);
//                                         }
//                                         else{
//                                             updateCrossTabCellLabelOptions(
//                                                 propKey,
//                                                 "labelColorManual",
//                                                 !options
//                                                     .labelColorManual
//                                             );
//                                         }
// 									}}
// 								/>
// 								<label htmlFor="enableDisable" style={{ padding: "5px" }}>
// 									Manual
// 								</label>
// 								{options.labelColorManual ? (
// 									<div
// 										style={{
// 											height: "100%",
// 											width: "50%",
// 											backgroundColor:
// 												options
// 													.labelColor,
// 											color: options
// 												.labelColor,
// 											border: "2px solid darkgray",
// 											margin: "auto",
// 										}}
// 										onClick={(e) => {
// 											setColorPopOverOpen(!isColorPopoverOpen);
// 											//setAnchorEl(e.currentTarget);
// 										}}
// 									>
// 										{" c "}
// 									</div>
// 								) : null}
// 							</div>
// 						</div>
// 						<div className="optionDescription">FONT SIZE</div>
// 						<SliderWithInput
// 							percent={false}
// 							sliderValue={options.fontSize }
// 							sliderMinMax={{ min: 8, max: 50, step: 1 }}
// 							changeValue={(value) => {
// 								if(optionName === "Header"){
//                                     updateCrossTabHeaderLabelOptions(propKey, "fontSize", value);
//                                 }
//                                  else{
//                                     updateCrossTabCellLabelOptions(propKey, "fontSize", value);
//                                 }
// 							}}
// 						/>

//                         <div className="optionDescription">FONT WEIGHT</div>
// 						<SliderWithInput
// 							percent={false}
// 							sliderValue={options.fontWeight }
// 							sliderMinMax={{ min: 400, max: 900, step: 100 }}
// 							changeValue={(value) => {
// 								if(optionName === "Header"){
//                                     updateCrossTabHeaderLabelOptions(propKey, "fontWeight", value);
//                                 }
//                                  else{
//                                     updateCrossTabCellLabelOptions(propKey, "fontWeight", value);
//                                 }
// 							}}
// 						/>
// 					</div>
// 				</React.Fragment>
// 			<Popover
// 				open={isColorPopoverOpen}
// 				onClose={() => setColorPopOverOpen(false)}
// 				// anchorEl={anchorEl}
// 				anchorReference="anchorPosition"
// 				anchorPosition={{ top: 350, left: 1300 }}
// 			>
// 				<div>
// 					<SketchPicker
// 						color={options.labelColor}
// 						className="sketchPicker"
// 						width="16rem"
// 						styles={{ padding: "0" }}
// 						onChangeComplete={(color) => {
//                             if(optionName === "Header"){
// 						    	updateCrossTabHeaderLabelOptions(propKey, "labelColor", color.hex);
//                             }
//                             else{
//                                 updateCrossTabCellLabelOptions(propKey, "labelColor", color.hex);
//                             }
// 						}}
// 						onChange={(color) => {
//                             if(optionName === "Header"){
//                             updateCrossTabHeaderLabelOptions(propKey, "labelColor", color.hex)
//                         }
//                         else{
//                             updateCrossTabCellLabelOptions(propKey, "labelColor", color.hex);
//                         }
//                         }}
// 						disableAlpha
// 					/>
// 				</div>
// 			</Popover>
// 		</div>
// 	);
// };
// const mapStateToProps = (state) => {
// 	return {
// 		chartProp: state.chartControls,
// 		tabTileProps: state.tabTileProps,
// 		chartDetail: state.chartProperties.properties,
// 	};
// };

// const mapDispatchToProps = (dispatch) => {
// 	return {
// 		updateCrossTabHeaderLabelOptions: (propKey, option, value) =>
// 			dispatch(updateCrossTabHeaderLabelOptions(propKey, option, value)),
//             updateCrossTabCellLabelOptions: (propKey, option, value) => dispatch(updateCrossTabCellLabelOptions(propKey, option, value)),
//             updateCrossTabStyleOptions: (propKey, option, value) => dispatch(updateCrossTabStyleOptions(propKey, option, value))
// 	};
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ChartStyle);
import React from "react";

const ChartStyle = () => {
	return <div>ChartStyle</div>;
};

export default ChartStyle;
