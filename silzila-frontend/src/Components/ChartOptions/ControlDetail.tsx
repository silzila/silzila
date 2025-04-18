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
import FilledMapStyles from "./ChartStyle/GeoChartStyles/FilledMapStyles";
import BubbleMapStyles from "./ChartStyle/GeoChartStyles/BubbleMapStyles";
import CalendarChartStyles from "./ChartStyle/CalendarChartStyles";
import ChartStyle from "./ChartStyle/ChartStyle";
import SankeyStyles from "./ChartStyle/SankeyStyles";
import TreeMapStyles from "./ChartStyle/TreeMapStyles";
import ChartTitle from "./Title/ChartTitle";
import { ChartOptionsStateProps } from "./CommonInterfaceForChartOptions";
import CardStyle from "./ChartStyle/CardStyle";
import TitleForDynamicMeasures from "./Title/TitleForDynamicMeasures";
import ChartFormatForDm from "./Format/ChartFormatForDm";
import DynamicMeasureStyle from "./ChartStyle/DynamicMeasureStyle";
import TableConditionalFormating from "./TableChartControlComponents/TableConditionalFormatting";
import DynamicMeasureConditionalFormattingComponent from "./DynamicMeasureConditionalFormattingComponent";
import SimplecardConditionalFormatting from "./SimplecardConditionalFormatting";
import Sort from "./Sort/Sort";
import ShowHide from "./ShowHide/ShowHide";
import BubbleMapColors from "./Color/BubbleMapColors";
import LineChartStyles from "./ChartStyle/LineChartStyles";
import SimpleCardLabel from "./Labels/SimpleCardLabel";
import SimpleCardColors from "./Color/SimpleCardColors";

interface ControlDetailProps {
  chartProperties: ChartPropertiesProps;
  tabTileProps: TabTileStateProps;
}

const ControlDetail = ({
  chartProperties,
  tabTileProps,
  dynamicMeasureState,
}: ControlDetailProps & any) => {
  var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
  var chartType: string = chartProperties.properties[propKey].chartType;
  var chartOption =
    chartType === "richText"
      ? dynamicMeasureState.dynamicMeasureProps?.[tabTileProps.selectedTabId]?.[
          tabTileProps.selectedTileId
        ]?.[
          `${tabTileProps.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`
        ]?.chartOptionSelected
      : chartProperties.properties[propKey].chartOptionSelected;

  const RenderControlDetail = () => {
    switch (chartOption) {
      case "Title":
        if (chartType === "richText") {
          return <TitleForDynamicMeasures />;
        } else {
          return <ChartTitle />;
        }
      case "Colors":
        if (chartType === "heatmap" || chartType === "calendar") {
          return <ColorScale />;
        } else if (chartType === "gauge") {
          return <ColorSteps />;
        } else if (chartType === "sankey") {
          return <SankeyColorControls />;
        } else if (chartType === "bubbleMap") {
          return <BubbleMapColors />;
        } else if (chartType === "simplecard") {
          return <SimpleCardColors />;
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
      case "Label":
        if (chartType === "simplecard") {
          return <SimpleCardLabel />;
        } else {
          return <ChartLabels />;
        }
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
        } else if (chartType === "richText") {
          return <DynamicMeasureStyle />;
        } else if (chartType === "filledMap") {
          return <FilledMapStyles />;
        } else if (chartType === "bubbleMap") {
          return <BubbleMapStyles />;
        } else if (
          chartType === "line" ||
          chartType === "area" ||
          chartType === "stackedArea"
        ) {
          return <LineChartStyles />;
        } else {
          return <ChartStyle />;
        }
      case "Format":
        if (chartType === "richText") {
          return <ChartFormatForDm />;
        } else {
          return <ChartFormat chartType={chartType} />;
        }
      case "Cond.Form":
        //   return <TableConditionalFormating />;
        // case "Conditional Formatting":
        if (chartType === "richText") {
          return <DynamicMeasureConditionalFormattingComponent />;
        } else if (chartType === "simplecard") {
          return <SimplecardConditionalFormatting />;
        } else {
          return <TableConditionalFormating />;
        }
      case "Sort":
        if (chartType === "crossTab") {
          return <Sort />;
        } else {
          return <Sort />;
        }

      default:
        return (
          <span>
            {chartProperties.properties[propKey].chartOptionSelected} properties
            Under Construction
          </span>
        );
    }
  };
  return <RenderControlDetail />;
};
const mapStateToProps = (state: ChartOptionsStateProps & any) => {
  return {
    chartProperties: state.chartProperties,
    tabTileProps: state.tabTileProps,
    dynamicMeasureState: state.dynamicMeasuresState,
  };
};
export default connect(mapStateToProps)(ControlDetail);
