// This component list all color themes available for charts

import { FormControl, InputLabel, MenuItem, Popover, Select, Switch } from "@mui/material";
import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { connect } from "react-redux";
import {
	setAreaColorOptions,
	setColorScheme,
	switchAutotoManualinSteps,
	updateBoxPlotStyleOptions,
} from "../../../redux/ChartProperties/actionsChartControls";
import SliderWithInput from "../SliderWithInput";
import { ColorSchemes } from "./ColorScheme";

const ChartColors = ({
	// state
	chartProp,
	tabTileProps,
	chartProperties,

	// dispatch
	setColorScheme,
	setAreaColorOptions,
	switchAutotoManualinSteps,
	updateBoxPlotStyleOptions,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [selectedMenu, setSelectedMenu] = useState(chartProp.properties[propKey].colorScheme);
	const [isColorPopoverOpen, setColorPopOverOpen] = useState(false);

	const resetSelection = (data_value) => {
		if (chartProperties.properties[propKey].chartType === "gauge") {
			switchAutotoManualinSteps(propKey, true);
		}
		setSelectedMenu(data_value);
		setColorScheme(propKey, data_value);
	};

	return (
		<div className="optionsInfo">
			<div className="optionDescription">COLOR SCHEME:</div>
			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					size="small"
					value={selectedMenu}
					variant="outlined"
					onChange={(e) => {
						//console.log(e.target.value);
						resetSelection(e.target.value);
					}}
					sx={{ fontSize: "14px", margin: "0 1rem" }}
				>
					{ColorSchemes.map((item) => {
						return (
							<MenuItem
								value={item.name}
								key={item.name}
								sx={{
									padding: "2px 10px",
								}}
							>
								<div
									className="custom-option"
									style={{
										backgroundColor: item.background,
										color: item.dark ? "white" : "#3b3b3b",
									}}
								>
									<span className="color-name">{item.name}</span>
									<div className="color-palette">
										{item.colors.map((color) => {
											return (
												<div
													className="indi-color"
													style={{
														height: "8px",
														background: color,
													}}
													key={`${item.name}_${color}`}
												></div>
											);
										})}
									</div>
								</div>
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
			{chartProperties.properties[propKey].chartType === "area" ? (
				<React.Fragment>
					<div className="optionDescription">Background Color</div>
					<div
						style={{
							height: "1.25rem",
							width: "50%",
							marginLeft: "20px",
							backgroundColor: chartProp.properties[propKey].areaBackgroundColor,
							color: chartProp.properties[propKey].areaBackgroundColor,
							border: "2px solid darkgray",
							margin: "auto",
						}}
						onClick={(e) => {
							setColorPopOverOpen(!isColorPopoverOpen);
						}}
					></div>
					<div className="optionDescription">Opacity</div>
					<SliderWithInput
						pointNumbers={true}
						sliderValue={chartProp.properties[propKey].areaOpacity}
						sliderMinMax={{ min: 0, max: 1, step: 0.1 }}
						changeValue={(value) => {
							setAreaColorOptions(propKey, "areaOpacity", value);
						}}
					/>
				</React.Fragment>
			) : null}
			{chartProperties.properties[propKey].chartType === "boxPlot" ? (
				<React.Fragment>
					<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
						<label
							htmlFor="enableDisable"
							className="enableDisableLabel"
							style={{ marginRight: "10px" }}
						>
							Color By Category
						</label>
						<Switch
							size="small"
							id="enableDisable"
							checked={
								chartProp.properties[propKey].boxPlotChartControls.colorBy ===
								"series"
									? false
									: true
							}
							onClick={() => {
								if (
									chartProp.properties[propKey].boxPlotChartControls.colorBy ===
									"series"
								) {
									updateBoxPlotStyleOptions(propKey, "colorBy", "data");
								} else {
									updateBoxPlotStyleOptions(propKey, "colorBy", "series");
								}
							}}
						/>
					</div>
				</React.Fragment>
			) : null}
			<Popover
				open={isColorPopoverOpen}
				onClose={() => setColorPopOverOpen(false)}
				onClick={() => setColorPopOverOpen(false)}
				// anchorEl={anchorEl}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={chartProp.areaBackgroundColor}
						className="sketchPicker"
						width="16rem"
						styles={{ padding: "0" }}
						onChangeComplete={(color) => {
							setAreaColorOptions(propKey, "areaBackgroundColor", color.hex);
						}}
						onChange={(color) =>
							setAreaColorOptions(propKey, "areaBackgroundColor", color.hex)
						}
						disableAlpha
					/>
				</div>
			</Popover>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		chartProp: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProperties: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setColorScheme: (propKey, color) => dispatch(setColorScheme(propKey, color)),
		switchAutotoManualinSteps: (propKey, value) =>
			dispatch(switchAutotoManualinSteps(propKey, value)),
		setAreaColorOptions: (propKey, option, value) =>
			dispatch(setAreaColorOptions(propKey, option, value)),
		updateBoxPlotStyleOptions: (propKey, option, value) =>
			dispatch(updateBoxPlotStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartColors);
