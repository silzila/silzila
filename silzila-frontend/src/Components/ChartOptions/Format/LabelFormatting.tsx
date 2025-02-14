import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import InputSymbol from "../CommonFunctions/InputSymbol";
import InputPositiveNumber from "../CommonFunctions/InputPositiveNumber";
import { Dispatch } from "redux";
import { ChartConLabelFormates } from "../../../redux/ChartPoperties/ChartControlsInterface";
import { updateFormatOption } from "../../../redux/ChartPoperties/ChartControlsActions";
import {
  ChartOptionsProps,
  ChartOptionsStateProps,
} from "../CommonInterfaceForChartOptions";
import { updateFormatForDm } from "../../../redux/DynamicMeasures/DynamicMeasuresActions";
import Logger from "../../../Logger";
import { FormControl, MenuItem, Select, Typography, Checkbox } from "@mui/material";
import { format } from "path";

const LabelFormatting = ({
  // state
  chartProperties,
  tabTileProps,
  chartControls,
  dynamicMeasureState,

  // dispatch
  updateFormat,
  updateFormatForDm,
  updateFormatX,
  updateFormatY,
}: ChartOptionsProps &
  any & {
    updateFormat: (
      propKey: string,
      formatType: any,
      option: string,
      value: any
    ) => void;
  }) => {
  var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
  var chartType = chartProperties.properties[propKey].chartType;
  var dmKey = `${dynamicMeasureState.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`;
  let formatObject: ChartConLabelFormates | any =
    chartType === "richText"
      ? dynamicMeasureState.dynamicMeasureProps?.[
          `${dynamicMeasureState.selectedTabId}`
        ]?.[`${dynamicMeasureState.selectedTileId}`]?.[dmKey]?.formatOptions
          .labelFormats
      : chartControls.properties[propKey].formatOptions.labelFormats;
  const formatOptions: any[] = [
    { type: "Number", value: "Number" },
    { type: "Currency", value: "Currency" },
    { type: "Percent", value: "Percent" },
  ];

  const [measuresList, setMeasuresList] = useState<any[]>([]);
  const [selectedMeasure, setSelectedMeasure] = useState<any>(
    chartProperties.properties[propKey].chartAxes[
      chartProperties.properties[propKey].chartAxes.findIndex(
        (item: any) => item.name === "Measure"
      )
    ]?.fields[0]
  );

  useEffect(() => {
    // sets the initial value of the measure dropdown to the first measure in the chart

    handleUpdateFormat(
      "selectedMeasure",
      {
        name: selectedMeasure?.displayname,
        uId: selectedMeasure?.uId,
      },
      "labelFormats"
    );

    // check if already measure format is added by checking if measureFormat object is empty or not

    if (
      Object.keys(
        chartControls.properties[propKey].formatOptions.labelFormats
          .measureFormats
      ).length === 0
    ) {
      handleUpdateFormat(
        "measureFormats",
        {
          ...chartControls.properties[propKey].formatOptions.labelFormats
            .measureFormats,
          [selectedMeasure?.uId]: {
            formatValue: "Number",
            currencySymbol: "$",
            enableRounding: true,
            roundingDigits: 1,
            numberSeparator: "Abbrev",
            percentageCalculate: false,
          },
        },
        "labelFormats"
      );
    } else {
      handleUpdateFormat(
        "measureFormats",
        {
          ...chartControls.properties[propKey].formatOptions.labelFormats
            .measureFormats,
        },
        "labelFormats"
      );
    }
  }, []);

  useEffect(() => {
    var chartAxes = chartProperties.properties[propKey].chartAxes;
    var measures: any = [];

    switch (chartProperties.properties[propKey].chartType) {
      case "multibar":
      case "stackedBar":
      case "line":
      case "area":
      case "pie":
      case "donut":
        measures = chartAxes[2].fields;
        break;

      case "scatterPlot":
        measures = chartAxes[2].fields;
        measures = measures.concat(chartAxes[3].fields);
        break;

      case "gauge":
      case "funnel":
      case "simplecard":
      case "richText":
        measures = chartAxes[1].fields;
        break;

      case "heatmap":
        measures = chartAxes[3].fields;
        break;
    }

    setMeasuresList(measures);
  }, [chartProperties]);

  const handleUpdateFormat = (
    option: string,
    value: any,
    optionKey?: string
  ) => {
    if (chartType === "richText") {
      updateFormatForDm(dmKey, option, value);
    } else {
      updateFormat(propKey, optionKey, option, value);
    }
  };

  const renderFormatOptions = () => {
    return formatOptions.map((item: any) => {
      const isSelected =
        item.value ===
        formatObject?.measureFormats[formatObject.selectedMeasure?.uId]
          ?.formatValue;

      return (
        <div
          key={item.value}
          className={isSelected ? "radioButtonSelected" : "radioButton"}
          style={{
            backgroundColor: isSelected ? "rgba(224, 224, 224, 1)" : "white",
            cursor: isSelected ? "auto" : "pointer",
            fontWeight: isSelected ? "600" : "normal",
          }}
          onClick={() => {
            if (item.value === "Percent") {
              handleUpdateFormat(
                "measureFormats",
                {
                  ...formatObject.measureFormats,
                  [formatObject.selectedMeasure?.uId]: {
                    ...formatObject.measureFormats[
                      formatObject.selectedMeasure?.uId
                    ],
                    formatValue: item.value,
                    numberSeparator: "None",
                  },
                },
                "labelFormats"
              );
            } else {
              handleUpdateFormat(
                "measureFormats",
                {
                  ...formatObject.measureFormats,
                  [formatObject.selectedMeasure?.uId]: {
                    ...formatObject.measureFormats[
                      formatObject.selectedMeasure?.uId
                    ],
                    formatValue: item.value,
                  },
                },
                "labelFormats"
              );
            }
          }}
        >
          {item.type}
        </div>
      );
    });
  };

  const separatorOptions: any[] = [
    { type: "None", value: "None" },
    { type: "Comma", value: "Comma" },
    { type: "Abbrev", value: "Abbrev" },
  ];

  const renderSeparatorOptions = () => {
    return separatorOptions.map((item: any) => {
      const isSelected =
        item.value ===
        formatObject?.measureFormats[formatObject.selectedMeasure?.uId]
          ?.numberSeparator;
      return (
        <div
          key={item.value}
          style={{
            backgroundColor: isSelected ? "rgba(224, 224, 224, 1)" : "white",
            cursor: isSelected ? "auto" : "pointer",
            fontWeight: isSelected ? "600" : "normal",
          }}
          className="radioButton"
          onClick={() => {
            if (
              formatObject.measureFormats[formatObject.selectedMeasure?.uId]
                .formatValue === "Percent"
            )
              return;
            handleUpdateFormat(
              "measureFormats",
              {
                ...formatObject.measureFormats,
                [formatObject.selectedMeasure?.uId]: {
                  ...formatObject.measureFormats[
                    formatObject.selectedMeasure?.uId
                  ],
                  numberSeparator: item.value,
                },
              },
              "labelFormats"
            );
          }}
        >
          {item.type}
        </div>
      );
    });
  };

  const handleChartMeasuresSelectChange = (event: any) => {
    setSelectedMeasure(event.target.value);

    handleUpdateFormat(
      "selectedMeasure",
      {
        name: event.target.value?.displayname,
        uId: event.target.value?.uId,
      },
      "labelFormats"
    );

    if (!formatObject.measureFormats[event.target.value?.uId]) {
      handleUpdateFormat(
        "measureFormats",
        {
          ...chartControls.properties[propKey].formatOptions.labelFormats
            .measureFormats,
          [event.target.value?.uId]: {
            formatValue: "Number",
            currencySymbol: "$",
            enableRounding: true,
            roundingDigits: 1,
            numberSeparator: "Abbrev",
          },
        },
        "labelFormats"
      );
    }
  };

  return (
    <React.Fragment>
      {chartControls.properties[propKey].sortedValue ? null : (
        <div className="optionDescription">MEASURES</div>
      )}

      <FormControl fullWidth sx={{ margin: "0 5px" }}>
        <Select
          sx={{
            width: "96%",
            height: "26px",
            fontSize: "13px",
            "&.MuiOutlinedInput-root": {
              "& fieldset": {
                border: "1px solid rgb(211, 211, 211)", // Change the border color here
              },
              "&:hover fieldset": {
                border: "1px solid #2bb9bb", // Change the hover border color here
              },
              "&.Mui-focused fieldset": {
                border: "1px solid #2bb9bb", // Change the focused border color here
              },
              "&.Mui-focused svg": {
                color: "#2bb9bb", // Change the arrow color when focused
              },
            },
          }}
          onChange={handleChartMeasuresSelectChange}
          value={selectedMeasure}
        >
          {
            // crosstab has 3 axes, Table has 2
            chartProperties.properties[propKey].chartAxes[
              chartProperties.properties[propKey].chartAxes.findIndex(
                (item: any) => item.name === "Measure"
              )
            ]?.fields.map((item: any, index: number) => {
              return (
                <MenuItem
                  key={index}
                  value={item}
                  sx={{
                    color: "black",
                    fontSize: "12px",
                    padding: "2px 10px",
                    "&:hover": { backgroundColor: "rgb(238, 238, 238)" },
                    "&.Mui-selected": {
                      backgroundColor: "rgba(43, 185, 187, 0.1)",
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: "rgba(43, 185, 187, 0.2)",
                    },
                  }}
                >
                  {item?.displayname}
                </MenuItem>
              );
            })
          }
        </Select>
      </FormControl>
      <div className="optionDescription" style={{ marginTop: "10px" }}>
        FORMAT VALUE
      </div>
      <div className="radioButtons" style={{ padding: "0" }}>
        {renderFormatOptions()}
      </div>

      {/* renders radio buttons for percentage calculation or just show the value */}
      {formatObject.measureFormats[formatObject.selectedMeasure?.uId]
        ?.formatValue === "Percent" ? (
        <>
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <span className="optionDescription"> PERCENT TYPE </span>
            <div className="radioButtons" style={{ padding: "0" }}>
              <div
                className={
                  formatObject.measureFormats[formatObject.selectedMeasure.uId]
                    ?.percentageCalculate === true
                    ? "radioButtonSelected"
                    : "radioButton"
                }
                style={{
                  backgroundColor:
                    formatObject.measureFormats[
                      formatObject.selectedMeasure.uId
                    ]?.percentageCalculate === true
                      ? "rgba(224, 224, 224, 1)"
                      : "white",
                  cursor:
                    formatObject.measureFormats[
                      formatObject.selectedMeasure.uId
                    ]?.percentageCalculate === true
                      ? "auto"
                      : "pointer",
                  fontWeight:
                    formatObject.measureFormats[
                      formatObject.selectedMeasure.uId
                    ]?.percentageCalculate === true
                      ? "600"
                      : "normal",
                }}
                onClick={() => {
                  handleUpdateFormat(
                    "measureFormats",
                    {
                      ...formatObject.measureFormats,
                      [formatObject.selectedMeasure.uId]: {
                        ...formatObject.measureFormats[
                          formatObject.selectedMeasure.uId
                        ],
                        percentageCalculate: true,
                      },
                    },
                    "labelFormats"
                  );
                }}
              >
                Calculated
              </div>
              <div
                className={
                  formatObject.measureFormats[formatObject.selectedMeasure.uId]
                    ?.percentageCalculate === false
                    ? "radioButtonSelected"
                    : "radioButton"
                }
                style={{
                  backgroundColor:
                    formatObject.measureFormats[
                      formatObject.selectedMeasure.uId
                    ]?.percentageCalculate === false
                      ? "rgba(224, 224, 224, 1)"
                      : "white",
                  cursor:
                    formatObject.measureFormats[
                      formatObject.selectedMeasure.uId
                    ]?.percentageCalculate === false
                      ? "auto"
                      : "pointer",
                  fontWeight:
                    formatObject.measureFormats[
                      formatObject.selectedMeasure.uId
                    ]?.percentageCalculate === false
                      ? "600"
                      : "normal",
                }}
                onClick={() => {
                  handleUpdateFormat(
                    "measureFormats",
                    {
                      ...formatObject.measureFormats,
                      [formatObject.selectedMeasure.uId]: {
                        ...formatObject.measureFormats[
                          formatObject.selectedMeasure.uId
                        ],
                        percentageCalculate: false,
                      },
                    },
                    "labelFormats"
                  );
                }}
              >
                Non Calculated
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}

      {formatObject.measureFormats[formatObject.selectedMeasure?.uId]
        ?.formatValue === "Currency" ? (
        <>
          <div
            className="optionDescription"
            style={{ marginTop: "0.5rem", paddingBottom: "0" }}
          >
            <span style={{ margin: "auto" }}>Curency Symbol</span>
            <InputSymbol
              value={
                formatObject.measureFormats[formatObject.selectedMeasure.uId]
                  ?.currencySymbol || "$"
              }
              updateValue={(value: any) =>
                handleUpdateFormat(
                  "measureFormats",
                  {
                    ...formatObject.measureFormats,
                    [formatObject.selectedMeasure.uId]: {
                      ...formatObject.measureFormats[
                        formatObject.selectedMeasure.uId
                      ],
                      currencySymbol: value,
                    },
                  },
                  "labelFormats"
                )
              }
            />
          </div>
        </>
      ) : null}

      <div
        style={{
          borderTop: "1px solid rgb(211,211,211)",
          margin: "1rem 6% 1rem",
          marginBottom: "6px",
        }}
      ></div>
      {chartProperties.properties[propKey].chartType === "crossTab" ||
      chartProperties.properties[propKey].chartType === "richText" ? (
        <div className="optionDescription">FORMAT</div>
      ) : (
        <div className="optionDescription">LABEL FORMAT</div>
      )}

      <div className="optionDescription" style={{  }}>
        <label htmlFor="enableDisable" className="enableDisableLabel" style={{
            paddingLeft: "0px"
          }}>
          Separator
        </label>
      </div>
      <div
        className="radioButtons"
        style={{ paddingLeft: "0.1rem", margin: "auto" }}
      >
        {renderSeparatorOptions()}
      </div>

      <div className="optionDescription" style={{ }}>
        <label htmlFor="enableDisable" className="enableDisableLabel" style={{
            paddingLeft: "0px"
          }}>
          Round Off
        </label>
      </div>
      <div className="optionDescription" style={{ paddingTop: "0px", paddingBottom: "0px", marginTop: "0px", paddingLeft: "0.25rem" }}>
            <Checkbox
              id="enableDisable"
              checked={
               formatObject?.measureFormats[formatObject.selectedMeasure?.uId]
               ?.enableRounding
               ? true
               : false
              }
              style={{
              transform: "scale(0.8)",
               paddingRight: "0px",
               paddingLeft: "0px"
              }}
              sx={{
                "&.Mui-checked": {
                  color: "#a6a6a6",
                },
                '&:hover': {
                 backgroundColor: 'transparent !important'
              }
              }}
              onChange={() => {
                handleUpdateFormat(
                 "measureFormats",
                {
                 ...formatObject.measureFormats,
                [formatObject.selectedMeasure?.uId]: {
                  ...formatObject.measureFormats[
                    formatObject.selectedMeasure?.uId
                  ],
                  enableRounding:
                    !formatObject.measureFormats[
                      formatObject.selectedMeasure?.uId
                    ].enableRounding,
                },
              },
              "labelFormats"
            );
          }}
        />
        <InputPositiveNumber
          value={
            formatObject.measureFormats[formatObject.selectedMeasure?.uId]
              ?.roundingDigits
              ? formatObject.measureFormats[formatObject.selectedMeasure?.uId]
                  .roundingDigits
              : 1
          }
          updateValue={(value: number) => {
            if (value >= 0) {
              handleUpdateFormat(
                "measureFormats",
                {
                  ...formatObject.measureFormats,
                  [formatObject.selectedMeasure?.uId]: {
                    ...formatObject.measureFormats[
                      formatObject.selectedMeasure?.uId
                    ],
                    roundingDigits: value,
                  },
                },
                "labelFormats"
              );
            } else {
              handleUpdateFormat(
                "measureFormats",
                {
                  ...formatObject.measureFormats,
                  [formatObject.selectedMeasure?.uId]: {
                    ...formatObject.measureFormats[
                      formatObject.selectedMeasure?.uId
                    ],
                    roundingDigits: 0,
                  },
                },
                "labelFormats"
              );
            }
          }}
          disabled={
            formatObject?.measureFormats[formatObject.selectedMeasure?.uId]
              ?.enableRounding
              ? false
              : true
          }
        />
        <span style={{ margin: "auto 0px" }}>decimal</span>
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = (
  state: ChartOptionsStateProps & any,
  ownProps: any
) => {
  return {
    chartControls: state.chartControls,
    tabTileProps: state.tabTileProps,
    chartProperties: state.chartProperties,
    dynamicMeasureState: state.dynamicMeasuresState,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    updateFormat: (
      propKey: string,
      formatType: any,
      option: string,
      value: any
    ) => dispatch(updateFormatOption(propKey, formatType, option, value)),
    updateFormatForDm: (dmKey: string, option: string, value: any) =>
      dispatch(updateFormatForDm(dmKey, option, value)),
    updateFormatX: (
      propKey: string,
      formatType: string | any,
      option: string,
      value: any
    ) => dispatch(updateFormatOption(propKey, formatType, option, value)),
    updateFormatY: (
      propKey: string,
      formatType: string | number,
      option: string,
      value: any
    ) => dispatch(updateFormatOption(propKey, formatType, option, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelFormatting);
