// // //this component is use for filterdataset in dataset section or edit dataset

// import { useState } from "react";
// import { connect } from "react-redux";
// import {
//   dataSetFilterArrayProps,
//   UserFilterDatasetProps,
// } from "./UserFilterDatasetInterfaces";
// import FetchData from "../ServerCall/FetchData";
// import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
// import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// import { DataSetStateProps } from "../../redux/DataSet/DatasetStateInterfaces";

// const filterOptions: any = {
//   text: [
//     { key: "beginsWith", value: "Start With" },
//     { key: "endsWith", value: "Ends With" },
//     { key: "contains", value: "Contains" },
//     { key: "exactMatch", value: "Exact Match" },
//   ],
//   integer: [
//     { key: "greaterThan", value: ">  Greater than" },
//     { key: "lessThan", value: "<  Less than" },
//     { key: "greaterThanOrEqualTo", value: ">= Greater than or Equal to" },
//     { key: "lessThanOrEqualTo", value: "<= Less than or Equal to" },
//     { key: "equalTo", value: "=  Equal to" },
//     { key: "notEqualTo", value: "<> Not Equal to" },
//     { key: "between", value: ">= Between <=" },
//   ],
//   decimal: [
//     { key: "greaterThan", value: ">  Greater than" },
//     { key: "lessThan", value: "<  Less than" },
//     { key: "greaterThanOrEqualTo", value: ">= Greater than or Equal to" },
//     { key: "lessThanOrEqualTo", value: "<= Less than or Equal to" },
//     { key: "equalTo", value: "=  Equal to" },
//     { key: "notEqualTo", value: "<> Not Equal to" },
//     { key: "between", value: ">= Between <=" },
//   ],
//   date: [
//     { key: "year", value: "Year" },
//     { key: "quarter", value: "Quarter" },
//     { key: "month", value: "Month" },
//     { key: "yearquarter", value: "Year Quarter" },
//     { key: "yearmonth", value: "Year Month" },
//     { key: "date", value: "Date" },
//     { key: "dayofmonth", value: "Day Of Month" },
//     { key: "dayofweek", value: "Day Of Week" },
//   ],
//   relative: [
//     { key: "day", value: "Days" },
//     { key: "weekSunSat", value: "Weeks (Sun-Sat)" },
//     { key: "weekMonSun", value: "Weeks (Mon-Sun)" },
//     { key: "month", value: "Months" },
//     { key: "year", value: "Years" },
//     { key: "rollingWeek", value: "Rolling Weeks" },
//     { key: "rollingMonth", value: "Rolling Months" },
//     { key: "rollingYear", value: "Rolling Years" },
//   ],
// };

// const UserFilterDataset = ({
//   dataType,
//   tableName,
//   displayName,
//   tableId,
//   datasetId,
//   dbConnectionId,
//   token,
//   schema,
//   dbName,
//   dataSetFilterArray,
//   setDataSetFilterArray,
// }: UserFilterDatasetProps) => {
//   const [resData, setResData] = useState<any[]>([]);
//   const [isExpand, setIsExpand] = useState<boolean>(false);
//   const [id, setId] = useState<any>(null);
//   const [fieldName, setFieldName] = useState<string>("");
//   const [fieldDataType, setFieldDataType] = useState<any>("");
//   const [filterOption, setFilterOptions] = useState<any>("");
//   const [value, setValue] = useState<string>("");

//   const fetchFieldData = async (item: dataSetFilterArrayProps) => {
//     setResData([]);
//     setId(0);
//     let bodyData: any = {
//       tableId: item.tableId,
//       fieldName: item.displayName,
//       dataType: item.dataType,
//       filterOption: "allValues",
//       tableName: tableName,
//       filterType: "number_search",
//       schemaName: schema,
//       dbName: dbName,
//       flateFieldId: null,
//       operator: filterOption,
//       userSelection: [value],
//     };
//     setFieldDataType(item.dataType);
//     let data: any;
//     if (fieldDataType === "text") {
//       data = await FetchData({
//         requestType: "withData",
//         method: "POST",
//         url: `filter-options?dbconnectionid=${dbConnectionId}`,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         data: bodyData,
//       });
//       setResData(data.data);
//     }
//     if(fieldDataType==='interger'){

//     }

//     setId(item.uid);
//     setFieldName(item.displayName);

//     console.log(data.data);
//   };

//   const handleDelete = (uid: any) => {
//     const array = dataSetFilterArray.filter((item) => item.uid !== uid);
//     console.log(array);
//     setDataSetFilterArray(array);
//   };

