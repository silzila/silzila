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
import FilledMap from "../Charts/GeoChart/FilledMap";
import BubbleMap from "../Charts/GeoChart/BubbleMap";
import TextEditor from "../Charts/TextEditor/TextEditor";
import CalendarChart from "../Charts/CalendarChart";
import BoxPlotChart from "../Charts/BoxPlotChart";
import TreeMap from "../Charts/TreeMap";
import Sankey from "../Charts/Sankey";
import StackedAreaChart from "../Charts/StackedAreaChart";
import PieChart from "../Charts/PieChart";
import SimpleCard from "../Charts/SimpleCard";
import TableChart from "../Charts/TableChart/TableChart";

interface DashGraphProps {
  propKey: string;
  tabId: string;
  gridSize: { x: number; y: number };
  chartProp: any;
  tabState: any;
  softUI: boolean; // Define softUI as a boolean here
}

const DashGraph = ({
  // props
  propKey,
  tabId,
  gridSize,
  colorScheme,
  softUI,

  // state
  chartProp,
  tabState,
}: any) => {
  console.log("DashGraph", softUI);
  // compute the dimensions of each graph to be displayed in dashboard and render the appropriate graph here
  const renderGraph = () => {
    var dimensions = {
      height:
        chartProp.properties[propKey].chartType === "simplecard"
          ? parseInt(
              tabState.tabs[tabId].dashTilesDetails[propKey].height,
              10
            ) *
              gridSize.y -
            4
          : (parseInt(
              tabState.tabs[tabId].dashTilesDetails[propKey].height,
              10
            ) *
              gridSize.y *
              28) /
              30 -
            32,
      width:
        chartProp.properties[propKey].chartType === "simplecard"
          ? parseInt(tabState.tabs[tabId].dashTilesDetails[propKey].width, 10) *
              gridSize.x -
            4
          : (parseInt(
              tabState.tabs[tabId].dashTilesDetails[propKey].width,
              10
            ) *
              gridSize.x *
              24) /
              25 -
            4,
    };

    switch (chartProp?.properties[propKey]?.chartType) {
      case "multibar":
        return (
          <div className="{tileStyleSoft}">
            <MultiBarChart
              propKey={propKey}
              graphDimension={dimensions}
              chartArea="dashboard"
              colorScheme={colorScheme}
              softUI={softUI}
            />
          </div>
        );

      case "horizontalBar":
        return (
          <div className="{tileStyleSoft}">
            <HorizontalBar
              propKey={propKey}
              graphDimension={dimensions}
              chartArea="dashboard"
              colorScheme={colorScheme}
              softUI={softUI}
            />
          </div>
        );

      case "horizontalStacked":
        return (
          <div className="{tileStyleSoft}">
            <Horizontalstacked
              propKey={propKey}
              graphDimension={dimensions}
              chartArea="dashboard"
              colorScheme={colorScheme}
              softUI={softUI}
            />
          </div>
        );

      case "crossTab":
        return (
          <div className="{tileStyleSoft}">
          <CrossTabChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );

      case "stackedBar":
        return (
          <div className="{tileStyleSoft}">
          <StackedBar
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );

      case "line":
        return (
          <div className="{tileStyleSoft}">
          <LineChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );

      case "area":
        return (
          <div className="{tileStyleSoft}">
          <AreaChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );

      case "pie":
        return (
          <div className="{tileStyleSoft}">
          <PieChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
            
          />
          </div>
        );

      case "donut":
        return (
          <div className="{tileStyleSoft}">
          <DoughnutChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );

      case "rose":
        return (
          <div className="{tileStyleSoft}">
          <RoseChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );

      case "funnel":
        return (
          <div className="{tileStyleSoft}">
          <FunnelChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );

      case "gauge":
        return (
          <div className="{tileStyleSoft}">
          <GaugeChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );

      case "heatmap":
        return (
          <div className="{tileStyleSoft}">
          <HeatMap
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );

      case "scatterPlot":
        return (
          <div className="{tileStyleSoft}">
          <ScatterChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );
      case "stackedArea":
        return (
          <div className="{tileStyleSoft}">
          <StackedAreaChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );

      case "filledMap":
        return (
          <div className="{tileStyleSoft}">
          <FilledMap
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );

      case "bubbleMap":
        return (
          <div className="{tileStyleSoft}">
          <BubbleMap
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );

      case "calendar":
        return (
          <div className="{tileStyleSoft}">
          <CalendarChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );
      case "boxPlot":
        return (
          <div className="{tileStyleSoft}">
          <BoxPlotChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );
      case "treeMap":
        return (
          <div className="{tileStyleSoft}">
          <TreeMap
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );
      case "sankey":
        return (
          <div className="{tileStyleSoft}">
          <Sankey
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );
      case "richText":
        return (
          <div className="{tileStyleSoft}">
          <TextEditor
            propKey={propKey}
            graphDimension={dimensions}
            
            // chartArea="dashboard"
          />
          </div>
        );
      case "simplecard":
        return (
          <div className="{tileStyleSoft}">
          <SimpleCard
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          />
          </div>
        );
      case "table":
        return (
          <div className="{tileStyleSoft}">
          <TableChart
            propKey={propKey}
            graphDimension={dimensions}
            chartArea="dashboard"
            colorScheme={colorScheme}
            softUI={softUI}
          ></TableChart>
          </div>
        );
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
