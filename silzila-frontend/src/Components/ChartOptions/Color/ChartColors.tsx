// This component list all color themes available for charts

import { FormControl, MenuItem, Popover, Select } from "@mui/material";
import React, { useState } from "react";
import { ColorResult, SketchPicker } from "react-color";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
	setAreaColorOptions,
	setColorScheme,
	switchAutotoManualinSteps,
	updateBoxPlotStyleOptions,
} from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";

import SliderWithInput from "../SliderWithInput";
import SwitchWithInput from "../SwitchWithInput";
import { ColorSchemes, ColorSchemesProps } from "./ColorScheme";
interface ChartColorsActions {
	setColorScheme: (propKey: string, color: string) => void;
	switchAutotoManualinSteps: (propKey: string, value: any) => void;
	setAreaColorOptions: (propKey: string, option: string, value: any) => void;
	updateBoxPlotStyleOptions: (propKey: string, option: string, value: any) => void;
}
const ChartColors = ({
	// state
	chartControls,
	tabTileProps,
	chartProperties,

	// dispatch
	setColorScheme,
	setAreaColorOptions,
	switchAutotoManualinSteps,
	updateBoxPlotStyleOptions,
}: ChartOptionsProps & ChartColorsActions) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	const [selectedMenu, setSelectedMenu] = useState<string>(
		chartControls.properties[propKey].colorScheme
	);
	const [isColorPopoverOpen, setColorPopOverOpen] = useState<boolean>(false);

	const resetSelection = (data_value: string) => {
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
					onChange={e => {
						resetSelection(e.target.value);
					}}
					sx={{ fontSize: "14px", margin: "0 1rem" }}
				>
					{ColorSchemes.map((item: ColorSchemesProps) => {
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
										{item.colors.map((color: string) => {
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
							backgroundColor: chartControls.properties[propKey].areaBackgroundColor,
							color: chartControls.properties[propKey].areaBackgroundColor,
							border: "2px solid darkgray",
							margin: "auto",
						}}
						onClick={() => {
							setColorPopOverOpen(!isColorPopoverOpen);
						}}
					></div>
					<div className="optionDescription">Opacity</div>
					<SliderWithInput
						pointNumbers={true}
						sliderValue={chartControls.properties[propKey].areaOpacity}
						sliderMinMax={{ min: 0, max: 1, step: 0.1 }}
						changeValue={(value: number) => {
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
						<SwitchWithInput
							isChecked={
								chartControls.properties[propKey].boxPlotChartControls.colorBy ===
								"series"
									? false
									: true
							}
							onSwitch={() => {
								if (
									chartControls.properties[propKey].boxPlotChartControls
										.colorBy === "series"
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
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={chartControls.properties[propKey].areaBackgroundColor}
						className="sketchPicker"
						width="16rem"
						// styles={{ padding: "0" }}
						onChangeComplete={(color: ColorResult) => {
							setAreaColorOptions(propKey, "areaBackgroundColor", color.hex);
						}}
						onChange={(color: ColorResult) =>
							setAreaColorOptions(propKey, "areaBackgroundColor", color.hex)
						}
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
		chartProperties: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setColorScheme: (propKey: string, color: string) =>
			dispatch(setColorScheme(propKey, color)),
		switchAutotoManualinSteps: (propKey: string, value: any) =>
			dispatch(switchAutotoManualinSteps(propKey, value)),
		setAreaColorOptions: (propKey: string, option: string, value: any) =>
			dispatch(setAreaColorOptions(propKey, option, value)),
		updateBoxPlotStyleOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateBoxPlotStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartColors);
