// import ReactEcharts from "echarts-for-react";
// import { useEffect, useState } from "react";
// import { connect } from "react-redux";
// import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";
// import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
// import * as echarts from "echarts";

// const CalendarChart = ({
// 	//props
// 	propKey,
// 	graphDimension,
// 	chartArea,
// 	graphTileSize,

// 	//state
// 	chartControls,
// 	chartProperty,
// }) => {
// 	var yearsArray = [];
// 	var uniqueYears = [];

// 	var chartControl = chartControls.properties[propKey];

// 	let chartData = chartControl.chartData ? chartControl.chartData.result : "";

// 	const [calendarArray, setCalendarArray] = useState([]);
// 	const [seriesArray, setSeriesArray] = useState([]);
// 	const [chartDataKeys, setChartDataKeys] = useState([]);

// 	useEffect(() => {
// 		if (chartData) {
// 			if (chartProperty.properties[propKey].chartAxes[1].fields.length > 0) {
// 				setChartDataKeys(Object.keys(chartData[0]));

// 				let objKey =
// 					chartProperty.properties[propKey].chartAxes[1].fields[0].fieldname +
// 					"__" +
// 					chartProperty.properties[propKey].chartAxes[1].fields[0].time_grain;

// 				// getting years of dates
// 				chartData.map(el => {
// 					const timestampformate = new Date(el[objKey]);
// 					const year = timestampformate.getFullYear();
// 					yearsArray.push(JSON.stringify(year));
// 				});

// 				// getting unique values
// 				uniqueYears = [...new Set(yearsArray)];

// 				// setting props for each value
// 				const calendarArrayValues = uniqueYears.map((yr, i) => {
// 					return {
// 						top:
// 							i * (chartControl.chartMargin.top * 7) +
// 							30 +
// 							i * chartControl.calendarStyleOptions.calendarGap, //10 - calendar gap
// 						// (i*( celHeight*7)+30px) + (i*30px)
// 						left: chartControl.chartMargin.left,
// 						right: chartControl.chartMargin.right,
// 						// bottom: chartControl.chartMargin.bottom,
// 						// bottom: i * (chartControl.chartMargin.bottom * 7) + 30 + i * 30,

// 						range: yr,
// 						cellSize: ["auto", chartControl.chartMargin.top],
// 						splitLine: {
// 							show: chartControl.calendarStyleOptions.showSplitLine,
// 							lineStyle: {
// 								color: chartControl.calendarStyleOptions.splitLineColor,
// 								width: chartControl.calendarStyleOptions.splitLineWidth,
// 								type: chartControl.calendarStyleOptions.splitLineType,
// 							},
// 						},
// 						yearLabel: {
// 							show: chartControl.calendarStyleOptions.showYearLabel,
// 							margin: chartControl.calendarStyleOptions.yearLabelMargin,
// 							color: chartControl.calendarStyleOptions.yearLabelColor,
// 							fontSize: chartControl.calendarStyleOptions.yearLabelFontSize,
// 							position: chartControl.calendarStyleOptions.yearLabelPosition,
// 						},
// 						dayLabel: {
// 							show: chartControl.calendarStyleOptions.showDayLabel,
// 							margin: chartControl.calendarStyleOptions.dayLabelMargin,
// 							color: chartControl.calendarStyleOptions.dayLabelColor,
// 							fontSize: chartControl.calendarStyleOptions.daylabelFontSize,
// 							position: chartControl.calendarStyleOptions.dayLabelPosition,
// 						},
// 						monthLabel: {
// 							show: chartControl.calendarStyleOptions.showMonthLabel,
// 							margin: chartControl.calendarStyleOptions.monthLabelMargin,
// 							color: chartControl.calendarStyleOptions.monthLabelColor,
// 							fontSize: chartControl.calendarStyleOptions.monthLabelFontSize,
// 							position: chartControl.calendarStyleOptions.monthLabelPosition,
// 						},
// 					};
// 				});

// 				setCalendarArray(calendarArrayValues);

// 				// setting individual year props and data

// 				const seriesArrayValues = uniqueYears.map((yr, index) => {
// 					return {
// 						type: "heatmap",

// 						coordinateSystem: "calendar",
// 						calendarIndex: index,
// 						data: getVirtulData(yr),
// 					};
// 				});
// 				setSeriesArray(seriesArrayValues);

// 				// console.log(calendarArray, seriesArray);
// 			}
// 		}
// 	}, [chartControl, chartControl.chartData]);

// 	function getVirtulData(year) {
// 		let objKey =
// 			chartProperty.properties[propKey].chartAxes[1].fields[0].fieldname +
// 			"__" +
// 			chartProperty.properties[propKey].chartAxes[1].fields[0].time_grain;
// 		var virtualData = [];

// 		// getting measure value as day value for individual year
// 		chartData.map(el => {
// 			var elYear = new Date(el[objKey]).getFullYear();
// 			if (year === JSON.stringify(elYear)) {
// 				virtualData.push(Object.values(el));
// 			}
// 		});

// 		console.log(virtualData);
// 		return virtualData;
// 	}

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
// 					legend: {},

// 					tooltip: { show: chartControl.mouseOver.enable },

// 					dataset: {
// 						source: chartData,
// 					},

// 					visualMap: {
// 						show: true,
// 						min: 200,
// 						max: 10000,
// 					},

// 					calendar: calendarArray,
// 					series: seriesArray,
// 				}}
// 			/>
// 		);
// 	};

// 	return chartData ? <RenderChart /> : null;
// };
// const mapStateToProps = state => {
// 	return {
// 		chartControls: state.chartControls,
// 		chartProperty: state.chartProperties,
// 	};
// };
// export default connect(mapStateToProps, null)(CalendarChart);
import React from "react";

const CalendarChart = () => {
	return <div>CalendarChart</div>;
};

export default CalendarChart;
