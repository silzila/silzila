import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { changeChartOptionSelected } from "../../redux/ChartPoperties/ChartPropertiesActions";
import { chartTypes } from "./ChartTypes";

const ChartControlObjects = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	changeChartOption,
}: any) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var selectedChart = chartProp.properties[propKey].chartType;

	const richTextOptionList: string[] = ["Title"];

	const barOptionsList: string[] = [
		"Title",
		"Labels",
		"Legend",
		"Margin",
		"Grid/Axes",
		"Tooltip",
		"Colors",
		"Format",
	];
	const treemapOptionsList: string[] = [
		"Title",
		"Labels",
		"Legend",
		"Margin",
		"Tooltip",
		"Colors",
		"Style",
	];

	const pieOptionsList: string[] = [
		"Title",
		"Labels",
		"Legend",
		"Margin",
		"Axis",
		"Tooltip",
		"Colors",
		"Format",
	];
	const funnelOptionList: string[] = ["Title", "Legend", "Margin", "Tooltip", "Colors", "Format"];
	const gaugeOptionList: string[] = ["Title", "Margin", "Axis", "Tooltip", "Colors", "Format"];
	const heatmapOptionList: string[] = [
		"Title",
		"Legend",
		"Labels",
		"Margin",
		"Colors",
		"Grid/Axes",
		"Tooltip",
		"Format",
	];
	const crossTabOptionList: string[] = ["Title", "Tooltip", "Style", "Format"];
	const boxPlotOptionsList: string[] = [
		"Title",
		"Legend",
		"Tooltip",
		"Margin",
		"Colors",
		"Grid/Axes",
		"Style",
	];
	const calendarOptionList: string[] = [
		"Title",
		"Legend",
		"Labels",
		"Margin",
		"Tooltip",
		"Colors",
		// "Format",
		"Style",
	];

	const RenderOptions: any = () => {
		console.log(selectedChart);
		switch (selectedChart) {
			case "multibar":
			case "stackedBar":
			case "horizontalBar":
			case "horizontalStacked":
			case "line":
			case "area":
			case "scatterPlot":
			case "stackedArea":
				return barOptionsList.map(option => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});
			case "calendar":
			case "sankey":
				return calendarOptionList.map(option => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});

			case "pie":
			case "donut":
			case "rose":
				return pieOptionsList.map(option => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});

			case "boxPlot":
				return boxPlotOptionsList.map(option => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});
			case "funnel":
				return funnelOptionList.map(option => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});

			case "gauge":
				return gaugeOptionList.map(option => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});

			case "heatmap":
				return heatmapOptionList.map(option => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});
			case "treeMap":
				return treemapOptionsList.map(option => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});

			case "crossTab":
				return crossTabOptionList.map(option => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});
			case "richText":
				return richTextOptionList.map(option => {
					return (
						<div
							key={option}
							className={
								chartProp.properties[propKey].chartOptionSelected === option
									? "optionImageSelected"
									: "optionImage"
							}
							onClick={() => changeChartOption(propKey, option)}
						>
							{option}
						</div>
					);
				});

			default:
				return <span> under construction</span>;
		}
	};

	return (
		<>
			<div className="axisInfo" style={{ marginTop: "5px" }}>
				for {chartTypes.filter(chart => chart.name === selectedChart)[0].value}
			</div>
			<div className="chartOptionImagesContainer">
				<RenderOptions />
			</div>
		</>
	);
};

const mapStateToProps = (state: any) => {
	return { chartProp: state.chartProperties, tabTileProps: state.tabTileProps };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		changeChartOption: (propKey: number | string, chartOption: string) =>
			dispatch(changeChartOptionSelected(propKey, chartOption)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartControlObjects);
