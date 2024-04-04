import { connect } from "react-redux";
import { useState } from "react";
import "./chartStyle.css";
import { SketchPicker } from "react-color";
import SliderWithInput from "../SliderWithInput";
import { TextField, InputBase } from "@mui/material";
import SwitchWithInput from "../SwitchWithInput";
import { Dispatch } from "redux";
import { updateGeoChartStyleOptions } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import { ChartConGeoChartControls } from "../../../redux/ChartPoperties/ChartControlsInterface";
import { FormControl, MenuItem, Popover, Select } from "@mui/material";

// import CSS from "csstype";

const textFieldInputProps = {
	style: {
		height: "2rem",
		flex: 1,
		padding: "4px 8px 2px 8px",
		width: "4rem",
		fontSize: "14px",
	},
};

const inputBaseStyle = {
	border: "2px solid rgba(224,224,224,1)",
	borderRadius: "3px",
	height: "20px",
	fontSize: "12px",
	padding: "0px 4px",
	color: "#a7a7a7",
};

interface GeoChartAction {
	updateGeoChartStyleOptions: (propKey: string, option: string, value: any) => void;
}

const GeoChartStyles = ({
	// state
	chartControls,
	tabTileProps,

	// dispatch
	updateGeoChartStyleOptions,
}: ChartOptionsProps & GeoChartAction) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var geoStyle: ChartConGeoChartControls =
		chartControls.properties[propKey].geoChartControls || {};
	const [isColorPopoverOpen, setColorPopOverOpen] = useState(false);
	const [color, setColor] = useState<string>("");
	const [colorFieldName, setColorFieldName] = useState<string>("");




	return (
		<div className="optionsInfo">		
			
			<div className="optionDescription">Map Zoom</div>
			<SliderWithInput
				percent={false}
				sliderValue={geoStyle.mapZoom}
				sliderMinMax={{ min: 1, max: 5, step: 0.1 }}
				changeValue={value => updateGeoChartStyleOptions(propKey, "mapZoom", value)}
			/>

			<div className="optionDescription">Aspect Scale</div>
			<SliderWithInput
				percent={false}
				sliderValue={geoStyle.aspectScale}
				sliderMinMax={{ min: 0.5, max: 3, step: 0.05 }}
				changeValue={value => updateGeoChartStyleOptions(propKey, "aspectScale", value)}
			/>

			<div className="optionDescription">Border Width</div>
			<SliderWithInput
				percent={false}
				sliderValue={geoStyle.boderWidth}
				sliderMinMax={{ min: 1, max: 10, step: 0.5 }}
				changeValue={value => updateGeoChartStyleOptions(propKey, "boderWidth", value)}
			/>		

			<div className="optionDescription">
				<div style={{width: "50%",}}>
				Border Color 
				</div>				
				<div
					style={{
						height: "1.25rem",
						width: "50%",
						marginLeft: "20px",
						backgroundColor: geoStyle.borderColor,
						color: geoStyle.borderColor,
						border: "2px solid darkgray",
						margin: "auto",
					}}
					onClick={() => {
						setColor(geoStyle.borderColor);
						setColorFieldName("borderColor");
						setColorPopOverOpen(!isColorPopoverOpen);
					}}
				>
					{"  "}
				</div>
			</div>

			<div className="optionDescription">			
				<div style={{width: "50%",}}>
				Area Color 
				</div>	
				<div
					style={{
						height: "1.25rem",
						width: "50%",
						marginLeft: "20px",
						backgroundColor: geoStyle.areaColor,
						color: geoStyle.areaColor,
						border: "2px solid darkgray",
						margin: "auto",
					}}
					onClick={() => {
						setColor(geoStyle.areaColor);
						setColorFieldName("areaColor");
						setColorPopOverOpen(!isColorPopoverOpen);
					}}
				>
					{"  "}
				</div>
			</div>

			<div className="optionDescription">EMPHASIS on MOUSEOVER:</div>
			<div className="optionDescription">
				<div style={{width: "50%",}}>
					Area Color 
				</div>	
				
				<div
					style={{
						height: "1.25rem",
						width: "50%",
						marginLeft: "20px",
						backgroundColor: geoStyle.emphasisAreaColor,
						color: geoStyle.emphasisAreaColor,
						border: "2px solid darkgray",
						margin: "auto",
					}}
					onClick={() => {
						setColor(geoStyle.emphasisAreaColor);
						setColorFieldName("emphasisAreaColor");
						setColorPopOverOpen(!isColorPopoverOpen);
					}}
				>
					{"  "}
				</div>
			</div>
			<div className="optionDescription">
				<div style={{ width: "50%", height: "1.25rem",}}>Blur Others</div>
				<div style={{ width: "50%", height: "1.25rem", }}>
					<SwitchWithInput

						isChecked={geoStyle.enableSelfEmphasis}
						onSwitch={() => {
							updateGeoChartStyleOptions(propKey, "enableSelfEmphasis", !geoStyle.enableSelfEmphasis)
						}}
					/>
				</div>
			</div>			

			<div className="optionDescription">VISUAL SCALE:</div>	
			<div className="optionDescription">
			<div style={{ width: "50%", height: "1.25rem", }}>Show Scale</div>
			<div style={{ width: "50%",height: "1.25rem", }}>
			<SwitchWithInput
				isChecked={geoStyle.showVisualScale}
				onSwitch={() => {
					updateGeoChartStyleOptions(propKey, "showVisualScale", !geoStyle.showVisualScale)
				}}
			/>
			</div>
			</div>
		

		<div className="optionDescription">Min</div>
		<div className="optionDescription">
			<InputBase
				style={{height: "1.25rem",width: "35%",}}
				value={geoStyle.minValue}
				onChange={(e: any) => {
					updateGeoChartStyleOptions(propKey, "minValue",e.target.value)
				}}
				sx={inputBaseStyle}
				placeholder={"Enter Min Value"}
			/>
		
			<div
				style={{
					height: "1.25rem",
					width: "50%",
					marginLeft: "20px",
					backgroundColor: geoStyle.minColor,
					color: geoStyle.minColor,
					border: "2px solid darkgray",
					margin: "auto",
				}}
				onClick={() => {
					setColor(geoStyle.minColor);
					setColorFieldName("minColor");
					setColorPopOverOpen(!isColorPopoverOpen);
				}}
			>
				{"  "}
			</div>
		</div>
		<div className="optionDescription">Max</div>
		<div className="optionDescription">
			<InputBase
				style={{height: "1.25rem",width: "35%",}}
				value={geoStyle.maxValue}
				onChange={(e: any) => {
					updateGeoChartStyleOptions(propKey, "maxValue",e.target.value)
				}}
				sx={inputBaseStyle}
				placeholder={"Enter Max Value"}
			/>
		
			<div
				style={{
					height: "1.25rem",
					width: "50%",
					marginLeft: "20px",
					backgroundColor: geoStyle.maxColor,
					color: geoStyle.maxColor,
					border: "2px solid darkgray",
					margin: "auto",
				}}
				onClick={() => {
					setColor(geoStyle.maxColor);
					setColorFieldName("maxColor");
					setColorPopOverOpen(!isColorPopoverOpen);
				}}
			>
				{"  "}
			</div>
		</div>
				
			
			<Popover
				open={isColorPopoverOpen}
				onClose={() => setColorPopOverOpen(false)}
				onClick={() => setColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={color}
						className="sketchPicker"
						width="16rem"
						onChangeComplete={color => {
							updateGeoChartStyleOptions(propKey, colorFieldName, color.hex);
						}}
						onChange={color =>
							updateGeoChartStyleOptions(propKey, colorFieldName, color.hex)
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
		updateGeoChartStyleOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateGeoChartStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GeoChartStyles);
