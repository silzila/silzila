// This is a conainer component that renders appropriate chart control component based on user selection

import React from "react";
import { connect } from "react-redux";
import ChartColors from "./Color/ChartColors";
import ColorScale from "./Color/ColorScale";
import ChartFormat from "./Format/ChartFormat";
import AxisControls from "./GridAndAxes/AxisControls";
import GridAndAxes from "./GridAndAxes/GridAndAxes";
import ChartLabels from "./Labels/ChartLabels";
import ChartLegend from "./Legend/ChartLegend";
import ChartMargin from "./Margin/ChartMargin";
import ChartMouseOver from "./MouseOver/ChartMouseOver";
import ChartTitle from "./Title/ChartTitle";
import ChartStyle from "./Style/ChartStyle";
import ColorSteps from "./Color/ColorSteps";
import CalendarLabels from "./Labels/CalendarLabels";
import CalendarChartStyles from "./Style/CalendarChartStyles";
import BoxPlotChartStyles from "./Style/BoxPlotChartStyles";

const ControlDetail = ({ chartProp, tabTileProps }) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	var chartType = chartProp.properties[propKey].chartType;

	const RenderControlDetail = () => {
		switch (chartProp.properties[propKey].chartOptionSelected) {
			case "Title":
				return <ChartTitle />;

			case "Colors":
				if (chartType === "heatmap") {
					return <ColorScale />;
				} else if (chartType === "gauge") {
					return (
						<>
							<ColorSteps />
						</>
					);
				} else {
					return <ChartColors />;
				}

			case "Legend":
				return <ChartLegend />;

			case "Margin":
				return <ChartMargin />;

			case "Tooltip":
				return <ChartMouseOver />;

			case "Grid/Axes":
				return <GridAndAxes />;

			case "Labels":
				if (chartType === "calendar") {
					return <CalendarLabels />;
				} else {
					return <ChartLabels />;
				}

			case "Axis":
				return <AxisControls />;

			case "Style":
				if (chartType === "calendar") {
					return <CalendarChartStyles />;
				} else if (chartType === "boxPlot") {
					return <BoxPlotChartStyles />;
				} else {
					return <ChartStyle />;
				}

			case "Format":
				return <ChartFormat chartType={chartType} />;

			default:
				return (
					<span>
						{chartProp.properties[propKey].chartOptionSelected} properties Under
						Construction
					</span>
				);
		}
	};
	return <RenderControlDetail />;
};
const mapStateToProps = (state) => {
	return {
		chartProp: state.chartProperties,
		tabTileProps: state.tabTileProps,
	};
};
export default connect(mapStateToProps)(ControlDetail);
