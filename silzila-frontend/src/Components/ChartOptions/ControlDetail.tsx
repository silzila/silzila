// This is a conainer component that renders appropriate chart control component based on user selection

import { connect } from "react-redux";
import { ChartPropertiesProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { TabTileStateProps } from "../../redux/TabTile/TabTilePropsInterfaces";
import ChartColors from "./Color/ChartColors";
import ColorScale from "./Color/ColorScale";
import ColorSteps from "./Color/ColorSteps";
import SankeyColorControls from "./Color/SankeyColorControls";
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
import { ChartOptionsStateProps } from "./CommonInterfaceForChartOptions";
import CardStyle from "./ChartStyle/CardStyle";

interface ControlDetailProps {
	chartProperties: ChartPropertiesProps;
	tabTileProps: TabTileStateProps;
}

const ControlDetail = ({ chartProperties, tabTileProps }: ControlDetailProps) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var chartType: string = chartProperties.properties[propKey].chartType;

	const RenderControlDetail = () => {
		switch (chartProperties.properties[propKey].chartOptionSelected) {
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
				} else if (chartType === "simplecard") {
					return <CardStyle />;
				} else {
					return <ChartStyle />;
				}
			case "Format":
				return <ChartFormat chartType={chartType} />;
			default:
				return (
					<span>
						{chartProperties.properties[propKey].chartOptionSelected} properties Under
						Construction
					</span>
				);
		}
	};
	return <RenderControlDetail />;
};
const mapStateToProps = (state: ChartOptionsStateProps) => {
	return {
		chartProperties: state.chartProperties,
		tabTileProps: state.tabTileProps,
	};
};
export default connect(mapStateToProps)(ControlDetail);
