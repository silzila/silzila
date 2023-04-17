import { connect } from "react-redux";
import "./chartStyle.css";
import SliderWithInput from "../SliderWithInput";
import { FormControl, MenuItem, Popover, Select, TextField } from "@mui/material";
import SwitchWithInput from "../SwitchWithInput";
import { Dispatch } from "redux";
import { updateCardControls } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import { ChartConBoxPlotChartControls } from "../../../redux/ChartPoperties/ChartControlsInterface";
import { useState } from "react";
import { ColorResult, SketchPicker } from "react-color";
import { SelectComponentStyle, menuItemStyle } from "../Labels/SnakeyLabelOptions";

const textFieldInputProps = {
	style: {
		height: "2rem",
		flex: 1,
		padding: "4px 8px 2px 8px",
		width: "4rem",
		fontSize: "14px",
	},
};

interface CardStyle {
	updateCardControls: (propKey: string, option: string, value: any) => void;
}

const CardStyle = ({
	// state
	chartControls,
	tabTileProps,

	// dispatch
	updateCardControls,
}: ChartOptionsProps & CardStyle) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var cardStyleOptions: any = chartControls.properties[propKey].cardControls;
	const [colorPopoveropen, setColorPopOverOpen] = useState<boolean>(false);

	const borderStyle: string[] = ["dashed", "solid", "dotted", "double", "groove", "ridge"];
	const fontStyle: string[] = ["italic", "oblique", "normal"];

	return (
		<div className="optionsInfo">
			<div className="optionDescription">Font Size</div>
			<SliderWithInput
				percent={false}
				sliderValue={cardStyleOptions.fontSize}
				sliderMinMax={{ min: 20, max: 100, step: 1 }}
				changeValue={value => {
					updateCardControls(propKey, "fontSize", value);
				}}
			/>
			<div className="optionDescription">Label Font Size</div>
			<SliderWithInput
				percent={false}
				sliderValue={cardStyleOptions.subtextFontSize}
				sliderMinMax={{ min: 10, max: 70, step: 1 }}
				changeValue={value => updateCardControls(propKey, "subtextFontSize", value)}
			/>
			<div className="optionDescription">Width</div>
			<SliderWithInput
				percent={false}
				sliderValue={cardStyleOptions.width}
				sliderMinMax={{ min: 250, max: 1000, step: 1 }}
				changeValue={(value: any) => {
					updateCardControls(propKey, "width", value);
				}}
			/>
			<div className="optionDescription">Height</div>
			<SliderWithInput
				percent={false}
				sliderValue={cardStyleOptions.height}
				sliderMinMax={{ min: 250, max: 400, step: 1 }}
				changeValue={(value: any) => updateCardControls(propKey, "height", value)}
			/>
			<div className="optionDescription">Border Tickness</div>
			<SliderWithInput
				percent={false}
				sliderValue={cardStyleOptions.borderTickness}
				sliderMinMax={{ min: 1, max: 50, step: 1 }}
				changeValue={value => {
					updateCardControls(propKey, "borderTickness", value);
				}}
			/>
			<div className="optionDescription">Border Radius</div>
			<SliderWithInput
				percent={false}
				sliderValue={cardStyleOptions.borderRadius}
				sliderMinMax={{ min: 0, max: 100, step: 1 }}
				changeValue={value => {
					updateCardControls(propKey, "borderRadius", value);
				}}
			/>
			<div className="optionDescription">Border Style</div>

			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={cardStyleOptions.dashStyle}
					variant="outlined"
					onChange={e => {
						updateCardControls(propKey, "dashStyle", e.target.value);
					}}
					sx={SelectComponentStyle}
				>
					{borderStyle.map((item: string) => {
						return (
							<MenuItem value={item} key={item} sx={menuItemStyle}>
								{item}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
			<div className="optionDescription">Font Style</div>

			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={cardStyleOptions.fontStyle}
					variant="outlined"
					onChange={e => {
						updateCardControls(propKey, "fontStyle", e.target.value);
					}}
					sx={SelectComponentStyle}
				>
					{fontStyle.map((item: string) => {
						return (
							<MenuItem value={item} key={item} sx={menuItemStyle}>
								{item}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
			<div className="optionDescription">
				Border Color
				<div
					style={{
						height: "1.25rem",
						width: "50%",
						marginLeft: "20px",
						backgroundColor: cardStyleOptions.borderColor,
						color: cardStyleOptions.borderColor,
						border: "2px solid darkgray",
						margin: "auto",
					}}
					onClick={() => {
						setColorPopOverOpen(!colorPopoveropen);
					}}
				>
					{"  "}
				</div>
			</div>
			<Popover
				open={colorPopoveropen}
				onClose={() => setColorPopOverOpen(false)}
				onClick={() => setColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						className="sketchPicker"
						width="16rem"
						onChangeComplete={(color: ColorResult) => {
							updateCardControls(propKey, "borderColor", color.hex);
						}}
						onChange={(color: ColorResult) =>
							updateCardControls(propKey, "borderColor", color.hex)
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
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateCardControls: (propKey: string, option: string, value: string | number) =>
			dispatch(updateCardControls(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CardStyle);
