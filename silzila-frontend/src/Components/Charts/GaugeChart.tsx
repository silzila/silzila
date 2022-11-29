import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
	ChartControlsProps,
	ChartControlStateProps,
} from "../../redux/ChartPoperties/ChartControlsInterface";
import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";
import { ChartsReduxStateProps } from "./ChartsCommonInterfaces";

const GaugeChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControls,
}: ChartsReduxStateProps) => {
	var chartControl: ChartControlsProps = chartControls.properties[propKey];
	let chartData: any = chartControl.chartData ? chartControl.chartData.result : "";
	const [newData, setNewData] = useState<any>([]);

	var carr: any = [];

	const getColors = () => {
		for (let i = 0; i < chartControl.axisOptions.gaugeChartControls.stepcolor.length; i++) {
			carr.push([
				chartControl.axisOptions.gaugeChartControls.stepcolor[i].per,
				chartControl.axisOptions.gaugeChartControls.stepcolor[i].color,
			]);
		}
	};

	getColors();

	useEffect(() => {
		if (chartData) {
			var newTempData: any[] = [];
			Object.keys(chartData[0]).map(key => {
				newTempData.push({
					name: key,
					value: chartData[0][key],
				});
			});
			setNewData(newTempData);
		}
	}, [chartData]);

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
					legend: {
						type: "scroll",
						show: chartControl.legendOptions?.showLegend,
						itemHeight:
							chartArea === "dashboard"
								? chartControl.legendOptions?.symbolHeight / 2
								: chartControl.legendOptions?.symbolHeight,
						itemWidth:
							chartArea === "dashboard"
								? chartControl.legendOptions?.symbolWidth / 2
								: chartControl.legendOptions?.symbolWidth,
						itemGap: chartControl.legendOptions?.itemGap,

						left: chartControl.legendOptions?.position?.left,
						top: chartControl.legendOptions?.position?.top,
						orient: chartControl.legendOptions?.orientation,
					},
					tooltip: { show: chartControl.mouseOver.enable },

					series: [
						{
							type: "gauge",
							radius: chartControl.chartMargin.radius + "%",

							max: newData[0]
								? chartControl.axisOptions.gaugeAxisOptions.isMaxAuto
									? newData[0].value * 2
									: chartControl.axisOptions.gaugeAxisOptions.max
								: 0,

							min: chartControl.axisOptions.gaugeAxisOptions.min,

							data: newData,

							axisLine: {
								lineStyle: {
									width: 10,
									color: [...carr],
								},

								roundCap: true,
							},
							pointer: {
								itemStyle: {
									color: "auto",
								},
							},
							startAngle: chartControl.axisOptions.gaugeAxisOptions.startAngle,
							endAngle: chartControl.axisOptions.gaugeAxisOptions.endAngle,
							axisTick: {
								show: chartControl.axisOptions.gaugeAxisOptions.showTick,
								length: chartControl.axisOptions.gaugeAxisOptions.tickSize,
								distance: chartControl.axisOptions.gaugeAxisOptions.tickPadding,
							},
							detail: {
								formatter: (value: any) => {
									var formattedValue = value;
									formattedValue = formatChartLabelValue(
										chartControl,
										formattedValue
									);
									return formattedValue;
								},
							},
							axisLabel: {
								show: chartControl.axisOptions.gaugeAxisOptions.showAxisLabel,
								distance: chartControl.axisOptions.gaugeAxisOptions.labelPadding,
								formatter: (value: any) => {
									var formattedValue = value;
									formattedValue = formatChartLabelValue(
										chartControl,
										formattedValue
									);
									return formattedValue;
								},
							},
						},
					],
				}}
			/>
		);
	};

	return chartData ? <RenderChart /> : null;
};

const mapStateToProps = (state: ChartControlStateProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
	};
};

export default connect(mapStateToProps, null)(GaugeChart);
