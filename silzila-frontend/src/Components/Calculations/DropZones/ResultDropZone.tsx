import { useDrop } from "react-dnd";
import { connect } from "react-redux";
import ShortUniqueId from "short-unique-id";
import {
  addCalculationField,
  addConditionFilter,
  addResultForIfElse,
  setResultTypeForIfElse,
  updateSearchConditionFilter,
} from "../../../redux/Calculations/CalculationsActions";
import {
  ICalculationSession,
  ICurrentCalculationSession,
} from "../../../redux/Calculations/CurrentCalculationSessionInterface";
import { isSimilarDataType } from "../../CommonFunctions/CommonFunctions";
import {
  NotificationDialog,
  NotificationDialogV2,
} from "../../CommonFunctions/DialogComponents";
import { useRef, useState } from "react";
const ResultDropZone = ({
  calculations,
  tabTileProps,
  children,
  addCalculationField,
  addResultForIfElse,
  setResultTypeForIfElse,
}: {
  calculations: any;
  tabTileProps: any;
  children: React.ReactNode;
  addCalculationField: (
    propKey: string,
    calculationFieldUID: string,
    calculationField: any
  ) => void;
  addConditionFilter: (propKey: string, conditionFilter: any) => void;
  updateSearchConditionFilter: (
    propKey: string,
    conditionFilterUid: string,
    sourceUid: string,
    shouldExclude: boolean
  ) => void;
  addResultForIfElse: (
    propKey: string,
    flowId: string,
    conditionIndex: number,
    sourceId: string,
    sourceType: string
  ) => void;
  setResultTypeForIfElse: (
    propKey: string,
    flowId: string,
    resultType: string
  ) => void;
}) => {
  const propKey =
    tabTileProps.selectedTabId.toString() +
    "." +
    tabTileProps.selectedTileId.toString();
  const currentCalculationSession =
    calculations.properties[propKey].currentCalculationSession;
  const uid = new ShortUniqueId({ length: 4 });
  const conditionNumber = currentCalculationSession.activeCondition;
  // introduce step
  const aggregation =
    currentCalculationSession.calculationInfo.flows[
      currentCalculationSession.activeFlow
    ][conditionNumber].isAggregation;
  const selectedFlow =
    currentCalculationSession.calculationInfo.flows[
    currentCalculationSession.activeFlow
    ][conditionNumber];
  const selectedResultType =
    currentCalculationSession.calculationInfo.selectedResultType[
    currentCalculationSession.activeFlow
    ];
  /**
   * excluding current calculation condition from the list of conditions
   */
  const onlyConditionWithResultField =
    currentCalculationSession.calculationInfo.flows[
      currentCalculationSession.activeFlow
    ].filter(
      (condition: any) =>
        condition.source.length === 1 &&
        condition.flowId !== selectedFlow.flowId
    ).length === 0;

  const safeToDrop = (type: string): boolean => {
    if (["integer", "decimal"].includes(selectedResultType)) {
      if (selectedResultType === type.toLowerCase()) return true;
      else return false;
    }
    return isSimilarDataType(selectedResultType, type);
  }

  const [openAlert, setOpenAlert] = useState(false);
  const textMessage = useRef<string[]>([]);
  const canDrop = (): boolean => selectedFlow.condition !== "Else";
  const [, dropResult] = useDrop({
    accept: ["card", "step", "calculation"],
    canDrop: canDrop,
    drop(item: any) {
      if (!item.fieldData) return;

      if (!selectedResultType || onlyConditionWithResultField) {
        setResultTypeForIfElse(
          propKey,
          currentCalculationSession.activeFlow,
          item.fieldData.dataType
        );
        if (item.type === "card") {
          const uId = uid();
          if (!uId) return;

          addCalculationField(propKey, uId, {
            tableId: item.fieldData.tableId,
            fieldName: item.fieldData.fieldname,
            displayName: item.fieldData.displayname,
            dataType: item.fieldData.dataType,
          });
          addResultForIfElse(
            propKey,
            currentCalculationSession.activeFlow,
            conditionNumber,
            uId,
            "field"
          );
        }
      } else {
        if (!safeToDrop(item.fieldData.dataType)) {
          textMessage.current.push(
            `Data type should be consistent on every result step of a condition. Please add column or static value of same data type on all results in a condition.`
          );
          textMessage.current.push(
            "Please select a field of similar datatype or change the selected datatype by deleting all the results for all conditions"
          );
          setOpenAlert(true);
          return;
        }
        if (item.type === "card") {
          const uId = uid();
          if (!uId) return;

          addCalculationField(propKey, uId, {
            tableId: item.fieldData.tableId,
            fieldName: item.fieldData.fieldname,
            displayName: item.fieldData.displayname,
            dataType: item.fieldData.dataType,
          });
          addResultForIfElse(
            propKey,
            currentCalculationSession.activeFlow,
            conditionNumber,
            uId,
            "field"
          );
        }
      }
    },
  });
  return (
    <>
      <div
        ref={dropResult}
        style={{
          cursor: "pointer",
          margin: "0",
          textAlign: "left",
          paddingBottom: "10px",
          paddingTop: "5px",
          minHeight: "4.5rem",
          // backgroundColor:'red',
          // paddingInline: "0.5rem",
          paddingLeft: "0.5rem",
          paddingRight: "0.35rem"
        }}
      >
        {children}
      </div>
      <NotificationDialog
        severity={"warning"}
        openAlert={openAlert}
        onCloseAlert={() => {
          textMessage.current = [];
          setOpenAlert(false);
        }}
        testMessage={textMessage.current[0]}
      />
      {/* <NotificationDialogV2
        severity="warning"
        textMessages={textMessage.current}
        openAlert={openAlert}
        onCloseAlert={() => {

        }}
      /> */}
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
    addCalculationField: (
      propKey: string,
      calculationFieldUID: string,
      calculationField: any
    ) =>
      dispatch(
        addCalculationField(propKey, calculationFieldUID, calculationField)
      ),
    addConditionFilter: (propKey: string, conditionFilter: any) =>
      dispatch(addConditionFilter(propKey, conditionFilter)),
    updateSearchConditionFilter: (
      propKey: string,
      conditionFilterUid: string,
      sourceUid: string,
      shouldExclude: boolean
    ) =>
      dispatch(
        updateSearchConditionFilter(
          propKey,
          conditionFilterUid,
          sourceUid,
          shouldExclude
        )
      ),
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
    setResultTypeForIfElse: (
      propKey: string,
      flowId: string,
      resultType: string
    ) => dispatch(setResultTypeForIfElse(propKey, flowId, resultType)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResultDropZone);
