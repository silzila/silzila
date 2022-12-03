import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { ChartsMapStateToProps, ChartsReduxStateProps } from "./ChartsCommonInterfaces";

const CalendarChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControls,
	chartProperties,
}: ChartsReduxStateProps) => {
	// TODO: showing alert with the message of "only can drop data tatatype columns" even its a data type column
	var yearsArray: string[] | number[] | any = [];
	var uniqueYears: string[] | number[] | any = [];

	var chartControl: ChartControlsProps = chartControls.properties[propKey];

	let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

	const [calendarArray, setCalendarArray] = useState<any[]>([]);
	const [seriesArray, setSeriesArray] = useState<any[]>([]);
	const [chartDataKeys, setChartDataKeys] = useState<any[]>([]);

	useEffect(() => {
		if (chartData.length >= 1) {
			if (chartProperties.properties[propKey].chartAxes[1].fields.length > 0) {
				setChartDataKeys(Object.keys(chartData[0]));

				let objKey =
					chartProperties.properties[propKey].chartAxes[1].fields[0].fieldname +
					"__" +
					chartProperties.properties[propKey].chartAxes[1].fields[0].time_grain;

				// getting years of dates
				chartData.map((el: any) => {
					const timestampformate = new Date(el[objKey]);
					const year: number = timestampformate.getFullYear();
					yearsArray.push(JSON.stringify(year));
				});

				// getting unique values
				uniqueYears = [...new Set(yearsArray)];

				// setting props for each value
				const calendarArrayValues = uniqueYears.map((yr: string | number, i: number) => {
					return {
						top:
							i * (chartControl.chartMargin.top * 7) +
							30 +
							i * chartControl.calendarStyleOptions.calendarGap, //10 - calendar gap
						// (i*( celHeight*7)+30px) + (i*30px)
						left: chartControl.chartMargin.left,
						right: chartControl.chartMargin.right,
						// bottom: chartControl.chartMargin.bottom,
						// bottom: i * (chartControl.chartMargin.bottom * 7) + 30 + i * 30,

						range: yr,
						cellSize: ["auto", chartControl.chartMargin.top],
						splitLine: {
							show: chartControl.calendarStyleOptions.showSplitLine,
							lineStyle: {
								color: chartControl.calendarStyleOptions.splitLineColor,
								width: chartControl.calendarStyleOptions.splitLineWidth,
								type: chartControl.calendarStyleOptions.splitLineType,
							},
						},
						yearLabel: {
							show: chartControl.calendarStyleOptions.showYearLabel,
							margin: chartControl.calendarStyleOptions.yearLabelMargin,
							color: chartControl.calendarStyleOptions.yearLabelColor,
							fontSize: chartControl.calendarStyleOptions.yearLabelFontSize,
							position: chartControl.calendarStyleOptions.yearLabelPosition,
						},
						dayLabel: {
							show: chartControl.calendarStyleOptions.showDayLabel,
							margin: chartControl.calendarStyleOptions.dayLabelMargin,
							color: chartControl.calendarStyleOptions.dayLabelColor,
							fontSize: chartControl.calendarStyleOptions.dayLabelFontSize,
							position: chartControl.calendarStyleOptions.dayLabelPosition,
						},
						monthLabel: {
							show: chartControl.calendarStyleOptions.showMonthLabel,
							margin: chartControl.calendarStyleOptions.monthLabelMargin,
							color: chartControl.calendarStyleOptions.monthLabelColor,
							fontSize: chartControl.calendarStyleOptions.monthLabelFontSize,
							position: chartControl.calendarStyleOptions.monthLabelPosition,
						},
					};
				});

				setCalendarArray(calendarArrayValues);

				// setting individual year props and data

				const seriesArrayValues = uniqueYears.map((yr: string | number, index: number) => {
					return {
						type: "heatmap",

						coordinateSystem: "calendar",
						calendarIndex: index,
						data: getVirtulData(yr),
					};
				});
				setSeriesArray(seriesArrayValues);

				// console.log(calendarArray, seriesArray);
			}
		}
	}, [chartControl, chartControl.chartData]);

	function getVirtulData(year: string | number) {
		let objKey =
			chartProperties.properties[propKey].chartAxes[1].fields[0].fieldname +
			"__" +
			chartProperties.properties[propKey].chartAxes[1].fields[0].time_grain;
		var virtualData: any[] = [];

		// getting measure value as day value for individual year
		chartData.map((el: any) => {
			var elYear = new Date(el[objKey]).getFullYear();
			if (year === JSON.stringify(elYear)) {
				virtualData.push(Object.values(el));
			}
		});

		console.log(virtualData);
		return virtualData;
	}

	const RenderChart = () => {
		return (
			<ReactEcharts
				theme={chartControl.colorScheme}
				style={{
					padding: "1rem",
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
				option={{
					animation: chartArea ? false : true,
					legend: {},

					tooltip: { show: chartControl.mouseOver.enable },

					dataset: {
						source: chartData,
					},

					visualMap: {
						show: true,
						min: 200,
						max: 10000,
					},

					calendar: calendarArray,
					series: seriesArray,
				}}
			/>
		);
	};

	return chartData.length >= 1 ? <RenderChart /> : null;
};
const mapStateToProps = (state: ChartsMapStateToProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		chartProperties: state.chartProperties,
	};
};
export default connect(mapStateToProps, null)(CalendarChart);
