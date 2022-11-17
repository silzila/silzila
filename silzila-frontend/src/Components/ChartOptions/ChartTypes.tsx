// // This component list all different charts that a user can create
// // It also handles
// // 	- the differences in dropzones for each specific graphs along,
// // 	- moving table fields into appropriate dropzones for each specific chart type

// import React, { useEffect } from "react";
// import { connect } from "react-redux";
// import {
// 	canReUseData,
// 	changeChartTypeAndAxes,
// } from "../../redux/ChartProperties/actionsChartProperties";
// import "./ChartIconStyles.css";
// import multiBarIcon from "../../assets/bar_chart_grouped.svg";
// import horizontalBar from "../../assets/horizontal_bar_grouped.png";
// import stackedBarIcon from "../../assets/bar_chart_stacked.svg";
// import horizontalStackedBar from "../../assets/horizontal_bar_stacked.png";
// import lineChartIcon from "../../assets/line_chart.svg";
// import areaChartIcon from "../../assets/area-chart.svg";
// import pieChartIcon from "../../assets/pie_chart.svg";
// import donutChartIcon from "../../assets/donut_chart.svg";
// import scatterPlotIcon from "../../assets/scatter.svg";
// import funnelChartIcon from "../../assets/funnel.png";
// import gaugeChartIcon from "../../assets/gauge.png";
// import heatMapIcon from "../../assets/heat_map.png";
// import ChartsInfo from "../ChartAxes/ChartsInfo2";
// import CrossTabIcon from "../../assets/crosstab.png";
// import roseChartIcon from "../../assets/rose_chart.svg";
// import geoChartIcon from "../../assets/earth.svg";
// import stackedAreaChartIcon from "../../assets/stacked_Area_Chart.svg";
// import calendarChartIcon from "../../assets/calendar_chart.svg";
// import "./ChartOptions.css";
// import { updateChartData } from "../../redux/ChartProperties/actionsChartControls";
// import boxPlotIcon from "../../assets/box_plot.svg";
// import TreeMapIcon from "../../assets/treemap.svg";
// import TextEditorIcon from "../../assets/text_editor.svg";
// import Sankey from "../../assets/sankey.svg";
// import {
// 	actionsToAddTile,
// 	actionsToAddTileForRichText,
// 	actionsToUpdateSelectedTile,
// } from "../../redux/TabTile/actionsTabTile";
// import { SaveRichText } from "../Charts/TextEditor";

// export const chartTypes = [
// 	{ name: "crossTab", icon: CrossTabIcon, value: " Cross Tab" },
// 	{ name: "pie", icon: pieChartIcon, value: " Pie Chart" },
// 	{ name: "donut", icon: donutChartIcon, value: " Donut Chart" },
// 	{ name: "rose", icon: roseChartIcon, value: "Rose Chart" },
// 	{ name: "multibar", icon: multiBarIcon, value: "Multi Bar" },
// 	{ name: "horizontalBar", icon: horizontalBar, value: "Horizontal Bar" },
// 	{ name: "stackedBar", icon: stackedBarIcon, value: "Stacked Bar" },
// 	{ name: "horizontalStacked", icon: horizontalStackedBar, value: "Horizontal Stacked Bar" },

// 	{ name: "line", icon: lineChartIcon, value: "Line Chart" },
// 	{ name: "area", icon: areaChartIcon, value: "Area Chart" },
// 	{ name: "stackedArea", icon: stackedAreaChartIcon, value: "Stacked Area Chart" },
// 	{ name: "scatterPlot", icon: scatterPlotIcon, value: " Scatter Plot" },
// 	{ name: "gauge", icon: gaugeChartIcon, value: "Gauge Chart" },
// 	{ name: "funnel", icon: funnelChartIcon, value: "Funnel Chart" },
// 	{ name: "heatmap", icon: heatMapIcon, value: "Heat Map" },
// 	{ name: "treeMap", icon: TreeMapIcon, value: "Tree Map" },
// 	// { name: "geoChart", icon: geoChartIcon, value: "Geo Chart" },
// 	{ name: "calendar", icon: calendarChartIcon, value: "Calendar Chart" },
// 	{ name: "boxPlot", icon: boxPlotIcon, value: "Box Plot Chart" },
// 	{ name: "richText", icon: TextEditorIcon, value: "Rich Text" },
// 	{ name: "sankey", icon: Sankey, value: "Sankey Chart" },
// ];

// const ChartTypes = ({
// 	//props
// 	propKey,

// 	//state
// 	chartProp,
// 	tabState,
// 	tabTileProps,
// 	chartControls,

// 	//dispatch
// 	updateChartTypeAndAxes,
// 	keepOldData,
// 	updateChartData,
// 	addTile,
// 	selectTile,
// }) => {
// 	var selectedChart = chartProp.properties[propKey].chartType;

