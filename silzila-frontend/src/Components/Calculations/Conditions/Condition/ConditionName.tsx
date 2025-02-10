import { useState } from "react";
import { updateConditionName } from "../../../../redux/Calculations/CalculationsActions";
import { connect } from "react-redux";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Tooltip } from "@mui/material";
import { fontSize, palette } from "../../../..";
const ConditionName = ({
  conditionName,
  propKey,
  flowId,
  conditionUid,

  calculations,
  index,
  activeCondition,
  updateConditionName,
}: {
  conditionName: string;
  propKey: string;
  flowId: string;
  conditionUid: string;
  calculations: any;
  index: number;
  activeCondition: number;
  updateConditionName: (
    propKey: string,
    flowId: string,
    conditionUid: string,
    conditionName: string
  ) => void;
}) => {
  const [editMode, setEditMode] = useState(false);
  const calculationInfo =
    calculations.properties[propKey].currentCalculationSession?.calculationInfo;
  const handleEditConditionName = () => {
    updateConditionName(propKey, flowId, conditionUid, name);
  };
  const [name, setName] = useState<string>(conditionName);
  const showWarning = (): boolean => {
    if (!calculationInfo || !calculationInfo.flows[flowId]) return false;

    const condition = calculationInfo.flows[flowId].find(
      (condition: any) => condition.flowId === conditionUid
    );
    /**
     * result Type is selected and  there is something in evaluation conditions
     */
    if(condition.source.length===0)return true
      const filterId = condition.filter;
    if(condition.condition==='else')return false
      const filter = calculationInfo.conditionFilters[filterId];
      if (!filter) return true;
      if(filter[0].conditions.length===0) return true;
      const hasInvalidCondition = filter[0].conditions.some(
        (condition: any) => !condition.isValid
      );
      return hasInvalidCondition;
  };
  return editMode ? (
    <input
      autoFocus
      style={{
        border: "none",
        outline: "none",
        width: "50%",
        height: "2rem",
        fontSize: fontSize.medium,
        fontWeight: "bold",
        color: palette.primary.contrastText,
        backgroundColor: "transparent",
      }}
      onChange={(e) => setName(e.target.value)}
      value={name}
      className="editTabSelected"
      onBlur={(e) => {
        handleEditConditionName();
        e.stopPropagation();
        setTimeout(() => setEditMode(false), 0);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleEditConditionName();
          setEditMode(false);
        }
      }}
      title="Press enter or click away to save"
    />
  ) : (
    <>
      <span
        onDoubleClick={(event) => {
          event.stopPropagation();
          setEditMode(true);
        }}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: fontSize.medium,
          // flexShrink: 0,
          color: palette.primary.contrastText,
        }}
      >
        {conditionName}
      </span>
      {activeCondition!==index && showWarning() ? (
        <Tooltip title="One or more fileds are not filled properly">
          <WarningAmberIcon
          style={{ color: "orange", marginLeft: "5px", opacity: "0.7" }}
          fontSize="small"
        />
        </Tooltip>
      ) : null}
    </>
  );
};
const mapStateToProps = (state: any) => {
  return {
    calculations: state.calculations,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    updateConditionName: (
      propKey: string,
      flowId: string,
      conditionUid: string,
      conditionName: string
    ) =>
      dispatch(
        updateConditionName(propKey, flowId, conditionUid, conditionName)
      ),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ConditionName);
