import {
  Box,
  Container,
  IconButton,
  InputLabel,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import { ICalculationSession } from "../../../redux/Calculations/CurrentCalculationSessionInterface";
import DateDropZone from "../DropZones/DateDropZone";
import DatePicker from "../../DatePicker/DatePicker";
import {
  resetSource,
  setSource,
} from "../../../redux/Calculations/CalculationsActions";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { fontSize } from "../../..";
interface IMinMaxDate {
  flowName: string;
  propKey: string;
  calculations: ICalculationSession;
  setSource: (
    propKey: string,
    flowId: string,
    subFlowId: number,
    source: any,
    sourceType: string,
    sourceIndex: number
  ) => void;
  resetSource: (propKey: string, flowId: string, subFlowId: number) => void;
}
const MinMaxDate = ({
  flowName,
  propKey,
  calculations,
  setSource,
  resetSource,
}: IMinMaxDate) => {
  const currCalculation = calculations.properties[propKey];
  const activeFlow = currCalculation.currentCalculationSession?.activeFlow!;
  const calculationInfo =
    currCalculation.currentCalculationSession?.calculationInfo!;
  const source = calculationInfo?.flows[activeFlow][0].source!;
  const sourceType = calculationInfo?.flows[activeFlow][0]!.sourceType!;
  const getName = (): string | null => {
    if (sourceType[0] === "field")
      return calculationInfo.fields[source[0]].displayName;
    return source[0];
  };
  return (
    <Container
      disableGutters
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        // paddingInline: "0.5rem",
        margin: 0,
        paddingLeft: "8px"
      }}
      maxWidth="xs"
    >
      <Box
        sx={{
          padding: "0",
          margin: "0",
          fontWeight: "bold",
          // color: "gray",
          textAlign: "start",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            fontWeight: "bold",
            // color: "gray",
            width: "fit-content",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              // color: "gray",
              // fontFamily: "Axiforma Black",
              fontSize: fontSize.large,
              paddingLeft: "8px"
            }}
          >
            {flowName.replace(/\b\w/g, (char) => char.toUpperCase())}
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "11px",
              color: "#999999",
              marginLeft: "0.3rem",
            }}
          >
            ({source?.length > 0 ? 1 : 0} of 1/1)
          </Typography>
        </Box>
      </Box>
      <DateDropZone
        propKey={propKey}
        flow={calculationInfo?.flows[activeFlow][0]!.flow}
      >
        {source.length === 0 ? (
          <p style={{ fontSize: "11px", color: "#999999", paddingLeft: "8px" }}>
            Drag the source from below column to here
          </p>
        ) : (
          <>
            <ListItem
              className="axisFilterField"
              sx={{
                borderRadius: "5px",
                marginBlock: "5px",
                marginLeft: "0.5rem",
                paddingLeft: "0.3rem",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                height: "24px", // Match this height with TextField height if needed
                width: "95%",
                gap: "0.2rem",
              }}
            >
              <button
                type="button"
                className="buttonCommon columnClose"
                onClick={() => {
                  resetSource(propKey, activeFlow, 0);
                }}
                title="Remove field"
              >
                <CloseRoundedIcon style={{ fontSize: "13px" }} />
              </button>
              {sourceType[0] === "field" ? (
                <>
                  <ListItemText
                    primary={getName()}
                    sx={{ "& .MuiListItemText-primary": { fontSize: "11px" } }}
                  />
                  <Select
                    size="small"
                    sx={{
                      fontFamily: "Axiforma Black",
                      fontSize: "11px",
                      backgroundColor: "white",
                      cursor: "auto",
                      border: "none",
                      outline: "none",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderStyle: "none",
                      },
                      boxShadow: "none",
                      padding: 0,
                      ".MuiSelect-select": {
                        padding: "2px",
                      },
                      ".MuiSelect-select.MuiInputBase-input": {
                        paddingRight: "28px",
                      },
                    }}
                    defaultValue={flowName === "minDate" ? "min" : "max"}
                    disabled
                  >
                    <MenuItem
                      sx={{
                        fontSize: "11px",
                      }}
                      value={flowName === "minDate" ? "min" : "max"}
                      style={{
                        listStyle: "none",
                        cursor: "pointer",
                        color: "black",
                        fontFamily: "Axiforma Black",
                        fontSize: "11px",
                      }}
                      title="Window Function"
                    >
                      {flowName === "minDate" ? "Min" : "Max"}
                    </MenuItem>
                  </Select>
                </>
              ) : null}
            </ListItem>
          </>
        )}
      </DateDropZone>
    </Container>
  );
};
const mapStateToProps = (state: any) => {
  return {
    chartProp: state.chartProperties,
    tabTileProps: state.tabTileProps,
    dynamicMeasureState: state.dynamicMeasuresState,
    chartControls: state.chartControls,
    calculations: state.calculations,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    setSource: (
      propKey: string,
      flowId: string,
      subFlowId: number,
      source: any,
      sourceType: string,
      sourceIndex: number
    ) =>
      dispatch(
        setSource(propKey, flowId, subFlowId, source, sourceType, sourceIndex)
      ),
    resetSource: (propKey: string, flowId: string, subFlowId: number) =>
      dispatch(resetSource(propKey, flowId, subFlowId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MinMaxDate);
