import React, { useMemo } from "react";
import {
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ResultDropZone from "../../DropZones/ResultDropZone";
import { connect } from "react-redux";
import ResultCard from "./ResultCard";
import { isSimilarDataType } from "../../../CommonFunctions/CommonFunctions";
import { addResultForIfElse, resetResultForIfElse, setResultTypeForIfElse } from "../../../../redux/Calculations/CalculationsActions";
import { fontSize, palette } from "../../../..";

const Result = ({
  calculations,
  tabTileProps,
  resetResultForIfElse,
  setResultTypeForIfElse,
  addResultForIfElse
}: {
  calculations: any;
  tabTileProps: any;
  resetResultForIfElse: (
    propKey: string,
    flowId: string,
    conditionIndex: number
  ) => void;
  setResultTypeForIfElse: (
    propKey: string,
    flowId: string,
    resultType: string) => void;
  addResultForIfElse: (
    propKey: string,
    flowId: string,
    conditionIndex: number,
    sourceId: string,
    sourceType: string
  ) => void;
}) => {
  const valueTypes = useMemo(
    () => ["text", "decimal", "integer", "boolean", "date"],
    []
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const propKey =
    tabTileProps.selectedTabId.toString() +
    "." +
    tabTileProps.selectedTileId.toString();
  const currentCalculationSession =
    calculations.properties[propKey].currentCalculationSession;
  const conditionNumber = currentCalculationSession.activeCondition;
  const selectedFlow =
    currentCalculationSession.calculationInfo.flows[
    currentCalculationSession.activeFlow
    ][conditionNumber];
  const selectedResultType =
    currentCalculationSession.calculationInfo.selectedResultType[
    currentCalculationSession.activeFlow
    ];

  const [customResultType, setCustomResultType] = React.useState<{
    type: string;
    condtionIndex: number;
  } | null>(null);

  const onlyConditionWithResultField =
    currentCalculationSession.calculationInfo.flows[
      currentCalculationSession.activeFlow
    ].filter(
      (condition: any) =>
        condition.source.length === 1 &&
        condition.flowId !== selectedFlow.flowId
    ).length === 0;
  const hasSource = selectedFlow.source.length > 0;

  const safeToAddType = (type: string): boolean => {
    if (selectedFlow.condition !== "Else") {
      if (!selectedResultType || onlyConditionWithResultField) return true;
      if (["integer", "decimal"].includes(selectedResultType)) {
        if (selectedResultType === type.toLowerCase()) return true;
        else return false;
      }
      return isSimilarDataType(selectedResultType, type);
    }
    return false;
  };

  return (
    <>
      <Box
        sx={{
          paddingTop: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          align="left"
          sx={{ paddingInline: "0.5rem", fontSize: fontSize.large, fontWeight: 600, color: 'primary.contrastText' }}
        >
          Results
          <Typography
            component="span"
            sx={{
              textAlign: "center",
              fontSize: "11px",
              color: "#999999",
              marginLeft: "0.3rem",
            }}
          >
            {selectedFlow.source.length}/1
          </Typography>
        </Typography>
        <Tooltip title="Add Result">
          <IconButton
            onClick={(e: any) => setAnchorEl(e.currentTarget)}
            sx={{ padding: 0, marginRight: "0.3rem" }}
            disabled={selectedFlow.condition === "Else"}
          >
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {valueTypes.map((type, index) => {
          return (
            <MenuItem
              key={index}
              sx={{ width: "7rem", fontSize: fontSize.small, color: palette.primary.contrastText }}
              disabled={!safeToAddType(type)}
              value={type}
              onClick={() => {
                if (!selectedResultType || onlyConditionWithResultField) {
                  setResultTypeForIfElse(
                    propKey,
                    currentCalculationSession.activeFlow,
                    type
                  );
                }
                addResultForIfElse(
                  propKey,
                  currentCalculationSession.activeFlow,
                  conditionNumber,
                  type === 'date' ? new Date().toISOString().split('T')[0] : type === 'boolean' ? 'false' : type === 'text' ? '' : '0',
                  type
                )
                // resetResultForIfElse(
                //   propKey,
                //   currentCalculationSession.activeFlow,
                //   conditionNumber
                // );
                // setCustomResultType({ type, condtionIndex: conditionNumber });
                setAnchorEl(null);
              }}
            >
              {type.replace(/\b\w/g, (char) => char.toUpperCase())}
            </MenuItem>
          );
        })}
      </Menu>
      {/* <Divider /> */}
      <ResultDropZone>
        {hasSource ? (
          <ResultCard
            key={selectedFlow.source[0]}
            sourceId={selectedFlow.source[0] as string}
            propKey={propKey}
            sourceType={selectedFlow.sourceType[0] as string}
          />
        ) : null}
      </ResultDropZone>
    </>
  );
};
const mapStateToProps = (state: any) => {
  return {
    calculations: state.calculations,
    tabTileProps: state.tabTileProps,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    resetResultForIfElse: (
      propKey: string,
      flowId: string,
      conditionIndex: number
    ) => {
      dispatch(resetResultForIfElse(propKey, flowId, conditionIndex));
    },
    setResultTypeForIfElse: (
      propKey: string,
      flowId: string,
      resultType: string
    ) => dispatch(setResultTypeForIfElse(propKey, flowId, resultType)),
    addResultForIfElse: (
      propKey: string,
      flowId: string,
      conditionIndex: number,
      sourceId: string,
      sourceType: string
    ) =>
      dispatch(
        addResultForIfElse(
          propKey,
          flowId,
          conditionIndex,
          sourceId,
          sourceType
        )
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Result);
