// This component represent each individual table field dropped inside dropzone
// Each card has some aggregate values and option to select different aggregate and/or timeGrain values

import React, { useEffect, useState } from "react";
import "./Card.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { connect } from "react-redux";
import {
  editChartPropItem,
  revertAxes,
  sortAxes,
  enableOverrideForUIDAction,
  createChartAxesForUID,
} from "../../redux/ChartPoperties/ChartPropertiesActions";
import {
  Button,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  styled,
  withStyles,
} from "@mui/material";
import { AggregatorKeys } from "./Aggregators";
import { useDrag, useDrop } from "react-dnd";
import { Dispatch } from "redux";
import { TabTileStateProps2 } from "../../redux/TabTile/TabTilePropsInterfaces";
import { ChartPropertiesStateProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { CardProps } from "./ChartAxesInterfaces";
import {
  editChartPropItemForDm,
  revertAxesForDm,
  sortAxesForDm,
} from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import { SiWindows11 } from "react-icons/si";
import { FaRocket } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { MdOutlineSwipeUpAlt } from "react-icons/md";
import Logger from "../../Logger";
import { CardOption } from "./CardOption";
import WindowFunction from "./CardComponents/WindowFuction";

import RenameFunction from "./CardComponents/RenameFunction";
import { fieldName } from "../CommonFunctions/CommonFunctions";
import { ClassNames } from "@emotion/react";
import { id } from "date-fns/locale";
import { TooltipProps } from "@mui/material/Tooltip";
import { setDisplayName } from "../ChartAxes/setDisplayName";

// interface PriceTagTooltipProps {
//     text: string|undefined;
//     fillColor?: string;
//     textColor?: string;
//     fontSize?: number;
// 	open:boolean;
// 	display:string;
// 	alignItems: string;
// 	marginLeft: string;
//   }

// const PriceTagTooltip: React.FC<PriceTagTooltipProps> = ({ text, fillColor = 'white', textColor = 'black', fontSize =30, }) => (
// 	<svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
// 	  <path d="M10,10 L90,10 L90,80 L50,100 L10,80 Z" fill={fillColor} stroke="black" />
// 	  <text
// 		x="50%"
// 		y="50%"
// 		dominantBaseline="middle"
// 		textAnchor="middle"
// 		fontSize={fontSize}
// 		fill={textColor}
// 		transform="rotate(-90 50 50)"
// 	  >
// 		{text}
// 	  </text>
// 	</svg>
//   );

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "white",
    color: "#2bb9bb",
    fontSize: "13px",
    border: "1px solid  #2bb9bb",
  },
  [`& .MuiTooltip-arrow`]: {
    color: "white",
    "&::before": {
      width: "10px", // Adjust arrow width
      height: "14px", // Adjust arrow height
      border: "1px solid  #2bb9bb",
    },
  },
}));

