import ReactEcharts from "echarts-for-react";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import {
	formatChartLabelValue,
	formatChartYAxisValue,
} from "../ChartOptions/Format/NumberFormatter";
import {
	ChartsMapStateToProps,
	ChartsReduxStateProps,
	FormatterValueProps,
} from "./ChartsCommonInterfaces";
import { TabTileStateProps2 } from "../../redux/TabTile/TabTilePropsInterfaces";

const MultiBarChart = ({
	// props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControls,
	tabTileProps,
}: ChartsReduxStateProps & TabTileStateProps2) => {
	var chartControl: ChartControlsProps = chartControls.properties[propKey];
	let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

	const [seriesData, setSeriesData] = useState<any[]>([]);

	useEffect(() => {
		var seriesDataTemp: any = [];
		if (chartData.length >= 1) {
			var chartDataKeys: string[] = Object.keys(chartData[0]);

			for (let i = 0; i < Object.keys(chartData[0]).length - 1; i++) {
				var seriesObj: any = {
					type: "bar",
					stack: "",
					emphasis: {
						focus: "series",
					},
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

				seriesDataTemp.push(seriesObj);
			}
			setSeriesData(seriesDataTemp);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chartData, chartControl]);
	var chartThemes: any[] = ColorSchemes.filter(el => {
		return el.name === chartControl.colorScheme;
	});
	console.log(graphDimension);

	const getHeightAndWidth = () => {
		var height = 0;
		var width = 0;
		console.log(graphDimension);
		if (
			graphDimension.height > 230 &&
			graphDimension.width > 350 &&
			graphDimension.height < 300
		) {
			height = 12;
			width = 12;
		} else {
			height = 15;
			width = 15;
		}
		return { height: height, width: width };
	};

	const RenderChart = () => {
		return chartData ? (
			<ReactEcharts
				opts={{ renderer: "svg" }}
				// theme={chartControl.colorScheme}
				style={{
					padding: "5px",
					width: graphDimension.width,
					height: graphDimension.height,
					overflow: "scroll",
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
						show:
							graphDimension.height > 220
								? chartControl.legendOptions?.showLegend
								: false,
						itemHeight: tabTileProps.showDash
							? getHeightAndWidth().height
							: chartControl.legendOptions?.symbolHeight,
						itemWidth: tabTileProps.showDash
							? getHeightAndWidth().width
							: chartControl.legendOptions?.symbolWidth,

						itemGap: chartControl.legendOptions?.itemGap,

						// left: chartControl.legendOptions?.position?.left,
						left: "50%",
						// top: chartControl.legendOptions?.position?.top,
						top: tabTileProps.showDash ? "95%" : "90%",
						orient: chartControl.legendOptions?.orientation,
					},
					grid: {
						left: chartControl.chartMargin.left + "%",
						right: chartControl.chartMargin.right + "%",
						top: chartControl.chartMargin.top + "%",
						bottom: chartControl.chartMargin.bottom + "%",
						height: tabTileProps.showDash
							? graphDimension.height < 220
								? "70%"
								: "85%"
							: " auto",
					},

					tooltip: { show: chartControl.mouseOver.enable },

					dataset: {
						dimensions: Object.keys(chartData[0]),
						source: chartData,
					},
					xAxis: {
						splitLine: {
							show: chartControl.axisOptions?.xSplitLine,
						},
						type: "category",
						position: chartControl.axisOptions.xAxis.position,

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
						},
					},
					yAxis: {
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

						axisLine: {
							onZero: chartControl.axisOptions.yAxis.onZero,
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
					},
					series: seriesData,
				}}
			/>
		) : null;
	};

	return <>{chartData.length >= 1 ? <RenderChart /> : ""}</>;
};
const mapStateToProps = (state: ChartsMapStateToProps & TabTileStateProps2, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

export default connect(mapStateToProps, null)(MultiBarChart);
