import React, { useState, useEffect } from "react";
import { ChartControlsProps } from "../../redux/ChartPoperties/ChartControlsInterface";
import { connect } from "react-redux";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import { formatChartLabelValue, formatChartLabelValueForSelectedMeasure } from "../ChartOptions/Format/NumberFormatter";
import { ChartsReduxStateProps } from "./ChartsCommonInterfaces";

import { Dispatch } from "redux";
import { updateCardControls } from "../../redux/ChartPoperties/ChartControlsActions";

import { Rnd } from "react-rnd";
const SimpleCard = ({
  //props
  propKey,
  graphDimension,
  chartArea,
  graphTileSize,
  colorScheme,

  //state
  pageSettings,
  chartControls,
  chartProperties,
  tabtileProps,
  tileState,

  //dispatch
  updateCardControls,
}: ChartsReduxStateProps & any) => {
  var chartControl: ChartControlsProps = chartControls.properties[propKey];
  let chartData: any[] = chartControl.chartData ? chartControl.chartData : [];

  const [backgroundColorValue, setBackgroundColorValue] = useState<
    string | null
  >("");
  const [fontColor, setFontColor] = useState<string | null>("");
  const [italicText, setItalicText] = useState<string | null>("");
  const [boldText, setBoldText] = useState<string | null>("");
  const [textUnderline, setTextUnderline] = useState<string | null>("");
  var formats = chartControl?.simplecardConditionalFormats;

  useEffect(() => {
    if (formats?.length > 0) {
      for (let i = formats.length - 1; i >= 0; i--) {
        if (formats[i].isConditionSatisfied) {
          setBackgroundColorValue(formats[i].backgroundColor);
          setFontColor(formats[i].fontColor);
          setBoldText(formats[i].isBold ? "bold" : "normal");
          setItalicText(formats[i].isItalic ? "italic" : "normal");
          setTextUnderline(formats[i].isUnderlined ? "underline" : "none");
          return;
        }
        if (i === 0 && !formats[i].isConditionSatisfied) {
          setBackgroundColorValue(null);
          setFontColor(null);
          setBoldText(null);
          setItalicText(null);
          setTextUnderline(null);
        }
      }
    } else {
      setBackgroundColorValue(null);
      setFontColor(null);
      setBoldText(null);
      setItalicText(null);
      setTextUnderline(null);
    }
  }, [formats]);

  const [cardData, setCardData] = useState<any[]>([]);

  useEffect(() => {
    if (chartData.length >= 1) {
      setCardData(chartData[0][Object.keys(chartData[0])[0]]);
      updateCardControls(propKey, "subText", Object.keys(chartData[0])[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartData]);

  const getFormatedChartData = () => {
    var formattedValue = cardData;
     if (formattedValue === null) {
      return "(Blank)";
    }
    formattedValue = formatChartLabelValue(chartControl, formattedValue);
    return formattedValue;
  };
  var chartThemes: any[] = ColorSchemes.filter((el) => {
    if(colorScheme)
     return el.name === colorScheme;
    else 
    return el.name === chartControl.colorScheme
  });

  ////////// Use when enabling the dragging option
  // useEffect(() => {
  //   updateCardControls(propKey, "mainTextPos", {
  //     x: graphDimension.width / 3,
  //     y: graphDimension.height / 2 - graphDimension.height / 3,
  //   });
  //   updateCardControls(propKey, "subTextPos", {
  //     x: graphDimension.width / 3.2,
  //     y: graphDimension.height / 2 + graphDimension.height / 16,
  //   });
  // }, [
  //   chartControls.properties[propKey].serverData,
  //   pageSettings.fullScreen,
  //   graphDimension.width,
  //   graphDimension.height,
  //   chartControls.properties[propKey].cardControls.customStyle,
  // ]);

  const RenderChart = () => {
    return (
      <div
        style={{
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
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            height: "100%",
          }}
        >
          <div
            style={{
              margin: "auto",
              border: `${chartControl.cardControls.borderTickness}px ${chartControl.cardControls.dashStyle} ${chartControl.cardControls.borderColor}`,
              borderRadius: `${chartControl.cardControls.borderRadius}px`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignContent: "center",
              backgroundColor:
                chartControls.properties[propKey].cardControls.bgColor,
              // height:
              //   chartControl.cardControls.height < graphDimension.height
              //     ? `${chartControl.cardControls.height}px`
              //     : graphDimension.height,
              // width:
              //   chartControl.cardControls.width < graphDimension.width
              //     ? `${chartControl.cardControls.width}px`
              //     : graphDimension.width,
              width:
                tabtileProps.showDash ||
                !tileState.tiles[propKey]?.graphSizeFull
                  ? graphDimension.width
                  : graphDimension.width / 3,
              height:
                tabtileProps.showDash ||
                !tileState.tiles[propKey]?.graphSizeFull
                  ? graphDimension.height
                  : graphDimension.height / 2.5,
              overflow: "hidden",
              fontStyle: ` ${chartControl.cardControls.fontStyle}`,
            }}
          >
            {chartData.length >= 1 ? (
              <>
                {tabtileProps.showDash || true ? ( ///////// Remove true for dragging purpose
                  <>
                    <span>
                      <p
                        // title="Drag to change position"
                        style={{
                          fontSize: chartControls.properties[propKey]
                            .cardControls.customStyle
                            ? `${chartControl.cardControls.fontSize}px`
                            : // : `${graphDimension.width / 10}px`,
                            tabtileProps.showDash ||
                              !tileState.tiles[propKey]?.graphSizeFull
                            ? Math.min(
                                graphDimension.width,
                                graphDimension.height
                              ) /
                                10 +
                              15
                            : Math.min(
                                graphDimension.width,
                                graphDimension.height
                              ) /
                                30 +
                              15,
                          color: fontColor
                            ? fontColor
                            : chartControls.properties[propKey].cardControls
                                .valueColor,
                          margin: "5px",
                          backgroundColor: backgroundColorValue
                            ? backgroundColorValue
                            : chartControls.properties[propKey].cardControls
                                .bgColor,
                          fontStyle: italicText ? italicText : "none",
                          textDecoration: textUnderline
                            ? textUnderline
                            : "none",
                          fontWeight: boldText ? boldText : "none",
                          padding: "0px 5px",
                          borderRadius: "4px",
                        }}
                      >
                        {getFormatedChartData()}
                      </p>
                    </span>
                    <span>
                      <p
                        // title="Drag to change position"
                        style={{
                          fontSize: chartControls.properties[propKey]
                            .cardControls.customStyle
                            ? `${chartControl.cardControls.subtextFontSize}px`
                            : tabtileProps.showDash ||
                              !tileState.tiles[propKey]?.graphSizeFull
                            ? Math.min(
                                graphDimension.width,
                                graphDimension.height
                              ) /
                                20 +
                              7
                            : Math.min(
                                graphDimension.width,
                                graphDimension.height
                              ) /
                                60 +
                              7,
                          color:
                            chartControls.properties[propKey].cardControls
                              .labelColor,
                          margin: "5px",
                        }}
                      >
                        {chartControls.properties[propKey].cardControls.subText}
                      </p>
                    </span>
                  </>
                ) : (
                  <></>
                  /// Uncomment for custom positioning using dragging
                  // <>
                  //   <Rnd
                  //     disableResizing={true}
                  //     disableDragging={chartArea === "dashboard" ? true : false}
                  //     bounds="parent"
                  //     position={chartControl.cardControls.mainTextPos}
                  //     onDragStop={(e, d) => {
                  //       updateCardControls(propKey, "mainTextPos", {
                  //         x: d.x,
                  //         y: d.y,
                  //       });
                  //     }}
                  //     style={{
                  //       overflow: "hidden",
                  //     }}
                  //   >
                  //     <p
                  //       title="Drag to change position"
                  //       style={{
                  //         cursor: "move",
                  //         fontSize: chartControls.properties[propKey]
                  //           .cardControls.customStyle
                  //           ? `${chartControl.cardControls.fontSize}px`
                  //           : // : `${graphDimension.width / 10}px`,
                  //             Math.min(
                  //               graphDimension.width,
                  //               graphDimension.height
                  //             ) /
                  //               10 +
                  //             15,
                  //         color: fontColor
                  //           ? fontColor
                  //           : chartControls.properties[propKey].cardControls
                  //               .valueColor,
                  //         margin: "5px",
                  //         backgroundColor: backgroundColorValue
                  //           ? backgroundColorValue
                  //           : chartControls.properties[propKey].cardControls
                  //               .bgColor,
                  //         fontStyle: italicText ? italicText : "none",
                  //         textDecoration: textUnderline
                  //           ? textUnderline
                  //           : "none",
                  //         fontWeight: boldText ? boldText : "none",
                  //         padding: "0px 5px",
                  //         borderRadius: "4px",
                  //       }}
                  //     >
                  //       {getFormatedChartData()}
                  //     </p>
                  //   </Rnd>
                  //   <Rnd
                  //     disableResizing={true}
                  //     disableDragging={chartArea === "dashboard" ? true : false}
                  //     bounds="parent"
                  //     position={chartControl.cardControls.subTextPos}
                  //     onDragStop={(e, d) => {
                  //       updateCardControls(propKey, "subTextPos", {
                  //         x: d.x,
                  //         y: d.y,
                  //       });
                  //     }}
                  //   >
                  //     <p
                  //       title="Drag to change position"
                  //       style={{
                  //         cursor: "move",
                  //         fontSize: chartControls.properties[propKey]
                  //           .cardControls.customStyle
                  //           ? `${chartControl.cardControls.subtextFontSize}px`
                  //           : Math.min(
                  //               graphDimension.width,
                  //               graphDimension.height
                  //             ) /
                  //               20 +
                  //             7,
                  //         color:
                  //           chartControls.properties[propKey].cardControls
                  //             .labelColor,
                  //         margin: "5px",
                  //       }}
                  //     >
                  //       {chartControls.properties[propKey].cardControls.subText}
                  //     </p>
                  //   </Rnd>
                  // </>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return <RenderChart />;
};
const mapStateToProps = (state: any, ownProps: any) => {
  return {
    chartControls: state.chartControls,
    chartProperties: state.chartProperties,
    tabtileProps: state.tabTileProps,
    pageSettings: state.pageSettings,
    tileState: state.tileState,
  };
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    updateCardControls: (propKey: string, option: string, value: any) =>
      dispatch(updateCardControls(propKey, option, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SimpleCard);
// eslint-disable-next-line no-lone-blocks
{
  /* <span
                  style={{
                    fontSize: `${chartControl.cardControls.fontSize}px`,
                    color: chartThemes[0].colors[0],
                  }}
                >
                  {getFormatedChartData()}
                </span>
                <span
                  style={{
                    fontSize: `${chartControl.cardControls.subtextFontSize}px`,
                    color: chartThemes[0].colors[1],
                  }}
                >
                  {Object.keys(chartData[0])[0]}
                </span> */
}
