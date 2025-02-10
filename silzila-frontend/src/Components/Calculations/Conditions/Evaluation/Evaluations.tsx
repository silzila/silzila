import React, { useEffect, useMemo, useState } from "react";
import EvaluationDropZone from "../../DropZones/EvaluationDropZone";
import { connect } from "react-redux";
import {
  addConditionFilter,
  addSourceInfoInCalculationFlow,
  toggleIsTillDate,
  updateFilterOperator,
  updateTimeGrain,
} from "../../../../redux/Calculations/CalculationsActions";
import "../../../../index.css";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import EvaluationCard from "./EvaluationCard";
import { IEvaluationCondition } from "./EvaluationInterface";
import { fontSize } from "../../../..";

const Evaluations = ({
  calculations,
  tabTileProps,

  addSourceInfoInCalculationFlow,
  addConditionFilter,
  updateTimeGrain,
  updateFilterOperator,
  toggleIsTillDate,
}: any) => {
  const propKey =
    tabTileProps.selectedTabId + "." + tabTileProps.selectedTileId;
  const currentCalculationSession =
    calculations.properties[propKey].currentCalculationSession;
  // const activeCondition = currentCalculationSession.activeCondition;

  const activeFlow = currentCalculationSession.activeFlow;
  const activeConditonIndex = currentCalculationSession.activeCondition;

  // when a source is deleted from the source list, the source data with option should be updated, currently delete isn't working properly because of this

  // useEffect(() => {
  //   activeConditionSourcesIds.forEach((sourceId: string, index: number) => {
  //     setSourceDataWithOption({
  //       ...sourceDataWithOption,
  //       [sourceId]: {
  //         sourceId,
  //         sourceOption:
  //           activeStepSourcesDetails[sourceId].dataType === "timestamp" ||
  //           activeStepSourcesDetails[sourceId].dataType === "date"
  //             ? "Pick List"
  //             : "Search Condition",
  //         dataType: activeStepSourcesDetails[sourceId].dataType,
  //       },
  //     });
  //   });
  // }, [activeConditionSourcesIds]);

  const conditionTypeElse =
    currentCalculationSession.calculationInfo.flows[activeFlow][
      activeConditonIndex ?? 0
    ].condition === "else";
  const filterName =
    currentCalculationSession.calculationInfo.flows[activeFlow][
      activeConditonIndex ?? 0
    ].filter;
  if (!filterName) return null;
  const evaluations: IEvaluationCondition[] =
    currentCalculationSession.calculationInfo.conditionFilters[filterName][0]
      .conditions;
  return (
    <div
      style={{
        minHeight: "4rem",
        height: "fit-content",
        padding: "0",
        position: "relative",
        borderBottom: "1px solid #d3d3d3",
        borderTop: "1px solid #d3d3d3",
        borderRight: 0,
        paddingTop: '0.5rem',
        // background:'red'
      }}
      className="chartFilterGroupContainer hideScrollBar"
    >
      <Typography
        variant="h6"
        align="left"
        sx={{ paddingInline: "0.5rem", fontSize: fontSize.large, fontWeight: 600, color: 'primary.contrastText' }}
      >
        Evaluations
        <Typography
          component="span"
          sx={{
            textAlign: "center",
            fontSize: fontSize.small,
            color: "#999999",
            marginLeft: "0.3rem",
          }}
        >
          {evaluations.length}/64
        </Typography>
      </Typography>
      <EvaluationDropZone
        addSourceInfoInCalculationFlow={addSourceInfoInCalculationFlow}
      >
        {conditionTypeElse ? (
          <Typography
            variant="h6"
            align="center"
            sx={{ paddingleft: "0.5rem", paddingRight: "0.35rem", fontSize: fontSize.medium, color: 'primary.contrastText' }}
          >
            No Conditions for <b>ELSE</b>
          </Typography>
        ) : (
          evaluations.map((evaluation, index: number) => {
            return (
              <EvaluationCard
                evaluation={evaluation}
                evaluationType={evaluation.leftOperandType[0]}
                propKey={propKey}
                filterIdx={index}
                key={evaluation.conditionUID}
                lastDroppedEvaluationUid={currentCalculationSession.calculationInfo.conditionFilters[filterName][0].lastDroppedEvaluationUid}
              />
            );
          })
        )}
      </EvaluationDropZone>
    </div>
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
    addSourceInfoInCalculationFlow: (
      tableId: string,
      calculationFlow: { uid: string; flow: string },
      propKey: string,
      dataType: string,
      isAggregation: boolean,
      aggregation: string,
      conditionNumber: number
    ) =>
      dispatch(
        addSourceInfoInCalculationFlow(
          tableId,
          calculationFlow,
          propKey,
          dataType,
          isAggregation,
          aggregation,
          conditionNumber
        )
      ),

    addConditionFilter: (propKey: string, conditionFilter: any) =>
      dispatch(addConditionFilter(propKey, conditionFilter)),

    updateFilterOperator: (
      propKey: string,
      conditionFilterUid: string,
      sourceUid: string,
      operator: string
    ) =>
      dispatch(
        updateFilterOperator(propKey, conditionFilterUid, sourceUid, operator)
      ),

    updateTimeGrain: (
      propKey: string,
      conditionFilterUid: string,
      sourceIndex: number,
      timeGrain: string
    ) =>
      dispatch(
        updateTimeGrain(propKey, conditionFilterUid, sourceIndex, timeGrain)
      ),

    toggleIsTillDate: (
      propKey: string,
      conditionFilterUid: string,
      sourceIndex: number
    ) => dispatch(toggleIsTillDate(propKey, conditionFilterUid, sourceIndex)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Evaluations);
