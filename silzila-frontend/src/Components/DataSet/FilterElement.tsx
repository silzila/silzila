/**
 *
 * This file for individual filter applied to dataset
 *
 * if anchorDate  based on specificDate the date is to be stored in userSelection[0] of "filterfieldData"
 *
 * "filterFieldDate"  store all the values regarding the filter
 * 
 * on each change in "filterFieldDate" "setDataSetFilterArray" is to be called as it update  "datasetFilterArray"
 * in canvax.tsx that keep tracks of all the applied filters in dataset
 * 
 * 
 * date format yyyy-MM-dd
 * 
 * 
 * no need to  modify userSelection to anydata ty[e as it is already in string format] backend alseo accepts as a string
 */
import { CircularProgress } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import FetchData from "../ServerCall/FetchData";
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import "../ChartAxes/Card.css";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "../ChartFieldFilter/UserFilterCard.css";
import { connect } from "react-redux";
import Switch from "@mui/material/Switch";
import { alpha, styled } from "@mui/material/styles";
import MenuOption from "./MenuOption";
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
import { IFilter, IRelativeCondition } from "./BottomBarInterfaces";
import { format } from "date-fns";
import de from "date-fns/locale/de";
export interface FilterElementProps {
  // filter: dataSetFilterArrayProps;
  filter: IFilter;
  dbConnectionId: any;
  editMode?: boolean;
  dbName: string;
  dsId: string;
  schema: string;
  token: string;
  flatFileId: string;
  setDataSetFilterArray: React.Dispatch<React.SetStateAction<IFilter[]>>;
}

