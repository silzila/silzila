import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";
import {
	ChartsMapStateToProps,
	ChartsReduxStateProps,
	FormatterValueProps,
} from "./ChartsCommonInterfaces";

const RoseChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartProperties,
	chartControls,
}: ChartsReduxStateProps) => {
	var chartControl: ChartControlsProps = chartControls.properties[propKey];
	let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];
	const [chartDataKeys, setChartDataKeys] = useState<any>([]);

	useEffect(() => {
		if (chartData.length >= 1) {
			setChartDataKeys(Object.keys(chartData[0]));
			var objKey: string;
			if (chartProperties.properties[propKey].chartAxes[1].fields[0]) {
				if ("timeGrain" in chartProperties.properties[propKey].chartAxes[1].fields[0]) {
					objKey = `${chartProperties.properties[propKey].chartAxes[1].fields[0].timeGrain} of ${chartProperties.properties[propKey].chartAxes[1].fields[0].fieldname}`;
				} else {
					objKey = chartProperties.properties[propKey].chartAxes[1].fields[0].fieldname;
				}
				/* converting dimentions value to string (specifically for when it is in a year aggregate)  */
				chartControl.chartData.map((el: any) => {
					if (objKey in el) {
						let agg = el[objKey];
						if (agg) el[objKey] = agg.toString();
						else el[objKey] = "null";
					}
					return el;
				});
			}
		}
	}, [chartData, chartControl]);
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
						overflow: "hidden",
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
								graphDimension.height > 175 && graphDimension.width > 265
									? chartControl.legendOptions?.showLegend
									: false,
							itemHeight: chartControl.legendOptions?.symbolHeight,
							itemWidth: chartControl.legendOptions?.symbolWidth,
							itemGap: chartControl.legendOptions?.itemGap,

							left: chartControl.legendOptions?.position?.left,
							top: chartControl.legendOptions?.position?.top,
							orient: chartControl.legendOptions?.orientation,
						},

						tooltip: { show: chartControl.mouseOver.enable },
						dataset: {
							dimensions: Object.keys(chartData[0]),
							source: chartData,
						},

						series: [
							{
								type: "pie",
								roseType: "area",
								startAngle: chartControl.axisOptions.pieAxisOptions.pieStartAngle,
								clockwise: chartControl.axisOptions.pieAxisOptions.clockWise,
								label: {
									position: chartControl.labelOptions.pieLabel.labelPosition,
									show:
										graphDimension.height > 100 && graphDimension.width > 220
											? chartControl.labelOptions.showLabel
											: false,
									fontSize: chartControl.labelOptions.fontSize,
									color: chartControl.labelOptions.labelColor,
									padding: [
										chartControl.labelOptions.pieLabel.labelPadding,
										chartControl.labelOptions.pieLabel.labelPadding,
										chartControl.labelOptions.pieLabel.labelPadding,
										chartControl.labelOptions.pieLabel.labelPadding,
									],

									formatter: (value: FormatterValueProps) => {
										if (chartDataKeys) {
											var formattedValue = value.value[chartDataKeys[1]];
											formattedValue = formatChartLabelValue(
												chartControl,
												formattedValue
											);
											return formattedValue;
										}
									},
								},
								itemStyle: {
									borderRadius: 5,
								},
								radius: [
									chartControl.chartMargin.innerRadius + "%",
									chartControl.chartMargin.outerRadius + "%",
								],
							},
						],
					}}
				/>
			</>
		);
	};
	return <>{chartData.length >= 1 ? <RenderChart /> : ""}</>;
};

const mapStateToProps = (state: ChartsMapStateToProps, ownProps: any) => {
	return {
		chartProperties: state.chartProperties,
		chartControls: state.chartControls,
	};
};

export default connect(mapStateToProps, null)(RoseChart);
