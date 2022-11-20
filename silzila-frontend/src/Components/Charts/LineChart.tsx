// import ReactEcharts from "echarts-for-react";
// import { useEffect, useState } from "react";
// import { connect } from "react-redux";
// import {
// 	formatChartLabelValue,
// 	formatChartYAxisValue,
// } from "../ChartOptions/Format/NumberFormatter";

// const LineChart = ({
// 	//props
// 	propKey,
// 	graphDimension,
// 	chartArea,
// 	graphTileSize,

// 	//state
// 	chartProp,
// 	chartControls,
// }) => {
// 	var chartControl = chartControls.properties[propKey];

// 	let chartData = chartControl.chartData ? chartControl.chartData.result : "";

// 	const [seriesData, setSeriesData] = useState([]);

// 	useEffect(() => {
// 		var seriesDataTemp = [];
// 		if (chartData) {
// 			var chartDataKeys = Object.keys(chartData[0]);
// 			for (let i = 0; i < Object.keys(chartData[0]).length - 1; i++) {
// 				var seriesObj = {
// 					type: "line",
// 					label: {
// 						show: chartControl.labelOptions.showLabel,
// 						fontSize: chartControl.labelOptions.fontSize,
// 						color: chartControl.labelOptions.labelColorManual
// 							? chartControl.labelOptions.labelColor
// 							: null,

// 						formatter: value => {
// 							var formattedValue = value.value[chartDataKeys[i + 1]];
// 							var formattedValue = formatChartLabelValue(
// 								chartControl,
// 								formattedValue
// 							);

// 							return formattedValue;
// 						},
// 					},
// 				};
// 				seriesDataTemp.push(seriesObj);
// 			}
// 			setSeriesData(seriesDataTemp);
// 		}
// 	}, [chartData, chartControl]);

// 	const RenderChart = () => {
// 		return (
// 			<ReactEcharts
// 				theme={chartControl.colorScheme}
// 				style={{
// 					padding: "1rem",
// 					width: graphDimension.width,
// 					height: graphDimension.height,
// 					overflow: "hidden",
// 					margin: "auto",
// 					border: chartArea
// 						? "none"
// 						: graphTileSize
// 						? "none"
// 						: "1px solid rgb(238,238,238)",
// 				}}
// 				option={{
// 					animation: chartArea ? false : true,
// 					legend: {
// 						type: "scroll",
// 						show: chartControl.legendOptions?.showLegend,
// 						itemHeight: chartControl.legendOptions?.symbolHeight,
// 						itemWidth: chartControl.legendOptions?.symbolWidth,
// 						itemGap: chartControl.legendOptions?.itemGap,

// 						left: chartControl.legendOptions?.position?.left,
// 						top: chartControl.legendOptions?.position?.top,
// 						orient: chartControl.legendOptions?.orientation,
// 					},
// 					grid: {
// 						left: chartControl.chartMargin.left + "%",
// 						right: chartControl.chartMargin.right + "%",
// 						top: chartControl.chartMargin.top + "%",
// 						bottom: chartControl.chartMargin.bottom + "%",
// 					},

// 					tooltip: { show: chartControl.mouseOver.enable },
// 					dataset: {
// 						dimensions: Object.keys(chartData[0]),
// 						source: chartData,
// 					},
// 					xAxis: {
// 						type: "category",
// 						position: chartControl.axisOptions.xAxis.position,

// 						axisLine: {
// 							onZero: chartControl.axisOptions.xAxis.onZero,
// 						},

// 						axisTick: {
// 							alignWithLabel: true,
// 							length:
// 								chartControl.axisOptions.xAxis.position === "top"
// 									? chartControl.axisOptions.xAxis.tickSizeTop
// 									: chartControl.axisOptions.xAxis.tickSizeBottom,
// 						},
// 						axisLabel: {
// 							rotate:
// 								chartControl.axisOptions.xAxis.position === "top"
// 									? chartControl.axisOptions.xAxis.tickRotationTop
// 									: chartControl.axisOptions.xAxis.tickRotationBottom,
// 							margin:
// 								chartControl.axisOptions.xAxis.position === "top"
// 									? chartControl.axisOptions.xAxis.tickPaddingTop
// 									: chartControl.axisOptions.xAxis.tickPaddingBottom,
// 						},

// 						show: chartControl.axisOptions.xAxis.showLabel,

// 						name: chartControl.axisOptions.xAxis.name,
// 						nameLocation: chartControl.axisOptions.xAxis.nameLocation,
// 						nameGap: chartControl.axisOptions.xAxis.nameGap,
// 						nameTextStyle: {
// 							fontSize: chartControl.axisOptions.xAxis.nameSize,
// 							color: chartControl.axisOptions.xAxis.nameColor,
// 						},
// 					},

// 					yAxis: {
// 						type: "value",
// 						inverse: chartControl.axisOptions.inverse,

// 						position: chartControl.axisOptions.yAxis.position,

// 						show: chartControl.axisOptions.yAxis.showLabel,

// 						name: chartControl.axisOptions.yAxis.name,
// 						nameLocation: chartControl.axisOptions.yAxis.nameLocation,
// 						nameGap: chartControl.axisOptions.yAxis.nameGap,
// 						nameTextStyle: {
// 							fontSize: chartControl.axisOptions.yAxis.nameSize,
// 							color: chartControl.axisOptions.yAxis.nameColor,
// 						},

// 						axisLine: {
// 							onZero: chartControl.axisOptions.yAxis.onZero,
// 						},

// 						min: chartControl.axisOptions.axisMinMax.enableMin
// 							? chartControl.axisOptions.axisMinMax.minValue
// 							: null,
// 						max: chartControl.axisOptions.axisMinMax.enableMax
// 							? chartControl.axisOptions.axisMinMax.maxValue
// 							: null,

// 						axisTick: {
// 							alignWithLabel: true,
// 							length:
// 								chartControl.axisOptions.yAxis.position === "left"
// 									? chartControl.axisOptions.yAxis.tickSizeLeft
// 									: chartControl.axisOptions.yAxis.tickSizeRight,
// 						},

// 						axisLabel: {
// 							rotate:
// 								chartControl.axisOptions.yAxis.position === "left"
// 									? chartControl.axisOptions.yAxis.tickRotationLeft
// 									: chartControl.axisOptions.yAxis.tickRotationRight,
// 							margin:
// 								chartControl.axisOptions.yAxis.position === "left"
// 									? chartControl.axisOptions.yAxis.tickPaddingLeft
// 									: chartControl.axisOptions.yAxis.tickPaddingRight,

// 							formatter: value => {
// 								var formattedValue = formatChartYAxisValue(chartControl, value);
// 								return formattedValue;
// 							},
// 						},
// 					},
// 					series: seriesData,
// 				}}
// 			/>
// 		);
// 	};

// 	return <>{chartData ? <RenderChart /> : ""}</>;
// };
// const mapStateToProps = state => {
// 	return {
// 		chartProp: state.chartProperties,
// 		chartControls: state.chartControls,
// 	};
// };

// export default connect(mapStateToProps, null)(LineChart);
import React from "react";

const LineChart = () => {
	return <div>LineChart</div>;
};

export default LineChart;
