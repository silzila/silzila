// Dashboard Component is the place to position all graphs from within a tab
// graph from each tile can be selected to render here
// The dimensions of Graph area can be set to Full width or any other custom aspect ratio

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  resetGraphHighlight,
  updateGraphHighlight,
  updateTabDashDetails,
} from "../../redux/TabTile/TabActions";
import { setDashGridSize } from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import { toggleGraphSize } from "../../redux/TabTile/TileActions";
import "./DashBoard.css";
import { DashBoardProps, DashBoardStateProps } from "./DashBoardInterfaces";
import DashBoardLayoutControl from "./DashBoardLayoutControl";
import GraphRNDDash from "./GraphRNDDash";
import { Checkbox, Tooltip } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";
import { resetPageSettings } from "../../redux/PageSettings/DownloadPageSettingsActions";
import ChartFilterGroupsContainer from "../ChartFilterGroup/ChartFilterGroupsContainer";
import ChartData from "../ChartAxes/ChartData";
import Switch from "@mui/material/Switch";
import { ColorSchemes } from "../ChartOptions/Color/ColorScheme";
import ChartColors from "../ChartOptions/Color/ChartColors";
import { useDispatch } from "react-redux";
import { setTheme, setDashColorScheme,toggleAllTiles,toggleAllTabs } from "../../redux/TabTile/TabActions";


import {
  updateDashBoardGroups,
  deleteDashBoardSelectedGroup,
  addDashBoardFilterGroupTabTiles,
  setDashBoardFilterGroupsTabTiles,
  deleteDashBoardSelectedGroupAllTabTiles,
  deleteDashBoardSelectedTabTiles,
} from "../../redux/DashBoardFilterGroup/DashBoardFilterGroupAction";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Logger from "../../Logger";
import { setColorScheme } from "../../redux/ChartPoperties/ChartControlsActions";
import { number } from "echarts";