// 	const getFieldsToChartAllowedNumbers = (chartName, chartAxesIndex, arr1, arr2) => {
// 		let allowedNumbers = ChartsInfo[chartName].dropZones[chartAxesIndex].allowedNumbers ?? 1;

// 		if (arr1 && arr1.length > 0) {
// 			if (allowedNumbers > arr1.length) {
// 				if (arr2 && arr2.length > 0) {
// 					return [...arr1, ...arr2].slice(0, allowedNumbers);
// 				} else {
// 					return arr1;
// 				}
// 			} else {
// 				if (allowedNumbers === arr1.length) {
// 					return arr1;
// 				} else {
// 					return arr1.slice(0, allowedNumbers);
// 				}
// 			}
// 		} else {
// 			return [];
// 		}
// 	};

// 	const switchAxesForCharts = (oldChart, newChart) => {
// 		var oldChartAxes = chartProp.properties[propKey].chartAxes;
// 		var newChartAxes = [];
// 		for (let i = 0; i < ChartsInfo[newChart].dropZones.length; i++) {
// 			newChartAxes.push({ name: ChartsInfo[newChart].dropZones[i].name, fields: [] });
// 		}

// 		switch (oldChart) {
// 			case "multibar":
// 			case "stackedBar":
// 			case "horizontalBar":
// 			case "horizontalStacked":
// 			case "line":
// 			case "area":
// 			case "stackedArea":
// 			case "treeMap":
// 			case "sankey":
// 				if (
// 					[
// 						"multibar",
// 						"stackedBar",
// 						"horizontalBar",
// 						"horizontalStacked",
// 						"line",
// 						"area",
// 						"geoChart",
// 						"stackedArea",
// 						"treeMap",
// 						// "richText",
// 						"sankey",
// 					].includes(newChart)
// 				) {
// 					keepOldData(propKey, true);

// 					return oldChartAxes;
// 				}

// 				if (newChart === "richText") {
// 					keepOldData(propKey, false);
// 					newChartAxes[0].fields = [];
// 					newChartAxes[1].fields = [];
// 					newChartAxes[2].fields = [];
// 					return newChartAxes;
// 				}

// 				if (newChart === "calendar") {
// 					console.log(oldChartAxes);
// 					if (oldChartAxes[1].fields.length > 0) {
// 						if (
// 							oldChartAxes[1].fields[0].dataType === "date" ||
// 							oldChartAxes[1].fields[0].dataType === "timestamp"
// 						) {
// 							if (oldChartAxes[1].fields[0].time_grain === "date") {
// 								keepOldData(propKey, true);
// 								return oldChartAxes;
// 							} else {
// 								console.log(oldChartAxes);
// 								keepOldData(propKey, false);
// 								updateChartData(propKey, "");

// 								newChartAxes[0].fields = oldChartAxes[0].fields;
// 								newChartAxes[1].fields = [
// 									{
// 										dataType: oldChartAxes[1].fields[0].dataType,
// 										displayname: oldChartAxes[1].fields[0].displayname,
// 										fieldname: oldChartAxes[1].fields[0].fieldname,
// 										tableId: oldChartAxes[1].fields[0].tableId,
// 										uId: oldChartAxes[1].fields[0].uId,
// 										time_grain: "date",
// 									},
// 								];
// 								newChartAxes[2].fields = oldChartAxes[2].fields;
// 								console.log(newChartAxes);
// 								return newChartAxes;
// 							}
// 						} else {
// 							keepOldData(propKey, false);

// 							newChartAxes[1].fields = [];
// 							newChartAxes[2].fields.push(oldChartAxes[2].fields[0]);
// 							console.log(newChartAxes);
// 							return newChartAxes;
// 						}
// 					} else {
// 						keepOldData(propKey, true);
// 						return oldChartAxes;
// 					}
// 				}

// 				if (newChart === "pie" || newChart === "donut" || newChart === "rose") {
// 					keepOldData(propKey, false);

// 					newChartAxes[0].fields = oldChartAxes[0].fields; //Filter

// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]); //Dimension	allowedNumbers: 1,

// 					newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
// 						newChart,
// 						2,
// 						oldChartAxes[2].fields
// 					); //Measure

// 					return newChartAxes;
// 				}

// 				if (newChart === "scatterPlot") {
// 					keepOldData(propKey, false);

// 					// Map Category to Category
// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							1,
// 							oldChartAxes[1].fields
// 						);

