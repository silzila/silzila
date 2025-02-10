import React, { useEffect, useMemo, useState } from "react";
import DraggableCalculationListItem from "./DraggableCalculationListItem";
import { FormControl, MenuItem, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { functionDefinitions } from "../constants";
import { fontSize, palette } from "../../..";

const CalculationFunctionListHolder = () => {
  const [calculationDataTypeSelected, setCalculationDataTypeSelected] =
    useState<string>("All");
  const [calculationSearchInput, setCalculationSearchInput] =
    useState<string>("");
  const [calculationSearchResult, setCalculationSearchResult] = useState<any[]>(
    []
  );

  useEffect(() => {
    if (calculationSearchInput.length === 0) {
      setCalculationSearchResult([]);
      return;
    }
    const result = functionDefinitions[calculationDataTypeSelected].filter(
      (item: any) =>
        item.fieldName
          .toLowerCase()
          .includes(calculationSearchInput.toLowerCase())
    );
    setCalculationSearchResult(result);
  }, [calculationDataTypeSelected, calculationSearchInput]);

  return (
    <div style={{ widows: "16rem" }}>
      <div
        style={{
          position: "relative",
          background: "white",
          // width: "95%",
          paddingLeft: "0.4rem",
          paddingTop: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: fontSize.large,
            color: palette.primary.contrastText,
            fontWeight: "bold",
            marginBottom: "10px",
            display: "block",
          }}
        >
          Add step
        </span>


        <FormControl
          fullWidth
          sx={{
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <Select
            value={calculationDataTypeSelected}
            onChange={(e) => {
              setCalculationDataTypeSelected(e.target.value);
            }}
            sx={{
                fontSize: fontSize.medium,
                width: "100%",
                height: "26px",
                textAlign: "start",
                "&.MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "1px solid rgb(211, 211, 211)", // Change the border color here
                  },
                  "&:hover fieldset": {
                    border: "1px solid #2bb9bb", // Change the hover border color here
                  },
                  "&.Mui-focused fieldset": {
                    border: "1px solid #2bb9bb", // Change the focused border color here
                  },
                  "&.Mui-focused svg": {
                    color: "#2bb9bb", // Change the arrow color when focused
                  },
                },
            }}
          >
            {Object.keys(functionDefinitions).map((item, index) => (
              <MenuItem
                key={index}
                value={item}
                sx={{
                  fontSize: fontSize.medium,
                  "&:hover": { backgroundColor: "rgb(238, 238, 238)" },
                  
                }}
              >
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => {
              setCalculationSearchInput(e.target.value);
            }}
            style={{
              borderRadius: "20px",
              width: "100%",
              padding: "5px 40px 5px 10px",
              border: "1px solid #ccc",
            }}
          />
          <SearchIcon
            fontSize="small"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)", 
            }}
          />
        </div>
      </div>

      {calculationSearchResult.length !== 0 && (
        <div>
          {calculationSearchResult.map((item: any, index: number) => {
            return (
              <div style={{}} key={index}>
                <DraggableCalculationListItem
                  name={item.fieldName}
                  type="calculationSelected"
                  definition={item.definition}
                  fieldData={"helo"}
                />
              </div>
            );
          })}
        </div>
      )}
      {calculationSearchInput.length === 0 && (
        <div style={{ marginTop: "15px" }}>
          {calculationDataTypeSelected === "Number" ? (
            <>
              <div
                className="calculationList"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {functionDefinitions.Number.map((item, index: number) => {
                  return (
                    <div style={{
                      paddingLeft: "0.4rem"
                    }} key={index}>
                      <DraggableCalculationListItem
                        name={item.fieldName}
                        flowName={item.flowName}
                        type="calculationSelected"
                        definition={item.definition}
                        fieldData={"helo"}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : calculationDataTypeSelected === "String" ? (
            <>
              <div
                className="calculationList"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {functionDefinitions.String.map((item, index: number) => {
                  return (
                    <div style={{
                      paddingLeft: "0.4rem"
                    }} key={index}>
                      <DraggableCalculationListItem
                        name={item.fieldName}
                        flowName={item.flowName}
                        definition={item.definition}
                        type="calculationSelected"
                        fieldData={item.fieldName}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : calculationDataTypeSelected === "Date" ? (
            <>
              <div
                className="calculationList"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {functionDefinitions.Date.map((item, index: number) => {
                  return (
                    <div style={{
                      paddingLeft: "0.4rem"
                    }} key={index}>
                      <DraggableCalculationListItem
                        name={item.fieldName}
                        flowName={item.flowName}
                        definition={item.definition}
                        type="calculationSelected"
                        fieldData={"helo"}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : calculationDataTypeSelected === "All" ? (
            <>
              <div
                className="calculationList"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {functionDefinitions.All.map((item, index: number) => {
                  return (
                    <div style={{ paddingLeft: "0.4rem" }} key={index}>
                      <DraggableCalculationListItem
                        name={item.fieldName}
                        flowName={item.flowName}
                        definition={item.definition}
                        type="calculationSelected"
                        fieldData={"helo"}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : calculationDataTypeSelected === "Condition" ? (
            <>
              <div
                className="calculationList"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {functionDefinitions.Condition.map((item, index: number) => {
                  return (
                    <div style={{paddingLeft: "0.4rem"}} key={index}>
                      <DraggableCalculationListItem
                        name={item.fieldName}
                        definition={item.definition}
                        type="calculationSelected"
                        fieldData={"helo"}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : calculationDataTypeSelected === "Aggregation" ? (
            <>
              <div
                className="calculationList"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {functionDefinitions.Aggregation.map((item, index: number) => {
                  return (
                    <div style={{ paddingLeft: "0.4rem" }} key={index}>
                      <DraggableCalculationListItem
                        name={item.fieldName}
                        definition={item.definition}
                        type="calculationSelected"
                        fieldData={"helo"}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
};

export default CalculationFunctionListHolder;
