// This component provides following controls for style in charts
// 	- Manual/Automatic label color
// 	- Change cell font size for label
//  - Cell size
//  - Change header style

import React, { useState } from "react";
import { connect } from "react-redux";
import "./chartStyle.css";

import { SketchPicker } from "react-color";
import SliderWithInput from "../SliderWithInput";
import { FormControl, MenuItem, Popover, Select } from "@mui/material";
import { Dispatch } from "redux";
import {
	updateCrossTabCellLabelOptions,
	updateCrossTabHeaderLabelOptions,
	updateCrossTabStyleOptions,
} from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import SwitchWithInput from "../SwitchWithInput";
import { SelectComponentStyle, menuItemStyle } from "../Labels/SnakeyLabelOptions";
import { updateStyleOptions } from "../../../redux/DynamicMeasures/DynamicMeasuresActions";

const DynamicMeasureStyle = ({
	// state
	dynamicMeasureProps,

	// dispatch
	updateStyleOptions,
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

	return (
		<div className="optionsInfo">
			<div className="optionDescription">
				<label style={{ width: "40%" }}>Background Color</label>
				<div
					style={{
						height: "1.25rem",
						width: "50%",
						marginLeft: "20px",
						backgroundColor: dmProps.styleOptions.backgroundColor,
						color: dmProps.styleOptions.backgroundColor,
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
								updateStyleOptions("backgroundColor", color.hex);
							}}
							onChange={color => {
								updateStyleOptions("backgroundColor", color.hex);
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
						backgroundColor: dmProps.styleOptions.fontColor,
						color: dmProps.styleOptions.fontColor,
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
								updateStyleOptions("fontColor", color.hex);
							}}
							onChange={color => {
								updateStyleOptions("fontColor", color.hex);
							}}
							disableAlpha
						/>
					</div>
				</Popover>
			</div>
			<div className="optionDescription">Font Style</div>

			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={dmProps.styleOptions.fontStyle}
					variant="outlined"
					onChange={e => {
						updateStyleOptions("fontStyle", e.target.value);
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
		updateStyleOptions: (option: string, value: any) =>
			dispatch(updateStyleOptions(option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DynamicMeasureStyle);
