// This component relates with Legend related controls for chart
// The controls include
// 	- show / hide legend
// 	- legend position
// 	- Orientation
// 	- legend item size

import { FormControl, MenuItem, Select } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
	updateCalendarStyleOptions,
	updateLegendOptions,
} from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import SliderWithInput from "../SliderWithInput";
import SwitchWithInput from "../SwitchWithInput";
const ChartLegend = ({
	// state
	tabTileProps,
	chartControls,
	chartProperties,

	// dispatch
	updateLegendOption,
	updateCalendarStyleOptions,
}: ChartOptionsProps & {
	updateLegendOption: (propKey: string, option: string, value: any) => void;
	updateCalendarStyleOptions: (propKey: string, option: string, value: any) => void;
}) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const showLegend: boolean = chartControls.properties[propKey].legendOptions.showLegend;

	const orientation: string =
		chartProperties.properties[propKey].chartType === "calendar"
			? chartControls.properties[propKey].calendarStyleOptions.orientation
			: chartControls.properties[propKey].legendOptions.orientation;

	const setOrient = (item: string) => {
		if (
			chartProperties.properties[propKey].chartType === "calendar" ||
			chartProperties.properties[propKey].chartType === "heatmap"
		) {
			updateCalendarStyleOptions(propKey, "orientation", item);
		} else {
			updateLegendOption(propKey, "orientation", item);
		}
	};
	const orientOption: any[] = [
		{ name: "Horizontal", key: "horizontal" },
		{ name: "Vertical", key: "vertical" },
	];
	const renderOrientation = () => {
		return orientOption.map(item => {
			return (
				<div
					className={item.key === orientation ? "radioButtonSelected" : "radioButton"}
					onClick={() => setOrient(item.key)}
					key={item.key}
				>
					{item.name}
				</div>
			);
		});
	};

	const positions: any[] = [
		{ pos: "Top Left", top: "top", left: "left" },
		{ pos: "Top", top: "top", left: "center" },
		{ pos: "Top Right", top: "top", left: "right" },
		{ pos: "Middle Left", top: "middle", left: "left" },
		{ pos: "Middle", top: "middle", left: "center" },
		{ pos: "Middle Right", top: "middle", left: "right" },
		{ pos: "Bottom Left", top: "bottom", left: "left" },
		{ pos: "Bottom", top: "bottom", left: "center" },
		{ pos: "Bottom Right", top: "bottom", left: "right" },
	];
	const selectedPosition: any = chartControls.properties[propKey].legendOptions.position;

	const updateSelectedPosition = (selectedValue: string) => {
		var positionSelected = positions.filter(pos => pos.pos === selectedValue)[0];

		updateLegendOption(propKey, "position", positionSelected);
	};

	const itemWidthMinMax: any = { min: 5, max: 200, step: 1 };
	const itemHeightMinMax: any = { min: 5, max: 200, step: 1 };
	const itemSpacingMinMax: any = { min: 0, max: 60, step: 1 };

	return (
		<div className="optionsInfo" style={{ overflowX: "hidden" }}>
			<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					SHOW LEGEND
				</label>
				<SwitchWithInput
					isChecked={showLegend}
					onSwitch={() => {
						updateLegendOption(propKey, "showLegend", !showLegend);
					}}
				/>
			</div>
			{showLegend ? (
				<React.Fragment>
					<div className="optionDescription">POSITION:</div>
					{selectedPosition?.pos ? (
						<FormControl
							fullWidth
							size="small"
							style={{ fontSize: "12px", borderRadius: "4px" }}
						>
							<Select
								label=""
								value={selectedPosition?.pos}
								variant="outlined"
								onChange={e => {
									updateSelectedPosition(e.target.value);
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
											value={position.pos}
											key={position.pos}
											sx={{
												padding: "2px 10px",
												fontSize: "12px",
											}}
										>
											{position.pos}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					) : null}
					{chartProperties.properties[propKey].chartType === "calendar" ||
					chartProperties.properties[propKey].chartType === "heatmap" ? (
						<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
							<label
								htmlFor="enableDisable"
								className="enableDisableLabel"
								style={{ marginRight: "10px" }}
							>
								PIECEWISE
							</label>
							<SwitchWithInput
								isChecked={
									chartControls.properties[propKey].calendarStyleOptions.pieceWise
								}
								onSwitch={() => {
									updateCalendarStyleOptions(
										propKey,
										"pieceWise",
										!chartControls.properties[propKey].calendarStyleOptions
											.pieceWise
									);
								}}
							/>
						</div>
					) : null}
					<div className="optionDescription">ORIENTATION:</div>
					<div className="radioButtons">{renderOrientation()}</div>
					<div className="optionDescription">RESIZE:</div>
					{chartProperties.properties[propKey].chartType === "calendar" ||
					chartProperties.properties[propKey].chartType === "heatmap" ? (
						<>
							{chartControls.properties[propKey].calendarStyleOptions.pieceWise ? (
								<>
									<div className="optionDescription">Item Gap</div>
									<SliderWithInput
										sliderValue={
											chartControls.properties[propKey].legendOptions.itemGap
										}
										sliderMinMax={itemSpacingMinMax}
										changeValue={(value: number) =>
											updateLegendOption(propKey, "itemGap", value)
										}
									/>
								</>
							) : null}
						</>
					) : (
						<>
							<div className="optionDescription">Item Gap</div>
							<SliderWithInput
								sliderValue={
									chartControls.properties[propKey].legendOptions.itemGap
								}
								sliderMinMax={itemSpacingMinMax}
								changeValue={(value: number) =>
									updateLegendOption(propKey, "itemGap", value)
								}
							/>
						</>
					)}
					{chartProperties.properties[propKey].chartType === "calendar" ||
					chartProperties.properties[propKey].chartType === "heatmap" ? (
						<>
							<div className="optionDescription">Width</div>
							<SliderWithInput
								sliderValue={
									chartControls.properties[propKey].calendarStyleOptions.width
								}
								sliderMinMax={itemWidthMinMax}
								changeValue={(value: number) =>
									updateCalendarStyleOptions(propKey, "width", value)
								}
							/>
							<div className="optionDescription">Height</div>
							<SliderWithInput
								sliderValue={
									chartControls.properties[propKey].calendarStyleOptions.height
								}
								sliderMinMax={itemHeightMinMax}
								changeValue={(value: number) =>
									updateCalendarStyleOptions(propKey, "height", value)
								}
							/>
						</>
					) : (
						<>
							<div className="optionDescription">Width</div>
							<SliderWithInput
								sliderValue={
									chartControls.properties[propKey].legendOptions.symbolWidth
								}
								sliderMinMax={itemWidthMinMax}
								changeValue={(value: number) =>
									updateLegendOption(propKey, "symbolWidth", value)
								}
							/>
							<div className="optionDescription">Height</div>
							<SliderWithInput
								sliderValue={
									chartControls.properties[propKey].legendOptions.symbolHeight
								}
								sliderMinMax={itemHeightMinMax}
								changeValue={(value: number) =>
									updateLegendOption(propKey, "symbolHeight", value)
								}
							/>
						</>
					)}
				</React.Fragment>
			) : null}
		</div>
	);
};

const mapStateToProps = (state: ChartOptionsStateProps, ownprops: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProperties: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateLegendOption: (propKey: string, option: string, value: any) =>
			dispatch(updateLegendOptions(propKey, option, value)),
		updateCalendarStyleOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateCalendarStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartLegend);
