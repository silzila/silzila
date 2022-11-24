// This is a conainer component that renders appropriate chart control component based on user selection

import { connect } from "react-redux";
import { ChartPropertiesProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { TabTileStateProps } from "../../redux/TabTile/TabTilePropsInterfaces";
import ChartColors from "./Color/ChartColors";
import ColorScale from "./Color/ColorScale";
import ColorSteps from "./Color/ColorSteps";
import SankeyColorControls from "./Color/SankeyColorControls";
import { ControlDetailStateProps } from "./CommonInterfacesForChartOptions";
import ChartFormat from "./Format/ChartFormat";
import AxisControls from "./GridAndAxes/AxisControls";
import GridAndAxes from "./GridAndAxes/GridAndAxes";
import CalendarLabels from "./Labels/CalendarLabels";
import ChartLabels from "./Labels/ChartLabels";
import ChartLegend from "./Legend/ChartLegend";
import TreeMapLegend from "./Legend/TreeMapLegend";
import ChartMargin from "./Margin/ChartMargin";
import ChartMouseOver from "./MouseOver/ChartMouseOver";
import BoxPlotChartStyles from "./ChartStyle/BoxPlotChartStyles";
import CalendarChartStyles from "./ChartStyle/CalendarChartStyles";
import ChartStyle from "./ChartStyle/ChartStyle";
import SankeyStyles from "./ChartStyle/SankeyStyles";
import TreeMapStyles from "./ChartStyle/TreeMapStyles";
import ChartTitle from "./Title/ChartTitle";

interface ControlDetailProps {
	chartProp: ChartPropertiesProps;
	tabTileProps: TabTileStateProps;
}

const ControlDetail = ({ chartProp, tabTileProps }: ControlDetailProps) => {
	var propKey: number = parseFloat(
		`${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`
	);

	var chartType: string = chartProp.properties[propKey].chartType;

	const RenderControlDetail = () => {
		switch (chartProp.properties[propKey].chartOptionSelected) {
			case "Title":
				return <ChartTitle />;
			case "Colors":
				if (chartType === "heatmap") {
					return <ColorScale />;
				} else if (chartType === "gauge") {
					return <ColorSteps />;
				} else if (chartType === "sankey") {
					return <SankeyColorControls />;
				} else {
					return <ChartColors />;
				}
			case "Legend":
				if (chartType === "treeMap") {
					return <TreeMapLegend />;
				} else {
					return <ChartLegend />;
				}
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
				} else if (chartType === "treeMap") {
					return <TreeMapStyles />;
				} else if (chartType === "sankey") {
					return <SankeyStyles />;
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
const mapStateToProps = (state: ControlDetailStateProps) => {
	return {
		chartProp: state.chartProperties,
		tabTileProps: state.tabTileProps,
	};
};
export default connect(mapStateToProps)(ControlDetail);
