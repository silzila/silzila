// This component houses the following
// 	- Dropzones for table fields
// 	- Graph section
// 	- Chart types / Controls selection menu

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import "./dataViewerMiddle.css";
// import chartControlIcon from "../../assets/chart-control-icon.svg";
// import settingsIcon from "../../assets/charts_theme_settings_icon.svg";

import { Dispatch } from "redux";
import {
  DataViewerMiddleProps,
  DataViewerMiddleStateProps,
} from "./DataViewerMiddleInterfaces";
import { setSelectedControlMenu } from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import ChartTypes from "../ChartOptions/ChartTypes";
import ControlDetail from "../ChartOptions/ControlDetail";
import ChartAxes from "../ChartAxes/ChartAxes";
import GraphArea from "../GraphArea/GraphArea";
import ChartControlObjects from "../ChartOptions/ChartControlObjects";

import ChartFilterGroupsContainer from "../ChartFilterGroup/ChartFilterGroupsContainer";
import { AlertColor, Tooltip } from "@mui/material";
import DynamicMeasureWindow from "./DynamicMeasureWindow";
import {
  setSelectedTabIdInDynamicMeasureState,
  setSelectedTileIdInDynamicMeasureState,
  setSelectedToEdit,
} from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import { changeChartOptionSelected } from "../../redux/ChartPoperties/ChartPropertiesActions";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChartData from "../ChartAxes/ChartData";
import { fontSize } from "../..";
import { chartTypes } from "../ChartOptions/ChartTypes";

const DataViewerMiddle = ({
  // props
  tabId,
  tileId,

  // state
  tabTileProps,
  chartProp,

  // dispatch
  setMenu,

  setSelectedTileIdForDM,
  setSelectedTabIdForDM,
}: DataViewerMiddleProps & any) => {
  var propKey: string = `${tabId}.${tileId}`;
  // var tabId = tabTileProps.selectedTabId;
  // var tileId = tabTileProps.selectedTileId;

  useEffect(() => {
    setSelectedTileIdForDM(tileId);
    setSelectedTabIdForDM(tabId);
  }, [tileId, tabId]);

  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [testMessage, setTestMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  let selectedChart = chartProp.properties[propKey].chartType;
  const selectedChartData = chartTypes.find(
      (chart) => chart.name === selectedChart
    );

  const MinimizeComponent = () => {
    return (
      <Tooltip title="Hide">
        <KeyboardArrowUpIcon
          sx={{
            fontSize: "18px",
            float: "right",
            marginTop: "2px",
          }}
          onClick={() => setMenu("")}
        />
      </Tooltip>
    );
  };
  const controlDisplayed = () => {
    switch (tabTileProps.selectedControlMenu) {
      case "Charts":
        return (
          <div className="rightColumnControlsAndFilters">
            <div
              style={{
                color: " #404040",
                fontWeight: "600",
                paddingTop: "0.5rem",
                paddingLeft: "0.65rem",
                textAlign: "start",
                fontSize: fontSize.large,
                marginRight: "1rem"
              }}
            >
              Charts
              <MinimizeComponent />
            </div>
            <ChartTypes propKey={propKey} />
          </div>
        );

      case "Chart controls":
        return (
          <div className="rightColumnControlsAndFilters">
            <div
              style={{
                color: " #404040",
                fontWeight: "600",
                padding: "0.5rem 0 0 0.5rem",
                textAlign: "start",
                fontSize: fontSize.large,
                marginBottom: "0.19rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
              Charts Controls
              {selectedChartData ? (
               <img
                src={selectedChartData.icon}
                alt={selectedChartData.name}
                title={selectedChartData.value}
                className="selected-chart-icon"
                style={{paddingLeft: "7px" }}
               />
              ) : (
               <p>No icon available for the selected chart</p>
              )}
              <div style={{
                paddingLeft: "3.85rem",
                marginRight: "0"
               }}>
                <MinimizeComponent />
              </div>
              </div>
            </div>
            <ChartControlObjects />
          </div>
        );

      case "Report Filters":
        return (
          <div className="rightColumnControlsAndFilters">
            {/* <div
              style={{
                color: " #404040",
                fontWeight: "600",
                padding: "10px 0 0 0.5rem",
                display:"flex",
                alignItems:"center",
                justifyContent:"space-between"
              }}
            >
              Report Filter
              <div
                style={{
                  float: "right",
                  display: "flex",
                  columnGap: "8px",
                  alignItems: "center",
                  // borderTop: "2px solid #d3d3d3"
                }}
              >
                <MoreVertIcon
                // @ts-ignore
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  style={{ height: "16px", width: "16px", color: "#878786" }}
                />
                <MinimizeComponent />

              </div>
            </div> */}
            <ChartFilterGroupsContainer
              propKey={propKey}
              fromDashboard={false}
            ></ChartFilterGroupsContainer>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dataViewerMiddle" style={{ height: "300px" }}>
      {chartProp.properties[propKey].chartType === "richText" ? (
        <>
          <GraphArea />
          <DynamicMeasureWindow />
          <ChartData
            tabId={tabId}
            tileId={tileId}
            screenFrom="richTextReportFilter"/>
          <div 
          className="rightColumn" 
           style={{
            width: '14rem',
            overflowY: "auto",
            overflowX: "hidden",
          }}>{controlDisplayed()}</div>
        </>
      ) : (
        <>
          <ChartAxes tabId={tabId} tileId={tileId} uID="" />
          {chartProp.properties[propKey].enableOverrideForUID !== null &&
          chartProp.properties[propKey].enableOverrideForUID !== undefined &&
          chartProp.properties[propKey].enableOverrideForUID !== "" ? (
            <>
              <ChartAxes
                tabId={tabId}
                tileId={tileId}
                uID={chartProp.properties[propKey].enableOverrideForUID}
              />
            </>
          ) : null}
          <GraphArea />
          <div className="rightColumn"
          style={{
            width: '14rem',
            overflowY: "auto",
            overflowX: "hidden",
          }}>{controlDisplayed()}</div>
        </>
      )}
      <NotificationDialog
        openAlert={openAlert}
        severity={severity}
        testMessage={testMessage}
      />
    </div>
  );
};

const mapStateToProps = (state: DataViewerMiddleStateProps & any) => {
  return {
    chartProp: state.chartProperties,
    tabTileProps: state.tabTileProps,
    dynamicMeasureState: state.dynamicMeasuresState,
    chartControls: state.chartControls,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setMenu: (menu: string) => dispatch(setSelectedControlMenu(menu)),

    changeChartOption: (propKey: string, chartValue: any) =>
      dispatch(changeChartOptionSelected(propKey, chartValue)),

    setSelectedTileIdForDM: (tileId: number) =>
      dispatch(setSelectedTileIdInDynamicMeasureState(tileId)),
    setSelectedTabIdForDM: (tabId: number) =>
      dispatch(setSelectedTabIdInDynamicMeasureState(tabId)),
    setSelectedToEdit: (
      tabId: number,
      tileId: number,
      dmId: number,
      value: boolean
    ) => dispatch(setSelectedToEdit(tabId, tileId, dmId, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewerMiddle);
