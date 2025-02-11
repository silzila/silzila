// This is the main component where a Playbook with its tabs, tiles and dashboard is rendered
// The page is further grouped into DataViewerMiddle & DataViewerBottom components
//
// 	- DataViewerMiddle holds the following
// 		- drop zones for table columns,
// 		- graph area,
// 		- all the chart control actions

// 	- DataViewerBottom holds the following
// 		- selectedDataset list to work with this playbook,
// 		- list of tables for this dataset &
// 		- Sample records from selected table

import React, { useState, useEffect, useMemo } from "react";
// import { Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import update from "immutability-helper";
import "./dataViewer.css";
import { connect } from "react-redux";
import TabRibbon from "../TabsAndTiles/TabRibbon";
import {
  TabTileStateProps,
  TabTileStateProps2,
} from "../../redux/TabTile/TabTilePropsInterfaces";
import TableRowsIcon from "@mui/icons-material/TableRows";
// import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import TileRibbon from "../TabsAndTiles/TileRibbon";
import { Dispatch } from "redux";
import { ButtonGroup, Tooltip, Button, Typography } from "@mui/material";
import DataViewerMiddle from "./DataViewerMiddle";
import DataViewerBottom from "./DataViewerBottom";
import {
  setSelectedControlMenu,
  setShowDashBoard,
  toggleColumnsOnlyDisplay,
  toggleShowDataViewerBottom,
} from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import MenuBar from "./MenuBar";
import DashBoard from "../DashBoard/DashBoard";
// import chartControlIcon from "../../assets/chart-control-icon.svg";
// import settingsIcon from "../../assets/settingIcon.svg";
// import filter_outline from "../../assets/filter_outline.png";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GridViewIcon from "@mui/icons-material/GridView";
import { ChartPropertiesProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
// import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { TabStateProps } from "../../redux/TabTile/TabStateInterfaces";
import { TileStateProps } from "../../redux/TabTile/TileStateInterfaces";
import { setSelectedDsInTile } from "../../redux/ChartPoperties/ChartPropertiesActions";
import FetchData from "../ServerCall/FetchData";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import {
  setSelectedDataSetList,
  setTablesForSelectedDataSets,
} from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import { setSelectedDatasetForDynamicMeasure } from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import { changeChartDataToAxesOrder } from "../CommonFunctions/CommonFunctions";
import { getColumnTypes, getTableData } from "../DataViewer/DataViewerBottom";
import { updatePlaybookUid } from "../../redux/PlayBook/PlayBookActions";
import { loadPlaybook } from "../../redux/TabTile/actionsTabTile";
import theme from "../../assets/theme.png";
import { fontSize, palette } from "../..";
import { PopUpSpinner } from "../CommonFunctions/DialogComponents";

interface DataViewerProps {
  tabTileProps: TabTileStateProps;
  chartProperties: ChartPropertiesProps;
  tabState: TabStateProps;
  tileState: TileStateProps;
  showDashBoard: (tabId: number, showDash: boolean) => void;
  toggleDataViewerBottom: (show: boolean) => void;
  toggleColumns: (displayOnlyCol: boolean) => void;
  setMenu: (menu: string) => void;
}

function DataViewer({
  //state
  tabTileProps,
  chartProperties,
  token,
  calculations,
  // dispatch
  setSelectedDataSetList,
  setTablesForDs,
  setSelectedDs,
  loadPlayBook,
  updatePlayBookId,
  showDashBoard,
  toggleDataViewerBottom,
  toggleColumns,
  setMenu,
}: any) {
  const [showListofTileMenu, setShowListofTileMenu] = useState<boolean>(true);
  const [dashboardResizeColumn, setDashboardResizeColumn] =
    useState<boolean>(false);
  const [showDashboardFilter, setShowDashboardFilter] =
    useState<boolean>(false);
  const [showCalculationContainer, setShowCalculationContainer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state;
  const propKey = useMemo(
    () => `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`,
    [tabTileProps.selectedTabId, tabTileProps.selectedTileId]
  );
  const currentCalculationSession =
    calculations.properties[propKey]?.currentCalculationSession;

  useEffect(() => {
    if (!state) {
      navigate("/"); 
    }else if (state && state.playbookId) {
      getPlayBookDataFromServer(state.playbookId);
    }
  }, [state]);
  if (!state) {
    return null;
  }

  // Whether to show table at the bottom of page or not
  const handleTableDisplayToggle = () => {
    toggleDataViewerBottom(!tabTileProps.showDataViewerBottom);
  };

  const getPlayBookDataFromServer = async (pbUid: string) => {
    setLoading(true);
    var result: any = await FetchData({
      requestType: "noData",
      method: "GET",
      url: `playbook/${pbUid}?workspaceId=${state?.parentId}`,
      headers: { Authorization: `Bearer ${token}` },
    });

    if (result.status) {

      var pb = result.data;

      pb.content = JSON.parse(JSON.stringify(pb.content));

      pb.content.content = JSON.parse(pb.content.content);
      let listOfPropKeys = Object.keys(
        pb.content.content.chartControl.properties
      );

      // console.log("playbook content is: ", pb.content);

      /*  Prakash 09/Nov/2024 Always open the playbook in Dashboad Present Mode */
      if (state?.mode !== "Save") {
        // if coming from save as no need to change dashMode and showDash
        pb.content.content.tabTileProps.dashMode = "Present";
        pb.content.content.tabTileProps.showDash = true;
      }

      /*  Prakash 09/Nov/2024 Always open the playbook in Dashboad Present Mode */

      listOfPropKeys.forEach((propKey: string) => {
        if (
          pb.content.content.chartControl.properties[propKey].chartData &&
          pb.content.content.chartControl.properties[propKey].chartData.length >
            0
        ) {
          pb.content.content.chartControl.properties[propKey].chartData =
            changeChartDataToAxesOrder(
              pb.content.content.chartControl.properties[propKey].chartData,
              pb.content.content.chartProperty,
              propKey
            );
        }
      });

      var selectedDatasetsInPlaybook =
        pb.content.content?.tabTileProps?.selectedDataSetList || [];

      // Get list of tables for a given dataset and save here
      var tablesForSelectedDatasetsCopy: any = {};
      await Promise.all(
        selectedDatasetsInPlaybook.map(async (sampleDs: any) => {
          var result2: any = await FetchData({
            requestType: "noData",
            method: "GET",
            url: `dataset/${sampleDs.id}?workspaceId=${state?.parentId}`,
            headers: { Authorization: `Bearer ${token}` },
          });

          if (result2.status) {
            // tablesForSelectedDatasetsCopy[sampleDs.id] = result2.data;
            tablesForSelectedDatasetsCopy[sampleDs.id] =
              result2.data.dataSchema.tables;
          }
        })
      );

      //pb.content.content = JSON.parse(pb.content.content);

      pb.content.content.tabTileProps.tablesForSelectedDataSets =
        tablesForSelectedDatasetsCopy;

      // for each tile in playbook, if it has minimum required cards in dropzones, get chart data from server
      var newChartControl = JSON.parse(
        JSON.stringify(pb.content.content?.chartControl)
      );
      await Promise.all(
        Object.keys(pb.content.content.chartControl.properties).map(
          async (property) => {
            var axesValue = JSON.parse(
              JSON.stringify(
                pb.content.content.chartProperty.properties[property].chartAxes
              )
            );

            var minReq: any = true;
            // var minReq:any = checkMinRequiredCards(pb.content.chartProperty, property);
            var serverCall = false;
            if (minReq) {
              serverCall = true;
            } else {
              newChartControl.properties[property].chartData = "";
            }

            if (serverCall) {
              if (
                pb.content.content.chartProperty.properties[property]
                  .chartType === "scatterPlot"
              ) {
                var combinedValues = { name: "Measure", fields: [] };
                var values1 = axesValue[2].fields;
                var values2 = axesValue[3].fields;
                var allValues = values1.concat(values2);
                combinedValues.fields = allValues;
                axesValue.splice(2, 2, combinedValues);
              }

              if (
                pb.content.content.chartProperty.properties[property]
                  .chartType === "heatmap" ||
                pb.content.content.chartProperty.properties[property]
                  .chartType === "crossTab"
              ) {
                var combinedValues2 = { name: "Dimension", fields: [] };
                var values3 = axesValue[1].fields;
                var values4 = axesValue[2].fields;
                var allValues2 = values3.concat(values4);
                combinedValues2.fields = allValues2;
                axesValue.splice(1, 2, combinedValues2);
              }
              // getChartData(axesValue, pb.content.chartProperty, property, token).then(
              // 	(data:any) => {
              // 		newChartControl.properties[property].chartData = data;
              // 	}
              // );
            }
          }
        )
      );

      // Get all tables for selected Dataset and display them here
      var sampleRecords: any = { recordsColumnType: {} };
      await Promise.all(
        Object.keys(pb.content.content.chartProperty.properties).map(
          async (prop) => {
            var tableInfo = pb.content.content.chartProperty.properties[prop];

            var dc_uid = tableInfo.selectedDs?.connectionId;
            var ds_uid = tableInfo.selectedDs?.id;

            // console.log("ds uid is: ", ds_uid);

            var selectedTableForThisDataset =
              pb.content.content.tabTileProps.tablesForSelectedDataSets[
                ds_uid
              ]?.filter(
                (tbl: any) => tbl.id === tableInfo.selectedTable[ds_uid]
              )[0];

            if (selectedTableForThisDataset) {
              const savedCalculationOfCurrPropKey =
                pb.content.content.calculations?.savedCalculations;
              let rowLevelcalculations = [];
              if (savedCalculationOfCurrPropKey) {
                /**
                 * if there is saved calculations for this property key, then filter out the row level calculations
                 * then only put the calculationInfo field  of those row level calculations in rowLevelcalculations array
                 */
                rowLevelcalculations = savedCalculationOfCurrPropKey
                  .filter(
                    (calculation: any) =>
                      !calculation.isAggregated &&
                      calculation.datasetId === ds_uid &&
                      calculation.tableId === selectedTableForThisDataset.id
                  )
                  .map((calculation: any) => calculation.calculationInfo);
              }

              var tableRecords = await getTableData(
                dc_uid,
                selectedTableForThisDataset,
                token,
                ds_uid,
                state?.parentId,
                rowLevelcalculations
              );

              var recordsType = await getColumnTypes(
                dc_uid,
                selectedTableForThisDataset,
                token,
                state?.parentId,
                rowLevelcalculations
              );

              // Format the data retrieved to required JSON for saving in store
              if (sampleRecords[ds_uid] !== undefined) {
                sampleRecords = update(sampleRecords, {
                  recordsColumnType: {
                    [ds_uid]: {
                      [selectedTableForThisDataset.id]: { $set: recordsType },
                    },
                  },
                  [ds_uid]: {
                    [selectedTableForThisDataset.id]: { $set: tableRecords },
                  },
                });
              } else {
                var recordsCopy = JSON.parse(JSON.stringify(sampleRecords));
                var dsObj = { [ds_uid]: {} };

                recordsCopy = update(recordsCopy, {
                  $merge: dsObj,
                  recordsColumnType: { $merge: dsObj },
                });

                sampleRecords = update(recordsCopy, {
                  recordsColumnType: {
                    [ds_uid]: {
                      [selectedTableForThisDataset.id]: { $set: recordsType },
                    },
                  },
                  [ds_uid]: {
                    [selectedTableForThisDataset.id]: { $set: tableRecords },
                  },
                });
              }
            }
          }
        )
      );

      setLoading(false);

      pb.content.content.chartControl = newChartControl;
      pb.content.content.sampleRecords = sampleRecords;
      sessionStorage.setItem(`pb_id_${pb.id}`, JSON.stringify(pb.content.content));
      loadPlayBook(pb.content.content);
      updatePlayBookId(pb.name, pb.id, pb.description, pb.content.content);

      var pbCopy = pb.content.content;
      delete pbCopy.sampleRecords;

      //navigate("/dataviewer");
    }
    else setLoading(false);
  };

  // switching between Table with all sample records Or just list the columns of selected table
  const handleColumnsOnlyDisplay = (displayOnlyCol: boolean) => {
    toggleColumns(displayOnlyCol);
  };

  // ===========================================================================================
  //                                      UI Components
  // ===========================================================================================
  const dashBoardMenuStyles = {
    height: "1.693rem",
    width: "1.693rem",
    padding: "0.2rem",
  };
  const rmenu: any[] = [
    {
      name: "Charts",
      icon: "/chart_icon_outlined.png",
      style: {
        height: "30px",
        width: "30px",
        padding: "0.2rem",
      },
    },
    {
      name: "Chart controls",
      icon: "/filter_setting_icon.png",
      style: {
        height: "30px",
        width: "30px",
        padding: "0.2rem",
        // paddingInline: "6px",
      },
    },
    {
      name: "Report Filters",
      icon: "/filter_icon_14_12_24.png",
      style: {
        height: "30px",
        width: "30px",
        padding: "0.2rem",
        marginRight: "0.1rem"
      }
    }
  ];

  const renderMenu = rmenu.map((rm: any, i: number) => {
    return (
      <img
        key={rm.name}
        className={
          rm.name === tabTileProps.selectedControlMenu
            ? "controlsIcon selectedIcon"
            : "controlsIcon"
        }
        style={rm.style}
        src={rm.icon}
        alt={rm.name}
        onClick={() => {
          if (tabTileProps.selectedControlMenu !== rm.name) {
            setMenu(rm.name);
          }
        }}
        title={rm.name}
      />
    );
  });

  

  return (
    <div className="dataViewer">
      <MenuBar from="dataViewer" />
      <div className="tabArea">
        <div className="tabItems">
          <TabRibbon />
        </div>
        {!tabTileProps.showDash &&
        !currentCalculationSession &&
        chartProperties.properties[
          `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`
        ].chartType !== "richText" ? (
          <div
            style={{
              display: "flex",
              alignItems: "right",
              justifyContent: "center",
              height: "2rem",
              // paddingRight: "11px",
              gap: "1.5rem",
            }}
          >
            {renderMenu}
          </div>
        ) : null}

        {tabTileProps.showDash || tabTileProps.dashMode === "Present" ? (
          // <div
          //   style={{
          //     display: "flex",
          //     alignItems: "center",
          //     // paddingRight: "8px",
          //   }}
          // >
          <>
            {tabTileProps.dashMode === "Edit" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "right",
                  justifyContent: "center",
                  height: "2rem",
                  // paddingRight: "11px",
                  gap: "1.5rem",
                  paddingRight: "0.2rem",
                }}
              >
                {/* <div
                  className={
                    showListofTileMenu
                      ? "dashboardMenuIconStyleSelected"
                      : "dashboardMenuIconStyle"
                  }
                > */}
                <Tooltip title="List of Tiles">
                  <GridViewIcon
                    sx={{
                      color: palette.primary.contrastText,
                      ...dashBoardMenuStyles,
                    }}
                    className={
                      showListofTileMenu ? "dashboardMenuIconStyleSelected" : ""
                    }
                    onClick={() => {
                      if (tabTileProps.dashMode === "Edit") {
                        setDashboardResizeColumn(false);
                        setShowDashboardFilter(false);
                        setShowListofTileMenu(!showListofTileMenu);
                      }
                    }}
                  />
                </Tooltip>
                {/* </div> */}
                {/* <div
                  className={
                    dashboardResizeColumn
                      ? "dashboardMenuIconStyleSelected"
                      : "dashboardMenuIconStyle"
                  }
                > */}
                <Tooltip title="Dashboard Size & Theme">
                  <img
                    src={theme}
                    alt="Dashboard Size & Theme"
                    style={{
                      // width: "20px",
                      // height: "20px",
                      // marginTop: "2px",
                      boxSizing: "border-box",
                      cursor: "pointer",
                      ...dashBoardMenuStyles,
                    }}
                    className={
                      dashboardResizeColumn
                        ? "dashboardMenuIconStyleSelected"
                        : ""
                    }
                    onClick={() => {
                      if (tabTileProps.dashMode === "Edit") {
                        setShowListofTileMenu(false);
                        setShowDashboardFilter(false);
                        setDashboardResizeColumn(!dashboardResizeColumn);
                      }
                    }}
                  />
                </Tooltip>
                {/* </div> */}
                {/* <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1rem",
                  }}
                  
                > */}
                <Tooltip title="Dashboard Filter">
                  {/* <FilterAltOutlinedIcon
                  sx={{
                    fontSize: "25px",
                  }}
                  onClick={() => {
                    // if (tabTileProps.dashMode === "Edit") {
                    setShowListofTileMenu(false);
                    setDashboardResizeColumn(false);
                    setShowDashboardFilter(!showDashboardFilter);
                    // }
                  }}
                /> */}
                  <img
                    key={"Dashboard Filters"}
                    style={{
                      // height: "1.2rem",
                      // width: "1.2rem",
                      boxSizing: "border-box",
                      ...dashBoardMenuStyles,
                    }}
                    src={"/filter_icon_14_12_24.png"}
                    alt={"Dashboard Filters"}
                    className={
                      showDashboardFilter
                        ? "dashboardMenuIconStyleSelected"
                        : ""
                    }
                    onClick={() => {
                      // if (tabTileProps.dashMode === "Edit") {
                      setShowListofTileMenu(false);
                      setDashboardResizeColumn(false);
                      setShowDashboardFilter(!showDashboardFilter);
                      // }
                    }}
                    title={"Dashboard Filters"}
                  />
                </Tooltip>
                {/* </div> */}
              </div>
            ) : null}
            {tabTileProps.dashMode !== "Edit" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  marginRight: "0.2rem",
                  // marginRight: "5px"
                }}
              >
                <Tooltip title="Dashboard Filter">
                  <img
                    key={"Dashboard Filters"}
                    style={{ ...dashBoardMenuStyles }}
                    src={"/filter_icon_14_12_24.png"}
                    alt={"Dashboard Filters"}
                    onClick={() => {
                      // if (tabTileProps.dashMode === "Edit") {
                      setShowListofTileMenu(false);
                      setDashboardResizeColumn(false);
                      setShowDashboardFilter(!showDashboardFilter);
                      // }
                    }}
                    title={"Dashboard Filters"}
                    className={
                      showDashboardFilter
                        ? "dashboardMenuIconStyleSelected"
                        : ""
                    }
                  />
                </Tooltip>
              </div>
            ) : null}
          </>
        ) : // </div>
        null}
      </div>
      {/* Show tile page or Dashboard */}
      {tabTileProps.showDash ? (
        <DashBoard
          showListofTileMenu={showListofTileMenu}
          dashboardResizeColumn={dashboardResizeColumn}
          showDashBoardFilterMenu={showDashboardFilter}
          setShowListofTileMenu={setShowListofTileMenu}
          setDashboardResizeColumn={setDashboardResizeColumn}
          setShowDashBoardFilter={setShowDashboardFilter}
        />
      ) : (
        <React.Fragment>
          <DataViewerMiddle
            tabId={tabTileProps.selectedTabId}
            tileId={tabTileProps.selectedTileId}
          />
          {tabTileProps.showDataViewerBottom ? (
            <DataViewerBottom pbId={state?.playbookId} />
          ) : null}
        </React.Fragment>
      )}

      {/* Dashboard present and edit mode related UI */}
      {tabTileProps.dashMode === "Edit" ? (
        <div
          className="tilearea"
          style={{
            alignItems: "center",
            paddingTop: 0,
          }}
        >
          {/* <div className="tileDashboard">
            <span
              title="Dashboard"
              className={
                tabTileProps.showDash
                  ? "plusTile commonTile indiItemHighlightTile"
                  : "plusTile commonTile indiItemTile"
              }
              style={{ fontSize: "12px" }}
              onClick={() => {
                showDashBoard(tabTileProps.selectedTabId, true);
              }}
            >
              Dashboard
            </span>
          </div> */}
          <Tooltip title="Dashboard">
            <Typography
              component="div"
              onClick={() => {
                showDashBoard(tabTileProps.selectedTabId, true);
              }}
              className={
                tabTileProps.showDash ? "indiItemHighlightTile" : "indiItemTile"
              }
              sx={{
                fontSize: fontSize.medium,
                display: "flex",
                lineHeight: "2rem",
                justifyContent: "center",
                alignItems: "center",
                color: "primary.contrastText",
                textAlign: "center",
                border: "1px solid rgba(224, 224, 224, 1)",
                paddingInline: "0.5rem",
                height: "1.5rem",
                cursor: "pointer",
                "&:hover": {
                  color: "rgb(64, 64, 64)",
                  background: "white",
                },
              }}
            >
              Dashboard
            </Typography>
          </Tooltip>
          <div className="tileItems" style={{ height: "1.5rem", padding: 0 }}>
            <TileRibbon />
          </div>

          {!tabTileProps.showDash &&
          chartProperties?.properties["1.1"]?.chartType !== "richText" ? (
            tabTileProps.showDataViewerBottom ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  height: "1.5rem",
                }}
              >
                {/* <div className="showTableColumns"> */}
                <ButtonGroup
                  variant="outlined"
                  aria-label="Basic button group"
                  sx={{
                    // marginBottom: "0.3rem",
                    height: "1.5rem",
                    "& .MuiButtonGroup-grouped": {
                      border: "2px solid rgba(224, 224, 224, 1)",
                      borderRadius: "0",
                    },
                  }}
                >
                  <Tooltip title="Show full table" key="Show full table">
                    <Button
                      sx={{
                        margin: 0,
                        padding: 0,
                        backgroundColor: !tabTileProps.columnsOnlyDisplay
                          ? "rgb(224, 224, 224)"
                          : "white",
                        width: "52px",
                        "&:hover": {
                          border: "2px solid #E0E0E0",
                          backgroundColor: "#E8E8E8",
                        },
                        color: "#E0E0E0",
                      }}
                      onClick={() => handleColumnsOnlyDisplay(false)}
                    >
                      <img
                        src={"/table_icon.svg"}
                        style={{
                          margin: 0,
                          padding: 0,
                          border: "none",
                          width: "12px",
                          height: "12px",
                          backgroundColor: !tabTileProps.columnsOnlyDisplay
                            ? "rgb(224, 224, 224)"
                            : "white",
                        }}
                        onClick={() => handleColumnsOnlyDisplay(false)}
                        alt="Show full table"
                      />
                    </Button>
                    {/* <TableChartOutlinedIcon
                        fontSize="small"
                          sx={{
                            color: "#666",
                            fontSize:"15px"
                          }}
                        /> */}
                  </Tooltip>
                  <Tooltip title="Show Column Headers only">
                    <Button
                      sx={{
                        margin: 0,
                        padding: 0,
                        backgroundColor: tabTileProps.columnsOnlyDisplay
                          ? "rgb(224, 224, 224)"
                          : "white",
                        width: "52px",
                        "&:hover": {
                          border: "2px solid #E0E0E0",
                          backgroundColor: "#E8E8E8",
                        },
                        color: "#E0E0E0",
                      }}
                      onClick={() => handleColumnsOnlyDisplay(true)}
                    >
                      <TableRowsIcon
                        fontSize="small"
                        style={{
                          color: "#858585",
                          fontSize: "15px",
                        }}
                      />
                    </Button>
                  </Tooltip>
                </ButtonGroup>
                {/* </div> */}
                <div
                  // className="tableDisplayToggle"
                  onClick={handleTableDisplayToggle}
                  style={{
                    width: "2rem",
                    marginRight: "0.8rem",
                    paddingTop: "0.2rem",
                  }}
                >
                  <Tooltip title="Hide table view">
                    <KeyboardArrowDownIcon
                      style={{
                        fontSize: "20px",
                        color: "#858585",
                      }}
                    />
                  </Tooltip>
                </div>
              </div>
            ) : (
              <div
                className="tableDisplayToggle"
                onClick={handleTableDisplayToggle}
              >
                <Tooltip title="Show table view">
                  <KeyboardArrowUpIcon
                    style={{ fontSize: "20px", color: "#808080" }}
                  />
                </Tooltip>
              </div>
            )
          ) : null}
        </div>
      ) : null}
      <PopUpSpinner show={loading} />
    </div>
  );
}