const DashBoard = ({
  // props
  showListofTileMenu,

  dashboardResizeColumn,
  showDashBoardFilterMenu,
  setShowListofTileMenu,
  setDashboardResizeColumn,
  setShowDashBoardFilter,

  // state
  chartGroup,
  dashBoardGroup,
  tabState,
  tabTileProps,
  tileState,
  pageSettings,
  chartControls,

  //ColorSchemes,

  // dispatch
  setTheme,
  toggleAllTabs,
  toggleAllTiles,
  setDashColorScheme,
  updateDashDetails,
  toggleGraphSize,
  setGridSize,
  graphHighlight,
  resetHighlight,
  resetPageSettings,
  updateDashBoardGroups,
  deleteDashBoardSelectedGroup,
  addDashBoardFilterGroupTabTiles,
  setDashBoardFilterGroupsTabTiles,
  deleteDashBoardSelectedGroupAllTabTiles,
  deleteDashBoardSelectedTabTiles,
}: DashBoardProps) => {
  var targetRef = useRef<any>();
  const dispatch = useDispatch()
  const selectedTab = tabTileProps.selectedTabId
  //console.log("selectedTab",selectedTab)
  const dashTheme = tabState.tabs[selectedTab]?.dashboardState?.colorScheme? tabState.tabs[selectedTab]?.dashboardState?.colorScheme:'peacock'
  const scheme_passed = dashTheme ?? chartControls.properties[Object.keys(chartControls.properties)[0]].colorScheme ? dashTheme ?? chartControls.properties[Object.keys(chartControls.properties)[0]].colorScheme:'peacock'
  const [mouseDownOutsideGraphs, setmouseDownOutsideGraphs] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<any>({});
  const theme = tabState.tabs[selectedTab]?.dashboardState?.theme ? tabState.tabs[selectedTab]?.dashboardState?.theme: 'FlatUI'
  const color_scheme = tabState.tabs[selectedTab]?.dashboardState?.colorScheme ? tabState.tabs[selectedTab]?.dashboardState?.colorScheme :'peacock'
  const [innerDimensions, setinnerDimensions] = useState<any>({});
  const [softUI, setSoftUI] = useState<boolean>(theme === 'SoftUI');
  const [selectedColorScheme, setSelectedColorScheme] = useState("");
  const [schemeColor, setSchemeColor] = useState<string>(scheme_passed);
  const Tabs_Toggle=tabState.tabs[selectedTab]?.dashboardState?.allTabs ? tabState.tabs[selectedTab]?.dashboardState?.allTabs: true
  const Tiles_Toggle=tabState.tabs[selectedTab]?.dashboardState?.allTiles? tabState.tabs[selectedTab]?.dashboardState?.allTiles: true
  const [ApplytoAllTabs, setApplytoAllTabs] = useState<boolean>(Tabs_Toggle);
  const [ApplytoTiles, setApplytoTiles]=useState<boolean>(Tiles_Toggle);

  useEffect(() => { setSoftUI(theme === 'SoftUI'); setSchemeColor(color_scheme) }, [theme, color_scheme,softUI]);
  const handleThemeChange = (newtheme: string) => {
    //console.log(newtheme,softUI)
    let chosenTheme=newtheme
    //console.log(chosenTheme)
    setSoftUI(chosenTheme === 'SoftUI');
    //console.log(newtheme,softUI)
    setTheme(newtheme, tabTileProps.selectedTabId);

  }; // Dispatch Redux action };
  useEffect(()=>{
    console.log(softUI)
    console.log(theme)
  },[softUI,theme])

  // Handle Toggle for "Apply to All Tabs"
  const handleToggleAllTabs = () => {
    const newState = !ApplytoAllTabs; // Toggle state
    setApplytoAllTabs(newState);
    Object.keys(tabState.tabs).forEach((tabkey) => {
      toggleAllTabs(parseInt(tabkey, 10)) // Update Redux state
    });
  };

// Handle Toggle for "Apply to All Tiles"
const handleToggleAllTiles = () => {
    const newState = !ApplytoTiles; // Toggle state
    setApplytoTiles(newState);
    Object.keys(tabState.tabs).forEach((tabkey) => {
      console.log("Dispatching TOGGLE_ALL_TILES for tab:", tabkey);
      toggleAllTiles(parseInt(tabkey, 10))
     // Update Redux state
  });
};

  const getBoxShadow = (schemeColor: any) => {
    if (schemeColor === "dark") {
      // Dark Scheme: rgba(51, 51, 51, 1) (Use a strong dark shadow)
      return "8px 8px 20px rgba(0,0,0,0.6), -8px -8px 20px rgba(0,0,0,0.2)"; // Darker shadow for uplifted look
    } else if (schemeColor === "chalk") {
      // Chalk Scheme: rgba(41, 52, 65, 1) (Use a subtle, moderate shadow)
      return "8px 8px 18px rgba(0,0,0,0.4), -8px -8px 18px rgba(0,0,0,0.2)"; // Slightly muted shadow
    } else if (schemeColor === "halloween") {
      // Halloween Scheme: rgba(64, 64, 64, 0.75) (Use a light dark shadow for contrast)
      return "8px 8px 15px rgba(0,0,0,0.3), -8px -8px 15px rgba(0,0,0,0.1)"; // Light shadow
    } else if (schemeColor === "purplePassion") {
      // Purple Passion Scheme: rgba(91, 92, 110, 1) (Use a strong dark shadow)
      return "8px 8px 20px rgba(0,0,0,0.5), -8px -8px 20px rgba(0,0,0,0.2)"; // Stronger shadow for a rich look
    }

    // Default return for any other scheme (fallback to light shadow)
    return "8px 8px 15px rgba(0,0,0,0.15), -8px -8px 15px rgba(255,255,255,0.8)";
  };



  var dashbackground: string = `
  linear-gradient(-90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
	linear-gradient( rgba(0, 0, 0, 0.05) 1px, transparent 1px),
	linear-gradient(-90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
	linear-gradient( rgba(0, 0, 0, 0.05) 1px, transparent 1px)`;//only in light color scheme

  var darkbackground: string = `linear-gradient(-90deg, rgba(204, 204, 204, 0.1) 1px, transparent 1px),
  linear-gradient(rgba(204, 204, 204, 0.1) 1px, transparent 1px),
  linear-gradient(-90deg, rgba(204, 204, 204, 0.1) 1px, transparent 1px),
  linear-gradient(rgba(204, 204, 204, 0.1) 1px, transparent 1px)`; // only in dark color scheme


  const [backgroundColor, setBackgroundColor] = useState<string>("");
  var presentbackground: string = backgroundColor;
   // useEffect(()=>{
  //   console.log(ColorSchemes)
  //   const selectedScheme=ColorSchemes.filter(scheme=> scheme.name===scheme_passed)
  //   console.log(selectedScheme);
  //   const bgcolor=selectedScheme[0].background
  //   setBackgroundColor(bgcolor);
  // },[selectedTab])

  useEffect(() => {
    

    // Find the selected color scheme
    const selectedScheme = ColorSchemes.find(scheme => scheme.name === scheme_passed);
  
    if (selectedScheme) {
      
      const bgcolor = selectedScheme.background;
      setBackgroundColor(bgcolor);
      
  
      if (ApplytoAllTabs) {
        // Apply the background color to all tabs
        Object.keys(tabState.tabs).forEach((tabkey) => {
          setDashColorScheme(scheme_passed, parseInt(tabkey, 10));
    
          tileState.tileList[parseInt(tabkey, 10)].forEach((propkey) =>
            dispatch(setColorScheme(propkey, scheme_passed))
          );
        });
        // Object.keys(tabState).forEach((tabkey)=>
        //   console.log(tabkey),
        //   setDashColorScheme(scheme_passed,parseInt(tabkey,10))
        // );
      }  
      if(!ApplytoAllTabs){
        const allTilesForSelectedTab = tileState.tileList[selectedTab];
        setDashColorScheme(scheme_passed,selectedTab);
        allTilesForSelectedTab.forEach((propkey) =>
          dispatch(setColorScheme(propkey, scheme_passed))
        );

      }if(ApplytoTiles) {
        // Apply to all tiles, the color scheme 
        const allTilesForSelectedTab = tileState.tileList[selectedTab];
        allTilesForSelectedTab.forEach((propkey) =>
          dispatch(setColorScheme(propkey, scheme_passed))
        );
      } if(!ApplytoTiles){
        const allTilesForSelectedTab = tileState.tileList[selectedTab];
        allTilesForSelectedTab.forEach((propkey) =>
          dispatch(setColorScheme(propkey, "peacock"))
        );

      }
    } else {
      console.warn('No matching color scheme found');
    }
  }, [selectedTab, scheme_passed, ApplytoAllTabs,ApplytoTiles]);
  

  const [dashStyle, setdashStyle] = useState<any>({
    width: innerDimensions.width,
    height: innerDimensions.height,
    backgroundImage: ["dark", "halloween", "purplePassion", "chalk"].includes(
      schemeColor
    )
      ? darkbackground
      : dashbackground,
  });

  const [dashStyle1, setdashStyle1] = useState<any>({
    width: innerDimensions.width,
    height: innerDimensions.height,
    backgroundColor: presentbackground,
  });



  const [style, setStyle] = useState<any>({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px transparent",
    backgroundColor: "white",
    boxSizing: "border-box",
    zIndex: 10,
  });

  const [style2, setStyle2] = useState<any>({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px darkGray",
    backgroundColor: "white",
    boxSizing: "border-box",
    zIndex: 20,
  });

  const skeuomorphicStyle = {
    /*boxShadow: "8px 8px 15px rgba(0,0,0,0.15), -8px -8px 15px rgba(255,255,255,0.8)",*/
    //backgroundColor: backgroundColor,
    // borderRadius: "12px",
  };
  const tileskeuomorphicStyle = {
    boxShadow: getBoxShadow(schemeColor), // backgroundColor is dynamically passed
    borderRadius: "12px",
  };

  const skeuomorphicInnerStyle = {
    boxShadow:
      "inset 4px 4px 8px rgba(0,0,0,0.2), inset -4px -4px 8px rgba(255,255,255,0.7)",
    //backgroundColor: backgroundColor,//"#EEF0F7",//f3f3f3
    borderRadius: "8px",
  };

  const getHeightAndWidth = (paperHeight: number, paperWidth: number) => {
    var graphHeight = dashStyle.height;
    var graphWidth = dashStyle.width;
    const pageHeight =
      paperHeight - (pageSettings.top_margin + pageSettings.bottom_margin);
    const pageWidth =
      paperWidth - (pageSettings.right_margin + pageSettings.left_margin);
    var heightRatio = pageHeight / graphHeight;
    var widthRatio = pageWidth / graphWidth;
    // getting least value
    var ratio = Math.min(heightRatio, widthRatio);
    var finalHeight = graphHeight * ratio;
    var finalWidth = graphWidth * ratio;
    return { height: finalHeight, width: finalWidth };
  };

  useEffect(() => {
    if (pageSettings.callForDownload) {
      const input = document.getElementById(
        "GraphAreaToDownload"
      ) as HTMLElement;

      const d = new Date();
      const id = `${tabTileProps.selectedTabName}_${d.getDate()}${d.getMonth() + 1
        }${d.getFullYear()}:${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;

      if (pageSettings.downloadType === "pdf") {
        html2canvas(input).then((canvas) => {
          const imageData = canvas.toDataURL("image/png");

          const pdf = new jsPDF(
            pageSettings.SelectedOrientation,
            "px",
            pageSettings.selectedFormat
          );
          var width = pdf.internal.pageSize.getWidth();
          var height = pdf.internal.pageSize.getHeight();
          const heightAndWidth = getHeightAndWidth(height, width);
          pdf.addImage(
            imageData,
            "JPEG",
            pageSettings.left_margin,
            pageSettings.top_margin,
            heightAndWidth.width,
            heightAndWidth.height
          );
          pdf.save(`${id}`);
          resetPageSettings();
        });
      } else {
        toPng(input, { cacheBust: true })
          .then((dataUrl: any) => {
            const link = document.createElement("a");
            link.download = `${id}`;
            link.href = dataUrl;
            link.click();
            resetPageSettings();
          })
          .catch((err: any) => {
            Logger("error", "", err);
          });
      }
    }
  }, [pageSettings.callForDownload]);

  // Every time the dimensions or dashboard layout changes,
  // recompute the space available for graph
  useEffect(() => {
    graphArea();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dimensions, tabState.tabs[tabTileProps.selectedTabId].dashLayout, tabTileProps.dashMode]);

  // When dashboard is changed from edit to present mode, enable or disable
  // the grid like background in dashboard area
  useEffect(() => {
    if (tabTileProps.dashMode === "Present") {
      setdashStyle1({ ...dashStyle1, background: presentbackground });
    } else if (tabTileProps.dashMode === "Edit") {
      setdashStyle({
        ...dashStyle,
        backgroundImage: [
          "dark",
          "halloween",
          "purplePassion",
          "chalk",
        ].includes(schemeColor)
          ? darkbackground
          : dashbackground,
      });
    }
  }, [tabTileProps.dashMode, schemeColor]);

  let movement_timer: null | any = null;
  const RESET_TIMEOUT: number = 300;
  const handleResize = () => {
    clearInterval(movement_timer);
    movement_timer = setTimeout(test_dimensions, 10);
  };

  const test_dimensions = () => {
    if (targetRef.current) {
      setDimensions({
        width: targetRef.current.offsetWidth,
        height: targetRef.current.offsetHeight,
      });
    }
  };

  useLayoutEffect(() => {
    test_dimensions();
  }, [
    tabTileProps.showDash,
    tabTileProps.dashMode,
    showListofTileMenu,
    dashboardResizeColumn,
    showDashBoardFilterMenu,
  ]);

  // Given the dimension of dashboard area available,
  // if Fullscreen option or Aspect ratio option selected,
  // compute the width and height of available area for graphs
  useEffect(() => {
    if (softUI) {
      setdashStyle((prevStyle: any) => ({
        ...prevStyle,
        backgroundColor: backgroundColor,
        boxShadow: softUI
          ? "8px 8px 15px rgba(0,0,0,0.15), -8px -8px 15px rgba(255,255,255,0.8)"
          : "none", // Conditionally apply SoftUI box-shadow
        ...skeuomorphicStyle,
      }));
      setStyle((prevStyle: any) => ({
        ...prevStyle,
        backgroundColor: backgroundColor,
        ...tileskeuomorphicStyle,
      }));
      setStyle2((prevStyle: any) => ({
        ...prevStyle,
        backgroundColor: backgroundColor,
        ...skeuomorphicInnerStyle,
      }));
    } else {
      setdashStyle((prevStyle: any) => ({
        ...prevStyle,
        boxShadow: "none",
        backgroundColor: backgroundColor,
        borderRadius: "0px",
      }));
      setStyle((prevStyle: any) => ({
        ...prevStyle,
        boxShadow: "none",
        backgroundColor: backgroundColor,
        borderRadius: "0px",
      }));
      setStyle2((prevStyle: any) => ({
        ...prevStyle,
        boxShadow: "none",
        backgroundColor: backgroundColor,
        borderRadius: "0px",
      }));
    }
  }, [backgroundColor, softUI]);

  // Ensure schemeColor and softUI are dependencies to trigger when they change

  const graphArea = () => {
    var dashLayoutProperty =
      tabState.tabs[tabTileProps.selectedTabId].dashLayout;



    if (
      dashLayoutProperty.dashboardLayout === "Auto" &&
      dashLayoutProperty.selectedOptionForAuto === "Full Screen"
    ) {
      // Approximately divided the area into 32 sections wide & 18 sections height
      // var fullWidth = Math.trunc(dimensions.width / 32, 0) * 32;
      var fullWidth = Math.trunc(dimensions.width / 32) * 32;

      // var fullHeight = Math.trunc(dimensions.height / 18, 0) * 18;
      var fullHeight = Math.trunc(dimensions.height / 18) * 18;

      // setting dashboard graph area according to above size
      setinnerDimensions({ width: fullWidth, height: fullHeight });

      if (tabTileProps.dashMode === "Present") {

        setdashStyle1({
          ...dashStyle1,
          backgroundColor: backgroundColor,
          width: fullWidth,
          height: fullHeight,
          backgroundSize: `${fullWidth / 32}px ${fullHeight / 18}px, 
          ${fullWidth / 32}px ${fullHeight / 18}px, 
          ${fullWidth / 2}px ${fullWidth / 2}px,
          ${fullHeight / 2}px ${fullHeight / 2}px`,
        });
      }
      else if (tabTileProps.dashMode === "Edit") {
        // set grid like background of dashboard accordingly
        console.log("Edit function")

        setdashStyle({
          ...dashStyle,
          width: fullWidth,
          height: fullHeight,
          backgroundSize: `${fullWidth / 32}px ${fullHeight / 18}px, 
				${fullWidth / 32}px ${fullHeight / 18}px, 
				${fullWidth / 2}px ${fullWidth / 2}px,
				${fullHeight / 2}px ${fullHeight / 2}px`,
        });
      }

      // compute size of each of the grid and save it in store
      // used by graph area in tile for displaying graph in dashboard size
      setGridSize({ x: fullWidth / 32, y: fullHeight / 18 });
    }

    if (
      dashLayoutProperty.dashboardLayout === "Auto" &&
      dashLayoutProperty.selectedOptionForAuto === "Aspect Ratio"
    ) {
      // ======================================================
      // For aspect ratio

      // Get user defined aspect ratio and set number of grids (twice that of width & height)
      var xUnit = dimensions.width / (dashLayoutProperty.aspectRatio.width * 2);
      var yUnit =
        dimensions.height / (dashLayoutProperty.aspectRatio.height * 2);

      // checking if the x unit or the y unit can be used as a base unit
      // for computing total size of dashboard graph area

      // Using xUnit as a base
      if (
        xUnit * (dashLayoutProperty.aspectRatio.height * 2) >
        dimensions.height
      ) {
      } else {
        // var truncatedX = Math.trunc(xUnit, 0);
        var truncatedX = Math.trunc(xUnit);
        setinnerDimensions({
          width: truncatedX * (dashLayoutProperty.aspectRatio.width * 2),
          height: truncatedX * (dashLayoutProperty.aspectRatio.height * 2),
        });
        setdashStyle({
          ...dashStyle,
          width: truncatedX * (dashLayoutProperty.aspectRatio.width * 2),
          height: truncatedX * (dashLayoutProperty.aspectRatio.height * 2),
          backgroundSize: `${truncatedX}px ${truncatedX}px, 
					${truncatedX}px ${truncatedX}px, 
					${truncatedX * dashLayoutProperty.aspectRatio.width}px 
					${truncatedX * dashLayoutProperty.aspectRatio.width}px, 
					${truncatedX * dashLayoutProperty.aspectRatio.height}px 
					${truncatedX * dashLayoutProperty.aspectRatio.height}px`,
        });

        setGridSize({ x: truncatedX, y: truncatedX });
      }

      // Using yUnit as a base
      if (
        yUnit * (dashLayoutProperty.aspectRatio.width * 2) >
        dimensions.width
      ) {
      } else {
        // var truncatedY = Math.trunc(yUnit, 0);
        var truncatedY = Math.trunc(yUnit);
        setinnerDimensions({
          width: truncatedY * (dashLayoutProperty.aspectRatio.width * 2),
          height: truncatedY * (dashLayoutProperty.aspectRatio.height * 2),
        });

        setdashStyle({
          ...dashStyle,
          width: truncatedY * (dashLayoutProperty.aspectRatio.width * 2),
          height: truncatedY * (dashLayoutProperty.aspectRatio.height * 2),
          backgroundSize: `${truncatedY}px ${truncatedY}px , 
					${truncatedY}px ${truncatedY}px, 
					${truncatedY * dashLayoutProperty.aspectRatio.width}px 
					${truncatedY * dashLayoutProperty.aspectRatio.width}px, 
					${truncatedY * dashLayoutProperty.aspectRatio.height}px 
					${truncatedY * dashLayoutProperty.aspectRatio.height}px`,
        });

        setGridSize({ x: truncatedY, y: truncatedY });
      }
    }
  };

  // List of tiles to be mapped on the side of dashboard,
  // allowing users to choose graphs from these tiles
  let tilesForSelectedTab = tileState.tileList[tabTileProps.selectedTabId];

  let tileList = tilesForSelectedTab.map((tile: any, index: number) => {
    let currentObj = tileState.tiles[tile];
    var propKey: string = `${currentObj.tabId}.${currentObj.tileId}`;

    const dashSpecs = {
      name: currentObj.tileName,
      highlight: false,
      propKey,
      tileId: currentObj.tileId,
      width: 10,
      height: 6,
      x: 11,
      y: 6,
    };

    var propIndex: number =
      tabState.tabs[currentObj.tabId].tilesInDashboard.indexOf(propKey);
    var indexOfProps =
      tabState.tabs[currentObj.tabId].tilesInDashboard.includes(propKey);
    var checked: boolean = indexOfProps ? true : false;

    return (
      <div
        key={index}
        className={
          tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails[propKey]
            ?.highlight
            ? "listOfGraphsHighlighted"
            : "listOfGraphs"
        }
      >
        <label>
          <Checkbox
            sx={{
              "&.Mui-checked": {
                color: "#2bb9bb",
              },
              "&.Mui-disabled": {
                color: "#B1B1B1",
              },
            }}
            style={{ width: "0.5rem", height: "0.5rem", margin: "auto 5px auto 0" }}
            size="small"
            key={index}
            checked={checked}
            onChange={(event) => {
              updateDashBoardFilters(event, propKey);
              updateDashDetails(
                checked,
                propKey,
                dashSpecs,
                tabTileProps.selectedTabId,
                propIndex
              );
              ////toggleGraphSize(propKey, checked ? true : false); /*  PRAKASH 23Dec2024 */
              //toggleGraphSize(propIndex, checked ? true : false);
            }}

          />
          <span className="graphName">{currentObj.tileName}</span>
        </label>
      </div>
    );
  });

  const updateDashBoardFilters = (event: any, tileSelected: string) => {
    if (event.target.checked) {
      chartGroup?.tabTile[tileSelected]?.forEach((groupID: string) => {
        if (!dashBoardGroup?.filterGroupTabTiles[groupID]) {
          addDashBoardFilterGroupTabTiles(groupID);
        }

        if (!dashBoardGroup.groups.includes(groupID)) {
          updateDashBoardGroups(groupID);
        }

        let tabTilesList: any = [];
        tabTilesList.push(tileSelected);

        setDashBoardFilterGroupsTabTiles(groupID, tabTilesList);
      });
    } else {
      dashBoardGroup.groups?.forEach((groupID: string) => {
        if (
          dashBoardGroup.filterGroupTabTiles[groupID].includes(tileSelected)
        ) {
          if (dashBoardGroup.filterGroupTabTiles[groupID].length === 1) {
            deleteDashBoardSelectedGroup(groupID);
            deleteDashBoardSelectedGroupAllTabTiles(groupID);
          } else {
            deleteDashBoardSelectedTabTiles(
              groupID,
              dashBoardGroup.filterGroupTabTiles[groupID].findIndex(
                (id: string) => id === tileSelected
              )
            );
          }
        }
      });
    }
  };

  useEffect(() => {
    renderGraphs();
  }, [tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails, dashStyle]);

  const softUISliderComponent = (
    <div className="themeSelector">
      <h4 style={{ textAlign: "left", marginLeft: "15px", color: "#616164" }}>
        Theme
      </h4>
      <div
        className="checkboxOption"
        style={{
          textAlign: "left",
          color: "#616164",
          fontSize: "15px",
          marginBottom: "15px",
        }}
      >
        <input
          type="radio"
          id="flatUI"
          checked={!softUI}
          onChange={() => handleThemeChange('FlatUI')}
          className="customRadio"
        />
        <label htmlFor="flatUI" className="customLabel">FlatUI</label>
      </div>
      <div
        className="checkboxOption"
        style={{
          textAlign: "left",
          color: "#616164",
          fontSize: "15px",
        }}
      >
        <input
          type="radio"
          id="softUI"
          checked={softUI}
          onChange={() => handleThemeChange("SoftUI")}
          className="customRadio"
        />
        <label htmlFor="softUI" className="customLabel">SoftUI</label>
      </div>

      <div
        className="colorSchemeSelector"
        style={{ marginLeft: "15px", marginTop: "20px" }}
      >
        {/* Include the ChartColors or ColorScheme component */}
        <ChartColors
          //chart color has a default behaviour of changing color scheme of all tiles in all tabs
          //from=dashboard will prevent this behaviour
          from="dashboard"
          selectedTab={selectedTab}
          onBackgroundColorChange={(color: {
            schemeName: string;
            color: string;
          }) => {
            // Extract schemeName and color from the object
            const { schemeName, color: backgroundColor } = color;
            setSchemeColor(schemeName);
            //setDashColorScheme(schemeName, selectedTab);
            // Update state or perform other actions
            setBackgroundColor(backgroundColor); // Example: Updating a state in the parent
            //Setting Color scheme for all tiles in a particular tab
            if (ApplytoAllTabs) {
              // Apply to all tabs
              Object.keys(tabState.tabs).forEach((tabkey) => {
                setDashColorScheme(schemeName, parseInt(tabkey, 10));
                tileState.tileList[parseInt(tabkey, 10)].forEach((propkey) =>
                  dispatch(setColorScheme(propkey, schemeName))
                );
              });
            }  if(!ApplytoAllTabs){
              const allTilesForSelectedTab = tileState.tileList[selectedTab];
              setDashColorScheme(schemeName,selectedTab);
              allTilesForSelectedTab.forEach((propkey) =>
                dispatch(setColorScheme(propkey, scheme_passed))
              );
            }
            if(ApplytoTiles) {
              // Apply to all tiles, the color scheme 
              const allTilesForSelectedTab = tileState.tileList[selectedTab];
              allTilesForSelectedTab.forEach((propkey) =>
                dispatch(setColorScheme(propkey, scheme_passed))
              );
            } if(!ApplytoTiles){
              //Applying default Color Scheme "Peacock" to all tiles
              const allTilesForSelectedTab = tileState.tileList[selectedTab];
              allTilesForSelectedTab.forEach((propkey) =>
                dispatch(setColorScheme(propkey, "peacock"))
              );
            }
          }}
        />
      </div>
      <div style={{  marginTop: "20px" }}>
        <div style={{ marginBottom: "10px", display: "flex", alignItems: "center", fontSize:"13px",marginLeft: "35px"}}>
          <input
            type="checkbox"
            id="applytoAllTabs"
            checked={ApplytoAllTabs}
            onChange={() => handleToggleAllTabs()} 
            style= {{margin: "0", marginRight: "6px"}}
          />
          <label htmlFor="applytoAllTabs" >
            Apply Scheme across Playbook
          </label>
        </div>
        <div style={{marginBottom: "10px", display: "flex", alignItems: "center", fontSize:"13px",marginLeft: "35px"}}>
          <input
            type="checkbox"
            id="applytoCurrentTab"
            checked={ApplytoTiles}
            onChange={() => handleToggleAllTiles()} 
            style= {{margin: "0", marginRight: "6px"}} 
          />
          <label htmlFor="applytoCurrentTab" style={{border: "1pxx solid red"}} >
            Apply Scheme to all tiles
          </label>
        </div>
      </div>
    </div>
  );

  const renderGraphs = () => {
    return tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.map(
      (box, index) => {
        var boxDetails =
          tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails[box];
        let colorScheme = chartControls.properties[box].colorScheme;
        if(!ApplytoTiles){
          colorScheme=scheme_passed
        }
        return (
          <GraphRNDDash
            key={index}
            softUI={softUI}
            style={softUI ? tileskeuomorphicStyle : ""}
            backgroundColor={backgroundColor}
            colorScheme={colorScheme}
            mouseDownOutsideGraphs={mouseDownOutsideGraphs}
            tabId={tabTileProps.selectedTabId}
            boxDetails={boxDetails}
            setStyle={setStyle}
            style2={style2}
            setStyle2={setStyle2}
            gridSize={{ x: dashStyle.width, y: dashStyle.height }}
          />
        );
      }
    );
  };

  return (
    <div
      className="dashboardWrapper"
      onMouseDown={(e: any) => {
        var container = "dragHeader";
        var container2 = "dashChart";
        var container3 = "rndObject";

        if (e.target.attributes.class) {
          if (
            e.target.attributes.class.value === container ||
            e.target.attributes.class.value === container2 ||
            e.target.attributes.class.value === container3
          ) {
            setmouseDownOutsideGraphs(false);
          } else {
            setmouseDownOutsideGraphs(true);
          }
        }
      }}
    >
      <div className="dashboardOuter" ref={targetRef}>
        <div
          id="GraphAreaToDownload"
          className={`dashboardArea ${softUI ? "skeuomorphic" : ""}`}
          style={
            pageSettings.callForDownload
              ? {
                ...dashStyle,
                // backgroundColor: { backgroundColor },
                borderTop: "2px solid rgba(224,224,224,1)",
                boxShadow: "none",
              }
              : tabTileProps.dashMode === "Edit" ? { ...dashStyle, backgroundColor: backgroundColor } : { ...dashStyle1, backgroundColor: backgroundColor }
          }
        >
          {tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.length >
            0 ? (
            renderGraphs()
          ) : (
            <div
              id="GraphAreaToDownload"
              className={softUI ? "skeuomorphic-inner" : ""}
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999999",
                borderTop: pageSettings.callForDownload
                  ? "2px solid rgba(224,224,224,1)"
                  : "0px",
              }}
            >
              <pre style={{ fontSize: "16px", fontFamily: "Roboto-Regular !important",}}>
                {tabTileProps.dashMode === "Edit" ? `No graphs selected\n\nSelect tiles from right panel to place graph here` : `No graphs selected`}
              </pre>
            </div>
          )}
        </div>
      </div>
      {tabTileProps.dashMode === "Edit" ? (
        <div>
          {showListofTileMenu ? (
            <div className="dashBoardSideBar">
              <div className="tileListContainer">
                <div className="axisTitle">
                  List of Tiles
                  <Tooltip title="Hide">
                    <KeyboardArrowUpIcon
                      sx={{
                        fontSize: "16px",
                        float: "right",
                        marginRight: "0.7rem",
                      }}
                      onClick={() => setShowListofTileMenu(false)}
                    />
                  </Tooltip>
                </div>
                {tileList}
              </div>
            </div>
          ) : dashboardResizeColumn ? (
            <>
              {dashboardResizeColumn ? (
                <div className="dashBoardSideBar">
                  <DashBoardLayoutControl
                    setDashboardResizeColumn={setDashboardResizeColumn}
                    softUISlider={softUISliderComponent}
                    backgroundColor={backgroundColor} // Pass the backgroundColor prop
                    setBackgroundColor={setBackgroundColor}
                  />
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}
      {showDashBoardFilterMenu ? (
        <>
          <div className="dashBoardSideBar">
            <ChartData
              tabId={tabTileProps.selectedTabId}
              tileId={tabTileProps.selectedTileId}
              screenFrom="Dashboard"
            ></ChartData>
            <ChartFilterGroupsContainer
              propKey={"0.0"}
              fromDashboard={true}
            ></ChartFilterGroupsContainer>
          </div>
        </>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: DashBoardStateProps & any, ownProps: any) => {
  return {
    chartGroup: state.chartFilterGroup,
    dashBoardGroup: state.dashBoardFilterGroup,
    tabState: state.tabState,
    tabTileProps: state.tabTileProps,
    tileState: state.tileState,
    pageSettings: state.pageSettings,
    chartControls: state.chartControls,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    setTheme: (theme: string, tabId: number) => dispatch(setTheme(theme, tabId)),
    setDashColorScheme: (colorScheme: string, tabId: number,) => dispatch(setDashColorScheme(colorScheme, tabId)),
    toggleAllTiles:(tabId:number)=>dispatch(toggleAllTiles(tabId)),
    toggleAllTabs:(tabId:number)=>dispatch(toggleAllTabs(tabId)),
    updateDashDetails: (
      checked: boolean,
      propKey: string,
      dashSpecs: any,
      tabId: number,
      propIndex: number
    ) =>
      dispatch(
        updateTabDashDetails(checked, propKey, dashSpecs, tabId, propIndex)
      ),

    toggleGraphSize: (tileKey: string, graphSize: boolean) =>
      dispatch(toggleGraphSize(tileKey, graphSize)),

    graphHighlight: (
      tabId: number,
      propKey: string,
      highlight: boolean | any
    ) => dispatch(updateGraphHighlight(tabId, propKey, highlight)),
    resetHighlight: (tabId: number) => dispatch(resetGraphHighlight(tabId)),
    setGridSize: (gridSize: any) => dispatch(setDashGridSize(gridSize)), //gridSize{ x: null | number | string; y: null | number | string }
    resetPageSettings: () => dispatch(resetPageSettings()), //gridSize{ x: null | number | string; y: null | number | string }

    updateDashBoardGroups: (groupId: string) =>
      dispatch(updateDashBoardGroups(groupId)),
    deleteDashBoardSelectedGroup: (groupId: string) =>
      dispatch(deleteDashBoardSelectedGroup(groupId)),
    deleteDashBoardSelectedGroupAllTabTiles: (groupId: string) =>
      dispatch(deleteDashBoardSelectedGroupAllTabTiles(groupId)),
    addDashBoardFilterGroupTabTiles: (groupId: string) =>
      dispatch(addDashBoardFilterGroupTabTiles(groupId)),
    setDashBoardFilterGroupsTabTiles: (
      groupId: string,
      selectedTabTiles: any
    ) => dispatch(setDashBoardFilterGroupsTabTiles(groupId, selectedTabTiles)),
    deleteDashBoardSelectedTabTiles: (groupId: string, selectedTabTiles: any) =>
      dispatch(deleteDashBoardSelectedTabTiles(groupId, selectedTabTiles)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
function setDashboardColorScheme(selectedTabId: number, scheme: any): any {
  throw new Error("Function not implemented.");
}

function propkey(value: string, index: number, array: string[]): void {
  throw new Error("Function not implemented.");
}

