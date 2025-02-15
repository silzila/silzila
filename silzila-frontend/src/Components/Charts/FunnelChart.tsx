import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  ChartControlsProps,
  ChartControlStateProps,
} from "../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import { formatChartLabelValue, formatChartLabelValueForSelectedMeasure } from "../ChartOptions/Format/NumberFormatter";
import {
  ChartsMapStateToProps,
  ChartsReduxStateProps,
  FormatterValueProps,
} from "./ChartsCommonInterfaces";

import { palette } from "../..";

import {getContrastColor} from '../CommonFunctions/CommonFunctions';


const FunnelChart = ({
  //props
  propKey,
  graphDimension,
  chartArea,
  graphTileSize,
  colorScheme,
  softUI,

  //state
  chartControls,
  chartProperties
}: ChartsReduxStateProps) => {
  var chartControl: ChartControlsProps = chartControls.properties[propKey];
  let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

  const [funnelChartData, setFunnelChartData] = useState<any[]>([]);

  useEffect(() => {
    if (chartData.length >= 1) {
      var funnelChartData: any[] = [];
      Object.keys(chartData[0]).forEach((key: string) => {

        funnelChartData.push({
          name: key,
          value: chartData[0][key],
        });
      });
      setFunnelChartData(funnelChartData);
    }
  }, [chartData]);
  var chartThemes: any[] = ColorSchemes.filter((el) => {
    if(colorScheme)
     return el.name === colorScheme;
    else 
    return el.name === chartControl.colorScheme
  });

  const RenderChart = () => {

    return (
      <ReactEcharts
        // theme={chartControl.colorScheme}
        style={{
          padding: "1rem",
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
          animation: chartArea ? false : true,
          legend: {
            // textStyle :{color : getContrastColor(chartThemes[0].background)},
            type: "scroll",
            show:
              graphDimension.height > 200
                ? chartControl.legendOptions?.showLegend
                : false,
            itemHeight:
              chartArea === "dashboard"
                ? chartControl.legendOptions?.symbolHeight / 2
                : chartControl.legendOptions?.symbolHeight,
            itemWidth:
              chartArea === "dashboard"
                ? chartControl.legendOptions?.symbolWidth / 2
                : chartControl.legendOptions?.symbolWidth,
            itemGap: chartControl.legendOptions?.itemGap,

            left: chartControl.legendOptions?.position?.left,
            top: chartControl.legendOptions?.position?.top,
            orient: chartControl.legendOptions?.orientation,
            textStyle:{
              color:chartThemes[0].dark?"#ffffff":palette.primary.contrastText,
            }
          },

          tooltip: { show: chartControl.mouseOver.enable },
          dataset: {
            source: funnelChartData,
          },

          series: [
            {
              type: "funnel",
              label: {
                show:
                  graphDimension.height > 140 && graphDimension.width > 150
                    ? chartControl.labelOptions.showLabel
                    : false,
                fontSize: chartControl.labelOptions.fontSize,
                color: chartControl.labelOptions.labelColorManual
                  ? chartControl.labelOptions.labelColor
                  : null,
                formatter: (value: FormatterValueProps) => {

                  var formattedValue = value.value.value;
                  formattedValue = formatChartLabelValueForSelectedMeasure(
                    chartControls.properties[propKey],
                    chartProperties.properties[propKey],
                    formattedValue,
                    value.value.name
                  );
                  return formattedValue;
                },
              },
              top:
                chartControl.legendOptions?.position?.top === "top"
                  ? chartControl.chartMargin.top + 5 + "%"
                  : chartControl.chartMargin.top + "%",
              bottom:
                chartControl.legendOptions?.position?.top === "bottom"
                  ? (graphDimension.height * chartControl.chartMargin.bottom) /
                      100 +
                    20
                  : chartControl.chartMargin.bottom + "%",
              left: chartControl.chartMargin.funnelLeft + "%",
              right: chartControl.chartMargin.funnelRight + "%",
              itemStyle:softUI? {
                shadowBlur: 10, // Intensity of the blur
                shadowColor: "rgba(0, 0, 0, 0.5)", // Shadow color
                shadowOffsetX: 5, // Horizontal shadow offset
                shadowOffsetY: 5, // Vertical shadow offset
              }:{},
            },
          ],
        }}
      />
    );
  };

  return chartData.length >= 1 ? <RenderChart /> : null;
};
const mapStateToProps = (state: ChartsMapStateToProps, ownProps: any) => {
  return {
    chartControls: state.chartControls,
    chartProperties: state.chartProperties
  };
};

export default connect(mapStateToProps, null)(FunnelChart);
