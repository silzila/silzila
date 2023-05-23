import React, { useState } from "react";
import { connect } from "react-redux";
import { SketchPicker } from "react-color";
import { FormControl, MenuItem, Popover, Select } from "@mui/material";
import { Dispatch } from "redux";
import { updateConditionalFormatStyleOptions } from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import { SelectComponentStyle, menuItemStyle } from "./Labels/SnakeyLabelOptions";
import SwitchWithInput from "./SwitchWithInput";
import { TextField } from "@mui/material";
import { textFieldStyleProps } from "./GridAndAxes/GridAndAxes";

const DynamicMeasureConditionalFormating = ({
	// state
	dynamicMeasureProps,

	// dispatch
	updateConditionalFormatStyleOptions,
}: any) => {
	var dmProps =
		dynamicMeasureProps.dynamicMeasureProps[`${dynamicMeasureProps.selectedTabId}`]?.[
			`${dynamicMeasureProps.selectedTileId}`
		]?.[
			`${dynamicMeasureProps.selectedTileId}.${dynamicMeasureProps.selectedDynamicMeasureId}`
		];

	const fontStyle: string[] = ["italic", "oblique", "normal"];

	const [isFontColorPopoverOpen, setFontColorPopOverOpen] = useState<boolean>(false);
	const [isbgColorPopoverOpen, setbgColorPopOverOpen] = useState<boolean>(false);

	const conditionTypes = [
		{ id: 1, type: "Greater than" },
		{ id: 2, type: "Between" },
		{ id: 3, type: "Less than" },
	];

	const getInputField = () => {
		switch (dmProps.conditionalFormatStyleOptions.conditionType) {
			case 1:
			case 3:
				return (
					<>
						<div className="optionDescription">Target Value</div>

						<TextField
							value={dmProps?.conditionalFormatStyleOptions.target}
							variant="outlined"
							type="number"
							onChange={e => {
								updateConditionalFormatStyleOptions("target", e.target.value);
							}}
							InputProps={{ ...textFieldStyleProps }}
						/>
					</>
				);
			case 2:
				return (
					<>
						<div className="optionDescription">Min Value</div>

						<TextField
							value={dmProps?.conditionalFormatStyleOptions.minValue}
							variant="outlined"
							type="number"
							onChange={e => {
								updateConditionalFormatStyleOptions("minValue", e.target.value);
							}}
							InputProps={{ ...textFieldStyleProps }}
						/>
						<div className="optionDescription">Max Value</div>

						<TextField
							value={dmProps?.conditionalFormatStyleOptions.maxValue}
							variant="outlined"
							type="number"
							onChange={e => {
								e.preventDefault();
								updateConditionalFormatStyleOptions("maxValue", e.target.value);
							}}
							InputProps={{ ...textFieldStyleProps }}
						/>
					</>
				);
		}
	};

	return (
		<div className="optionsInfo">
			<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					Enable Conditional Formatting
				</label>
				<SwitchWithInput
					isChecked={dmProps.conditionalFormatStyleOptions.enableConditionalFormatting}
					onSwitch={() => {
						updateConditionalFormatStyleOptions(
							"enableConditionalFormatting",
							!dmProps.conditionalFormatStyleOptions.enableConditionalFormatting
						);
					}}
				/>
			</div>
			{dmProps.conditionalFormatStyleOptions.enableConditionalFormatting ? (
				<>
					<div className="optionDescription">Condition</div>
					<FormControl
						fullWidth
						size="small"
						style={{ fontSize: "12px", borderRadius: "4px" }}
					>
						<Select
							value={dmProps.conditionalFormatStyleOptions.conditionType}
							variant="outlined"
							onChange={e => {
								updateConditionalFormatStyleOptions(
									"conditionType",
									e.target.value
								);
							}}
							sx={SelectComponentStyle}
						>
							{conditionTypes.map((item: any) => {
								return (
									<MenuItem
										value={item.id}
										key={item.id}
										sx={{ textTransform: "capitalize", ...menuItemStyle }}
									>
										{item.type}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
					{getInputField()}

					<div className="optionDescription">
						<label style={{ width: "40%" }}>Background Color</label>
						<div
							style={{
								height: "1.25rem",
								width: "50%",
								marginLeft: "20px",
								backgroundColor:
									dmProps.conditionalFormatStyleOptions.backgroundColor,
								color: dmProps.conditionalFormatStyleOptions.backgroundColor,
								border: "2px solid darkgray",
								margin: "auto",
							}}
							onClick={() => {
								setbgColorPopOverOpen(!isbgColorPopoverOpen);
							}}
						></div>
						<Popover
							open={isbgColorPopoverOpen}
							onClose={() => setbgColorPopOverOpen(false)}
							onClick={() => setbgColorPopOverOpen(false)}
							anchorReference="anchorPosition"
							anchorPosition={{ top: 350, left: 1300 }}
						>
							<div>
								<SketchPicker
									className="sketchPicker"
									width="16rem"
									onChangeComplete={color => {
										updateConditionalFormatStyleOptions(
											"backgroundColor",
											color.hex
										);
									}}
									onChange={color => {
										updateConditionalFormatStyleOptions(
											"backgroundColor",
											color.hex
										);
									}}
									disableAlpha
								/>
							</div>
						</Popover>
					</div>

					<div className="optionDescription">
						<label style={{ width: "40%" }}>Font Color</label>
						<div
							style={{
								height: "1.25rem",
								width: "50%",
								marginLeft: "20px",
								backgroundColor: dmProps.conditionalFormatStyleOptions.fontColor,
								color: dmProps.conditionalFormatStyleOptions.fontColor,
								border: "2px solid darkgray",
								margin: "auto",
							}}
							onClick={() => {
								setFontColorPopOverOpen(!isFontColorPopoverOpen);
							}}
						></div>
						<Popover
							open={isFontColorPopoverOpen}
							onClose={() => setFontColorPopOverOpen(false)}
							onClick={() => setFontColorPopOverOpen(false)}
							anchorReference="anchorPosition"
							anchorPosition={{ top: 350, left: 1300 }}
						>
							<div>
								<SketchPicker
									className="sketchPicker"
									width="16rem"
									onChangeComplete={color => {
										updateConditionalFormatStyleOptions("fontColor", color.hex);
									}}
									onChange={color => {
										updateConditionalFormatStyleOptions("fontColor", color.hex);
									}}
									disableAlpha
								/>
							</div>
						</Popover>
					</div>
					<div className="optionDescription">Font Style</div>

					<FormControl
						fullWidth
						size="small"
						style={{ fontSize: "12px", borderRadius: "4px" }}
					>
						<Select
							value={dmProps.conditionalFormatStyleOptions.fontStyle}
							variant="outlined"
							onChange={e => {
								updateConditionalFormatStyleOptions("fontStyle", e.target.value);
							}}
							sx={SelectComponentStyle}
						>
							{fontStyle.map((item: string) => {
								return (
									<MenuItem
										value={item}
										key={item}
										sx={{ textTransform: "capitalize", ...menuItemStyle }}
									>
										{item}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</>
			) : null}
		</div>
	);
};
const mapStateToProps = (state: any, ownProps: any) => {
	return {
		dynamicMeasureProps: state.dynamicMeasuresState,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateConditionalFormatStyleOptions: (option: string, value: any) =>
			dispatch(updateConditionalFormatStyleOptions(option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DynamicMeasureConditionalFormating);