// 					// Map Value to X and Y columns if there are more than one values
// 					if (oldChartAxes[2].fields.length > 0) {
// 						if (oldChartAxes[2].fields.length > 1) {
// 							newChartAxes[2].fields.push(oldChartAxes[2].fields.shift());
// 							newChartAxes[3].fields.push(oldChartAxes[2].fields.shift());
// 						} else {
// 							newChartAxes[2].fields = oldChartAxes[2].fields;
// 						}
// 					}

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "funnel") {
// 					//name: "Measure", allowedNumbers: 12,
// 					keepOldData(propKey, false);

// 					if (oldChartAxes[2].fields.length > 0)
// 						newChartAxes[1].fields = oldChartAxes[2].fields; // this will work
// 					//newChartAxes[1].fields = getFieldsToChartAllowedNumbers("funnel", 1, oldChartAxes[2].fields);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "gauge") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[2].fields.length > 0)
// 						newChartAxes[1].fields.push(oldChartAxes[2].fields[0]);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "heatmap") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0) {
// 						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]);
// 					}

// 					if (oldChartAxes[2].fields.length > 0) {
// 						newChartAxes[3].fields.push(oldChartAxes[2].fields[0]);
// 					}

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "crossTab" || newChart === "boxPlot") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0) {
// 						newChartAxes[1].fields = oldChartAxes[1].fields;
// 					}

// 					if (oldChartAxes[2].fields.length > 0) {
// 						newChartAxes[3].fields = oldChartAxes[2].fields;
// 					}

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}
// 				break;

// 			case "calendar":
// 				if (newChart === "calendar") {
// 					return oldChartAxes;
// 				}

// 				if (
// 					[
// 						"multibar",
// 						"stackedBar",
// 						"horizontalBar",
// 						"horizontalStacked",
// 						"line",
// 						"area",
// 						"geoChart",
// 						"stackedArea",
// 						"treeMap",
// 						"sankey",
// 					].includes(newChart)
// 				) {
// 					keepOldData(propKey, true);

// 					return oldChartAxes;
// 				}

// 				if (newChart === "richText") {
// 					keepOldData(propKey, false);
// 					newChartAxes[0].fields = [];
// 					newChartAxes[1].fields = [];
// 					newChartAxes[2].fields = [];
// 					return newChartAxes;
// 				}

// 				if (newChart === "pie" || newChart === "donut" || newChart === "rose") {
// 					keepOldData(propKey, false);

// 					newChartAxes[0].fields = oldChartAxes[0].fields; //Filter

// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]); //Dimension	allowedNumbers: 1,

// 					newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
// 						newChart,
// 						2,
// 						oldChartAxes[2].fields
// 					); //Measure

// 					return newChartAxes;
// 				}

// 				if (newChart === "scatterPlot") {
// 					keepOldData(propKey, false);

// 					// Map Category to Category
// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							1,
// 							oldChartAxes[1].fields
// 						);

// 					// Map Value to X and Y columns if there are more than one values
// 					if (oldChartAxes[2].fields.length > 0) {
// 						if (oldChartAxes[2].fields.length > 1) {
// 							newChartAxes[2].fields.push(oldChartAxes[2].fields.shift());
// 							newChartAxes[3].fields.push(oldChartAxes[2].fields.shift());
// 						} else {
// 							newChartAxes[2].fields = oldChartAxes[2].fields;
// 						}
// 					}

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "funnel") {
// 					//name: "Measure", allowedNumbers: 12,
// 					keepOldData(propKey, false);

// 					if (oldChartAxes[2].fields.length > 0)
// 						newChartAxes[1].fields = oldChartAxes[2].fields; // this will work
// 					//newChartAxes[1].fields = getFieldsToChartAllowedNumbers("funnel", 1, oldChartAxes[2].fields);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "gauge") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[2].fields.length > 0)
// 						newChartAxes[1].fields.push(oldChartAxes[2].fields[0]);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "heatmap") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0) {
// 						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]);
// 					}

// 					if (oldChartAxes[2].fields.length > 0) {
// 						newChartAxes[3].fields.push(oldChartAxes[2].fields[0]);
// 					}

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "crossTab" || newChart === "boxPlot") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0) {
// 						newChartAxes[1].fields = oldChartAxes[1].fields;
// 					}

// 					if (oldChartAxes[2].fields.length > 0) {
// 						newChartAxes[3].fields = oldChartAxes[2].fields;
// 					}

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}
// 				break;

// 			case "pie":
// 			case "donut":
// 			case "rose":
// 				if (
// 					[
// 						"multibar",
// 						"stackedBar",
// 						"horizontalBar",
// 						"horizontalStacked",
// 						"line",
// 						"area",
// 						"pie",
// 						"donut",
// 						"rose",
// 						"stackedArea",
// 						"treeMap",
// 						"sankey",
// 					].includes(newChart)
// 				) {
// 					keepOldData(propKey, true);

// 					return oldChartAxes;
// 				}

// 				if (newChart === "richText") {
// 					keepOldData(propKey, false);
// 					newChartAxes[0].fields = [];
// 					newChartAxes[1].fields = [];
// 					newChartAxes[2].fields = [];
// 					return newChartAxes;
// 				}

