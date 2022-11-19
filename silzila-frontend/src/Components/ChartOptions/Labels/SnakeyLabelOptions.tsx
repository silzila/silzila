// import React, { useState } from "react";
// import { connect } from "react-redux";
// import "./chartLabels.css";
// import { updateSankeyStyleOptions } from "../../../redux/ChartProperties/actionsChartControls";
// import SliderWithInput from "../SliderWithInput";
// import { FormControl, MenuItem, Select } from "@mui/material";
// import { debounce } from "lodash";

// const menuItemStyle = {
// 	padding: "2px 10px",
// 	fontSize: "12px",
// };

// const SelectComponentStyle = {
// 	fontSize: "12px",
// 	width: "90%",
// 	margin: "0 auto 0.5rem auto",
// 	backgroundColor: "white",
// 	height: "1.5rem",
// 	color: "#404040",
// };

// const SankeyLabelOptions = ({
// 	// state
// 	chartProp,
// 	tabTileProps,
// 	chartDetail,

// 	// dispatch

// 	updateSankeyStyleOptions,
// }) => {
// 	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
// 	const handleOnSlide = debounce(value => {
// 		updateSankeyStyleOptions(propKey, "labelDistance", value);
// 	}, 5000);

// 	const sankeyLabelRotationOption = [
// 		{ name: "Horizondal", value: 0 },
// 		{ name: "Vertical", value: 90 },
// 		{ name: "Vertical Flip", value: -90 },
// 	];

// 	return (
// 		<div className="optionsInfo">
// 			<div className="optionDescription">Label Position</div>
// 			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
// 				<Select
// 					value={chartProp.properties[propKey].sankeyControls.labelPosition}
// 					variant="outlined"
// 					onChange={e => {
// 						updateSankeyStyleOptions(propKey, "labelPosition", e.target.value);
// 					}}
// 					sx={SelectComponentStyle}
// 				>
// 					<MenuItem value="inside" key="inside" sx={menuItemStyle}>
// 						Inside
// 					</MenuItem>
// 					<MenuItem value="outside" key="outside" sx={menuItemStyle}>
// 						Outside
// 					</MenuItem>
// 				</Select>
// 			</FormControl>
// 			<div className="optionDescription">Label Distance</div>
// 			<SliderWithInput
// 				percent={true}
// 				sliderValue={chartProp.properties[propKey].sankeyControls.labelDistance}
// 				sliderMinMax={{ min: 0, max: 50, step: 1 }}
// 				changeValue={value => {
// 					handleOnSlide(value);
// 					// updateSankeyStyleOptions(propKey, "labelDistance", value);
// 				}}
// 			/>
// 			<div className="optionDescription">Label Rotate</div>
// 			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
// 				<Select
// 					value={chartProp.properties[propKey].sankeyControls.labelRotate}
// 					variant="outlined"
// 					onChange={e => {
// 						updateSankeyStyleOptions(propKey, "labelRotate", e.target.value);
// 					}}
// 					sx={SelectComponentStyle}
// 				>
// 					{sankeyLabelRotationOption.map(position => {
// 						return (
// 							<MenuItem value={position.value} key={position.name} sx={menuItemStyle}>
// 								{position.name}
// 							</MenuItem>
// 						);
// 					})}
// 				</Select>
// 			</FormControl>

// 			<div className="optionDescription">Label Overflow</div>
// 			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
// 				<Select
// 					value={chartProp.properties[propKey].sankeyControls.overFlow}
// 					variant="outlined"
// 					onChange={e => {
// 						updateSankeyStyleOptions(propKey, "overFlow", e.target.value);
// 					}}
// 					sx={SelectComponentStyle}
// 				>
// 					<MenuItem sx={menuItemStyle} value="truncate">
// 						Truncate
// 					</MenuItem>
// 					<MenuItem sx={menuItemStyle} value="break">
// 						Break
// 					</MenuItem>
// 				</Select>
// 			</FormControl>
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
// 		updateSankeyStyleOptions: (propKey, option, value) =>
// 			dispatch(updateSankeyStyleOptions(propKey, option, value)),
// 	};
// };

// export default connect(mapStateToProps, mapDispatchToProps)(SankeyLabelOptions);
import React from "react";

const SnakeyLabelOptions = () => {
	return <div>SnakeyLabelOptions</div>;
};

export default SnakeyLabelOptions;
