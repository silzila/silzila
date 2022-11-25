import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
	ChartControlsProps,
	ChartControlStateProps,
} from "../../redux/ChartPoperties/ChartControlsInterface";
import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";
import { ChartsReduxStateProps } from "./ChartsCommonInterfaces";

const FunnelChart = ({
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

	const [newData, setNewData] = useState<any[]>([]);

	useEffect(() => {
		if (chartData) {
			var newData: any[] = [];
			Object.keys(chartData[0]).map(key => {
				newData.push({
					name: key,
					value: chartData[0][key],
				});
			});
			setNewData(newData);
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
					dataset: {
						source: newData,
					},

					series: [
						{
							type: "funnel",
							label: {
								show: chartControl.labelOptions.showLabel,
								fontSize: chartControl.labelOptions.fontSize,
								color: chartControl.labelOptions.labelColorManual
									? chartControl.labelOptions.labelColor
									: null,
								formatter: (value: any) => {
									var formattedValue = value.value.value;
									formattedValue = formatChartLabelValue(
										chartControl,
										formattedValue
									);
									return formattedValue;
								},
							},
							top: chartControl.chartMargin.top + "%",
							bottom: chartControl.chartMargin.bottom + "%",
							left: chartControl.chartMargin.funnelLeft + "%",
							right: chartControl.chartMargin.funnelRight + "%",
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

export default connect(mapStateToProps, null)(FunnelChart);
