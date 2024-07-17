import { useState, useEffect } from "react";
import "../ChartAxes/Card.css";
import "../ChartFieldFilter/UserFilterCard.css";
import { useDrag, useDrop } from "react-dnd";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { connect } from "react-redux";
import {
  Checkbox,
  Divider,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
  FormControl,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import {
  updateChartFilterRightGroupsFilters,
  sortRightFilterGroupItems,
  revertRightFilterGroupItems,
  deleteRightFilterGroupItems,
} from "../../redux/ChartFilterGroup/ChartFilterGroupStateActions";

import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import FetchData from "../ServerCall/FetchData";
import moment from "moment";

import DoneIcon from "@mui/icons-material/Done";

import { PatternCollectionType } from "../ChartFieldFilter/UserFilterCardInterface";
import { Dispatch } from "redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ChartFilterGroupCardProps } from "../../redux/ChartFilterGroup/ChartFilterGroupInterface";
import { ChartPropertiesStateProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { ChartFilterGroupStateProps } from "../../redux/ChartFilterGroup/ChartFilterGroupInterface";

const ChartFilterGroupCard = ({
  propKey,
  name,
  itemIndex,
  field,

  // state
  token,
  chartProp,
  chartGroup,
  tabTileProps,

  // dispatch
  updateChartFilterRightGroupsFilters,
  deleteRightFilterGroupItems,
  sortRightFilterGroupItems,
  revertRightFilterGroupItems,
}: ChartFilterGroupCardProps) => {
  field.dataType = field.dataType.toLowerCase();

  //let selectedDatasetID = chartProp.properties[propKey].selectedDs.id;
  //let datasetObject = chartGroup.tabTile[propKey] || {};
  let groupList = chartGroup.groups[name].filters || [];
  let bIndex = 0;
  const { uId, fieldname, displayname, dataType, tableId } = field;
  const originalIndex = groupList.findIndex((item: any) => item.uId === uId);

  //const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  let sliderRange = [0, 0];

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const withPatternCollections: PatternCollectionType[] = [
    { key: "beginsWith", value: "Start With" },
    { key: "endsWith", value: "Ends With" },
    { key: "contains", value: "Contains" },
    { key: "exactMatch", value: "Exact Match" },
  ];

  const datePatternCollections: PatternCollectionType[] = [
    { key: "year", value: "Year" },
    { key: "quarter", value: "Quarter" },
    { key: "month", value: "Month" },
    { key: "yearquarter", value: "Year Quater" },
    { key: "yearmonth", value: "Year Month" },
    { key: "date", value: "Date" },
    { key: "dayofmonth", value: "Day Of Month" },
    { key: "dayofweek", value: "Day Of Week" },
  ];

  const datePatternRelativeFilterCollections: PatternCollectionType[] = [
    { key: "day", value: "Days" },
    { key: "weekSunSat", value: "Weeks (Sun-Sat)" },
    { key: "weekMonSun", value: "Weeks (Mon-Sun)" },
    { key: "month", value: "Months" },
    { key: "year", value: "Years" },
    { key: "rollingWeek", value: "Rolling Weeks" },
    { key: "rollingMonth", value: "Rolling Months" },
    { key: "rollingYear", value: "Rolling Years" },
  ];

  const AnchorDatePatternRelativeFilterCollections: PatternCollectionType[] = [
    { key: "today", value: "Today" },
    { key: "yesterday", value: "Yesterday" },
    { key: "tomorrow", value: "Tommorow" },
    { key: "columnMaxDate", value: "Column Max Date" },
    { key: "specificDate", value: "Specific Date" },
  ];

  const datePatternSearchConditionCollections: PatternCollectionType[] = [
    { key: "year", value: "Year" },
    { key: "quarter", value: "Quarter" },
    { key: "month", value: "Month" },
    { key: "date", value: "Date" },
    { key: "dayofmonth", value: "Day Of Month" },
    { key: "dayofweek", value: "Day Of Week" },
  ];
  const equalPatternCollections: PatternCollectionType[] = [
    { key: "greaterThan", value: ">  Greater than" },
    { key: "lessThan", value: "<  Less than" },
    { key: "greaterThanOrEqualTo", value: ">= Greater than or Equal to" },
    { key: "lessThanOrEqualTo", value: "<= Less than or Equal to" },
    { key: "equalTo", value: "=  Equal to" },
    { key: "notEqualTo", value: "<> Not Equal to" },
    { key: "between", value: ">= Between <=" },
  ];

  const RelativeFilterPatternCollections: PatternCollectionType[] = [
    { key: "last", value: "Last" },
    { key: "current", value: "Current" },
    { key: "next", value: "Next" },
  ];

  let filterFieldData = JSON.parse(JSON.stringify(field));

  /* Initialize vaiarble to default values */

  useEffect(() => {
    if (!filterFieldData.includeexclude)
      filterFieldData["includeexclude"] = "Include";

    if (filterFieldData && filterFieldData.dataType) {
      switch (filterFieldData.dataType) {
        case "decimal":
        case "integer":
          if (!filterFieldData.fieldtypeoption) {
            filterFieldData["fieldtypeoption"] = "Search Condition";
          }
          break;

        case "text":
          if (!filterFieldData.fieldtypeoption) {
            filterFieldData["fieldtypeoption"] = "Pick List";
          }
          break;

        case "date":
        case "timestamp":
          if (!filterFieldData.fieldtypeoption) {
            filterFieldData["prefix"] = "year";
            filterFieldData["fieldtypeoption"] = "Pick List";
          }
          break;

        default:
          if (!filterFieldData.fieldtypeoption) {
            filterFieldData["fieldtypeoption"] = "Pick List";
          }
          break;
      }
    }

    if (filterFieldData.fieldtypeoption === "Search Condition") {
      if (dataType) {
        switch (filterFieldData.dataType) {
          case "decimal":
          case "integer":
            if (!filterFieldData.exprType) {
              filterFieldData["exprType"] = "greaterThan";
            }
            break;
          case "text":
            if (!filterFieldData.exprType) {
              filterFieldData["exprType"] = "beginsWith";
            }
            break;
          case "timestamp":
          case "date":
            if (!filterFieldData.exprType) {
              filterFieldData["prefix"] = "year";
              filterFieldData["exprType"] = "greaterThan";
            }
            break;
          default:
            if (!filterFieldData.exprType) {
              filterFieldData["exprType"] = "greaterThan";
            }
            break;
        }
      }
    } else if (filterFieldData.fieldtypeoption === "Pick List") {
      if (
        filterFieldData &&
        filterFieldData.dataType &&
        filterFieldData.dataType === "timestamp" &&
        !filterFieldData.prefix
      ) {
        filterFieldData["prefix"] = "year";
      }

      async function _preFetchData() {
        if (!filterFieldData.rawselectmembers) {
          setLoading(true);
          await GetPickListItems();
          setLoading(false);
        }
      }

      _preFetchData();
    } else {
      initialRelativeFilterData();
    }

    //updateChartFilterRightGroupsFilters(name, constructChartAxesFieldObject());
    // eslint-disable-next-line
  }, []);

  ///Fech Field data for Pick List
  const fetchFieldData = (type: string) => {
    let bodyData: any = {
      tableId: tableId,
      fieldName: displayname,
      dataType: dataType,
      filterOption: "allValues",
    };

    if (dataType === "timestamp" || dataType === "date") {
      bodyData["timeGrain"] = filterFieldData.prefix || "year";
    }

    return FetchData({
      requestType: "withData",
      method: "POST",
      url: `filter-options?dbconnectionid=${chartProp.properties[propKey].selectedDs.connectionId}&datasetid=${chartProp.properties[propKey].selectedDs.id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
  };

  ///Fetch Field data for Relative Filter
  const fetchRelativeFilterFieldData = (type: string) => {
    let bodyData: any = {
      filterTable: {
        tableId: tableId,
        displayName: displayname,
        fieldName: displayname,
        dataType: dataType,
        timeGrain: "date",
      },
      // from: ["next", "1", "day"],
      // to: ["next", "1", "day"],
      // anchorDate: "today",
      from: [
        filterFieldData.expTypeFromRelativeDate,
        filterFieldData.exprInputFromValueType,
        filterFieldData.expTypeFromdate,
      ],
      to: [
        filterFieldData.expTypeToRelativeDate,
        filterFieldData.exprInputToValueType,
        filterFieldData.expTypeTodate,
      ],
      anchorDate:
        filterFieldData.expTypeAnchorDate !== "specificDate"
          ? filterFieldData.expTypeAnchorDate
          : filterFieldData.exprInputSpecificDate,
    };

    return FetchData({
      requestType: "withData",
      method: "POST",
      url: `relative-filter?dbconnectionid=${chartProp.properties[propKey].selectedDs.connectionId}&datasetid=${chartProp.properties[propKey].selectedDs.id}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
  };

  ///To get filter type for service call
  const _getFilterType = () => {
    switch (dataType) {
      case "text":
        return "text_user_selection";
      case "decimal":
      case "integer":
        return filterFieldData.fieldtypeoption === "Search Condition"
          ? "number_search"
          : "number_user_selection";
      case "timestamp":
      case "date":
        return filterFieldData.fieldtypeoption === "Search Condition"
          ? "date_search"
          : filterFieldData.fieldtypeoption === "Relative Filter"
          ? "relativeFilter"
          : "date_user_selection";

      default:
        return "text_user_selection";
    }
  };

  ///To fetch Pick list items
  const GetPickListItems = async () => {
    let result: any = await fetchFieldData(_getFilterType());

    if (result && result.status && result.data && result.data.length > 0) {
      if (result.data && result.data.length > 0) {
        result = result.data.map(
          (item: any) => item[Object.keys(result.data[0])[0]]
        );
      }

      let tempResult = ["(All)", ...result];

      filterFieldData["rawselectmembers"] = [...tempResult];
      filterFieldData["userSelection"] = tempResult;
      updateChartFilterRightGroupsFilters(
        name,
        constructChartAxesFieldObject()
      );
    }
  };

  ///To fetch Relative Filter items
  const GetRelativeFilterItems = async () => {
    let result: any = await fetchRelativeFilterFieldData(_getFilterType());

    // console.log(result);
    if (result) {
      if (result.data && result.data.length > 0) {
        filterFieldData["fromDate"] =
          result.data[0][Object.keys(result.data[0])[1]];
        filterFieldData["toDate"] =
          result.data[0][Object.keys(result.data[0])[0]];
      }
      // let tempResult = [...result];
      // console.log(tempResult);

      // filterFieldData["rawselectmembers"] = [...tempResult];
      // filterFieldData["userSelection"] = tempResult;
      updateChartFilterRightGroupsFilters(
        name,
        constructChartAxesFieldObject()
      );
    }
  };

  /// Properties and behaviour when a filter card is dragged
  const [, drag] = useDrag({
    item: {
      uId: uId,
      fieldname: fieldname,
      displayname: fieldname,
      dataType: dataType,
      tableId: tableId,
      // type: "card",
      bIndex,
      originalIndex,
    },
    type: "card",

    end: (dropResult, monitor) => {
      const { uId, originalIndex } = monitor.getItem();

      const didDrop = monitor.didDrop();

      if (!didDrop) {
        revertRightFilterGroupItems(name, uId, originalIndex);
      }
    },
  });

  // Properties and behaviours when another filter card is dropped over this card
  const [, drop] = useDrop({
    accept: "card",
    canDrop: () => false,
    collect: (monitor) => ({
      backgroundColor1: monitor.isOver({ shallow: true }) ? 1 : 0,
    }),
    hover({ uId: dragUId, bIndex: fromBIndex }: any) {
      if (fromBIndex === bIndex && dragUId !== uId) {
        sortRightFilterGroupItems(name, dragUId, uId);
      }
    },
  });

  ///Pick list CB change

  const handleCBChange = (event: any) => {
    if (event.target.name.toString() === "(All)") {
      if (event.target.checked) {
        filterFieldData["userSelection"] = [
          ...filterFieldData.rawselectmembers,
        ];
      } else {
        filterFieldData["userSelection"] = [];
      }
    } else {
      if (event.target.checked) {
        if (!isNaN(event.target.name) && isFinite(event.target.name)) {
          let _name = event.target.name;

          if (_name.includes(".")) {
            _name = parseFloat(event.target.name);
          } else {
            _name = parseInt(event.target.name);
          }

          if (_name) {
            filterFieldData.userSelection.push(_name);
          }
        } else {
          filterFieldData.userSelection.push(event.target.name);
        }
      } else {
        let idx = filterFieldData.userSelection.findIndex(
          (item: any) => item.toString() === event.target.name.toString()
        );
        filterFieldData.userSelection.splice(idx, 1);
      }

      let AllIdx = filterFieldData.userSelection.findIndex(
        (item: any) => item.toString() === "(All)"
      );

      if (AllIdx >= 0) {
        filterFieldData.userSelection.splice(AllIdx, 1);
      }
    }
    updateChartFilterRightGroupsFilters(name, constructChartAxesFieldObject());
  };

  ///Render Pick list card from raw select members
  const SelecPickListCard = () => {
    let _selectionMembers = null;

    if (filterFieldData && filterFieldData.rawselectmembers) {
      _selectionMembers = filterFieldData.rawselectmembers.map(
        (item: any, index: number) => {
          return (
            <label className="UserFilterCheckboxes" key={index}>
              {filterFieldData.includeexclude === "Include" ? (
                <Checkbox
                  checked={
                    filterFieldData.userSelection
                      ? filterFieldData.includeexclude === "Include"
                        ? filterFieldData.userSelection.includes(item)
                          ? true
                          : false
                        : false
                      : false
                  }
                  // indeterminate={
                  // 	filterFieldData.userSelection
                  // 		? filterFieldData.includeexclude === "Exclude"
                  // 			? filterFieldData.userSelection.includes(item)
                  // 				? true
                  // 				: false
                  // 			: false
                  // 		: false
                  // }
                  name={item}
                  style={{
                    transform: "scale(0.6)",
                    // marginLeft: "10px",
                    paddingRight: "0px",
                  }}
                  sx={{
                    color: "red",
                    "&.Mui-checked": {
                      color: "#a6a6a6",
                    },
                  }}
                  onChange={(e) => handleCBChange(e)}
                />
              ) : (
                <Checkbox
                  checked={
                    filterFieldData.userSelection
                      ? filterFieldData.includeexclude === "Exclude"
                        ? filterFieldData.userSelection.includes(item)
                          ? true
                          : false
                        : false
                      : false
                  }
                  // indeterminate={
                  // 	// filterFieldData.userSelection
                  // 	// 	? filterFieldData.includeexclude === "Exclude"
                  // 	// 		?
                  // 	filterFieldData.userSelection.includes(item) ? true : false
                  // 	// 	: false
                  // 	// : false
                  // }
                  name={item}
                  style={{
                    transform: "scale(0.6)",
                    paddingRight: "0px",
                  }}
                  sx={{
                    // color: "red",
                    "&.Mui-checked": {
                      color: "orange",
                    },
                    // "&.MuiCheckbox-indeterminate": {
                    // 	color: "orange",
                    // },
                  }}
                  onChange={(e) => handleCBChange(e)}
                />
              )}

              <span
                title={item}
                style={{
                  marginLeft: 0,
                  marginTop: "3.5px",
                  justifySelf: "center",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {item}
              </span>
            </label>
          );
        }
      );
    } else {
      _selectionMembers = null;
    }

    return (
      <div className="SelectionMembersCheckBoxArea">{_selectionMembers}</div>
    );
  };

  ///Render Relative Filter Card
  const SelecRelativeFilterCard = () => {
    var membersFrom = null;
    membersFrom = (
      <DropDownForPattern
        items={datePatternRelativeFilterCollections}
        exprType="expTypeFromdate"
      ></DropDownForPattern>
    );
    var membersTo = null;
    membersTo = (
      <DropDownForPattern
        items={datePatternRelativeFilterCollections}
        exprType="expTypeTodate"
      ></DropDownForPattern>
    );
    var membersAnchordate = null;
    membersAnchordate = (
      <DropDownForPattern
        items={AnchorDatePatternRelativeFilterCollections}
        exprType="expTypeAnchorDate"
      ></DropDownForPattern>
    );
    var datemember = null;
    datemember = (
      <div className="customDatePickerWidth">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={filterFieldData.exprInputSpecificDate}
            onChange={(e) =>
              handleCustomRequiredValueOnBlur(
                e,
                "exprInputSpecificDate",
                "date"
              )
            }
            renderInput={(params) => (
              <TextField {...params} className="customDatePickerHeight" />
            )}
          />
        </LocalizationProvider>
        {filterFieldData.isInValidData ? (
          <span className="ErrorText">Please enter valid data.</span>
        ) : null}
      </div>
    );
    return (
      <div
        // className="CustomRequiredField"
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          rowGap: "8px",
          marginTop: "-10px",
          marginLeft: "6px",
          marginBottom: "6px",
          width: "94%",
          fontSize: "13px",
          // fontWeight: "bold",
          color: "black",
          textAlign: "left",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        From ({filterFieldData.fromDate}){" "}
        {/*To dispaly from-date after fetching*/}
        <div style={{ display: "flex" }}>
          <RequiredFieldForRelativeFilter exprType="expTypeFromRelativeDate"></RequiredFieldForRelativeFilter>
          {filterFieldData.expTypeFromRelativeDate !== "current" ? (
            <ValueFieldForRelativeFilter exprType="exprInputFromValueType"></ValueFieldForRelativeFilter>
          ) : null}
        </div>
        {membersFrom}
        To ({filterFieldData.toDate}) {/*To dispaly to-date after fetching*/}
        <div style={{ display: "flex" }}>
          <RequiredFieldForRelativeFilter exprType="expTypeToRelativeDate"></RequiredFieldForRelativeFilter>
          {filterFieldData.expTypeToRelativeDate !== "current" ? (
            <ValueFieldForRelativeFilter exprType="exprInputToValueType"></ValueFieldForRelativeFilter>
          ) : null}
        </div>
        {membersTo}
        Based on Date
        {membersAnchordate}
        {filterFieldData.expTypeAnchorDate === "specificDate"
          ? datemember
          : null}
      </div>
    );
    return null;
  };

  ///Initialize Relative Filter items
  const initialRelativeFilterData = () => {
    if (!filterFieldData.exprType) {
      filterFieldData["expTypeFromdate"] = "year";
    }
    if (!filterFieldData.expTypeTodate) {
      filterFieldData["expTypeTodate"] = "day";
    }
    if (!filterFieldData.expTypeFromRelativeDate) {
      filterFieldData["expTypeFromRelativeDate"] = "last";
    }
    if (!filterFieldData.expTypeToRelativeDate) {
      filterFieldData["expTypeToRelativeDate"] = "last";
    }
    if (!filterFieldData.expTypeAnchorDate) {
      filterFieldData["expTypeAnchorDate"] = "today";
    }
    if (!filterFieldData.exprInputFromValueType) {
      filterFieldData["exprInputFromValueType"] = 2;
    }
    if (!filterFieldData.exprInputToValueType) {
      filterFieldData["exprInputToValueType"] = 2;
    }
    if (!filterFieldData.exprInputSpecificDate) {
      filterFieldData["exprInputSpecificDate"] = moment(new Date()).format(
        "YYYY-MM-DD"
      );
    }
  };

  ///Menu close event handler
  const handleClose = async (closeFrom: any, queryParam?: any) => {
    setAnchorEl(null);
    //setShowOptions(false);

    if (closeFrom === "opt2") {
      initialRelativeFilterData();
      if (
        !filterFieldData.rawselectmembers ||
        filterFieldData.fieldtypeoption !== queryParam
      ) {
        filterFieldData["fieldtypeoption"] = queryParam;

        if (queryParam === "Pick List") {
          setLoading(true);
          await GetPickListItems();
          setLoading(false);
        }
        if (queryParam === "Relative Filter") {
          setLoading(true);
          await GetRelativeFilterItems();
          setLoading(false);
        }
      }

      filterFieldData["fieldtypeoption"] = queryParam;

      if (filterFieldData.fieldtypeoption === "Pick List") {
        filterFieldData["userSelection"] = [
          ...filterFieldData.rawselectmembers,
        ];
        filterFieldData.isInValidData = false;
      } else if (filterFieldData.fieldtypeoption === "Search Condition") {
        checkForValidData();
      }
    } else if (closeFrom === "opt1") {
      if (filterFieldData.userSelection.includes("(All)")) {
        filterFieldData["userSelection"] = [];
      }
      filterFieldData.includeexclude = queryParam;
    } else {
      if (filterFieldData.fieldtypeoption === "Relative Filter") {
        setLoading(true);
        await GetRelativeFilterItems();
        setLoading(false);
      }
    }

    updateChartFilterRightGroupsFilters(name, constructChartAxesFieldObject());
  };

  /// List of options to show at the end of each filter card
  const RenderMenu = () => {
    var options = ["Include", "Exclude"];
    var options2 = ["Pick List", "Search Condition"];
    ///Relative Filter option ony for "date" and "timestamp"
    if (
      filterFieldData.dataType === "timestamp" ||
      filterFieldData.dataType === "date"
    )
      options2 = ["Pick List", "Search Condition", "Relative Filter"];

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
        {options.length > 0
          ? options.map((opt, index) => {
              return (
                <div
                  style={{ display: "flex" }}
                  onClick={() => handleClose("opt1", opt)}
                >
                  <MenuItem
                    sx={{
                      fontSize: "12px",
                      alignSelf: "center",
                      padding: "2px 1rem",
                      flex: 1,
                    }}
                    key={index}
                  >
                    {opt}
                  </MenuItem>
                  {opt === filterFieldData.includeexclude ? (
                    <Tooltip title="Selected">
                      <DoneIcon
                        style={{
                          // flex: 1,
                          fontSize: "14px",
                          alignSelf: "center",
                          // float: "right",
                          marginRight: "5px",
                        }}
                      />
                    </Tooltip>
                  ) : null}
                </div>
              );
            })
          : null}
        <Divider />

        {options2.length > 0
          ? options2.map((opt2, index) => {
              return (
                <div
                  style={{ display: "flex" }}
                  onClick={() => handleClose("opt2", opt2)}
                >
                  <MenuItem
                    key={index}
                    sx={{
                      flex: 1,
                      fontSize: "12px",
                      alignSelf: "center",
                      padding: "2px 1rem",
                    }}
                  >
                    {opt2}
                  </MenuItem>
                  {opt2 === filterFieldData.fieldtypeoption ? (
                    <Tooltip title="Selected">
                      <DoneIcon
                        style={{
                          fontSize: "14px",
                          alignSelf: "center",
                          marginRight: "5px",
                        }}
                      />
                    </Tooltip>
                  ) : null}
                </div>
              );
            })
          : null}
      </Menu>
    );
  };

  ///set Search condition condition initiallize slider control
  const setSliderRange = () => {
    if (
      ["float", "decimal", "double", "integer"].includes(dataType) &&
      filterFieldData.exprType === "between"
    ) {
      if (
        filterFieldData.rawselectmembers &&
        !filterFieldData.greaterThanOrEqualTo &&
        !filterFieldData.lessThanOrEqualTo
      ) {
        filterFieldData.greaterThanOrEqualTo =
          filterFieldData.rawselectmembers[1];
        filterFieldData.lessThanOrEqualTo =
          filterFieldData.rawselectmembers[
            filterFieldData.rawselectmembers.length - 1
          ];
      }

      sliderRange = [
        filterFieldData.greaterThanOrEqualTo,
        filterFieldData.lessThanOrEqualTo,
      ];
    } else if (
      ["date", "timestamp"].includes(dataType) &&
      filterFieldData.prefix !== "date"
    ) {
      filterFieldData.greaterThanOrEqualTo =
        filterFieldData.rawselectmembers[1];
      filterFieldData.lessThanOrEqualTo =
        filterFieldData.rawselectmembers[
          filterFieldData.rawselectmembers.length - 1
        ];
    }
  };

  ///Search condition Silder on change handler
  // const handleSliderRangeOnChange = (event: any, newValue: any) => {
  // 	filterFieldData["greaterThanOrEqualTo"] = newValue[0];
  // 	filterFieldData["lessThanOrEqualTo"] = newValue[1];
  // 	sliderRange = newValue;
  // 	updateChartFilterRightGroupsFilters(name, constructChartAxesFieldObject());
  // };

  const checkValidDate = (val: any) => {
    if (
      ["date", "timestamp"].includes(dataType) &&
      filterFieldData.prefix === "date" &&
      val.includes("-")
    ) {
      return true;
    }
    if (
      ["date", "timestamp"].includes(dataType) &&
      filterFieldData.fieldtypeoption === "Relative Filter" &&
      val.includes("-")
    ) {
      return true;
    }

    return false;
  };

  const setDefaultDate = (key: string, value: any) => {
    if (filterFieldData[key]) {
      filterFieldData[key] = value ? value : new Date();
    }
  };

  const setSearchConditionDate = () => {
    if (
      ["date", "timestamp"].includes(dataType) &&
      filterFieldData.prefix === "date"
    ) {
      if (filterFieldData.exprType === "between") {
        if (checkValidDate(filterFieldData.exprInput)) {
          setDefaultDate("greaterThanOrEqualTo", filterFieldData.exprInput);
          setDefaultDate("lessThanOrEqualTo", filterFieldData.exprInput);
        }
      } else {
        if (checkValidDate(filterFieldData.lessThanOrEqualTo)) {
          setDefaultDate("exprInput", filterFieldData.lessThanOrEqualTo);
        }
      }
    }
  };

  ///Search Condition and Relative Filter Dropdown list on change handler
  const handleDropDownForPatternOnChange = async (
    event: any,
    key = "exprType"
  ) => {
    // let filterObj = userFilterGroup[propName].chartUserFilters.find((usrfilter) => usrfilter.uId === data.uid);

    // key = key || "exprType";
    filterFieldData[key] = event.target.value;
    // filterFieldData = _modifiedResultForServerRequest(filterFieldData);

    if (filterFieldData.fieldtypeoption === "Relative Filter") {
      setLoading(true);
      await GetRelativeFilterItems();
      setLoading(false);
    } else {
      if (filterFieldData.exprType === "between") {
        //setLoading(true);
        await GetPickListItems();
        setSliderRange();
        // setLoading(false);
      }

      setSearchConditionDate();
    }

    updateChartFilterRightGroupsFilters(name, constructChartAxesFieldObject());
  };

  ///Handle Menu button on click
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  ///Remove filter card from dropzone
  const deleteItem = () => {
    //to restric deletecard action when in dashboard present mode
    if (tabTileProps.dashMode === "Edit") {
      deleteRightFilterGroupItems(name, itemIndex);
    }
  };

  ///Handle Date time grain dropdown list change
  const handleDropDownForDatePatternOnChange = async (event: any) => {
    filterFieldData["prefix"] = event.target.value;
    filterFieldData["greaterThanOrEqualTo"] = "";
    filterFieldData["lessThanOrEqualTo"] = "";

    if (
      filterFieldData.fieldtypeoption === "Search Condition" &&
      event.target.value === "Date"
    ) {
      filterFieldData["exprInput"] = "";
    }

    // if (filterFieldData.fieldtypeoption === "Pick List") {
    setLoading(true);
    await GetPickListItems();
    setLoading(false);
    setSliderRange();
    // }
    setSearchConditionDate();

    updateChartFilterRightGroupsFilters(name, constructChartAxesFieldObject());
  };

  const checkForValidData = () => {
    if (
      filterFieldData.prefix === "date" &&
      new Date(filterFieldData.greaterThanOrEqualTo) >
        new Date(filterFieldData.lessThanOrEqualTo)
    ) {
      filterFieldData["isInValidData"] = true;
    } else {
      if (
        parseInt(filterFieldData.greaterThanOrEqualTo) >
        parseInt(filterFieldData.lessThanOrEqualTo)
      ) {
        filterFieldData["isInValidData"] = true;
      }
    }
  };

  ///Search Condition and Relative Filter user input change handler

  const handleCustomRequiredValueOnBlur = async (
    val: number | string,
    key = "exprInput",
    type?: string
  ) => {
    // key = key || "exprInput";

    if (type && type === "date") {
      val = moment(val).format("yyyy-MM-DD");
    }

    if (!filterFieldData[key] || filterFieldData[key] !== val) {
      filterFieldData[key] = val;
      filterFieldData["isInValidData"] = false;

      if (
        key !== "exprInput" &&
        filterFieldData.fieldtypeoption === "Search Condition"
      ) {
        checkForValidData();
      }

      if (filterFieldData.exprType === "between") {
        sliderRange = [
          filterFieldData.greaterThanOrEqualTo,
          filterFieldData.lessThanOrEqualTo,
        ];
      }

      if (filterFieldData.fieldtypeoption === "Relative Filter") {
        setLoading(true);
        await GetRelativeFilterItems();
        setLoading(false);
      }

      updateChartFilterRightGroupsFilters(
        name,
        constructChartAxesFieldObject()
      );
    }
  };

  ///Render Relative Filter Value Input Control
  const RelativeFilterCustomInputControl = ({ type, exprType }: any) => {
    return (
      <>
        <TextField
          InputProps={{
            style: {
              height: "25px",
              width: "100%",
              fontSize: "13px",
              marginRight: "30px",
            },
          }}
          placeholder="Value"
          defaultValue={filterFieldData[exprType]}
          type={type}
          onBlur={(e) =>
            handleCustomRequiredValueOnBlur(e.target.value, exprType)
          }
        />

        {filterFieldData.isInValidData ? (
          <span className="ErrorText">Please enter valid data.</span>
        ) : null}
      </>
    );
  };

  ///Render Relative Filter Fields
  const RequiredFieldForRelativeFilter = ({ exprType }: any) => {
    var members = null;
    members = (
      <DropDownForPattern
        items={RelativeFilterPatternCollections}
        exprType={exprType}
      ></DropDownForPattern>
    );
    return <div style={{ marginRight: "33px", width: "90px" }}>{members}</div>;
  };

  const ValueFieldForRelativeFilter = ({ exprType }: any) => {
    var members = null;
    members = (
      <RelativeFilterCustomInputControl
        type="number"
        exprType={exprType}
      ></RelativeFilterCustomInputControl>
    );
    return <div style={{ width: "60px" }}>{members}</div>;
  };

  ///Render Search Condition Custom Input Control
  const SearchConditionCustomInputControl = ({ type }: any) => {
    return (
      <>
        <TextField
          InputProps={{
            style: {
              height: "25px",
              width: "100%",
              fontSize: "13px",
              marginRight: "30px",
            },
          }}
          placeholder="Value"
          defaultValue={filterFieldData.exprInput}
          type={type}
          onBlur={(e) => handleCustomRequiredValueOnBlur(e.target.value)}
        />
        {/* <input
					placeholder="Value"
					defaultValue={filterFieldData.exprInput}
					type={type}
					onBlur={e => handleCustomRequiredValueOnBlur(e.target.value)}
				/> */}

        {filterFieldData.isInValidData ? (
          <span className="ErrorText">Please enter valid data.</span>
        ) : null}
      </>
    );
  };

  ///Render Search Condition Between Control
  const SearchConditionBetweenControl = () => {
    return (
      <>
        {/*<StyledSlider
          value={sliderRange}
          onChange={handleSliderRangeOnChange}
          min={filterFieldData.greaterThanOrEqualTo}
          max={filterFieldData.lessThanOrEqualTo}
          marks={_marks}
           />*/}
        <TextField
          type="number"
          className="CustomInputValue"
          sx={{
            width: "100%",
          }}
          defaultValue={filterFieldData.greaterThanOrEqualTo}
          onBlur={(e) => {
            handleCustomRequiredValueOnBlur(
              e.target.value,
              "greaterThanOrEqualTo"
            );
          }}
        />
        <TextField
          type="number"
          className="CustomInputValue"
          defaultValue={filterFieldData.lessThanOrEqualTo}
          onBlur={(e) => {
            handleCustomRequiredValueOnBlur(
              e.target.value,
              "lessThanOrEqualTo"
            );
          }}
        />
        {/* <input
					placeholder="Greater than or Equal to"
					type="number"
					className="CustomInputValue"
					defaultValue={filterFieldData.greaterThanOrEqualTo}
					onBlur={e => {
						handleCustomRequiredValueOnBlur(e.target.value, "greaterThanOrEqualTo");
					}}
				/>
				<input
					placeholder="Less than or Equal to"
					type="number"
					className="CustomInputValue"
					defaultValue={filterFieldData.lessThanOrEqualTo}
					onBlur={e => {
						handleCustomRequiredValueOnBlur(e.target.value, "lessThanOrEqualTo");
					}}
				/> */}
        {filterFieldData.isInValidData ? (
          <span className="ErrorText">Please enter valid data.</span>
        ) : null}
      </>
    );
  };

  ///Render Search Condition Date Between Control
  const SearchConditionDateBetween = () => {
    return (
      <div className="customDatePickerWidth">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={filterFieldData.greaterThanOrEqualTo}
            onChange={(e) =>
              handleCustomRequiredValueOnBlur(e, "greaterThanOrEqualTo", "date")
            }
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={filterFieldData.lessThanOrEqualTo}
            onChange={(e) =>
              handleCustomRequiredValueOnBlur(e, "lessThanOrEqualTo", "date")
            }
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        {filterFieldData.isInValidData ? (
          <span className="ErrorText">Please enter valid data.</span>
        ) : null}
      </div>
    );
  };

  ///Render Search condition user input control
  const CustomRequiredField = () => {
    var members = null;

    if (dataType) {
      switch (dataType) {
        case "decimal":
        case "float":
        case "double":
        case "integer":
          if (filterFieldData.exprType === "between") {
            members = (
              <SearchConditionBetweenControl></SearchConditionBetweenControl>
            );
          } else {
            members = (
              <SearchConditionCustomInputControl type="number"></SearchConditionCustomInputControl>
            );
          }
          break;
        case "text":
          members = (
            <SearchConditionCustomInputControl type="text"></SearchConditionCustomInputControl>
          );
          break;
        case "date":
        case "timestamp":
          if (filterFieldData.prefix === "date") {
            if (filterFieldData.exprType === "between") {
              members = (
                <SearchConditionDateBetween></SearchConditionDateBetween>
              );
            } else {
              members = (
                <div className="customDatePickerWidth">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={filterFieldData.exprInput}
                      onChange={(e) =>
                        handleCustomRequiredValueOnBlur(e, "exprInput", "date")
                      }
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  {filterFieldData.isInValidData ? (
                    <span className="ErrorText">Please enter valid data.</span>
                  ) : null}
                </div>
              );
            }
          } else {
            if (filterFieldData.exprType === "between") {
              members = (
                <SearchConditionBetweenControl></SearchConditionBetweenControl>
              );
            } else {
              members = (
                <SearchConditionCustomInputControl type="number"></SearchConditionCustomInputControl>
              );
            }
          }
          break;
        default:
          members = null;
          break;
      }
    }

    return <div>{members}</div>;
  };

  ///Dropdown list to select Time grain
  const DropDownForDatePattern = ({ items }: any) => {
    return (
      <FormControl fullWidth size="small">
        <Select
          // sx={{ height: "1.5rem", fontSize: "14px", textAlign: "left", width: "100%" }}
          sx={{
            height: "1.5rem",
            fontSize: "14px",
            textAlign: "left",
          }}
          onChange={(e) => {
            handleDropDownForDatePatternOnChange(e);
          }}
          value={filterFieldData["prefix"]}
          variant="outlined"
        >
          {items.map((item: any) => {
            return (
              <MenuItem
                key={item.key}
                value={item.key}
                selected={item.key === filterFieldData.exprType}
              >
                <Typography
                  sx={{
                    width: "auto",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "12px",
                    lineHeight: "20px",
                  }}
                >
                  {item.value}
                </Typography>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  ///Search Condition and Relative Filter Dropdown list to select condition
  const DropDownForPattern = ({ items, exprType = "exprType" }: any) => {
    // exprType = exprType || "exprType";
    return (
      <FormControl fullWidth size="small">
        <Select
          sx={{
            height: "1.5rem",
            fontSize: "14px",
            textAlign: "left",
          }}
          onChange={(e) => {
            handleDropDownForPatternOnChange(e, exprType);
          }}
          value={filterFieldData[exprType]}
          variant="outlined"
        >
          {items.map((item: any) => {
            return (
              <MenuItem
                key={item.key}
                value={item.key}
                // selected={item.key === filterFieldData.exprType}
              >
                <Typography
                  sx={{
                    width: "auto",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: "12px",
                  }}
                >
                  {item.value}
                </Typography>
                {/* CustomCard */}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  ///Reder Search condition card controls
  const CustomCard = () => {
    var members = null;
    if (field.dataType) {
      switch (field.dataType) {
        case "decimal":
        case "integer":
          members = (
            <DropDownForPattern
              items={equalPatternCollections}
            ></DropDownForPattern>
          );
          break;
        case "text":
          members = (
            <DropDownForPattern
              items={withPatternCollections}
            ></DropDownForPattern>
          );
          break;
        case "timestamp":
        case "date":
          members = (
            <DropDownForPattern
              items={equalPatternCollections}
            ></DropDownForPattern>
          );
          break;
        default:
          members = null;
          break;
      }
    }

    return (
      <div className="chart-fil-grp-CustomRequiredField">
        {members}
        <CustomRequiredField></CustomRequiredField>
      </div>
    );
  };

  ///Expand Collapse Icon switch
  const ExpandCollaseIconSwitch = () => {
    return filterFieldData.isCollapsed ? (
      <ChevronRightIcon
        style={{ height: "18px", width: "18px", color: "#999999" }}
        onClick={(e) => {
          filterFieldData.isCollapsed = false;
          updateChartFilterRightGroupsFilters(
            name,
            constructChartAxesFieldObject()
          );
        }}
      />
    ) : (
      <KeyboardArrowDownIcon
        style={{ height: "18px", width: "18px", color: "#999999" }}
        onClick={(e) => {
          filterFieldData.isCollapsed = true;
          updateChartFilterRightGroupsFilters(
            name,
            constructChartAxesFieldObject()
          );
        }}
      />
    );
  };

  ///Construct Chart property object
  const constructChartAxesFieldObject = () => {
    return filterFieldData;
  };

  return (
    <div
      ref={(node: any) => drag(drop(node))}
      className="UserFilterCard"
      style={
        filterFieldData.isInValidData
          ? { border: "2px red solid", backgroundColor: "lightpink" }
          : {}
      }
    >
      {loading ? <LoadingPopover /> : null}

      <div className="axisFilterField">
        {/* remove column  */}
        <button
          type="button"
          className="buttonCommon columnClose"
          onClick={deleteItem}
          title="Remove field"
        >
          <CloseRoundedIcon
            style={{
              fontSize: "13px",
            }}
          />
        </button>

        {/* filter column name */}

        <span
          className="columnName"
          style={
            filterFieldData.includeexclude === "Exclude"
              ? { border: "#ffb74d 1px solid", lineHeight: "15px" }
              : { lineHeight: "15px" }
          }
        >
          {field.fieldname}
        </span>
        {/* down arrow icon */}
        <button
          type="button"
          className="buttonCommon"
          style={{ backgroundColor: "transparent" }}
          title="More Options"
          onClick={handleClick}
        >
          <MoreVertIcon style={{ fontSize: "16px", color: "#999999" }} />
        </button>

        {/* expand colapse icon */}
        <button
          type="button"
          className="buttonCommon columnDown"
          title={filterFieldData.isCollapsed ? "Expand" : "Collapse"}
        >
          <ExpandCollaseIconSwitch />
        </button>

        <RenderMenu />
      </div>

      {!filterFieldData.isCollapsed ? (
        <>
          <div
            className="UserSelectionDiv"
            style={
              filterFieldData.isInValidData
                ? { border: "2px red solid", backgroundColor: "lightpink" }
                : {}
            }
          >
            {filterFieldData.dataType === "timestamp" ||
            filterFieldData.dataType === "date" ? (
              <div className="CustomRequiredField">
                {filterFieldData.fieldtypeoption === "Pick List" ? (
                  <DropDownForDatePattern
                    items={datePatternCollections}
                  ></DropDownForDatePattern>
                ) : filterFieldData.fieldtypeoption === "Search Condition" ? (
                  <DropDownForDatePattern
                    items={datePatternSearchConditionCollections}
                  ></DropDownForDatePattern>
                ) : null}
              </div>
            ) : null}
            {filterFieldData.fieldtypeoption === "Pick List" ? (
              <SelecPickListCard></SelecPickListCard>
            ) : filterFieldData.fieldtypeoption === "Relative Filter" ? (
              <SelecRelativeFilterCard></SelecRelativeFilterCard>
            ) : (
              <CustomCard></CustomCard>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

const mapStateToProps = (
  state: ChartPropertiesStateProps &
    isLoggedProps &
    ChartFilterGroupStateProps &
    any
) => {
  return {
    token: state.isLogged.accessToken,
    chartProp: state.chartProperties,
    chartGroup: state.chartFilterGroup,
    tabTileProps: state.tabTileProps,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    updateChartFilterRightGroupsFilters: (groupName: string, filter: any) =>
      dispatch(updateChartFilterRightGroupsFilters(groupName, filter)),
    deleteRightFilterGroupItems: (groupName: string, itemIndex: number) =>
      dispatch(deleteRightFilterGroupItems(groupName, itemIndex)),
    sortRightFilterGroupItems: (name: string, dragUId: any, uId: any) =>
      dispatch(sortRightFilterGroupItems(name, dragUId, uId)),
    revertRightFilterGroupItems: (name: string, uId: any, originalIndex: any) =>
      dispatch(revertRightFilterGroupItems(name, uId, originalIndex)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChartFilterGroupCard);