// 				if (newChart === "calendar") {
// 					console.log(oldChartAxes);
// 					if (oldChartAxes[1].fields.length > 0) {
// 						if (
// 							oldChartAxes[1].fields[0].dataType === "date" ||
// 							oldChartAxes[1].fields[0].dataType === "timestamp"
// 						) {
// 							if (oldChartAxes[1].fields[0].time_grain === "date") {
// 								keepOldData(propKey, true);
// 								return oldChartAxes;
// 							} else {
// 								console.log(oldChartAxes);
// 								keepOldData(propKey, false);
// 								updateChartData(propKey, "");

// 								newChartAxes[0].fields = oldChartAxes[0].fields;
// 								newChartAxes[1].fields = [
// 									{
// 										dataType: oldChartAxes[1].fields[0].dataType,
// 										displayname: oldChartAxes[1].fields[0].displayname,
// 										fieldname: oldChartAxes[1].fields[0].fieldname,
// 										tableId: oldChartAxes[1].fields[0].tableId,
// 										uId: oldChartAxes[1].fields[0].uId,
// 										time_grain: "date",
// 									},
// 								];
// 								newChartAxes[2].fields = oldChartAxes[2].fields;
// 								console.log(newChartAxes);
// 								return newChartAxes;
// 							}
// 						} else {
// 							keepOldData(propKey, false);

// 							newChartAxes[1].fields = [];
// 							newChartAxes[2].fields.push(oldChartAxes[2].fields[0]);
// 							console.log(newChartAxes);
// 							return newChartAxes;
// 						}
// 					} else {
// 						keepOldData(propKey, true);
// 						return oldChartAxes;
// 					}
// 				}

// 				if (newChart === "scatterPlot") {
// 					keepOldData(propKey, false);

// 					// Map Category to Category
// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							1,
// 							oldChartAxes[1].fields
// 						);

// 					// Map Value to X and Y columns if there are more than one values
// 					if (oldChartAxes[2].fields.length > 0) {
// 						if (oldChartAxes[2].fields.length > 1) {
// 							newChartAxes[2].fields.push(oldChartAxes[2].fields.shift());
// 							newChartAxes[3].fields.push(oldChartAxes[2].fields.shift());
// 						} else {
// 							newChartAxes[2].fields = oldChartAxes[2].fields;
// 						}
// 					}

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "funnel") {
// 					//name: "Measure", allowedNumbers: 12,
// 					keepOldData(propKey, false);

// 					if (oldChartAxes[2].fields.length > 0)
// 						newChartAxes[1].fields = oldChartAxes[2].fields; // this will work
// 					//newChartAxes[1].fields = getFieldsToChartAllowedNumbers("funnel", 1, oldChartAxes[2].fields);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "gauge") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[2].fields.length > 0)
// 						newChartAxes[1].fields.push(oldChartAxes[2].fields[0]);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "heatmap" || newChart === "crossTab") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0) {
// 						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]);
// 					}

// 					if (oldChartAxes[2].fields.length > 0) {
// 						newChartAxes[3].fields.push(oldChartAxes[2].fields[0]);
// 					}

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "crossTab" || newChart === "boxPlot") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0) {
// 						newChartAxes[1].fields = oldChartAxes[1].fields;
// 					}

// 					if (oldChartAxes[2].fields.length > 0) {
// 						newChartAxes[3].fields = oldChartAxes[2].fields;
// 					}

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}
// 				break;

// 			case "scatterPlot":
// 				if (newChart === "scatterPlot") {
// 					return oldChartAxes;
// 				}

// 				if (
// 					[
// 						"multibar",
// 						"stackedBar",
// 						"horizontalBar",
// 						"horizontalStacked",
// 						"line",
// 						"area",
// 						"pie",
// 						"donut",
// 						"rose",
// 						"stackedArea",
// 						"treeMap",
// 						"sankey",
// 					].includes(newChart)
// 				) {
// 					keepOldData(propKey, true);
// 					// Map Category to Category
// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[1].fields = oldChartAxes[1].fields;

// 					// Map X & Y to Value
// 					newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
// 						newChart,
// 						2,
// 						oldChartAxes[2].fields,
// 						oldChartAxes[3].fields
// 					);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;
// 					return newChartAxes;
// 				}

// 				if (newChart === "richText") {
// 					keepOldData(propKey, false);
// 					newChartAxes[0].fields = [];
// 					newChartAxes[1].fields = [];
// 					newChartAxes[2].fields = [];
// 					return newChartAxes;
// 				}

// 				if (newChart === "calendar") {
// 					// console.log(oldChartAxes);

// 					keepOldData(propKey, false);

