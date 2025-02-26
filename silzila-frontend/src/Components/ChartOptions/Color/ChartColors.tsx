// This component list all color themes available for charts

import { FormControl, MenuItem, Popover, Select } from "@mui/material";
import React, { useState, useEffect } from "react";
import { ColorResult, SketchPicker } from "react-color";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  setAreaColorOptions,
  setColorScheme,
  switchAutotoManualinSteps,
  updateBoxPlotStyleOptions,
} from "../../../redux/ChartPoperties/ChartControlsActions";
import {
  ChartOptionsProps,
  ChartOptionsStateProps,
} from "../CommonInterfaceForChartOptions";

import SliderWithInput from "../SliderWithInput";
import SwitchWithInput from "../SwitchWithInput";
import { ColorSchemes, ColorSchemesProps } from "./ColorScheme";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";
interface ChartColorsActions {
  from?: string;
  selectedTab?: number;
  setColorScheme: (propKey: string, color: string) => void;
  switchAutotoManualinSteps: (propKey: string, value: any) => void;
  setAreaColorOptions: (propKey: string, option: string, value: any) => void;
  updateBoxPlotStyleOptions: (
    propKey: string,
    option: string,
    value: any
  ) => void;
}
export interface ChartColorsProps {
  onBackgroundColorChange: (details: { schemeName: string; color: string }) => void; // Updated Prop
}

