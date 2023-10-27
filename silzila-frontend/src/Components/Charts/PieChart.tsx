import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";
import { Dispatch } from "redux";
import { updateChartMargins } from "../../redux/ChartPoperties/ChartControlsActions";
import {
	ChartsMapStateToProps,
	ChartsReduxStateProps,
	FormatterValueProps,
} from "./ChartsCommonInterfaces";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";

interface PieChartProps {
	updateChartMargins: (propKey: string, option: string, value: any) => void;
}
const PieChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartProperties,
	chartControls,

	// dispatch
	updateChartMargins,
}: ChartsReduxStateProps & PieChartProps) => {
	var chartControl: ChartControlsProps = chartControls.properties[propKey];
	let chartData: any[] =
		chartControl.chartData && chartControl.chartData.length > 0 ? chartControl.chartData : [];

	const [chartDataKeys, setChartDataKeys] = useState<string[]>([]);
	var chartThemes: any[];

	useEffect(() => {
		if (chartData.length >= 1) {
			if (typeof chartData === "object" && chartData.length > 0) {
				setChartDataKeys(Object.keys(chartData[0]));
			}

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
					}
					return el;
				});
			}
		}
	}, [chartData, chartControl]);

	chartThemes = ColorSchemes.filter(el => {
		return el.name === chartControl.colorScheme;
	});

	var radius: number = chartControl.chartMargin.radius;
	useEffect(() => {
		if (radius > 100) {
			updateChartMargins(propKey, "radius", 100);
			radius = 100;
		}
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
						//  chartArea ? false : true,
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
							dimensions: chartDataKeys,
							source: chartData,
						},

						series: [
							{
								type: "pie",
								startAngle: chartControl.axisOptions.pieAxisOptions.pieStartAngle,
								clockwise: chartControl.axisOptions.pieAxisOptions.clockWise,
								label: {
									position: chartControl.labelOptions.pieLabel.labelPosition,
									show:
										graphDimension.height > 100 && graphDimension.width > 220
											? chartControl.labelOptions.showLabel
											: false,
									fontSize: chartControl.labelOptions.fontSize,
									color: chartControl.labelOptions.labelColorManual
										? chartControl.labelOptions.labelColor
										: null,
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
								radius: radius + "%",
							},
						],
					}}
				/>
			</>
		);
	};
	return <>{chartData.length >= 1 ? <RenderChart /> : ""}</>;
};

const mapStateToProps = (state: ChartsMapStateToProps) => {
	return {
		chartProperties: state.chartProperties,
		chartControls: state.chartControls,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateChartMargins: (propKey: string, option: string, value: any) =>
			dispatch(updateChartMargins(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PieChart);
