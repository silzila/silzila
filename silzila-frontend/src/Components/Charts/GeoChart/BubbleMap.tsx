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
  ChartsMapStateToProps,
  ChartsReduxStateProps,
  FormatterValueProps,
} from "../ChartsCommonInterfaces";

import {
  interpolateColor,
  fieldName,
  displayName,
} from "../../CommonFunctions/CommonFunctions";
import { getGeoJSON } from "./GeoJSON/MapCommonFunctions";
import { updateGeoChartStyleOptions } from "../../../redux/ChartPoperties/ChartControlsActions";
import { UserFilterCardProps } from "../../ChartFieldFilter/UserFilterCardInterface";
import { getChartData } from "../../ChartAxes/ChartData";
import FetchData from "../../ServerCall/FetchData";
import { AxesValuProps } from "../../ChartAxes/ChartAxesInterfaces";
import { Dispatch } from "redux";

export var bgColors: { [key: string]: string } = {};

const BubbleMap = ({
  //props
  propKey,
  graphDimension,

  chartGroup,
  dashBoardGroup,
  token,

  //state
  chartControls,
  chartProperties,
}: ChartsReduxStateProps & UserFilterCardProps & any) => {
  var type = chartProperties.properties[propKey].Geo.geoMapKey;

  var chartControl: ChartControlsProps = chartControls.properties[propKey];

  var geoStyle: ChartConGeoChartControls =
    chartControls.properties[propKey].geoChartControls || {};

  let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];
  let mapData: any[] = [];
  let _locationField = chartProperties.properties[propKey].chartAxes[2];
  let _dimensionField = chartProperties.properties[propKey].chartAxes[1];
  let _measureField = chartProperties.properties[propKey].chartAxes[3];
  // let keyName = fieldName(_locationField.fields[0]);
  let keyName = displayName(_locationField.fields[0]);
  let dimName = fieldName(_dimensionField.fields[0]);
  let dimDispName = displayName(_dimensionField.fields[0]);
  let valueName = fieldName(_measureField.fields[0]);
  let valueDispName = displayName(_measureField.fields[0]);
  const [options, setOptions] = useState({});
  let index = 0;
  geoStyle.bgCol = bgColors;
  updateGeoChartStyleOptions(propKey, "bgCol", bgColors);

  let bubbleSize: any[] = [];

  function extractLastWord(inputString: string) {
    // Split the string by " of " and return the last element
    if (inputString) {
      const parts = inputString?.split(" of ");
      return parts[parts.length - 1];
    }
  }
  valueDispName = extractLastWord(valueDispName);

  // For making an API call for getting bubble size
  let axes: AxesValuProps[] = [];
  axes.push(chartProperties.properties[propKey].chartAxes[0]);
  axes.push(chartProperties.properties[propKey].chartAxes[2]);
  axes.push(chartProperties.properties[propKey].chartAxes[3]);

  axes = JSON.parse(JSON.stringify(axes));

  let res: any;
  const [queryRes, setqueryRes] = useState<any>([]);
  const getBubbleSizeQuery = () => {
    getChartData(
      axes,
      chartProperties,
      chartGroup,
      dashBoardGroup,
      propKey,
      "Chartaxes",
      token,
      chartProperties.properties[propKey].chartType,
      true
    ).then(async (data) => {
      var url: string = "";
      if (chartProperties.properties[propKey].selectedDs.isFlatFileData) {
        url = `query?datasetid=${chartProperties.properties[propKey].selectedDs.id}`;
      } else {
        url = `query?dbconnectionid=${chartProperties.properties[propKey].selectedDs.connectionId}&datasetid=${chartProperties.properties[propKey].selectedDs.id}&workspaceId=${chartProperties.properties[propKey].selectedDs.workSpaceId}`;
      }
      res = await FetchData({
        requestType: "withData",
        method: "POST",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      });
      setqueryRes(res);
    });
  };

  useEffect(() => {
    axes = JSON.parse(JSON.stringify(axes));
    getBubbleSizeQuery();
  }, [
    chartProperties.properties[propKey].chartAxes[3].fields[0],
    chartProperties.properties[propKey].chartAxes[2].fields[0],
    chartProperties.properties[propKey].chartAxes[3]?.fields[0]?.agg,
  ]);

  useEffect(() => {
    bgColors = {};
    const newBgColors = {
      ...bgColors,
      // ...geoStyle.bgCol,
    };
    updateGeoChartStyleOptions(propKey, "bgCol", newBgColors);

    index = 0;
    mapData.forEach((item) => {
      if (!geoStyle.bgCol[item.dim]) {
        if (index < chartThemes[0].colors.length) {
          index++;
          bgColors[item.dim] = chartThemes[0].colors[index - 1];
          const newBgColors = {
            ...geoStyle.bgCol,
            [item.dim]: chartThemes[0].colors[index - 1],
          };
          updateGeoChartStyleOptions(propKey, "bgCol", newBgColors);
        } else {
          index = 0;
          index++;
          bgColors[item.dim] = chartThemes[0].colors[index - 1];
          const newBgColors = {
            // ...bgColors,
            ...geoStyle.bgCol,
            [item.dim]: chartThemes[0].colors[index - 1],
          };
          updateGeoChartStyleOptions(propKey, "bgCol", newBgColors);
        }
      }
    });
  }, [mapData[0]?.dim, dimName]);

  var chartThemes: any[] = ColorSchemes.filter((el) => {
    return el.name === chartControl.colorScheme;
  });

  var mapJSON: any = {};

  async function registerGeoMap(name: string) {
    //https://code.highcharts.com/mapdata/
    //https://github.com/adarshbiradar/maps-geojson/tree/master/states
    var ROOT_PATH = "https://echarts.apache.org/examples";

    mapJSON = getGeoJSON(name);

    echarts.registerMap(name, mapJSON, {});
  }

  registerGeoMap(chartProperties.properties[propKey].Geo.geoLocation);

  const convertIntoMapData = async () => {
    bubbleSize = queryRes?.data?.map((item: any) => {
      return {
        name: item[keyName],
        value: item[valueDispName],
      };
    });

    if (chartData && chartData.length > 0) {
      let keyNameArray: string[] = [];
      let matchingMapJSONArray: any = [];

      chartData?.map((item) => {
        keyNameArray.push(item[keyName]?.toString().trim());
      });

      mapJSON.features.forEach((item: any) => {
        if (keyNameArray.includes(item.properties[type])) {
          matchingMapJSONArray.push({
            key: item.properties[type],
            name: item.properties["name"],
          });
        }
      });

      const hasNullValues = chartData.some((item) =>
        item.hasOwnProperty(dimName)
      );

      mapData = chartData?.map((item) => {
        return {
          name: matchingMapJSONArray.find(
            (match: any) => match.key === item[keyName]?.trim()
          )?.name,
          value: item[valueName] || 0,
          key: item[keyName],
          // dim: item[dimName]
          //   ? item[dimName]
          //   : item[dimName] === null
          //   ? "null"
          //   : "",
          dim: !hasNullValues
            ? ""
            : item[dimName] === null
            ? "null"
            : item[dimName],
          // dim: !chartData[0].hasOwnProperty(dimName) ? "" : item[dimName],
          size: bubbleSize?.find(
            (match: any) => match.name === item[keyName]?.trim()
          )?.value,
        };
      });

      setBgColors();

      if (
        chartProperties.properties[propKey].Geo.unMatchedChartData?.length > 0
      ) {
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

  const setBgColors = () => {
    index = 0;
    mapData.forEach((item) => {
      if (!geoStyle.bgCol[item.dim]) {
        if (index < chartThemes[0].colors.length) {
          index++;
          bgColors[item.dim] = chartThemes[0].colors[index - 1];
          bgColors = JSON.parse(JSON.stringify(bgColors));
          const newBgColors = {
            ...bgColors,
            [item.dim]: chartThemes[0].colors[index - 1],
          };
          updateGeoChartStyleOptions(propKey, "bgCol", newBgColors);
        } else {
          index = 0;
          index++;
          bgColors[item.dim] = chartThemes[0].colors[index - 1];
          bgColors = JSON.parse(JSON.stringify(bgColors));
          const newBgColors = {
            ...bgColors,
            // ...geoStyle.bgCol,
            [item.dim]: chartThemes[0].colors[index - 1],
          };
          updateGeoChartStyleOptions(propKey, "bgCol", newBgColors);
        }
      }
    });
  };

  function renderBubble(
    center: string | number[],
    radius: number
  ): echarts.PieSeriesOption {
    setBgColors();
    let data = [];
    data = mapData.map((dataItem) => {
      if (dataItem.name && dataItem.name === center) {
        return {
          value: dataItem.value,
          name:
            keyName +
            " : " +
            dataItem.key +
            ", " +
            (dimDispName
              ? dimDispName +
                " : " +
                (dataItem.dim !== undefined ? dataItem.dim : "") +
                ", "
              : "") +
            valueName +
            " ",
          // itemStyle: {
          //   color: bgColors[dataItem.dim],
          // },
          itemStyle:
            dataItem.dim && dataItem.dim !== undefined
              ? { color: geoStyle.bgCol[dataItem.dim] }
              : {},
        };
      }
    });
    const filteredData = data.filter((item) => item !== undefined);

    let colors = chartProperties.properties[propKey].chartAxes[1].fields[0]
      ? // ? chartThemes[0].colors
        geoStyle.bgCol
      : // null
        interpolateColor(geoStyle.minColor, geoStyle.maxColor, 20);

    return {
      type: "pie",
      coordinateSystem: "geo",

      color: colors,

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
    setBgColors();
    convertIntoMapData();

    let maxMeasureValue: number = 100;
    let minMeasureValue: number = 0;
    if (bubbleSize && bubbleSize.length > 0) {
      maxMeasureValue = bubbleSize.reduce((max, obj) => {
        if (obj && obj.value !== undefined) {
          return obj.value > max ? obj.value : max;
        }
        return max;
      }, bubbleSize[0].value);
      minMeasureValue = bubbleSize.reduce((min, obj) => {
        if (obj && obj.value !== undefined) {
          return obj.value < min ? obj.value : min;
        }
        return min;
      }, bubbleSize[0].value);
    }

    const series = mapData.map((dataItem) => {
      let rad = dataItem.value;
      bubbleSize?.forEach((item) => {
        if (dataItem.key === item.name) {
          rad = item.value;
        }
      });
      let geoWidth = Math.min(graphDimension.width, graphDimension.height);
      const maxBubbleSizes =
        (((geoWidth * geoStyle.mapZoom) / 10) * geoStyle.maxBubbleSize) / 100; //+
      // 10;
      const minBubbleSizes =
        (((geoWidth * geoStyle.mapZoom) / 10) * geoStyle.minBubbleSize) / 100; //+
      // 10;
      let radius =
        ((rad - minMeasureValue) / (maxMeasureValue - minMeasureValue)) *
          (maxBubbleSizes - minBubbleSizes) +
        minBubbleSizes;
      if (radius > (geoWidth * geoStyle.mapZoom) / 15)
        radius = (geoWidth * geoStyle.mapZoom) / 15;
      if (dataItem.name) return renderBubble(dataItem.name, radius);
    });

    let inRange = !chartProperties.properties[propKey].chartAxes[1].fields[0]
      ? { color: interpolateColor(geoStyle.minColor, geoStyle.maxColor, 20) }
      : // : geoStyle.bgCol;
        { color: "#949596" };

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

        // roam: true,
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

              inRange,

              text: ["Max", "Min"],
              calculable: true,
              // show: geoStyle.showVisualScale,
              show:
                graphDimension.height > 200 && graphDimension.width > 265
                  ? geoStyle.showVisualScale
                  : false,
            }
          : null,

      series: [...series],
    });
  }, [
    chartControl,
    chartProperties.properties[propKey].Geo,
    type,
    bgColors,
    geoStyle,
    graphDimension,
    geoStyle.bgCol,
    queryRes,
  ]);

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

const mapStateToProps = (state: ChartsMapStateToProps & any, ownProps: any) => {
  return {
    chartControls: state.chartControls,
    chartProperties: state.chartProperties,
    chartGroup: state.chartFilterGroup,
    token: state.isLogged.accessToken,
    dashBoardGroup: state.dashBoardFilterGroup,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    updateGeoChartStyleOptions: (propKey: string, option: string, value: any) =>
      dispatch(updateGeoChartStyleOptions(propKey, option, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BubbleMap);
