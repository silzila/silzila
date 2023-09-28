import React from "react";
import { connect } from "react-redux";
import MultiBarChart from "../Charts/MultiBarChart";
import LineChart from "../Charts/LineChart";
import AreaChart from "../Charts/AreaChart";
import DoughnutChart from "../Charts/DoughnutChart";
import FunnelChart from "../Charts/FunnelChart";
import GaugeChart from "../Charts/GaugeChart";
import HeatMap from "../Charts/HeatMap";
import ScatterChart from "../Charts/ScatterChart";
import StackedBar from "../Charts/StackedBar";
import CrossTabChart from "../Charts/CrossTab/CrossTabChart";
import HorizontalBar from "../Charts/HorizontalBar";
import Horizontalstacked from "../Charts/Horizontalstacked";
import RoseChart from "../Charts/RoseChart";
import GeoChart from "../Charts/GeoChart";
import TextEditor from "../Charts/TextEditor";
import CalendarChart from "../Charts/CalendarChart";
import BoxPlotChart from "../Charts/BoxPlotChart";
import TreeMap from "../Charts/TreeMap";
import Sankey from "../Charts/Sankey";
import StackedAreaChart from "../Charts/StackedAreaChart";
import PieChart from "../Charts/PieChart";
import SimpleCard from "../Charts/SimpleCard";
import TableChart from '../Charts/TableChart/TableChart';

const DashGraph = ({
	// props
	propKey,
	tabId,
	gridSize,

	// state
	chartProp,
	tabState,
}: any) => {
	// compute the dimensions of each graph to be displayed in dashboard and render the appropriate graph here
	const renderGraph = () => {
		var dimensions = {
			height:
				chartProp.properties[propKey].chartType === "simplecard"
					? parseInt(tabState.tabs[tabId].dashTilesDetails[propKey].height, 10) *
							gridSize.y -
					  2
					: parseInt(tabState.tabs[tabId].dashTilesDetails[propKey].height, 10) *
							gridSize.y -
					  32,
			width:
				parseInt(tabState.tabs[tabId].dashTilesDetails[propKey].width, 10) * gridSize.x - 4,
		};

		switch (chartProp?.properties[propKey]?.chartType) {
			case "multibar":
				return (
					<MultiBarChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "horizontalBar":
				return (
					<HorizontalBar
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "horizontalStacked":
				return (
					<Horizontalstacked
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "crossTab":
				return (
					<CrossTabChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "stackedBar":
				return (
					<StackedBar
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "line":
				return (
					<LineChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "area":
				return (
					<AreaChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "pie":
				return (
					<PieChart propKey={propKey} graphDimension={dimensions} chartArea="dashboard" />
				);

			case "donut":
				return (
					<DoughnutChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "rose":
				return (
					<RoseChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "funnel":
				return (
					<FunnelChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "gauge":
				return (
					<GaugeChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			case "heatmap":
				return (
					<HeatMap propKey={propKey} graphDimension={dimensions} chartArea="dashboard" />
				);

			case "scatterPlot":
				return (
					<ScatterChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);
			case "stackedArea":
				return (
					<StackedAreaChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);

			// case "geoChart":
			// 	return (
			// 		<GeoChart propKey={propKey} graphDimension={dimensions} chartArea="dashboard" />
			// 	);

			case "calendar":
				return (
					<CalendarChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);
			case "boxPlot":
				return (
					<BoxPlotChart
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);
			case "treeMap":
				return (
					<TreeMap propKey={propKey} graphDimension={dimensions} chartArea="dashboard" />
				);
			case "sankey":
				return (
					<Sankey propKey={propKey} graphDimension={dimensions} chartArea="dashboard" />
				);
			case "richText":
				return (
					<TextEditor
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);
			case "simplecard":
				return (
					<SimpleCard
						propKey={propKey}
						graphDimension={dimensions}
						chartArea="dashboard"
					/>
				);
			case "table":
				return(<TableChart
					propKey={propKey}
					graphDimension={dimensions}
					chartArea="dashboard"
				></TableChart>);
		}
	};
	return <React.Fragment>{renderGraph()}</React.Fragment>;
};

const mapStateToProps = (state: any) => {
	return {
		tabState: state.tabState,
		chartProp: state.chartProperties,
	};
};

export default connect(mapStateToProps, null)(DashGraph);