// ===========================================================================================
//                                 REDUX MAPPING STATE AND DISPATCH TO PROPS
// ===========================================================================================

const mapStateToProps = (state: TabTileStateProps2 & any, ownProps: any) => {
  return {
    tabTileProps: state.tabTileProps,
    chartProperties: state.chartProperties,
    token: state.isLogged.accessToken,
    calculations: state.calculations,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    showDashBoard: (tabId: number, showDash: boolean) =>
      dispatch(setShowDashBoard(tabId, showDash)),
    toggleColumns: (displayOnlyCol: boolean) =>
      dispatch(toggleColumnsOnlyDisplay(displayOnlyCol)),
    toggleDataViewerBottom: (show: boolean) =>
      dispatch(toggleShowDataViewerBottom(show)),
    setMenu: (menu: string) => dispatch(setSelectedControlMenu(menu)),
    setSelectedDataSetList: (dataset: string) =>
      dispatch(setSelectedDataSetList(dataset)),
    setTablesForDs: (tablesObj: any) =>
      dispatch(setTablesForSelectedDataSets(tablesObj)),
    setSelectedDs: (propKey: string, selectedDs: any) =>
      dispatch(setSelectedDsInTile(propKey, selectedDs)),
    setSelectedDatasetForDynamicMeasure: (dataset: any) =>
      dispatch(setSelectedDatasetForDynamicMeasure(dataset)),
    loadPlayBook: (playBook: any) => dispatch(loadPlaybook(playBook)),
    updatePlayBookId: (
      playBookName: string,
      playBookUid: string,
      description: string,
      oldContent?: string | any
    ) =>
      dispatch(
        updatePlaybookUid(playBookName, playBookUid, description, oldContent)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewer);