const ChartColors = ({
  // state

  chartControls,
  tabTileProps,
  chartProperties,

  //props
  from,
  selectedTab,
  onBackgroundColorChange,

  // dispatch
  setColorScheme,
  setAreaColorOptions,
  switchAutotoManualinSteps,
  updateBoxPlotStyleOptions,
}: ChartOptionsProps & ChartColorsActions & ChartColorsProps) => {
  var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
  const TabState = useSelector((state: RootState) => state.tabState)

  const selectedTheme = selectedTab ? TabState.tabs[selectedTab]?.dashboardState?.colorScheme : undefined
  const [selectedMenu, setSelectedMenu] = useState<string>(
    (selectedTheme && from === "dashboard") ? selectedTheme :
      chartControls.properties[propKey].colorScheme
  );
  const [isColorPopoverOpen, setColorPopOverOpen] = useState<boolean>(false);
  useEffect(() => {
    setSelectedMenu((selectedTheme && from === "dashboard") ? selectedTheme :
      chartControls.properties[propKey].colorScheme)
  },[from, selectedTab])

  const resetSelection = (data_value: string) => {
    if (chartProperties.properties[propKey].chartType === "gauge") {
      switchAutotoManualinSteps(propKey, true);
    }
    setSelectedMenu(data_value);

    // Apply the color scheme to all tiles
    // Object.keys(chartControls.properties).forEach((key) => {
    //   setColorScheme(key, data_value);
    // });

    if (from !== "dashboard") {
      Object.keys(chartControls.properties).forEach((key) => {
        setColorScheme(key, data_value);
      });
    }

    const selectedScheme = ColorSchemes.find(
      (scheme) => scheme.name === data_value
    );
    if (!selectedScheme) {
      console.warn(`No color scheme found for: ${data_value}`);
      return; // Exit early to avoid errors
    }

    if (typeof onBackgroundColorChange === "function") {
      onBackgroundColorChange({
        schemeName: selectedScheme.name,
        color: selectedScheme.background,
      });
    }
  };



  return (
    <div className="optionsInfo" style={{ padding: "0",scrollbarGutter: 'auto' }}>
      <div className="optionDescription colorScheme-head" style={{ paddingLeft: "0" }}>Color Scheme</div>
      <FormControl
        fullWidth
        size="small"
        style={{ fontSize: "12px", borderRadius: "4px", width: "86%", marginLeft: "20px" }}
      >
        <Select
          size="small"
          value={selectedMenu}
          variant="outlined"
          onChange={(e) => {
            resetSelection(e.target.value);
          }}
          sx={{
            fontSize: "14px",
            // margin: "0 1rem", 
            ".MuiSelect-select": {
              padding: "5px 30px 5px 5px !important",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#2bb9bb",// Set focused border color
            },
          }}
        >
          {ColorSchemes.map((item: ColorSchemesProps) => {
            return (
              <MenuItem
                value={item.name}
                key={item.name}
                sx={{
                  padding: "5px 5px",
                }}
              >
                <div
                  className="custom-option"
                  style={{
                    backgroundColor: item.background,
                    color: ["purplePassion", "chalk", "dark", "halloween"].includes(item.name) ? "white" : "#3b3b3b",
                  }}
                >
                  <span style={{ color: ["purplePassion", "chalk", "dark", "halloween"].includes(item.name) ? "white" : "#3b3b3b", }} className="color-name">{item.name}</span>
                  <div className="color-palette">
                    {item.colors.map((color: string) => {
                      return (
                        <div
                          className="indi-color"
                          style={{
                            height: "8px",
                            background: color,
                          }}
                          key={`${item.name}_${color}`}
                        ></div>
                      );
                    })}
                  </div>
                </div>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {chartProperties.properties[propKey].chartType === "area" ||
        chartProperties.properties[propKey].chartType === "stackedArea" ? (
        <React.Fragment>
          <div className="optionDescription" style={{ marginTop: "20px" }}>Background Color</div>
          <div
            style={{
              height: "1.25rem",
              width: "96%",
              backgroundColor:
                chartControls.properties[propKey].areaBackgroundColor,
              color: chartControls.properties[propKey].areaBackgroundColor,
              border: "2px solid darkgray",
              margin: "auto",
              marginLeft: "5px",

            }}
            onClick={() => {
              setColorPopOverOpen(!isColorPopoverOpen);
            }}
          ></div>
          <div className="optionDescription" style={{ marginTop: "20px" }}>Opacity</div>
          <SliderWithInput
            pointNumbers={true}
            sliderValue={chartControls.properties[propKey].areaOpacity}
            sliderMinMax={{ min: 0, max: 1, step: 0.1 }}
            changeValue={(value: number) => {
              setAreaColorOptions(propKey, "areaOpacity", value);
            }}
          />
        </React.Fragment>
      ) : null}
      {chartProperties.properties[propKey].chartType === "boxPlot" ? (
        <React.Fragment>
          <div className="optionDescription" style={{ paddingLeft: "0.3rem" }}>
            <label
              htmlFor="enableDisable"
              className="enableDisableLabel"
              style={{ marginRight: "10px", paddingLeft: "0" }}
            >
              Color By Category
            </label>
            <SwitchWithInput
              isChecked={
                chartControls.properties[propKey].boxPlotChartControls
                  .colorBy === "series"
                  ? false
                  : true
              }
              onSwitch={() => {
                if (
                  chartControls.properties[propKey].boxPlotChartControls
                    .colorBy === "series"
                ) {
                  updateBoxPlotStyleOptions(propKey, "colorBy", "data");
                } else {
                  updateBoxPlotStyleOptions(propKey, "colorBy", "series");
                }
              }}
            />
          </div>
        </React.Fragment>
      ) : null}
      <Popover
        open={isColorPopoverOpen}
        onClose={() => setColorPopOverOpen(false)}
        onClick={() => setColorPopOverOpen(false)}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 350, left: 1300 }}
      >
        <div>
          <SketchPicker
            color={chartControls.properties[propKey].areaBackgroundColor}
            className="sketchPicker"
            width="16rem"
            // styles={{ padding: "0" }}
            onChangeComplete={(color: ColorResult) => {
              // Update color option and notify background change
              setAreaColorOptions(propKey, "areaBackgroundColor", color.hex);
              if (typeof onBackgroundColorChange === "function") {
                onBackgroundColorChange({
                  schemeName: selectedMenu,
                  color: color.hex,
                });
                console.log(`Scheme: ${selectedMenu}, Color: ${color.hex}`);
              }
              else {
                console.warn("onBackgroundColorChange is not defined or not a function.");
              }
              // onBackgroundColorChange({
              //   schemeName: selectedMenu, // Current selected scheme name
              //   color: color.hex,        // Selected color
              // });
            }}
            onChange={(color: ColorResult) =>
              setAreaColorOptions(propKey, "areaBackgroundColor", color.hex)
            }
            disableAlpha
          />
        </div>
      </Popover>
    </div>
  );
};

const mapStateToProps = (state: ChartOptionsStateProps, ownProps: any) => {
  return {
    chartControls: state.chartControls,
    tabTileProps: state.tabTileProps,
    chartProperties: state.chartProperties,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setColorScheme: (propKey: string, color: string) =>
      dispatch(setColorScheme(propKey, color)),
    switchAutotoManualinSteps: (propKey: string, value: any) =>
      dispatch(switchAutotoManualinSteps(propKey, value)),
    setAreaColorOptions: (propKey: string, option: string, value: any) =>
      dispatch(setAreaColorOptions(propKey, option, value)),
    updateBoxPlotStyleOptions: (propKey: string, option: string, value: any) =>
      dispatch(updateBoxPlotStyleOptions(propKey, option, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartColors);
