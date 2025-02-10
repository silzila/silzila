import React, { useEffect, useRef, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { parseISO } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";
import { alpha, styled } from "@mui/material/styles";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DropDownForPatternForNumber from "../../../Common/DropDownForPattern";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  FormControl,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { connect } from "react-redux";
import Radio from "@mui/material/Radio";
import {
  deleteSourceFromFlow,
  deleteSourceV2,
  updateConditionFilter,
  updateSearchConditionFilter,
  updateTimeGrain,
} from "../../../../redux/Calculations/CalculationsActions";
import {
  IEvaluationCondition,
  IEvaluationMetrics,
  IField,
} from "./EvaluationInterface";
import { format } from "date-fns";
import { PatternCollectionType } from "../../../ChartFieldFilter/UserFilterCardInterface";
import FetchData from "../../../ServerCall/FetchData";
import { IRelativeCondition } from "../../../DataSet/BottomBarInterfaces";
import Switch from "@mui/material/Switch";
import { getSQLDataType } from "../../../CommonFunctions/CommonFunctions";
import { equal } from "node:assert";
import { fontSize, palette } from "../../../..";
const EvaluationCard = ({
  evaluation,
  evaluationType,
  propKey,
  filterIdx,
  lastDroppedEvaluationUid,

  // state
  calculations,
  tabTileProps,
  chartProp,
  token,

  //dispatches
  deleteSourceFromFlow,
  updateSearchConditionFilter,
  updateTimeGrain,
  updateConditionFilter,
  deleteSourceV2,
}: {
  propKey: string;
  evaluation: IEvaluationCondition;
  evaluationType: string;
  filterIdx: number;
  lastDroppedEvaluationUid: string | null;
  calculations?: any;
  tabTileProps?: any;
  chartProp?: any;
  token: string;
  deleteSourceFromFlow: (
    calculationFlowUID: string,
    sourceUID: string,
    propKey: string,
    sourceIndex: number
  ) => void;
  updateSearchConditionFilter: (
    propKey: string,
    conditionFilterUid: string,
    sourceUid: string,
    shouldExclude: boolean
  ) => void;
  updateTimeGrain: (
    propKey: string,
    conditionFilterUid: string,
    filterIdx: number,
    timeGrain: string
  ) => void;
  updateConditionFilter: (
    propKey: string,
    conditionFilterUid: string,
    sourceUid: string,
    conditionFilter: {
      rightOperand: (string | number | null)[];
      rightOperandType: string[];
      operator: string;
      shouldExclude: boolean;
      isTillDate: boolean;
      timeGrain: string;
      relativeCondition: IRelativeCondition | null;
      filterType: string;
      isValid: boolean;
    },
    filterIdx: number
  ) => void;
  deleteSourceV2: (
    calculationFlowUID: string,
    sourceUID: string,
    propKey: string,
    sourceIndex: number,
    filterIdx: number
  ) => void;
}) => {
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
    { key: "greaterThan", 
    value: ">  Greater than" },
    { key: "lessThan", 
    value: "<  Less than" },
    { key: "greaterThanOrEqualTo", 
    value: ">= Greater than or Equal to" },
    { key: "lessThanOrEqualTo", 
    value: "<= Less than or Equal to" },
    { key: "equalTo",
    value: "=  Equal to" },
    { key: "notEqualTo", 
    value: "<> Not Equal to" },
    { key: "between", 
    value: ">= Between <=" },
    { key: "blank", 
    value: "   (Blank)" },
  ];

  const RelativeFilterPatternCollections: PatternCollectionType[] = [
    { key: "last", value: "Last" },
    { key: "current", value: "Current" },
    { key: "next", value: "Next" },
  ];
  const [loading, setLoading] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString()
  );
  const [selectedDateTwo, setSelectedDateTWo] = useState<string>(
    new Date().toISOString()
  );
  // const ref1 = useRef<HTMLInputElement | null>(null);
  // const ref2 = useRef<HTMLInputElement | null>(null);
  // const ref3 = useRef<HTMLInputElement | null>(null);
  // const ref4 = useRef<HTMLInputElement | null>(null);
  // const ref5 = useRef<HTMLInputElement | null>(null);
  const currentCalculationSession =
    calculations.properties[propKey].currentCalculationSession;
  const activeFlow = currentCalculationSession.activeFlow;
  const activeConditonIndex = currentCalculationSession.activeCondition;
  // const open = Boolean(anchorEl);

  const conditionTypeElse =
    currentCalculationSession.calculationInfo.flows[activeFlow][
      activeConditonIndex
    ].condition === "Else";
  const conditionFilterUid: string =
    currentCalculationSession.calculationInfo.flows[activeFlow][
      activeConditonIndex
    ].filter;
  const conditionFilter: IEvaluationCondition[] =
    currentCalculationSession.calculationInfo.conditionFilters[
      conditionFilterUid
    ][0].conditions;

  const condition = conditionFilter[filterIdx];
  const [selectedFilterType, setSelectedFilterType] = useState<string>(
    condition.filterType
  );
  

  const [Collapse, setCollapse] = useState<boolean>(false);
  const [focusInput, setFocusInput] = useState<boolean>(
    () => lastDroppedEvaluationUid === evaluation.conditionUID
  );
  const evaluationSourceDetails: IField =
    evaluationType === "field"
      ? currentCalculationSession.calculationInfo.fields[
          evaluation.leftOperand[0] as string
        ]
      : {
          displayName: "",
          dataType: "text",
          tableId: "pos",
          fieldName: "",
        };
  const _evaluationData = useRef<IEvaluationMetrics | null>(
    // evaluationType === "field"
    //   ? {
    //       displayName: field.displayName,
    //       dataType: field.dataType,
    //       shouldExclude: condition.shouldExclude || false,
    //       operator: condition.operator ?? "in",
    //       selection: condition.rightOperand ?? [],
    //       allOptions: [],
    //       isTillDate: condition.isTillDate ?? false,
    //       timeGrain: condition.timeGrain ?? "year",
    //       isCollapsed: false,
    //       relativeCondition: condition.relativeCondition ?? null,
    //       filterType: condition.filterType,
    //     }
    //   : {
    //       displayName: "Sample Filter",
    //       dataType: "text",
    //       shouldExclude: false,
    //       operator: "contains",
    //       selection: ["example", null, 42],
    //       allOptions: ["option1", "option2", null, 100],
    //       isTillDate: true,
    //       timeGrain: "month",
    //       isCollapsed: false,
    //       relativeCondition: null,
    //       filterType: "picklist",
    //     }
    null
  );
  const [initialMount, setInitialMount] = useState<boolean>(true);
  const [formatedDate, setFormatedDate] = useState({
    from: "",
    to: "",
  });
  const [anyInputOnFocus, setAnyInputOnFocus] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (evaluationType === "field") {
      _evaluationData.current = {
        displayName: evaluationSourceDetails.displayName,
        dataType: evaluationSourceDetails.dataType,
        shouldExclude: evaluation.shouldExclude || false,
        operator: evaluation.operator ?? "in",
        selection: evaluation.rightOperand ?? [],
        allOptions: [],
        isTillDate: evaluation.isTillDate ?? false,
        timeGrain: evaluation.timeGrain ?? "year",
        isCollapsed: false,
        relativeCondition: evaluation.relativeCondition ?? null,
        filterType: evaluation.filterType,
        isValid: evaluation.isValid,
      };
      setSelectedFilterType(_evaluationData.current.filterType);
    }
    if (!_evaluationData.current) return;
    if (_evaluationData.current?.filterType === "Pick List") {
      (async () => {
        if (!_evaluationData.current) return;
        let payload: any = {
          tableId: evaluationSourceDetails.tableId,
          fieldName: _evaluationData.current.displayName,
          dataType: _evaluationData.current.dataType,
          filterOption: "allValues",
        };
        if (
          _evaluationData.current.dataType === "timestamp" ||
          _evaluationData.current.dataType === "date"
        ) {
          payload.timeGrain = "year";
        }
        try {
          setLoading(true);
          const res = await FetchData({
            requestType: "withData",
            method: "POST",
            url: `filter-options?dbconnectionid=${chartProp.properties[propKey].selectedDs.connectionId}&datasetid=${chartProp.properties[propKey].selectedDs.id}&workspaceId=${chartProp.properties[propKey].selectedDs.workSpaceId}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            data: payload,
          });
          if (!res.status) throw new Error("Error in fetching data");
          const data = [
            "(All)",
            ...res.data
              .map((item: any) => item[Object.keys(res.data[0])[0]])
              .map((item: any) => {
                return item;
              }),
          ];
          _evaluationData.current.allOptions = data;
          _evaluationData.current.selection =
            _evaluationData.current.selection?.length > 0
              ? _evaluationData.current.selection
              : data.filter((item: any) => item !== "(All)");
        } catch (error) {
          console.log(error);
        } finally {
          updateConditionFilter(
            propKey,
            conditionFilterUid,
            "",
            {
              filterType: "Pick List",
              rightOperand: _evaluationData.current.selection,
              rightOperandType: _evaluationData.current.selection.map(
                (item: any) => getSQLDataType(item)
              ),
              operator: _evaluationData.current.operator,
              shouldExclude: _evaluationData.current.shouldExclude,
              isTillDate: _evaluationData.current.isTillDate,
              timeGrain: _evaluationData.current.timeGrain,
              relativeCondition: _evaluationData.current.relativeCondition,
              isValid: _evaluationData.current.isValid,
            },
            filterIdx
          );

          setLoading(false);
          setSelectedFilterType("Pick List");
        }
      })();
    } else if (_evaluationData.current?.filterType === "Relative Filter") {
      if (
        _evaluationData.current.dataType === "date" ||
        _evaluationData.current.dataType === "timestamp"
      ) {
        _evaluationData.current.timeGrain = "date";
        if (
          _evaluationData.current.relativeCondition &&
          !["today", "yesterday", "tomorrow", "columnMaxDate"].includes(
            _evaluationData.current.relativeCondition.anchorDate
          )
        ) {
          _evaluationData.current.selection[0] =
            _evaluationData.current.relativeCondition.anchorDate;
        }
        _evaluationData.current.relativeCondition = _evaluationData.current
          .relativeCondition
          ? {
              from: _evaluationData.current.relativeCondition.from,
              to: _evaluationData.current.relativeCondition.to,
              anchorDate: ![
                "today",
                "yesterday",
                "tomorrow",
                "columnMaxDate",
              ].includes(_evaluationData.current.relativeCondition.anchorDate)
                ? "specificDate"
                : _evaluationData.current.relativeCondition.anchorDate,
            }
          : {
              from: ["last", "1", "year"],
              to: ["next", "1", "year"],
              anchorDate: "today",
            };
        getFormattedDate();
        _evaluationData.current.isValid = isValid();
        updateConditionFilter(
          propKey,
          conditionFilterUid,
          "",
          {
            filterType: "Relative Filter",
            rightOperand: _evaluationData.current.selection,
            rightOperandType: _evaluationData.current.selection.map(
              (item: any) => getSQLDataType(item)
            ),
            operator: _evaluationData.current.operator,
            shouldExclude: _evaluationData.current.shouldExclude,
            isTillDate: _evaluationData.current.isTillDate,
            timeGrain: _evaluationData.current.timeGrain,
            relativeCondition: _evaluationData.current.relativeCondition,
            isValid: _evaluationData.current.isValid,
          },
          filterIdx
        );
        setSelectedFilterType("Relative Filter");
      }
    } else {
      if (_evaluationData.current.timeGrain === "date") {
        setSelectedDate(_evaluationData.current.selection[0] as string);
        if (_evaluationData.current.operator === "between") {
          setSelectedDateTWo(_evaluationData.current.selection[1] as string);
        }
      }
      _evaluationData.current.isValid = isValid();
      updateConditionFilter(
        propKey,
        conditionFilterUid,
        "",
        {
          filterType: "Search Condition",
          rightOperand: _evaluationData.current.selection,
          rightOperandType: _evaluationData.current.selection.map((item: any) =>
            getSQLDataType(item)
          ),
          operator: _evaluationData.current.operator,
          shouldExclude: _evaluationData.current.shouldExclude,
          isTillDate: _evaluationData.current.isTillDate,
          timeGrain: _evaluationData.current.timeGrain,
          relativeCondition: _evaluationData.current.relativeCondition,
          isValid: isValid(),
        },
        filterIdx
      );
      setSelectedFilterType("Search Condition");
    }
  }, []);

  useEffect(() => {
    const focus = () => {
      if (ref.current) {
        if (focusInput && initialMount){
          setAnyInputOnFocus(true);
          setTimeout(()=>{
            ref.current?.focus();
          },100)
        }
          
      } else {
        setTimeout(focus, 100);
      }
    };
    focus();
  }, [focusInput, selectedFilterType,initialMount]);

  
  /**
   *
   * Functions
   */

  function isValid(): boolean {
    if (!_evaluationData.current) return false;
    if (_evaluationData.current.filterType === "Pick List") return true;
    if (["null", "undefined", "NaN","",null,undefined].some(value => evaluation.leftOperandType.includes(value!))) 
      return false;
  
    else if (_evaluationData.current.filterType === "Search Condition") {
      if(_evaluationData.current.operator === "blank") return true;
      if (_evaluationData.current.selection.length === 0) return false;
      if(_evaluationData.current.selection[0]===""||_evaluationData.current.selection[1]==="") return false;
      if(equalPatternCollections.some(collection => collection.key === _evaluationData.current?.operator) && _evaluationData.current.selection.includes("NaN")) return false;
      if (
        _evaluationData.current.operator === "between" &&
        _evaluationData.current.selection.length < 2
      )
        return false;
      if (
        _evaluationData.current &&
        _evaluationData.current.operator === "between" &&
        ![
          "CHAR",
          "VARCHAR",
          "TEXT",
          "STRING",
          "BOOLEAN",
          "BOOL",
          "DATE",
          "DATETIME",
          "TIMESTAMP",
        ].includes(_evaluationData.current.dataType.toUpperCase()) &&
        _evaluationData.current.selection[0] !== null &&
        _evaluationData.current.selection[1] !== null &&
        _evaluationData.current.selection[0] >
          _evaluationData.current.selection[1]
      ) {
        return false;
      }
      if (
        ["DATE", "DATETIME", "TIMESTAMP"].includes(
          _evaluationData.current.dataType.toUpperCase()
        )
      ) {
        if (
          _evaluationData.current.operator === "between" &&
          new Date(_evaluationData.current.selection[0] as string) >
            new Date(_evaluationData.current.selection[1] as string)
        )
          return false;
      }
    } else {
      if (!_evaluationData.current.relativeCondition) return false;
      if (
        _evaluationData.current.relativeCondition.anchorDate ===
          "specificDate" &&
        (_evaluationData.current.selection.length === 0 ||
          _evaluationData.current.selection[0] === null)
      )
        return false;
      if (new Date(formatedDate.from) > new Date(formatedDate.to)) return false;
    }
    return true;
  }
  /**
   *
   * @param obj
   * @returns object with keys in lowercase
   */
  function convertKeysToLowercase<T extends Record<string, any>>(
    obj: T
  ): Record<string, any> {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key.toLowerCase()] = obj[key];
      return acc;
    }, {} as Record<string, any>);
  }
  /**
   *
   * @param date
   * @returns date as a strring in yyyy-mm-dd format
   */
  const formatDateToYYYYMMDD = (date: any): string => {
    let formated = format(new Date(date), "yyyy-MM-dd");

    return formated;
  };
  /**
   * based on the values of the relative filter we get the formatted date from the server  to show the user
   * about the date range (from date to date)
   */
  const getFormattedDate = async () => {
    if (!_evaluationData.current) return;
    let body = {
      filterTable: {
        tableId: evaluationSourceDetails.tableId,
        displayName: `${_evaluationData.current.timeGrain} of ${evaluationSourceDetails.fieldName}`,
        fieldName: evaluationSourceDetails.fieldName,
        dataType: _evaluationData.current.dataType,
        timeGrain: _evaluationData.current.timeGrain,
      },
      from: _evaluationData.current.relativeCondition?.from,

      to: _evaluationData.current.relativeCondition?.to,
      /**
       * anchorDate can be today,yesterday,tommorow,columnMaxDate,specificDate
       * for specificDate we need to pass the date in yyyy-mm-dd format
       *
       */
      anchorDate:
        _evaluationData.current.relativeCondition?.anchorDate === "specificDate"
          ? _evaluationData.current.selection[0]
          : _evaluationData.current.relativeCondition?.anchorDate,
    };
    let url = `relative-filter?dbconnectionid=${chartProp.properties[propKey].selectedDs.connectionId}&workspaceId=${chartProp.properties[propKey].selectedDs.workSpaceId}&datasetid=${chartProp.properties[propKey].selectedDs.id}`;
    setLoading(true);
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
      const modifiedRes = convertKeysToLowercase(res.data[0]);
      setFormatedDate({
        from: modifiedRes["fromdate"],
        to: modifiedRes["todate"],
      });
    }
    setLoading(false);
  };
  /**
   *
   * @param timeGrain ? based on the timeGrain we get the picklist values
   *  initate the picklist values and set the enviorment for picklist
   */
  const initialPickList = async (timeGrain?: string) => {
    if (!_evaluationData.current) return;
    let payload: any = {
      tableId: evaluationSourceDetails.tableId,
      fieldName: _evaluationData.current.displayName,
      dataType: _evaluationData.current.dataType,
      filterOption: "allValues",
    };
    if (
      _evaluationData.current.dataType === "timestamp" ||
      _evaluationData.current.dataType === "date"
    ) {
      payload.timeGrain =
        timeGrain ?? _evaluationData.current.timeGrain ?? "year";
    }
    try {
      setLoading(true);
      const res = await FetchData({
        requestType: "withData",
        method: "POST",
        url: `filter-options?dbconnectionid=${chartProp.properties[propKey].selectedDs.connectionId}&datasetid=${chartProp.properties[propKey].selectedDs.id}&workspaceId=${chartProp.properties[propKey].selectedDs.workSpaceId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: payload,
      });
      if (!res.status) throw new Error("Error in fetching data");
      const data = [
        "(All)",
        ...res.data
          .map((item: any) => item[Object.keys(res.data[0])[0]])
          .map((item: any) => {
            return item;
          }),
      ];
      _evaluationData.current.allOptions = data;
      _evaluationData.current.selection = data.filter(
        (item: any) => item !== "(All)"
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setSelectedFilterType("Pick List");
      _evaluationData.current.isValid = isValid();
      updateConditionFilter(
        propKey,
        conditionFilterUid,
        "",
        {
          filterType: "Pick List",
          rightOperand: _evaluationData.current.selection,
          rightOperandType: _evaluationData.current.selection.map((item: any) =>
            getSQLDataType(item)
          ),
          operator: _evaluationData.current.operator,
          shouldExclude: _evaluationData.current.shouldExclude,
          isTillDate: _evaluationData.current.isTillDate,
          timeGrain: _evaluationData.current.timeGrain,
          relativeCondition: _evaluationData.current.relativeCondition,
          isValid: isValid(),
        },
        filterIdx
      );
    }
  };

  const TillDateSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-thumb": {
      width: 20,
      height: 20,
      minWidth: 20, // Ensures the thumb remains circular
      minHeight: 20, // Ensures the thumb remains circular
      borderRadius: "50%",
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#2bb9bb",
      "&:hover": {
        backgroundColor: alpha("#2bb9bb", theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#2",
    },
  }));

  const TillDate = () => {
    if (_evaluationData.current === null) return null;

    let labelTillDate = datePatternCollections.find(
      (item) => item.key === _evaluationData.current?.timeGrain
    );

    let labelName = labelTillDate ? labelTillDate.value : null;

    if (labelName === "Year Quarter") {
      labelName = "Quarter";
    } else if (labelName === "Year Month") {
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
            <TillDateSwitch
              checked={_evaluationData.current.isTillDate}
              onChange={(e) => {
                if (!_evaluationData.current) return;
                _evaluationData.current.isTillDate = e.target.checked;
                _evaluationData.current.isValid = isValid();
                updateConditionFilter(
                  propKey,
                  conditionFilterUid,
                  "",
                  {
                    filterType: _evaluationData.current.filterType,
                    rightOperand: _evaluationData.current.selection,
                    rightOperandType: _evaluationData.current.selection.map(
                      (item: any) => getSQLDataType(item)
                    ),
                    operator: _evaluationData.current.operator,
                    shouldExclude: _evaluationData.current.shouldExclude,
                    isTillDate: _evaluationData.current.isTillDate,
                    timeGrain: _evaluationData.current.timeGrain,
                    relativeCondition:
                      _evaluationData.current.relativeCondition,
                    isValid: isValid(),
                  },
                  filterIdx
                );
              }}
            />
          }
          label={
            <Typography
              sx={
                _evaluationData.current.isTillDate &&
                _evaluationData.current.shouldExclude
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

  /**
   *
   * @param e event
   * @param exprType can be "from" or "to" or "anchorDate" or "searchCondition"
   * if exprType is "from" or "to" or "anchorDate" we update the relative filter accordingly
   * if exprType is "searchCondition" we update the operator  and if the current timeGrain is date update the selection accordiungly
   */
  const handleDropDownForPatternOnChange = (e: any, exprType: string) => {
    if (!_evaluationData.current) return;
    if (exprType === "from" && _evaluationData.current?.relativeCondition) {
      _evaluationData.current.relativeCondition.from[2] = e.target.value;
    } else if (
      exprType === "to" &&
      _evaluationData.current?.relativeCondition
    ) {
      _evaluationData.current.relativeCondition.to[2] = e.target.value;
    } else if (
      exprType === "anchorDate" &&
      _evaluationData.current?.relativeCondition
    ) {
      _evaluationData.current.relativeCondition.anchorDate = e.target.value;
    } else if (exprType === "searchCondition") {
      _evaluationData.current.operator = e.target.value;
      if (_evaluationData.current.timeGrain === "date") {
        _evaluationData.current.selection = [
          formatDateToYYYYMMDD(selectedDate),
        ];
        if (_evaluationData.current.operator === "between") {
          _evaluationData.current.selection[1] =
            formatDateToYYYYMMDD(selectedDateTwo);
        }
      } else _evaluationData.current.selection = [];
    }
    if (["from", "to", "anchorDate"].includes(exprType)) getFormattedDate();
    _evaluationData.current.isValid = isValid();
    updateConditionFilter(
      propKey,
      conditionFilterUid,
      "",
      {
        isValid: isValid(),
        filterType: _evaluationData.current.filterType,
        rightOperand:
          exprType !== "searchCondition"
            ? []
            : _evaluationData.current.selection,
        rightOperandType:
          exprType !== "searchCondition"
            ? []
            : _evaluationData.current.selection.map((item: any) =>
                getSQLDataType(item)
              ),
        operator: _evaluationData.current.operator,
        shouldExclude: _evaluationData.current.shouldExclude,
        isTillDate: _evaluationData.current.isTillDate,
        timeGrain: _evaluationData.current.timeGrain,
        relativeCondition:
          exprType !== "searchCondition"
            ? _evaluationData.current.relativeCondition?.anchorDate ===
              "specificDate"
              ? {
                  from: _evaluationData.current.relativeCondition?.from,
                  to: _evaluationData.current.relativeCondition?.to,
                  anchorDate: _evaluationData.current.selection[0]! as string, // anchorDate is of type string but selection is of type  (string | number | null)[]
                }
              : _evaluationData.current.relativeCondition
            : null,
      },
      filterIdx
    );
  };
  /**
   *
   * @param event
   * updaet selection option for pickList
   */
  const handleCBChange = (event: any) => {
    if (!_evaluationData.current) return;
    if (event.target.name.toString() === "(All)") {
      if (event.target.checked) {
        _evaluationData.current.selection =
          _evaluationData.current.allOptions.filter(
            (item: any) => item !== "(All)"
          );
      } else {
        _evaluationData.current.selection = [];
      }
    } else {
      if (event.target.checked) {
        let _name: string | number | null;

        if (event.target.name === "(Blank)" || event.target.name === "") {
          _name = null;
        } else {
          // Attempt to convert to a number
          const parsedNumber = Number(event.target.name);
          _name = isNaN(parsedNumber) ? event.target.name : parsedNumber;
        }
        _evaluationData.current.selection.push(_name);
      } else {
        _evaluationData.current.selection =
          _evaluationData.current.selection.filter((item: any) => {
            const targetName =
              event.target.name === "(Blank)"
                ? null
                : !isNaN(Number(event.target.name))
                ? Number(event.target.name)
                : event.target.name;
            return item !== targetName;
          });
      }
    }
    _evaluationData.current.isValid = isValid();
    updateConditionFilter(
      propKey,
      conditionFilterUid,
      "",
      {
        filterType: "Pick List",
        rightOperand: _evaluationData.current.selection,
        rightOperandType: _evaluationData.current.selection.map((item: any) =>
          getSQLDataType(item)
        ),
        operator: _evaluationData.current.operator,
        shouldExclude: _evaluationData.current.shouldExclude,
        isTillDate: _evaluationData.current.isTillDate,
        timeGrain: _evaluationData.current.timeGrain,
        relativeCondition: _evaluationData.current.relativeCondition,
        isValid: isValid(),
      },
      filterIdx
    );
  };
  const handleDropDownForDatePatternOnChange = (e: any) => {
    if (!_evaluationData.current) return;
    if (selectedFilterType === "Pick List") {
      _evaluationData.current.timeGrain = e.target.value;
      updateTimeGrain(propKey, conditionFilterUid, filterIdx, e.target.value);
      initialPickList(e.target.value);
    } else if (selectedFilterType === "Search Condition") {
      _evaluationData.current.timeGrain = e.target.value;
      if (e.target.value === "date") {
        _evaluationData.current.selection[0] =
          formatDateToYYYYMMDD(selectedDate);
        if (_evaluationData.current.operator === "between") {
          _evaluationData.current.selection[1] =
            formatDateToYYYYMMDD(selectedDateTwo);
        }
      }
      _evaluationData.current.isValid = isValid();
      updateConditionFilter(
        propKey,
        conditionFilterUid,
        "",
        {
          filterType: _evaluationData.current.filterType,
          rightOperand: _evaluationData.current.selection,
          rightOperandType: _evaluationData.current.selection.map((item: any) =>
            getSQLDataType(item)
          ),
          operator: _evaluationData.current.operator,
          shouldExclude: _evaluationData.current.shouldExclude,
          isTillDate: _evaluationData.current.isTillDate,
          timeGrain: _evaluationData.current.timeGrain,
          relativeCondition: _evaluationData.current.relativeCondition,
          isValid: isValid(),
        },
        filterIdx
      );
    }
  };
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDropDownForRelativePatternOnChange = (
    event: any,
    type: string
  ) => {
    if (!_evaluationData.current) return;
    // type from/to iindicates te year month week etc
    if (type === "from" && _evaluationData.current?.relativeCondition) {
      _evaluationData.current.relativeCondition.from[2] = event.target.value;
    } else if (type === "to" && _evaluationData.current?.relativeCondition) {
      _evaluationData.current.relativeCondition.to[2] = event.target.value;
    } else if (
      type === "anchorDate" &&
      _evaluationData.current?.relativeCondition
    ) {
      _evaluationData.current.relativeCondition.anchorDate = event.target.value;
    } else if (
      // type value_from /value_to denotes the  number field in relaive filter
      type === "value_from" &&
      _evaluationData.current?.relativeCondition
    ) {
      _evaluationData.current.relativeCondition.from[1] = event.target.value;
    } else if (
      type === "value_to" &&
      _evaluationData.current?.relativeCondition
    ) {
      _evaluationData.current.relativeCondition.to[1] = event.target.value;
    } else if (
      type === "last_current_next_to" &&
      _evaluationData.current?.relativeCondition
    ) {
      _evaluationData.current.relativeCondition.to[0] = event.target.value;
    } else if (
      type === "last_current_next_from" &&
      _evaluationData.current?.relativeCondition
    ) {
      _evaluationData.current.relativeCondition.from[0] = event.target.value;
    }
    getFormattedDate();
    _evaluationData.current.isValid = isValid();
    updateConditionFilter(
      propKey,
      conditionFilterUid,
      "",
      {
        filterType: _evaluationData.current.filterType,
        rightOperand: [],
        rightOperandType: [],
        operator: _evaluationData.current.operator,
        shouldExclude: _evaluationData.current.shouldExclude,
        isTillDate: _evaluationData.current.isTillDate,
        timeGrain: _evaluationData.current.timeGrain,
        relativeCondition:
          _evaluationData.current.relativeCondition?.anchorDate ===
          "specificDate"
            ? {
                from: _evaluationData.current.relativeCondition?.from,
                to: _evaluationData.current.relativeCondition?.to,
                anchorDate: _evaluationData.current.selection[0]! as string, // anchorDate is of type string but selection is of type  (string | number | null)[]
              }
            : _evaluationData.current.relativeCondition,
        isValid: isValid(),
      },
      filterIdx
    );
  };
  const updateInputForRelativeFilter = (e: any, type: string) => {
    if (!_evaluationData.current) return;
    if (type === "value_from" && _evaluationData.current?.relativeCondition) {
      _evaluationData.current.relativeCondition.from[1] = e.target.value;
    } else if (
      type === "value_to" &&
      _evaluationData.current?.relativeCondition
    ) {
      _evaluationData.current.relativeCondition.to[1] = e.target.value;
    }
    getFormattedDate();
    _evaluationData.current.isValid = isValid();
    updateConditionFilter(
      propKey,
      conditionFilterUid,
      "",
      {
        filterType: _evaluationData.current.filterType,
        rightOperand: [],
        rightOperandType: [],
        operator: _evaluationData.current.operator,
        shouldExclude: _evaluationData.current.shouldExclude,
        isTillDate: _evaluationData.current.isTillDate,
        timeGrain: _evaluationData.current.timeGrain,
        relativeCondition:
          _evaluationData.current.relativeCondition?.anchorDate ===
          "specificDate"
            ? {
                from: _evaluationData.current.relativeCondition?.from,
                to: _evaluationData.current.relativeCondition?.to,
                anchorDate: _evaluationData.current.selection[0]! as string, // anchorDate is of type string but selection is of type  (string | number | null)[]
              }
            : _evaluationData.current.relativeCondition,
        isValid: isValid(),
      },
      filterIdx
    );
  };
  const getOperatior = (dataType: string): string => {
    if (["integer", "decimal", "float"].includes(dataType))
      return "greaterThan";
    else if (dataType === "text") return "contains";
    else if (dataType === "date" || dataType === "timestamp")
      return "greaterThan";
    return "greaterThan";
  };
  function convertToType(value: string, type: string) {
    switch (type.toLowerCase()) {
      case "number":
        return Number(value);

      case "text":
        return String(value);
      case "date":
        return formatDateToYYYYMMDD(value);
      default:
        throw new Error("Unsupported type");
    }
  }

  const handleCustomRequiredValueOnBlur = (
    value: any,
    dataTypeOfValue: string,
    type?: string
  ) => {
    if (!_evaluationData.current) return;
    const typedValue = convertToType(value, dataTypeOfValue);
    if (value === "") {
      _evaluationData.current.isValid = false;
      if (type === "lessThanOrEqualTo")
        _evaluationData.current.selection[1] = null;
    } else if (type === "greaterThanOrEqualTo") {
      _evaluationData.current.selection[0] = typedValue;
      if (dataTypeOfValue === "date") {
        setSelectedDate(typedValue as string);
      }
    } else if (type === "lessThanOrEqualTo") {
      _evaluationData.current.selection[1] = typedValue;
      if (dataTypeOfValue === "date") {
        setSelectedDateTWo(typedValue as string);
      }
    } else {
      _evaluationData.current.selection[0] = typedValue;
    }
    _evaluationData.current.isValid = isValid();
    updateConditionFilter(
      propKey,
      conditionFilterUid,
      "",
      {
        filterType: _evaluationData.current.filterType,
        rightOperand: _evaluationData.current.selection,
        rightOperandType: _evaluationData.current.selection.map((item: any) =>
          getSQLDataType(item)
        ),
        operator: _evaluationData.current.operator,
        shouldExclude: _evaluationData.current.shouldExclude,
        isTillDate: _evaluationData.current.isTillDate,
        timeGrain: _evaluationData.current.timeGrain,
        relativeCondition: null,
        isValid: isValid(),
      },
      filterIdx
    );
  };
  const handleClose = (area: string, option?: string) => {
    setAnchorEl(null);
    if (!_evaluationData.current) return;
    if (area === "filterType" && option) {
      /**
       * set initial conditions for picklist
       */
      setSelectedFilterType(option);
      if (option === "Pick List")
        initialPickList(_evaluationData.current.timeGrain);
      /**
       * set initial conditions for relative filter
       */ else if (option === "Relative Filter") {
        if (
          _evaluationData.current.dataType === "date" ||
          _evaluationData.current.dataType === "timestamp"
        ) {
          _evaluationData.current.relativeCondition = {
            from: ["last", "1", "year"],
            to: ["next", "1", "year"],
            anchorDate: "today",
          };
          getFormattedDate();
          _evaluationData.current.isValid = isValid();
          updateConditionFilter(
            propKey,
            conditionFilterUid,
            "",
            {
              filterType: _evaluationData.current.filterType,
              rightOperand: [],
              rightOperandType: [],
              operator: _evaluationData.current.operator,
              shouldExclude: _evaluationData.current.shouldExclude,
              isTillDate: _evaluationData.current.isTillDate,
              timeGrain: _evaluationData.current.timeGrain,
              relativeCondition: _evaluationData.current.relativeCondition,
              isValid: isValid(),
            },
            filterIdx
          );
        }
      } else {
        /**
         * set initial conditions for search condition
         */
        _evaluationData.current.selection = [];
        _evaluationData.current.allOptions = [];
        _evaluationData.current.relativeCondition = null;
        _evaluationData.current.operator = getOperatior(
          _evaluationData.current.dataType
        );
        _evaluationData.current.isValid = isValid();
        updateConditionFilter(
          propKey,
          conditionFilterUid,
          "",
          {
            filterType: _evaluationData.current.filterType,
            rightOperand: [],
            rightOperandType: [],
            operator: _evaluationData.current.operator,
            shouldExclude: _evaluationData.current.shouldExclude,
            isTillDate: _evaluationData.current.isTillDate,
            timeGrain: _evaluationData.current.timeGrain,
            relativeCondition: null,
            isValid: isValid(),
          },
          filterIdx
        );
        setInitialMount(true);
      }
    }
  }; /**tobe changed later */
  /**
   * Sub components
   */
  const SearchConditionCustomInputControl = ({ type }: { type: string }) => {
    if (!_evaluationData.current) return;
    return (
      <TextField
      fullWidth
        InputProps={
          _evaluationData.current.shouldExclude
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
        inputRef={(el) => {
          ref.current = el; // Assign the native input element to `ref`
        }}
        placeholder="Value"
        sx={{
          paddingBottom: "8px",
        }}
        // autoFocus={
        //   focusInput && initialMount
        // }
        
        // onFocus={() => setAnyInputOnFocus(true)}
        defaultValue={_evaluationData.current.selection[0]!}
        type={type}
        onBlur={(e) => {
          const value = e.target.value.trim(); // Trim any whitespace

          if (value === "") {
            _evaluationData.current!.isValid = false;
            _evaluationData.current!.selection =
              type === "text" ? [""] : ["NaN"];
            updateConditionFilter(
              propKey,
              conditionFilterUid,
              "",
              {
                filterType: _evaluationData.current!.filterType,
                rightOperand: type === "text" ? [""] : [null],
                rightOperandType: type === "text" ? ["text"] : ["integer"],
                operator: _evaluationData.current!.operator,
                shouldExclude: _evaluationData.current!.shouldExclude,
                isTillDate: _evaluationData.current!.isTillDate,
                timeGrain: _evaluationData.current!.timeGrain,
                relativeCondition: _evaluationData.current!.relativeCondition,
                isValid: false,
              },
              filterIdx
            );
            setInitialMount(false);
          } else {
            handleCustomRequiredValueOnBlur(value, type, undefined);
            setInitialMount(false);
          }

          setAnyInputOnFocus(false);
        }}
      />
      // <input
      // ref={setRef(0)}

      //   type={type}
      //   placeholder="Value"
      //   defaultValue={_evaluationData.current.selection[0]!}
      //   style={{
      //     height: "25px",
      //     width: "100%",
      //     fontSize: "13px",
      //     marginRight: "30px",
      //     textDecoration: _evaluationData.current.shouldExclude
      //       ? "line-through"
      //       : "none",
      //     color: _evaluationData.current.shouldExclude ? "#ffb74d" : "inherit",
      //   }}
      //   onFocus={() => setAnyInputOnFocus(true)}
      //   onBlur={(e) => {
      //     const value = e.target.value.trim();

      //     if (value === "") _evaluationData.current!.isValid = false;
      //     else {
      //       handleCustomRequiredValueOnBlur(value, type, undefined);
      //     }

      //     setAnyInputOnFocus(false);
      //   }}
      // />
    );
  };
  const SearchConditionBetweenControl = ({ type }: { type: string }) => {
    if (!_evaluationData.current) return;
    return (
      <>
        <TextField
          type={type}
          fullWidth
          InputProps={
            _evaluationData.current.shouldExclude
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
          className={`CustomInputValue ${dropDownStyles().customSelect}`}
          sx={{
            paddingBottom: "8px",
          }}
          autoFocus={focusInput && !_evaluationData.current.selection[0]}
          defaultValue={_evaluationData.current.selection[0]}
          onFocus={() => setAnyInputOnFocus(true)}
          onBlur={(e) => {
            const value = e.target.value.trim(); // Trim any whitespace

            if (value === "") _evaluationData.current!.isValid = false;
            else {
              handleCustomRequiredValueOnBlur(
                value,
                type,
                "greaterThanOrEqualTo"
              );
            }

            setAnyInputOnFocus(false);
          }}
        />
        <TextField
        fullWidth
          type={type}
          InputProps={
            _evaluationData.current.shouldExclude
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
          className={`CustomInputValue ${dropDownStyles().customSelect}`}
          sx={{
            paddingBottom: "8px",
          }}
          autoFocus={focusInput && !_evaluationData.current.selection[1]}
          onFocus={() => setAnyInputOnFocus(true)}
          defaultValue={_evaluationData.current.selection[1]}
          onBlur={(e) => {
            const value = e.target.value.trim(); // Trim any whitespace

            if (value === "") _evaluationData.current!.isValid = false;
            else {
              handleCustomRequiredValueOnBlur(value, type, "lessThanOrEqualTo");
            }

            setAnyInputOnFocus(false);
          }}
        />
      </>
    );
  };
  const SearchConditionDateBetween = () => {
    if (!_evaluationData.current) return;
    return (
      <div className="customDatePickerWidth">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={parseISO(selectedDate)}
            onChange={(e) =>
              e &&
              handleCustomRequiredValueOnBlur(e, "date", "greaterThanOrEqualTo")
            }
            slots={{
              textField: (params) => (
                <TextField
                fullWidth
                  {...params}
                  sx={
                    _evaluationData.current?.shouldExclude
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
                      color: _evaluationData.current?.shouldExclude
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
            value={parseISO(selectedDateTwo)}
            onChange={(e) =>
              e &&
              handleCustomRequiredValueOnBlur(e, "date", "lessThanOrEqualTo")
            }
            slots={{
              textField: (params) => (
                <TextField
                fullWidth
                  {...params}
                  sx={
                    _evaluationData.current?.shouldExclude
                      ? {
                          color: "#ffb74d",
                          textDecoration: "line-through",
                        }
                      : {}
                  }
                  InputProps={{
                    ...params.InputProps,
                    style: {
                      ...params.InputProps?.style,
                      color: _evaluationData.current?.shouldExclude
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
      </div>
    );
  };
  const CustomInputFields = () => {
    if (!_evaluationData.current) return;
    let members = null;
    if(_evaluationData.current.operator === "blank") return <div>{members}</div>;
    if (evaluationSourceDetails.dataType) {
      switch (evaluationSourceDetails.dataType) {
        case "decimal":
        case "float":
        case "double":
        case "integer":
          if (_evaluationData.current.operator === "between") {
            members = (
              <SearchConditionBetweenControl type="number"></SearchConditionBetweenControl>
            );
          } else {
            members = <SearchConditionCustomInputControl type="number" />;
          }
          break;
        case "text":
          members = (
            <SearchConditionCustomInputControl type="text"></SearchConditionCustomInputControl>
          );
          break;
        case "date":
        case "timestamp":
          if (_evaluationData.current.timeGrain === "date") {
            if (_evaluationData.current.operator === "between") {
              members = (
                <SearchConditionDateBetween></SearchConditionDateBetween>
              );
            } else {
              members = (
                <div className="customDatePickerWidth">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      value={parseISO(selectedDate)}
                      onChange={(e) =>
                        e &&
                        handleCustomRequiredValueOnBlur(
                          e,
                          "date",
                          "greaterThanOrEqualTo"
                        )
                      }
                      slots={{
                        textField: (params) => (
                          <TextField
                          fullWidth
                            {...params}
                            sx={
                              _evaluationData.current?.shouldExclude
                                ? {
                                    paddingBottom: "5px",
                                    color: "#ffb74d",
                                    textDecoration: "line-through",
                                  }
                                : { paddingBottom: "5px" }
                            }
                            InputProps={{
                              ...params.InputProps,
                              style: {
                                ...params.InputProps?.style,
                                color: _evaluationData.current?.shouldExclude
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
                </div>
              );
            }
          } else {
            if (_evaluationData.current.operator === "between") {
              members = (
                <SearchConditionBetweenControl type="number"></SearchConditionBetweenControl>
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
  const getValue = (type: string): string => {
    if (!_evaluationData.current) return "";
    if (type === "from" && _evaluationData.current.relativeCondition) {
      return _evaluationData.current.relativeCondition?.from[2];
    }
    if (type === "to" && _evaluationData.current.relativeCondition) {
      return _evaluationData.current.relativeCondition?.to[2];
    }
    if (type === "anchorDate" && _evaluationData.current.relativeCondition) {
      return _evaluationData.current.relativeCondition?.anchorDate;
    }
    if (type === "searchCondition") {
      return _evaluationData.current.operator;
    }
    return "";
  };
  const DropDownForPattern = ({ items, exprType = "exprType" }: any) => {
    return (
      <FormControl
        // fullWidth
        size="small"
        className={dropDownStyles().customSelect}
      >
        <Select
          sx={{
            height: "1.5rem",
            fontSize: fontSize.large,
            textAlign: "left",
            ".MuiSelect-icon": {
            fontSize: "18px",
            marginRight: "0.21rem",
            color: palette.primary.contrastText,
            // right: "3.5px",

          },
          }}
          IconComponent={KeyboardArrowDownIcon}
          onChange={(e) => {
            handleDropDownForPatternOnChange(e, exprType);
          }}
          // value={_evaluationData[exprType]}
          value={getValue(exprType)}
          variant="outlined"
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
  const DropDownForRelativePattern = ({
    items,
    exprType = "exprType",
  }: any) => {
    if (!_evaluationData.current) return;
    const slectDropDownRelativeFilter = (value: string): boolean => {
      if (!_evaluationData.current) return false;
      if (_evaluationData.current.relativeCondition) {
        if (
          exprType === "from" &&
          _evaluationData.current.relativeCondition.from[2] === value
        ) {
          return true;
        }
        if (
          exprType === "to" &&
          _evaluationData.current.relativeCondition.to[2] === value
        ) {
          return true;
        }
        if (
          exprType === "anchorDate" &&
          _evaluationData.current.relativeCondition.anchorDate === value
        ) {
          return true;
        }
        if (
          exprType === "value_from" &&
          _evaluationData.current.relativeCondition.from[1] === value
        ) {
          return true;
        }
        if (
          exprType === "value_to" &&
          _evaluationData.current.relativeCondition.to[1] === value
        ) {
          return true;
        }
        if (
          exprType === "last_current_next_to" &&
          _evaluationData.current.relativeCondition.to[0] === value
        ) {
          return true;
        }
        if (
          exprType === "last_current_next_from" &&
          _evaluationData.current.relativeCondition.from[0] === value
        ) {
          return true;
        }
      }
      return false;
    };
    const getValue = (type: string): string => {
      if (!_evaluationData.current) return "";
      if (_evaluationData.current.relativeCondition) {
        if (type === "from") {
          return _evaluationData.current.relativeCondition?.from[2];
        }
        if (type === "to") {
          return _evaluationData.current.relativeCondition?.to[2];
        }
        if (type === "anchorDate") {
          return _evaluationData.current.relativeCondition?.anchorDate;
        }
        if (type === "value_from") {
          return _evaluationData.current.relativeCondition?.from[1];
        }
        if (type === "value_to") {
          return _evaluationData.current.relativeCondition.to[1];
        }
        if (type === "last_current_next_to") {
          return _evaluationData.current.relativeCondition?.to[0];
        }
        if (type === "last_current_next_from") {
          return _evaluationData.current.relativeCondition?.from[0];
        }
      }
      return "";
    };
    return (
      <FormControl fullWidth size="small">
        <Select
          sx={{
            height: "1.5rem",
            fontSize: fontSize.large,
            textAlign: "left",
            ".MuiSelect-icon": {
            fontSize: "18px",
            marginRight: '0.21rem',
            color: palette.primary.contrastText,
            // right: "3.5px",

          },
          }}
          IconComponent={KeyboardArrowDownIcon}
          onChange={(e) => {
            handleDropDownForRelativePatternOnChange(e, exprType);
          }}
          // value={_evaluationData.current.operator}
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
  const RequiredFieldForRelativeFilter = ({ exprType }: any) => {
    var members = null;
    members = (
      <DropDownForRelativePattern
        items={RelativeFilterPatternCollections}
        exprType={exprType}
      ></DropDownForRelativePattern>
    );
    return <div style={{width:'100%'}}>{members}</div>;
  };
  const RelativeFilterValueInputControl = ({ type, exprType }: any) => {
    if (!_evaluationData.current) return null;
    return (
      <>
        <TextField
          InputProps={{
            style: {
              height: "25px",
              // width: "100%",
              fontSize: fontSize.medium,
              // marginRight: "30px",
            },
          }}
          placeholder="Value"
          value={
            exprType === "value_from"
              ? _evaluationData.current.relativeCondition?.from[1]
              : _evaluationData.current.relativeCondition?.to[1]
          }
          type={type}
          onBlur={(e) => updateInputForRelativeFilter(e, exprType)}
        />

        {/* {_evaluationData.isInValidData ? (
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
    return <div >{members}</div>;
  };

  const RelativeFilterCard = () => {
    if (!_evaluationData.current) return null;
    let membersFrom = null;
    membersFrom = (
      <DropDownForPattern
        items={datePatternRelativeFilterCollections}
        exprType="from"
      ></DropDownForPattern>
    );
    let membersTo = null;
    membersTo = (
      <DropDownForPattern
        items={datePatternRelativeFilterCollections}
        exprType="to"
      ></DropDownForPattern>
    );
    let membersAnchordate = null;
    membersAnchordate = (
      <DropDownForPattern
        items={AnchorDatePatternRelativeFilterCollections}
        exprType="anchorDate"
      ></DropDownForPattern>
    );
    let datemember = null;
    datemember = (
      <div className="customDatePickerWidth" style={{width:'100%'}}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={parseISO(selectedDate)}
            sx={{
              width:'100%'
            }}
            onChange={(newValue) => {
              if (!newValue || !_evaluationData.current) return;
              setSelectedDate(newValue.toISOString());
              _evaluationData.current.selection = [
                formatDateToYYYYMMDD(newValue),
              ];
              getFormattedDate();
              _evaluationData.current.isValid = isValid();
              updateConditionFilter(
                propKey,
                conditionFilterUid,
                "",
                {
                  filterType: _evaluationData.current.filterType,
                  rightOperand: [],
                  rightOperandType: [],
                  operator: _evaluationData.current.operator,
                  shouldExclude: _evaluationData.current.shouldExclude,
                  isTillDate: _evaluationData.current.isTillDate,
                  timeGrain: _evaluationData.current.timeGrain,
                  relativeCondition: _evaluationData.current.relativeCondition
                    ? {
                        from: _evaluationData.current.relativeCondition?.from,
                        to: _evaluationData.current.relativeCondition?.to,
                        anchorDate: _evaluationData.current
                          .selection[0]! as string, // anchorDate is of type string but selection is of type  (string | number | null)[]
                      }
                    : null,
                  isValid: isValid(),
                },
                filterIdx
              );
            }}
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  className={`customDatePickerHeight ${
                    dropDownStyles().customSelect
                  }`}
                />
              ),
            }}
          />
        </LocalizationProvider>
        {/* {_evaluationData.isInValidData ? (
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
          // marginLeft: "6px",
          marginBottom: "6px",
          width: "100%",
          fontSize: "13px",
          color: palette.primary.contrastText,
          textAlign: "left",
          // paddingLeft: "15px",
          // paddingRight: "15px",
        }}
      >
        <span style={{ display: "flex", gap: "0.5rem", alignItems: "center",fontSize:fontSize.medium,color:palette.primary.contrastText }}>
          From{" "}
          {loading ? <CircularProgress size={15} /> : `(${formatedDate.from})`}
        </span>{" "}
        {/*To dispaly from-date after fetching*/}
        {/*To dispaly from-date after fetching*/}
        <div style={{ display: "flex", justifyContent: "space-between",gap:'1rem'}}>
          <RequiredFieldForRelativeFilter exprType="last_current_next_from"></RequiredFieldForRelativeFilter>
          {_evaluationData.current.relativeCondition?.from[0] !== "current" ? (
            <ValueFieldForRelativeFilter exprType="value_from"></ValueFieldForRelativeFilter>
          ) : null}
        </div>
        {membersFrom}
        <span style={{ display: "flex", gap: "0.5rem", alignItems: "center",fontSize:fontSize.medium,color:palette.primary.contrastText }}>
          To {loading ? <CircularProgress size={15} /> : `(${formatedDate.to})`}
        </span>{" "}
        {/*To dispaly to-date after fetching*/}
        <div style={{ display: "flex", justifyContent: "space-between",gap:'1rem'}}>
          <RequiredFieldForRelativeFilter exprType="last_current_next_to"></RequiredFieldForRelativeFilter>
          {_evaluationData.current.relativeCondition?.to[0] !== "current" ? (
            <ValueFieldForRelativeFilter exprType="value_to"></ValueFieldForRelativeFilter>
          ) : null}
        </div>
        {membersTo}
        Based on Date
        {membersAnchordate}
        {_evaluationData.current.relativeCondition?.anchorDate ===
        "specificDate"
          ? datemember
          : null}
      </div>
    );
  };

  const FilterTypeMenu = ({
    anchorEl,
    open,
    setAnchorEl,
  }: {
    anchorEl: any;
    open: boolean;
    setAnchorEl: React.Dispatch<React.SetStateAction<any>>;
  }) => {
    useEffect(() => {
      if (!localStorage.getItem("accessToken")) return;
    }, []);
    if (!_evaluationData.current) return null;
    const filterTypes = ["Pick List", "Search Condition"];
    if (
      _evaluationData.current.dataType === "date" ||
      _evaluationData.current.dataType === "timestamp"
    ) {
      filterTypes.push("Relative Filter");
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
        {filterTypes.map((filterType, index) => {
          return (
            <div
              key={index}
              style={{ display: "flex" }}
              onClick={() => {
                if (!_evaluationData.current) return;
                _evaluationData.current.filterType = filterType;
                setSelectedFilterType(filterType);
                setAnchorEl(null);
                handleClose("filterType", filterType);
              }}
            >
              <Tooltip
                title={
                  _evaluationData.current?.filterType === filterType
                    ? "Selected"
                    : null
                }
              >
                <Radio
                  checked={_evaluationData.current?.filterType === filterType}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: "12px",
                      height: "12px",
                      color: "#af99db",
                    },
                    // fontSize: "0px",
                    alignSelf: "center",
                    marginLeft: "5px",
                  }}
                />
              </Tooltip>
              <MenuItem
                key={index}
                sx={{
                  flex: 1,
                  fontSize: "12px",
                  alignSelf: "center",
                  padding: "2px 0px",
                  paddingRight: "1rem",
                }}
              >
                {filterType}
              </MenuItem>
            </div>
          );
        })}
        <Divider
          sx={{
            margin: "5px 0px",
          }}
        />

        {/* Include */}
        <div
          style={{ display: "flex" }}
          onClick={() => {
            if (!_evaluationData.current) return;
            _evaluationData.current.shouldExclude = false;
            _evaluationData.current.isValid = isValid();
            updateConditionFilter(
              propKey,
              conditionFilterUid,
              "",
              {
                filterType: _evaluationData.current.filterType,
                rightOperand: _evaluationData.current.selection,
                rightOperandType: _evaluationData.current.selection.map(
                  (item: any) => getSQLDataType(item)
                ),
                operator: _evaluationData.current.operator,
                shouldExclude: _evaluationData.current.shouldExclude,
                isTillDate: _evaluationData.current.isTillDate,
                timeGrain: _evaluationData.current.timeGrain,
                relativeCondition: _evaluationData.current.relativeCondition,
                isValid: isValid(),
              },
              filterIdx
            );
            setAnchorEl(null);
          }}
        >
          <Tooltip
            title={!_evaluationData.current.shouldExclude ? "Selected" : null}
          >
            <Radio
              checked={!_evaluationData.current.shouldExclude}
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
            Include
          </MenuItem>
        </div>

        {/* Exclude */}
        <div
          style={{ display: "flex" }}
          onClick={() => {
            if (!_evaluationData.current) return;
            _evaluationData.current.shouldExclude = true;
            _evaluationData.current.isValid = isValid();
            updateConditionFilter(
              propKey,
              conditionFilterUid,
              "",
              {
                filterType: _evaluationData.current.filterType,
                rightOperand: _evaluationData.current.selection,
                rightOperandType: _evaluationData.current.selection.map(
                  (item: any) => getSQLDataType(item)
                ),
                operator: _evaluationData.current.operator,
                shouldExclude: _evaluationData.current.shouldExclude,
                isTillDate: _evaluationData.current.isTillDate,
                timeGrain: _evaluationData.current.timeGrain,
                relativeCondition: _evaluationData.current.relativeCondition,
                isValid: isValid(),
              },
              filterIdx
            );
            setAnchorEl(null);
          }}
        >
          <Tooltip
            title={_evaluationData.current.shouldExclude ? "Selected" : null}
          >
            <Radio
              checked={_evaluationData.current.shouldExclude}
              sx={
                _evaluationData.current.shouldExclude
                  ? {
                      "& .MuiSvgIcon-root": {
                        fontSize: "12px",
                        height: "12px",
                        color: "#ffb74d",
                      },
                      alignSelf: "center",
                      marginLeft: "5px",
                    }
                  : {
                      "& .MuiSvgIcon-root": {
                        fontSize: "12px",
                        height: "12px",
                        color: "#af99db",
                      },
                      alignSelf: "center",
                      marginLeft: "5px",
                    }
              }
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
            Exclude
          </MenuItem>
        </div>
      </Menu>
    );
  };
  const ExpandCollaseIconSwitch = () => {
    if (!_evaluationData.current) return;
    return _evaluationData.current.isCollapsed ? (
      <ChevronRightIcon
        style={{ height: "18px", width: "18px", color: palette.primary.contrastText ,padding:0}}
        onClick={(e) => {
          if (!_evaluationData.current) return;
          _evaluationData.current.isCollapsed = false;
          setCollapse(false);
        }}
      />
    ) : (
      <KeyboardArrowDownIcon
        style={{ height: "18px", width: "18px", color:  palette.primary.contrastText,padding:0 }}
        onClick={(e) => {
          if (!_evaluationData.current) return;
          _evaluationData.current.isCollapsed = true;
          setCollapse(true);
        }}
      />
    );
  };
  const DropDownForDatePattern = ({ items }: any) => {
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
            fontSize: "18px",
            marginRight: "0.21rem",
            color: palette.primary.contrastText,
            // right: "3.5px",

          },
          }}
          IconComponent={KeyboardArrowDownIcon}
          onChange={(e) => {
            handleDropDownForDatePatternOnChange(e);
          }}
          value={_evaluationData.current?.timeGrain}
          variant="outlined"
        >
          {items.map((item: any) => {
            return (
              <MenuItem
                key={item.key}
                value={item.key}
                selected={item.key === _evaluationData.current?.timeGrain}
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
  const PickListCard = () => {
    let _selectionMembers = null;

    if (!_evaluationData.current) return;
    if (loading) {
      return (
        <Stack
          spacing={1}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="90%" />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="90%" />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="90%" />
        </Stack>
      );
    }
    if (_evaluationData.current.allOptions) {
      _selectionMembers = _evaluationData.current.allOptions.map(
        (item: any, index: number) => {
          return (
            <label className="UserFilterCheckboxes" key={index} style={{marginLeft:'2.5px'}}>
              {!_evaluationData.current?.shouldExclude ? (
                <Checkbox
                  checked={
                    item === "(All)"
                      ? _evaluationData.current?.selection.length ===
                        (_evaluationData.current?.allOptions?.length ?? 0) - 1
                      : _evaluationData.current?.selection.includes(item)
                      ? true
                      : false
                  }
                  style={{
                    transform: "scale(0.8)",
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
                  name={item === null ? "Null" : item}
                />
              ) : (
                <Checkbox
                  checked={
                    item === "(All)"
                      ? _evaluationData.current.selection.length ===
                        _evaluationData.current.allOptions.length - 1
                      : _evaluationData.current.selection.includes(item)
                      ? true
                      : false
                  }
                  name={item === null ? "Null" : item}
                  style={{
                    transform: "scale(0.8)",
                    paddingRight: "0px",
                  }}
                  sx={{
                    // color: "red",
                    "&.Mui-checked": {
                      color: "orange",
                    },
                  }}
                  onChange={(e) => handleCBChange(e)}
                />
              )}

              <span
                title={item === null ? "(Blank)" : item}
                style={
                  _evaluationData.current?.shouldExclude &&
                  _evaluationData.current.selection.includes(item)
                    ? {
                        marginLeft: '0.3rem',
                        // marginTop: "3.5px",
                        justifySelf: "center",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textDecoration: "line-through",
                        fontSize:fontSize.medium,
                        color:palette.primary.contrastText
                      }
                    : {
                        marginLeft: '0.3rem',
                        // marginTop: "3.5px",
                        justifySelf: "center",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        fontSize:fontSize.medium,
                        color:palette.primary.contrastText
                      }
                }
              >
                {item === null ? "(Blank)" : item}
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
  const SearchConditionCard = () => {
    let members = null;
    if (evaluationSourceDetails.dataType) {
      switch (evaluationSourceDetails.dataType) {
        case "decimal":
        case "integer":
          members = (
            <DropDownForPatternForNumber
              items={equalPatternCollections}
              exprType="searchCondition"
              handleDropDownChange={handleDropDownForPatternOnChange}
              value={getValue("searchCondition")}
              usersx={{
                marginRight: "0.15rem",
                right: "7px"
              }}
            ></DropDownForPatternForNumber>
          );
          break;
        case "text":
          members = (
            <DropDownForPattern
              items={withPatternCollections}
              exprType="searchCondition"
            ></DropDownForPattern>
          );
          break;
        case "timestamp":
        case "date":
          members = (
            <DropDownForPattern
              items={equalPatternCollections}
              exprType="searchCondition"
            ></DropDownForPattern>
          );
          break;
        default:
          members = null;
          break;
      }
    }

    return (
      <div className="chart-fil-grp-CustomRequiredField" style={{width:'100%'}}>
        {members}
        {/* <CustomRequiredField></CustomRequiredField> */}
        <CustomInputFields />
      </div>
    );
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
  if (_evaluationData.current === null) return null;
  return conditionTypeElse ? (
    "Else"
  ) : (
    <div className="UserFilterCard" style={{
      width: "90%"
    }}>
      <div
        className="axisFilterField"
        // style={styles}
        style={
          _evaluationData.current.isCollapsed
            ? {
                border:
                  !_evaluationData.current.isValid && !anyInputOnFocus
                    ? "1px solid red"
                    : "1px #af99db solid",
                color: "#af99db",
                // fontWeight: "bold",
                position: "relative",height:'1.5rem',width:'100%',padding:'0.3rem'
              }
            : !_evaluationData.current.isValid && !anyInputOnFocus
            ? {
                border: "1px solid red",height:'1.5rem',width:'100%',padding:'0.3rem'
              }
            : {height:'1.5rem',width:'100%',padding:'0.3rem'}
        }
      >
        {/* <button
          type="button"
          className="buttonCommon columnClose"
          onClick={() => {
            deleteSourceV2(activeFlow, "", propKey, filterIdx, filterIdx);
          }}
          title="Remove field"
        >
          <CloseRoundedIcon
            style={{
              fontSize: "13px",
            }}
          />
        </button> */}
        <CloseRoundedIcon
        onClick={() => {
          deleteSourceV2(activeFlow, "", propKey, filterIdx, filterIdx);
        }}
        // title="Remove field"
        sx={{
          fontSize: fontSize.medium,
          cursor: "pointer",
          color:palette.primary.contrastText,
          "&:hover": {
            color: "red",
            transform: "scale(1.1)",
          },
        }}
      />
        {/* filter column name */}

        <span
          style={{
            display: "flex",
            alignItems: "center",
            fontSize:fontSize.medium,
            width: "100%",
            marginLeft: "0.5rem",
          }}
        >
          {_evaluationData.current.displayName}
          {!_evaluationData.current.isValid && !anyInputOnFocus ? (
            <Tooltip title="Field is not filled properly">
              <WarningAmberIcon
              style={{ color: "orange", marginLeft: "5px", opacity: "0.7" }}
              fontSize="small"
            />
              </Tooltip>
          ) : null}
        </span>

        <Button
          type="button"
          className="buttonCommon"
          style={{ backgroundColor: "transparent" }}
          title="More Options"
          onClick={handleClick}
          sx={{
            minWidth: "fit-content",
            padding:0
          }}
        >
          <MoreVertIcon style={{ fontSize: fontSize.extraLarge, color:palette.primary
            .contrastText
           }} />
        </Button>

        <FilterTypeMenu
          open={Boolean(anchorEl)}
          setAnchorEl={setAnchorEl}
          anchorEl={anchorEl}
        />

        {/* expand colapse icon */}
        <button
          type="button"
          className="buttonCommon columnDown"
          title={_evaluationData.current.isCollapsed ? "Expand" : "Collapse"}
          style={{padding:'0.25rem'}}
        >
          <ExpandCollaseIconSwitch />
        </button>
      </div>
      {!_evaluationData.current.isCollapsed ? (
        <div className="UserSelectionDiv">
          {_evaluationData.current.dataType === "date" ||
          _evaluationData.current.dataType === "timestamp" ? (
            <div className="CustomRequiredField" style={{width:'100%'}}>
              {_evaluationData.current.filterType === "Pick List" ? (
                <DropDownForDatePattern
                  items={datePatternCollections}
                ></DropDownForDatePattern>
              ) : _evaluationData.current.filterType === "Search Condition" ? (
                <DropDownForDatePattern
                  items={datePatternSearchConditionCollections}
                ></DropDownForDatePattern>
              ) : null}
            </div>
          ) : null}
          {_evaluationData.current.filterType === "Pick List" ? (
            <>
              <PickListCard />
              {/* {_evaluationData.current.dataType === "date" ||
              _evaluationData.current.dataType === "timestamp" ? (
                // <TillDate />
              ) : null} */}
            </>
          ) : _evaluationData.current.filterType === "Relative Filter" ? (
            <RelativeFilterCard />
          ) : (
            <>
              <SearchConditionCard />
              {/* {_evaluationData.current.dataType === "date" ||
              _evaluationData.current.dataType === "timestamp" ? (
                <TillDate />
              ) : null} */}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    calculations: state.calculations,
    tabTileProps: state.tabTileProps,
    chartProp: state.chartProperties,
    token: state.isLogged.accessToken,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteSourceFromFlow: (
      calculationFlowUID: string,
      sourceUID: string,
      propKey: string,
      sourceIndex: number
    ) => {
      dispatch(
        deleteSourceFromFlow(
          calculationFlowUID,
          sourceUID,
          propKey,
          sourceIndex
        )
      );
    },
    deleteSourceV2: (
      calculationFlowUID: string,
      sourceUID: string,
      propKey: string,
      sourceIndex: number,
      filterIdx: number
    ) =>
      dispatch(
        deleteSourceV2(
          calculationFlowUID,
          sourceUID,
          propKey,
          sourceIndex,
          filterIdx
        )
      ),
    updateSearchConditionFilter: (
      propKey: string,
      conditionFilterUid: string,
      sourceUid: string,
      shouldExclude: boolean
    ) =>
      dispatch(
        updateSearchConditionFilter(
          propKey,
          conditionFilterUid,
          sourceUid,
          shouldExclude
        )
      ),
    updateTimeGrain: (
      propKey: string,
      conditionFilterUid: string,
      filterIdx: number,
      timeGrain: string
    ) =>
      dispatch(
        updateTimeGrain(propKey, conditionFilterUid, filterIdx, timeGrain)
      ),
    updateConditionFilter: (
      propKey: string,
      conditionFilterUid: string,
      sourceUid: string,
      conditionFilter: {
        filterType: string;
        rightOperand: (string | number | null)[];
        rightOperandType: string[];
        operator: string;
        shouldExclude: boolean;
        isTillDate: boolean;
        timeGrain: string;
        relativeCondition: IRelativeCondition | null;
        isValid: boolean;
      },
      filterIdx: number
    ) =>
      dispatch(
        updateConditionFilter(
          propKey,
          conditionFilterUid,
          sourceUid,
          conditionFilter,
          filterIdx
        )
      ),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EvaluationCard);
