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
import { ChartConLabelOptions } from "../../../redux/ChartPoperties/ChartControlsInterface";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
interface ChartLabelsProps {
	updateLabelOption: (propKey: string, option: string, value: any) => void;
	updateLabelPosition: (propKey: string, value: any) => void;
	updateLabelPadding: (propKey: string, value: any) => void;
}

const ChartLabels = ({
	// state
	chartControls,
	tabTileProps,
	chartProperties,

	// dispatch
	updateLabelOption,
	updateLabelPosition,
	updateLabelPadding,
}: ChartOptionsProps & ChartLabelsProps) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [isColorPopoverOpen, setColorPopOverOpen] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<string | any>("");

	const showLabel: boolean = chartControls.properties[propKey].labelOptions.showLabel;
	var labelOptions: ChartConLabelOptions = chartControls.properties[propKey].labelOptions;


	const labelPositionOptions: any[] = [
		{ name: "Outside", value: "outside" },
		{ name: "Inside", value: "inside" },
	];

	const labelOptionsList: any[] = [
		{ name: "Show", value: true },
		{ name: "Hide", value: false },
	];
	const renderLabels = () => {
		return labelOptionsList.map((item: any, i: number) => {
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
						{chartProperties.properties[propKey].chartType === "pie" ||
						chartProperties.properties[propKey].chartType === "donut" ? (
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
										{labelPositionOptions.map((position: any) => {
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
								sliderValue={
									chartControls.properties[propKey].labelOptions.fontSize
								}
								sliderMinMax={{ min: 8, max: 50, step: 1 }}
								changeValue={(value: number) => {
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
										chartControls.properties[propKey].labelOptions
											.labelColorManual
									}
									onSwitch={() => {
										updateLabelOption(
											propKey,
											"labelColorManual",
											!chartControls.properties[propKey].labelOptions
												.labelColorManual
										);
									}}
								/>

								{chartControls.properties[propKey].labelOptions.labelColorManual ? (
									<div
										style={{
											height: "1.25rem",
											width: "50%",
											marginLeft: "20px",
											backgroundColor:
												chartControls.properties[propKey].labelOptions
													.labelColor,
											color: chartControls.properties[propKey].labelOptions
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
							{chartProperties.properties[propKey].chartType === "treeMap" ? (
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
							{chartProperties.properties[propKey].chartType === "sankey" ? (
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
						color={chartControls.properties[propKey].labelOptions.labelColor}
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
const mapStateToProps = (state: ChartOptionsStateProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProperties: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateLabelOption: (propKey: string, option: string, value: any) =>
			dispatch(updateLabelOption(propKey, option, value)),

		updateLabelPosition: (propKey: string, value: any) =>
			dispatch(updateLabelPosition(propKey, value)),
		updateLabelPadding: (propKey: string, value: any) =>
			dispatch(updateLabelPadding(propKey, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartLabels);
