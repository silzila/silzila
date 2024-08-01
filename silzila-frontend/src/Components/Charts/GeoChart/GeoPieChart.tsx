import React from "react";
//import { registerMap } from "echarts";
import * as echarts from "echarts";
import ReactEcharts from "echarts-for-react";
// import USA from "../../assets/USA.json";
// import countries from "../../assets/countries.json";
//import { mapData } from "./data";

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
  let _dimensionField = chartProperties.properties[propKey].chartAxes[1];
  let _measureField = chartProperties.properties[propKey].chartAxes[2];
  let keyName = fieldName(_dimensionField.fields[0]);
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
        //if(typeof item[keyName] === "string"){
        keyNameArray.push(item[keyName]?.toString().trim());
        // }
        // else{
        // 	keyNameArray.push(item[keyName]);
        // }
      });

      mapJSON.features.forEach((item: any) => {
        if (keyNameArray.includes(item.properties[type])) {
          matchingMapJSONArray.push({
            key: item.properties[type],
            name: item.properties["name"],
          });
        }
      });

      mapData = chartData?.map((item) => {
        return {
          name: matchingMapJSONArray.find(
            (match: any) => match.key === item[keyName]?.trim()
          )?.name,
          value: item[valueName] || 0,
          key: item[keyName],
        };
      });

      if (
        chartProperties.properties[propKey].Geo.unMatchedChartData?.length > 0
      ) {
        chartProperties.properties[propKey].Geo.unMatchedChartData.forEach(
          (item: any) => {
            if (item.selectedKey != "") {
              let data: any = mapData.find((dataItem: any) => {
                return dataItem.key == item[keyName];
              });

              // if(chartProperties.properties[propKey].Geo.geoMapKey === "name"){
              // 	if(data){
              // 		data["name"] = item.selectedKey;
              // 	}
              // }
              // else{
              if (data) {
                let name = item.selectedKey.includes(";")
                  ? item.selectedKey.split(";")[1]?.trim()
                  : item.selectedKey;
                data["name"] = name;
              }
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

  function randomPieSeries(
    center: (string | number)[],
    radius: number
  ): echarts.PieSeriesOption {
    const data = ["A", "B", "C", "D"].map((t) => {
      return {
        value: Math.round(Math.random() * 100),
        name: "Category " + t,
      };
    });
    return {
      type: "pie",
      coordinateSystem: "geo",
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
      data,
    };
  }

  useEffect(() => {
    let mapMinMax: any = getMinAndMaxValue(valueName);
    convertIntoMapData();
    // console.log(mapData[0].name);
    console.log(+echarts.version.split(".").slice(0, 3).join(""));

    setOptions({
      geo: {
        map: chartProperties.properties[propKey].Geo.geoLocation,
        silent: false,
        aspectScale: geoStyle.aspectScale,
        show: true,
        emphasis: {
          focus: geoStyle.enableSelfEmphasis ? "self" : "normal",
        },
        select: {
          disabled: true,
        },
        label: {
          normal: {
            show:
              graphDimension.height > 140 && graphDimension.height > 150
                ? chartControl.labelOptions.showLabel
                : false,
            textStyle: {
              color: chartControl.labelOptions.labelColorManual
                ? chartControl.labelOptions.labelColor
                : null,
              fontSize: chartControl.labelOptions.fontSize - 4,
            },
          },
          emphasis: {
            show:
              graphDimension.height > 140 && graphDimension.height > 150
                ? chartControl.labelOptions.showLabel
                : false,
            textStyle: {
              color: chartControl.labelOptions.labelColorManual
                ? chartControl.labelOptions.labelColor
                : null,
              fontSize: chartControl.labelOptions.fontSize - 4,
            },
          },
        },
        roam: true,
        zoom: geoStyle.mapZoom,
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
        zlevel: 1,
      },
      /* null / {}	*/
      tooltip: chartControls.properties[propKey].mouseOver.enable
        ? {
            trigger: "item",
            showDelay: 0,
            transitionDuration: 0.2,
          }
        : null,
      visualMap:
        chartData && chartData.length > 0
          ? {
              left: "right",
              min:
                geoStyle.minValue === ""
                  ? Number(isNaN(mapMinMax.min) ? 0 : mapMinMax.min)
                  : isNaN(Number(geoStyle.minValue))
                  ? 0
                  : Number(geoStyle.minValue),
              max:
                geoStyle.maxValue === ""
                  ? Number(isNaN(mapMinMax.max) ? 100 : mapMinMax.max)
                  : isNaN(Number(geoStyle.maxValue))
                  ? 100
                  : Number(geoStyle.maxValue),
              inRange: {
                color: interpolateColor(
                  geoStyle.minColor,
                  geoStyle.maxColor,
                  20
                ),
              },
              text: ["Max", "Min"],
              calculable: true,
              show: geoStyle.showVisualScale,
            }
          : null,
      // series: [
      //   {
      //     name: valueName,
      //     type: "map",
      //     roam: true,
      //     map: "USA",
      //     geoIndex: 0,
      //     data: mapData || [],
      //     zlevel: 3,
      //     dimensions: ["name", "value"],
      //   },
      // ],
      series: [
        // randomPieSeries([-86.753504, 33.01077], 15),
        // randomPieSeries([-116.853504, 39.8], 25),
        // randomPieSeries([-99, 31.5], 30),
        randomPieSeries(
          // it's also supported to use geo region name as center since v5.4.1
          // +echarts.version.split(".").slice(0, 3).join("") > 540
          // ?
          // mapData[0].name,
          // ["Maine"],
          // .["Uttar Pradesh"],
          // : // or you can only use the LngLat array
          [-69, 45.5],
          45
        ),
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
