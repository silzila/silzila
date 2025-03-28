import { useState, useEffect } from "react";
import "../ChartAxes/Card.css";
import "./UserFilterCard.css";
import { useDrag, useDrop } from "react-dnd";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { connect } from "react-redux";
import {
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { alpha, styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import Radio from "@mui/material/Radio";
// import { green } from "@mui/material/colors";
import { fonts, fontSize, palette } from "../..";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { parseISO } from "date-fns";
import {
  updateLeftFilterItem,
  editChartPropItem,
  revertAxes,
  sortAxes,
  updtateFilterExpandeCollapse,
} from "../../redux/ChartPoperties/ChartPropertiesActions";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import FetchData from "../ServerCall/FetchData";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";

// import { UnCheckedIcon } from "material-ui/svg-icons/toggle/check-box-outline-blank";
// import { CheckedIcon } from "material-ui/svg-icons/toggle/check-box";

import { PatternCollectionType } from "./UserFilterCardInterface";
import { Dispatch } from "redux";
import { ChartPropertiesStateProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { TabTileStateProps2 } from "../../redux/TabTile/TabTilePropsInterfaces";
import { UserFilterCardProps } from "./UserFilterCardInterface";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DropDownForPatternCommon from "../Common/DropDownForPattern";
import { AxisType } from "../CommonFunctions/aliases";
import { handleKeyDown } from "../CommonFunctions/CommonFunctions";

const UserFilterCard = ({
  propKey,
  field,
  bIndex,
  itemIndex,
  token,
  uID,

  // state
  chartProp,

  // dispatch
  updateLeftFilterItem,
  deleteDropZoneItems,
  sortAxes,
  revertAxes,
  updtateFilterExpandeCollapse,
}: UserFilterCardProps & any) => {
    const calculations=useSelector((state:RootState)=>state.calculations.savedCalculations);

  field.dataType = field.dataType.toLowerCase();

  let currentChartAxesName = uID ? "chartAxes_" + uID : "chartAxes";
  let currentChartAxes = JSON.parse(
    JSON.stringify(chartProp.properties[propKey][currentChartAxesName])
  );

  const { uId, fieldname, displayname, dataType, tableId } = field;
  var isCollapsed: boolean = currentChartAxes[0].isCollapsed;

  useEffect(() => {
    var res = currentChartAxes[0].fields.map((el: any) => {
      el.isCollapsed = !currentChartAxes[0].isCollapsed;
      return el;
    });

    updtateFilterExpandeCollapse(propKey, bIndex, res, currentChartAxesName);
  }, [isCollapsed]);

  const originalIndex = currentChartAxes[bIndex].fields.findIndex(
    (item: any) => item.uId === uId
  );

  //const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cirloading, setCirLoading] = useState<boolean>(false);
  let sliderRange = [0, 0];

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isHovered, setIsHovered] = useState(false);

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
    { key: "yearquarter", value: "Year Quarter" },
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
  const equalPatternCollections = [
    { key: "greaterThan", value: ">  Greater than" },
    { key: "lessThan", value: "<  Less than" },
    { key: "greaterThanOrEqualTo", value: ">= Greater than or Equal to" },
    { key: "lessThanOrEqualTo", value: "<= Less than or Equal to" },
    { key: "equalTo", value: "=  Equal to" },
    { key: "notEqualTo", value: "<> Not Equal to" },
    { key: "between", value: ">= Between <=" },
    { key: "blank", value: "   (Blank)" },
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
      if (filterFieldData.dataType) {
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
        if (filterFieldData.rawselectmembers?.length === 0) {
          setLoading(true);
          await GetPickListItems([]);
          setLoading(false);
        }
      }
      filterFieldData["exprTypeTillDate"] = false;
      filterFieldData["filterTypeTillDate"] = "enabled";

      _preFetchData();
    } else if (filterFieldData.fieldtypeoption === "Relative Filter") {
      initialRelativeFilterData();
    }

    updateUserFilterItem(
      propKey,
      0,
      itemIndex,
      constructChartAxesFieldObject(),
      currentChartAxesName
    );
    // eslint-disable-next-line
  }, []);

  const updateUserFilterItem = (
    propKey: string,
    bIndex: number,
    itemIndex: number,
    field: any,
    axesName: string
  ) => {
    //if(chartProp.properties[propKey].droppedFieldChartAxesUID === uID){
    updateLeftFilterItem(propKey, bIndex, itemIndex, field, axesName);
    //}
  };

  // const updateUserFilterItemExpandCollapse = (propKey:string, bIndex:number, itemIndex:number, field:any, axesName:string) =>{
  // 	if(chartProp.properties[propKey].droppedFieldChartAxesUID === uID){
  // 		updateLeftFilterItem(propKey, bIndex, itemIndex, field, axesName);
  // 	}
  // }

  ///Fech Field data for Pick List
  const fetchFieldData = (type: string) => {
    let bodyData: any;
    if(field.SavedCalculationUUID){
    let toFilterCalculation = calculations.filter((calculation:any) => calculation.uuid === field.SavedCalculationUUID)[0].calculationInfo
      bodyData = {
      tableId: tableId,
      fieldName: fieldname,
      dataType: dataType,
      filterOption: "allValues",
      isCalculatedField: true,
      calculatedField: [
        {
        ...toFilterCalculation, 
        calculatedFieldId: field.SavedCalculationUUID
      }
    ]
    };
    }else{
       bodyData = {
      tableId: tableId,
      fieldName: fieldname,
      dataType: dataType,
      filterOption: "allValues",
     };
    }
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
        fieldName: fieldname,
        dataType: dataType,
        timeGrain: "date",
      },
      //Fetch Request type
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
  const GetPickListItems = async (sortOptions: string[]) => {
    // Avoid fetching data again if the sort options have not changed
    if (
      filterFieldData["previousSortOptions"] === JSON.stringify(sortOptions) &&
      dataType !== "date" &&
      dataType !== "timestamp"
    ) {
      return; // Return early if no changes in sort options
    }

    let result: any = await fetchFieldData(_getFilterType());

    if (result && result.status && result.data ) {
        const key=Object.keys(result.data)[0];
        const options=result.data[key];
        result = result = options.map((value: any) => {
          return value !== null
            ? typeof value === "boolean"
              ? value
                ? "True"
                : "False" // Convert boolean to string
              : value
            : "(Blank)";
        });
      

      // Maintain an original unfiltered copy
      filterFieldData.rawselectmembersOriginal = ["(All)", ...result];

      // Start with unfiltered data
      let tempResult = [...filterFieldData.rawselectmembersOriginal];

      // Apply multiple sort options
      if (sortOptions.includes("Sort Desc")) {
        tempResult = ["(All)", ...result.sort().reverse()];
      } else {
        tempResult = ["(All)", ...result.sort()]; // Default to ascending if no "Sort Desc"
      }

      if (sortOptions.includes("Remove Blank")) {
        tempResult = tempResult.filter((val: string) => val !== "(Blank)");
      }

      if (sortOptions.includes("Blank at Bottom")) {
        const blanks = tempResult.filter((val: string) => val === "(Blank)");
        tempResult = tempResult
          .filter((val: string) => val !== "(Blank)")
          .concat(blanks);
      }
      // Store sorted data in filterFieldData
      filterFieldData.rawselectmembers = [...tempResult];
      filterFieldData.userSelection = tempResult;

      // Save the sort options for comparison in future updates
      filterFieldData.previousSortOptions = JSON.stringify(sortOptions);
      updateUserFilterItem(
        propKey,
        0,
        itemIndex,
        constructChartAxesFieldObject(),
        currentChartAxesName
      );
    }
  };

  function convertKeysToLowercase<T extends Record<string, any>>(
    obj: T
  ): Record<string, any> {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key.toLowerCase()] = obj[key];
      return acc;
    }, {} as Record<string, any>);
  }

  ///To fetch Relative Filter items
  const GetRelativeFilterItems = async () => {
    // setLoading(true);
    let result: any = await fetchRelativeFilterFieldData(_getFilterType());

    if (result) {
      if (result.data && result.data.length > 0) {
        const modifiedRes = convertKeysToLowercase(result.data[0]);
        filterFieldData["fromDate"] = modifiedRes["fromdate"];
        filterFieldData["toDate"] = modifiedRes["todate"];
      }

      updateUserFilterItem(
        propKey,
        0,
        itemIndex,
        constructChartAxesFieldObject(),
        currentChartAxesName
      );
    }
    // setLoading(false);
  };

  /// Properties and behaviour when a filter card is dragged
  const [, drag] = useDrag({
    item: {
      uId: uId,
      fieldname: fieldname,
      displayname: displayname,
      dataType: dataType,
      tableId: tableId,
      // type: "card",
      bIndex,
      originalIndex,
      dragFrom:AxisType.ChartFilter,
      SavedCalculationUUID:field.SavedCalculationUUID,
    },
    type: "card",

    end: (dropResult, monitor) => {
      const { uId, bIndex, originalIndex } = monitor.getItem();

      const didDrop = monitor.didDrop();

      if (!didDrop) {
        revertAxes(propKey, bIndex, uId, originalIndex, currentChartAxesName);
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
        sortAxes(propKey, bIndex, dragUId, uId, currentChartAxesName);
      }
    },
  });

  ///Pick list CB change

  const handleCBChange = (event: any) => {
    if (event.target.name === "(All)") {
      if (event.target.checked) {
        filterFieldData["userSelection"] = filterFieldData.rawselectmembers.map(
          (item: any) => {
            if (item === "(Blank)") {
              return null;
            }
            return item;
          }
        );
        filterFieldData["filterTypeTillDate"] = "enabled";
      } else {
        filterFieldData["userSelection"] = [];
      }
    } else {
      filterFieldData["filterTypeTillDate"] = "disabled";

      if (event.target.checked) {
        if (!isNaN(event.target.name) && isFinite(event.target.name)) {
          let _name = event.target.name;
          if (_name.includes(".")) {
            _name = parseFloat(event.target.name);
          } else {
            _name = parseInt(event.target.name);
          }
          if (_name) {
            if (_name === "(Blank)") {
              _name = null;
            }
            filterFieldData.userSelection.push(_name);
          }
        } else {
          if (event.target.name === "(Blank)") {
            filterFieldData.userSelection.push(null);
          } else {
            filterFieldData.userSelection.push(event.target.name);
          }
        }
      } else {
        let idx = filterFieldData.userSelection.findIndex((item: any) => {
          if (item === null) {
            item = "(Blank)";
          }
          return item.toString() === event.target.name.toString();
        });

        if (idx >= 0) {
          filterFieldData.userSelection.splice(idx, 1);
        }
      }

      if (!filterFieldData.userSelection.length) {
        filterFieldData["filterTypeTillDate"] = "enabled";
      }
      let AllIdx = filterFieldData.userSelection.findIndex((item: any) => {
        if (item === null) {
          item = "(Blank)";
        }
        return item.toString() === "(All)";
      });

      if (AllIdx >= 0) {
        filterFieldData.userSelection.splice(AllIdx, 1);
      }
    }
    filterFieldData.userSelection = filterFieldData.userSelection.map(
      (item: any) => {
        if (item === "(Blank)") {
          return null;
        }
        return item;
      }
    );

    const nullIndex = filterFieldData.userSelection.indexOf(null);
    if (nullIndex >= 0) {
      filterFieldData.userSelection = [
        ...filterFieldData.userSelection.filter((item: any) => item !== null),
        null,
      ];
    }
    updateUserFilterItem(
      propKey,
      0,
      itemIndex,
      constructChartAxesFieldObject(),
      currentChartAxesName
    );
  };

  ///Render Pick list card from raw select members
  const SelecPickListCard = () => {
    let _selectionMembers = null;
    if (filterFieldData && filterFieldData.rawselectmembers) {
      const userSelection = filterFieldData.userSelection
        ? filterFieldData.userSelection.map((item: any) =>
            item === null ? "(Blank)" : item
          )
        : ["(Blank)"];
      _selectionMembers = filterFieldData.rawselectmembers.map(
        (item: any, index: number) => {
          return (
            <label className="UserFilterCheckboxes" key={index}>
              {filterFieldData.includeexclude === "Include" ? (
                <Checkbox
                  checked={
                    userSelection
                      ? filterFieldData.includeexclude === "Include"
                        ? userSelection.includes(item)
                        : false
                      : false
                  }
                  name={item}
                  style={{
                    transform: "scale(0.8)",
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
                    
                    userSelection

                      ? filterFieldData.includeexclude === "Exclude"
                        ? userSelection.includes(item)
                        : false
                      : false
                  }
                  name={item}
                  style={{
                    transform: "scale(0.8)",
                    paddingRight: "0px",
                  }}
                  sx={{
                    "&.Mui-checked": {
                      color: "orange",
                    },
                  }}
                  onChange={(e) => handleCBChange(e)}
                />
              )}

              <span
                title={item}
                style={
                  filterFieldData.includeexclude === "Exclude" &&
                  userSelection.includes(item)
                    ? {
                        marginLeft: 0,
                        // marginTop: "3.5px",
                        justifySelf: "center",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textDecoration: "line-through",
                        fontSize: "12px",
                      }
                    : {
                        marginLeft: 0,
                        // marginTop: "3.5px",
                        justifySelf: "center",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        fontSize: "0.688rem",
                      }
                }
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
            value={parseISO(filterFieldData.exprInputSpecificDate)}
            onChange={(e) =>
              e &&
              handleCustomRequiredValueOnBlur(
                e,
                "exprInputSpecificDate",
                "date"
              )
            }
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  className={`customDatePickerHeight ${
                    dropDownStyles().customSelect
                  }`}
                  sx={{
                    minWidth: "100%"
                  }}
                />
              ),
            }}
          />
        </LocalizationProvider>
        {filterFieldData.isInValidData ? (
          <span className="ErrorText">Please enter valid data.</span>
        ) : null}
      </div>
    );
    return (
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          rowGap: "8px",
          marginTop: "-10px",
          // marginLeft: "6px",
          marginBottom: "6px",
          // width: "94%",{}
          fontSize: "13px",
          textAlign: "left",
          // paddingLeft: "15px",
          // paddingRight: "15px",
          paddingBottom: "3px",
        }}
      >
        <span
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            fontSize: fontSize.medium,
            color: palette.primary.contrastText,
          }}
        >
          From{" "}
          {cirloading ? (
            <CircularProgress size={15} />
          ) : (
            `(${filterFieldData.fromDate})`
          )}{" "}
        </span>
        {/*To dispaly from-date after fetching*/}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <RequiredFieldForRelativeFilter exprType="expTypeFromRelativeDate"></RequiredFieldForRelativeFilter>
          {filterFieldData.expTypeFromRelativeDate !== "current" ? (
            <ValueFieldForRelativeFilter exprType="exprInputFromValueType"></ValueFieldForRelativeFilter>
          ) : null}
        </div>
        {membersFrom}
        <span
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            fontSize: fontSize.medium,
            color: palette.primary.contrastText,
          }}
        >
          To{" "}
          {cirloading ? (
            <CircularProgress size={15} />
          ) : (
            `(${filterFieldData.toDate})`
          )}
        </span>{" "}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            color: palette.primary.contrastText,
          }}
        >
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
    if (!filterFieldData.expTypeFromdate) {
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

  ///Till Date Switch On Click
  const handleChangeTillDate = () => {
    if (filterFieldData.exprTypeTillDate === false) {
      filterFieldData["exprTypeTillDate"] = true;
    } else {
      filterFieldData["exprTypeTillDate"] = false;
    }
    updateUserFilterItem(
      propKey,
      0,
      itemIndex,
      constructChartAxesFieldObject(),
      currentChartAxesName
    );
  };

  ///Render Upto Till Date Switch
  const SelecTillDate = () => {
    var labelTillDate = datePatternCollections.find(
      (item) => item.key === filterFieldData.prefix
    );
    var labelName = labelTillDate ? labelTillDate.value : null;
    if (labelName === "Year Quarter") {
      labelName = "Quarter";
    }
    if (labelName === "Year Month") {
      labelName = "Month";
    }
    return (
      <FormGroup
        sx={{
          // marginLeft: "6px",
          paddingLeft: "10px",
          paddingBottom: "8px",
        }}
      >
        {filterFieldData.prefix !== "date" &&
        ((filterFieldData.fieldtypeoption === "Search Condition" &&
          filterFieldData.switchEnableSearchCondition) ||
          filterFieldData.fieldtypeoption === "Pick List") ? (
          <FormControlLabel
            value="end"
            control={
              <GreenSwitch
                checked={filterFieldData.exprTypeTillDate}
                size="small"
                onChange={handleChangeTillDate}
              />
            }
            label={
              <Typography
                sx={
                  filterFieldData.exprTypeTillDate &&
                  filterFieldData.includeexclude === "Exclude"
                    ? {
                        fontSize: "13px",
                        paddingRight: "15px",
                        textDecoration: "line-through",
                      }
                    : {
                        fontSize: "13px",
                        paddingRight: "15px",
                      }
                }
              >
                {labelName} Till Date
              </Typography>
            }
            labelPlacement="end"
          />
        ) : (
          <FormControlLabel
            value="end"
            disabled
            control={
              <GreenSwitch
                checked={false}
                size="small"
                onChange={handleChangeTillDate}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: "13px",
                  paddingRight: "15px",
                }}
              >
                {labelName} Till Date
              </Typography>
            }
            labelPlacement="end"
          />
        )}
      </FormGroup>
    );
  };

  ///Custom Green/Orange Switch
  var switchColor = "#2bb9bb";
  if (filterFieldData.includeexclude === "Exclude") {
    switchColor = "#ffb74d";
  }
  const GreenSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: switchColor,
      "&:hover": {
        backgroundColor: alpha(switchColor, theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: switchColor,
    },
  }));

  ///Initial Search Condition Values
  const initialSearchConditionValues = () => {
    if (filterFieldData.fieldtypeoption === "Search Condition") {
      if (filterFieldData.dataType) {
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
          await GetPickListItems([]);
          setLoading(false);
        }
        if (queryParam === "Relative Filter") {
          setCirLoading(true);
          await GetRelativeFilterItems();
          setCirLoading(false);
        }
      }

      filterFieldData["fieldtypeoption"] = queryParam;

      if (filterFieldData.fieldtypeoption === "Pick List") {
        filterFieldData["userSelection"] = [
          ...filterFieldData.rawselectmembers,
        ];
        filterFieldData.isInValidData = false;
        filterFieldData.filterTypeTillDate = "enabled";
        filterFieldData.exprTypeTillDate = false;
      } else if (filterFieldData.fieldtypeoption === "Search Condition") {
        initialSearchConditionValues();
        filterFieldData.exprTypeTillDate = false;
        checkForValidData();
      } else {
        filterFieldData.includeexclude = "Include";
      }
    } else if (closeFrom === "opt1") {
      if (
        filterFieldData.fieldtypeoption === "Pick List" &&
        filterFieldData.userSelection.includes("(All)")
      ) {
        filterFieldData["userSelection"] = [];
      }
      filterFieldData.includeexclude = queryParam;
      if (filterFieldData.fieldtypeoption === "Relative Filter") {
        filterFieldData.includeexclude = "Include";
      }
    } else {
      if (filterFieldData.fieldtypeoption === "Relative Filter") {
        setCirLoading(true);
        await GetRelativeFilterItems();
        setCirLoading(false);
      }
    }

    updateUserFilterItem(
      propKey,
      0,
      itemIndex,
      constructChartAxesFieldObject(),
      currentChartAxesName
    );
  };

  /// List of options to show at the end of each filter card
  // const RenderMenu = () => {
  //     var options = ["Include", "Exclude"];
  //     var options2 = ["Pick List", "Search Condition"];

  //     if (filterFieldData.dataType === "timestamp" || filterFieldData.dataType === "date") {
  //         options2 = ["Pick List", "Search Condition", "Relative Filter"];
  //     }

  //     const [selectedSortOptions, setSelectedSortOptions] = useState<string[]>([]);

  //     // Function to handle sort options toggling
  //     const handleSortOptionToggle = (option: string) => {
  //       setSelectedSortOptions((prevOptions) => {
  //         const isSelected = prevOptions.includes(option);

  //         // Update the state based on whether the option is selected or not
  //         const updatedOptions = isSelected
  //             ? prevOptions.filter((opt) => opt !== option) // Remove if selected
  //             : [...prevOptions, option];

  //             // Trigger GetPickListItems with the updated options
  //             GetPickListItems({
  //                 sortDesc: updatedOptions.includes("Sort Desc"),
  //                 removeBlank: updatedOptions.includes("Remove Blank"),
  //                 blankAtBottom: updatedOptions.includes("Blank at Bottom"),
  //             });

  //             return updatedOptions;
  //         });
  //     };

  //     return (
  //         <Menu
  //             id="basic-menu"
  //             anchorEl={anchorEl}
  //             open={open}
  //             onClose={() => handleClose("clickOutside")}
  //             MenuListProps={{
  //                 "aria-labelledby": "basic-button",
  //             }}
  //         >
  //             {options2.length > 0
  //                 ? options2.map((opt2, index) => (
  //                     <div key={index}>
  //                         <div style={{ display: "flex" }} onClick={() => handleClose("opt2", opt2)}>
  //                             <Tooltip title={opt2 === filterFieldData.fieldtypeoption ? "Selected" : null}>
  //                                 <Radio
  //                                     checked={opt2 === filterFieldData.fieldtypeoption}
  //                                     sx={{
  //                                         "& .MuiSvgIcon-root": {
  //                                             fontSize: "12px",
  //                                             height: "12px",
  //                                             color: "#af99db",
  //                                         },
  //                                         alignSelf: "center",
  //                                         marginLeft: "5px",
  //                                     }}
  //                                 />
  //                             </Tooltip>
  //                             <MenuItem
  //                                 sx={{
  //                                     flex: 1,
  //                                     fontSize: "12px",
  //                                     alignSelf: "center",
  //                                     padding: "2px 0px",
  //                                     paddingRight: "1rem",
  //                                 }}
  //                             >
  //                                 {opt2}
  //                             </MenuItem>
  //                         </div>

  //                         {/* Only show nested options if "Pick List" is selected */}
  //                         {filterFieldData.fieldtypeoption === "Pick List" && opt2 === "Pick List" && (
  //                             <div style={{ marginLeft: "20px" }}>
  //                                 {/* Sort Desc */}
  //                                 <div style={{ display: "flex" }} onClick={() => handleSortOptionToggle("Sort Desc")}>
  //                                     <Tooltip title={selectedSortOptions.includes("Sort Desc") ? "Selected" : null}>
  //                                         <Checkbox
  //                                             checked={selectedSortOptions.includes("Sort Desc")}
  //                                             sx={{
  //                                                 "& .MuiSvgIcon-root": {
  //                                                     fontSize: "12px",
  //                                                     height: "12px",
  //                                                     color: "#af99db",
  //                                                 },
  //                                                 alignSelf: "center",
  //                                                 marginLeft: "5px",
  //                                             }}
  //                                         />
  //                                     </Tooltip>
  //                                     <MenuItem
  //                                         sx={{
  //                                             flex: 1,
  //                                             fontSize: "12px",
  //                                             alignSelf: "center",
  //                                             padding: "2px 0px",
  //                                             paddingRight: "1rem",
  //                                         }}
  //                                     >
  //                                         Sort Desc
  //                                     </MenuItem>
  //                                 </div>

  //                                 {/* Remove Blank */}
  //                                 <div style={{ display: "flex" }} onClick={() => handleSortOptionToggle("Remove Blank")}>
  //                                     <Tooltip title={selectedSortOptions.includes("Remove Blank") ? "Selected" : null}>
  //                                         <Checkbox
  //                                             checked={selectedSortOptions.includes("Remove Blank")}
  //                                             sx={{
  //                                                 "& .MuiSvgIcon-root": {
  //                                                     fontSize: "12px",
  //                                                     height: "12px",
  //                                                     color: "#af99db",
  //                                                 },
  //                                                 alignSelf: "center",
  //                                                 marginLeft: "5px",
  //                                             }}
  //                                         />
  //                                     </Tooltip>
  //                                     <MenuItem
  //                                         sx={{
  //                                             flex: 1,
  //                                             fontSize: "12px",
  //                                             alignSelf: "center",
  //                                             padding: "2px 0px",
  //                                             paddingRight: "1rem",
  //                                         }}
  //                                     >
  //                                         Remove (blank) values
  //                                     </MenuItem>
  //                                 </div>

  //                                 {/* Blank at Bottom */}
  //                                 <div style={{ display: "flex" }} onClick={() => handleSortOptionToggle("Blank at Bottom")}>
  //                                     <Tooltip title={selectedSortOptions.includes("Blank at Bottom") ? "Selected" : null}>
  //                                         <Checkbox
  //                                             checked={selectedSortOptions.includes("Blank at Bottom")}
  //                                             sx={{
  //                                                 "& .MuiSvgIcon-root": {
  //                                                     fontSize: "12px",
  //                                                     height: "12px",
  //                                                     color: "#af99db",
  //                                                 },
  //                                                 alignSelf: "center",
  //                                                 marginLeft: "5px",
  //                                             }}
  //                                         />
  //                                     </Tooltip>
  //                                     <MenuItem
  //                                         sx={{
  //                                             flex: 1,
  //                                             fontSize: "12px",
  //                                             alignSelf: "center",
  //                                             padding: "2px 0px",
  //                                             paddingRight: "1rem",
  //                                         }}
  //                                     >
  //                                         (blank) at bottom
  //                                     </MenuItem>
  //                                 </div>
  //                             </div>
  //                         )}
  //                     </div>
  //                 ))
  //                 : null}

  //             <Divider sx={{ margin: "5px 0px" }} />

  //             {options.length > 0
  //                 ? options.map((opt, index) => (
  //                     <div
  //                         key={index}
  //                         style={{ display: "flex" }}
  //                         onClick={() => handleClose("opt1", opt)}
  //                     >
  //                         <Tooltip
  //                             title={
  //                                 opt === filterFieldData.includeexclude ? "Selected" : null
  //                             }
  //                         >
  //                             <Radio
  //                                 checked={opt === filterFieldData.includeexclude}
  //                                 disabled={
  //                                     opt === "Exclude" &&
  //                                     filterFieldData.fieldtypeoption === "Relative Filter"
  //                                 }
  //                                 sx={{
  //                                     "& .MuiSvgIcon-root": {
  //                                         fontSize: "12px",
  //                                         height: "12px",
  //                                         color: opt === "Exclude" ? "#ffb74d" : "#af99db",
  //                                     },
  //                                     alignSelf: "center",
  //                                     marginLeft: "5px",
  //                                 }}
  //                             />
  //                         </Tooltip>
  //                         <MenuItem
  //                             disabled={
  //                                 opt === "Exclude" &&
  //                                 filterFieldData.fieldtypeoption === "Relative Filter"
  //                             }
  //                             sx={{
  //                                 fontSize: "12px",
  //                                 alignSelf: "center",
  //                                 padding: "2px 0px",
  //                                 flex: 1,
  //                             }}
  //                         >
  //                             {opt}
  //                         </MenuItem>
  //                     </div>
  //                 ))
  //                 : null}
  //         </Menu>
  //     );
  // };
  const RenderMenu = () => {
    const [selectedSortOptions, setSelectedSortOptions] = useState<string[]>(
      filterFieldData["previousSortOptions"]
        ? JSON.parse(filterFieldData["previousSortOptions"])
        : []
    );
    const [selectedOption, setSelectedOption] = useState(
      filterFieldData.fieldtypeoption === "Pick List"
        ? "Pick List"
        : filterFieldData.fieldtypeoption
    );

    const options = ["Include", "Exclude"];
    const options2 = ["Pick List", "Search Condition"];

    if (
      filterFieldData.dataType === "timestamp" ||
      filterFieldData.dataType === "date"
    ) {
      options2.push("Relative Filter");
    }

    useEffect(() => {
      // Ensure `rawselectmembers` is initialized properly
      if (!Array.isArray(filterFieldData.rawselectmembers)) {
        filterFieldData.rawselectmembers = [];
      }
      if (!Array.isArray(filterFieldData.rawselectmembersOriginal)) {
        filterFieldData.rawselectmembersOriginal = [
          ...filterFieldData.rawselectmembers,
        ];
      }
    }, []);

    const handleOptionSelect = (option: string) => {
      setSelectedOption(option);
      if (option !== "Pick List") {
        setSelectedSortOptions([]);
      } else {
        filterFieldData["userSelection"] = [];
        filterFieldData["filterTypeTillDate"] = "enabled";
        GetPickListItems(selectedSortOptions);
      }
      handleClose("opt2", option);
      updateUserFilterItem(
        propKey,
        0,
        itemIndex,
        constructChartAxesFieldObject(),
        currentChartAxesName
      );
    };

    const handleSortOptionToggle = (sortOpt: string) => {
      const sortOptions = selectedSortOptions.includes(sortOpt)
        ? selectedSortOptions.filter((opt: any) => opt !== sortOpt) // Deselect if already selected
        : [...selectedSortOptions, sortOpt];

      // Always start with the original unfiltered data
      let tempResult = [...filterFieldData.rawselectmembersOriginal];

      // Apply multiple sort options
      if (sortOptions.includes("Sort Desc")) {
        tempResult = [
          "(All)",
          ...tempResult
            .filter((item: any) => item !== "(All)")
            .sort()
            .reverse(),
        ];
      } else {
        tempResult = [
          "(All)",
          ...tempResult.filter((item: any) => item !== "(All)").sort(),
        ];
      }

      if (sortOptions.includes("Remove Blank")) {
        tempResult = tempResult.filter((val: string) => val !== "(blank)");
      }

      if (sortOptions.includes("Blank at Bottom")) {
        const blanks = tempResult.filter((val: string) => val === "(blank)");
        tempResult = tempResult
          .filter((val: string) => val !== "(blank)")
          .concat(blanks);
      }

      // Store the updated sorted data
      filterFieldData.rawselectmembers = [...tempResult];
      filterFieldData.previousSortOptions = JSON.stringify(sortOptions);

      // Update the UI state
      setSelectedSortOptions([...sortOptions]);

      // Trigger an update for the chart
      updateUserFilterItem(
        propKey,
        0,
        itemIndex,
        constructChartAxesFieldObject(),
        currentChartAxesName
      );
    };

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
        {options2.length > 0 &&
          options2.map((opt2, index) => (
            <div key={index}>
              <div
                style={{ display: "flex" }}
                onClick={() => handleOptionSelect(opt2)}
              >
                <Tooltip
                  title={
                    opt2 === filterFieldData.fieldtypeoption ? "Selected" : null
                  }
                >
                  <Radio
                    checked={opt2 === selectedOption}
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: "12px",
                        height: "12px",
                        color: "#af99db",
                      },
                      alignSelf: "center",
                      marginLeft: "5px",
                    }}
                  />
                </Tooltip>
                <MenuItem
                  sx={{
                    flex: 1,
                    fontSize: "12px",
                    alignSelf: "center",
                    padding: "2px 0px",
                    paddingRight: "1rem",
                  }}
                >
                  {opt2}
                </MenuItem>
              </div>

              {selectedOption === "Pick List" && opt2 === "Pick List" && (
                <div style={{ marginLeft: "20px" }}>
                  <div
                    style={{ display: "flex" }}
                    onClick={() => handleSortOptionToggle("Sort Desc")}
                  >
                    <Tooltip
                      title={
                        selectedSortOptions.includes("Sort Desc")
                          ? "Selected"
                          : null
                      }
                    >
                      <Checkbox
                        checked={selectedSortOptions.includes("Sort Desc")}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: "12px",
                            height: "12px",
                            color: "#af99db",
                          },
                          alignSelf: "center",
                          marginLeft: "5px",
                        }}
                      />
                    </Tooltip>
                    <MenuItem
                      sx={{
                        flex: 1,
                        fontSize: "12px",
                        alignSelf: "center",
                        padding: "2px 0px",
                        paddingRight: "1rem",
                      }}
                    >
                      Sort Desc
                    </MenuItem>
                  </div>

                  <div
                    style={{ display: "flex" }}
                    onClick={() => handleSortOptionToggle("Remove Blank")}
                  >
                    <Tooltip
                      title={
                        selectedSortOptions.includes("Remove Blank")
                          ? "Selected"
                          : null
                      }
                    >
                      <Checkbox
                        checked={selectedSortOptions.includes("Remove Blank")}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: "12px",
                            height: "12px",
                            color: "#af99db",
                          },
                          alignSelf: "center",
                          marginLeft: "5px",
                        }}
                      />
                    </Tooltip>
                    <MenuItem
                      sx={{
                        flex: 1,
                        fontSize: "12px",
                        alignSelf: "center",
                        padding: "2px 0px",
                        paddingRight: "1rem",
                      }}
                    >
                      Remove (Blank) values
                    </MenuItem>
                  </div>

                  <div
                    style={{ display: "flex" }}
                    onClick={() => handleSortOptionToggle("Blank at Bottom")}
                  >
                    <Tooltip
                      title={
                        selectedSortOptions.includes("Blank at Bottom")
                          ? "Selected"
                          : null
                      }
                    >
                      <Checkbox
                        checked={selectedSortOptions.includes(
                          "Blank at Bottom"
                        )}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            fontSize: "12px",
                            height: "12px",
                            color: "#af99db",
                          },
                          alignSelf: "center",
                          marginLeft: "5px",
                        }}
                      />
                    </Tooltip>
                    <MenuItem
                      sx={{
                        flex: 1,
                        fontSize: "12px",
                        alignSelf: "center",
                        padding: "2px 0px",
                        paddingRight: "1rem",
                      }}
                    >
                      (Blank) at bottom
                    </MenuItem>
                  </div>
                </div>
              )}
            </div>
          ))}

        <Divider sx={{ margin: "5px 0px" }} />

        {options.map((opt, index) => (
          <div
            key={index}
            style={{ display: "flex" }}
            onClick={() => handleClose("opt1", opt)}
          >
            <Tooltip
              title={opt === filterFieldData.includeexclude ? "Selected" : null}
            >
              <Radio
                checked={opt === filterFieldData.includeexclude}
                disabled={
                  opt === "Exclude" &&
                  filterFieldData.fieldtypeoption === "Relative Filter"
                }
                sx={{
                  "& .MuiSvgIcon-root": {
                    fontSize: "12px",
                    height: "12px",
                    color: opt === "Exclude" ? "#ffb74d" : "#af99db",
                  },
                  alignSelf: "center",
                  marginLeft: "5px",
                }}
              />
            </Tooltip>
            <MenuItem
              disabled={
                opt === "Exclude" &&
                filterFieldData.fieldtypeoption === "Relative Filter"
              }
              sx={{
                fontSize: "12px",
                alignSelf: "center",
                padding: "2px 0px",
                flex: 1,
              }}
            >
              {opt}
            </MenuItem>
          </div>
        ))}
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
        filterFieldData.rawselectmembersOriginal &&
        !filterFieldData.greaterThanOrEqualTo &&
        !filterFieldData.lessThanOrEqualTo
      ) {
        filterFieldData.greaterThanOrEqualTo =
          filterFieldData.rawselectmembersOriginal[1];
        if (typeof filterFieldData.rawselectmembersOriginal[1] === "string") {
          filterFieldData.greaterThanOrEqualTo = null;
        }
        filterFieldData.lessThanOrEqualTo =
          filterFieldData.rawselectmembersOriginal[
            filterFieldData.rawselectmembersOriginal.length - 1
          ];
        if (
          filterFieldData.rawselectmembersOriginal[
            filterFieldData.rawselectmembersOriginal.length - 1
          ] === "(Blank)"
        ) {
          filterFieldData.lessThanOrEqualTo =
            filterFieldData.rawselectmembersOriginal[
              filterFieldData.rawselectmembersOriginal.length - 2
            ];
          if (
            typeof filterFieldData.rawselectmembersOriginal[
              filterFieldData.rawselectmembersOriginal.length - 2
            ] === "string"
          ) {
            filterFieldData.lessThanOrEqualTo = null;
          }
        }
      }

      sliderRange = [
        filterFieldData.greaterThanOrEqualTo,
        filterFieldData.lessThanOrEqualTo,
      ];
    } else if (
      ["date", "timestamp"].includes(dataType) &&
      filterFieldData.prefix !== "date"
    ) {
      if (filterFieldData.prefix === "month") {
        filterFieldData.greaterThanOrEqualTo = 1;
        filterFieldData.lessThanOrEqualTo = 12;
      } else if (filterFieldData.prefix === "quarter") {
        filterFieldData.greaterThanOrEqualTo = 1;
        filterFieldData.lessThanOrEqualTo = 4;
      } else if (filterFieldData.prefix === "dayofmonth") {
        filterFieldData.greaterThanOrEqualTo = 1;
        filterFieldData.lessThanOrEqualTo = 31;
      } else if (filterFieldData.prefix === "dayofweek") {
        filterFieldData.greaterThanOrEqualTo = 1;
        filterFieldData.lessThanOrEqualTo = 7;
      } else {
        filterFieldData.greaterThanOrEqualTo =
          filterFieldData.rawselectmembersOriginal[1];
        if (typeof filterFieldData.rawselectmembersOriginal[1] === "string") {
          filterFieldData.greaterThanOrEqualTo = null;
        }
        filterFieldData.lessThanOrEqualTo =
          filterFieldData.rawselectmembersOriginal[
            filterFieldData.rawselectmembersOriginal.length - 1
          ];
        if (
          filterFieldData.rawselectmembersOriginal[
            filterFieldData.rawselectmembersOriginal.length - 1
          ] === "(Blank)"
        ) {
          filterFieldData.lessThanOrEqualTo =
            filterFieldData.rawselectmembersOriginal[
              filterFieldData.rawselectmembersOriginal.length - 2
            ];
          if (
            typeof filterFieldData.rawselectmembersOriginal[
              filterFieldData.rawselectmembersOriginal.length - 2
            ] === "string"
          ) {
            filterFieldData.lessThanOrEqualTo = null;
          }
        }
      }
    }
  };

  ///Search condition Silder on change handler
  // const handleSliderRangeOnChange = (event: any, newValue: any) => {
  // 	filterFieldData["greaterThanOrEqualTo"] = newValue[0];
  // 	filterFieldData["lessThanOrEqualTo"] = newValue[1];
  // 	sliderRange = newValue;
  // 	updateUserFilterItem(propKey, 0, itemIndex, constructChartAxesFieldObject(), currentChartAxesName);
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
    filterFieldData[key] = event.target.value;

    if (filterFieldData.fieldtypeoption === "Relative Filter") {
      setCirLoading(true);
      await GetRelativeFilterItems();
      setCirLoading(false);
    } else {
      if (filterFieldData.exprType === "between") {
        //setLoading(true);
        await GetPickListItems([]);
        setSliderRange();
        // setLoading(false);
      }
    }
    setSearchConditionDate();

    if (filterFieldData.fieldtypeoption === "Search Condition") {
      if (filterFieldData.exprType === "between") {
        filterFieldData.switchEnableSearchCondition = true;
      } else {
        if (!filterFieldData.exprInput || !filterFieldData.exprInput.length) {
          filterFieldData.switchEnableSearchCondition = false;
          filterFieldData.exprTypeTillDate = false;
        } else {
          filterFieldData.switchEnableSearchCondition = true;
        }
      }
    }

    updateUserFilterItem(
      propKey,
      0,
      itemIndex,
      constructChartAxesFieldObject(),
      currentChartAxesName
    );
  };

  ///Handle Menu button on click
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  ///Remove filter card from dropzone
  const deleteItem = () => {
    deleteDropZoneItems(propKey, bIndex, itemIndex, currentChartAxesName);
  };

  ///Handle Date time grain dropdown list change
  const handleDropDownForDatePatternOnChange = async (event: any) => {
    filterFieldData["prefix"] = event.target.value;
    filterFieldData["greaterThanOrEqualTo"] = "";
    filterFieldData["lessThanOrEqualTo"] = "";
    filterFieldData.filterTypeTillDate = "enabled";
    if (filterFieldData.prefix === "date")
      filterFieldData.exprTypeTillDate = false;
    if (!filterFieldData.exprInput) {
      filterFieldData["switchEnableSearchCondition"] = false;
      filterFieldData.exprTypeTillDate = false;
    }
    if (
      filterFieldData.fieldtypeoption === "Search Condition" &&
      event.target.value === "date"
    ) {
      filterFieldData["exprInput"] = moment(new Date()).format("YYYY-MM-DD");
    }
    if (
      filterFieldData.fieldtypeoption === "Search Condition" &&
      event.target.value !== "date"
    ) {
      if (filterFieldData["exprInput"]?.includes("-")) {
        filterFieldData["exprInput"] = "";
        filterFieldData["switchEnableSearchCondition"] = false;
      }
      if (filterFieldData.exprType === "between")
        filterFieldData["switchEnableSearchCondition"] = true;
    }

    // if (filterFieldData.fieldtypeoption === "Pick List") {
    setLoading(true);
    await GetPickListItems([]);
    setLoading(false);
    setSliderRange();
    // }
    setSearchConditionDate();

    updateUserFilterItem(
      propKey,
      0,
      itemIndex,
      constructChartAxesFieldObject(),
      currentChartAxesName
    );
  };

  const checkForValidData = () => {
    if (filterFieldData.exprType === "blank") return true;
    else if (
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
    val: number | string | Date,
    key = "exprInput",
    type?: string
  ) => {
    filterFieldData["switchEnableSearchCondition"] = true;

    if (type && type === "date") {
      val = moment(val).format("YYYY-MM-DD");
    }

    if (!filterFieldData[key] || filterFieldData[key] !== val) {
      filterFieldData[key] = val;
      filterFieldData["isInValidData"] = false;

      if (filterFieldData.fieldtypeoption === "Relative Filter") {
        setCirLoading(true);
        await GetRelativeFilterItems();
        setCirLoading(false);
      }

      if (
        key !== "exprInput" &&
        filterFieldData.fieldtypeoption === "Search Condition"
      ) {
        checkForValidData();
      }

      if (
        key === "exprTnput" ||
        key === "greaterThanOrEqualTo" ||
        key === "lessThanOrEqualTo"
      ) {
        if (val === null || val === "" || val === undefined) {
          filterFieldData["switchEnableSearchCondition"] = false;
          filterFieldData.exprTypeTillDate = false;
        } else {
          filterFieldData["switchEnableSearchCondition"] = true;
        }
      }

      if (filterFieldData.exprType === "between") {
        sliderRange = [
          filterFieldData.greaterThanOrEqualTo,
          filterFieldData.lessThanOrEqualTo,
        ];
      } else if (!filterFieldData.exprInput?.length) {
        filterFieldData["switchEnableSearchCondition"] = false;
        filterFieldData.exprTypeTillDate = false;
      }

      updateUserFilterItem(
        propKey,
        0,
        itemIndex,
        constructChartAxesFieldObject(),
        currentChartAxesName
      );
    }
  };

  ///Render Relative Filter Value Input Control
  const RelativeFilterValueInputControl = ({ type, exprType }: any) => {
    return (
      <>
        <TextField
          InputProps={{
            style: {
              height: "25px",
              width: "100%",
              minWidth: "100%",
              fontSize: "13px",
              marginRight: "30px",
            },
          }}
          className={dropDownStyles().customSelect}
          sx={{
            minWidth: "100%",
            "& .MuiOutlinedInput-input": {
             padding: "16.5px 14px", // Consistent padding for all browsers
            },
           // Firefox-specific styling
           "@supports (-moz-appearance: none)": {
             "& .MuiOutlinedInput-input": {
             padding: "16.5px 2px 16.5px 14px",
           }
          }
          }}
          placeholder="Value"
          defaultValue={filterFieldData[exprType]}
          type={type}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(event)}
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
    return <div style={{ width: "100%" }}>{members}</div>;
  };

  const ValueFieldForRelativeFilter = ({ exprType }: any) => {
    var members = null;
    members = (
      <RelativeFilterValueInputControl
        type="number"
        exprType={exprType}
      ></RelativeFilterValueInputControl>
    );
    return <div>{members}</div>;
  };

  ///Render Search Condition Custom Input Control
  const SearchConditionCustomInputControl = ({ type }: any) => {
    return (
      <>
        <TextField
          InputProps={
            filterFieldData.includeexclude === "Exclude"
              ? {
                  style: {
                    height: "25px",
                    minWidth: "100%",
                    width: "100%",
                    fontSize: "13px",
                    marginRight: "30px",
                    textDecoration: "line-through",
                    color: "#ffb74d",
                  },
                }
              : {
                  style: {
                    height: "25px",
                    minWidth: "100%",
                    width: "100%",
                    fontSize: "13px",
                    marginRight: "30px",
                  },
                }
          }
          className={dropDownStyles().customSelect}
          placeholder="Value"
          sx={{
            paddingBottom: "8px",
            minWidth: "100%",
            "& .MuiOutlinedInput-input": {
             padding: "16.5px 14px", // Consistent padding for all browsers
            },
           // Firefox-specific styling
           "@supports (-moz-appearance: none)": {
             "& .MuiOutlinedInput-input": {
             padding: "16.5px 2px 16.5px 14px",
            }
           }
          }}
          defaultValue={filterFieldData.exprInput}
          type={type}
          onBlur={(e) =>
            handleCustomRequiredValueOnBlur(
              (e.target as HTMLInputElement).value
            )
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (type === "number"){
              handleKeyDown(e)
            }
            if (e.key === "Enter") {
              handleCustomRequiredValueOnBlur(
                (e.target as HTMLInputElement).value
              );
            }
          }}
        />

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
        <TextField
          type="number"
          InputProps={
            filterFieldData.includeexclude === "Exclude"
              ? {
                  style: {
                    height: "26px",
                    width: "100%",
                    minWidth: "100%",
                    fontSize: "13px",
                    marginRight: "30px",
                    textDecoration: "line-through",
                    color: "#ffb74d",
                  },
                }
              : {
                  style: {
                    height: "26px",
                    width: "100%",
                    minWidth: "100%",
                    fontSize: "13px",
                    marginRight: "30px",
                  },
                }
          }
          className={`CustomInputValue ${dropDownStyles().customSelect}`}
          sx={{
            paddingBottom: "8px",
            minWidth:"100%",
            "& .MuiOutlinedInput-input": {
             padding: "16.5px 14px", //padding for all browsers
            },
           // Firefox-specific style
           "@supports (-moz-appearance: none)": {
             "& .MuiOutlinedInput-input": {
             padding: "16.5px 2px 16.5px 14px",
           }
          }
          }}
          defaultValue={filterFieldData.greaterThanOrEqualTo}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(event)}
          onBlur={(e) => {
            handleCustomRequiredValueOnBlur(
              e.target.value,
              "greaterThanOrEqualTo"
            );
          }}
        />
        <TextField
          type="number"
          InputProps={
            filterFieldData.includeexclude === "Exclude"
              ? {
                  style: {
                    height: "26px",
                    width: "100%",
                    minWidth: "100%",
                    fontSize: "13px",
                    marginRight: "30px",
                    textDecoration: "line-through",
                    color: "#ffb74d",
                  },
                }
              : {
                  style: {
                    height: "26px",
                    width: "100%",
                    minWidth: "100%",
                    fontSize: "13px",
                    marginRight: "30px",
                  },
                }
          }
          className={`CustomInputValue ${dropDownStyles().customSelect}`}
          sx={{
            paddingBottom: "8px",
            minWidth: "100%",
              "& .MuiOutlinedInput-input": {
             padding: "16.5px 14px", // Consistent padding for all browsers
            },
           // Firefox-specific styling
           "@supports (-moz-appearance: none)": {
             "& .MuiOutlinedInput-input": {
             padding: "16.5px 2px 16.5px 14px",
           }
          }
          }}
          defaultValue={filterFieldData.lessThanOrEqualTo}
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(event)}
          onBlur={(e) => {
            handleCustomRequiredValueOnBlur(
              e.target.value,
              "lessThanOrEqualTo"
            );
          }}
        />

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
            value={parseISO(filterFieldData.greaterThanOrEqualTo)}
            onChange={(e) =>
              e &&
              handleCustomRequiredValueOnBlur(e, "greaterThanOrEqualTo", "date")
            }
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  sx={
                    filterFieldData.includeexclude === "Exclude"
                      ? {
                          paddingBottom: "5px",
                          color: "#ffb74d",
                          textDecoration: "line-through",
                          minWidth: "100%"
                        }
                      : { paddingBottom: "8px", minWidth: "100%" }
                  }
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      ...params.InputProps?.style,
                      color:
                        filterFieldData.includeexclude === "Exclude"
                          ? "#ffb74d"
                          : "inherit",
                    },
                  }}
                  className={`customDatePickerHeight ${
                    dropDownStyles().customSelect
                  }`}
                />
              ),
            }}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={parseISO(filterFieldData.lessThanOrEqualTo)}
            onChange={(e) =>
              e &&
              handleCustomRequiredValueOnBlur(e, "lessThanOrEqualTo", "date")
            }
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  sx={
                    filterFieldData.includeexclude === "Exclude"
                      ? { textDecoration: "line-through", color: "#ffb74d", minWidth: "100%" }
                      : {minWidth: "100%"}
                  }
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      ...params.InputProps?.style,
                      color:
                        filterFieldData.includeexclude === "Exclude"
                          ? "#ffb74d"
                          : "inherit",
                    },
                  }}
                  className={`customDatePickerHeight ${
                    dropDownStyles().customSelect
                  }`}
                />
              ),
            }}
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
    if (filterFieldData.exprType === "blank") return <div>{members}</div>;
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
                      value={parseISO(filterFieldData.exprInput)}
                      onChange={(e) =>
                        e &&
                        handleCustomRequiredValueOnBlur(e, "exprInput", "date")
                      }
                      slots={{
                        textField: (params) => (
                          <TextField
                            {...params}
                            sx={
                              filterFieldData.includeexclude === "Exclude"
                                ? {
                                    textDecoration: "line-through",
                                    color: "#ffb74d",
                                  }
                                : {}
                            }
                            InputProps={{
                              ...params.InputProps,
                              style: {
                                ...params.InputProps?.style,
                                color:
                                  filterFieldData.includeexclude === "Exclude"
                                    ? "#ffb74d"
                                    : "inherit",
                              },
                            }}
                            className={`customDatePickerHeight ${
                              dropDownStyles().customSelect
                            }`}
                          />
                        ),
                      }}
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

  ///Style for changing border color of different menus on focus
  const dropDownStyles = makeStyles({
    customSelect: {
      "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
          borderColor: "#2bb9bb",
        },
        "&:hover fieldset": {
          borderColor: "#2bb9bb", 
        }
      },
    },
  });

  ///Dropdown list to select Time grain
  const DropDownForDatePattern = ({ items, usersx }: any) => {
    return (
      <FormControl
        fullWidth
        size="small"
        className={dropDownStyles().customSelect}
      >
        <Select
          sx={{
            height: "1.5rem",
            fontSize: fontSize.large,
            textAlign: "left",
            ".MuiSelect-icon": {
              fontSize: fontSize.TripleExtraLarge,
              marginLeft: "20px",
              color: palette.primary.contrastText,
              right: "5px",
              ...usersx
            },
          }}
          IconComponent={KeyboardArrowDownIcon}
          onChange={(e) => {
            handleDropDownForDatePatternOnChange(e);
          }}
          value={filterFieldData["prefix"]}
        >
          {items.map((item: any) => {
            return (
              <MenuItem
                key={item.key}
                value={item.key}
                selected={item.key === filterFieldData.exprType}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "rgba(43, 185, 187, 0.1)", // Change background color for selected option
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "rgba(43, 185, 187, 0.2)", // Change hover background color
                  },
                }}
              >
                <Typography
                  sx={{
                    // width: "155px",
                    // widht: "94%",
                    minWidth: "100%",
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
  const DropDownForPattern = ({ items, exprType = "exprType", usersx }: any) => {
    return (
      <FormControl
        fullWidth
        size="small"
        className={dropDownStyles().customSelect}
      >
        <Select
          sx={{
            height: "1.5rem",
            fontSize: fontSize.large,
            textAlign: "left",
            ".MuiSelect-icon": {
              fontSize: fontSize.TripleExtraLarge,
              marginLeft: "20px",
              color: palette.primary.contrastText,
              ...usersx
              // right: "3.5px",
            },
          }}
          IconComponent={KeyboardArrowDownIcon}
          onChange={(e) => {
            handleDropDownForPatternOnChange(e, exprType);
          }}
          value={filterFieldData[exprType]}
        >
          {items.map((item: any) => {
            return (
              <MenuItem
                key={item.key}
                value={item.key}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "rgba(43, 185, 187, 0.1)", // Change background color for selected option
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "rgba(43, 185, 187, 0.2)", // Change hover background color
                  },
                }}
              >
                <Typography
                  sx={{
                    width: "auto",
                    minWidth: "100%",
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
            <DropDownForPatternCommon
              value={filterFieldData["exprType"]}
              handleDropDownChange={handleDropDownForPatternOnChange}
              exprType={"exprType"}
              items={equalPatternCollections}
              usersx={{ marginRight: "0rem", right: "4.5px" }}
            ></DropDownForPatternCommon>
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
              usersx={{
                  marginRight: "-0.15rem",
              }}
            ></DropDownForPattern>
          );
          break;
        default:
          members = null;
          break;
      }
    }

    return (
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          rowGap: "8px",
          // marginLeft: "6px",
          paddingTop: "2px",
          // width: "95%",
        }}
      >
        {members}
        <CustomRequiredField></CustomRequiredField>
      </div>
    );
  };

  ///Expand Collapse Icon switch
  const ExpandCollaseIconSwitch = () => {
    return filterFieldData.isCollapsed ? (
      <ChevronRightIcon
        style={{
          height: "18px",
          width: "18px",
          color: palette.primary.contrastText,
        }}
        onClick={(e) => {
          filterFieldData.isCollapsed = false;
          updateUserFilterItem(
            propKey,
            0,
            itemIndex,
            constructChartAxesFieldObject(),
            currentChartAxesName
          );
        }}
      />
    ) : (
      <KeyboardArrowDownIcon
        style={{
          height: "18px",
          width: "18px",
          color: palette.primary.contrastText,
        }}
        onClick={(e) => {
          filterFieldData.isCollapsed = true;
          updateUserFilterItem(
            propKey,
            0,
            itemIndex,
            constructChartAxesFieldObject(),
            currentChartAxesName
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

      <div
        className="axisFilterField"
        // style={styles}
        style={
          !filterFieldData.isCollapsed
            ? {
                border: "1px #af99db solid",
                borderRadius: "4px",
                color: "#af99db",
                // fontWeight: "bold",
                height: "1.5rem",
              }
            : { height: "1.5rem" }
        }
      >
        {/* remove column  */}
        <button
          type="button"
          className="buttonCommon columnClose"
          onClick={deleteItem}
          title="Remove field"
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)} 
          style={{ cursor: "pointer" }}
        >
          <CloseRoundedIcon
            style={{
              fontSize: fontSize.semiLarge,
              color: isHovered ? "red" : palette.primary.contrastText,
            }}
            // id="first_field_close_icon"
          />
        </button>

        {/* filter column name */}

        {/* <span className="columnName" style={{  }}>
          {field.fieldname}
        </span> */}
        <Typography
          variant="body2"
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            // fontWeight: "600",
            color: palette.primary.contrastText,
            fontSize: fontSize.medium,
          }}
        >
          {field.fieldname}
        </Typography>
        {/* down arrow icon */}
        <button
          type="button"
          className="buttonCommon"
          style={{ backgroundColor: "transparent", padding: "1px 3px" }}
          title="More Options"
          onClick={handleClick}
        >
          <MoreVertIcon
            style={{
              fontSize: fontSize.semiLarge,
              color: palette.primary.contrastText,
              marginTop: "3px",
              // marginRight: "2px",
            }}
          />
        </button>

        {/* expand colapse icon */}
        <button
          type="button"
          className="buttonCommon columnDown"
          title={filterFieldData.isCollapsed ? "Expand" : "Collapse"}
          style={{ paddingInline: "4px" }}
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
              <div
                className="CustomRequiredField"
                style={{
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "8px",
                  // marginLeft: "6px",
                  paddingTop: "2px",
                  // width: "95%",
                }}
              >
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
              <>
                <SelecPickListCard></SelecPickListCard>
                {filterFieldData.dataType === "timestamp" ||
                filterFieldData.dataType === "date" ? (
                  <SelecTillDate></SelecTillDate>
                ) : null}
              </>
            ) : filterFieldData.fieldtypeoption === "Relative Filter" ? (
              <SelecRelativeFilterCard></SelecRelativeFilterCard>
            ) : (
              <>
                <CustomCard></CustomCard>
                {filterFieldData.dataType === "timestamp" ||
                filterFieldData.dataType === "date" ? (
                  <SelecTillDate></SelecTillDate>
                ) : null}
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};
// };

const mapStateToProps = (
  state: TabTileStateProps2 & ChartPropertiesStateProps & isLoggedProps,
  ownProps: any
) => {
  return {
    chartProp: state.chartProperties,
    token: state.isLogged.accessToken,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    updateLeftFilterItem: (
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
    updtateFilterExpandeCollapse: (
      propKey: string,
      bIndex: number,
      item: any,
      currentChartAxesName: string
    ) =>
      dispatch(
        updtateFilterExpandeCollapse(
          propKey,
          bIndex,
          item,
          currentChartAxesName
        )
      ),
    deleteDropZoneItems: (
      propKey: string,
      binIndex: number,
      itemIndex: any,
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

    sortAxes: (
      propKey: string,
      bIndex: number,
      dragUId: any,
      uId: string,
      currentChartAxesName: string
    ) =>
      dispatch(sortAxes(propKey, bIndex, dragUId, uId, currentChartAxesName)),
    revertAxes: (
      propKey: string,
      bIndex: number,
      uId: string,
      originalIndex: any,
      currentChartAxesName: string
    ) =>
      dispatch(
        revertAxes(propKey, bIndex, uId, originalIndex, currentChartAxesName)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserFilterCard);