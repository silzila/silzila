//this component is used for datasetFilter coulmn in Right side of canvas table
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  dataSetFilterArrayProps,
  UserFilterDatasetProps,
} from "./UserFilterDatasetInterfaces";
import FetchData from "../ServerCall/FetchData";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { DataSetStateProps } from "../../redux/DataSet/DatasetStateInterfaces";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuOption from "./MenuOption";
import { Checkbox } from "@mui/material";
import moment from "moment";

const filterOptions: any = {
  text: [
    { key: "beginsWith", value: "Start With" },
    { key: "endsWith", value: "Ends With" },
    { key: "contains", value: "Contains" },
    { key: "exactMatch", value: "Exact Match" },
  ],
  integer: [
    { key: "greaterThan", value: ">  Greater than" },
    { key: "lessThan", value: "<  Less than" },
    { key: "greaterThanOrEqualTo", value: ">= Greater than or Equal to" },
    { key: "lessThanOrEqualTo", value: "<= Less than or Equal to" },
    { key: "equalTo", value: "=  Equal to" },
    { key: "notEqualTo", value: "<> Not Equal to" },
    { key: "between", value: ">= Between <=" },
  ],
  decimal: [
    { key: "greaterThan", value: ">  Greater than" },
    { key: "lessThan", value: "<  Less than" },
    { key: "greaterThanOrEqualTo", value: ">= Greater than or Equal to" },
    { key: "lessThanOrEqualTo", value: "<= Less than or Equal to" },
    { key: "equalTo", value: "=  Equal to" },
    { key: "notEqualTo", value: "<> Not Equal to" },
    { key: "between", value: ">= Between <=" },
  ],
  date: [
    { key: "year", value: "Year" },
    { key: "quarter", value: "Quarter" },
    { key: "month", value: "Month" },
    { key: "yearquarter", value: "Year Quarter" },
    { key: "yearmonth", value: "Year Month" },
    { key: "date", value: "Date" },
    { key: "dayofmonth", value: "Day Of Month" },
    { key: "dayofweek", value: "Day Of Week" },
  ],
  timestamp: [
    { key: "year", value: "Year" },
    { key: "quarter", value: "Quarter" },
    { key: "month", value: "Month" },
    { key: "yearquarter", value: "Year Quarter" },
    { key: "yearmonth", value: "Year Month" },
    { key: "date", value: "Date" },
    { key: "dayofmonth", value: "Day Of Month" },
    { key: "dayofweek", value: "Day Of Week" },
  ],
  relative: [
    { key: "day", value: "Days" },
    { key: "weekSunSat", value: "Weeks (Sun-Sat)" },
    { key: "weekMonSun", value: "Weeks (Mon-Sun)" },
    { key: "month", value: "Months" },
    { key: "year", value: "Years" },
    { key: "rollingWeek", value: "Rolling Weeks" },
    { key: "rollingMonth", value: "Rolling Months" },
    { key: "rollingYear", value: "Rolling Years" },
  ],
};

