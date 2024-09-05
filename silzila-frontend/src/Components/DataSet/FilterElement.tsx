import React, { useEffect, useState } from "react";
import { dataSetFilterArrayProps } from "./UserFilterDatasetInterfaces";
import FetchData from "../ServerCall/FetchData";
import moment from "moment";
import "../ChartAxes/Card.css";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "../ChartFieldFilter/UserFilterCard.css";
import { connect } from "react-redux";
import Switch from "@mui/material/Switch";
import { alpha, styled } from "@mui/material/styles";
import MenuOption from "./MenuOption";
import LoadingPopover from "../CommonFunctions/PopOverComponents/LoadingPopover";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { PatternCollectionType } from "../ChartFieldFilter/UserFilterCardInterface";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { DataSetStateProps } from "../../redux/DataSet/DatasetStateInterfaces";

export interface FilterElementProps {
  filterDatasetItem: dataSetFilterArrayProps;
  dbConnectionId: any;
  editMode?: boolean;
  dbName: string;
  dsId: string;
  schema: string;
  token: string;
  setDataSetFilterArray: React.Dispatch<
    React.SetStateAction<dataSetFilterArrayProps[]>
  >;
}

const FilterElement = ({
  filterDatasetItem,
  dbConnectionId,
  dbName,
  schema,
  token,
  editMode,
  dsId,

  setDataSetFilterArray,
}: FilterElementProps) => {
  console.log(filterDatasetItem);
  var {
    exprType,
    fieldName,
    fieldtypeoption,
    includeexclude,

    tableId,
    displayName,
    tableName,
    dataType,
    uid,
  } = filterDatasetItem;

  let sliderRange = [0, 0];
  var switchColor = "#2bb9bb";

  // let filterFieldData = JSON.parse(JSON.stringify(filterDatasetItem));
  const [filterFieldData, setFilterFieldData] = useState(
    JSON.parse(JSON.stringify(filterDatasetItem))
  );
  console.log(filterDatasetItem);
  useEffect(() => {
    setFilterFieldData((prev: any) => ({
      ...prev,
      // includeexclude: prev.shouldExclude ? "Include" : "Exclude",
      // fieldtypeoption: prev.filterType,
    }));
    filterFieldData["fieldtypeoption"] = "Pick List";
    filterFieldData["exprType"] = "Greater than";

    // setDataSetFilterArray((prevArray: any) =>
    //   prevArray.map((item: any) =>
    //     item.uid === uid
    //       ? {
    //           filterDatasetItem,
    //         }
    //       : item
    //   )
    // );
  }, []);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    filterFieldData.isCollapsed
  );
  const [picklist, setPickList] = useState<any>();

  const [preExiting, setPreExiting] = useState<boolean>(false);

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
  const equalPatternCollections: PatternCollectionType[] = [
    { key: "greaterThan", value: "> Greater than" },
    { key: "lessThan", value: "< Less than" },
    { key: "greaterThanOrEqualTo", value: ">= Greater than or Equal to" },
    { key: "lessThanOrEqualTo", value: "<= Less than or Equal to" },
    { key: "equalTo", value: "= Equal to" },
    { key: "notEqualTo", value: "<> Not Equal to" },
    { key: "between", value: ">= Between <=" },
  ];
  const RelativeFilterPatternCollections: PatternCollectionType[] = [
    { key: "last", value: "Last" },
    { key: "current", value: "Current" },
    { key: "next", value: "Next" },
  ];

  const [loading, setLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<any>>(new Set());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuId, setMenuId] = useState<string>("");
  const [objectToMakeCall, setObjectToMakeCall] =
    useState<dataSetFilterArrayProps>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setFilterFieldData((prevState: any) => {
      let updatedState = { ...prevState };
      updatedState.includeexclude = "Include";

      if (updatedState && updatedState.dataType) {
        switch (updatedState.dataType) {
          case "decimal":
          case "integer":
            if (!updatedState.fieldtypeoption) {
              updatedState.fieldtypeoption = "Search List";
              updatedState.exprType = "greaterThan";
            }
            break;
          case "date":
          case "timestamp":
            if (!updatedState.fieldtypeoption) {
              updatedState.prefix = "year";
              updatedState.fieldtypeoption = "Pick List";
            }
            break;
          default:
            if (!updatedState.fieldtypeoption) {
              updatedState.fieldtypeoption = "Pick List";
            }
            break;
        }
      }

      if (updatedState.fieldtypeoption === "Search Condition") {
        if (updatedState.dataType) {
          switch (updatedState.dataType) {
            case "decimal":
            case "integer":
              if (!updatedState.exprType) {
                updatedState.exprType = "greaterThan";
              }
              break;
            case "text":
              if (!updatedState.exprType) {
                updatedState.exprType = "beginsWith";
              }
              break;
            case "timestamp":
            case "date":
              if (!updatedState.exprType) {
                updatedState.prefix = "year";
                updatedState.exprType = "greaterThan";
              }
              break;
            default:
              if (!updatedState.exprType) {
                updatedState.exprType = "greaterThan";
              }
              break;
          }
        }
      } else if (updatedState.fieldtypeoption === "Pick List") {
        if (
          updatedState &&
          updatedState.dataType &&
          updatedState.dataType === "timestamp" &&
          !updatedState.prefix
        ) {
          updatedState.prefix = "year";
        }

        async function _preFetchData() {
          if (!updatedState.rawselectmembers) {
            setLoading(true);
            await GetPickListItems();
            setLoading(false);
          }
        }
        updatedState.exprTypeTillDate = false;
        updatedState.filterTypeTillDate = "enabled";

        _preFetchData();
      } else if (updatedState.fieldtypeoption === "Relative Filter") {
        initialRelativeFilterData();
      }

      return updatedState;
    });

    // eslint-disable-next-line
  }, []);

  const _getFilterType = () => {
    switch (dataType) {
      case "decimal":
      case "integer":
        return fieldtypeoption === "Search Condition"
          ? "number_search"
          : "number_user_selection";
      case "text":
        return "text_user_selection";
      case "timestamp":
      case "date":
        return fieldtypeoption === "Search Condition"
          ? "date_search"
          : fieldtypeoption === "Relative Filter"
          ? "relativeFilter"
          : "date_user_selection";
      default:
        return "text_user_selection";
    }
  };

  const fetchFieldData = (type: string) => {
    let url: string;
    let bodyData: any;
    let filterOption: string = "allValues";

    url = `filter-options?dbconnectionid=${dbConnectionId}`;
    bodyData = {
      exprType: filterFieldData.exprType,
      tableId: filterFieldData.tableId,
      fieldName: filterFieldData.fieldName,
      dataType: filterFieldData.dataType,
      filterOption: "allValues",
      tableName: filterFieldData.tableName,
      schemaName: schema,
      dbName,
    };

    if (
      filterFieldData.dataType === "timestamp" ||
      filterFieldData.dataType === "date"
    ) {
      bodyData["timeGrain"] = filterFieldData.prefix || "year";
    }

    return FetchData({
      requestType: "withData",
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
  };

  const fetchRelativeFilterFieldData = (type: string) => {
    let bodyData: any = {
      filterTable: {
        tableId: tableId,
        displayName: fieldName,
        fieldName: fieldName,
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
      url: `relative-filter?dbconnectionid=${dbConnectionId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
  };
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    uid: string
  ) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
    setMenuId(uid);
  };

  const handleDelete = (uid: string) => {
    setDataSetFilterArray((prevArray) =>
      prevArray.filter((item) => item.uid !== uid)
    );
  };

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
      if (filterFieldData["exprInput"].includes("-")) {
        filterFieldData["exprInput"] = "";
        filterFieldData["switchEnableSearchCondition"] = false;
      }
      if (filterFieldData.exprType === "between")
        filterFieldData["switchEnableSearchCondition"] = true;
    }

    // if (filterFieldData.fieldtypeoption === "Pick List") {
    setLoading(true);
    await GetPickListItems();
    setLoading(false);
    setSliderRange();
    // }
    setSearchConditionDate();
    setFilterFieldData((prev: any) => ({
      ...prev,
    }));
  };

  const DropDownForDatePattern = ({ items }: any) => {
    return (
      <FormControl fullWidth size="small">
        <Select
          sx={{
            height: "1.5rem",
            fontSize: "14px",
            textAlign: "left",
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
              >
                <Typography
                  sx={{
                    // width: "155px",
                    // widht: "94%",
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

  const handleExpand = (uid: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(uid)) {
        newSet.delete(uid);
      } else {
        newSet.add(uid);
      }
      return newSet;
    });
  };

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
      if (filterFieldData.prefix !== "year") {
        filterFieldData.greaterThanOrEqualTo = 1;
        filterFieldData.lessThanOrEqualTo =
          filterFieldData.rawselectmembers.length - 1;
      } else {
        filterFieldData.greaterThanOrEqualTo =
          filterFieldData.rawselectmembers[1];
        filterFieldData.lessThanOrEqualTo =
          filterFieldData.rawselectmembers[
            filterFieldData.rawselectmembers.length - 1
          ];
      }
    }
  };

  const GetPickListItems = async () => {
    const result: any = await fetchFieldData(_getFilterType());
    console.log(filterFieldData);
    console.log(result);
    if (result && result.data) {
      const tempResult = [
        "(All)",
        ...result.data.map((item: any) => item[Object.keys(result.data[0])[0]]),
      ];

      setFilterFieldData((prevState: any) => ({
        ...prevState, // Spread the previous state to keep all existing fields
        rawselectmembers: [...tempResult],
        userSelection: [...tempResult],

        // Update only the rawselectmembers field
      }));

      setPickList(tempResult);
      setDataSetFilterArray((prevArray: any) =>
        prevArray.map((item: any) =>
          item.uid === uid
            ? {
                ...item,
                rawselectmembers: tempResult,
                userSelection: tempResult,
                includeexclude: "Include",
              }
            : item
        )
      );
    }
  };

  const handleClose = (type: string, option: string, uid: string) => {
    let updatedObject = filterFieldData;
    if (!filterFieldData.includeexclude) {
      updatedObject.includeexclude = "Include";
    }

    console.log(type);
    console.log(option);
    console.log(updatedObject);

    if (type === "clickOutside") {
      setIsMenuOpen(false);
      return;
    }

    setDataSetFilterArray((prevArray) =>
      prevArray.map((item) => {
        if (item.uid === uid) {
          updatedObject = {
            ...item,
            [type === "opt2" ? "fieldtypeoption" : "includeexclude"]: option,
          };
          return updatedObject;
        }
        return item;
      })
    );
    setFilterFieldData(updatedObject);
    console.log(updatedObject);

    if (updatedObject) setObjectToMakeCall(updatedObject);
    setIsMenuOpen(false);
  };

  //initial Relative Filter
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

  // const SelecPickListCard = () => {
  //   let _selectionMembers = null;
  //   console.log(filterFieldData);
  //   // filterFieldData["rawselectmembers"] = picklist;

  //   if (picklist && picklist.length > 0) {
  //     _selectionMembers = picklist.map((item: any, index: number) => {
  //       console.log("chal picklistcard");
  //       return (
  //         <label className="UserFilterCheckboxes" key={index}>
  //           {filterFieldData.includeexclude === "Include" ? (
  //             <Checkbox
  //               checked={
  //                 filterFieldData.userSelection
  //                   ? filterFieldData.includeexclude === "Include"
  //                     ? filterFieldData.userSelection.includes(item)
  //                       ? true
  //                       : false
  //                     : false
  //                   : false
  //               }
  //               name={item}
  //               style={{
  //                 transform: "scale(0.6)",

  //                 paddingRight: "0px",
  //               }}
  //               sx={{
  //                 color: "red",
  //                 "&.Mui-checked": {
  //                   color: "#a6a6a6",
  //                 },
  //               }}
  //               onChange={(e) => handleCBChange(e)}
  //             />
  //           ) : (
  //             <Checkbox
  //               checked={
  //                 filterFieldData.userSelection
  //                   ? filterFieldData.includeexclude === "Exclude"
  //                     ? filterFieldData.userSelection.includes(item)
  //                       ? true
  //                       : false
  //                     : false
  //                   : false
  //               }
  //               name={item}
  //               style={{
  //                 transform: "scale(0.6)",
  //                 paddingRight: "0px",
  //               }}
  //               sx={{
  //                 "&.Mui-checked": {
  //                   color: "orange",
  //                 },
  //               }}
  //               onChange={(e) => handleCBChange(e)}
  //             />
  //           )}

  //           <span
  //             title={item}
  //             style={
  //               filterFieldData.includeexclude === "Exclude" &&
  //               filterFieldData.userSelection.includes(item)
  //                 ? {
  //                     marginLeft: 0,
  //                     marginTop: "3.5px",
  //                     justifySelf: "center",
  //                     textOverflow: "ellipsis",
  //                     whiteSpace: "nowrap",
  //                     overflow: "hidden",
  //                     textDecoration: "line-through",
  //                   }
  //                 : {
  //                     marginLeft: 0,
  //                     marginTop: "3.5px",
  //                     justifySelf: "center",
  //                     textOverflow: "ellipsis",
  //                     whiteSpace: "nowrap",
  //                     overflow: "hidden",
  //                   }
  //             }
  //           >
  //             {item}
  //           </span>
  //         </label>
  //       );
  //     });
  //   } else {
  //     _selectionMembers = null;
  //   }

  //   return (
  //     <div className="SelectionMembersCheckBoxArea">{_selectionMembers}</div>
  //   );
  // };
  useEffect(() => {
    const fetchPickList = async () => {
      if (!picklist || picklist.length === 0) {
        setLoading(true);
        await GetPickListItems(); // Assume this function updates the picklist state
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    fetchPickList();
    setFilterFieldData((prev: any) => ({
      ...prev,
    }));
  }, [isCollapsed]);

  const SelecPickListCard = () => {
    if (!picklist || picklist.length === 0) return null;

    return (
      <div className="SelectionMembersCheckBoxArea">
        {picklist.map((item: any, index: number) => (
          <label className="UserFilterCheckboxes" key={index}>
            <Checkbox
              checked={filterFieldData.userSelection.includes(item)}
              name={item}
              style={{ transform: "scale(0.6)", paddingRight: "0px" }}
              sx={{
                color: "red",
                "&.Mui-checked": {
                  color:
                    filterFieldData.includeexclude === "Include"
                      ? "#a6a6a6"
                      : "orange",
                },
              }}
              onChange={handleCBChange}
            />
            <span
              title={item}
              style={{
                marginLeft: 0,
                marginTop: "3.5px",
                justifySelf: "center",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                ...(filterFieldData.includeexclude === "Exclude" &&
                filterFieldData.userSelection.includes(item)
                  ? { textDecoration: "line-through" }
                  : {}),
              }}
            >
              {item}
            </span>
          </label>
        ))}
      </div>
    );
  };
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
      } else if (!filterFieldData.exprInput.length) {
        filterFieldData["switchEnableSearchCondition"] = false;
        filterFieldData.exprTypeTillDate = false;
      }

      if (filterFieldData.fieldtypeoption === "Relative Filter") {
        setLoading(true);
        await GetRelativeFilterItems();
        setLoading(false);
      }
    }
  };

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
                    fontSize: "13px",
                    marginRight: "30px",
                  },
                }
          }
          className="CustomInputValue"
          sx={{
            paddingBottom: "8px",
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
          InputProps={
            filterFieldData.includeexclude === "Exclude"
              ? {
                  style: {
                    height: "26px",
                    width: "100%",
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
                    fontSize: "13px",
                    marginRight: "30px",
                  },
                }
          }
          className="CustomInputValue"
          sx={{
            paddingBottom: "8px",
          }}
          defaultValue={filterFieldData.lessThanOrEqualTo}
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

  const RequiredFieldForRelativeFilter = ({ exprType }: any) => {
    var members = null;
    members = (
      <DropDownForPattern
        items={RelativeFilterPatternCollections}
        exprType={exprType}
      ></DropDownForPattern>
    );
    return <div style={{ marginRight: "22px", width: "90px" }}>{members}</div>;
  };

  const ExpandCollaseIconSwitch = () => {
    return isCollapsed ? (
      <ChevronRightIcon
        style={{ height: "18px", width: "18px", color: "#999999" }}
        onClick={(e) => {
          setIsCollapsed(false);
          console.log("collapse");
        }}
      />
    ) : (
      <KeyboardArrowDownIcon
        style={{ height: "18px", width: "18px", color: "#999999" }}
        onClick={(e) => {
          setIsCollapsed(true);
        }}
      />
    );
  };

  const SearchConditionCustomInputControl = ({ type }: any) => {
    return (
      <>
        <TextField
          InputProps={
            filterFieldData.includeexclude === "Exclude"
              ? {
                  style: {
                    height: "25px",
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
                    width: "100%",
                    fontSize: "13px",
                    marginRight: "30px",
                  },
                }
          }
          placeholder="Value"
          sx={{
            paddingBottom: "8px",
          }}
          defaultValue={filterFieldData.exprInput}
          type={type}
          onBlur={(e) => handleCustomRequiredValueOnBlur(e.target.value)}
        />

        {filterFieldData.isInValidData ? (
          <span className="ErrorText">Please enter valid data.</span>
        ) : null}
      </>
    );
  };

  const SearchConditionDateBetween = () => {
    return (
      <div className="customDatePickerWidth">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={filterFieldData.greaterThanOrEqualTo}
            onChange={(e: any) =>
              handleCustomRequiredValueOnBlur(e, "greaterThanOrEqualTo", "date")
            }
            renderInput={(params: any) => (
              <TextField
                {...params}
                sx={
                  filterFieldData.includeexclude === "Exclude"
                    ? {
                        paddingBottom: "5px",
                        color: "#ffb74d",
                        textDecoration: "line-through",
                      }
                    : { paddingBottom: "8px" }
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
                className="customDatePickerHeight"
              />
            )}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={filterFieldData.lessThanOrEqualTo}
            onChange={(e) =>
              handleCustomRequiredValueOnBlur(e, "lessThanOrEqualTo", "date")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                sx={
                  filterFieldData.includeexclude === "Exclude"
                    ? { textDecoration: "line-through", color: "#ffb74d" }
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
                className="customDatePickerHeight"
              />
            )}
          />
        </LocalizationProvider>
        {filterFieldData.isInValidData ? (
          <span className="ErrorText">Please enter valid data.</span>
        ) : null}
      </div>
    );
  };
  const RelativeFilterValueInputControl = ({ type, exprType }: any) => {
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

  const ValueFieldForRelativeFilter = ({ exprType }: any) => {
    var members = null;
    members = (
      <RelativeFilterValueInputControl
        type="number"
        exprType={exprType}
      ></RelativeFilterValueInputControl>
    );
    return <div style={{ width: "60px" }}>{members}</div>;
  };

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
          color: "black",
          textAlign: "left",
          paddingLeft: "15px",
          paddingRight: "15px",
          paddingBottom: "3px",
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
                      renderInput={(params) => (
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
                          className="customDatePickerHeight"
                        />
                      )}
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

  const GetRelativeFilterItems = async () => {
    let result: any = await fetchRelativeFilterFieldData(_getFilterType());

    if (result) {
      if (result.data && result.data.length > 0) {
        filterFieldData["fromDate"] =
          result.data[0][Object.keys(result.data[0])[1]];
        filterFieldData["toDate"] =
          result.data[0][Object.keys(result.data[0])[0]];
      }
    }
  };

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

  const handleDropDownForPatternOnChange = async (
    event: any,
    key = "exprType"
  ) => {
    filterFieldData[key] = event.target.value;

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
    setFilterFieldData((prev: any) => ({
      ...prev,
    }));
  };

  const DropDownForPattern = ({ items, exprType = "exprType" }: any) => {
    return (
      <FormControl fullWidth size="small">
        <Select
          sx={{
            height: "1.5rem",
            fontSize: "14px",
            textAlign: "left",
          }}
          IconComponent={KeyboardArrowDownIcon}
          onChange={(e) => {
            handleDropDownForPatternOnChange(e, exprType);
          }}
          value={filterFieldData[exprType]}
        >
          {items.map((item: any) => {
            return (
              <MenuItem key={item.key} value={item.key}>
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
  const handleCBChange = (event: any) => {
    if (event.target.name.toString() === "(All)") {
      if (event.target.checked) {
        filterFieldData["userSelection"] = [
          ...filterFieldData.rawselectmembers,
        ];
        filterFieldData["filterTypeTillDate"] = "enabled";
        // setFilterFieldData((prev: any) => ({
        //   ...prev,
        // }));
      } else {
        filterFieldData["userSelection"] = [];
        // setFilterFieldData((prev: any) => ({
        //   ...prev,
        // }));
      }
    } else {
      filterFieldData["filterTypeTillDate"] = "disabled";
      // setFilterFieldData((prev: any) => ({
      //   ...prev,
      // }));
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
            // setFilterFieldData((prev: any) => ({
            //   ...prev, // Spread the previous state to keep all existing fields
            //   userSelection: [...prev.userSelection, _name], // Push the new name into the userSelection array
            // }));
          }
        } else {
          filterFieldData.userSelection.push(event.target.name);
          // setFilterFieldData((prev: any) => ({
          //   ...prev, // Spread the previous state to keep all existing fields
          //   userSelection: [...prev.userSelection, event.target.name], // Push the new name into the userSelection array
          // }));
        }
      } else {
        let idx = filterFieldData.userSelection.findIndex(
          (item: any) => item.toString() === event.target.name.toString()
        );
        filterFieldData.userSelection.splice(idx, 1);
      }
      if (!filterFieldData.userSelection.length) {
        filterFieldData["filterTypeTillDate"] = "enabled";
      }

      let AllIdx = filterFieldData.userSelection.findIndex(
        (item: any) => item.toString() === "(All)"
      );

      if (AllIdx >= 0) {
        filterFieldData.userSelection.splice(AllIdx, 1);
      }
    }
    setFilterFieldData((prev: any) => ({
      ...prev,
    }));
  };

  // const handleCBChange = (event: any) => {
  //   const { name, checked } = event.target;

  //   if (name === "(All)") {
  //     console.log(filterFieldData);
  //     if (checked) {
  //       filterFieldData["userSelection"] = [
  //         ...filterFieldData.rawselectmembers,
  //       ];
  //       console.log(filterFieldData);
  //       filterFieldData["filterTypeTillDate"] = "enabled";
  //     } else {
  //       filterFieldData["userSelection"] = [];
  //     }
  //   } else {
  //     filterFieldData["filterTypeTillDate"] = "disabled";

  //     if (checked) {
  //       const parsedName =
  //         !isNaN(name) && isFinite(name)
  //           ? name.includes(".")
  //             ? parseFloat(name)
  //             : parseInt(name)
  //           : name;

  //       filterFieldData.userSelection.push(parsedName);
  //     } else {
  //       const idx = filterFieldData.userSelection.findIndex(
  //         (item: any) => item.toString() === name.toString()
  //       );
  //       if (idx >= 0) {
  //         filterFieldData.userSelection.splice(idx, 1);
  //       }
  //     }

  //     if (filterFieldData.userSelection.length === 0) {
  //       filterFieldData["filterTypeTillDate"] = "enabled";
  //     }

  //     const allIdx = filterFieldData.userSelection.findIndex(
  //       (item: any) => item.toString() === "(All)"
  //     );

  //     if (allIdx >= 0) {
  //       filterFieldData.userSelection.splice(allIdx, 1);
  //     }
  //   }
  // };

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
          marginLeft: "6px",
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

  const handleChangeTillDate = () => {
    if (filterFieldData.exprTypeTillDate === false) {
      filterFieldData["exprTypeTillDate"] = true;
    } else {
      filterFieldData["exprTypeTillDate"] = false;
    }
    setFilterFieldData((prev: any) => ({
      ...prev,
    }));
  };
  const CustomCard = () => {
    var members = null;
    if (dataType) {
      switch (dataType) {
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
            marginLeft: "6px",
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

    return (
      <div
        style={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          rowGap: "8px",
          marginLeft: "6px",
          paddingTop: "2px",
          width: "94%",
        }}
      >
        {members}
        <CustomRequiredField></CustomRequiredField>
      </div>
    );
  };

  // setDataSetFilterArray((prev: any) => {
  //   if (prev.uid === uid) {
  //     return filterFieldData;
  //   }
  //   return { ...prev };
  // });

  return (
    <div style={{ display: "flex", width: "100%", flexDirection: "column" }}>
      <div
        className="axisFilterField"
        style={{
          width: "94%",
          display: "flex",
          padding: "1px",
          justifyContent: "space-between",
          margin: "3px 6px",
          color: !isCollapsed ? "rgb(175, 153, 219)" : "",
          border: !isCollapsed ? "1px solid rgb(175, 153, 219)" : "",
          fontWeight: !isCollapsed ? "bold" : "",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "130px",
            justifyContent: "center",
            textOverflow: "ellipsis",
          }}
        >
          {/* Remove column */}
          <button
            title="Remove field"
            style={{
              backgroundColor: "white",
              outline: "none",
              border: "none",
            }}
            onClick={() => handleDelete(uid)}
          >
            <CloseRoundedIcon
              className="columnClose"
              style={{ fontSize: "11px" }}
            />
          </button>

          {/* Filter column name */}
          <span
            className="columnName"
            style={{ lineHeight: "15px", display: "block" }}
          >
            {fieldName}
          </span>
          {/* More options icon */}
        </div>
        <div style={{ display: "flex" }}>
          <button
            style={{
              backgroundColor: "white",
              outline: "none",
              border: "none",
            }}
            onClick={(event) => handleMenuClick(event, uid)}
          >
            <MoreVertIcon
              style={{
                height: "18px",
                width: "18px",
                color: "#999999",
              }}
            />
          </button>

          {/* Expand/collapse icon */}
          <button
            type="button"
            className="buttonCommon columnDown"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <ExpandCollaseIconSwitch />
          </button>
        </div>

        {/* Conditional Menu */}
        {isMenuOpen && menuId === uid && (
          <MenuOption
            open={isMenuOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            filterFieldData={filterFieldData}
            uid={uid}
          />
        )}
      </div>
      {/* Conditional rendering based on isCollapsed */}
      {/* {loading ? <LoadingPopover /> : null} */}
      {!isCollapsed ? (
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
                marginLeft: "6px",
                paddingTop: "2px",
              }}
            >
              {filterFieldData.fieldtypeoption === "Pick List" ? (
                <DropDownForDatePattern items={datePatternCollections} />
              ) : filterFieldData.fieldtypeoption === "Search Condition" ? (
                <DropDownForDatePattern
                  items={datePatternSearchConditionCollections}
                />
              ) : null}
            </div>
          ) : null}

          {filterFieldData.fieldtypeoption === "Pick List" ? (
            <>
              <SelecPickListCard />
              {filterFieldData.dataType === "timestamp" ||
              filterFieldData.dataType === "date" ? (
                <SelecTillDate />
              ) : null}
            </>
          ) : filterFieldData.fieldtypeoption === "Relative Filter" ? (
            <SelecRelativeFilterCard />
          ) : (
            <>
              <CustomCard />
              {filterFieldData.dataType === "timestamp" ||
              filterFieldData.dataType === "date" ? (
                <SelecTillDate />
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  token: state.isLogged.accessToken,
  schema: state.dataSetState.schema,
  dbName: state.dataSetState.databaseName,
  dsId: state.dataSetState.dsId,
});

export default connect(mapStateToProps)(FilterElement);
