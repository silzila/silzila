// Grid and Axis component used to modify the following properties in charts
// 	- Enable min & max values
// 	- For each axes (X & Y)
// 		- Show/Hide labels
// 		- Provide a name for Axis
// 		- Tick size, padding and rotation

import { FormControl, MenuItem, Popover, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import { connect } from "react-redux";

import SliderWithInput from "../SliderWithInput";
import InputNumber from "../CommonFunctions/InputNumber";
import { ColorResult, SketchPicker } from "react-color";
import SwitchWithInput from "../SwitchWithInput";
import { Dispatch } from "redux";
import {
	ChartConAxisOptions,
	ChartConXAxis,
	ChartConYAxis,
} from "../../../redux/ChartPoperties/ChartControlsInterface";

import {
	enableGrid,
	updateAxisMinMax,
	updateAxisMinMaxforScatter,
	updateAxisOptions,
	updateReverse,
} from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";

export const textFieldStyleProps = {
	style: {
		fontSize: "12px",
		width: "90%",
		margin: "0 auto 0.5rem auto",
		backgroundColor: "white",
		height: "1.5rem",
		color: "#404040",
	},
};

interface GridAndAxisProps {
	setAxisMinMax: (propKey: string, axisKey: string, axisValue: any) => void;
	updateAxisMinMaxforScatter: (propKey: string, axisKey: string, axisValue: any) => void;
	setReverse: (propKey: string, value: boolean) => void;
	enableGrids: (propKey: string, option: any, show: any) => void;
	updateAxisOptions: (propKey: string | any, axis: any, option: any, value: any) => void;
}

interface PositionsProps {
	name?: string;
	value: string;
	type?: string;
}

const GridAndAxes = ({
	// state
	chartControls,
	tabTileProps,
	chartProperties,

	//dispatch
	setAxisMinMax,
	setReverse,
	enableGrids,
	updateAxisOptions,
	updateAxisMinMaxforScatter,
}: ChartOptionsProps & GridAndAxisProps) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var property: ChartConAxisOptions = chartControls.properties[propKey].axisOptions;

	const [isXColorPopoverOpen, setXColorPopOverOpen] = useState<boolean>(false);
	const [isYColorPopoverOpen, setYColorPopOverOpen] = useState<boolean>(false);

	var xAxisProps: ChartConXAxis = property.xAxis;
	var yAxisProps: ChartConYAxis = property.yAxis;

	const positions: PositionsProps[] = [
		{ name: "Start", value: "start" },
		{ name: "Middle", value: "middle" },
		{ name: "End", value: "end" },
	];

	// ============================================ X-Axis ======================================================

	const axisOptionsForX: PositionsProps[] = [
		{ type: "Bottom", value: "bottom" },
		{ type: "Top", value: "top" },
	];

	const renderAxisOptionsForX = () => {
		return axisOptionsForX.map((item: PositionsProps) => {
			return (
				<div
					key={item.value}
					className={
						item.value === property.xAxis.position
							? "radioButtonSelected"
							: "radioButton"
					}
					onClick={() => {
						updateAxisOptions(propKey, "xAxis", "position", item.value);
						updateAxisOptions(propKey, "xAxis", "onZero", !property.xAxis.onZero);
					}}
				>
					{item.type}
				</div>
			);
		});
	};

	// ============================================= Y - AXIS ===================================================
	const axisOptionsForY: PositionsProps[] = [
		{ type: "Left", value: "left" },
		{ type: "Right", value: "right" },
	];

	const renderAxisOptionsForY = () => {
		return axisOptionsForY.map((item: PositionsProps) => {
			return (
				<div
					key={item.value}
					className={
						item.value === yAxisProps.position ? "radioButtonSelected" : "radioButton"
					}
					onClick={() => {
						updateAxisOptions(propKey, "yAxis", "position", item.value);
						updateAxisOptions(propKey, "yAxis", "onZero", !yAxisProps.onZero);
					}}
				>
					{item.type}
				</div>
			);
		});
	};

	return (
		<div className="optionsInfo">
			{/*
			======================================================================================================
			                                        GRID PROPS
			====================================================================================================== */}

			{chartProperties.properties[propKey].chartType !== "scatterPlot" ? (
				<>
					<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
						<label
							htmlFor="enableDisable"
							className="enableDisableLabel"
							style={{ marginRight: "10px" }}
						>
							REVERSE
						</label>
						<SwitchWithInput
							isChecked={property.inverse}
							onSwitch={() => {
								setReverse(propKey, !property.inverse);
							}}
						/>
					</div>
					<div className="optionDescription">MIN VALUE</div>
					<div className="optionDescription">
						<input
							type="checkbox"
							id="enableDisable"
							checked={property.axisMinMax.enableMin}
							onChange={() => {
								setAxisMinMax(propKey, "enableMin", !property.axisMinMax.enableMin);
							}}
						/>
						<InputNumber
							value={property.axisMinMax.minValue}
							updateValue={(value: number) => {
								setAxisMinMax(propKey, "minValue", value);
							}}
							disabled={property.axisMinMax.enableMin ? false : true}
						/>
					</div>
					<div className="optionDescription">MAX VALUE</div>
					<div className="optionDescription">
						<input
							type="checkbox"
							id="enableDisable"
							checked={property.axisMinMax.enableMax}
							onChange={() => {
								setAxisMinMax(propKey, "enableMax", !property.axisMinMax.enableMax);
							}}
						/>
						<InputNumber
							value={property.axisMinMax.maxValue}
							updateValue={(value: number) =>
								setAxisMinMax(propKey, "maxValue", value)
							}
							disabled={property.axisMinMax.enableMax ? false : true}
						/>
					</div>
				</>
			) : null}

			{/* ==================================================================================
                                                 AXIS PROPS
			================================================================================== */}

			{/* =========================================================================================
			                                    X - AXIS PROPS
			========================================================================================= */}

			<div
				style={{ borderTop: "1px solid rgb(211,211,211)", margin: "0.5rem 6% 1rem" }}
			></div>
			<div className="optionDescription">Dimension-Axis</div>
			{chartProperties.properties[propKey].chartType === "multibar" ||
			chartProperties.properties[propKey].chartType === "stackedBar" ||
			chartProperties.properties[propKey].chartType === "horizontalBar" ||
			chartProperties.properties[propKey].chartType === "horizontalStacked" ? (
				<>
					<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
						<label
							htmlFor="enableDisable"
							className="enableDisableLabel"
							style={{ marginRight: "10px" }}
						>
							Enable Dimension-Grid
						</label>
						<SwitchWithInput
							isChecked={property.xSplitLine}
							onSwitch={() => {
								enableGrids(propKey, "xSplitLine", !property.xSplitLine);
							}}
						/>
					</div>
				</>
			) : null}

			<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					Show Label
				</label>
				<SwitchWithInput
					isChecked={xAxisProps.showLabel}
					onSwitch={() => {
						updateAxisOptions(propKey, "xAxis", "showLabel", !xAxisProps.showLabel);
					}}
				/>
			</div>
			{xAxisProps.showLabel ? (
				<React.Fragment>
					{chartProperties.properties[propKey].chartType === "scatterPlot" ? (
						<React.Fragment>
							<div className="optionDescription">MIN VALUE</div>
							<div className="optionDescription">
								<input
									type="checkbox"
									id="enableDisable"
									checked={property.scatterChartMinMax.x_enableMin}
									onChange={() => {
										updateAxisMinMaxforScatter(
											propKey,
											"x_enableMin",
											!property.scatterChartMinMax.x_enableMin
										);
									}}
								/>
								<InputNumber
									value={property.scatterChartMinMax.x_minValue}
									updateValue={(value: number) =>
										updateAxisMinMaxforScatter(propKey, "x_minValue", value)
									}
									disabled={
										property.scatterChartMinMax.x_enableMin ? false : true
									}
								/>
							</div>
							<div className="optionDescription">MAX VALUE</div>
							<div className="optionDescription">
								<input
									type="checkbox"
									id="enableDisable"
									checked={property.scatterChartMinMax.x_enableMax}
									onChange={() => {
										updateAxisMinMaxforScatter(
											propKey,
											"x_enableMax",
											!property.scatterChartMinMax.x_enableMax
										);
									}}
								/>
								<InputNumber
									value={property.scatterChartMinMax.x_maxValue}
									updateValue={(value: number) =>
										updateAxisMinMaxforScatter(propKey, "x_maxValue", value)
									}
									disabled={
										property.scatterChartMinMax.x_enableMax ? false : true
									}
								/>
							</div>
						</React.Fragment>
					) : null}
					<div className="radioButtons">{renderAxisOptionsForX()}</div>

					<div className="optionDescription">Axis Name</div>
					<TextField
						value={xAxisProps.name}
						variant="outlined"
						onChange={e => {
							updateAxisOptions(propKey, "xAxis", "name", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>

					<div className="optionDescription">Name Position</div>
					<FormControl
						fullWidth
						size="small"
						style={{ fontSize: "12px", borderRadius: "4px" }}
					>
						<Select
							label=""
							value={xAxisProps.nameLocation}
							variant="outlined"
							onChange={e => {
								updateAxisOptions(propKey, "xAxis", "nameLocation", e.target.value);
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
							{positions.map(position => {
								return (
									<MenuItem
										value={position.value}
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
					<div className="optionDescription">Name Gap</div>

					<TextField
						value={xAxisProps.nameGap}
						variant="outlined"
						onChange={e => {
							updateAxisOptions(propKey, "xAxis", "nameGap", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>
					<div className="optionDescription">Name FontSize</div>
					<SliderWithInput
						percent={false}
						sliderValue={xAxisProps.nameSize}
						sliderMinMax={{ min: 0, max: 80, step: 1 }}
						changeValue={(value: number) => {
							updateAxisOptions(propKey, "xAxis", "nameSize", value);
						}}
					/>
					<div style={{ display: "flex", marginTop: "2px", marginBottom: "2px" }}>
						<div className="optionDescription">Name Color</div>
						<div
							style={{
								width: " 30%",
								margin: "0 5% 10px 0",
								height: "1.25rem",
								color: xAxisProps.nameColor,
								border: "1px solid lightgray",
								borderRadius: "3px",
								padding: "0 5px",
								backgroundColor: xAxisProps.nameColor,
							}}
							onClick={() => {
								setXColorPopOverOpen(!isXColorPopoverOpen);
							}}
						></div>
					</div>

					<div className="optionDescription">Tick Size</div>
					<SliderWithInput
						percent={false}
						sliderValue={
							xAxisProps.position === "top"
								? xAxisProps.tickSizeTop
								: xAxisProps.tickSizeBottom
						}
						sliderMinMax={{ min: 0, max: 20, step: 1 }}
						changeValue={(value: number) => {
							if (xAxisProps.position === "top") {
								// CHANGING TICK SIZE OF X-AXIS WHEN POSITION IS TOP
								updateAxisOptions(propKey, "xAxis", "tickSizeTop", value);
							} else if (xAxisProps.position === "bottom") {
								// CHANGING TICK SIZE OF X-AXIS WHEN POSITION IS BOTTOM
								updateAxisOptions(propKey, "xAxis", "tickSizeBottom", value);
							}
						}}
					/>
					<div className="optionDescription">Tick Padding</div>
					<SliderWithInput
						percent={false}
						sliderValue={
							xAxisProps.position === "top"
								? xAxisProps.tickPaddingTop
								: xAxisProps.tickPaddingBottom
						}
						sliderMinMax={{ min: 0, max: 20, step: 1 }}
						changeValue={(value: number) => {
							if (xAxisProps.position === "top") {
								//CHANGING TICK PADDING OF X-AXIS WHEN POSITION IS IN TOP
								updateAxisOptions(propKey, "xAxis", "tickPaddingTop", value);
							} else if (xAxisProps.position === "bottom") {
								//CHANGING TICK PADDING OF X-AXIS WHEN POSITION IS IN BOTTOM
								updateAxisOptions(propKey, "xAxis", "tickPaddingBottom", value);
							}
						}}
					/>
					<div className="optionDescription">Tick Rotation</div>
					<SliderWithInput
						degree={true}
						sliderValue={
							xAxisProps.position === "top"
								? xAxisProps.tickRotationTop
								: xAxisProps.tickRotationBottom
						}
						sliderMinMax={{ min: -90, max: 90, step: 1 }}
						changeValue={(value: number) => {
							if (xAxisProps.position === "top") {
								// SET TICK ROTATION OF X-AXIS WHEN POSITION IS IN TOP
								updateAxisOptions(propKey, "xAxis", "tickRotationTop", value);
							} else if (xAxisProps.position === "bottom") {
								// SET TICK ROTATION OF X-AXIS WHEN POSITION IS IN TOP
								updateAxisOptions(propKey, "xAxis", "tickRotationBottom", value);
							}
						}}
					/>
				</React.Fragment>
			) : null}

			{/* ============================================================================================
			Y-AXIS PROPS
			============================================================================================ */}

			<div
				style={{ borderTop: "1px solid rgb(211,211,211)", margin: "0.5rem 6% 1rem" }}
			></div>
			<div className="optionDescription">Measure-Axis</div>

			{chartProperties.properties[propKey].chartType === "multibar" ||
			chartProperties.properties[propKey].chartType === "stackedBar" ||
			chartProperties.properties[propKey].chartType === "horizontalBar" ||
			chartProperties.properties[propKey].chartType === "horizontalStacked" ? (
				<>
					<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
						<label
							htmlFor="enableDisable"
							className="enableDisableLabel"
							style={{ marginRight: "10px" }}
						>
							Enable Measure-Grid
						</label>
						<SwitchWithInput
							isChecked={property.ySplitLine}
							onSwitch={() => {
								enableGrids(propKey, "ySplitLine", !property.ySplitLine);
							}}
						/>
					</div>
				</>
			) : null}
			<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					show Label
				</label>
				<SwitchWithInput
					isChecked={yAxisProps.showLabel}
					onSwitch={() => {
						updateAxisOptions(propKey, "yAxis", "showLabel", !yAxisProps.showLabel);
					}}
				/>
			</div>
			{yAxisProps.showLabel ? (
				<React.Fragment>
					{chartProperties.properties[propKey].chartType === "scatterPlot" ? (
						<>
							<div className="optionDescription">MIN VALUE</div>
							<div className="optionDescription">
								<input
									type="checkbox"
									id="enableDisable"
									checked={property.scatterChartMinMax.y_enableMin}
									onChange={() => {
										updateAxisMinMaxforScatter(
											propKey,
											"y_enableMin",
											!property.scatterChartMinMax.y_enableMin
										);
									}}
								/>
								<InputNumber
									value={property.scatterChartMinMax.y_minValue}
									updateValue={(value: number) =>
										updateAxisMinMaxforScatter(propKey, "y_minValue", value)
									}
									disabled={
										property.scatterChartMinMax.y_enableMin ? false : true
									}
								/>
							</div>
							<div className="optionDescription">MAX VALUE</div>
							<div className="optionDescription">
								<input
									type="checkbox"
									id="enableDisable"
									checked={property.scatterChartMinMax.y_enableMax}
									onChange={() => {
										updateAxisMinMaxforScatter(
											propKey,
											"y_enableMax",
											!property.scatterChartMinMax.y_enableMax
										);
									}}
								/>
								<InputNumber
									value={property.scatterChartMinMax.y_maxValue}
									updateValue={(value: number) =>
										updateAxisMinMaxforScatter(propKey, "y_maxValue", value)
									}
									disabled={
										property.scatterChartMinMax.y_enableMax ? false : true
									}
								/>
							</div>
						</>
					) : null}
					<div className="radioButtons">{renderAxisOptionsForY()}</div>

					<div className="optionDescription">Axis Name</div>

					<TextField
						value={yAxisProps.name}
						variant="outlined"
						onChange={e => {
							updateAxisOptions(propKey, "yAxis", "name", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>

					<div className="optionDescription">Name Position</div>
					<FormControl
						fullWidth
						size="small"
						style={{ fontSize: "12px", borderRadius: "4px" }}
					>
						<Select
							label=""
							value={yAxisProps.nameLocation}
							variant="outlined"
							onChange={e => {
								updateAxisOptions(propKey, "yAxis", "nameLocation", e.target.value);
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
							{positions.map(position => {
								return (
									<MenuItem
										value={position.value}
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
					<div className="optionDescription">Name Gap</div>

					<TextField
						value={yAxisProps.nameGap}
						variant="outlined"
						onChange={e => {
							updateAxisOptions(propKey, "yAxis", "nameGap", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>
					<div className="optionDescription">Name FontSize</div>
					<SliderWithInput
						percent={false}
						sliderValue={yAxisProps.nameSize}
						sliderMinMax={{ min: 0, max: 80, step: 1 }}
						changeValue={(value: number) => {
							updateAxisOptions(propKey, "yAxis", "nameSize", value);
						}}
					/>
					<div style={{ display: "flex", marginTop: "2px", marginBottom: "2px" }}>
						<div className="optionDescription">Name Color</div>
						<div
							style={{
								width: " 30%",
								margin: "0 5% 10px 0",
								height: "1.25rem",
								color: yAxisProps.nameColor,
								border: "1px solid lightgray",
								borderRadius: "3px",
								padding: "0 5px",
								backgroundColor: yAxisProps.nameColor,
							}}
							onClick={e => {
								setYColorPopOverOpen(!isYColorPopoverOpen);
							}}
						></div>
					</div>

					<div className="optionDescription">Tick Size</div>
					<SliderWithInput
						percent={false}
						sliderValue={
							yAxisProps.position === "left"
								? yAxisProps.tickSizeLeft
								: yAxisProps.tickSizeRight
						}
						sliderMinMax={{ min: 0, max: 20, step: 1 }}
						changeValue={(value: number) => {
							if (yAxisProps.position === "left") {
								// CHANGING Y-AXIS TICK SIZE WHEN POSITION IS INN LEFT
								updateAxisOptions(propKey, "yAxis", "tickSizeLeft", value);
							} else if (yAxisProps.position === "right") {
								//CHANGING Y-AXIS TICK SIZE WHEN POSITION IS IN RIGHT
								updateAxisOptions(propKey, "yAxis", "tickSizeRight", value);
							}
						}}
					/>

					<div className="optionDescription">Tick Padding</div>
					<SliderWithInput
						percent={false}
						sliderValue={
							yAxisProps.position === "left"
								? yAxisProps.tickPaddingLeft
								: yAxisProps.tickPaddingRight
						}
						sliderMinMax={{ min: 0, max: 20, step: 1 }}
						changeValue={(value: number) => {
							if (yAxisProps.position === "left") {
								//CHANGING TICK PADDING OF Y-AXIS WHEN POSITION IS IN LEFT
								updateAxisOptions(propKey, "yAxis", "tickPaddingLeft", value);
							} else if (yAxisProps.position === "right") {
								//CHANGING TICK PADDING OF Y-AXIS WHEN POSITION IS IN RIGHT
								updateAxisOptions(propKey, "yAxis", "tickPaddingRight", value);
							}
						}}
					/>
					<div className="optionDescription">Tick Rotation</div>
					<SliderWithInput
						degree={true}
						sliderValue={
							yAxisProps.position === "left"
								? yAxisProps.tickRotationLeft
								: yAxisProps.tickRotationRight
						}
						sliderMinMax={{ min: -90, max: 90, step: 1 }}
						changeValue={(value: number) => {
							if (yAxisProps.position === "left") {
								// CHANGING ANGLE FOR Y-AXIS LABEL WHEN POSITION IS IN LEFT
								updateAxisOptions(propKey, "yAxis", "tickRotationLeft", value);
							} else if (yAxisProps.position === "right") {
								// CHANGING ANGLE FOR Y-AXIS LABEL WHEN POSITION IS IN RIGHT
								updateAxisOptions(propKey, "yAxis", "tickRotationRight", value);
							}
						}}
					/>
				</React.Fragment>
			) : null}
			<Popover
				open={isXColorPopoverOpen}
				onClose={() => setXColorPopOverOpen(false)}
				onClick={() => setXColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={xAxisProps.nameColor}
						className="sketchPicker"
						width="16rem"
						// styles={{ padding: "0" }}
						onChangeComplete={(color: ColorResult) => {
							updateAxisOptions(propKey, "xAxis", "nameColor", color.hex);
						}}
						onChange={(color: ColorResult) =>
							updateAxisOptions(propKey, "xAxis", "nameColor", color.hex)
						}
						disableAlpha
					/>
				</div>
			</Popover>
			<Popover
				open={isYColorPopoverOpen}
				onClose={() => setYColorPopOverOpen(false)}
				onClick={() => setYColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={yAxisProps.nameColor}
						className="sketchPicker"
						width="16rem"
						// style={{ padding: "0" }}
						onChangeComplete={(color: ColorResult) => {
							updateAxisOptions(propKey, "yAxis", "nameColor", color.hex);
						}}
						onChange={(color: ColorResult) =>
							updateAxisOptions(propKey, "yAxis", "nameColor", color.hex)
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
		setAxisMinMax: (propKey: string, axisKey: string, axisValue: any) =>
			dispatch(updateAxisMinMax(propKey, axisKey, axisValue)),
		updateAxisMinMaxforScatter: (propKey: string, axisKey: string, axisValue: any) =>
			dispatch(updateAxisMinMaxforScatter(propKey, axisKey, axisValue)),

		setReverse: (propKey: string, value: boolean) => dispatch(updateReverse(propKey, value)),
		enableGrids: (propKey: string, option: string, show: boolean) =>
			dispatch(enableGrid(propKey, option, show)),
		updateAxisOptions: (propKey: string | any, axis: string, option: string, value: any) =>
			dispatch(updateAxisOptions(propKey, axis, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GridAndAxes);