const UserFilterDataset = ({
  //props
  editMode,
  dataSetFilterArray,
  dataType,
  field,
  tableName,
  displayName,
  tableId,
  dbConnectionId,
  //states
  token,
  schema,
  dbName,
  datasetName,
  setDataSetFilterArray,
}: UserFilterDatasetProps) => {
  let filterFieldData = JSON.parse(JSON.stringify(field));
  console.log(filterFieldData);
  const [resData, setResData] = useState<any[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<any>>(new Set());
  const [inputValues, setInputValues] = useState<Record<any, string>>({});
  const [selectedFilterOptions, setSelectedFilterOptions] =
    useState<string>("");
  const [loading, setLoading] = useState(false);
  const [pickList, setPickList] = useState<any>();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [objectToMakeCall, setObjectToMakeCall] =
    useState<dataSetFilterArrayProps>();
  // const [filterFieldData, setFilterFieldData] = useState<{
  //   exprType: "";
  //   fieldname: "";
  //   fieldtypeoption: "";
  //   includeexclude: "";
  //   isCollapsed: "";
  //   tableId: "";
  //   displayName: "";
  //   dataType: "";
  //   uid: "";
  // }>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuId, setMenuId] = useState<string>("");

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    uid: string
  ) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
    setMenuId(uid);
  };

  const _getFilterType = (dataType: string) => {
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

  const GetPickListItems = async () => {
    let result: any = await fetchFieldData(filterFieldData);

    if (result) {
      if (result.data && result.data.length > 0) {
        result = result.data.map(
          (item: any) => item[Object.keys(result.data[0])[0]]
        );
      }

      let tempResult = ["(All)", ...result];

      filterFieldData["rawselectmembers"] = [...tempResult];
      filterFieldData["userSelection"] = tempResult;
    }
  };
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
        if (!filterFieldData.rawselectmembers) {
          setLoading(true);
          await GetPickListItems();
          setLoading(false);
        }
      }
      filterFieldData["exprTypeTillDate"] = false;
      filterFieldData["filterTypeTillDate"] = "enabled";

      _preFetchData();
    } else if (filterFieldData.fieldtypeoption === "Relative Filter") {
      initialRelativeFilterData();
    }

    // eslint-disable-next-line
  }, []);
  //fetch pick list
  const fetchFieldData = (item: dataSetFilterArrayProps) => {
    //default value of filterOptions
    let filterOptions: string;
    // if (item.dataType === "text") {
    //   filterOptions = "beginsWith";
    // }
    // if (item.dataType === "integer") {
    console.log(item);
    //   filterOptions = "greaterThan";
    // }
    let bodyData: any = {
      tableId: item.tableId,
      fieldName: item.fieldName,
      dataType: item.dataType,
      filterOption: "allValues",
      tableName: tableName,
      schemaName: schema,
      dbName: dbName,

      // filterOptions: item.filterOptions,

      flatefileId: null,
    };

    if (dataType === "timestamp" || dataType === "date") {
      bodyData["timeGrain"] = "year";
    }
    console.log(bodyData);
    return FetchData({
      requestType: "withData",
      method: "POST",
      url: `filter-options?dbconnectionid=${dbConnectionId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
  };

  useEffect(() => {
    if (objectToMakeCall) {
      const data = fetchFieldData(objectToMakeCall);
      setPickList(data);
    }
  }, [objectToMakeCall]);

  const handleClose = (type: string, option?: string, uid?: any) => {
    let updatedObject: any = null;

    switch (type) {
      case "clickOutside":
        setIsMenuOpen(false);
        break;
      case "opt2":
        setDataSetFilterArray((prevArray: any[]) =>
          prevArray.map((item) => {
            if (item.uid === uid) {
              updatedObject = {
                ...item,
                fieldtypeoption: option || "",
                includeexclude:
                  option === "Relative Filter"
                    ? "Include"
                    : item.includeexclude,
              };
              return updatedObject;
            }
            return item;
          })
        );
        setObjectToMakeCall(updatedObject); // Set only the modified object
        setIsMenuOpen(false);
        break;
      case "opt1":
        setDataSetFilterArray((prevArray: any[]) =>
          prevArray.map((item) => {
            if (item.uid === uid) {
              updatedObject = {
                ...item,
                includeexclude: option || "",
              };
              return updatedObject;
            }
            return item;
          })
        );
        setObjectToMakeCall(updatedObject); // Set only the modified object
        setIsMenuOpen(false);
        break;
      default:
        break;
    }
  };

  const handleDelete = (uid: string) => {
    setDataSetFilterArray((prevArray) =>
      prevArray.filter((item) => item.uid !== uid)
    );
  };

  const handleSelectChange = (uid: string, value: string) => {
    // Update the filterOptions directly with the selected value
    setSelectedFilterOptions(value);

    // Update the dataSetFilterArray state
    setDataSetFilterArray((prevArray: dataSetFilterArrayProps[]) => {
      const updatedArray = prevArray.map((item: dataSetFilterArrayProps) =>
        item.uid === uid
          ? {
              ...item,
              filterOptions: value,
            }
          : item
      );

      // Logging the updated array to verify changes
      console.log("Updated Array:", updatedArray);
      return updatedArray;
    });

    console.log("UID:", uid);
    console.log("Selected Value:", value);
  };

  const handleInputChange = (uid: string, value: string) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [uid]: value,
    }));
  };

  const handleKeyDown = async (item: any, event: any) => {
    if (event.key === "Enter") {
      const filterData = {
        field: item.field,
        fieldName: item.displayName,
        filterOperator: selectedFilterOptions[item.uid],
        dataType: item.dataType,
        filterValue: inputValues[item.uid],
      };
      const data: any = await FetchData({
        requestType: "withData",
        method: "POST",
        url: "/DataSet/FilterDatasetRecords",
        headers: { Authorization: `Bearer ${token}` },
        data: {
          schema: schema,
          dbName: dbName,
          datasetName: datasetName,
          filterData: filterData,
        },
      });

      setResData(data.data);
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
  const handleCBChange = (event: any) => {
    if (event.target.name.toString() === "(All)") {
      if (event.target.checked) {
        filterFieldData["userSelection"] = [
          ...filterFieldData.rawselectmembers,
        ];
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
  };
  useEffect(() => {
    console.log("DataSetFilterArray State:", dataSetFilterArray);
  }, [dataSetFilterArray]);

  const SelecPickListCard = ({ item }: any) => {
    let _selectionMembers = null;
    const data = fetchFieldData(item);
    console.log(data);

    if (selectedFilterOptions) {
      console.log("checking");
      _selectionMembers = filterFieldData.rawselectmembers.map(
        (item: any, index: number) => {
          return (
            <label className="UserFilterCheckboxes" key={index}>
              <Checkbox
                checked={
                  filterFieldData.userSelection
                    ? filterFieldData.userSelection.includes(item)
                    : false
                }
                name={item}
                style={{
                  transform: "scale(0.6)",
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
              {item}
            </label>
          );
        }
      );
    }

    return <div>{_selectionMembers}</div>;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {dataSetFilterArray.length > 0 &&
        dataSetFilterArray.map((item) => (
          <div key={item.uid}>
            <div
              className="axisFilterField"
              style={{
                width: "100%",
                display: "flex",
                padding: "3px",
                margin: "3px 6px 3px 6px",
                color: expandedIds.has(item.uid) ? "rgb(175, 153, 219)" : "",
                border: expandedIds.has(item.uid)
                  ? "1px solid rgb(175, 153, 219)"
                  : "",
                fontWeight: expandedIds.has(item.uid) ? "bold" : "",
              }}
            >
              <button
                title="Remove field"
                style={{
                  backgroundColor: "white",
                  outline: "none",
                  border: "none",
                }}
                onClick={() => handleDelete(item.uid)}
              >
                <CloseRoundedIcon
                  className="columnClose"
                  style={{ fontSize: "11px" }}
                />
              </button>
              <div className="columnName">{item.displayName}</div>
              <button
                style={{
                  backgroundColor: "white",
                  outline: "none",
                  border: "none",
                }}
                onClick={(event) => handleMenuClick(event, item.uid)}
              >
                <MoreVertIcon
                  style={{
                    height: "18px",
                    width: "18px",
                    color: "#999999",
                  }}
                />
              </button>
              {isMenuOpen && menuId === item.uid ? (
                <MenuOption
                  open={isMenuOpen}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  filterFieldData={item}
                  uid={item.uid}
                />
              ) : null}

              <button
                onClick={() => handleExpand(item.uid)}
                title={expandedIds.has(item.uid) ? "Collapse" : "Expand"}
                style={{
                  backgroundColor: "white",
                  outline: "none",
                  border: "none",
                }}
              >
                <KeyboardArrowDownRoundedIcon
                  style={{
                    height: "18px",
                    width: "18px",
                    color: "#999999",
                    transform: expandedIds.has(item.uid)
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </button>
            </div>
            {expandedIds.has(item.uid) &&
              item.fieldtypeoption === "Search Condition" && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div>
                    <select
                      style={{
                        backgroundColor: "white",
                        position: "relative",
                        width: "100%",
                        margin: "6px",
                        paddingLeft: "8%",
                        border: ".5px solid #999999",
                        borderRadius: "5px",
                        paddingRight: "70px",
                        fontSize: "12px",
                      }}
                      onChange={(e) => {
                        setSelectedFilterOptions(e.target.value);
                        handleSelectChange(item.uid, e.target.value);
                      }}
                      value={item.filterOptions}
                    >
                      {filterOptions[item.dataType].map((option: any) => (
                        <option
                          key={option.key}
                          value={option.key}
                          style={{
                            backgroundColor: "white",
                            position: "relative",
                            width: "100%",
                            padding: "4%",
                            border: ".5px solid #999999",
                          }}
                        >
                          {option.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Value"
                      value={inputValues[item.uid] || ""}
                      style={{
                        width: "100%",
                        margin: "6px",
                        paddingLeft: "8%",
                      }}
                      onChange={(e) =>
                        handleInputChange(item.uid, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(item, e)}
                    />
                  </div>
                </div>
              )}
            {expandedIds.has(item.uid) &&
              item.fieldtypeoption === "Pick List" && (
                <SelecPickListCard item={item} />
              )}
          </div>
        ))}
    </div>
  );
};

const mapStateToProps = (state: isLoggedProps & DataSetStateProps) => {
  return {
    token: state.isLogged.accessToken,
    schema: state.dataSetState.schema,
    dbName: state.dataSetState.databaseName,
    datasetName: state.dataSetState.datasetName,
  };
};

export default connect(mapStateToProps, null)(UserFilterDataset);