// 					if (oldChartAxes[0].fields.length > 0) {
// 						newChartAxes[0].fields = oldChartAxes[0].fields;
// 					}

// 					if (oldChartAxes[1].fields.length > 0) {
// 						if (
// 							oldChartAxes[1].fields[0].dataType === "date" ||
// 							oldChartAxes[1].fields[0].dataType === "timestamp"
// 						) {
// 							newChartAxes[1].fields = oldChartAxes[1].fields;
// 							newChartAxes[1].fields[0].time_grain = "date";
// 						} else {
// 							newChartAxes[1].fields = [];
// 						}
// 					}

// 					newChartAxes[2].fields = getFieldsToChartAllowedNumbers(newChart, 2, [
// 						...oldChartAxes[2].fields,
// 						...oldChartAxes[3].fields,
// 					]);

// 					updateChartData(propKey, "");
// 					return newChartAxes;
// 				}

// 				if (newChart === "funnel") {
// 					keepOldData(propKey, false);
// 					newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
// 						newChart,
// 						1,
// 						oldChartAxes[2].fields,
// 						oldChartAxes[3].fields
// 					);
// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "gauge") {
// 					keepOldData(propKey, false);
// 					newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
// 						newChart,
// 						1,
// 						oldChartAxes[2].fields,
// 						oldChartAxes[3].fields
// 					);
// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "heatmap" || newChart === "crossTab" || newChart === "boxPlot") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]);

// 					if (oldChartAxes[2].fields.length > 0)
// 						newChartAxes[3].fields.push(oldChartAxes[2].fields[0]);
// 					else if (oldChartAxes[3].fields.length > 0)
// 						newChartAxes[3].fields.push(oldChartAxes[3].fields[0]);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				break;
// 			case "funnel":
// 				if (newChart === "funnel") {
// 					return oldChartAxes;
// 				}

// 				if (
// 					[
// 						"multibar",
// 						"stackedBar",
// 						"horizontalBar",
// 						"horizontalStacked",
// 						"line",
// 						"area",
// 						"pie",
// 						"donut",
// 						"rose",
// 						"stackedArea",
// 						"calendar",
// 						"treeMap",
// 						"sankey",
// 					].includes(newChart)
// 				) {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							2,
// 							oldChartAxes[1].fields
// 						);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "richText") {
// 					keepOldData(propKey, false);
// 					newChartAxes[0].fields = [];
// 					newChartAxes[1].fields = [];
// 					newChartAxes[2].fields = [];
// 					return newChartAxes;
// 				}

// 				if (newChart === "scatterPlot") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0) {
// 						if (oldChartAxes[1].fields.length > 1) {
// 							newChartAxes[2].fields.push(oldChartAxes[1].fields.shift());
// 							newChartAxes[3].fields.push(oldChartAxes[1].fields.shift());
// 						} else newChartAxes[2].fields = oldChartAxes[1].fields;
// 					}

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "gauge") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "heatmap" || newChart === "crossTab" || newChart === "boxPlot") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[3].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							3,
// 							oldChartAxes[1].fields
// 						);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				break;
// 			case "gauge":
// 				if (newChart === "gauge") {
// 					return oldChartAxes;
// 				}
// 				if (
// 					[
// 						"multibar",
// 						"stackedBar",
// 						"horizontalBar",
// 						"horizontalStacked",
// 						"line",
// 						"area",
// 						"pie",
// 						"donut",
// 						"rose",
// 						"stackedArea",
// 						"calendar",
// 						"treeMap",
// 						"sankey",
// 					].includes(newChart)
// 				) {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							2,
// 							oldChartAxes[1].fields
// 						);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "richText") {
// 					keepOldData(propKey, false);
// 					newChartAxes[0].fields = [];
// 					newChartAxes[1].fields = [];
// 					newChartAxes[2].fields = [];
// 					return newChartAxes;
// 				}

// 				if (newChart === "scatterPlot") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0) {
// 						newChartAxes[2].fields.push(oldChartAxes[1].fields.shift());
// 					}

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "funnel") {
// 					keepOldData(propKey, false);

// 					return oldChartAxes;
// 				}

// 				if (newChart === "heatmap") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[3].fields.push(oldChartAxes[1].fields[0]);

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				if (newChart === "crossTab" || newChart === "boxPlot") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0)
// 						newChartAxes[3].fields = oldChartAxes[1].fields;

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}

// 				break;
// 			case "heatmap":
// 				if (newChart === "heatmap" || newChart === "crossTab" || newChart === "boxPlot")
// 					return oldChartAxes;

// 				if (
// 					[
// 						"multibar",
// 						"stackedBar",
// 						"horizontalBar",
// 						"horizontalStacked",
// 						"line",
// 						"area",
// 						"pie",
// 						"donut",
// 						"rose",
// 						"stackedArea",
// 						"treeMap",
// 						"sankey",
// 					].includes(newChart)
// 				) {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
// 						newChart,
// 						1,
// 						oldChartAxes[1].fields,
// 						oldChartAxes[2].fields
// 					);

