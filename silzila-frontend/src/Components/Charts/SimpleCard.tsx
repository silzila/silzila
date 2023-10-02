import React, { useState, useEffect, useRef } from "react";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { connect } from "react-redux";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";
import { ChartsReduxStateProps } from "./ChartsCommonInterfaces";
import Draggable from "react-draggable";
import { Card, CardContent, Tooltip, Typography } from "@mui/material";
import { Dispatch } from "redux";
import { updateCardControls } from "../../redux/ChartPoperties/ChartControlsActions";
import { TextField } from "@mui/material";
import { Rnd } from "react-rnd";
const SimpleCard = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControls,
	chartProperties,

	//dispatch
	updateCardControls,
}: ChartsReduxStateProps & any) => {
	var chartType = chartProperties.properties[propKey].chartType;
	var chartControl: ChartControlsProps = chartControls.properties[propKey];
	let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

	const [cardData, setCardData] = useState<any[]>([]);

	useEffect(() => {
		if (chartData.length >= 1) {
			setCardData(chartData[0][Object.keys(chartData[0])[0]]);
			updateCardControls(propKey, "subText", Object.keys(chartData[0])[0]);
		}
	}, [chartData]);

	const getFormatedChartData = () => {
		var formattedValue = cardData;
		formattedValue = formatChartLabelValue(chartControl, formattedValue);
		return formattedValue;
	};
	var chartThemes: any[] = ColorSchemes.filter(el => {
		return el.name === chartControl.colorScheme;
	});

	const RenderChart = () => {
		return (
			<div
				style={{
					width: graphDimension.width,
					height: graphDimension.height,
					overflow: "hidden",
					margin: "auto",
					border: chartArea
						? "none"
						: graphTileSize
						? "none"
						: "1px solid rgb(238,238,238)",
				}}
			>
				<div
					style={{
						display: "flex",
						justifyContent: "center",
						alignContent: "center",
						height: "100%",
					}}
				>
					<div
						style={{
							margin: "auto",
							border: `${chartControl.cardControls.borderTickness}px ${chartControl.cardControls.dashStyle} ${chartControl.cardControls.borderColor}`,
							borderRadius: `${chartControl.cardControls.borderRadius}px`,
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignContent: "center",
							backgroundColor: chartThemes[0].background,
							height: `${chartControl.cardControls.height}px`,
							width: `${chartControl.cardControls.width}px`,
							overflow: "hidden",
							fontStyle: ` ${chartControl.cardControls.fontStyle}`,
						}}
					>
						{chartData.length >= 1 ? (
							<>
								<Rnd
									disableResizing={true}
									disableDragging={chartArea === "dashboard" ? true : false}
									bounds="parent"
									position={chartControl.cardControls.mainTextPos}
									onDragStop={(e, d) => {
										updateCardControls(propKey, "mainTextPos", {
											x: d.x,
											y: d.y,
										});
									}}
									style={{
										overflow: "hidden",
									}}
								>
									<p
										title="Drag to change position"
										style={{
											cursor: "move",
											fontSize: `${chartControl.cardControls.fontSize}px`,
											color: chartThemes[0].colors[0],
											margin: "5px",
										}}
									>
										{getFormatedChartData()}
									</p>
								</Rnd>
								<Rnd
									disableResizing={true}
									disableDragging={chartArea === "dashboard" ? true : false}
									bounds="parent"
									position={chartControl.cardControls.subTextPos}
									onDragStop={(e, d) => {
										updateCardControls(propKey, "subTextPos", {
											x: d.x,
											y: d.y,
										});
									}}
								>
									<p
										title="Drag to change position"
										style={{
											cursor: "move",
											fontSize: `${chartControl.cardControls.subtextFontSize}px`,
											color: chartThemes[0].colors[1],
											margin: "5px",
										}}
									>
										{chartControls.properties[propKey].cardControls.subText}
									</p>
								</Rnd>
							</>
						) : null}
					</div>
				</div>
			</div>
		);
	};

	return <RenderChart />;
};
const mapStateToProps = (state: any, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		chartProperties: state.chartProperties,
	};
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateCardControls: (propKey: string, option: string, value: any) =>
			dispatch(updateCardControls(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SimpleCard);
{
	/* <span
									style={{
										fontSize: `${chartControl.cardControls.fontSize}px`,
										color: chartThemes[0].colors[0],
									}}
								>
									{getFormatedChartData()}
								</span>
								<span
									style={{
										fontSize: `${chartControl.cardControls.subtextFontSize}px`,
										color: chartThemes[0].colors[1],
									}}
								>
									{Object.keys(chartData[0])[0]}
								</span> */
}
