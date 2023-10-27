import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import {
	ChartDataFieldProps,
	ChartsMapStateToProps,
	ChartsReduxStateProps,
} from "./ChartsCommonInterfaces";

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

	const [maxValue, setMaxValue] = useState<number>(0);
	const [minValue, setMinValue] = useState<number>(0);

	useEffect(() => {
		if (chartData.length >= 1) {
			if (chartProperties.properties[propKey].chartAxes[1].fields.length > 0) {
				let objKey = `${chartProperties.properties[propKey].chartAxes[1].fields[0].timeGrain} of ${chartProperties.properties[propKey].chartAxes[1].fields[0].fieldname}`;

				var measureField: ChartDataFieldProps =
					chartProperties.properties[propKey].chartAxes[2].fields[0];
				if (measureField) {
					var maxFieldName: string = "";
					if ("timeGrain" in measureField) {
						maxFieldName = `${measureField.timeGrain} of ${measureField.fieldname}`;
					} else {
						maxFieldName = `${measureField.agg} of ${measureField.fieldname}`;
					}

					var max: number = 0;
					var min: number = 100000000;
					chartData.forEach((element: any) => {
						if (element[maxFieldName] > max) {
							max = element[maxFieldName];
						}
						if (element[maxFieldName] < min) {
							min = element[maxFieldName];
						}
					});
					setMaxValue(max);
					setMinValue(min);
				}

				// getting years of dates
				chartData.forEach((el: any) => {
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
							// (graphDimension.height * 20) / 100 / (uniqueYears.length - 1) +
							// ((graphDimension.height * 80) / 100 / uniqueYears.length) * i,
							i * (chartControl.chartMargin.top * 7) +
							30 +
							i * chartControl.calendarStyleOptions.calendarGap,

						left: chartControl.chartMargin.left,
						right: chartControl.chartMargin.right,
						// height: (graphDimension.height * 80) / 100 / uniqueYears.length,

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

				// //ind chart height
				// inChartHeight = (graphDimension.height * 80) / 100 / uniqueYears.length;
				// //chart gap
			}
		}
	}, [chartControl, chartControl.chartData]);

	function getVirtulData(year: string | number) {
		let objKey = `${chartProperties.properties[propKey].chartAxes[1].fields[0].timeGrain} of ${chartProperties.properties[propKey].chartAxes[1].fields[0].fieldname}`;
		var virtualData: any[] = [];

		// getting measure value as day value for individual year
		chartData.forEach((el: any) => {
			var elYear = new Date(el[objKey]).getFullYear();
			if (year === JSON.stringify(elYear)) {
				virtualData.push(Object.values(el));
			}
		});

		return virtualData;
	}

	var chartThemes: any[] = ColorSchemes.filter(el => {
		return el.name === chartControl.colorScheme;
	});
	const RenderChart = () => {
		return (
			<ReactEcharts
				// theme={chartControl.colorScheme}
				style={{
					padding: "1rem",
					width: graphDimension.width,
					height: graphDimension.height,
					// overflow:'auto',
					overflow: "hidden",
					margin: "auto",
					border: chartArea
						? "none"
						: graphTileSize
						? "none"
						: "1px solid rgb(238,238,238)",
				}}
				option={{
					color: chartThemes[0].colors,
					backgroundColor: chartThemes[0].background,
					animation: chartArea ? false : true,
					legend: {},

					tooltip: { show: chartControl.mouseOver.enable },

					dataset: {
						source: chartData,
					},

					visualMap: {
						type: chartControl.calendarStyleOptions.pieceWise ? "piecewise" : null,
						show:
							graphDimension.height > 180
								? chartData.length >= 1
									? chartControl.legendOptions?.showLegend
									: false
								: false,
						itemHeight: chartControl.calendarStyleOptions?.height,
						itemWidth: chartControl.calendarStyleOptions?.width,
						itemGap: chartControl.legendOptions?.itemGap,

						left: chartControl.legendOptions?.position?.left,
						top: chartControl.legendOptions?.position?.top,
						orient: chartControl.calendarStyleOptions?.orientation,
						min:
							chartControl.colorScale.colorScaleType === "Manual"
								? chartControl.colorScale.min !== parseInt("")
									? chartControl.colorScale.min
									: 0
								: minValue,
						max:
							chartControl.colorScale.colorScaleType === "Manual"
								? chartControl.colorScale.max !== parseInt("")
									? chartControl.colorScale.max
									: 0
								: maxValue,

						inRange: {
							color: [
								chartControl.colorScale.minColor,
								chartControl.colorScale.maxColor,
							],
						},
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