// 					if (oldChartAxes[3].fields.length > 0)
// 						newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							2,
// 							oldChartAxes[3].fields
// 						);

// 					return newChartAxes;
// 				}

// 				if (newChart === "richText") {
// 					keepOldData(propKey, false);
// 					newChartAxes[0].fields = [];
// 					newChartAxes[1].fields = [];
// 					newChartAxes[2].fields = [];
// 					return newChartAxes;
// 				}

// 				if (newChart === "calendar") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[0].fields.length > 0) {
// 						newChartAxes[0].fields = oldChartAxes[0].fields;
// 					}
// 					if (oldChartAxes[1].fields.length > 0) {
// 						const row = oldChartAxes[1].fields.filter(el => {
// 							return el.dataType === "date" || el.dataType === "timestamp";
// 						});
// 						const column = oldChartAxes[2].fields.filter(el => {
// 							return el.dataType === "date" || el.dataType === "timestamp";
// 						});

// 						newChartAxes[1].fields = getFieldsToChartAllowedNumbers(newChart, 1, [
// 							...row,
// 							...column,
// 						]);
// 						newChartAxes[1].fields[0].time_grain = "date";
// 					}
// 					console.log(newChartAxes[1]);

// 					if (oldChartAxes[3].fields.length > 0) {
// 						newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							2,
// 							oldChartAxes[3].fields
// 						);
// 					}
// 					updateChartData(propKey, "");

// 					return newChartAxes;
// 				}

// 				if (newChart === "scatterPlot") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
// 						newChart,
// 						1,
// 						oldChartAxes[1].fields,
// 						oldChartAxes[2].fields
// 					);

// 					if (oldChartAxes[3].fields.length > 0)
// 						newChartAxes[3].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							3,
// 							oldChartAxes[3].fields
// 						);

// 					return newChartAxes;
// 				}

// 				if (newChart === "funnel") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					if (oldChartAxes[3].fields.length > 0)
// 						newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							1,
// 							oldChartAxes[3].fields
// 						);

// 					return newChartAxes;
// 				}

// 				if (newChart === "gauge") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					if (oldChartAxes[3].fields.length > 0)
// 						newChartAxes[1].fields.push(oldChartAxes[3].fields[0]);

// 					return newChartAxes;
// 				}

// 				break;
// 			case "crossTab":
// 			case "boxPlot":
// 				if (newChart === "crossTab" || newChart === "boxPlot") return oldChartAxes;

// 				if (
// 					[
// 						"multibar",
// 						"stackedBar",
// 						"horizontalBar",
// 						"horizontalStacked",
// 						"line",
// 						"area",
// 						"pie",
// 						"donut",
// 						"rose",
// 						"geoChart",
// 						"stackedArea",
// 						"treeMap",
// 						"sankey",
// 					].includes(newChart)
// 				) {
// 					// Map filter to Filter
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
// 						newChart,
// 						1,
// 						oldChartAxes[1].fields,
// 						oldChartAxes[2].fields
// 					);

// 					if (oldChartAxes[3].fields.length > 0)
// 						newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							2,
// 							oldChartAxes[3].fields
// 						);

// 					return newChartAxes;
// 				}

// 				if (newChart === "richText") {
// 					console.log("open in new tile");

// 					// handleAddTile();

// 					// let tabObj = tabState.tabs[tabTileProps.selectedTabId];
// 					// console.log(`${tabObj.tabId}.${tabObj.nextTileId}`);
// 					// console.log(chartProp.properties[`${tabObj.tabId}.${tabObj.nextTileId}`]);

// 					newChartAxes[0].fields = [];
// 					newChartAxes[1].fields = [];
// 					newChartAxes[2].fields = [];

// 					return newChartAxes;
// 				}

// 				if (newChart === "calendar") {
// 					// console.log(oldChartAxes);

// 					keepOldData(propKey, false);
// 					if (oldChartAxes[0].fields.length > 0) {
// 						newChartAxes[0].fields = oldChartAxes[0].fields;
// 					}

// 					if (oldChartAxes[1].fields.length > 0) {
// 						const row = oldChartAxes[1].fields.filter(el => {
// 							return el.dataType === "date" || el.dataType === "timestamp";
// 						});
// 						const column = oldChartAxes[2].fields.filter(el => {
// 							return el.dataType === "date" || el.dataType === "timestamp";
// 						});

// 						newChartAxes[1].fields = getFieldsToChartAllowedNumbers(newChart, 1, [
// 							...row,
// 							...column,
// 						]);
// 						newChartAxes[1].fields[0].time_grain = "date";
// 					}
// 					// console.log(newChartAxes[1]);

