import {
  Box,
  Container,
  IconButton,
  InputLabel,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { connect } from "react-redux";
import { ICalculationSession } from "../../../redux/Calculations/CurrentCalculationSessionInterface";
import DateDropZone from "../DropZones/DateDropZone";
import DatePicker from "../../DatePicker/DatePicker";
import TextField from "@mui/material/TextField";
import {
  resetSource,
  setSource,
} from "../../../redux/Calculations/CalculationsActions";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { fontSize } from "../../..";
interface IAddDateInterval {
  propKey: string;
  lengthOfSource: number;
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

const AddDateInterval = ({
  propKey,
  lengthOfSource,
  calculations,
  setSource,
  resetSource,
}: IAddDateInterval) => {
  const currCalculation = calculations.properties[propKey];
  const intervalTypes = useMemo(
    () => [
      {
        value: "day",
        label: "Day",
      },
      {
        value: "week",
        label: "Week",
      },
      {
        value: "month",
        label: "Month",
      },
      {
        value: "year",
        label: "Year",
      },
    ],
    []
  );
  const valueTypes = useMemo(
    () => ["text", "decimal", "integer", "boolean", "date"],
    []
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const activeFlow = currCalculation.currentCalculationSession?.activeFlow!;
  const calculationInfo =
    currCalculation.currentCalculationSession?.calculationInfo!;
  const source = calculationInfo?.flows[activeFlow][0].source!;
  const sourceType = calculationInfo?.flows[activeFlow][0]!.sourceType!;
  const [input, setInput] = useState<{
    intervalType: string;
    intervalValue: string;
  }>({
    intervalType: source[2],
    intervalValue: source[1],
  });
  useEffect(() => {
    setInput({
      intervalType: source[2],
      intervalValue: source[1],
    });
  }, [source]);
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
              fontSize: fontSize.large,
              paddingLeft: "8px",
              // color: "gray",
            }}
          >
            Date Add
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "11px",
              color: "#999999",
              marginLeft: "0.3rem",
            }}
          >
            ({source?.length === 3 ? 1 : 0} of 1/1)
          </Typography>
        </Box>
        <Tooltip title="Add Custom Date">
          <IconButton
            size="small"
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
            }}
          >
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
        >
          {valueTypes.map((type, index) => {
            return (
              <MenuItem
                key={index}
                sx={{ width: "7rem" }}
                disabled={type !== "date"}
                value={type}
                onClick={() => {
                  setAnchorEl(null);
                  setSource(
                    propKey,
                    activeFlow,
                    0,
                    new Date().toISOString().split("T")[0],
                    "date",
                    0
                  );
                  setSource(propKey, activeFlow, 0, 3, "integer", 1);
                  setSource(propKey, activeFlow, 0, "day", "text", 2);
                }}
              >
                {type.replace(/\b\w/g, (char) => char.toUpperCase())}
              </MenuItem>
            );
          })}
        </Menu>
      </Box>

      <DateDropZone
        propKey={propKey}
        flow={calculationInfo?.flows[activeFlow][0]!.flow}
      >
        {source.length === 0 ? (
          <p style={{ fontSize: "11px", color: "#999999", paddingLeft: "8px", }}>
            Drop a column or click + to add static values
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
              {sourceType[0] === "date" ? (
                <DatePicker
                  value={source[0]}
                  onChange={(newValue) => {
                    if (!newValue) return;
                    setSource(
                      propKey,
                      activeFlow,
                      0,
                      newValue.toISOString().split("T")[0],
                      "date",
                      0
                    );
                  }}
                />
              ) : sourceType[0] === "field" ? (
                <ListItemText
                  primary={getName()}
                  sx={{ "& .MuiListItemText-primary": { fontSize: "11px" } }}
                />
              ) : null}
            </ListItem>
          </>
        )}
      </DateDropZone>
      {source.length > 0 ? (
        <Box
          sx={{
            cursor: "pointer",
            textAlign: "left",
            paddingBottom: "10px",
            minHeight: "4rem",
            marginTop: "0",
          }}
        >
          <InputLabel
            sx={{
              marginLeft: "0.5rem",
              marginTop: "0.5rem",
              // color: "gray",
              fontSize: "12px",
            }}
          >
            Time Period
          </InputLabel>
          <Select
            key={input.intervalType}
            labelId="demo-simple-select-readonly-label"
            id="demo-simple-select-readonly"
            sx={{
              width: "95%",
              marginLeft: "0.5rem",
              height: "2rem",
              marginTop: "0.5rem",
              fontSize: "11px",

              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2bb9bb",
              },
            }}
            // label="Interval Options"
            value={input.intervalType}
            onChange={(e) =>
              setSource(propKey, activeFlow, 0, e.target.value, "text", 2)
            }
          >
            {intervalTypes.map((intervalType) => (
              <MenuItem key={intervalType.value} value={intervalType.value} sx={{
                fontSize: "11px",

                "&.Mui-selected": {
                  backgroundColor: "rgba(43, 185, 187, 0.3)",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "rgba(43, 185, 187, 0.5)",
                },
              }}>
                {intervalType.label}
              </MenuItem>
            ))}
          </Select>
          <InputLabel
            sx={{
              marginLeft: "0.5rem",
              marginTop: "0.5rem",
              fontSize: "12px",
              // color: "gray",
              fontFamily: "Axiforma Black",
            }}
          >
            Number of {input.intervalType}/s
          </InputLabel>
          <TextField
            error={!source[1]}
            id="outlined-number"
            type="number"
            value={input.intervalValue}
            onChange={(e) => {
              setInput((prev) => ({ ...prev, intervalValue: e.target.value }));
            }}
            InputLabelProps={{
              shrink: true,
            }}
            onBlur={(e) => {
              setSource(propKey, activeFlow, 0, e.target.value, "integer", 1);
            }}
            sx={{
              width: "95%",
              marginLeft: "0.5rem",
              "& .MuiInputBase-root": {
                height: "2rem",
                fontSize: "11px",
              },
              "& .MuiTextField-root": {
                outline: "none",
                border: "none",
              },
              border: "none",
              marginTop: "0.5rem",
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "#2bb9bb",
                },
              },
            }}
          />
        </Box>
      ) : null}
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
export default connect(mapStateToProps, mapDispatchToProps)(AddDateInterval);
