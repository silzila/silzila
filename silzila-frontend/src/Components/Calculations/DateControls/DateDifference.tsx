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
// import '../../../Fonts/font.css';
import React, { useMemo } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { connect } from "react-redux";
import { ICalculationSession } from "../../../redux/Calculations/CurrentCalculationSessionInterface";
import DateDropZone from "../DropZones/DateDropZone";
import DatePicker from "../../DatePicker/DatePicker";
import {
  addSource,
  deleteSourceFromFlow,
  resetSource,
  setSource,
} from "../../../redux/Calculations/CalculationsActions";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { fontSize } from "../../..";
interface IDateDifference {
  flow: string;
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
  addSource: (
    propKey: string,
    flowId: string,
    subFlowId: number,
    source: any,
    sourceType: string,
    sourceIndex?: number
  ) => void;
  deleteSourceFromFlow: (flowId: string, source: any, propKey: string, sourceIndex: number) => void;
}
const DateDifference = ({
  flow,
  propKey,
  lengthOfSource,
  calculations,
  addSource,
  setSource,
  resetSource,
  deleteSourceFromFlow
}: IDateDifference) => {
  const currCalculation = calculations.properties[propKey];
  const differenceUnits = useMemo(() => {
    return [
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
      }
    ];
  }, []);
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
  const getName = (idx: number): string | null => {
    if (sourceType[idx] === "field")
      return calculationInfo.fields[source[idx]].displayName;
    return source[idx];
  };
  const handleDelete = (
    propKey: string,
    activeFlow: string,
    sourceIdx: number
  ) => {
    /**
     * source length===2  means 1 field/custom date and one  dropdown selected value
     */
    if (source.length === 2)
      resetSource(propKey, activeFlow, 0);
    else deleteSourceFromFlow(activeFlow, source[sourceIdx], propKey, sourceIdx);
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
              // color: "gray",
              // fontFamily:'Axiforma Black',
              fontSize: fontSize.large,
              paddingLeft: "8px",
            }}
          >
            Date Difference
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "11px",
              color: "#999999",
              marginLeft: "0.3rem",
            }}
          >
            ({source?.length - 1 < 0 ? 0 : source.length - 1} of 2/2)
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
                  if (source?.length === 0) {
                    addSource(
                      propKey,
                      activeFlow,
                      0,
                      new Date().toISOString().split("T")[0],
                      "date",
                      0
                    );
                    addSource(propKey, activeFlow, 0, "day", "text", 2);
                  } else if (source?.length === 2)
                    addSource(
                      propKey,
                      activeFlow,
                      0,
                      new Date().toISOString().split("T")[0],
                      "date",
                      1
                    );
                  else
                    setSource(
                      propKey,
                      activeFlow,
                      0,
                      new Date().toISOString().split("T")[0],
                      "date",
                      1
                    );
                }}
              >
                {type.replace(/\b\w/g, (char) => char.toUpperCase())}
              </MenuItem>
            );
          })}
        </Menu>
      </Box>
      <DateDropZone flow={flow} propKey={propKey} sourceLength={source.length}>
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
                height: "24px",
                width: "95%",
                gap: "0.2rem",
              }}
            >
              <button
                type="button"
                className="buttonCommon columnClose"
                onClick={() => {
                  // resetSource(propKey, activeFlow, 0);
                  handleDelete(propKey, activeFlow, 0);
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
                <ListItemText primary={getName(0)} sx={{ '& .MuiListItemText-primary': { fontSize: '11px' } }} />
              ) : null}
            </ListItem>
            {sourceType[1] !== "text" ? (
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
                  height: "2rem", // Match this height with TextField height if needed
                  width: "95%",
                  gap: "0.2rem",
                }}
              >
                <button
                  type="button"
                  className="buttonCommon columnClose"
                  onClick={() => {
                    handleDelete(propKey, activeFlow, 1);
                  }}
                  title="Remove field"
                >
                  <CloseRoundedIcon style={{ fontSize: "13px" }} />
                </button>
                {sourceType[1] === "date" ? (
                  <DatePicker
                    value={source[1]}
                    onChange={(newValue) => {
                      if (!newValue) return;
                      setSource(
                        propKey,
                        activeFlow,
                        0,
                        newValue.toISOString().split("T")[0],
                        "date",
                        1
                      );
                    }}
                  />
                ) : sourceType[1] === "field" ? (
                  <ListItemText primary={getName(1)} sx={{ '& .MuiListItemText-primary': { fontSize: '11px' } }} />
                ) : null}
              </ListItem>
            ) : null}

          </>
        )}
      </DateDropZone>
      {
        source?.length > 0 && (<Box
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
              fontSize: fontSize.medium,
              // color: "gray",
              // fontFamily:'Axiforma Black'
            }}
          >
            Time Difference In
          </InputLabel>
          <Select
            key={sourceType[1] !== "text" ? source[2] : source[1]}
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
            value={source[2] ?? source[1]}
            onChange={(e) =>
              setSource(
                propKey,
                activeFlow,
                0,
                e.target.value,
                "text",
                source[2] === undefined ? 1 : 2
              )
            }
          >
            {differenceUnits.map((Difference) => (
              <MenuItem key={Difference.value} value={Difference.value} sx={{
                fontSize: '11px',

                "&.Mui-selected": {
                  backgroundColor: "rgba(43, 185, 187, 0.3)",
                },
                "&.Mui-selected:hover": {
                  backgroundColor: "rgba(43, 185, 187, 0.5)",
                },
              }}>
                {Difference.label}
              </MenuItem>
            ))}
          </Select>
        </Box>)
      }
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
    deleteSourceFromFlow: (flowId: string, source: any, propKey: string, sourceIndex: number) => dispatch(deleteSourceFromFlow(flowId, source, propKey, sourceIndex)),
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
    addSource: (
      propKey: string,
      flowId: string,
      subFlowId: number,
      source: any,
      sourceType: string,
      sourceIndex?: number
    ) =>
      dispatch(
        addSource(propKey, flowId, subFlowId, source, sourceType, sourceIndex)
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DateDifference);
