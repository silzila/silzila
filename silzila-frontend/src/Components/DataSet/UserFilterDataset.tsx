// //this component is use for filterdataset in dataset section or edit dataset

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

interface OwnProps extends UserFilterDatasetProps {
  token: string;
}

const filterOptions: any = {
  text: [
    { key: "equals", value: "Equals" },
    { key: "notEquals", value: "Not Equals" },
    { key: "contains", value: "Contains" },
    { key: "beginsWith", value: "Begins With" },
    { key: "endsWith", value: "Ends With" },
  ],
  integer: [
    { key: "equals", value: "Equals" },
    { key: "notEquals", value: "Not Equals" },
    { key: "greaterThan", value: "Greater Than" },
    { key: "lessThan", value: "Less Than" },
    { key: "between", value: "Between" },
  ],
  date: [
    { key: "year", value: "Year" },
    { key: "quarter", value: "Quarter" },
    { key: "month", value: "Month" },
    { key: "date", value: "Date" },
    { key: "dayofmonth", value: "Day Of Month" },
    { key: "dayofweek", value: "Day Of Week" },
  ],
  relative: [
    { key: "last", value: "Last" },
    { key: "current", value: "Current" },
    { key: "next", value: "Next" },
  ],
};

const UserFilterDataset = ({
  dataType,
  tableName,
  displayName,
  tableId,
  datasetId,
  dbConnectionId,
  token,
  dataSetFilterArray,
  setDataSetFilterArray,
}: OwnProps) => {
  const [resData, setResData] = useState<any[]>([]);
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const [id, setId] = useState<any>(null);
  const [fieldName, setFieldName] = useState<string>("");
  const [fieldDataType, setFieldDataType] = useState<string>("");

  const fetchFieldData = async (item: dataSetFilterArrayProps) => {
    setResData([]);
    let bodyData: any = {
      tableId: item.tableId,
      fieldName: item.displayName,
      dataType: item.dataType,
      filterOption: "allValues",
    };
    setFieldDataType(item.dataType);

    const data: any = await FetchData({
      requestType: "withData",
      method: "POST",
      url: `filter-options?dbconnectionid=${dbConnectionId}&datasetid=${datasetId}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: bodyData,
    });
    setResData(data.data);
    setId(item.uid);
    setFieldName(item.displayName);

    console.log(data.data);
  };

  const handleDelete = (uid: any) => {
    const array = dataSetFilterArray.filter((item) => item.uid !== uid);
    console.log(array);
    setDataSetFilterArray(array);
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
      }}
    >
      {dataSetFilterArray.length > 0 &&
        dataSetFilterArray.map((item) => (
          <div
            key={item.uid}
            style={{ border: "1px solid #999999", width: "100%" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                backgroundColor: "white",
                textAlign: "center",
              }}
            >
              <button
                style={{
                  backgroundColor: "white",
                  outline: "none",
                  border: "none",
                }}
                onClick={() => handleDelete(item.uid)}
              >
                <CloseRoundedIcon
                  style={{ height: "18px", width: "18px", color: "#999999" }}
                />
              </button>
              <div>{item.displayName}</div>
              <button
                onClick={() => {
                  setIsExpand((prev) => !prev);
                  fetchFieldData(item);
                }}
                style={{
                  backgroundColor: "white",
                  outline: "none",
                  border: "none",
                }}
              >
                <KeyboardArrowDownRoundedIcon
                  style={{ height: "18px", width: "18px", color: "#999999" }}
                />
              </button>
            </div>
            {isExpand && item.uid === id && (
              <div>
                <div>
                  <select
                    onChange={(e) => {
                      // Handle select change
                      console.log(`Selected filter: ${e.target.value}`);
                    }}
                  >
                    {filterOptions[fieldDataType].map((option: any) => (
                      <option key={option.key} value={option.key}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="text"
                    onChange={(e) => {
                      // Handle input change
                      console.log(`Entered value: ${e.target.value}`);
                    }}
                  />
                </div>
                <div>
                  {resData.map((resItem, index) => (
                    <div key={index}>
                      {fieldName}: {resItem[fieldName]}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

const mapStateToProps = (state: isLoggedProps, ownProps: any) => {
  return {
    token: state.isLogged.accessToken,
  };
};

export default connect(mapStateToProps, null)(UserFilterDataset);
