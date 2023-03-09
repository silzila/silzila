import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
	ChartControlsProps,
	ChartControlStateProps,
} from "../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";
import { ChartsReduxStateProps, FormatterValueProps } from "./ChartsCommonInterfaces";

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
	let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

	const [funnelChartData, setFunnelChartData] = useState<any[]>([]);

	useEffect(() => {
		if (chartData.length >= 1) {
			var funnelChartData: any[] = [];
			Object.keys(chartData[0]).map((key: string) => {
				funnelChartData.push({
					name: key,
					value: chartData[0][key],
				});
			});
			setFunnelChartData(funnelChartData);
		}
	}, [chartData]);
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
					legend: {
						type: "scroll",
						show:
							graphDimension.height > 130
								? chartControl.legendOptions?.showLegend
								: false,
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
						source: funnelChartData,
					},

					series: [
						{
							type: "funnel",
							label: {
								show:
									graphDimension.height > 140 && graphDimension.width > 150
										? chartControl.labelOptions.showLabel
										: false,
								fontSize: chartControl.labelOptions.fontSize,
								color: chartControl.labelOptions.labelColorManual
									? chartControl.labelOptions.labelColor
									: null,
								formatter: (value: FormatterValueProps) => {
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

	return chartData.length >= 1 ? <RenderChart /> : null;
};
const mapStateToProps = (state: ChartControlStateProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
	};
};

export default connect(mapStateToProps, null)(FunnelChart);
