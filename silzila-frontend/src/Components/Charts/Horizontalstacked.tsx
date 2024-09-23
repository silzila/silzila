import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";

import {
  formatChartLabelValue,
  formatChartYAxisValue,
} from "../ChartOptions/Format/NumberFormatter";
import {
  ChartsMapStateToProps,
  ChartsReduxStateProps,
  FormatterValueProps,
} from "./ChartsCommonInterfaces";

const Horizontalstacked = ({
  //props
  propKey,
  graphDimension,
  chartArea,
  graphTileSize,

  //state
  chartControls,
  chartProperties,
}: ChartsReduxStateProps) => {
  // TODO: propblem in applying filters
  var chartControl: ChartControlsProps = chartControls.properties[propKey];

  let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

  const [seriesData, setSeriesData] = useState<any>([]);

  useEffect(() => {
    var seriesDataTemp = [];
    if (chartData.length >= 1) {
      var chartDataKeys = Object.keys(chartData[0]);

      for (let i = 0; i < Object.keys(chartData[0]).length - 1; i++) {
        var seriesObj = {
          type: "bar",
          stack:
            chartProperties.properties[propKey]?.chartAxes[1]?.fields[0]
              ?.fieldname,
          emphasis: {
            focus: "series",
          },
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

        seriesDataTemp.push(seriesObj);
      }
      setSeriesData(seriesDataTemp);
    }
  }, [chartData, chartControl]);
  var chartThemes: any[] = ColorSchemes.filter((el) => {
    return el.name === chartControl.colorScheme;
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
      <ReactEcharts
        // theme={chartControl.colorScheme}
        style={{
          // padding: "1rem",
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
          animation: false,
          legend: {
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
              chartControl.legendOptions?.position?.top === "bottom" ? 0 : null,
            orient: chartControl.legendOptions?.orientation,
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
          },

          tooltip: { show: chartControl.mouseOver.enable },

          dataset: {
            dimensions: Object.keys(chartData[0]),
            source: chartData,
          },

          xAxis: {
            splitLine: {
              show: chartControl.axisOptions?.ySplitLine,
            },

            min: chartControl.axisOptions.axisMinMax.enableMin
              ? chartControl.axisOptions.axisMinMax.minValue
              : null,
            max: chartControl.axisOptions.axisMinMax.enableMax
              ? chartControl.axisOptions.axisMinMax.maxValue
              : null,

            position: chartControl.axisOptions.xAxis.position,
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

            axisLine: {
              onZero: chartControl.axisOptions.xAxis.onZero,
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
                var formattedValue: string = formatChartYAxisValue(
                  chartControl,
                  value
                );
                return formattedValue;
              },
            },
          },

          yAxis: {
            type: "category",
            splitLine: {
              show: chartControl.axisOptions?.xSplitLine,
            },
            inverse: chartControl.axisOptions.inverse,

            position: chartControl.axisOptions.yAxis.position,

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

            axisLine: {
              onZero: chartControl.axisOptions.yAxis.onZero,
            },

            axisTick: {
              alignWithLabel: true,
              length:
                chartControl.axisOptions.yAxis.position === "left"
                  ? chartControl.axisOptions.yAxis.tickSizeLeft
                  : chartControl.axisOptions.yAxis.tickSizeRight,
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
            },
          },

          series: seriesData,
        }}
      />
    );
  };

  return <>{chartData.length >= 1 ? <RenderChart /> : ""}</>;
};

const mapStateToProps = (state: ChartsMapStateToProps, ownProps: any) => {
  return {
    chartProperties: state.chartProperties,
    chartControls: state.chartControls,
  };
};
export default connect(mapStateToProps, null)(Horizontalstacked);
