import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import { formatChartYAxisValue } from "../ChartOptions/Format/NumberFormatter";
import { ChartsMapStateToProps, ChartsReduxStateProps } from "./ChartsCommonInterfaces";

const BoxPlotChart = ({
	// props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControls,
	chartProperties,
}: ChartsReduxStateProps) => {
	var chartControl: ChartControlsProps = chartControls.properties[propKey];

	let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

	const [dimensionData, setDimensionData] = useState<string[]>([]);
	const [sourceData, setSourceData] = useState<any[]>([]);

	// to track  the axis swap and assign axis name accordingly
	const axisName1: string = chartControl.boxPlotChartControls.flipAxis ? "yAxis" : "xAxis";
	const axisName2: string = !chartControl.boxPlotChartControls.flipAxis ? "yAxis" : "xAxis";
	var minimumValueOfYaxis: number;
	var maximumValueOfYaxis: number;

	useEffect(() => {
		if (chartData.length >= 1) {
			// distribution value
			var dimValue: string = "";

			if (chartProperties.properties[propKey].chartAxes[1].fields.length > 0) {
				//if switched to boxplot from other charts without dimension value
				if ("timeGrain" in chartProperties.properties[propKey].chartAxes[1].fields[0]) {
					dimValue = `${chartProperties.properties[propKey].chartAxes[1].fields[0].timeGrain} of ${chartProperties.properties[propKey].chartAxes[1].fields[0].fieldname}`;
				} else {
					dimValue = `${chartProperties.properties[propKey].chartAxes[1].fields[0].fieldname}`;
				}
				var dimArray: string[] = chartData.map((el: any) => {
					return el[dimValue];
				});

				setDimensionData([...new Set(dimArray)]);

				var measureValue = `${chartProperties.properties[propKey].chartAxes[3].fields[0].agg} of ${chartProperties.properties[propKey].chartAxes[3].fields[0].fieldname}`;

				var allMeasureValue: number[] = [];
				allMeasureValue = chartData.map(el => {
					return el[measureValue];
				});

				minimumValueOfYaxis = Math.min(...allMeasureValue);
				maximumValueOfYaxis = Math.max(...allMeasureValue);

				var arrayPoints: any[] = [];

				// getting array points
				[...new Set(dimArray)].map((el: string) => {
					var temp: string[] = [];

					chartData.map((elm: any) => {
						if (el === elm[dimValue]) {
							temp.push(elm[measureValue]);
						}
					});
					arrayPoints.push(temp);
				});

				setSourceData(arrayPoints);
			}
		}
	}, [chartData, chartControl]);

	var chartThemes: any[] = ColorSchemes.filter(el => {
		return el.name === chartControl.colorScheme;
	});
	const RenderChart = () => {
		return (
			<ReactEcharts
				opts={{ renderer: "svg" }}
				// theme={chartControl.colorScheme}
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
					color: chartThemes[0].colors,
					backgroundColor: chartThemes[0].background,
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
						left: chartControl.chartMargin.left + "%",
						right: chartControl.chartMargin.right + "%",
						top: chartControl.chartMargin.top + "%",
						bottom: chartControl.chartMargin.bottom + "%",
					},

					tooltip: {
						show: chartControl.mouseOver.enable,
						trigger: "item",
						// just formating data to shown in tooltiop in required formate
						formatter: function (params: any) {
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
								//to  show dimension value as axes value
								config: {
									itemNameFormatter: function (params: any) {
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
							: minimumValueOfYaxis,
						max: chartControl.axisOptions.axisMinMax.enableMax
							? chartControl.axisOptions.axisMinMax.maxValue
							: maximumValueOfYaxis,
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

							formatter: (value: number) => {
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

	return <>{chartData.length >= 1 ? <RenderChart /> : ""}</>;
};
const mapStateToProps = (state: ChartsMapStateToProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		chartProperties: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(BoxPlotChart);
