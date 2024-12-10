import React, { useState, useEffect, Dispatch, useRef } from "react";
import {
  SortChartData,
  SortOrder,
  SortedValue,
  updateCrossTabHeaderLabelOptions,
} from "../../../redux/ChartPoperties/ChartControlsActions";
import "../ShowHide/ShowHide.css";
import "../ChartOptions.css";
import {
  Button,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { editChartPropItem } from "../../../redux/ChartPoperties/ChartPropertiesActions";
import { connect } from "react-redux";
import { PatternCollectionType } from "../../ChartFieldFilter/UserFilterCardInterface";
import {
  ChartOptionsProps,
  ChartOptionsStateProps,
} from "../CommonInterfaceForChartOptions";
import { DashBoardFilterGroupStateProps } from "../../../redux/DashBoardFilterGroup/DashBoardFilterGroupInterface";
import { isLoggedProps } from "../../../redux/UserInfo/IsLoggedInterfaces";
import { ChartFilterGroupStateProps } from "../../../redux/ChartFilterGroup/ChartFilterGroupInterface";
import { TileRibbonStateProps } from "../../TabsAndTiles/TileRibbonInterfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux";

interface Props {
  chartControls: any;
  chartProperties: any;
  tabTileProps: any;
  SortChartData: (propKey: string, charData: string | any) => void;
  SortServerData: (propKey: string, serverData: string | any) => void;
  SortOrder: (propKey: string, order: string) => void;
  SortedValue: (propKey: string, chartData: string | any) => void;
  updateCrossTabHeaderLabelOptions: (
    propKey: string,
    option: string,
    value: any
  ) => void;
  dynamicMeasureState: any;
  chartGroup: any;
  dashBoardGroup: any;
  screenFrom: string;
  token: string;
}
const ShowHide = ({
  chartProperties,
  chartControls,
  tabTileProps,
  SortChartData,
  SortedValue,
  updateCrossTabHeaderLabelOptions,
  dynamicMeasureState,
}: ChartOptionsProps &
  Props & {
    updateCrossTabHeaderLabelOptions: (
      propKey: string,
      option: string,
      value: any
    ) => void;
  }) => {
  const [ascDescNotify, setAscDescNotify] = useState<string>("");

  //function that converts fieldname to displayname
  const sortChart = (chartData: any[]): any[] => {
    let result: any[] = [];

    if (chartData && chartData.length > 0) {
      let _zones: any = chartProperties.properties[propKey].chartAxes.filter(
        (zones: any) => zones.name !== "Filter"
      );
      let _chartFieldTempObject: any = {};

      const findFieldIndexName = (name: string, i: number = 2): string => {
        if (_chartFieldTempObject[`${name}_${i}`] !== undefined) {
          i++;
          return findFieldIndexName(name, i);
        } else {
          return `${name}_${i}`;
        }
      };

      _zones.forEach((zoneItem: any) => {
        zoneItem.fields.forEach((field: any) => {
          let _nameWithAgg: string = field.displayname;

          if (_chartFieldTempObject[field.fieldname] !== undefined) {
            let _name = findFieldIndexName(field.fieldname);

            field["NameWithIndex"] = _name;
            _chartFieldTempObject[_name] = "";
          } else {
            field["NameWithIndex"] = field.fieldname;
            _chartFieldTempObject[field.fieldname] = "";
          }

          field["NameWithAgg"] = _nameWithAgg;
        });
      });

      chartData.forEach((data: any) => {
        let _chartDataObj: any = {};

        _zones.forEach((zoneItem: any) => {
          zoneItem.fields.forEach((field: any) => {
            _chartDataObj[field.NameWithAgg] = data[field.NameWithIndex];
          });
        });

        result.push(_chartDataObj);
      });
    }
    return result;
  };

  //propKey is just know which table we are - 1.1
  var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

  const data: string | any =
  chartControls.properties[propKey].serverData.length > 0
    ? sortChart(
        chartControls.properties[propKey].serverData.map((item: any) => {
          // Convert boolean values in the data to "True" or "False"
          const updatedItem: any = {};
          for (const key in item) {
            updatedItem[key] =
              typeof item[key] === "boolean"
                ? item[key]
                  ? "True"
                  : "False"
                : item[key];
          }
          return updatedItem;
        })
      )
    : [];

  const [chat, setchat] = useState();
  var descendingChartData = JSON.parse(JSON.stringify(data));

  const showCss =
    chartControls.properties[propKey]?.crossTabHeaderLabelOptions?.showCss;

  const [isShownCss, setIsShownCss] = useState(showCss);

  const selectedColumn = chartControls.properties[propKey].sortedValue;

  //Row, Column or Measure
  const columnType = useSelector(
    (state: RootState) =>
      state.chartControls.properties[propKey]?.crossTabHeaderLabelOptions
        ?.columnType
  );

  //seclected Field
  const columnName = useSelector(
    (state: RootState) =>
      state.chartControls.properties[propKey]?.crossTabHeaderLabelOptions
        ?.columnName
  );

  const savedMembers = useSelector(
    (state: RootState) =>
      state.chartControls.properties[propKey]?.crossTabHeaderLabelOptions
        ?.selectedMembers || []
  );
  const inputValue = useSelector(
    (state: RootState) =>
      state.chartControls.properties[propKey]?.crossTabHeaderLabelOptions
        ?.inputValue
  );

  const comparisonType = useSelector(
    (state: RootState) =>
      state.chartControls.properties[propKey]?.crossTabHeaderLabelOptions
        ?.comparison || "> Greater than"
  );
  const [integerChanged, setIntegerChanged] = useState(false);

  useEffect(() => {
    setchat(chartControls.properties[propKey].serverData);
  }, []);


  var chartData: string | any = JSON.parse(JSON.stringify(data));

  const sortedData = sortChart(chartControls.properties[propKey].serverData);
  const serverData = sortedData;

  //firstObjKey stores fields options
  const firstObjKey = sortedData.length > 0 ? Object.keys(sortedData[0]) : [];

  //StringColumn or IntegerColumn
  const [func, setFunc] = useState<string>("");

  // For incl null we use isToggled1
  const [isToggled1, setIsToggled1] = useState(true);

  const shownull = () => {
    const filteredData = descendingChartData.filter((item: any) =>
      savedMembers.includes(item[chartControls.properties[propKey].sortedValue])
    );
    SortChartData(propKey, filteredData);
  };

  const hidenull = () => {
    let filteredData = descendingChartData.filter(
      (item: any) =>
        savedMembers.includes(
          item[chartControls.properties[propKey].sortedValue]
        ) && item[chartControls.properties[propKey].sortedValue] !== null
    );
    SortChartData(propKey, filteredData);
  };

  const handleToggleIncludeNull = (event: any) => {
    setIsToggled1(event.target.checked);
    if (isToggled1) {
      shownull();
    } else {
      hidenull();
    }
  };


  //String Function
  const StringColumn = ({ props }: { props: any }) => {
    setFunc("StringColumn");
    const chartData = sortChart(
      chartControls.properties[propKey]?.serverData || []
    );
    const selectedColumn = props.selectedColumn;
    useEffect(() => {
      if (savedMembers.length > 0) {
        updateCrossTabHeaderLabelOptions(
          propKey,
          "selectedMembers",
          savedMembers
        );
      }
    }, [savedMembers]);

    const uniqueOptions: any[] = Array.from(
      new Set(serverData.map((item: any) => {
        const value = item[selectedColumn];
        // Convert boolean values to "True" or "False"
        if (typeof value === "boolean") {
          return value ? "True" : "False";
        }
        return value;
      }))
    ).sort((a: any, b: any) => {
      if (a === null) return 1; // Place null at the end
      if (b === null) return -1;
      return a.toString().localeCompare(b.toString());
    });

    const handleSelectAll = () => {
      if (savedMembers.length === uniqueOptions.length) {
        updateCrossTabHeaderLabelOptions(propKey, "selectedMembers", []);
      } else {
        updateCrossTabHeaderLabelOptions(
          propKey,
          "selectedMembers",
          uniqueOptions
        );
      }
    };
    const handleMemberSelect = (member: string) => {
      setValue(0);
      updateCrossTabHeaderLabelOptions(propKey, "inputValue", "");
      updateCrossTabHeaderLabelOptions(propKey, "comparison", "");
      const updatedSelectedMembers = savedMembers.includes(member)
        ? savedMembers.filter((item: string) => item !== member)
        : [...savedMembers, member];
      setIntegerChanged(false);
      updateCrossTabHeaderLabelOptions(
        propKey,
        "selectedMembers",
        updatedSelectedMembers
      );

      if (isShownCss) {
        showButton();
      } else {
        hideButton();
      }
    };

    const isAllSelected = () => {
      return (
        uniqueOptions.length > 0 &&
        uniqueOptions.every((option) => savedMembers.includes(option))
      );
    };

    const clearAllFilters = () => {
      SortChartData(propKey, chartData);
      updateCrossTabHeaderLabelOptions(propKey, "selectedMembers", []);
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "4px",
          paddingTop: "12px",
        }}
      >
        <div className="a">
          <div className="b">
            <input
              type="checkbox"
              checked={isAllSelected()}
              onChange={() => handleSelectAll()}
            />
            <div className="d">All</div>
          </div>
        </div>

        {uniqueOptions.map((option: string, index: number) => (
          <div className="a" key={index}>
            <div className="b">
              <input
                type="checkbox"
                value={option}
                checked={savedMembers.includes(option)}
                onChange={() => handleMemberSelect(option)}
              />
              <div className="d">{option}</div>
            </div>
          </div>
        ))}

        <FormControlLabel
          style={{ marginLeft: "0px" }}
          control={
            <Switch
              checked={isToggled1}
              onChange={handleToggleIncludeNull}
              style={{ color: "#2bb9bb", borderRadius: 17 }}
            />
          }
          label={<span style={{ fontSize: "15px" }}>Incl null</span>}
        />
        <Button
          style={{ margin: "10px", fontSize: "12px", color: "#2bb9bb" }}
          onClick={clearAllFilters}
        >
          Clear All
        </Button>
      </div>
    );
  };

  const equalPatternCollections: PatternCollectionType[] = [
    { key: "greaterThan", value: "> Greater than" },
    { key: "lessThan", value: "< Less than" },
    { key: "greaterThanOrEqualTo", value: ">= Greater than or Equal to" },
    { key: "lessThanOrEqualTo", value: "<= Less than or Equal to" },
    { key: "equalTo", value: "= Equal to" },
  ];
  const [selectedValue, setSelectedValue] = useState(
    equalPatternCollections[0].value
  );

  const [shownum, setShownum] = useState(true);
  const [hidenum, setHidenum] = useState(false);
  const [numbnum, setNumbnum] = useState<number>(0);
  const [value, setValue] = useState(inputValue);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [value]);

  const handleIntegerFilter = (prop: string) => {
    updateCrossTabHeaderLabelOptions(propKey, "inputValue", value);
    setNumbnum(value);
    const filterValue = Number(value);
    let dummy: string | any = descendingChartData;
    let filteredData;
    if (shownum) {
      // For showButton logic
      if (prop === "> Greater than") {
        filteredData = dummy.filter(
          (item: any) =>
            Number(item[chartControls.properties[propKey].sortedValue]) >
            filterValue
        );
      } else if (prop === "< Less than") {
        filteredData = dummy.filter(
          (item: any) =>
            Number(item[chartControls.properties[propKey].sortedValue]) <
            filterValue
        );
      } else if (prop === ">= Greater than or Equal to") {
        filteredData = dummy.filter(
          (item: any) =>
            Number(item[chartControls.properties[propKey].sortedValue]) >=
            filterValue
        );
      } else if (prop === "<= Less than or Equal to") {
        filteredData = dummy.filter(
          (item: any) =>
            Number(item[chartControls.properties[propKey].sortedValue]) <=
            filterValue
        );
      } else {
        filteredData = dummy.filter(
          (item: any) =>
            Number(item[chartControls.properties[propKey].sortedValue]) ===
            filterValue
        );
      }
    } else if (hidenum) {
      // For hideButton logic, invert the conditions
      if (prop === "> Greater than") {
        filteredData = dummy.filter(
          (item: any) =>
            Number(item[chartControls.properties[propKey].sortedValue]) <=
            filterValue
        );
      } else if (prop === "< Less than") {
        filteredData = dummy.filter(
          (item: any) =>
            Number(item[chartControls.properties[propKey].sortedValue]) >=
            filterValue
        );
      } else if (prop === ">= Greater than or Equal to") {
        filteredData = dummy.filter(
          (item: any) =>
            Number(item[chartControls.properties[propKey].sortedValue]) <
            filterValue
        );
      } else if (prop === "<= Less than or Equal to") {
        filteredData = dummy.filter(
          (item: any) =>
            Number(item[chartControls.properties[propKey].sortedValue]) >
            filterValue
        );
      } else {
        filteredData = dummy.filter(
          (item: any) =>
            Number(item[chartControls.properties[propKey].sortedValue]) !==
            filterValue
        );
      }
    }

    filteredData.length > 0
      ? SortChartData(propKey, filteredData)
      : SortChartData(propKey, descendingChartData);
  };

  const [includeNull, setIncludeNull] = useState<boolean>(false);

  //   This function is called when selected field is integer
  const IntegerColumn = () => {
    setFunc("IntegerColumn");

    const handleIntegerFilter = (prop: string) => {
      updateCrossTabHeaderLabelOptions(propKey, "inputValue", value);
      setNumbnum(value);
      const filterValue = Number(value);
      let dummy: string | any = descendingChartData;
      let filteredData;
      if (shownum) {
        // For showButton logic
        if (prop === "> Greater than") {
          filteredData = dummy.filter(
            (item: any) =>
              Number(item[chartControls.properties[propKey].sortedValue]) >
              filterValue
          );
        } else if (prop === "< Less than") {
          filteredData = dummy.filter(
            (item: any) =>
              Number(item[chartControls.properties[propKey].sortedValue]) <
              filterValue
          );
        } else if (prop === ">= Greater than or Equal to") {
          filteredData = dummy.filter(
            (item: any) =>
              Number(item[chartControls.properties[propKey].sortedValue]) >=
              filterValue
          );
        } else if (prop === "<= Less than or Equal to") {
          filteredData = dummy.filter(
            (item: any) =>
              Number(item[chartControls.properties[propKey].sortedValue]) <=
              filterValue
          );
        } else {
          filteredData = dummy.filter(
            (item: any) =>
              Number(item[chartControls.properties[propKey].sortedValue]) ===
              filterValue
          );
        }
      } else if (hidenum) {
        // For hideButton logic
        if (prop === "> Greater than") {
          filteredData = dummy.filter(
            (item: any) =>
              Number(item[chartControls.properties[propKey].sortedValue]) <=
              filterValue
          );
        } else if (prop === "< Less than") {
          filteredData = dummy.filter(
            (item: any) =>
              Number(item[chartControls.properties[propKey].sortedValue]) >=
              filterValue
          );
        } else if (prop === ">= Greater than or Equal to") {
          filteredData = dummy.filter(
            (item: any) =>
              Number(item[chartControls.properties[propKey].sortedValue]) <
              filterValue
          );
        } else if (prop === "<= Less than or Equal to") {
          filteredData = dummy.filter(
            (item: any) =>
              Number(item[chartControls.properties[propKey].sortedValue]) >
              filterValue
          );
        } else {
          filteredData = dummy.filter(
            (item: any) =>
              Number(item[chartControls.properties[propKey].sortedValue]) !==
              filterValue
          );
        }
      }
      filteredData.length > 0
        ? SortChartData(propKey, filteredData)
        : SortChartData(propKey, descendingChartData);
    };

    const handleValueChange = (event: any) => {
      handleIntegerFilter(comparisonType);
      updateCrossTabHeaderLabelOptions(
        propKey,
        "comparison",
        event.target.value
      );
      updateCrossTabHeaderLabelOptions(propKey, "selectedMembers", []);
      if (inputValue !== "") {
        setIntegerChanged(true);
      }
    };

    const handleToggleIncludeNull = (event: any) => {
      setIsToggled1(event.target.checked);
      if (isToggled1) {
        shownull();
      } else {
        hidenull();
      }
    };

    const clearAllFilters = () => {
      setSelectedValue(equalPatternCollections[0].key);
      setValue(0);
      updateCrossTabHeaderLabelOptions(propKey, "inputValue", "");
      setIncludeNull(false);
    };

    const handleInputChange = (event: any) => {
      setValue(event.target.value);
      setIntegerChanged(true);
    };

    const handleBlur = () => {
      handleIntegerFilter(comparisonType);
      updateCrossTabHeaderLabelOptions(propKey, "inputValue", value); 

      updateCrossTabHeaderLabelOptions(propKey, "selectedMembers", []); 
    };
    return (
      <div>
        <FormControl fullWidth sx={{ margin: "5px 5px 5px 5px" }}>
          <Select
            sx={{
              width: "95.5%",
              height: "26px",
              fontSize: "13px",
              "&.MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "1px solid rgb(211, 211, 211)",
                },
                "&:hover fieldset": {
                  border: "1px solid #2bb9bb",
                },
                "&.Mui-focused fieldset": {
                  border: "1px solid #2bb9bb",
                },
                "&.Mui-focused svg": {
                  color: "#2bb9bb",
                },
              },
            }}
            onChange={handleValueChange}
            value={comparisonType}
            MenuProps={{
              PaperProps: {
                sx: {
                  "& .MuiMenuItem-root.Mui-selected": {
                    backgroundColor: "rgba(43, 185, 187, 0.1)",                     
                  "&:hover": {
                    backgroundColor: "rgba(43, 185, 187, 0.2)",
                  },
                  },
                },
              },
            }}
          >
            {equalPatternCollections.map((data, index) => (
              <MenuItem
                key={index}
                value={data.value || ""}
                sx={{
                  color: "black",
                  fontSize: "12px",
                  "&:hover": { backgroundColor: "rgb(238, 238, 238)" },
                }}
                onClick={() => {
                  handleIntegerFilter(comparisonType);
                  updateCrossTabHeaderLabelOptions(propKey, "inputValue", value); 
                }}
              >
                {data.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <input
          type="number"
          value={value}
          ref={inputRef}
          onChange={handleInputChange}
          // onBlur={() => handleIntegerFilter(comparisonType)}
          onBlur={handleBlur}
          style={{
            borderRadius: "5px",
            width: "220px",
            marginLeft: "2px",
            margin: "8px",
            padding: "6px",
          }}
        />
        <FormControlLabel
          style={{ marginLeft: "0px" }}
          control={
            <Switch
              style={{ color: "#2bb9bb", borderRadius: 17 }}
              checked={isToggled1}
              onChange={handleToggleIncludeNull}
            />
          }
          label={<span style={{ fontSize: "15px" }}>Incl null</span>}
        />
        <Button
          style={{ margin: "10px", fontSize: "12px", color: "#2bb9bb" }}
          onClick={clearAllFilters}
        >
          Clear All
        </Button>
      </div>
    );
  };

  const [storeFieldType, setStoreFieldType] = useState<string>("");
  const [columnSelections, setColumnSelections] = useState<{
    [key: string]: string[];
  }>({});

  useEffect(() => {
    setIsShownCss(showCss);
  }, [showCss]);

  useEffect(() => {
    if (isShownCss) {
      showButton();
    } else {
      hideButton();
    }
  }, [isShownCss, savedMembers]); 

  const showButton = () => {
    updateCrossTabHeaderLabelOptions(propKey, "showCss", true);
    setIsShownCss(true);
    setShownum(true);
    setHidenum(false);
    if (func === "IntegerColumn") {
      handleIntegerFilter(comparisonType);
    }

    if (func === "StringColumn") {
      const filteredData = descendingChartData.filter((item: any) =>
        savedMembers.includes(
          item[chartControls.properties[propKey].sortedValue]
        )
      );

      if (filteredData.length > 0) {
        SortChartData(propKey, filteredData);
      } else {
        SortChartData(propKey, descendingChartData);
        handleIntegerFilter(comparisonType);
      }
    }
  };

  const hideButton = () => {
    updateCrossTabHeaderLabelOptions(propKey, "showCss", false);
    setIsShownCss(false);
    setShownum(false);
    setHidenum(true);
    if (func === "IntegerColumn") {
      handleIntegerFilter(comparisonType);
    }
    if (func == "StringColumn") {
      const filteredData = descendingChartData.filter(
        (item: any) =>
          !savedMembers.includes(
            item[chartControls.properties[propKey].sortedValue]
          )
      );

      if (filteredData.length > 0) {
        SortChartData(propKey, filteredData);
      } else {
        SortChartData(propKey, descendingChartData);
        handleIntegerFilter(comparisonType);
      }
    }
  };

  const handleSelectColumnOptions = (event: any) => {
    const newColumn = event.target.value;
    setAscDescNotify("");
    // Only save current column's selected checkboxes if the new column's checkboxes are empty
    if (savedMembers.length > 0) {
      setColumnSelections((prevSelections) => ({
        ...prevSelections,
        [chartControls.properties[propKey].sortedValue]: savedMembers,
      }));
    }
    SortedValue(propKey, newColumn);

    // Check if the new column has a previous selection saved
    const previousSelection = columnSelections[newColumn];
    if (integerChanged) {
      updateCrossTabHeaderLabelOptions(propKey, "selectedMembers", []);
    } else if (previousSelection && savedMembers.length === 0) {
      // If integerChanged is false and there is a previous selection, apply the previous selection
      updateCrossTabHeaderLabelOptions(
        propKey,
        "selectedMembers",
        previousSelection
      );
    } else {
      updateCrossTabHeaderLabelOptions(propKey, "selectedMembers", []);
    }
  };

  useEffect(() => {
    if (firstObjKey.length > 0 && !selectedColumn) {
      SortedValue(propKey, firstObjKey[0]);
    }
  }, [firstObjKey, selectedColumn, SortedValue]);

  if (chartControls.properties[propKey].sortedValue !== "") {
    if (firstObjKey.length !== 0) {
      const find = firstObjKey.some(
        (value) => value === chartControls.properties[propKey].sortedValue
      );
      if (find === false) {
        SortedValue(propKey, "");
        SortOrder(propKey, "");
      }
    }
  }

  const column = chartControls.properties[propKey].sortedValue;
  updateCrossTabHeaderLabelOptions(propKey, "columnName", column);
  let selectedField: any;
  let axisName: string | undefined;
  const chartAxes = chartProperties.properties[propKey].chartAxes;

  if (Array.isArray(chartAxes)) {
    chartAxes.forEach((axis: any) => {
      axis.fields.forEach((field: any) => {
        if (
          field.displayname === columnName ||
          field.fieldname === columnName
        ) {
          selectedField = field;
          axisName = axis.name;
        }
      });
    });
  }
  if (axisName) {
    updateCrossTabHeaderLabelOptions(propKey, "columnType", axisName);
  }
  const handleClick = (selectedFieldName: string) => {
    if (Array.isArray(chartAxes)) {
      chartAxes.forEach((axis: any) => {
        axis.fields.forEach((field: any) => {
          if (
            field.displayname === selectedFieldName ||
            field.fieldname === selectedFieldName
          ) {
            selectedField = field;
            axisName = axis.name;
          }
        });
      });
    }

    if (axisName === "Row") {
      setStoreFieldType("Row");
    } else if (axisName === "Column") {
      setStoreFieldType("Column");
    } else {
      setStoreFieldType("Measure");
    }
    if (isShownCss) {
      showButton();
    } else{
      hideButton();
    }
  };
  useEffect(() => {
    if (selectedColumn) {
      if (isShownCss) {
        showButton();
      } else {
        hideButton();
      }
    }
  }, [selectedColumn, savedMembers, isShownCss]);

  useEffect(() => {
    if (selectedColumn) {
      handleClick(selectedColumn);
    }
  }, [selectedColumn, savedMembers]);

  // Main return part
  return (
    <React.Fragment>
      {data.length > 0 ? (
        <div>
          <div style={{ overflowX: "hidden", width: "100%" }}> 
          <div className="sort">Show/Hide</div>
          <div style={{ display: "flex" }}>
            {/* Show Button */}
            <div
              style={{
                borderRadius: "5px 0 0 5px",                
                marginLeft: "10px",
                marginBottom: "5px",
                transition: "0.2s",
                backgroundColor: isShownCss ? "#E0E0E0" : "white",
                fontWeight: isShownCss? "600" : "normal",
                cursor: isShownCss? "default" : "pointer",
                boxSizing: "border-box",
              }}
              className={
                chartControls.properties[propKey].sortOrder === "Ascending"
                  ? "radioButtonSelected"
                  : "radioButton"
              }
              onClick={() => {
                showButton();
              }}
            >
              Show
            </div>

            {/* Hide Button */}
            <div
              style={{
                borderRadius: "0 5px 5px 0",                
                marginBottom: "10px",
                transition: "0.2s",
                backgroundColor: isShownCss ? "white" : "#E0E0E0",
                fontWeight: isShownCss? "normal" : "600",
                cursor: isShownCss? "pointer" : "default",
                boxSizing: "border-box",
              }}
              className={
                chartControls.properties[propKey].sortOrder === "Descending"
                  ? "radioButtonSelected"
                  : "radioButton"
              }
              onClick={() => {
                hideButton();
              }}
            >
              Hide
            </div>
          </div>
          </div>

          <div className="sort">Field</div>

          <div>
            <FormControl fullWidth sx={{ margin: "0 5px 0 5px" }}>
              {!selectedColumn && (
                <Typography
                  sx={{
                    color: "#ccc",
                    fontSize: "10px",
                    textAlign: "left",
                    padding: "0 0 3px 5px",
                    fontStyle: "italic",
                  }}
                >
                  *Select a Field name*
                </Typography>
              )}
              <Select
                sx={{
                  marginBottom: "5px",
                  width: "95.5%",
                  height: "26px",
                  fontSize: "13px",
                  "&.MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "1px solid rgb(211, 211, 211)",
                    },
                    "&:hover fieldset": {
                      border: "1px solid #2bb9bb",
                    },
                    "&.Mui-focused fieldset": {
                      border: "1px solid #2bb9bb",
                    },
                    "&.Mui-focused svg": {
                      color: "#2bb9bb",
                    },
                  },
                }}
                onChange={handleSelectColumnOptions}
                value={chartControls.properties[propKey].sortedValue || ""}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root.Mui-selected": {
                        backgroundColor: "rgba(43, 185, 187, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(43, 185, 187, 0.2)",
                        },
                      },
                    },
                  },
                }}
              >
                {firstObjKey.map((data, index) => (
                  <MenuItem
                    key={index}
                    value={data}
                    onClick={() => handleClick(data)}
                    sx={{
                      color: "black",
                      fontSize: "12px",
                      "&:hover": { backgroundColor: "rgb(238, 238, 238)" },
                    }}
                  >
                    {data}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div>
            {ascDescNotify && (
              <p
                style={{ color: "#ccc", fontStyle: "italic", fontSize: "10px" }}
              >
                *{ascDescNotify}*
              </p>
            )}
          </div>

          {storeFieldType === "Row" || storeFieldType === "Column" ? (
            <StringColumn props={{ selectedColumn }} />
          ) : (
            <IntegerColumn />
          )}
        </div>
      ) : (
        <div>
          <div className="sort6Disable">Show/Hide</div>
          <div>
            <FormControl fullWidth disabled sx={{ margin: "0 10px 0 10px" }}>
              <Select sx={{ width: "95.5%", height: "26px" }}></Select>
            </FormControl>
          </div>
          <div className="sortDisable">Show/Hide</div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                color: "#b6b6b6",
                borderRadius: "5px 0 0 5px",
                marginLeft: "10px",
              }}
              className="radioButton"
            >
              Show
            </div>
            <div
              style={{ color: "#b6b6b6", borderRadius: "0 5px 5px 0" }}
              className="radioButton"
            >
              Hide
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = (
  state: ChartOptionsStateProps &
    DashBoardFilterGroupStateProps &
    isLoggedProps &
    ChartFilterGroupStateProps &
    TileRibbonStateProps,
  ownProps: any
) => {
  return {
    chartProperties: state.chartProperties,
    chartControls: state.chartControls,
    tabTileProps: state.tabTileProps,
    token: state.isLogged.accessToken,
    descendingChartData: state.chartControls.chartData || [],
    dynamicMeasureState: state.dynamicMeasuresState,
    chartGroup: state.chartFilterGroup,
    dashBoardGroup: state.dashBoardFilterGroup,
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
    SortChartData: (propKey: string, chartData: string | any) =>
      dispatch(SortChartData(propKey, chartData)),
    SortOrder: (propKey: string, order: string) =>
      dispatch(SortOrder(propKey, order)),
    SortedValue: (propKey: string, value: string | any) =>
      dispatch(SortedValue(propKey, value)),
    updateCrossTabHeaderLabelOptions: (
      propKey: string,
      option: string | number,
      value: string | number | string[]
    ) => dispatch(updateCrossTabHeaderLabelOptions(propKey, option, value)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ShowHide);












