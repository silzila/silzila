import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import {
	formatChartLabelValue,
	formatChartXAxisValue,
	formatChartYAxisValue,
} from "../ChartOptions/Format/NumberFormatter";
import {
	ChartsMapStateToProps,
	ChartsReduxStateProps,
	FormatterValueProps,
} from "./ChartsCommonInterfaces";

const ScatterChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControls,
}: ChartsReduxStateProps) => {
	var chartControl: ChartControlsProps = chartControls.properties[propKey];

	let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

	const [seriesData, setSeriesData] = useState<any>([]);

	useEffect(() => {
		if (chartData.length >= 1) {
			var chartDataKeys = Object.keys(chartData[0]);
			for (let i = 0; i < Object.keys(chartData[0]).length - 1; i++) {
				var seriesObj: any = {
					symbolSize: chartArea === "dashboard" ? 10 : 20,
					type: "scatter",
					encode: {
						x: chartData ? Object.keys(chartData[0])[1] : "",
						y: chartData ? Object.keys(chartData[0])[2] : "",
						tooltip: chartData ? Object.keys(chartData[0])[0] : "",
					},
					name: chartData ? Object.keys(chartData[0])[0] : "",
					label: {
						show:
							graphDimension.height > 140 && graphDimension.height > 150
								? chartControl.labelOptions.showLabel
								: false,
						fontSize: chartControl.labelOptions.fontSize,
						color: chartControl.labelOptions.labelColorManual
							? chartControl.labelOptions.labelColor
							: null,

						formatter: (value: FormatterValueProps) => {
							var formattedValue = value.value[chartDataKeys[i + 1]];

							formattedValue = formatChartLabelValue(chartControl, formattedValue);

							return formattedValue;
						},
					},
				};
			}
			setSeriesData(seriesObj);
		}
	}, [chartData, chartControl.formatOptions]);
	var chartThemes: any[] = ColorSchemes.filter(el => {
		return el.name === chartControl.colorScheme;
	});

	const RenderChart = () => {
		return (
			<>
				<ReactEcharts
					// theme={chartControl.colorScheme}
					style={{
						padding: "1rem",
						width: graphDimension.width,
						height: graphDimension.height,
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
						legend: {
							type: "scroll",
							show:
								graphDimension.height > 210
									? chartControl.legendOptions?.showLegend
									: false,
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
						tooltip: { show: chartControl.mouseOver.enable },
						dataset: {
							dimensions: Object.keys(chartData[0]),
							source: chartData,
						},
						xAxis: {
							position: chartControl.axisOptions.xAxis.position,

							min: chartControl.axisOptions.scatterChartMinMax.x_enableMin
								? chartControl.axisOptions.scatterChartMinMax.x_minValue
								: null,
							max: chartControl.axisOptions.scatterChartMinMax.x_enableMax
								? chartControl.axisOptions.scatterChartMinMax.x_maxValue
								: null,

							axisLine: {
								onZero: chartControl.axisOptions.xAxis.onZero,
							},

							show:
								graphDimension.height > 140 && graphDimension.height > 150
									? chartControl.axisOptions.xAxis.showLabel
									: false,

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

								formatter: (value: number) => {
									var formattedValue = formatChartXAxisValue(chartControl, value);
									return formattedValue;
								},
							},
						},
						yAxis: {
							position: chartControl.axisOptions.yAxis.position,

							axisLine: {
								onZero: chartControl.axisOptions.yAxis.onZero,
							},

							min: chartControl.axisOptions.scatterChartMinMax.y_enableMin
								? chartControl.axisOptions.scatterChartMinMax.y_minValue
								: null,
							max: chartControl.axisOptions.scatterChartMinMax.y_enableMax
								? chartControl.axisOptions.scatterChartMinMax.y_maxValue
								: null,

							axisTick: {
								alignWithLabel: true,
								length:
									chartControl.axisOptions.yAxis.position === "left"
										? chartControl.axisOptions.yAxis.tickSizeLeft
										: chartControl.axisOptions.yAxis.tickSizeRight,
							},

							show:
								graphDimension.height > 140 && graphDimension.height > 150
									? chartControl.axisOptions.yAxis.showLabel
									: false,

							name: chartControl.axisOptions.yAxis.name,
							nameLocation: chartControl.axisOptions.yAxis.nameLocation,
							nameGap: chartControl.axisOptions.yAxis.nameGap,
							nameTextStyle: {
								fontSize: chartControl.axisOptions.yAxis.nameSize,
								color: chartControl.axisOptions.yAxis.nameColor,
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
						series: seriesData,
					}}
				/>
			</>
		);
	};
	return <>{chartData.length >= 1 ? <RenderChart /> : ""}</>;
};

const mapStateToProps = (state: ChartsMapStateToProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
	};
};

export default connect(mapStateToProps, null)(ScatterChart);
