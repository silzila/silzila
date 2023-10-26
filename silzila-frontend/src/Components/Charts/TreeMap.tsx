import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import * as echarts from "echarts";
import { Dispatch } from "redux";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { updateTreeMapStyleOptions } from "../../redux/ChartPoperties/ChartControlsActions";
import { ChartsMapStateToProps, ChartsReduxStateProps } from "./ChartsCommonInterfaces";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import Logger from "../../Logger";
interface TreemapChartProps {
	updateTreeMapStyleOptions: (propKey: string, option: string, value: any) => void;
}
const Treemap = ({
	// props
	propKey,
	graphDimension,
	chartArea,
	graphTileSize,

	//state
	chartControls,
	chartProperties,

	//dispatch
	updateTreeMapStyleOptions,
}: ChartsReduxStateProps & TreemapChartProps) => {
	var chartControl: ChartControlsProps = chartControls.properties[propKey];

	let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];
	const [sourceData, setsourceData] = useState<any>([]);

	var dimensionsKeys: string[] | any = [];
	var measure: string = "";
	const formatUtil = echarts.format;

	const getRecursiveData = ({ data, i, measure }: { data: any; i: number; measure: string }) => {
		if (i !== dimensionsKeys.length) {
			if (i === dimensionsKeys.length - 1) {
				//This will be the final level of parsing
				var childrenArray: any = [];

				var finalTotal = 0;
				data.forEach((item: any) => {
					var finalObj = { name: item[dimensionsKeys[i]], value: item[measure] };
					finalTotal = finalTotal + item[measure];
					childrenArray.push(finalObj);
				});

				return [childrenArray, finalTotal];
			}

			// On all other conditions
			else {
				var dimValues = data.map((dt: any) => dt[dimensionsKeys[i]]); // All values of next dimension

				var uniqueDimValues = [...new Set(dimValues)]; // Unique values of next dimension. These are the parent objects

				var formattedData: any = [];
				var total = 0;
				uniqueDimValues.forEach(val => {
					var parentObj = { name: val, value: 0, children: [] }; // Define parent structure (second,third,... dimension)
					var filteredData = data.filter((dt: any) => dt[dimensionsKeys[i]] === val); // Filter data only for this parent

					var [children, finalTotal]: any = getRecursiveData({
						data: filteredData,
						i: i + 1,
						measure,
					});
					parentObj.children = children;
					parentObj.value = finalTotal;
					total = total + finalTotal;
					formattedData.push(parentObj);
				});
				return [formattedData, total];
			}
		} else {
			Logger("info", "its more than or equal to dimlenght", i);
			Logger("info", "", dimensionsKeys.length);
		}
	};

	useEffect(() => {
		if (chartData.length >= 1) {
			var formattedData: any = []; // Final data structure to feed to the map

			// columns in dimension
			dimensionsKeys = chartProperties.properties[propKey].chartAxes[1].fields.map(el => {
				if ("timeGrain" in el) {
					return `${el.timeGrain} of ${el.fieldname}`;
				} else if ("agg" in el) {
					return `${el.agg} of ${el.fieldname} `;
				} else {
					return el.fieldname;
				}
			});

			// column in measure
			chartProperties.properties[propKey].chartAxes[2].fields.forEach(el => {
				if (el.agg) {
					measure = `${el.agg} of ${el.fieldname}`;
				}
				if (el.timeGrain) {
					measure = `${el.timeGrain} of ${el.fieldname}`;
				}
			});

			var dimValues = chartData.map((dt: any) => dt[dimensionsKeys[0]]); // All values of first dimension
			var uniqueDimValues = [...new Set(dimValues)]; // Unique values of first dimension. These are the parent objects

			if (dimensionsKeys.length === 1) {
				Logger("info", "only one Dimenstion");
				var childrenArray: any = [];
				chartData.forEach((item: any) => {
					var finalObj = {
						name:
							typeof item[dimensionsKeys[0]] === "number"
								? JSON.stringify(item[dimensionsKeys[0]])
								: item[dimensionsKeys[0]],
						value: item[measure],
					};
					childrenArray.push(finalObj);
				});
				setsourceData(childrenArray);
			} else {
				// For each of the parent objects, find what are their children
				uniqueDimValues.forEach(val => {
					var parentObj = { name: val, value: 0, children: [] }; // Define parent structure
					var filteredData = chartData.filter((dt: any) => {
						return dt[dimensionsKeys[0]] === val;
					}); // Filter data only for this parent
					var [children, total]: any = getRecursiveData({
						data: filteredData,
						i: 1,
						measure,
					});
					parentObj.children = children;
					parentObj.value = total;
					formattedData.push(parentObj);
				});
				setsourceData(formattedData);
			}
		}
	}, [chartData, chartControl]);

	useEffect(() => {
		updateTreeMapStyleOptions(propKey, "leafDepth", dimensionsKeys.length);
	}, [chartControls.properties[propKey], chartData]);

	function getTooltipData(treePath: any, value: any, info: any) {
		const dimsLength = chartProperties.properties[propKey].chartAxes[1].fields.map(el => {
			return el.fieldname;
		});

		if (dimsLength.length === parseInt(treePath.length)) {
			return [
				'<div class="tooltip-title">' +
					formatUtil.encodeHTML(treePath.join(">")) +
					"</div>",
				`${chartProperties.properties[propKey].chartAxes[2].fields[0].fieldname} ` +
					formatUtil.addCommas(value),
			].join("");
		} else {
			return `${info.data.name}`;
		}
	}

	const getSourceData = () => {
		return sourceData;
	};
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
					tooltip: {
						show: chartControl.mouseOver.enable,
						formatter: function (info: any) {
							var value = info.value;
							var treePathInfo = info.treePathInfo;
							var treePath = [];
							for (var i = 1; i < treePathInfo.length; i++) {
								treePath.push(treePathInfo[i].name);
							}

							const tooltipData = getTooltipData(treePath, value, info);

							return tooltipData;
						},
					},
					series: [
						{
							type: "treemap",
							left: chartControl.chartMargin.left + "%",
							right: chartControl.chartMargin.right + "%",
							top: chartControl.chartMargin.top + "%",
							bottom: chartControl.chartMargin.bottom + "%",
							width:
								100 -
								(chartControl.chartMargin.left + chartControl.chartMargin.right) +
								"%",
							height:
								100 -
								(chartControl.chartMargin.top + chartControl.chartMargin.bottom) +
								"%",
							label: {
								show: chartControl.labelOptions.showLabel,
								fontSize: chartControl.labelOptions.fontSize,
								color: chartControl.labelOptions.labelColorManual
									? chartControl.labelOptions.labelColor
									: null,
								position: chartControl.treeMapChartControls.labelPosition,
								rotate: chartControl.treeMapChartControls.labelRotate,
								align: chartControl.treeMapChartControls.horizondalAlign,
								verticalAlign: chartControl.treeMapChartControls.verticalAlign,
								overflow: chartControl.treeMapChartControls.overFlow,
							},
							itemStyle: {
								borderWidth: chartControl.treeMapChartControls.borderWidth,
								gapWidth: chartControl.treeMapChartControls.gapWidth,
								borderColorSaturation: 1,
							},
							breadcrumb: {
								show:
									graphDimension.height > 140
										? chartControl.treeMapChartControls.showBreadCrumb
										: false,
								height: chartControl.treeMapChartControls.bcHeight,
								emptyItemWidth: chartControl.treeMapChartControls.bcWidth,
								itemStyle: {
									color: chartControl.treeMapChartControls.bcColor,
								},
							},
							leafDepth: chartControl.treeMapChartControls.leafDepth,
							data: getSourceData(),
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
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateTreeMapStyleOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateTreeMapStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Treemap);
