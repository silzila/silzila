// import ReactEcharts from "echarts-for-react";
// import React, { useEffect, useState } from "react";
// import { connect } from "react-redux";
// import { updateChartMargins } from "../../redux/ChartProperties/actionsChartControls";
// import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";

// const GaugeChart = ({
// 	//props
// 	propKey,
// 	graphDimension,
// 	chartArea,

// 	//state
// 	chartControls,
// 	graphTileSize,

// 	//dispatch
// 	updateChartMargins,
// }) => {
// 	var chartControl = chartControls.properties[propKey];
// 	let chartData = chartControl.chartData ? chartControl.chartData.result : "";
// 	const [newData, setNewData] = useState([]);

// 	var carr = [];

// 	const getColors = () => {
// 		for (let i = 0; i < chartControl.axisOptions.gaugeChartControls.stepcolor.length; i++) {
// 			carr.push([
// 				parseFloat(chartControl.axisOptions.gaugeChartControls.stepcolor[i].per),
// 				chartControl.axisOptions.gaugeChartControls.stepcolor[i].color,
// 			]);
// 		}
// 	};

// 	getColors();

// 	useEffect(() => {
// 		if (chartData) {
// 			var newTempData = [];
// 			Object.keys(chartData[0]).map((key) => {
// 				newTempData.push({
// 					name: key,
// 					value: chartData[0][key],
// 				});
// 			});
// 			setNewData(newTempData);
// 		}
// 	}, [chartData]);

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
// 						itemHeight:
// 							chartArea === "dashboard"
// 								? chartControl.legendOptions?.symbolHeight / 2
// 								: chartControl.legendOptions?.symbolHeight,
// 						itemWidth:
// 							chartArea === "dashboard"
// 								? chartControl.legendOptions?.symbolWidth / 2
// 								: chartControl.legendOptions?.symbolWidth,
// 						itemGap: chartControl.legendOptions?.itemGap,

// 						left: chartControl.legendOptions?.position?.left,
// 						top: chartControl.legendOptions?.position?.top,
// 						orient: chartControl.legendOptions?.orientation,
// 					},
// 					tooltip: { show: chartControl.mouseOver.enable },

// 					series: [
// 						{
// 							type: "gauge",
// 							radius: chartControl.chartMargin.radius + "%",

// 							max: newData[0]
// 								? chartControl.axisOptions.gaugeAxisOptions.isMaxAuto
// 									? newData[0].value * 2
// 									: parseInt(chartControl.axisOptions.gaugeAxisOptions.max)
// 								: 0,

// 							min: chartControl.axisOptions.gaugeAxisOptions.min,

// 							data: newData,

// 							axisLine: {
// 								lineStyle: {
// 									width: 10,
// 									color: [...carr],
// 								},

// 								roundCap: true,
// 							},
// 							pointer: {
// 								itemStyle: {
// 									color: "auto",
// 								},
// 							},
// 							startAngle: chartControl.axisOptions.gaugeAxisOptions.startAngle,
// 							endAngle: chartControl.axisOptions.gaugeAxisOptions.endAngle,
// 							axisTick: {
// 								show: chartControl.axisOptions.gaugeAxisOptions.showTick,
// 								length: chartControl.axisOptions.gaugeAxisOptions.tickSize,
// 								distance: chartControl.axisOptions.gaugeAxisOptions.tickPadding,
// 							},
// 							detail: {
// 								formatter: (value) => {
// 									var formattedValue = value;
// 									formattedValue = formatChartLabelValue(
// 										chartControl,
// 										formattedValue
// 									);
// 									return formattedValue;
// 								},
// 							},
// 							axisLabel: {
// 								show: chartControl.axisOptions.gaugeAxisOptions.showAxisLabel,
// 								distance: chartControl.axisOptions.gaugeAxisOptions.labelPadding,
// 								formatter: (value) => {
// 									var formattedValue = value;
// 									formattedValue = formatChartLabelValue(
// 										chartControl,
// 										formattedValue
// 									);
// 									return formattedValue;
// 								},
// 							},
// 						},
// 					],
// 				}}
// 			/>
// 		);
// 	};

// 	return chartData ? <RenderChart /> : null;
// };

// const mapStateToProps = (state) => {
// 	return {
// 		chartControls: state.chartControls,
// 	};
// };

// const mapDispatchToProps = (dispatch) => {
// 	return {
// 		updateChartMargins: (propKey, option, value) =>
// 			dispatch(updateChartMargins(propKey, option, value)),
// 	};
// };

// export default connect(mapStateToProps, mapDispatchToProps)(GaugeChart);
import React from "react";

const GaugeChart = () => {
	return <div>GaugeChart</div>;
};

export default GaugeChart;
