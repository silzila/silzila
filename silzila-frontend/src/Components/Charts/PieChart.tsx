import ReactEcharts from "echarts-for-react";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  formatChartLabelValue,
  formatChartLabelValueForSelectedMeasure,
} from "../ChartOptions/Format/NumberFormatter";
import { Dispatch } from "redux";
import { updateChartMargins } from "../../redux/ChartPoperties/ChartControlsActions";
import {
  ChartsMapStateToProps,
  ChartsReduxStateProps,
  FormatterValueProps,
} from "./ChartsCommonInterfaces";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import { displayName, fieldName } from "../CommonFunctions/CommonFunctions";

import { palette } from "../..";
import { getContrastColor } from '../CommonFunctions/CommonFunctions';


interface PieChartProps {
  updateChartMargins: (propKey: string, option: string, value: any) => void;
  colorScheme?:string;
  softUI?:boolean;
}
const PieChart = ({
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

  // dispatch
  updateChartMargins,
}: ChartsReduxStateProps & PieChartProps) => {
  var chartControl: ChartControlsProps = chartControls.properties[propKey];
  let chartData: any[] =
    chartControl.chartData && chartControl.chartData.length > 0
      ? chartControl.chartData
      : [];

  const [chartDataKeys, setChartDataKeys] = useState<string[]>([]);
  var chartThemes: any[];

  useEffect(() => {
    if (chartData.length >= 1) {
      if (typeof chartData === "object" && chartData.length > 0) {
        setChartDataKeys(Object.keys(chartData[0]));
      }
      let objKey =
        chartProperties.properties[propKey]?.chartAxes[1]?.fields[0]
          ?.displayname;
      // if ("timeGrain" in chartProperties.properties[propKey].chartAxes[1].fields[0]) {
      // 	   objKey = `${chartProperties.properties[propKey].chartAxes[1].fields[0].timeGrain} of ${chartProperties.properties[propKey].chartAxes[1].fields[0].fieldname}`;
      // } else {
      // 	   objKey = chartProperties.properties[propKey].chartAxes[1].fields[0].fieldname;
      // }
      if (objKey) {
        // Map over chart data and replace nulls with "(Blank)" without modifying the original array
        const mappedChartData = chartControl.chartData.map((el: any) => {
          const newEl = { ...el };
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

        if (
          JSON.stringify(chartControl.chartData) !==
          JSON.stringify(mappedChartData)
        ) {
          chartControl.chartData = mappedChartData;
        }
      }
    }
  }, [chartData, chartControl]);


  chartThemes = ColorSchemes.filter((el) => {
    if(colorScheme)
     return el.name === colorScheme;
    else 
    return el.name === chartControl.colorScheme
  });

  var radius: number = chartControl.chartMargin.radius;
  useEffect(() => {
    if (radius > 100) {
      updateChartMargins(propKey, "radius", 100);
      radius = 100;
    }
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
            animation: false,
            //  chartArea ? false : true,
            legend: {
              // textStyle :{color : getContrastColor(chartThemes[0].background)},
              type: "scroll",
              show:
                graphDimension.height > 270 && graphDimension.width > 265
                  ? chartControl.legendOptions?.showLegend
                  : false,
              itemHeight: chartControl.legendOptions?.symbolHeight,
              itemWidth: chartControl.legendOptions?.symbolWidth,
              itemGap: chartControl.legendOptions?.itemGap,

              left: chartControl.legendOptions?.position?.left,
              top: chartControl.legendOptions?.position?.top,
              orient: chartControl.legendOptions?.orientation,
              textStyle: {
                color: chartThemes[0].dark ? "#ffffff" : palette.primary.contrastText,
              },
              // itemStyle: {
              //   shadowBlur: 10,
              //   shadowColor: 'rgba(25, 100, 150, 0.5)',
              //   // shadowOffsetY: 5,
              //   // color: {
              //   //   type: 'radial',
              //   //   x: 0.4,
              //   //   y: 0.3,
              //   //   r: 1,
              //   //   colorStops: [
              //   //     {
              //   //       offset: 0,
              //   //       color: 'rgb(129, 227, 238)'
              //   //     },
              //   //     {
              //   //       offset: 1,
              //   //       color: 'rgb(25, 183, 207)'
              //   //     }
              //   //   ]
              //   // }
              // }
            },

            tooltip: { show: chartControl.mouseOver.enable },
            dataset: {
              dimensions: chartDataKeys,
              source: chartData,
            },

            series: [
              {
                type: "pie",
                startAngle:
                  chartControl.axisOptions.pieAxisOptions.pieStartAngle,
                clockwise: chartControl.axisOptions.pieAxisOptions.clockWise,
                itemStyle:softUI? {
                  shadowBlur: 10, // Shadow blur size
                  shadowColor: "rgba(0, 0, 0, 1)", // Shadow color
                  shadowOffsetX: 1, // Optional: Horizontal shadow offset
                  shadowOffsetY: 1, // Optional: Vertical shadow offset
                }:{},
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

                  formatter: (value: FormatterValueProps) => {

                    const columnName = displayName(
                      chartProperties.properties[propKey].chartAxes[2].fields[0]
                    );

                    if (chartDataKeys) {
                      var formattedValue = value.value[columnName];

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
                radius: radius + "%",
                //Shadow properties here          
              },
            ],
          }}
        />
      </>
    );
  };
  return <>{chartData.length >= 1 ? <RenderChart /> : ""}</>;
};

const mapStateToProps = (state: ChartsMapStateToProps) => {
  return {
    chartProperties: state.chartProperties,
    chartControls: state.chartControls,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    updateChartMargins: (propKey: string, option: string, value: any) =>
      dispatch(updateChartMargins(propKey, option, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PieChart);