//   const getdata = (item: any, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       fetchFieldData(item);
//     }
//   };
//   return (
//     <div style={{ display: "flex", flexDirection: "column" }}>
//       {dataSetFilterArray.length > 0 &&
//         dataSetFilterArray.map((item) => (
//           <div key={item.uid}>
//             <div
//               className="axisFilterField"
//               style={{
//                 width: "100%",
//                 display: "flex",
//                 padding: "3px",
//                 margin: "3px 6px 3px 6px",
//               }}
//             >
//               <button
//                 title="Remove field"
//                 style={{
//                   backgroundColor: "white",
//                   outline: "none",
//                   border: "none",
//                 }}
//                 onClick={() => handleDelete(item.uid)}
//               >
//                 <CloseRoundedIcon
//                   className="columnClose"
//                   style={{ fontSize: "11px" }}
//                 />
//               </button>
//               <div className="columnName">{item.displayName}</div>
//               <button
//                 onClick={() => {
//                   setIsExpand((prev) => !prev);
//                   setId(item.uid);
//                   setFieldDataType(item.dataType);
//                 }}
//                 title={isExpand && item.uid === id ? "Collapse" : "Expand"}
//                 style={{
//                   backgroundColor: "white",
//                   outline: "none",
//                   border: "none",
//                 }}
//               >
//                 <KeyboardArrowDownRoundedIcon
//                   style={{
//                     height: "18px",
//                     width: "18px",
//                     color: "#999999",
//                     transform:
//                       isExpand && item.uid === id
//                         ? "rotate(180deg)"
//                         : "rotate(0deg)",
//                   }}
//                 />
//               </button>
//             </div>
//             {isExpand && item.uid === id && (
//               <div style={{ display: "flex", flexDirection: "column" }}>
//                 <div>
//                   <select
//                     style={{
//                       backgroundColor: "white",
//                       position: "relative",
//                       width: "100%",
//                       margin: "6px",
//                       paddingLeft: "8%",
//                       border: ".5px solid #999999",
//                       borderRadius: "5px",
//                       paddingRight: "70px",
//                       fontSize: "12px",
//                     }}
//                     onChange={(e) => {
//                       // Handle select change
//                       console.log(`Selected filter: ${e.target.value}`);

//                       setFilterOptions(e.target.value);
//                     }}
//                   >
//                     {filterOptions[fieldDataType].map((option: any) => (
//                       <option
//                         key={option.key}
//                         value={option.key}
//                         style={{
//                           backgroundColor: "white",
//                           position: "relative",
//                           width: "100%",
//                           padding: "4%",
//                           border: ".5px solid #999999",
//                         }}
//                       >
//                         {option.value}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <input
//                     type={fieldDataType}
//                     placeholder="Value"
//                     value={value}
//                     style={{
//                       width: "100%",
//                       margin: "6px",
//                       paddingLeft: "8%",
//                     }}
//                     onChange={(e) => {
//                       // Handle input change
//                       setValue(e.target.value);
//                     }}
//                     onKeyDown={(e) => getdata(item, e)}
//                   />
//                 </div>
//                 {/* <div>
//                   {resData.map((resItem, index) => (
//                     <div key={index}>
//                       {fieldName}: {resItem[fieldName]}
//                     </div>
//                   ))}
//                 </div> */}
//               </div>
//             )}
//           </div>
//         ))}
//     </div>
//   );
// };

// const mapStateToProps = (state: isLoggedProps & DataSetStateProps) => {
//   return {
//     token: state.isLogged.accessToken,
//     schema: state.dataSetState.schema,
//     dbName: state.dataSetState.databaseName,
//   };
// };

// export default connect(mapStateToProps, null)(UserFilterDataset);

import { useState } from "react";
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
  const [resData, setResData] = useState<any[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<any>>(new Set());
  const [inputValues, setInputValues] = useState<Record<any, string>>({});
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<
    Record<any, string>
  >({});
  const [fieldDataType, setFieldDataType] = useState<string>("");

  const fetchFieldData = async (item: dataSetFilterArrayProps) => {
    const currentFilterOption = selectedFilterOptions[item.uid];
    const currentValue = inputValues[item.uid];

    const bodyData: any = {
      tableId: item.tableId,
      fieldName: item.displayName,
      dataType: item.dataType,
      filterOption: "allValues",
      tableName: tableName,
      filterType: "number_search",
      schemaName: schema,
      dbName: dbName,
      flateFieldId: null,
      operator: currentFilterOption,
      userSelection: [currentValue],
    };
    setFieldDataType(item.dataType);

    let data: any;
    if (item.dataType === "text") {
      data = await FetchData({
        requestType: "withData",
        method: "POST",
        url: `filter-options?dbconnectionid=${dbConnectionId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: bodyData,
      });
      setResData(data.data);
    }

    console.log(data?.data);
  };

  const handleDelete = (uid: any) => {
    const array = dataSetFilterArray.filter((item) => item.uid !== uid);
    setDataSetFilterArray(array);
  };

  const handleInputChange = (uid: any, value: string) => {
    setInputValues((prev) => ({ ...prev, [uid]: value }));
  };

  const handleSelectChange = (uid: any, value: string) => {
    setSelectedFilterOptions((prev) => ({ ...prev, [uid]: value }));
  };

  const handleExpand = (uid: any) => {
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

  const handleKeyDown = (
    item: any,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      fetchFieldData(item);
    }
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
            {expandedIds.has(item.uid) && (
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
                    onChange={(e) =>
                      handleSelectChange(item.uid, e.target.value)
                    }
                    value={selectedFilterOptions[item.uid] || ""}
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
