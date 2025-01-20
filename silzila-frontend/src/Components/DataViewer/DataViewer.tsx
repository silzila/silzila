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

import React, { useState } from "react";
import "./dataViewer.css";
import { connect } from "react-redux";
import TabRibbon from "../TabsAndTiles/TabRibbon";
import {
  TabTileStateProps,
  TabTileStateProps2
} from "../../redux/TabTile/TabTilePropsInterfaces";
import TableRowsIcon from "@mui/icons-material/TableRows";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import TileRibbon from "../TabsAndTiles/TileRibbon";
import { Dispatch } from "redux";
import { Tooltip } from "@mui/material";
import DataViewerMiddle from "./DataViewerMiddle";
import DataViewerBottom from "./DataViewerBottom";
import {
  setSelectedControlMenu,
  setShowDashBoard,
  toggleColumnsOnlyDisplay,
  toggleShowDataViewerBottom
} from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import MenuBar from "./MenuBar";
import DashBoard from "../DashBoard/DashBoard";
import chartControlIcon from "../../assets/chart-control-icon.svg";
import settingsIcon from "../../assets/settingIcon.svg";
import filterIcon from "../../assets/filter_icon.svg";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GridViewIcon from "@mui/icons-material/GridView";
import AspectRatioRoundedIcon from "@mui/icons-material/AspectRatioRounded";
import { ChartPropertiesProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { TabStateProps } from "../../redux/TabTile/TabStateInterfaces";
import { TileStateProps } from "../../redux/TabTile/TileStateInterfaces";
import theme from "../../assets/theme.png";

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
  // dispatch
  showDashBoard,
  toggleDataViewerBottom,
  toggleColumns,
  setMenu
}: DataViewerProps) {
  const [showListofTileMenu, setShowListofTileMenu] = useState<boolean>(true);
  const [dashboardResizeColumn, setDashboardResizeColumn] =
    useState<boolean>(false);
  const [showDashboardFilter, setShowDashboardFilter] =
    useState<boolean>(false);

  // Whether to show table at the bottom of page or not
  const handleTableDisplayToggle = () => {
    toggleDataViewerBottom(!tabTileProps.showDataViewerBottom);
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
    marginLeft:"11px"
  };
  const rmenu: any[] = [
    {
      name: "Charts",
      icon: "/chart_icon_outlined.png",
      style: {
        height: "30px",
        width: "30px",
        padding: "0.2rem",
        margin: "0 15px",
      },
    },
    {
      name: "Chart controls",
      icon: "/filter_setting_icon.png",
      style: {
        height: "30px",
        width: "30px",
        padding: "0.2rem",
        margin: "0 15px",
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
        // padding: "6px 12.5px 5px 12.5px",
        // margin: "0 10px",
        margin: "0 15px",
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
        {!tabTileProps.showDash?( 
          <div
          style={{
            display: "flex",
            alignItems: "right",
            justifyContent: "center",
            height: "2rem",
            // marginLeft: "15px",
            gap: "1.5rem",
          }}
        >
            {renderMenu}
          </div>):null}
         
        
        {tabTileProps.showDash || tabTileProps.dashMode === "Present" ? (
          // <div
          //   style={{
          //     display: "flex",
          //     alignItems: "center",
          //     paddingRight: "8px",
          //   }}
          // >
            <>
            {tabTileProps.dashMode === "Edit" ? (
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
                {/* <div
                  className={
                    showListofTileMenu
                      ? "dashboardMenuIconStyleSelected"
                      : "dashboardMenuIconStyle"
                  }
                > */}
                  <Tooltip title="List of Tiles">
                    <GridViewIcon
                      sx={{...dashBoardMenuStyles }}
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
                  <Tooltip title="Dashboard Size">
                    <img
                    src={theme}
                    alt="Dashboard Size"
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
                  <Tooltip title="Dashboard Filter">
                <img
                  key={"Dashboard Filters"}
                   style={{
                       // height: "1.2rem",
                      // width: "1.2rem",
                      ...dashBoardMenuStyles,
                  }}
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
                {/* </div> */}
              </div>
            ) : null}
            {/* <div
              className={
                showDashboardFilter
                  ? "dashboardMenuIconStyleSelected"
                  : "dashboardMenuIconStyle"
              }
            > */}
             
            {/* </div> */}
            </>
        ) : null}
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

          {tabTileProps.showDataViewerBottom ? <DataViewerBottom /> : null}
        </React.Fragment>
      )}

      {/* Dashboard present and edit mode related UI */}
      {tabTileProps.dashMode === "Edit" ? (
        <div className="tilearea">
          <div className="tileDashboard">
            <span
              title="Dashboard"
              className={
                tabTileProps.showDash
                  ? "plusTile commonTile indiItemHighlightTile"
                  : "plusTile commonTile indiItemTile"
              }
              onClick={() => {
                showDashBoard(tabTileProps.selectedTabId, true);
              }}
            >
              Dashboard
            </span>
          </div>
          <div className="tileItems">
            <TileRibbon />
          </div>

          {!tabTileProps.showDash ? (
            tabTileProps.showDataViewerBottom ? (
              <>
                <div className="showTableColumns">
                  {tabTileProps.columnsOnlyDisplay ? (
                    <Tooltip title="Show full table">
                      <TableChartOutlinedIcon
                        sx={{ fontSize: "20px", color: "#666" }}
                        onClick={() => handleColumnsOnlyDisplay(false)}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Show Column Headers only">
                      <TableRowsIcon
                        style={{
                          fontSize: "20px",
                          color: "#858585"
                        }}
                        onClick={() => handleColumnsOnlyDisplay(true)}
                      />
                    </Tooltip>
                  )}
                </div>
                <div
                  className="tableDisplayToggle"
                  onClick={handleTableDisplayToggle}
                >
                  <Tooltip title="Hide">
                    <KeyboardArrowUpIcon
                      style={{
                        fontSize: "20px",
                        color: "#858585"
                      }}
                    />
                  </Tooltip>
                </div>
              </>
            ) : (
              <div
                className="tableDisplayToggle"
                onClick={handleTableDisplayToggle}
              >
                <Tooltip title="Show">
                  <KeyboardArrowUpIcon
                    style={{ fontSize: "20px", color: "#808080" }}
                  />
                </Tooltip>
              </div>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

// ===========================================================================================
//                                 REDUX MAPPING STATE AND DISPATCH TO PROPS
// ===========================================================================================

const mapStateToProps = (state: TabTileStateProps2 & any, ownProps: any) => {
  return {
    tabTileProps: state.tabTileProps,
    chartProperties: state.chartProperties
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
    setMenu: (menu: string) => dispatch(setSelectedControlMenu(menu))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewer);