const Card = ({
  // props
  field,
  bIndex,
  itemIndex,
  propKey,
  axisTitle,
  uID,

  // state
  tabTileProps,
  chartProp,
  dynamicMeasureState,

  // dispatch
  // chartPropUpdated,
  deleteDropZoneItems,
  updateQueryParam,
  sortAxes,
  revertAxes,
  enableOverrideForUIDAction,
  createChartAxesForUID,

  //dynamicMeasure dispatch
  deleteDropZoneItemsForDm,
  updateAxesQueryParamForDm,
  sortAxesForDm,
  revertAxesForDm,
}: CardProps) => {
  field.dataType = field?.dataType?.toLowerCase();

  var chartType =
    chartProp.properties[
      `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`
    ].chartType;

  const originalIndex =
    chartType === "richText"
      ? dynamicMeasureState.dynamicMeasureProps?.[
          dynamicMeasureState.selectedTabId
        ]?.[dynamicMeasureState.selectedTileId]?.[
          `${dynamicMeasureState.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`
        ].chartAxes[bIndex].fields.findIndex(
          (item: any) => item.uId === field.uId
        )
      : chartProp.properties[propKey].chartAxes[bIndex].fields.findIndex(
          (item: any) => item.uId === field.uId
        );

  const deleteItem = () => {
    if (chartType === "richText") {
      deleteDropZoneItemsForDm(propKey, bIndex, itemIndex);
    } else {
      if (
        chartProp.properties[propKey].chartAxes[bIndex].fields[itemIndex]
          ?.override
      ) {
        enableOverrideForUIDAction(propKey, "");
      }

      deleteDropZoneItems(propKey, bIndex, itemIndex, currentChartAxesName);
    }
    // chartPropUpdated(true);
  };

  let currentChartAxesName = uID ? "chartAxes_" + uID : "chartAxes";

  //let currentChartAxes = chartProp.properties[propKey][currentChartAxesName];

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<any | null>(null);
  const [anchorElment, setAnchorElement] = useState<any | null>(null);

  //Window function open/close and enable/disable
  const [windowFunction, setWindowFunction] = useState<boolean>(false);
  const [overrideFn, setOverrideFn] = useState<boolean>(false);
  const [windowFunctionDisable, setWindowFunctionDisable] =
    useState<boolean>(false);
  const [renameFunction, setRenameFunction] = useState<boolean>(false);
  // const [renameText, setRenameText] = useState<string>("");

  const [showTooltip, setShowTooltip] = useState(false);
  // const [anchorElTooltip, setAnchorElTooltip] = useState<any| null>(null); // State for Tooltip Popover

  // Handlers for Tooltip
  // const handleTooltipOpen = (event:any) => {
  // setAnchorElTooltip(event.currentTarget);
  // setShowTooltip(true);
  // };

  // const handleTooltipClose = () => {
  // setAnchorElTooltip(null);
  // 	setShowTooltip(false);
  // };

  const open: boolean = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);

    setShowTooltip(false);
  };

  const handleClose = (closeFrom: any, queryParam?: any) => {
    setAnchorEl(null);
    setShowOptions(false);

    if (closeFrom === "agg" || closeFrom === "timeGrain") {
      var field2 = JSON.parse(JSON.stringify(field));

      if (closeFrom === "agg") {
        Logger("info", "Aggregate Choice selected", queryParam);
        field2.agg = queryParam;
      } else if (closeFrom === "timeGrain") {
        field2.timeGrain = queryParam;
      }
      if (chartType === "richText") {
        Logger("info", "queryparam");
        updateAxesQueryParamForDm(propKey, bIndex, itemIndex, field2);
      } else {
        field2 = setDisplayName(
          field2,
          chartProp.properties[propKey].chartAxes[bIndex].name,
          chartProp.properties[propKey].chartType
        );
        field2.isTextRenamed = false;
        updateQueryParam(
          propKey,
          bIndex,
          itemIndex,
          field2,
          currentChartAxesName
        );
      }
    }
  };

  const handleOverrideOnClick = (event: any, optionName: any) => {
    if (optionName.id == "override") {
      setAnchorEl(null);
      setOverrideFn(true);

      let oldChartAxes = JSON.parse(
        JSON.stringify(chartProp.properties[propKey].chartAxes || [])
      );
      let overRideAxes = JSON.parse(
        JSON.stringify(
          chartProp.properties[propKey].chartAxes[bIndex].fields[itemIndex]
            .override || []
        )
      );

      createChartAxesForUID(
        propKey,
        chartProp.properties[propKey].chartAxes[bIndex].fields[itemIndex].uId,
        chartProp.properties[propKey].chartAxes[bIndex].fields[itemIndex]
          .override
          ? overRideAxes
          : oldChartAxes
      );

      enableOverrideForUIDAction(
        propKey,
        chartProp.properties[propKey].chartAxes[bIndex].fields[itemIndex].uId
      );
      //handleClose("clickOutside");
    } else {
      let field2 = JSON.parse(JSON.stringify(field));
      setAnchorEl(null);
      field2.disableReportFilterForOverride =
        !field2.disableReportFilterForOverride;
      updateQueryParam(
        propKey,
        bIndex,
        itemIndex,
        field2,
        currentChartAxesName
      );
    }
  };

  const handleWindowFunctionOnClick = () => {
    //setTimeout(() => {
    setWindowFunction(true);
    //}, 300);

    handleClose("clickOutside");
  };

  const handleRollup = () => {
    let field2 = JSON.parse(JSON.stringify(field));
    setAnchorEl(null);
    field2.rollupDepth = !field2.rollupDepth;
    field2.isManual = field2.rollupDepth;
    updateQueryParam(propKey, bIndex, itemIndex, field2, currentChartAxesName);

    let _charAxesFields =
      chartProp.properties[propKey][currentChartAxesName][bIndex].fields;

    if (field2.rollupDepth) {
      if (
        ["crossTab", "heatmap", "boxPlot", "bubbleMap"].includes(
          chartProp.properties[propKey].chartType
        )
      ) {
        let chartAxesOneFields =
          chartProp.properties[propKey][currentChartAxesName][1].fields;
        let chartAxesTwoFields =
          chartProp.properties[propKey][currentChartAxesName][2].fields;

        if (bIndex == 1) {
          if (chartAxesOneFields?.length > 0) {
            for (let i = 0; i < chartAxesOneFields?.length; i++) {
              if (itemIndex !== i) {
                updateFieldRollupProperty(1, i, false);
              }
            }
          }

          if (chartAxesTwoFields?.length > 0) {
            for (let i = 0; i < chartAxesTwoFields?.length; i++) {
              //if(itemIndex !== i){
              updateFieldRollupProperty(2, i, false);
              //}
            }
          }
        } else {
          if (chartAxesOneFields?.length > 0) {
            for (let i = 0; i < chartAxesOneFields?.length; i++) {
              //if( itemIndex !== i){
              updateFieldRollupProperty(1, i, false);
              //}
            }
          }

          if (chartAxesTwoFields?.length > 0) {
            for (let i = 0; i < chartAxesTwoFields?.length; i++) {
              if (itemIndex !== i) {
                updateFieldRollupProperty(2, i, false);
              }
            }
          }
        }
      } else {
        for (let i = 0; i < _charAxesFields?.length; i++) {
          if (itemIndex !== i) {
            let _field = _charAxesFields[i];

            if (_field) {
              let _tempField = JSON.parse(JSON.stringify(_field));

              if (_tempField) {
                _tempField.rollupDepth = false;
                updateQueryParam(
                  propKey,
                  bIndex,
                  i,
                  _tempField,
                  currentChartAxesName
                );
              }
            }
          }
        }
      }
    } else {
      if (
        ["crossTab", "heatmap", "boxPlot", "bubbleMap"].includes(
          chartProp.properties[propKey].chartType
        )
      ) {
        if (
          chartProp.properties[propKey][currentChartAxesName][2].fields
            ?.length > 0
        ) {
          updateFieldRollupProperty(
            2,
            chartProp.properties[propKey][currentChartAxesName][2].fields
              ?.length - 1,
            true
          );
        } else {
          updateFieldRollupProperty(
            1,
            chartProp.properties[propKey][currentChartAxesName][1].fields
              ?.length - 1,
            true
          );
        }
      } else {
        let _field = _charAxesFields[_charAxesFields?.length - 1];

        if (_field) {
          let _tempField = JSON.parse(JSON.stringify(_field));

          if (_tempField) {
            _tempField.rollupDepth = true;
            updateQueryParam(
              propKey,
              bIndex,
              _charAxesFields?.length - 1,
              _tempField,
              currentChartAxesName
            );
          }
        }
      }
    }

    function updateFieldRollupProperty(
      binIndex: number,
      index: number,
      enable: boolean
    ) {
      let _field =
        chartProp.properties[propKey][currentChartAxesName][binIndex].fields[
          index
        ];

      if (_field) {
        let _tempField = JSON.parse(JSON.stringify(_field));

        if (_tempField) {
          _tempField.rollupDepth = enable;
          updateQueryParam(
            propKey,
            binIndex,
            index,
            _tempField,
            currentChartAxesName
          );
        }
      }
    }
  };

  var menuStyle = { fontSize: "12px", padding: "2px 1.5rem" };
  var menuSelectedStyle = {
    fontSize: "12px",
    padding: "2px 1.5rem",
    backgroundColor: "rgba(25, 118, 210, 0.08)",
  };

  // Properties and behaviour when a card is dragged
  const [, drag] = useDrag({
    item: {
      uId: field.uId,
      fieldname: field.fieldname,
      displayname: field.fieldname,
      dataType: field.dataType,
      prefix: field.prefix,
      tableId: field.tableId,
      // type: "card",
      bIndex,
      originalIndex,
    },
    type: "card",

    end: (dropResult, monitor) => {
      const { uId, bIndex, originalIndex } = monitor.getItem();
      const didDrop = monitor.didDrop();
      if (!didDrop) {
        if (chartType === "richText") {
          revertAxesForDm(propKey, bIndex, uId, originalIndex);
        } else {
          revertAxes(propKey, bIndex, uId, originalIndex, currentChartAxesName);
        }
      }
    },
  });

  // Properties and behaviours when another card is dropped over this card
  const [, drop] = useDrop({
    accept: "card",
    canDrop: () => false,
    collect: (monitor) => ({
      backgroundColor1: monitor.isOver({ shallow: true }) ? 1 : 0,
    }),
    hover: ({
      uId: dragUId,
      bIndex: fromBIndex,
    }: {
      uId: string;
      bIndex: number;
    }) => {
      if (fromBIndex === bIndex && dragUId !== field.uId) {
        if (chartType === "richText") {
          sortAxesForDm(propKey, bIndex, dragUId, field.uId);
        } else {
          sortAxes(propKey, bIndex, dragUId, field.uId, currentChartAxesName);
        }
        Logger("info", "============HOVER BLOCK END ==============");
      }
    },
  });

  useEffect(() => {
    if (chartProp.properties[propKey].enableOverrideForUID === "") {
      setOverrideFn(false);
    }
  }, [chartProp.properties[propKey].enableOverrideForUID]);

  useEffect(() => {
    //If two dimensional charts dimension, row, column, distribution without any fields, then window function will get disable
    if (["heatmap", "crossTab", "boxPlot", "bubbleMap"].includes(chartType)) {
      if (
        chartProp.properties[propKey].chartAxes[1].fields.length === 0 &&
        chartProp.properties[propKey].chartAxes[2].fields.length === 0
      ) {
        setWindowFunctionDisable(true);

        //while window function get disabled, it check window function having any values in redux state. If yes, then window function value will be null
        if (
          chartProp.properties[propKey].chartAxes[bIndex].fields &&
          chartProp.properties[propKey].chartAxes[bIndex].fields[itemIndex]
            ?.windowfn
        ) {
          chartProp.properties[propKey].chartAxes[bIndex].fields[
            itemIndex
          ].windowfn = null;
        }
      } else {
        //If two dimensional charts dimension, row, column, distribution with fields, then window function will get enable
        if (
          chartProp.properties[propKey].chartAxes[1].fields.length > 0 ||
          chartProp.properties[propKey].chartAxes[2].fields.length > 0
        ) {
          setWindowFunctionDisable(false);
        }
      }
    } else {
      //If one dimensional charts dimension or row without any fields, then window function will get disable
      if (
        !["heatmap", "crossTab", "boxPlot", "richText", "bubbleMap"].includes(
          chartType
        )
      ) {
        if (chartProp.properties[propKey].chartAxes[1].fields.length === 0) {
          setWindowFunctionDisable(true);

          //while window function get disabled, it check window function having any values in redux state. If yes, then window function value will be null
          if (
            chartProp.properties[propKey].chartAxes[bIndex].fields &&
            chartProp.properties[propKey].chartAxes[bIndex].fields[itemIndex]
              ?.windowfn
          ) {
            chartProp.properties[propKey].chartAxes[bIndex].fields[
              itemIndex
            ].windowfn = null;
          }
        } else {
          //If one dimensional charts dimension or row with fields, then window function will get enable
          if (chartProp.properties[propKey].chartAxes[1].fields.length > 0) {
            setWindowFunctionDisable(false);
          }
        }
      }
    }
  }, [chartProp.properties[propKey].chartAxes]);

  // Getting values from CardOption.tsx
  // List of options to show at the end of each card
  // (like, year, month, day, or Count, sum, avg, windowFunction etc)
  const RenderMenu = () => {
    var aggr = [];
    var timegrain = [];
    var windowfn = [];
    //var renamefn=[];
    let overRideMenuList = [];
    var options = CardOption(axisTitle, field);
    if (options) {
      aggr = options[0];
      timegrain = options[1];
      windowfn = options[2];
      //renamefn=options[3]
      overRideMenuList = options[3];
    }

    return (
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose("clickOutside")}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {aggr?.length > 0
          ? aggr?.map((opt: any, idx: number) => {
              return (
                <div style={{ display: "flex" }} key={idx}>
                  <span
                    style={{
                      color: "rgb(211, 211, 211)",
                      paddingLeft: "5px",
                      position: "absolute",
                    }}
                  >
                    {chartProp.properties[propKey].chartAxes[bIndex].fields[
                      itemIndex
                    ]?.agg?.toUpperCase() === opt?.name?.toUpperCase() ? (
                      <IoMdCheckmark />
                    ) : null}
                  </span>
                  <MenuItem
                    onClick={() => handleClose("agg", opt.id)}
                    sx={opt?.id === field?.agg ? menuSelectedStyle : menuStyle}
                    key={opt?.id}
                  >
                    {opt?.name}
                  </MenuItem>
                </div>
              );
            })
          : null}

        {axisTitle === "Dimension" ||
        axisTitle === "Row" ||
        axisTitle === "Column" ||
        axisTitle === "Distribution" ||
        chartType === "gauge" ||
        chartType === "funnel" ||
        chartType === "simplecard" ? null : (
          <Divider />
        )}

        {(chartType === "gauge" && timegrain?.length > 0) ||
        (chartType === "funnel" && timegrain?.length > 0) ||
        (chartType === "simplecard" && timegrain?.length > 0) ? (
          <Divider />
        ) : null}

        {timegrain?.length > 0
          ? timegrain?.map((opt2: any, idx: number) => {
              return (
                <div style={{ display: "flex" }} key={idx}>
                  <span
                    style={{
                      color: "rgb(211, 211, 211)",
                      paddingLeft: "5px",
                      position: "absolute",
                    }}
                  >
                    {chartProp.properties[propKey].chartAxes[bIndex].fields[
                      itemIndex
                    ]?.agg?.toUpperCase() === opt2.name?.toUpperCase() ? (
                      <IoMdCheckmark />
                    ) : null}
                  </span>
                  <MenuItem
                    onClick={() => handleClose("timeGrain", opt2.id)}
                    sx={
                      opt2.id === field.timeGrain
                        ? menuSelectedStyle
                        : menuStyle
                    }
                    key={opt2.id}
                  >
                    {opt2.name}
                  </MenuItem>
                </div>
              );
            })
          : null}

        {axisTitle === "Dimension" ||
        axisTitle === "Row" ||
        axisTitle === "Column" ||
        axisTitle === "Distribution" ||
        chartType === "gauge" ||
        chartType === "funnel" ||
        chartType === "simplecard" ? null : timegrain?.length > 0 ? (
          <Divider />
        ) : null}

        {chartType === "gauge" ||
        chartType === "funnel" ||
        chartType === "simplecard"
          ? null
          : windowfn?.length > 0
          ? [...windowfn.filter((item: any) => item.id === "windowfn")]?.map(
              (opt: any, idx: number) => {
                return (
                  <div style={{ display: "flex" }} key={idx}>
                    <span
                      style={{
                        color: "rgb(211, 211, 211)",
                        paddingLeft: "5px",
                        position: "absolute",
                      }}
                    >
                      {chartProp.properties[propKey].chartAxes[bIndex].fields[
                        itemIndex
                      ]?.windowfn ? (
                        <IoMdCheckmark />
                      ) : null}
                    </span>
                    <MenuItem
                      disabled={windowFunctionDisable}
                      onClick={handleWindowFunctionOnClick}
                      sx={{ fontSize: "12px", padding: "2px 1.5rem" }}
                      key={opt.id}
                    >
                      {opt.name}
                    </MenuItem>
                  </div>
                );
              }
            )
          : null}

        {chartType === "simplecard"
          ? null
          : overRideMenuList?.length > 0
          ? [...overRideMenuList].map((opt: any, idx: number) => {
              return (
                <div style={{ display: "flex" }} key={idx}>
                  <span
                    style={{
                      color: "rgb(211, 211, 211)",
                      paddingLeft: "5px",
                      position: "absolute",
                    }}
                  >
                    {(opt.id == "override" && field.override) ||
                    (opt.id == "disableFilter" &&
                      field.disableReportFilterForOverride) ? (
                      <IoMdCheckmark />
                    ) : null}
                  </span>
                  <MenuItem
                    disabled={opt.id == "disableFilter" && !field.override}
                    onClick={(e: any) => handleOverrideOnClick(e, opt)}
                    sx={{ fontSize: "12px", padding: "2px 1.5rem" }}
                    key={opt.id}
                  >
                    {opt.name}
                  </MenuItem>
                </div>
              );
            })
          : null}

        {windowfn?.length !== 0 ? (
          <MenuItem
            onClick={() => {
              handleClose("rename");
              setRenameFunction(true);
              setShowTooltip(false);
            }}
            sx={menuStyle}
          >
            Rename for Visual
          </MenuItem>
        ) : null}

        {uID ? (
          <div style={{ display: "flex" }}>
            <span
              style={{
                color: "rgb(211, 211, 211)",
                paddingLeft: "5px",
                position: "absolute",
              }}
            >
              {field.rollupDepth ? <IoMdCheckmark /> : null}
            </span>
            <MenuItem onClick={handleRollup} sx={menuStyle}>
              Roll-Up
            </MenuItem>
          </div>
        ) : null}
      </Menu>
    );
  };

  return field ? (
    <div
      className="axisField"
      ref={(node: any) => drag(drop(node))}
      style={windowFunction || overrideFn ? { border: "1.5px solid blue" } : {}}
      onMouseOver={(event: any) => {
        setShowOptions(true);
        if (event.target.classList.contains("columnName"))
          // setTimeout(() => {
          // handleTooltipOpen(event); // Open the tooltip when mouseover
          setShowTooltip(true);
        //  }, 500);
      }}
      onMouseLeave={() => {
        if (!open) {
          setShowOptions(false);
        }
        // handleTooltipClose(); // Close the tooltip when mouse leaves
        setShowTooltip(false);
      }}
    >
      <button
        type="button"
        className="buttonCommon columnClose"
        onClick={deleteItem}
        title="Remove field"
        style={
          showOptions ? { visibility: "visible" } : { visibility: "hidden" }
        }
      >
        <CloseRoundedIcon style={{ fontSize: "13px", margin: "auto" }} />
      </button>

      <span className="columnName">{field.fieldname}</span>

      {/* window function have any values in state, then window icon will get enable */}
      {chartType === "gauge" ||
      chartType === "funnel" ||
      chartType === "simplecard" ? null : chartProp.properties[propKey]
          .chartAxes[bIndex].fields[itemIndex]?.windowfn ? (
        <button
          type="button"
          className="buttonCommon columnDown"
          title="Window Function"
          onClick={handleWindowFunctionOnClick}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "5px",
              color: "rgb(211, 211, 211)",
            }}
          >
            <SiWindows11 />
          </span>{" "}
        </button>
      ) : null}
      {chartType === "simplecard" ? null : chartProp.properties[propKey]
          .chartAxes[bIndex].fields[itemIndex]?.override ? (
        <button
          type="button"
          className="buttonCommon columnDown"
          title="Override Function"
          onClick={(e: any) => handleOverrideOnClick(e, { id: "override" })}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "5px",
              color: "rgb(211, 211, 211)",
            }}
          >
            <FaRocket />
          </span>{" "}
        </button>
      ) : null}
      {chartType === "simplecard" ? null : chartProp.properties[propKey][
          currentChartAxesName
        ][bIndex].fields[itemIndex]?.rollupDepth ? (
        <button
          type="button"
          className="buttonCommon columnDown"
          title="Roll-Up"
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              paddingRight: "5px",
              color: "rgb(211, 211, 211)",
            }}
          >
            <MdOutlineSwipeUpAlt style={{ height: "1rem", width: "1rem" }} />
          </span>{" "}
        </button>
      ) : null}

      <span className="columnPrefix">
        {field.agg ? AggregatorKeys[field.agg] : null}

        {field.timeGrain && field.agg ? (
          <React.Fragment>, </React.Fragment>
        ) : null}
        {field.timeGrain ? AggregatorKeys[field.timeGrain] : null}
      </span>
      <span className="columnPrefix">
        {" "}
        {field.prefix ? `${field.prefix}` : null}
      </span>
      <button
        type="button"
        className="buttonCommon columnDown"
        onClick={(e: any) => {
          handleClick(e);
        }}
        title="Click for Menu Options"
        style={
          showOptions ? { visibility: "visible" } : { visibility: "hidden" }
        }
      >
        <KeyboardArrowDownRoundedIcon
          style={{ fontSize: "14px", margin: "auto" }}
        />
      </button>
      <RenderMenu />
      {windowFunction ? (
        <WindowFunction
          anchorElm={anchorElment}
          haswindowfn={windowFunction}
          setWindowfn={setWindowFunction}
          propKey={propKey}
          bIndex={bIndex}
          itemIndex={itemIndex}
        />
      ) : null}

      <RenameFunction
        renamefn={renameFunction}
        setRenamefn={setRenameFunction}
        propKey={propKey}
        bIndex={bIndex}
        itemIndex={itemIndex}
      />

      {/* <Tooltip 
			 title={field.displayname} 
			 arrow
			 style={{ display: 'flex', alignItems: 'center', marginLeft: '8px', fontSize: '14px',color:'whitesmoke' }}
			 componentsProps={{
				tooltip: {
				  sx: {
					bgcolor: 'common.red',
					'& .MuiTooltip-arrow': {
					  color: 'common.red',
					  width: 16, // Adjust arrow width
                      height: 16,

					},
				  },
				},
			  }}
			 open={showTooltip}
			 placement="right-end"
			 >
				{/* Content to which the tooltip should apply */}
      <span></span>
      {/* </Tooltip>   */}

      <CustomTooltip
        title={field.displayname}
        arrow
        open={showTooltip}
        placement="right-end"
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "8px",
          fontSize: "14px",
        }}
      >
        <span></span>
      </CustomTooltip>

      {/* {showTooltip && (
			<div style={{ position: "relative" }}>
			<PriceTagTooltip
			text={field.displayname} 
			fillColor="white" 
			textColor="black" 
			fontSize={10} 
			open={showTooltip}  
			display="flex"
			alignItems="center"
			marginLeft="8px"

        />
		</div>
      )} */}
    </div>
  ) : null;
};

