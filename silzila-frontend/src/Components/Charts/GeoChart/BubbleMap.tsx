import React from "react";
import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";

import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  ChartControlsProps,
  ChartConGeoChartControls,
} from "../../../redux/ChartPoperties/ChartControlsInterface";
import { ColorSchemes } from "../../ChartOptions/Color/ColorScheme";
import {
  formatChartLabelValue,
  formatChartYAxisValue,
} from "../../ChartOptions/Format/NumberFormatter";

import {
  ChartsMapStateToProps,
  ChartsReduxStateProps,
  FormatterValueProps,
} from "../ChartsCommonInterfaces";

import {
  interpolateColor,
  generateRandomColorArray,
  fieldName,
  getLabelValues,
} from "../../CommonFunctions/CommonFunctions";
import { getGeoJSON } from "./GeoJSON/MapCommonFunctions";

const BubbleMap = ({
  //props
  propKey,
  graphDimension,
  chartArea,
  graphTileSize,

  //state
  chartControls,
  chartProperties,
}: ChartsReduxStateProps) => {
  var type = chartProperties.properties[propKey].Geo.geoMapKey;

  var chartControl: ChartControlsProps = chartControls.properties[propKey];

  var geoStyle: ChartConGeoChartControls =
    chartControls.properties[propKey].geoChartControls || {};

  let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];
  let mapData: any[] = [];
  let _dimensionField = chartProperties.properties[propKey].chartAxes[2];
  let _dimensionField1 = chartProperties.properties[propKey].chartAxes[1];
  let _measureField = chartProperties.properties[propKey].chartAxes[3];
  let keyName = fieldName(_dimensionField.fields[0]);
  let keyName1 = fieldName(_dimensionField1.fields[0]);
  let valueName = fieldName(_measureField.fields[0]);
  const [options, setOptions] = useState({});

  var mapJSON: any = {};

  async function registerGeoMap(name: string) {
    //https://code.highcharts.com/mapdata/
    //https://github.com/adarshbiradar/maps-geojson/tree/master/states
    var ROOT_PATH = "https://echarts.apache.org/examples";

    mapJSON = getGeoJSON(name);

    echarts.registerMap(name, mapJSON, {});
  }

  registerGeoMap(chartProperties.properties[propKey].Geo.geoLocation);

  const convertIntoMapData = () => {
    if (chartData && chartData.length > 0) {
      let keyNameArray: string[] = [];
      let matchingMapJSONArray: any = [];

      chartData?.map((item) => {
        keyNameArray.push(item[keyName]?.toString().trim());
      });

      mapJSON.features.forEach((item: any) => {
        // console.log(item.properties["name"]);
        // console.log(item.properties[type]);
        if (keyNameArray.includes(item.properties[type])) {
          matchingMapJSONArray.push({
            key: item.properties[type],
            name: item.properties["name"],
          });
        }
      });

      // matchingMapJSONArray = [
      //   { key: "Bangalore", name: "Karnataka" },
      //   { key: "Chennai", name: "Tamil Nadu" },
      //   { key: "Delhi", name: "NCT of Delhi" },
      //   { key: "Mumbai", name: "Maharashtra" },
      //   { key: "Pune", name: "Maharashtra" },
      // ];
      // console.log(keyNameArray);
      // console.log(matchingMapJSONArray);
      // console.log(chartData);
      mapData = chartData?.map((item) => {
        return {
          name: matchingMapJSONArray.find(
            (match: any) => match.key === item[keyName]?.trim()
          )?.name,
          value: item[valueName] || 0,
          key: item[keyName],
          dim: item[keyName1],
        };
      });
      // console.log("Initial MapData:", JSON.stringify(mapData, null, 2));

      // mapData = chartData?.map((item) => {
      //   const matchingItem = matchingMapJSONArray.find(
      //     (match: any) => match.key === item[keyName]?.trim()
      //   );

      //   console.log(`Processing item: ${JSON.stringify(item)}`);
      //   console.log(`Matched with: ${JSON.stringify(matchingItem)}`);
      //   return {
      //     name: matchingItem ? matchingItem.name : "Unknown", // Default value if no match found
      //     value: item[valueName] || 0,
      //     key: item[keyName],
      //     dim: item[keyName1],
      //   };
      // });

      //////////////////////////////
      // console.log(mapJSON.features);
      // console.log(JSON.stringify(mapData, null, 2));
      // console.log(chartData);
      console.log(mapData);

      if (
        chartProperties.properties[propKey].Geo.unMatchedChartData?.length > 0
      ) {
        // console.log(chartProperties.properties[propKey].Geo.unMatchedChartData);
        chartProperties.properties[propKey].Geo.unMatchedChartData.forEach(
          (item: any) => {
            if (item.selectedKey != "") {
              // Find all occurrences of the key in mapData
              const matchingDataItems = mapData.filter(
                (dataItem) => dataItem.key === item[keyName]
              );

              // Update each matching data item
              matchingDataItems.forEach((data) => {
                const name = item.selectedKey.includes(";")
                  ? item.selectedKey.split(";")[1]?.trim()
                  : item.selectedKey;
                data.name = name;
              });
              // console.log(mapData);
              // console.log(data["name"]);
              // console.log(item.selectedKey);
              //}
            }
          }
        );
      }
    }
  };

  const getMinAndMaxValue = (column: string) => {
    if (column && chartData) {
      const valuesArray = chartData?.map((el: any) => {
        return el[column];
      });
      const minValue = Number(Math.min(...valuesArray)).toFixed(2);
      const maxValue = Number(Math.max(...valuesArray)).toFixed(2);

      return { min: minValue, max: maxValue };
    } else {
      return { min: "0", max: "100" };
    }
  };

  function renderBubble(
    center: string | number[],
    radius: number
  ): echarts.PieSeriesOption {
    const data1 = ["A", "B", "C", "D"].map((t) => {
      return {
        value: Math.round(Math.random() * 100),
        name: "Category " + t,
      };
    });
    let data = [];
    data = mapData.map((t) => {
      if (t.name && t.name === center) {
        return {
          value: t.value,
          name: "Category " + (t.dim || ""),
        };
      }
    });
    const filteredData = data.filter((item) => item !== undefined);
    return {
      type: "pie",
      coordinateSystem: "geo",
      color: [
        "#2bb9bb",
        "#af99db",
        "#5ab1ef",
        "#ffb980",
        "#d87a80",
        "#8d98b3",
        "#e5cf0d",
        "#97b552",
        "#95706d",
        "#dc69aa",
      ],
      tooltip: {
        formatter: "{b}: {c} ({d}%)",
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      animationDuration: 0,
      radius,
      center,
      data: filteredData,
    };
  }

  useEffect(() => {
    let mapMinMax: any = getMinAndMaxValue(valueName);
    convertIntoMapData();
    // console.log(graphDimension.height);

    const aggregatedValues: [] = mapData.reduce((acc, item) => {
      if (acc[item.key]) {
        acc[item.key] += item.value;
      } else {
        acc[item.key] = item.value;
      }
      return acc;
    }, {});

    const maxSales = Math.max(...Object.values(aggregatedValues));
    // console.log(aggregatedValues);

    const series = mapData.map((t) => {
      // console.log(aggregatedValues[t.key]);
      const radius = (aggregatedValues[t.key] / maxSales) * 20;
      return renderBubble(t.name || [0, 0], radius);
    });

    setOptions({
      geo: {
        map: chartProperties.properties[propKey].Geo.geoLocation,
        silent: false,
        aspectScale: geoStyle.aspectScale,
        // show: true,
        // emphasis: {
        //   focus: geoStyle.enableSelfEmphasis ? "self" : "normal",
        // },
        // select: {
        //   disabled: true,
        // },
        // label: {
        // normal: {
        //   show:
        //     graphDimension.height > 140 && graphDimension.height > 150
        //       ? chartControl.labelOptions.showLabel
        //       : false,
        //   textStyle: {
        //     color: chartControl.labelOptions.labelColorManual
        //       ? chartControl.labelOptions.labelColor
        //       : null,
        //     fontSize: chartControl.labelOptions.fontSize - 4,
        //   },
        // },
        // emphasis: {
        //   show:
        //     graphDimension.height > 140 && graphDimension.height > 150
        //       ? chartControl.labelOptions.showLabel
        //       : false,
        //   textStyle: {
        //     color: chartControl.labelOptions.labelColorManual
        //       ? chartControl.labelOptions.labelColor
        //       : null,
        //     fontSize: chartControl.labelOptions.fontSize - 4,
        //   },
        // },
        // },
        roam: true,
        zoom: geoStyle.mapZoom,
        // color: [
        //   "#2bb9bb",
        //   "#af99db",
        //   "#5ab1ef",
        //   "#ffb980",
        //   "#d87a80",
        //   "#8d98b3",
        //   "#e5cf0d",
        //   "#97b552",
        //   "#95706d",
        //   "#dc69aa",
        // ],
        itemStyle: {
          normal: {
            areaColor: geoStyle.areaColor,
            borderColor: geoStyle.borderColor,
            borderWidth: geoStyle.boderWidth,
          },
          emphasis: {
            areaColor: geoStyle.emphasisAreaColor,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowBlur: 20,
            borderWidth: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        zlevel: 0,
      },
      /* null / {}	*/
      tooltip: chartControls.properties[propKey].mouseOver.enable
        ? {
            trigger: "item",
            showDelay: 0,
            transitionDuration: 0.2,
          }
        : null,
      // visualMap:
      //   chartData && chartData.length > 0
      //     ? {
      //         left: "right",
      //         min:
      //           geoStyle.minValue === ""
      //             ? Number(isNaN(mapMinMax.min) ? 0 : mapMinMax.min)
      //             : isNaN(Number(geoStyle.minValue))
      //             ? 0
      //             : Number(geoStyle.minValue),
      //         max:
      //           geoStyle.maxValue === ""
      //             ? Number(isNaN(mapMinMax.max) ? 100 : mapMinMax.max)
      //             : isNaN(Number(geoStyle.maxValue))
      //             ? 100
      //             : Number(geoStyle.maxValue),
      //         inRange: {
      //           // color: interpolateColor(
      //           //   geoStyle.minColor,
      //           //   geoStyle.maxColor,
      //           //   20
      //           // ),
      //         },
      //         text: ["Max", "Min"],
      //         calculable: true,
      //         show: geoStyle.showVisualScale,
      //       }
      //     : null,
      series: [
        ...series,
        // renderBubble([-86.753504, 33.01077], 15),
      ],
    });
  }, [chartControl, chartProperties.properties[propKey].Geo, type]);

  const RenderChart = () => {
    return (
      <ReactEcharts
        option={options}
        style={{ width: graphDimension.width, height: graphDimension.height }}
      />
    );
  };

  return <RenderChart />;
};

const mapStateToProps = (state: ChartsMapStateToProps, ownProps: any) => {
  return {
    chartControls: state.chartControls,
    chartProperties: state.chartProperties,
  };
};

export default connect(mapStateToProps, null)(BubbleMap);
