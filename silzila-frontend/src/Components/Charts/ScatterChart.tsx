import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import {
  formatChartLabelValue,
  formatChartXAxisValue,
  formatChartYAxisValue,
} from "../ChartOptions/Format/NumberFormatter";
import {
  ChartsMapStateToProps,
  ChartsReduxStateProps,
  FormatterValueProps,
} from "./ChartsCommonInterfaces";

import { palette } from "../..";

import {getContrastColor} from '../CommonFunctions/CommonFunctions';


const ScatterChart = ({
  //props
  propKey,
  graphDimension,
  chartArea,
  graphTileSize,
  colorScheme,
  softUI,

  //state
  chartControls,
}: ChartsReduxStateProps) => {
  var chartControl: ChartControlsProps = chartControls.properties[propKey];

  let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

  const [seriesData, setSeriesData] = useState<any>([]);

  const processedChartData = chartData.map(item => {
    return Object.fromEntries(
        Object.entries(item).map(([key, value]) => [
            key,
            value === null 
                ? "(Blank)" 
                : typeof value === "boolean" 
                    ? value ? "True" : "False" 
                    : value
        ])
    );
  });

  useEffect(() => {
    if (chartData.length >= 1) {
      var chartDataKeys = Object.keys(chartData[0]);
      for (let i = 0; i < Object.keys(chartData[0]).length - 1; i++) {
        var seriesObj: any = {
          symbolSize: chartArea === "dashboard" ? 10 : 20,
          type: "scatter",
          encode: {
            x: chartData ? Object.keys(chartData[0])[1] : "",
            y: chartData ? Object.keys(chartData[0])[2] : "",
            tooltip: chartData ? Object.keys(chartData[0])[0] : "",
          },
          name: chartData ? Object.keys(chartData[0])[0] : "",
          itemStyle:softUI? {
            shadowColor: "rgba(0, 0, 0, 0.5)", // Shadow color
            shadowBlur: 10, // Blur radius
            shadowOffsetX: 3, // Horizontal shadow offset
            shadowOffsetY: 3, // Vertical shadow offset
          }:{},
          label: {
            show:
              graphDimension.height > 140 && graphDimension.height > 150
                ? chartControl.labelOptions.showLabel
                : false,
            fontSize: chartControl.labelOptions.fontSize,
            color: chartControl.labelOptions.labelColorManual
              ? chartControl.labelOptions.labelColor
              : null,

            formatter: (value: FormatterValueProps) => {
              var formattedValue = value.value[chartDataKeys[i + 1]];

              formattedValue = formatChartLabelValue(
                chartControl,
                formattedValue
              );

              return formattedValue;
            },
          },
        };
      }
      setSeriesData(seriesObj);
    }
  }, [chartData, chartControl.formatOptions,softUI]);
  var chartThemes: any[] = ColorSchemes.filter((el) => {
    if(colorScheme)
     return el.name === colorScheme;
    else 
    return el.name === chartControl.colorScheme
  });

  const getTopMarginForLegend = () => {
    var top = "";
    if (chartControl.legendOptions?.position?.top === "top") {
      top = "top";
      // } else if (chartControl.legendOptions?.position?.top === "bottom") {
      //   top = "90%";
    } else {
      top = "50%";
    }
    return top;
  };

  const RenderChart = () => {
    return (
      <>
        <ReactEcharts
          // theme={chartControl.colorScheme}
          style={{
            // padding: "1rem",
            width: graphDimension.width,
            height: graphDimension.height,
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
                graphDimension.height > 210
                  ? chartControl.legendOptions?.showLegend
                  : false,
              itemHeight: chartControl.legendOptions?.symbolHeight,
              itemWidth: chartControl.legendOptions?.symbolWidth,
              itemGap: chartControl.legendOptions?.itemGap,

              left: chartControl.legendOptions?.position?.left,
              top:
                chartControl.legendOptions?.position?.top !== "bottom"
                  ? getTopMarginForLegend()
                  : null,
              // top: chartControl.legendOptions?.position?.top,
              bottom:
                chartControl.legendOptions?.position?.top === "bottom"
                  ? 0
                  : null,
              orient: chartControl.legendOptions?.orientation,
              textStyle:{
                color:chartThemes[0].dark?"#ffffff":palette.primary.contrastText,
              }
            },
            grid: {
              left: chartControl.chartMargin.left + 5 + "%",
              right: chartControl.chartMargin.right + "%",
              top:
                chartControl.legendOptions?.position?.top === "top"
                  ? chartControl.chartMargin.top + 5 + "%"
                  : chartControl.chartMargin.top + "%",
              bottom:
                chartControl.legendOptions?.position?.top === "bottom"
                  ? (graphDimension.height * chartControl.chartMargin.bottom) /
                      100 +
                    35
                  : chartControl.chartMargin.bottom + "%",
                   shadowColor: "rgba(0, 0, 0, 0.3)", // Shadow color for grid
                  shadowBlur: 5, // Shadow blur for grid
                  shadowOffsetX: 2, // Horizontal shadow offset for grid
                  shadowOffsetY: 2, // Vertical shadow offset for grid
            },
            tooltip: { show: chartControl.mouseOver.enable },
            dataset: {
              dimensions: Object.keys(processedChartData[0]),
              source: processedChartData,
            },
            xAxis: {
              position: chartControl.axisOptions.xAxis.position,

              min: chartControl.axisOptions.scatterChartMinMax.x_enableMin
                ? chartControl.axisOptions.scatterChartMinMax.x_minValue
                : null,
              max: chartControl.axisOptions.scatterChartMinMax.x_enableMax
                ? chartControl.axisOptions.scatterChartMinMax.x_maxValue
                : null,

              axisLine: {
                onZero: chartControl.axisOptions.xAxis.onZero,
              },

              show:
                graphDimension.height > 140 && graphDimension.height > 150
                  ? chartControl.axisOptions.xAxis.showLabel
                  : false,

              name: chartControl.axisOptions.xAxis.name,
              nameLocation: chartControl.axisOptions.xAxis.nameLocation,
              nameGap: chartControl.axisOptions.xAxis.nameGap,
              nameTextStyle: {
                fontSize: chartControl.axisOptions.xAxis.nameSize,
                color: chartControl.axisOptions.xAxis.nameColor,
              },

              axisTick: {
                alignWithLabel: true,
                length:
                  chartControl.axisOptions.xAxis.position === "top"
                    ? chartControl.axisOptions.xAxis.tickSizeTop
                    : chartControl.axisOptions.xAxis.tickSizeBottom,
              },
              axisLabel: {
                rotate:
                  chartControl.axisOptions.xAxis.position === "top"
                    ? chartControl.axisOptions.xAxis.tickRotationTop
                    : chartControl.axisOptions.xAxis.tickRotationBottom,
                margin:
                  chartControl.axisOptions.xAxis.position === "top"
                    ? chartControl.axisOptions.xAxis.tickPaddingTop
                    : chartControl.axisOptions.xAxis.tickPaddingBottom,

                formatter: (value: number) => {
                  var formattedValue = formatChartXAxisValue(
                    chartControl,
                    value
                  );
                  return formattedValue;
                },
              },
            },
            yAxis: {
              position: chartControl.axisOptions.yAxis.position,

              axisLine: {
                onZero: chartControl.axisOptions.yAxis.onZero,
              },

              min: chartControl.axisOptions.scatterChartMinMax.y_enableMin
                ? chartControl.axisOptions.scatterChartMinMax.y_minValue
                : null,
              max: chartControl.axisOptions.scatterChartMinMax.y_enableMax
                ? chartControl.axisOptions.scatterChartMinMax.y_maxValue
                : null,

              axisTick: {
                alignWithLabel: true,
                length:
                  chartControl.axisOptions.yAxis.position === "left"
                    ? chartControl.axisOptions.yAxis.tickSizeLeft
                    : chartControl.axisOptions.yAxis.tickSizeRight,
              },

              show:
                graphDimension.height > 140 && graphDimension.height > 150
                  ? chartControl.axisOptions.yAxis.showLabel
                  : false,

              name: chartControl.axisOptions.yAxis.name,
              nameLocation: chartControl.axisOptions.yAxis.nameLocation,
              nameGap: chartControl.axisOptions.yAxis.nameGap,
              nameTextStyle: {
                fontSize: chartControl.axisOptions.yAxis.nameSize,
                color: chartControl.axisOptions.yAxis.nameColor,
              },

              axisLabel: {
                rotate:
                  chartControl.axisOptions.yAxis.position === "left"
                    ? chartControl.axisOptions.yAxis.tickRotationLeft
                    : chartControl.axisOptions.yAxis.tickRotationRight,
                margin:
                  chartControl.axisOptions.yAxis.position === "left"
                    ? chartControl.axisOptions.yAxis.tickPaddingLeft
                    : chartControl.axisOptions.yAxis.tickPaddingRight,

                formatter: (value: number) => {
                  var formattedValue = formatChartYAxisValue(
                    chartControl,
                    value
                  );
                  return formattedValue;
                },
              },
            },
            series: seriesData,
          }}
        />
      </>
    );
  };
  return <>{chartData.length >= 1 ? <RenderChart /> : ""}</>;
};

const mapStateToProps = (state: ChartsMapStateToProps, ownProps: any) => {
  return {
    chartControls: state.chartControls,
  };
};

export default connect(mapStateToProps, null)(ScatterChart);