import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import { formatChartLabelValue, formatChartLabelValueForSelectedMeasure } from "../ChartOptions/Format/NumberFormatter";
import {
  ChartsMapStateToProps,
  ChartsReduxStateProps,
  FormatterValueProps,
} from "./ChartsCommonInterfaces";
import { displayName, fieldName } from "../CommonFunctions/CommonFunctions";

import { palette } from "../..";

import {getContrastColor} from '../CommonFunctions/CommonFunctions';


const DoughnutChart = ({
  //props
  propKey,
  graphDimension,
  chartArea,
  graphTileSize,
  colorScheme,
  softUI,

  //state
  chartProperties,
  chartControls,
}: ChartsReduxStateProps) => {
  var chartControl: ChartControlsProps = chartControls.properties[propKey];
  let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

  const [chartDataKeys, setchartDataKeys] = useState<string[]>([]);

  useEffect(() => {
    if (chartControl.chartData.length >= 1) {
      setchartDataKeys(Object.keys(chartData[0]));
      let objKey = chartProperties.properties[propKey]?.chartAxes[1]?.fields[0]?.displayname;
      // if ("timeGrain" in chartProperties.properties[propKey].chartAxes[1].fields[0]) {
      // 	   objKey = `${chartProperties.properties[propKey].chartAxes[1].fields[0].timeGrain} of ${chartProperties.properties[propKey].chartAxes[1].fields[0].fieldname}`;
      // } else {
      // 	   objKey = chartProperties.properties[propKey].chartAxes[1].fields[0].fieldname;
      // }
      if (objKey) {
          // Map over chart data and replace nulls with "(Blank)" without modifying the original array
          const mappedChartData = chartControl.chartData.map((el : any) => {
              const newEl = { ...el }; // Create a shallow copy of the element to avoid direct mutation
              //Converts the negative value from integer to string
              if (objKey in newEl && typeof newEl[objKey] === "number" && !isNaN(newEl[objKey])) {
                newEl[objKey] = newEl[objKey].toString();
              }
              if (newEl[objKey] === null || newEl[objKey] === "null") {
                  newEl[objKey] = "(Blank)";
              } else if (typeof newEl[objKey] === "boolean") {
                newEl[objKey] = newEl[objKey] ? "True" : "False";
              } 
              return newEl;
          });

          if (JSON.stringify(chartControl.chartData) !== JSON.stringify(mappedChartData)) {
              chartControl.chartData = mappedChartData;
          }
      }
    }
  }, [chartData, chartControl]);
  var chartThemes: any[] = ColorSchemes.filter((el) => {
    if(colorScheme)
     return el.name === colorScheme;
    else 
    return el.name === chartControl.colorScheme
  });
  
  const RenderChart = () => {
    return (
      <>
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
            animation: chartArea ? false : true,
            legend: {
              // textStyle :{color : getContrastColor(chartThemes[0].background)},
              type: "scroll",
              show:
                graphDimension.height > 300 && graphDimension.width > 265
                  ? chartControl.legendOptions?.showLegend
                  : false,
              itemHeight: chartControl.legendOptions?.symbolHeight,
              itemWidth: chartControl.legendOptions?.symbolWidth,
              itemGap: chartControl.legendOptions?.itemGap,

              left: chartControl.legendOptions?.position?.left,
              top: chartControl.legendOptions?.position?.top,

              // left: "50%",
              // top: "95%",
              orient: chartControl.legendOptions?.orientation,
              textStyle:{
                color:chartThemes[0].dark?"#ffffff":palette.primary.contrastText,
              }
            },

            tooltip: { show: chartControl.mouseOver.enable },
            dataset: {
              dimensions: Object.keys(chartData[0]),
              source: chartData,
            },
            series: [
              {
                type: "pie",
                startAngle:
                  chartControl.axisOptions.pieAxisOptions.pieStartAngle,
                clockwise: chartControl.axisOptions.pieAxisOptions.clockWise,

                label: {
                  position: chartControl.labelOptions.pieLabel.labelPosition,
                  show:
                    graphDimension.height > 100 && graphDimension.width > 220
                      ? chartControl.labelOptions.showLabel
                      : false,
                  fontSize: chartControl.labelOptions.fontSize,
                  color: chartControl.labelOptions.labelColorManual
                    ? chartControl.labelOptions.labelColor
                    : null,
                  padding: [
                    chartControl.labelOptions.pieLabel.labelPadding,
                    chartControl.labelOptions.pieLabel.labelPadding,
                    chartControl.labelOptions.pieLabel.labelPadding,
                    chartControl.labelOptions.pieLabel.labelPadding,
                  ],

                  /* getting label value*/
                  formatter: (value: FormatterValueProps) => {
                    const columnName = displayName(
                      chartProperties.properties[propKey].chartAxes[2]
                        .fields[0]
                    )
                    if (chartDataKeys) {
                      var formattedValue =
                        value.value[columnName];
                      formattedValue = formatChartLabelValueForSelectedMeasure(
                        chartControls.properties[propKey],
                        chartProperties.properties[propKey],
                        formattedValue,
                        columnName
                      );
                      return formattedValue;
                    }
                  },
                },
                radius: [
                  chartControl.chartMargin.innerRadius + "%",
                  chartControl.chartMargin.outerRadius + "%",
                ],
                itemStyle:softUI? {
                  shadowBlur: 10, // Blur intensity of the shadow
                  shadowColor: "rgba(0, 0, 0, 0.5)", // Shadow color
                  shadowOffsetX: 5, // Horizontal shadow offset
                  shadowOffsetY: 5, // Vertical shadow offset
                }:{},
              },
            ],
          }}
        />
      </>
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

export default connect(mapStateToProps, null)(DoughnutChart);