// 					if (oldChartAxes[3].fields.length > 0) {
// 						newChartAxes[2].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							2,
// 							oldChartAxes[3].fields
// 						);
// 					}
// 					updateChartData(propKey, "");

// 					return newChartAxes;
// 				}

// 				if (newChart === "scatterPlot") {
// 					keepOldData(propKey, false);
// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
// 						newChart,
// 						1,
// 						oldChartAxes[1].fields,
// 						oldChartAxes[2].fields
// 					);

// 					if (oldChartAxes[3].fields.length > 0)
// 						newChartAxes[3].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							3,
// 							oldChartAxes[3].fields
// 						);

// 					return newChartAxes;
// 				}

// 				if (newChart === "funnel") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					if (oldChartAxes[3].fields.length > 0)
// 						newChartAxes[1].fields = getFieldsToChartAllowedNumbers(
// 							newChart,
// 							1,
// 							oldChartAxes[3].fields
// 						);

// 					return newChartAxes;
// 				}

// 				if (newChart === "gauge") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					if (oldChartAxes[3].fields.length > 0)
// 						newChartAxes[1].fields.push(oldChartAxes[3].fields[0]);

// 					return newChartAxes;
// 				}

// 				if (newChart === "heatmap") {
// 					keepOldData(propKey, false);
// 					if (oldChartAxes[1].fields.length > 0) {
// 						newChartAxes[1].fields.push(oldChartAxes[1].fields[0]);
// 					}

// 					if (oldChartAxes[2].fields.length > 0) {
// 						newChartAxes[2].fields.push(oldChartAxes[2].fields[0]);
// 					}

// 					if (oldChartAxes[3].fields.length > 0) {
// 						newChartAxes[3].fields.push(oldChartAxes[3].fields[0]);
// 					}

// 					// Map filter to Filter
// 					if (oldChartAxes[0].fields.length > 0)
// 						newChartAxes[0].fields = oldChartAxes[0].fields;

// 					return newChartAxes;
// 				}
// 				break;

// 			case "richText":
// 				if (
// 					[
// 						"multibar",
// 						"stackedBar",
// 						"horizontalBar",
// 						"horizontalStacked",
// 						"line",
// 						"area",
// 						"geoChart",
// 						"stackedArea",
// 						"treeMap",
// 						"sankey",
// 						"calendar",
// 						"richText",
// 						"pie",
// 						"donut",
// 						"rose",
// 					].includes(newChart)
// 				) {
// 					keepOldData(propKey, false);
// 					newChartAxes[0].fields = [];
// 					newChartAxes[1].fields = [];
// 					newChartAxes[2].fields = [];
// 					return newChartAxes;
// 				}

// 				if (["scatterPlot", "heatmap", "crossTab", "boxPlot"].includes(newChart)) {
// 					keepOldData(propKey, false);

// 					newChartAxes[0].fields = [];
// 					newChartAxes[1].fields = [];
// 					newChartAxes[2].fields = [];
// 					newChartAxes[3].fields = [];

// 					return newChartAxes;
// 				}

// 				if (newChart === "funnel" || newChart === "gauge") {
// 					newChartAxes[0].fields = [];
// 					newChartAxes[1].fields = [];
// 					return newChartAxes;
// 				}

// 				break;

// 			default:
// 				return oldChartAxes;
// 		}
// 	};

// 	const handleAddTile = async chartName => {
// 		let tabObj = tabState.tabs[tabTileProps.selectedTabId];

// 		await addTile(
// 			tabObj.tabId,
// 			tabObj.nextTileId,
// 			tabTileProps.selectedTable,
// 			chartProp.properties[propKey].selectedDs,
// 			chartProp.properties[propKey].selectedTable,
// 			chartName
// 		);
// 	};

// 	const getAndUpdateNewChartAxes = (oldChart, newChart) => {
// 		const newChartAxes = switchAxesForCharts(oldChart, newChart);
// 		updateChartTypeAndAxes(propKey, newChart, newChartAxes);
// 	};

// 	const renderChartTypes = chartTypes.map(chart => {
// 		return (
// 			<img
// 				key={chart.name}
// 				className={chart.name === selectedChart ? "chartIcon selected" : "chartIcon"}
// 				src={chart.icon}
// 				alt={chart.name}
// 				onClick={() => {
// 					if (
// 						[
// 							"multibar",
// 							"stackedBar",
// 							"horizontalBar",
// 							"horizontalStacked",
// 							"line",

// 							"pie",
// 							"donut",
// 							"rose",

// 							"area",
// 							"scatterPlot",

// 							"funnel",
// 							"gauge",
// 							"heatmap",

// 							"crossTab",