const mapStateToProps = (
  state: TabTileStateProps2 & ChartPropertiesStateProps & any
) => {
  return {
    tabTileProps: state.tabTileProps,
    chartProp: state.chartProperties,
    dynamicMeasureState: state.dynamicMeasuresState,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    deleteDropZoneItems: (
      propKey: string,
      binIndex: number,
      itemIndex: number,
      currentChartAxesName: string
    ) =>
      dispatch(
        editChartPropItem("delete", {
          propKey,
          binIndex,
          itemIndex,
          currentChartAxesName,
        })
      ),
    updateQueryParam: (
      propKey: string,
      binIndex: number,
      itemIndex: number,
      item: any,
      currentChartAxesName: string
    ) =>
      dispatch(
        editChartPropItem("updateQuery", {
          propKey,
          binIndex,
          itemIndex,
          item,
          currentChartAxesName,
        })
      ),
    sortAxes: (
      propKey: string,
      bIndex: number,
      dragUId: string,
      uId: string,
      currentChartAxesName: string
    ) =>
      dispatch(sortAxes(propKey, bIndex, dragUId, uId, currentChartAxesName)),
    revertAxes: (
      propKey: string,
      bIndex: number,
      uId: string,
      originalIndex: number,
      currentChartAxesName: string
    ) =>
      dispatch(
        revertAxes(propKey, bIndex, uId, originalIndex, currentChartAxesName)
      ),

    //dynamic measure actions
    deleteDropZoneItemsForDm: (
      propKey: string,
      binIndex: number,
      itemIndex: any
    ) =>
      dispatch(
        editChartPropItemForDm("delete", { propKey, binIndex, itemIndex })
      ),
    sortAxesForDm: (
      propKey: string,
      bIndex: number,
      dragUId: string,
      uId: string
    ) => dispatch(sortAxesForDm(propKey, bIndex, dragUId, uId)),
    updateAxesQueryParamForDm: (
      propKey: string,
      binIndex: number,
      itemIndex: number,
      item: any
    ) =>
      dispatch(
        editChartPropItemForDm("updateQuery", {
          propKey,
          binIndex,
          itemIndex,
          item,
        })
      ),
    revertAxesForDm: (
      propKey: string,
      bIndex: number,
      uId: string,
      originalIndex: number
    ) => dispatch(revertAxesForDm(propKey, bIndex, uId, originalIndex)),
    enableOverrideForUIDAction: (propKey: string, uId: string) =>
      dispatch(enableOverrideForUIDAction(propKey, uId)),
    createChartAxesForUID: (propKey: string, uId: string, chartAxes: any) =>
      dispatch(createChartAxesForUID(propKey, uId, chartAxes)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
