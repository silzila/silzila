import React from "react";
import { connect } from "react-redux";
import { changeChartOptionSelected } from "../../redux/ChartProperties/actionsChartProperties";
import { chartTypes } from "./ChartTypes";

const ChartControlObjects = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	changeChartOption,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var selectedChart = chartProp.properties[propKey].chartType;

	const barOptionsList = [
		"Title",
		"Labels",
		"Legend",
		"Margin",
		"Grid/Axes",
		"Tooltip",
		"Colors",
		"Format",
	];

	const pieOptionsList = [
		"Title",
		"Labels",
		"Legend",
		"Margin",
		"Axis",
		"Tooltip",
		"Colors",
		"Format",
	];
	const funnelOptionList = ["Title", "Legend", "Margin", "Tooltip", "Colors", "Format"];
	const gaugeOptionList = ["Title", "Margin", "Axis", "Tooltip", "Colors", "Format"];
	const heatmapOptionList = [
		"Title",
		"Labels",
		"Margin",
		"Colors",
		"Grid/Axes",
		"Tooltip",
		"Format",
	];
	const crossTabOptionList = ["Title", "Tooltip", "Style", "Format"];
	const boxPlotOptionsList = ["Title", "Tooltip", "Margin", "Colors", "Grid/Axes", "Style"];
	const calendarOptionList = [
		"Title",
		"Labels",
		"Margin",
		"Tooltip",
		"Colors",
		// "Format",
		"Style",
	];

	const RenderOptions = () => {
		switch (selectedChart) {
			case "multibar":
			case "stackedBar":
			case "horizontalBar":
			case "horizontalStacked":
			case "line":
			case "area":
			case "scatterPlot":
			case "stakedArea":
				return barOptionsList.map((option) => {
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
				return calendarOptionList.map((option) => {
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
				return pieOptionsList.map((option) => {
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
				return boxPlotOptionsList.map((option) => {
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
				return funnelOptionList.map((option) => {
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
				return gaugeOptionList.map((option) => {
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
				return heatmapOptionList.map((option) => {
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
				return crossTabOptionList.map((option) => {
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
			<div className="axisInfo">
				for {chartTypes.filter((chart) => chart.name === selectedChart)[0].value}
			</div>
			<div className="chartOptionImagesContainer">
				<RenderOptions />
			</div>
		</>
	);
};

const mapStateToProps = (state) => {
	return { chartProp: state.chartProperties, tabTileProps: state.tabTileProps };
};

const mapDispatchToProps = (dispatch) => {
	return {
		changeChartOption: (propKey, chartOption) =>
			dispatch(changeChartOptionSelected(propKey, chartOption)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartControlObjects);
