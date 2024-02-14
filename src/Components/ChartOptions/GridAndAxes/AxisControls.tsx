// This component provides following controls in Gauge charts
// 	- Start/End angles
// 	- Enable/Disable tick
// 	- Tick size & padding, label padding

import { TextField } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
	updateGaugeAxisOptions,
	updatePieAxisOptions,
} from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartConAxisOptions } from "../../../redux/ChartPoperties/ChartControlsInterface";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import SliderWithInput from "../SliderWithInput";
import SwitchWithInput from "../SwitchWithInput";

const textFieldStyleProps = {
	style: {
		fontSize: "12px",
		width: "90%",
		margin: "0 auto 0.5rem auto",
		backgroundColor: "white",
		height: "1.5rem",
		color: "#404040",
	},
};

interface GridControlsProps {
	updateGaugeAxisOptions: (propKey: string, option: string, value: any) => void;
	updatePieAxisOptions: (propKey: string, option: string, value: any) => void;
}
const GridControls = ({
	// state
	chartControls,
	tabTileProps,
	chartProperties,

	// dispatch
	updateGaugeAxisOptions,
	updatePieAxisOptions,
}: ChartOptionsProps & GridControlsProps) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	var property: ChartConAxisOptions = chartControls.properties[propKey].axisOptions;

	return (
		<div className="optionsInfo">
			<div className="optionDescription">Start Angle</div>
			{chartProperties.properties[propKey].chartType === "gauge" ? (
				<React.Fragment>
					<div className="optionDescription">Start Angle</div>
					<TextField
						value={property.gaugeAxisOptions.startAngle}
						variant="outlined"
						type="number"
						onChange={e => {
							updateGaugeAxisOptions(propKey, "startAngle", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>
				</React.Fragment>
			) : (
				<React.Fragment>
					{chartProperties.properties[propKey].chartType === "pie" ||
					chartProperties.properties[propKey].chartType === "donut" ||
					chartProperties.properties[propKey].chartType === "rose" ? (
						<React.Fragment>
							<TextField
								value={property.pieAxisOptions.pieStartAngle}
								variant="outlined"
								type="number"
								onChange={e => {
									updatePieAxisOptions(propKey, "pieStartAngle", e.target.value);
								}}
								InputProps={{ ...textFieldStyleProps }}
							/>
							<div
								className="optionDescription"
								style={{
									padding: "0 6% 5px 4%",
									width: " 88%",
									textAlign: "left",
									color: "rgb(96, 96, 96)",
									fontWeight: "600",
									display: "flex",
								}}
							>
								<label
									htmlFor="enableDisable"
									className="enableDisableLabel"
									style={{ marginRight: "10px" }}
								>
									ClockWise
								</label>

								<SwitchWithInput
									isChecked={property.pieAxisOptions.clockWise}
									onSwitch={() => {
										updatePieAxisOptions(
											propKey,
											"clockWise",
											!property.pieAxisOptions.clockWise
										);
									}}
								/>
							</div>
						</React.Fragment>
					) : null}
				</React.Fragment>
			)}

			{chartProperties.properties[propKey].chartType === "gauge" ? (
				<React.Fragment>
					<div className="optionDescription">End Angle</div>

					<TextField
						value={property.gaugeAxisOptions.endAngle}
						variant="outlined"
						type="number"
						onChange={e => {
							// changing value of end angle
							updateGaugeAxisOptions(propKey, "endAngle", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>

					<div className="optionDescription">
						<input
							type="checkbox"
							id="enableDisable"
							checked={property.gaugeAxisOptions.showTick}
							onChange={() => {
								updateGaugeAxisOptions(
									propKey,
									"showTick",
									!property.gaugeAxisOptions.showTick
								);
							}}
						/>
						<label htmlFor="enableDisable" className="enableDisableLabel">
							Show Tick
						</label>
					</div>
					{property.gaugeAxisOptions.showTick ? (
						<>
							<div className="optionDescription">Tick Size</div>
							<SliderWithInput
								percent={true}
								sliderValue={property.gaugeAxisOptions.tickSize}
								sliderMinMax={{ min: 0, max: 99, step: 1 }}
								changeValue={(value: number) => {
									updateGaugeAxisOptions(propKey, "tickSize", value);
								}}
							/>
							<div className="optionDescription">Tick Padding</div>
							<SliderWithInput
								percent={false}
								sliderValue={property.gaugeAxisOptions.tickPadding}
								sliderMinMax={{ min: 0, max: 90, step: 1 }}
								changeValue={(value: number) => {
									updateGaugeAxisOptions(propKey, "tickPadding", value);
								}}
							/>
						</>
					) : null}

					<div className="optionDescription">
						<input
							type="checkbox"
							id="enableDisable"
							checked={property.gaugeAxisOptions.showAxisLabel}
							onChange={() => {
								updateGaugeAxisOptions(
									propKey,
									"showAxisLabel",
									!property.gaugeAxisOptions.showAxisLabel
								);
							}}
						/>
						<label htmlFor="enableDisable" className="enableDisableLabel">
							Show Axis Label
						</label>
					</div>
					{property.gaugeAxisOptions.showAxisLabel ? (
						<>
							<div className="optionDescription">Label Padding</div>
							<SliderWithInput
								percent={false}
								sliderValue={property.gaugeAxisOptions.labelPadding}
								sliderMinMax={{ min: 0, max: 90, step: 1 }}
								changeValue={(value: number) => {
									updateGaugeAxisOptions(propKey, "labelPadding", value);
								}}
							/>
						</>
					) : null}
				</React.Fragment>
			) : null}
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
		updateGaugeAxisOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateGaugeAxisOptions(propKey, option, value)),
		updatePieAxisOptions: (propKey: string, option: string, value: any) =>
			dispatch(updatePieAxisOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GridControls);
