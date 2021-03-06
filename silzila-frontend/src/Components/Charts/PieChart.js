import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";
import { updateChartMargins } from "../../redux/ChartProperties/actionsChartControls";

const PieChart = ({
	//props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartProp,
	chartControls,

	// dispatch
	updateChartMargins,
}) => {
	var chartControl = chartControls.properties[propKey];
	let chartData = chartControl.chartData ? chartControl.chartData.result : "";
	const [chartDataKeys, setChartDataKeys] = useState([]);

	useEffect(() => {
		if (chartControl.chartData) {
			setChartDataKeys(Object.keys(chartData[0]));

			var objKey;
			if (chartProp.properties[propKey].chartAxes[1].fields[0]) {
				if ("time_grain" in chartProp.properties[propKey].chartAxes[1].fields[0]) {
					objKey =
						chartProp.properties[propKey].chartAxes[1].fields[0].fieldname +
						"__" +
						chartProp.properties[propKey].chartAxes[1].fields[0].time_grain;
				} else {
					objKey = chartProp.properties[propKey].chartAxes[1].fields[0].fieldname;
				}
				chartControl.chartData.result.map((el) => {
					if (objKey in el) {
						let agg = el[objKey];
						//console.log(agg);
						if (agg) el[objKey] = agg.toString();
					}
					return el;
				});
				//console.log(chartControl.chartData.result);
			}
		}
	}, [chartData, chartControl]);

	//console.log(chartData);

	var radius = chartControl.chartMargin.radius;
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
						animation: false,
						//  chartArea ? false : true,
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

						tooltip: { show: chartControl.mouseOver.enable },
						dataset: {
							dimensions: Object.keys(chartData[0]),
							source: chartData,
						},

						series: [
							{
								type: "pie",
								startAngle: chartControl.axisOptions.pieAxisOptions.pieStartAngle,
								clockwise: chartControl.axisOptions.pieAxisOptions.clockWise,
								label: {
									position: chartControl.labelOptions.pieLabel.labelPosition,
									show: chartControl.labelOptions.showLabel,
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

									formatter: (value) => {
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
	return <>{chartData ? <RenderChart /> : ""}</>;
};

const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
		chartControls: state.chartControls,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateChartMargins: (propKey, option, value) =>
			dispatch(updateChartMargins(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PieChart);
