import { useState } from "react";
import { connect } from "react-redux";
import "./chartLabels.css";
import { FormControl, MenuItem, Popover, Select } from "@mui/material";
import SliderWithInput from "../SliderWithInput";
import { ColorResult, SketchPicker } from "react-color";
import SwitchWithInput from "../SwitchWithInput";
import { Dispatch } from "redux";
import { updateCalendarStyleOptions } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";

const CalendarLabels = ({
	// state
	chartControls,
	tabTileProps,

	//dispatch
	updateCalendarStyleOptions,
}: ChartOptionsProps & {
	updateCalendarStyleOptions: (propKey: string, option: string, value: any) => void;
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var calStyle = chartControls.properties[propKey].calendarStyleOptions;
	const [isColorPopoverOpen, setColorPopOverOpen] = useState<boolean>(false);
	const [colorPickerFor, setColorPickerFor] = useState<string>("");

	return (
		<div className="optionsInfo">
			<div className="optionDescription">YEAR LABEL</div>
			<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					Show Year Label
				</label>
				<SwitchWithInput
					isChecked={calStyle.showYearLabel}
					onSwitch={() => {
						updateCalendarStyleOptions(
							propKey,
							"showYearLabel",
							!calStyle.showYearLabel
						);
					}}
				/>
			</div>
			{calStyle.showYearLabel ? (
				<>
					<div className="optionDescription">Label Margin</div>
					<SliderWithInput
						percent={false}
						sliderValue={calStyle.yearLabelMargin}
						sliderMinMax={{ min: 0, max: 60, step: 1 }}
						changeValue={(value: number) =>
							updateCalendarStyleOptions(propKey, "yearLabelMargin", value)
						}
					/>
					<div className="optionDescription">Label Position</div>
					<FormControl
						fullWidth
						size="small"
						style={{ fontSize: "12px", borderRadius: "4px" }}
					>
						<Select
							value={calStyle.yearLabelPosition}
							variant="outlined"
							onChange={e => {
								updateCalendarStyleOptions(
									propKey,
									"yearLabelPosition",
									e.target.value
								);
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
							<MenuItem value="top" sx={{ padding: "2px 10px", fontSize: "12px" }}>
								Top
							</MenuItem>
							<MenuItem value="bottom" sx={{ padding: "2px 10px", fontSize: "12px" }}>
								Bottom
							</MenuItem>
							<MenuItem value="right" sx={{ padding: "2px 10px", fontSize: "12px" }}>
								Right
							</MenuItem>
							<MenuItem value="left" sx={{ padding: "2px 10px", fontSize: "12px" }}>
								Left
							</MenuItem>
						</Select>
					</FormControl>
					<div className="optionDescription">
						Color
						<div
							style={{
								height: "1.25rem",
								width: "50%",
								marginLeft: "20px",
								backgroundColor: calStyle.yearLabelColor,
								color: calStyle.yearLabelColor,
								border: "2px solid darkgray",
								margin: "auto",
							}}
							onClick={e => {
								setColorPopOverOpen(!isColorPopoverOpen);
								setColorPickerFor("yearLabelColor");
							}}
						>
							{"  "}
						</div>
					</div>

					<div className="optionDescription">Label Font Size</div>
					<SliderWithInput
						percent={false}
						sliderValue={calStyle.yearLabelFontSize}
						sliderMinMax={{ min: 0, max: 60, step: 1 }}
						changeValue={(value: any) =>
							updateCalendarStyleOptions(propKey, "yearLabelFontSize", value)
						}
					/>
				</>
			) : null}
			<div
				style={{ borderTop: "1px solid rgb(211,211,211)", margin: "0.5rem 6% 0.5rem" }}
			></div>
			<div className="optionDescription">MONTH LABEL</div>

			<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					Show Month Label
				</label>
				<SwitchWithInput
					isChecked={calStyle.showMonthLabel}
					onSwitch={() => {
						updateCalendarStyleOptions(
							propKey,
							"showMonthLabel",
							!calStyle.showMonthLabel
						);
					}}
				/>
			</div>

			{calStyle.showMonthLabel ? (
				<>
					<div className="optionDescription">Label Margin</div>
					<SliderWithInput
						percent={false}
						sliderValue={calStyle.monthLabelMargin}
						sliderMinMax={{ min: 0, max: 60, step: 1 }}
						changeValue={(value: any) =>
							updateCalendarStyleOptions(propKey, "monthLabelMargin", value)
						}
					/>
					<div className="optionDescription">Label Position</div>
					<FormControl
						fullWidth
						size="small"
						style={{ fontSize: "12px", borderRadius: "4px" }}
					>
						<Select
							value={calStyle.monthLabelPosition}
							variant="outlined"
							onChange={e => {
								updateCalendarStyleOptions(
									propKey,
									"monthLabelPosition",
									e.target.value
								);
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
							<MenuItem value="start" sx={{ padding: "2px 10px", fontSize: "12px" }}>
								Start
							</MenuItem>
							<MenuItem value="end" sx={{ padding: "2px 10px", fontSize: "12px" }}>
								End
							</MenuItem>
						</Select>
					</FormControl>
					<div className="optionDescription">
						Color
						<div
							style={{
								height: "1.25rem",
								width: "50%",
								marginLeft: "20px",
								backgroundColor: calStyle.monthLabelColor,
								color: calStyle.monthLabelColor,
								border: "2px solid darkgray",
								margin: "auto",
							}}
							onClick={() => {
								setColorPopOverOpen(!isColorPopoverOpen);
								setColorPickerFor("monthLabelColor");
							}}
						>
							{"  "}
						</div>
					</div>

					<div className="optionDescription">Label Font Size</div>
					<SliderWithInput
						percent={false}
						sliderValue={calStyle.monthLabelFontSize}
						sliderMinMax={{ min: 0, max: 60, step: 1 }}
						changeValue={(value: number) =>
							updateCalendarStyleOptions(propKey, "monthLabelFontSize", value)
						}
					/>
				</>
			) : null}
			<div
				style={{ borderTop: "1px solid rgb(211,211,211)", margin: "0.5rem 6% 0.5rem" }}
			></div>
			<div className="optionDescription">DAY LABEL</div>

			<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					Show Day Label
				</label>
				<SwitchWithInput
					isChecked={calStyle.showDayLabel}
					onSwitch={() => {
						updateCalendarStyleOptions(propKey, "showDayLabel", !calStyle.showDayLabel);
					}}
				/>
			</div>
			{calStyle.showDayLabel ? (
				<>
					<div className="optionDescription">Label Margin</div>
					<SliderWithInput
						percent={false}
						sliderValue={calStyle.dayLabelMargin}
						sliderMinMax={{ min: 0, max: 60, step: 1 }}
						changeValue={(value: number) =>
							updateCalendarStyleOptions(propKey, "dayLabelMargin", value)
						}
					/>
					<div className="optionDescription">Label Position</div>
					<FormControl
						fullWidth
						size="small"
						style={{ fontSize: "12px", borderRadius: "4px" }}
					>
						<Select
							value={calStyle.dayLabelPosition}
							variant="outlined"
							onChange={e => {
								updateCalendarStyleOptions(
									propKey,
									"dayLabelPosition",
									e.target.value
								);
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
							<MenuItem value="start" sx={{ padding: "2px 10px", fontSize: "12px" }}>
								Start
							</MenuItem>
							<MenuItem value="end" sx={{ padding: "2px 10px", fontSize: "12px" }}>
								End
							</MenuItem>
						</Select>
					</FormControl>

					<div className="optionDescription">
						Color
						<div
							style={{
								height: "1.25rem",
								width: "50%",
								marginLeft: "20px",
								backgroundColor: calStyle.dayLabelColor,
								color: calStyle.dayLabelColor,
								border: "2px solid darkgray",
								margin: "auto",
							}}
							onClick={() => {
								setColorPopOverOpen(!isColorPopoverOpen);
								setColorPickerFor("dayLabelColor");
							}}
						>
							{"  "}
						</div>
					</div>

					<div className="optionDescription">Label Font Size</div>
					<SliderWithInput
						percent={false}
						sliderValue={calStyle.dayLabelFontSize}
						sliderMinMax={{ min: 0, max: 60, step: 1 }}
						changeValue={value =>
							updateCalendarStyleOptions(propKey, "dayLabelFontSize", value)
						}
					/>
				</>
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
						// color={calStyle[colorPickerFor]}
						className="sketchPicker"
						width="16rem"
						// styles={{ padding: "0" }}
						onChangeComplete={(color: ColorResult) => {
							updateCalendarStyleOptions(propKey, colorPickerFor, color.hex);
						}}
						onChange={(color: ColorResult) =>
							updateCalendarStyleOptions(propKey, colorPickerFor, color.hex)
						}
						disableAlpha
					/>
				</div>
			</Popover>
		</div>
	);
};
const mapStateToProps = (state: ChartOptionsStateProps, ownprops: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateCalendarStyleOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateCalendarStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarLabels);