// 							"geoChart",
// 							"stackedArea",
// 							"calendar",
// 							"boxPlot",
// 							"treeMap",
// 							"sankey",
// 							"richText",
// 						].includes(chart.name)
// 					) {
// 						console.log(chart.name, " clicked");
// 						var oldChartAxes = chartProp.properties[propKey].chartAxes;

// 						//CASE 1: when switching from richtext to richtext
// 						if (
// 							chartProp.properties[propKey].chartType === "richText" &&
// 							chart.name === "richText"
// 						) {
// 							getAndUpdateNewChartAxes(
// 								chartProp.properties[propKey].chartType,
// 								chart.name
// 							);
// 						}
// 						//CASE 2: when switching from richtext to otherCharts
// 						else if (
// 							chartProp.properties[propKey].chartType === "richText" &&
// 							chart.name !== "richText"
// 						) {
// 							//check whether richtext contains content or not to open selected chart in same tile
// 							if (
// 								chartControls.properties[propKey].richText === "" ||
// 								chartControls.properties[propKey].richText === "<p><br></p>"
// 							) {
// 								console.log(chartControls.properties[propKey].richText);
// 								getAndUpdateNewChartAxes(
// 									chartProp.properties[propKey].chartType,
// 									chart.name
// 								);
// 							}
// 							//if richtext contain contents,then open selected chart in new tile
// 							else {
// 								handleAddTile(chart.name);
// 							}
// 						}

// 						//CASE 3:when switching from other charts to rich text
// 						else if (
// 							chartProp.properties[propKey].chartType !== "richText" &&
// 							chart.name === "richText"
// 						) {
// 							//check whether axes of oldchart is empty or not to open richtext in the same tile
// 							var noOfAxes = oldChartAxes.length;
// 							oldChartAxes.map(axes => {
// 								if (axes.fields.length === 0) {
// 									noOfAxes = noOfAxes - 1;
// 								}
// 							});
// 							console.log(noOfAxes);
// 							if (
// 								// oldChartAxes[0].fields.length === 0 &&
// 								// oldChartAxes[1].fields.length === 0 &&
// 								// oldChartAxes[2].fields.length === 0
// 								noOfAxes === 0
// 							) {
// 								getAndUpdateNewChartAxes(
// 									chartProp.properties[propKey].chartType,
// 									chart.name
// 								);
// 							}
// 							//if chartAxes of oldchart is not empty, then open richtext in new tile
// 							else {
// 								handleAddTile(chart.name);
// 								// console.log(chartProp);
// 							}
// 						}

// 						//CASE 4:when switching between charts other than richtext
// 						else {
// 							getAndUpdateNewChartAxes(
// 								chartProp.properties[propKey].chartType,
// 								chart.name
// 							);
// 							// const newChartAxes = switchAxesForCharts(
// 							// 	chartProp.properties[propKey].chartType,
// 							// 	chart.name
// 							// );
// 							// updateChartTypeAndAxes(propKey, chart.name, newChartAxes);
// 						}
// 					}
// 				}}
// 				title={chart.value}
// 			/>
// 		);
// 	});

// 	return (
// 		<React.Fragment>
// 			<div className="chartIconsContainer">{renderChartTypes}</div>
// 		</React.Fragment>
// 	);
// };
// const mapStateToProps = state => {
// 	return {
// 		chartProp: state.chartProperties,
// 		tabState: state.tabState,
// 		tabTileProps: state.tabTileProps,
// 		chartControls: state.chartControls,
// 	};
// };
// const mapDispatchToProps = dispatch => {
// 	return {
// 		updateChartTypeAndAxes: (propKey, chartType, newAxes) =>
// 			dispatch(changeChartTypeAndAxes({ propKey, chartType, newAxes })),
// 		keepOldData: (propKey, reUseData) => dispatch(canReUseData(propKey, reUseData)),
// 		updateChartData: (propKey, chartData) => dispatch(updateChartData(propKey, chartData)),
// 		addTile: (tabId, nextTileId, table, selectedDataset, selectedTables, chartName) =>
// 			dispatch(
// 				actionsToAddTileForRichText({
// 					tabId,
// 					nextTileId,
// 					table,
// 					fromTab: false,
// 					selectedDs: selectedDataset,
// 					selectedTablesInDs: selectedTables,
// 					chartName,
// 				})
// 			),
// 		selectTile: (tabId, tileName, tileId, nextTileId, fileId, fromTab) =>
// 			dispatch(
// 				actionsToUpdateSelectedTile({
// 					tabId,
// 					tileName,
// 					tileId,
// 					nextTileId,
// 					fileId,
// 					fromTab,
// 				})
// 			),
// 	};
// };

// export default connect(mapStateToProps, mapDispatchToProps)(ChartTypes);
import React from "react";

const ChartTypes = (props: any) => {
	return <div>ChartTypes</div>;
};

export default ChartTypes;
