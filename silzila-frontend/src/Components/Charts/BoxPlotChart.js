import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
	formatChartLabelValue,
	formatChartYAxisValue,
} from "../ChartOptions/Format/NumberFormatter";

const BoxPlotChart = ({
	// props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControlState,
	chartProperty,
}) => {
	var chartControl = chartControlState.properties[propKey];

	let chartData = chartControl.chartData ? chartControl.chartData.result : "";

	const [seriesData, setSeriesData] = useState([]);
	const [dimensionData, setDimensionData] = useState([]);
	const [sourceData, setSourceData] = useState([]);
	const [categoryName, setCategoryName] = useState("");

	const axisName1 = chartControl.boxPlotChartControls.flipAxis ? "yAxis" : "xAxis";
	const axisName2 = !chartControl.boxPlotChartControls.flipAxis ? "yAxis" : "xAxis";

	useEffect(() => {
		if (chartData) {
			// console.log(chartProperty.properties[propKey]);
			if (
				chartProperty.properties[propKey].chartAxes[1].fields.length !== 0 &&
				chartProperty.properties[propKey].chartAxes[2].fields.length !== 0
			) {
				var dimValue = chartProperty.properties[propKey].chartAxes[1].fields[0].fieldname;
				// console.log(dimValue);
				// setCategoryName(dimValue);
				var dimArray = chartData.map((el) => {
					return el[dimValue];
				});
				// console.log(DimArray);
				setDimensionData([...new Set(dimArray)]);

				var measureValue = `${chartProperty.properties[propKey].chartAxes[3].fields[0].fieldname}__${chartProperty.properties[propKey].chartAxes[3].fields[0].agg}`;
				console.log(measureValue);

				var SerArray = [];

				// console.log(dimArray);

				var arrayPoints = [];

				[...new Set(dimArray)].map((el) => {
					var temp = [];
					chartData.map((elm) => {
						if (el === elm[dimValue]) {
							console.log(elm[measureValue], el);
							temp.push(elm[measureValue]);
						}
					});

					console.log(temp);
					arrayPoints.push(temp);
				});

				console.log(arrayPoints);
				setSourceData(arrayPoints);
			}
		}
	}, [chartData, chartControl]);

	console.log(dimensionData);
	console.log(sourceData);

	const RenderChart = () => {
		return (
			<ReactEcharts
				opts={{ renderer: "svg" }}
				theme={chartControl.colorScheme}
				style={{
					padding: "5px",
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
					animation: false,
					legend: {
						type: "scroll",
						show: chartControl.legendOptions?.showLegend,
						itemHeight: chartControl.legendOptions?.symbolHeight,
						itemWidth: chartControl.legendOptions?.symbolWidth,
						itemGap: chartControl.legendOptions?.itemGap,

						left: chartControl.legendOptions?.position?.left,
						top: chartControl.legendOptions?.position?.top,
						orient: chartControl.legendOptions?.orientation,
					},
					grid: {
						left: chartControl.chartMargin.left,
						right: chartControl.chartMargin.right,
						top: chartControl.chartMargin.top,
						bottom: chartControl.chartMargin.bottom,
					},

					tooltip: {
						show: chartControl.mouseOver.enable,
						trigger: "item",
						formatter: function (params) {
							// console.log(params);
							if (params.seriesName === "boxplot") {
								return `${params.name} <br/> ${params.seriesName} <br/> <table>
								<th>
								
								<tr>
								<td align="left">min &nbsp</td>
								<td align="right">${params.value[1]}</td>
								</tr>
							   
								<tr>
								<td align="left">Q1 &nbsp</td>
								<td align="right">${params.value[2]}</td>
								</tr>
					
								<tr>
								<td align="left">median &nbsp</td>
								<td align="right">${params.value[3]}</td>
								</tr>
					
								<tr>
								<td align="left">Q2 &nbsp</td>
								<td align="right">${params.value[4]}</td>
								</tr>
					
								<tr>
								<td align="left">max &nbsp</td>
								<td align="right">${params.value[5]}</td>
								</tr>
					
							   
							   
								</th>
								 </table>`;
							} else {
								return `${params.name} <br/> ${params.seriesName} <br/> ${params.value[1]}`;
							}
						},
					},

					dataset: [
						{
							source: sourceData,
						},
						{
							transform: {
								type: "boxplot",
								config: {
									itemNameFormatter: function (params) {
										return dimensionData[params.value];
									},
								},
								print: true,
							},
						},
						{
							fromDatasetIndex: 1,
							fromTransformResult: 1,
						},
					],

					[axisName1]: {
						type: "category",
						position: chartControl.axisOptions.xAxis.position,

						axisLine: {
							onZero: chartControl.axisOptions.xAxis.onZero,
						},

						show: chartControl.axisOptions.xAxis.showLabel,

						name: chartControl.axisOptions.xAxis.name,
						nameLocation: chartControl.axisOptions.xAxis.nameLocation,
						nameGap: chartControl.axisOptions.xAxis.nameGap,
						nameTextStyle: {
							fontSize: chartControl.axisOptions.xAxis.nameSize,
							color: chartControl.axisOptions.xAxis.nameColor,
						},

						axisTick: {
							alignWithLabel: true,
							length:
								chartControl.axisOptions.xAxis.position === "top"
									? chartControl.axisOptions.xAxis.tickSizeTop
									: chartControl.axisOptions.xAxis.tickSizeBottom,
						},
						axisLabel: {
							rotate:
								chartControl.axisOptions.xAxis.position === "top"
									? chartControl.axisOptions.xAxis.tickRotationTop
									: chartControl.axisOptions.xAxis.tickRotationBottom,
							margin:
								chartControl.axisOptions.xAxis.position === "top"
									? chartControl.axisOptions.xAxis.tickPaddingTop
									: chartControl.axisOptions.xAxis.tickPaddingBottom,
						},
					},
					[axisName2]: {
						type: "value",
						splitLine: {
							show: chartControl.axisOptions?.ySplitLine,
						},
						min: chartControl.axisOptions.axisMinMax.enableMin
							? chartControl.axisOptions.axisMinMax.minValue
							: null,
						max: chartControl.axisOptions.axisMinMax.enableMax
							? chartControl.axisOptions.axisMinMax.maxValue
							: null,
						inverse: chartControl.axisOptions.inverse,
						position: chartControl.axisOptions.yAxis.position,
						show: chartControl.axisOptions.yAxis.showLabel,

						name: chartControl.axisOptions.yAxis.name,
						nameLocation: chartControl.axisOptions.yAxis.nameLocation,
						nameGap: chartControl.axisOptions.yAxis.nameGap,
						nameTextStyle: {
							fontSize: chartControl.axisOptions.yAxis.nameSize,
							color: chartControl.axisOptions.yAxis.nameColor,
						},
						axisTick: {
							alignWithLabel: true,
							length:
								chartControl.axisOptions.yAxis.position === "left"
									? chartControl.axisOptions.yAxis.tickSizeLeft
									: chartControl.axisOptions.yAxis.tickSizeRight,
						},
						axisLabel: {
							rotate:
								chartControl.axisOptions.yAxis.position === "left"
									? chartControl.axisOptions.yAxis.tickRotationLeft
									: chartControl.axisOptions.yAxis.tickRotationRight,
							margin:
								chartControl.axisOptions.yAxis.position === "left"
									? chartControl.axisOptions.yAxis.tickPaddingLeft
									: chartControl.axisOptions.yAxis.tickPaddingRight,

							formatter: (value) => {
								var formattedValue = formatChartYAxisValue(chartControl, value);
								return formattedValue;
							},
						},
					},

					dataZoom: [
						{
							show: false,
							type: "slider",
							start: 0,
							end: 100,
							xAxisIndex: [0],
							top: "90%",
						},
					],
					series: [
						{
							name: "boxplot",
							type: "boxplot",
							datasetIndex: 1,
							colorBy: chartControl.boxPlotChartControls.colorBy,
							boxWidth: [
								chartControl.boxPlotChartControls.minBoxWidth,
								chartControl.boxPlotChartControls.maxBoxWidth,
							],
							itemStyle: {
								borderWidth: chartControl.boxPlotChartControls.boxborderWidth,
							},
						},
						{
							name: "outlier",
							type: "scatter",
							datasetIndex: 2,
						},
					],
				}}
			/>
		);
	};

	return <>{chartData ? <RenderChart /> : ""}</>;
};
const mapStateToProps = (state) => {
	return {
		chartControlState: state.chartControls,
		chartProperty: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(BoxPlotChart);