const FilterElement = ({
  filter,
  dbConnectionId,
  dbName,
  schema,
  token,
  editMode,
  flatFileId = "",

  setDataSetFilterArray,
}: FilterElementProps) => {
  var switchColor = "#2bb9bb";
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
  // filterFieldData useRef is used for managing filters ,the useStates are for rendering
  const filterFieldData = useRef<IFilter>({
    filterType:
      filter.filterType ||
      filter.filterType ||
      (["decimal", "float", "double", "integer"].includes(filter.dataType)
        ? "searchCondition"
        : "pickList"),
    tableId: filter.tableId,
    fieldName: filter.fieldName,
    dataType: filter.dataType,
    shouldExclude: filter.shouldExclude || false,
    timeGrain: filter.timeGrain || "year",
    operator: filter.operator,
    userSelection: filter.userSelection || [],
    isTillDate: filter.isTillDate || false,
    uid: filter.uid,
    tableName: filter.tableName,
    relativeCondition: (filter.relativeCondition as IRelativeCondition) ?? {
      from: ["last", "1", "year"],
      to: ["next", "1", "year"],
      anchorDate: "today",
    },
  });
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [picklist, setPickList] = useState<any>(null);
  const [searchCondition, setSearchCondition] = useState(filter.operator);
  const getValidDateOrString = (value: any, dataType: string) => {
    if (
      (dataType === "date" || dataType === "timestamp") &&
      !isNaN(new Date(value).getTime())
    ) {
      return new Date(value); // Valid date
    }
    return value || ""; // Return original value if not date/timestamp or invalid date
  };

  const [conditionValue, setConditionValue] = useState<number | string | Date>(
    getValidDateOrString(filter.userSelection[0], filter.dataType)
  );

  const [conditionValue2, setConditionValue2] = useState<
    number | string | Date
  >(getValidDateOrString(filter.userSelection[1], filter.dataType));

  const [timeGrain, setTimeGrain] = useState(filter.timeGrain || "year");
  const [anchorDate, setAnchorDate] = useState<string | Date>(
    filter.relativeCondition?.anchorDate || "today"
  );
  const [loading, setLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuId, setMenuId] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterType, setFilterType] = useState(filter.filterType);
  const [inValidValueError, setInvalidValueError] = useState(false);
  const [operator, setOperator] = useState(filter.operator);
  const [isTillDate,setIsTillDate]=useState(filter.isTillDate??false)
  const [formatedDate, setFormatedDate] = useState({
    from: "",
    to: "",
  });
  const formatDateToYYYYMMDD = (date: any): string => {
    let formated = format(new Date(date), "yyyy-MM-dd");

    return formated;
  };
  const fetchFieldData = (type: string) => {
    let url: string;
    let bodyData: any;

    url =
      schema !== ""
        ? `filter-options?dbconnectionid=${dbConnectionId}`
        : "filter-options";
    bodyData = {
      exprType: filterFieldData.current.operator,
      tableId: filterFieldData.current.tableId,
      fieldName: filterFieldData.current.fieldName,
      dataType: filterFieldData.current.dataType,
      filterOption: "allValues",
      tableName: filterFieldData.current.tableName,
      schemaName: schema,
      dbName,
      flatFileId: flatFileId,
      ...(filterFieldData.current.dataType === "timestamp" ||
      filterFieldData.current.dataType === "date"
        ? { timeGrain: filterFieldData.current.timeGrain || "year" }
        : {}),
    };
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
  function convertKeysToLowercase<T extends Record<string, any>>(obj: T): Record<string, any> {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key.toLowerCase()] = obj[key];
      return acc;
    }, {} as Record<string, any>);
  }
  const getFormatedDate = async () => {
    let body = {};
    let url = "relative-filter";
    if (schema !== "") {
      body = {
        filterTable: {
          tableId: filterFieldData.current.tableId,
          displayName: `${filterFieldData.current.timeGrain} of ${filterFieldData.current.fieldName}`,
          fieldName: filterFieldData.current.fieldName,
          dataType: filterFieldData.current.dataType,
          timeGrain: filterFieldData.current.timeGrain,
        },
        from: filterFieldData.current.relativeCondition?.from,

        to: filterFieldData.current.relativeCondition?.to,

        anchorDate:
          filterFieldData.current.relativeCondition?.anchorDate ===
          "specificDate"
            ? formatDateToYYYYMMDD(filterFieldData.current.userSelection[0])
            : filterFieldData.current.relativeCondition?.anchorDate,
      };
      url = `${url}?dbconnectionid=${dbConnectionId}`;
    } else {
      body = {
        filterTable: {
          tableId: filterFieldData.current.tableId,
          fieldName: filterFieldData.current.fieldName,
          flatFileId: flatFileId,
          dataType: filterFieldData.current.dataType,
          tableName: filterFieldData.current.tableName,
          timeGrain: filterFieldData.current.timeGrain || "year",
        },
        from: filterFieldData.current.relativeCondition?.from,

        to: filterFieldData.current.relativeCondition?.to,

        anchorDate:
          filterFieldData.current.relativeCondition?.anchorDate ===
          "specificDate"
            ? formatDateToYYYYMMDD(filterFieldData.current.userSelection[0])
            : filterFieldData.current.relativeCondition?.anchorDate,
      };
    }
    setLoading(true)
    const res = await FetchData({
      requestType: "withData",
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: body,
    });
    if (res.status) {
      /**
       * 
       * res.data is array of length 1
       * res.data[0] contain an object with two keys "fromdate" and "todate" but
       * their case and order is not fixed  so "convertKeysToLowercase" method
       * will convert the keys into lowercase so its easy to access the API response with keys whatever the order is
       */
      const modifiedRes=convertKeysToLowercase(res.data[0])
      console.log(res.data,modifiedRes)
      setFormatedDate({
        from: modifiedRes["fromdate"],
        to: modifiedRes["todate"],
      });
    }
    setLoading(false)
  };
  useEffect(() => {
    /** 
    on initial render modify the state values get required datat for picklist i.e. all Options

    for relativeFilter set fromDate and toDate

    -> pickList state stores values of all available options and userSelected options
    
    */
    if (filterType === "pickList") {
      (async () => {
        setLoading(true)
        const res = await FetchData({
          requestType: "withData",
          method: "POST",
          url:
            schema !== ""
              ? `filter-options?dbconnectionid=${dbConnectionId}`
              : "filter-options",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          data: {
            // exprType: filterFieldData.current.operator,
            tableId: filterFieldData.current.tableId,
            fieldName: filterFieldData.current.fieldName,
            dataType: filterFieldData.current.dataType,
            filterOption: "allValues",
            tableName: filterFieldData.current.tableName,
            schemaName: schema,
            dbName,
            flatFileId: flatFileId,
            ...(filterFieldData.current.dataType === "timestamp" ||
            filterFieldData.current.dataType === "date"
              ? { timeGrain: filterFieldData.current.timeGrain || "year" }
              : {}),
          },
        });
        if (res && res.status) {
          const data = [
            "(All)",
            ...res.data
              .map((item: any) => item[Object.keys(res.data[0])[0]])
              .map((item: any) => `${item}`),
          ];
            filterFieldData.current = {
              ...filterFieldData.current,
              userSelection: filterFieldData.current.userSelection.length>0
                ? [...filterFieldData.current.userSelection]
                : data.filter((item: any) => item !== "(All)"),
            };
          
          setPickList({
            allOptions: data,
            userSelection:
              filterFieldData.current.userSelection.length > 0
                ? data.length ===
                  filterFieldData.current.userSelection.length + 1
                  ? data
                  : [...filterFieldData.current.userSelection]
                : data,
          });
          // setInclude(true);
        } 

        setDataSetFilterArray((prevFilters) => {
          return prevFilters.map((filter) =>
            filter.uid === filterFieldData.current.uid
              ? filterFieldData.current
              : filter
          );
        });
        setLoading(false)
      })();
    } else if (filterType === "searchCondition") {
      filterFieldData.current.operator = operator;
      setSearchCondition(filterFieldData.current.operator);

      if (
        filterFieldData.current.dataType === "date" ||
        filterFieldData.current.dataType === "timestamp"
      ) {
        setConditionValue(
          (filter.userSelection.length > 0 &&filter.userSelection[0] !==null)
            ? filterFieldData.current.timeGrain === "date"
              ? new Date(filter.userSelection[0])
              : filter.userSelection[0]
            : ""
        );
        if (filterFieldData.current.operator === "between") {
          setConditionValue2(
            filter.userSelection.length > 1  &&filter.userSelection[1] !==null
              ? filterFieldData.current.timeGrain === "date"
                ? new Date(filter.userSelection[1])
                : filter.userSelection[1]
              : ""
          );
        }
      } else if (
        ["decimal", "integer", "float"].includes(
          filterFieldData.current.dataType
        )
      ) {
        setConditionValue(
          filter.userSelection.length > 0  &&filter.userSelection[0] !==null? filter.userSelection[0] : ""
        );
        if (filterFieldData.current.operator === "between") {
          setConditionValue2(
            filter.userSelection.length > 1  &&filter.userSelection[1] !==null? filter.userSelection[1] : ""
          );
        }
      } else {
        setConditionValue(
          filter.userSelection.length > 0  &&filter.userSelection[0] !==null? filter.userSelection[0] : ""
        );
      }

      setDataSetFilterArray((prevFilters) => {
        return prevFilters.map((filter) =>
          filter.uid === filterFieldData.current.uid
            ? filterFieldData.current
            : filter
        );
      });
    } else if (filterType === "relativeFilter") {
      if (
        (filterFieldData.current.dataType === "date" ||
          filterFieldData.current.dataType === "timestamp") &&
        filter.relativeCondition
      ) {
        filterFieldData.current = {
          ...filterFieldData.current,
          relativeCondition: filter.relativeCondition,
        };
        if (
          !["today", "yesterday", "tomorrow", "columnMaxDate"].includes(
            filter.relativeCondition?.anchorDate
          ) &&
          filterFieldData.current.relativeCondition
        ) {
          filterFieldData.current.userSelection[0] =filter.relativeCondition?.anchorDate;
          filterFieldData.current.relativeCondition.anchorDate = "specificDate";
        }
        getFormatedDate();
        if(filterFieldData.current.userSelection[0]){
          setConditionValue(new Date(filterFieldData.current.userSelection[0]))
        }
      }
      setDataSetFilterArray((prevFilters) => {
        return prevFilters.map((filter) =>
          filter.uid === filterFieldData.current.uid
            ? filterFieldData.current
            : filter
        );
      });
    }
  }, [dbConnectionId, dbName, schema, token, filterType]);
  /**
   * @param uid -> filter id
   * handle filter menu opening
   */
  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    uid: string
  ) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
    setMenuId(uid);
  };
  /**
   *
   * @param filterId
   * delete selected filter from dataSetFilterArray
   *
   */
  const handleDelete = (filterId: string) => {
    setDataSetFilterArray((prevArray) =>
      prevArray.filter((item) => item.uid !== filterId)
    );
  };
  /**
   *
   * @param event
   *
   * change timeGrain  if dataType is date or timestamp only for pickList and searchCondition
   */
  const handleDropDownForDatePatternOnChange = async (event: any) => {
    if (filterFieldData.current.filterType === "pickList") {
      // setLoading(true);
      // await GetPickListItems();
      filterFieldData.current.timeGrain = event.target.value;

      const res = await fetchFieldData("");
      if (res && res.status) {
        const data = [
          "(All)",
          ...res.data
            .map((item: any) => item[Object.keys(res.data[0])[0]])
            .map((item: any) => item !== null && item.toString()),
        ];

        filterFieldData.current = {
          ...filterFieldData.current,
          userSelection: data.slice(1),
        };
        setDataSetFilterArray((prevFilters) =>
          prevFilters.map((filter) =>
            filter.uid === filterFieldData.current.uid
              ? filterFieldData.current
              : filter
          )
        );
        setPickList({
          allOptions: data,
          userSelection: data,
        });
        setLoading(false);
      }
    } else if (filterFieldData.current.filterType === "searchCondition") {
      filterFieldData.current.timeGrain = event.target.value;
      setDataSetFilterArray((prevFilters) =>
        prevFilters.map((filter) =>
          filter.uid === filterFieldData.current.uid
            ? filterFieldData.current
            : filter
        )
      );
      setTimeGrain(filterFieldData.current.timeGrain || "year");
    }
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
          value={filterFieldData.current.timeGrain}
        >
          {items.map((item: any) => {
            return (
              <MenuItem
                key={item.key}
                value={item.key}
                selected={item.key === filterFieldData.current.timeGrain}
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

  // const checkForValidData = () => {
  //   if (
  //     filterFieldData.current.prefix === "date" &&
  //     new Date(filterFieldData.current.greaterThanOrEqualTo) >
  //       new Date(filterFieldData.current.lessThanOrEqualTo)
  //   ) {
  //     filterFieldData.current["isInValidData"] = true;
  //   } else {
  //     if (
  //       parseInt(filterFieldData.current.greaterThanOrEqualTo) >
  //       parseInt(filterFieldData.current.lessThanOrEqualTo)
  //     ) {
  //       filterFieldData.current["isInValidData"] = true;
  //     }
  //   }
  // };

  const handleClose = (type: string, option: string, uid: string) => {
    let updatedObject = filterFieldData.current;
    // if (!filterFieldData.current.filterType) {
    //   updatedObject.includeexclude = "Include";
    // }


    if (type === "clickOutside") {
      setIsMenuOpen(false);
      return;
    }
    if (type === "opt2") {
      filterFieldData.current.filterType = option;
      filterFieldData.current.userSelection = [];
      setFilterType(option);
    }
    if (type === "opt1" && option === "Include") {
      filterFieldData.current.shouldExclude = false;
      // setInclude(false);
    }
    if (type === "opt1" && option === "Exclude") {
      filterFieldData.current.shouldExclude = true;
      // setInclude(true);
    }
    setDataSetFilterArray((prevArray: IFilter[]) =>
      prevArray.map((item) => {
        if (item.uid === uid) {
          let val = option === "Include" ? false : true;
          updatedObject = {
            ...item,
            [type === "opt2" ? "filterType" : "shouldExclude"]:
              type === "opt2" ? option : val,
          };

          return updatedObject;
        }
        return item;
      })
    );
    // setFilterFieldData(updatedObject);

    // if (updatedObject) setObjectToMakeCall(updatedObject);
    setIsMenuOpen(false);
  };

  /**
   * 
   * pickList section  
   */
  const SelecPickListCard = () => {
    if(loading) return(
      <Stack spacing={1} sx={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }}>
        <Skeleton variant='text' sx={{fontSize:"1rem"}}  width="90%"/>
        <Skeleton variant='text' sx={{fontSize:"1rem"}}  width="90%"/>
        <Skeleton variant='text' sx={{fontSize:"1rem"}}  width="90%"/>
        
      </Stack>
    );
    if (!picklist || picklist === null) return <span>No Data</span>;
    return (
      <div className="SelectionMembersCheckBoxArea">
        {picklist.allOptions?.map((item: any, index: number) => {
          return (
            <label className="UserFilterCheckboxes" key={index}>
              <Checkbox
                checked={picklist.userSelection.includes(item)}
                value={item}
                name={item===null?"null":item}
                style={{ transform: "scale(0.6)", paddingRight: "0px" }}
                sx={{
                  color: "red",
                  "&.Mui-checked": {
                    color: !filterFieldData.current.shouldExclude
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
                  ...(filterFieldData.current.shouldExclude &&
                  picklist.userSelection.includes(item)
                    ? { textDecoration: "line-through" }
                    : {}),
                }}
              >
                {item===null?"Null":item}
              </span>
            </label>
          );
        })}
      </div>
    );
  };


  const handleCustomRequiredValueOnBlur = async (
    val: number | string | Date | null,
    type: string,
    valType?: string
  ) => {
    if (val === null) return;
    if (filterFieldData.current.filterType === "relativeFilter") {
      // @ts-ignore
      const strDate = format(val, "yyyy-MM-dd");
      filterFieldData.current.userSelection[0] = strDate;
      getFormatedDate();
      setConditionValue(val);
      setDataSetFilterArray((prevArray: IFilter[]) => {
        return prevArray.map((item) =>
          item.uid === filterFieldData.current.uid
            ? filterFieldData.current
            : item
        );
      });
    } else {
      let temp_val = val;
      if (valType && valType === "date") {
        // @ts-ignore
        temp_val = format(temp_val, "yyyy-MM-dd");
      } else {
        temp_val = Number(val);
      }
      if (filterFieldData.current.operator === "between") {
        if (type === "lower_limit") {
          filterFieldData.current.userSelection[0] = temp_val;
          setConditionValue(val);
        } else {
          filterFieldData.current.userSelection[1] = temp_val;
          setConditionValue2(val);
        }
      } else {
        //@ts-ignore
        filterFieldData.current.userSelection = isNaN(temp_val)
          ? [val]
          : [temp_val];
        setConditionValue(val);
      }
      if (valType && valType === "date" ) {
        if ((filterFieldData.current.userSelection[0]!==null && filterFieldData.current.userSelection[1]!==null) &&
          new Date(filterFieldData.current.userSelection[0]) >
          new Date(filterFieldData.current.userSelection[1])
        ) {
          setInvalidValueError(true);
          return;
        }
      } else if (
        (filterFieldData.current.userSelection[0]!==null && filterFieldData.current.userSelection[1]!==null) &&
        filterFieldData.current.userSelection[0] >
        filterFieldData.current.userSelection[1]
      ) {
        setInvalidValueError(true);
        return;
      }
      setInvalidValueError(false);
      setDataSetFilterArray((prevArray: IFilter[]) => {
        return prevArray.map((item) =>
          item.uid === filterFieldData.current.uid
            ? filterFieldData.current
            : item
        );
      });
    }
  };

  const SearchConditionBetweenControl = () => {
    return (
      <>
        <TextField
          type="number"
          InputProps={
            filterFieldData.current.shouldExclude
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
          defaultValue={conditionValue}
          // defaultValue={filterFieldData.current.userSelection[0]}
          onBlur={(e) => {
            handleCustomRequiredValueOnBlur(e.target.value, "lower_limit");
          }}
        />
        <TextField
          type="number"
          InputProps={
            filterFieldData.current.shouldExclude
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
          // defaultValue={conditionValue2}
          defaultValue={filterFieldData.current.userSelection[1]}
          onBlur={(e) => {
            handleCustomRequiredValueOnBlur(e.target.value, "upper_limit");
          }}
        />
      </>
    );
  };

  const RequiredFieldForRelativeFilter = ({ exprType }: any) => {
    var members = null;
    members = (
      <DropDownForRelativePattern
        items={RelativeFilterPatternCollections}
        exprType={exprType}
      ></DropDownForRelativePattern>
    );
    return <div style={{ marginRight: "22px", width: "90px" }}>{members}</div>;
  };

  const ExpandCollaseIconSwitch = () => {
    return isCollapsed ? (
      <ChevronRightIcon
        style={{ height: "18px", width: "18px", color: "#999999" }}
        onClick={(e) => {
          setIsCollapsed(false);
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
          type={type}
          InputProps={
            filterFieldData.current.shouldExclude
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
          defaultValue={conditionValue}
          onChange={(e) =>
            handleCustomRequiredValueOnBlur(e.target.value, "lower_limit")
          }
        />

        {/* {filterFieldData.isInValidData ? (
          <span className="ErrorText">Please enter valid data.</span>
        ) : null} */}
      </>
    );
  };

  const SearchConditionDateBetween = () => {
    return (
      <div className="customDatePickerWidth">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
          <DatePicker
            // value={conditionValue}
            defaultValue={conditionValue}
            onChange={(e) =>
              handleCustomRequiredValueOnBlur(e, "lower_limit", "date")
            }
            slots={{
              textField: (params: any) => (
                <TextField
                  {...params}
                  sx={
                    filterFieldData.current.shouldExclude
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
                      color: filterFieldData.current.shouldExclude
                        ? "#ffb74d"
                        : "inherit",
                    },
                  }}
                  className="customDatePickerHeight"
                />
              ),
            }}
            format="MM/dd/yyyy"
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
          <DatePicker
            format="MM/dd/yyyy"
            value={conditionValue2}
            onChange={(e) =>
              handleCustomRequiredValueOnBlur(e, "upper_limit", "date")
            }
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  sx={
                    filterFieldData.current.shouldExclude
                      ? { textDecoration: "line-through", color: "#ffb74d" }
                      : {}
                  }
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      ...params.InputProps?.style,
                      color: filterFieldData.current.shouldExclude
                        ? "#ffb74d"
                        : "inherit",
                    },
                  }}
                  className="customDatePickerHeight"
                />
              ),
            }}
          />
        </LocalizationProvider>
      </div>
    );
  };
  const handleRelativeValueOnBlur = (
    val: number | string | Date,
    exprType: string
  ) => {
    if (val === null) return;
    if (
      exprType === "value_from" &&
      filterFieldData.current.relativeCondition
    ) {
      filterFieldData.current.relativeCondition.from[1] = val as string;
      // setFromDate((prev) => ({ ...prev, value: val }));
    } else if (filterFieldData.current.relativeCondition) {
      filterFieldData.current.relativeCondition.to[1] = val as string;
      // setToDate((prev) => ({ ...prev, value: val }));
    }
    getFormatedDate();
    setDataSetFilterArray((prevArray: IFilter[]) =>
      prevArray.map((item) =>
        item.uid === filterFieldData.current.uid
          ? filterFieldData.current
          : item
      )
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
          defaultValue={
            exprType === "value_from"
              ? filterFieldData.current.relativeCondition?.from[1]
              : filterFieldData.current.relativeCondition?.to[1]
          }
          type={type}
          onBlur={(e) => handleRelativeValueOnBlur(e.target.value, exprType)}
        />

        {/* {filterFieldData.isInValidData ? (
          <span className="ErrorText">Please enter valid data.</span>
        ) : null} */}
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
    let membersFrom = null;
    membersFrom = (
      <DropDownForRelativePattern
        items={datePatternRelativeFilterCollections}
        exprType="from"
      ></DropDownForRelativePattern>
    );
    let membersTo = null;
    membersTo = (
      <DropDownForRelativePattern
        items={datePatternRelativeFilterCollections}
        exprType="to"
      ></DropDownForRelativePattern>
    );
    let membersAnchordate = null;
    membersAnchordate = (
      <DropDownForRelativePattern
        items={AnchorDatePatternRelativeFilterCollections}
        exprType="anchorDate"
      ></DropDownForRelativePattern>
    );
    var datemember = null;
    datemember = (
      <div className="customDatePickerWidth">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={new Date(conditionValue)}
            onChange={(e: Date | null) =>
              handleCustomRequiredValueOnBlur(e, "lower_limit", "date")
            }
            slots={{
              textField: (params) => (
                <TextField {...params} className="customDatePickerHeight" />
              ),
            }}
          />
        </LocalizationProvider>
        {/* {filterFieldData.isInValidData ? (
          <span className="ErrorText">Please enter valid data.</span>
        ) : null} */}
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
        <span style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>From {loading?(<CircularProgress size={15}/>):(`(${formatedDate.from})`)}</span> {/*To dispaly from-date after fetching*/}
        <div style={{ display: "flex" }}>
          <RequiredFieldForRelativeFilter exprType="last_current_next_from"></RequiredFieldForRelativeFilter>
          {filterFieldData.current.relativeCondition?.from[0] !== "current" ? (
            <ValueFieldForRelativeFilter exprType="value_from"></ValueFieldForRelativeFilter>
          ) : null}
        </div>
        {membersFrom}
        <span style={{display:"flex",gap:"0.5rem",alignItems:"center"}}>To {loading?(<CircularProgress size={15}/>):(`(${formatedDate.to})`)}</span> {/*To dispaly to-date after fetching*/}
        <div style={{ display: "flex" }}>
          <RequiredFieldForRelativeFilter exprType="last_current_next_to"></RequiredFieldForRelativeFilter>
          {filterFieldData.current.relativeCondition?.to[0] !== "current" ? (
            <ValueFieldForRelativeFilter exprType="value_to"></ValueFieldForRelativeFilter>
          ) : null}
        </div>
        {membersTo}
        Based on Date
        {membersAnchordate}
        {filterFieldData.current.relativeCondition?.anchorDate ===
        "specificDate"
          ? datemember
          : null}
      </div>
    );
  };

  const CustomRequiredField = () => {
    let members = null;

    if (filter.dataType) {
      switch (filter.dataType) {
        case "decimal":
        case "float":
        case "double":
        case "integer":
          if (filterFieldData.current.operator === "between") {
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
          if (filterFieldData.current.timeGrain === "date") {
            if (filterFieldData.current.operator === "between") {
              members = (
                <SearchConditionDateBetween></SearchConditionDateBetween>
              );
            } else {
              members = (
                <div className="customDatePickerWidth">
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={de}
                  >
                    <DatePicker
                      value={conditionValue}
                      onChange={(e) =>
                        handleCustomRequiredValueOnBlur(
                          e,
                          "lower_limit",
                          "date"
                        )
                      }
                      slots={{
                        textField: (params) => (
                          <TextField
                            {...params}
                            sx={
                              filterFieldData.current.shouldExclude
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
                                color: filterFieldData.current.shouldExclude
                                  ? "#ffb74d"
                                  : "inherit",
                              },
                            }}
                            className="customDatePickerHeight"
                          />
                        ),
                      }}
                      format="MM/dd/yyyy"
                    />
                  </LocalizationProvider>
                  {/* {filterFieldData.isInValidData ? (
                      <span className="ErrorText">Please enter valid data.</span>
                    ) : null} */}
                </div>
              );
            }
          } else {
            if (filterFieldData.current.operator === "between") {
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

  // const checkValidDate = (val: any) => {
  //   if (
  //     ["date", "timestamp"].includes(dataType) &&
  //     filterFieldData.current.prefix === "date" &&
  //     val.includes("-")
  //   ) {
  //     return true;
  //   }
  //   if (
  //     ["date", "timestamp"].includes(dataType) &&
  //     filterFieldData.current.fieldtypeoption === "relativeFilter" &&
  //     val.includes("-")
  //   ) {
  //     return true;
  //   }

  //   return false;
  // };

  // const setDefaultDate = (key: string, value: any) => {
  //   if (filterFieldData[key]) {
  //     filterFieldData[key] = value ? value : new Date();
  //   }
  // };

  // const setSearchConditionDate = () => {
  //   if (
  //     ["date", "timestamp"].includes(dataType) &&
  //     filterFieldData.prefix === "date"
  //   ) {
  //     if (filterFieldData.exprType === "between") {
  //       if (checkValidDate(filterFieldData.exprInput)) {
  //         setDefaultDate("greaterThanOrEqualTo", filterFieldData.exprInput);
  //         setDefaultDate("lessThanOrEqualTo", filterFieldData.exprInput);
  //       }
  //     } else {
  //       if (checkValidDate(filterFieldData.lessThanOrEqualTo)) {
  //         setDefaultDate("exprInput", filterFieldData.lessThanOrEqualTo);
  //       }
  //     }
  //   }
  // };

  const handleDropDownForPatternOnChange = async (event: any) => {
    filterFieldData.current.operator = event.target.value;
    setSearchCondition(event.target.value);
    setConditionValue("");
    setConditionValue2("");
    setDataSetFilterArray((prevFilters) =>
      prevFilters.map((filter) =>
        filter.uid === filterFieldData.current.uid
          ? filterFieldData.current
          : filter
      )
    );
  };
/**
 * 
 * @param event 
 * @param type 
 * 
 * for relative fi;ter this method modifies the filter values of filter.field.current and datasetFilterArray
 */
  const handleDropDownForRelativePatternOnChange = (
    event: any,
    type: string
  ) => {
    // type from/to iindicates te year month week etc
    if (type === "from" && filterFieldData.current?.relativeCondition) {
      filterFieldData.current.relativeCondition.from[2] = event.target.value;
    } else if (type === "to" && filterFieldData.current?.relativeCondition) {
      filterFieldData.current.relativeCondition.to[2] = event.target.value;
    } else if (
      type === "anchorDate" &&
      filterFieldData.current?.relativeCondition
    ) {
      filterFieldData.current.relativeCondition.anchorDate = event.target.value;
    } else if (
      // type value_from /value_to denotes the  number field in relaive filter
      type === "value_from" &&
      filterFieldData.current?.relativeCondition
    ) {
      filterFieldData.current.relativeCondition.from[1] = event.target.value;
    } else if (
      type === "value_to" &&
      filterFieldData.current?.relativeCondition
    ) {
      filterFieldData.current.relativeCondition.to[1] = event.target.value;
    } else if (
      type === "last_current_next_to" &&
      filterFieldData.current?.relativeCondition
    ) {
      filterFieldData.current.relativeCondition.to[0] = event.target.value;
    } else if (
      type === "last_current_next_from" &&
      filterFieldData.current?.relativeCondition
    ) {
      filterFieldData.current.relativeCondition.from[0] = event.target.value;
    }
    setAnchorDate(filterFieldData.current.relativeCondition?.anchorDate || "");
    getFormatedDate();
    setDataSetFilterArray((prevFilters) =>
      prevFilters.map((filter) =>
        filter.uid === filterFieldData.current.uid
          ? filterFieldData.current
          : filter
      )
    );
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
            handleDropDownForPatternOnChange(e);
          }}
          // value={filterFieldData.current.operator}
          value={searchCondition}
        >
          {items.map((item: any) => {
            return (
              <MenuItem
                key={item.key}
                value={item.key}
                selected={item.key === filterFieldData.current.operator}
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
  const DropDownForRelativePattern = ({
    items,
    exprType = "exprType",
  }: any) => {
    const slectDropDownRelativeFilter = (value: string): boolean => {
      if (filterFieldData.current.relativeCondition) {
        if (
          exprType === "from" &&
          filterFieldData.current.relativeCondition.from[2] === value
        ) {
          return true;
        }
        if (
          exprType === "to" &&
          filterFieldData.current.relativeCondition.to[2] === value
        ) {
          return true;
        }
        if (
          exprType === "anchorDate" &&
          filterFieldData.current.relativeCondition.anchorDate === value
        ) {
          return true;
        }
        if (
          exprType === "value_from" &&
          filterFieldData.current.relativeCondition.from[1] === value
        ) {
          return true;
        }
        if (
          exprType === "value_to" &&
          filterFieldData.current.relativeCondition.to[1] === value
        ) {
          return true;
        }
        if (
          exprType === "last_current_next_to" &&
          filterFieldData.current.relativeCondition.to[0] === value
        ) {
          return true;
        }
        if (
          exprType === "last_current_next_from" &&
          filterFieldData.current.relativeCondition.from[0] === value
        ) {
          return true;
        }
      }
      return false;
    };
    const getValue = (type: string): string => {
      if (filterFieldData.current.relativeCondition) {
        if (type === "from") {
          return filterFieldData.current.relativeCondition.from[2];
        }
        if (type === "to") {
          return filterFieldData.current.relativeCondition.to[2];
        }
        if (type === "anchorDate") {
          return filterFieldData.current.relativeCondition.anchorDate;
        }
        if (type === "value_from") {
          return filterFieldData.current.relativeCondition.from[1];
        }
        if (type === "value_to") {
          return filterFieldData.current.relativeCondition.to[1];
        }
        if (type === "last_current_next_to") {
          return filterFieldData.current.relativeCondition.to[0];
        }
        if (type === "last_current_next_from") {
          return filterFieldData.current.relativeCondition.from[0];
        }
      }
      return "";
    };
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
            handleDropDownForRelativePatternOnChange(e, exprType);
          }}
          // value={filterFieldData.current.operator}
          value={getValue(exprType)}
        >
          {items.map((item: any) => {
            return (
              <MenuItem
                key={item.key}
                value={item.key}
                selected={slectDropDownRelativeFilter(item.key)}
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
  const handleCBChange = (event: any) => {
    if (event.target.name.toString() === "(All)") {
      if (event.target.checked) {
        filterFieldData.current = {
          ...JSON.parse(JSON.stringify(filterFieldData.current)),
          userSelection: [
            ...picklist.allOptions.filter((item: any) => item !== "(All)"),
          ],
        };
        setPickList((prev: any) => ({
          ...prev,
          userSelection: [...prev.allOptions],
        }));
      } else {
        setPickList((prev: any) => ({
          ...prev,
          userSelection: [],
        }));
        filterFieldData.current = {
          ...JSON.parse(JSON.stringify(filterFieldData.current)),
          userSelection: [],
        };
      }
    } else {
      if (event.target.checked) {
        // if (!isNaN(event.target.name) && isFinite(event.target.name)) {
        //   let _name = event.target.name;

        //   if (_name.includes(".")) {
        //     _name = parseFloat(event.target.name);
        //   } else {
        //     _name = parseInt(event.target.name);
        //   }

        //   if (_name) {
        //     // filterFieldData.userSelection.push(_name);
        //     setPickList((prev) => {
        //       const newSelection = [...prev.userSelection, _name];
        //       return {
        //         ...prev,
        //         userSelection: newSelection,
        //       };
        //     });
        //     const newSelection = [
        //       ...filterFieldData.current.userSelection,
        //       _name,
        //     ];
        //     filterFieldData.current = {
        //       ...JSON.parse(JSON.stringify(filterFieldData.current)),
        //       userSelection: newSelection,
        //     };
        //     // setFilterFieldData((prev: any) => ({
        //     //   ...prev, // Spread the previous state to keep all existing fields
        //     //   userSelection: [...prev.userSelection, _name], // Push the new name into the userSelection array
        //     // }));
        //   }
        // } else {
        //   // filterFieldData.userSelection.push(event.target.name);
        //   setPickList((prev) => {
        //     const newSelection = [...prev.userSelection, event.target.name];
        //     return {
        //       ...prev,
        //       userSelection: newSelection,
        //     };
        //   });
        //   const newSelection = [
        //     ...filterFieldData.current.userSelection,
        //     event.target.name,
        //   ];
        //   filterFieldData.current = {
        //     ...JSON.parse(JSON.stringify(filterFieldData.current)),
        //     userSelection: newSelection,
        //   };
        //   // setFilterFieldData((prev: any) => ({
        //   //   ...prev, // Spread the previous state to keep all existing fields
        //   //   userSelection: [...prev.userSelection, event.target.name], // Push the new name into the userSelection array
        //   // }));
        // }
        const newSelection = [
          ...filterFieldData.current.userSelection,
          event.target.name==="null"?null:event.target.name,
        ];
        console.log("newSelection",newSelection)
        filterFieldData.current = {
          ...JSON.parse(JSON.stringify(filterFieldData.current)),
          userSelection: newSelection,
        };
        if (newSelection.length === picklist.allOptions.length - 1) {
          setPickList((prev: any) => {
            return {
              ...prev,
              userSelection: ["(All)", ...newSelection],
            };
          });
        } else {
          setPickList((prev: any) => {
            return {
              ...prev,
              userSelection: [...newSelection],
            };
          });
        }
      } else {
        const valueToBeRemoved=event.target.name==="Null"?null:['decimal','integer','float'].includes(filter.dataType)?Number(event.target.name):event.target.name
        
        let newSelection = filterFieldData.current.userSelection.filter(
          (item: any) => item !== valueToBeRemoved
        );

        filterFieldData.current = {
          ...JSON.parse(JSON.stringify(filterFieldData.current)),
          userSelection: newSelection,
        };
        setPickList((prev: any) => {
          return {
            ...prev,
            userSelection:  [...newSelection],
          };
        });
      }
    }
    setDataSetFilterArray((prevFilters) =>
      prevFilters.map((filter) =>
        filter.uid === filterFieldData.current.uid
          ? filterFieldData.current
          : filter
      )
    );
  };
  const SelecTillDate = () => {
    let labelTillDate;
    if (filterFieldData.current.filterType === "searchCondition") {
      labelTillDate = datePatternSearchConditionCollections.find(
        (item) => item.key === filterFieldData.current.timeGrain
      );
    }
    // if (filterFieldData.current.filterType === "relativeFilter") {
    //   labelTillDate = datePatternRelativeFilterCollections.find(
    //     (item) => item.key === filterFieldData.current.timeGrain
    //   );
    // }

    let labelName = labelTillDate ? labelTillDate.value : null;
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
        <FormControlLabel
          value="end"
          control={
            <GreenSwitch
              checked={isTillDate}
              size="small"
              disabled={filterFieldData.current.userSelection.length < 2}
              onChange={(e) => handleChangeTillDate(e)}
            />
          }
          label={
            <Typography
              sx={
                filterFieldData.current.isTillDate &&
                filterFieldData.current.shouldExclude
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
      </FormGroup>
    );
  };

  const handleChangeTillDate = (e: any) => {
    if (e.target.checked) {
      filterFieldData.current.isTillDate = true;
      setIsTillDate(true)
    } else {
      filterFieldData.current.isTillDate = false;
      setIsTillDate(false)
    }
    setDataSetFilterArray((prevFilters) =>
      prevFilters.map((filter) =>
        filter.uid === filterFieldData.current.uid
          ? filterFieldData.current
          : filter
      )
    );
  };
  const CustomCard = () => {
    let members = null;
    if (filterFieldData.current.dataType) {
      switch (filter.dataType) {
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
            onClick={() => handleDelete(filter.uid)}
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
            {filter.fieldName}
          </span>
        </div>
        {/* More options icon */}
        <div style={{ display: "flex" }}>
          <button
            style={{
              backgroundColor: "white",
              outline: "none",
              border: "none",
            }}
            onClick={(event) => handleMenuClick(event, filter.uid)}
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
        {isMenuOpen && menuId === filter.uid && (
          <MenuOption
            open={isMenuOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            filterFieldData={filterFieldData}
            uid={filter.uid}
          />
        )}
      </div>
      {/* Conditional rendering based on isCollapsed */}
      {/* {loading ? <LoadingPopover /> : null} */}
      {!isCollapsed ? (
        <div
          className="UserSelectionDiv"
          style={
            inValidValueError
              ? { border: "2px red solid", backgroundColor: "lightpink" }
              : {}
          }
        >
          {filterFieldData.current.dataType === "timestamp" ||
          filterFieldData.current.dataType === "date" ? (
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
              {filterFieldData.current.filterType === "pickList" ? (
                <DropDownForDatePattern items={datePatternCollections} />
              ) : filterFieldData.current.filterType === "searchCondition" ? (
                <DropDownForDatePattern
                  items={datePatternSearchConditionCollections}
                />
              ) : null}
            </div>
          ) : null}

          {filterFieldData.current.filterType === "pickList" ? (
            <>
              <SelecPickListCard />
              {filterFieldData.current.dataType === "timestamp" ||
          filterFieldData.current.dataType === "date" ?(<SelecTillDate/>):null}
            </>
          ) : filterFieldData.current.filterType === "searchCondition" ? (
            <>
              <CustomCard />
              {(filterFieldData.current.dataType === "timestamp" ||
                filterFieldData.current.dataType === "date") &&
              filterFieldData.current.operator === "between" ? (
                <SelecTillDate />
              ) : null}
            </>
          ) : (
            <>
              <SelecRelativeFilterCard />
              {/* <SelecTillDate /> */}
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
