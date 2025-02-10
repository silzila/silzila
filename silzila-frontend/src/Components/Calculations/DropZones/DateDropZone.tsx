import { Box } from "@mui/material";
import { useDrop } from "react-dnd";
import { connect } from "react-redux";
import { useState } from "react";
import {
  addCalculationField,
  addSource,
  setSource,
} from "../../../redux/Calculations/CalculationsActions";
import ShortUniqueId from "short-unique-id";
import { ICalculationSession } from "../../../redux/Calculations/CurrentCalculationSessionInterface";
import { NotificationDialog } from "../../CommonFunctions/DialogComponents";
interface IDropZone {
  children: React.ReactNode;
  propKey: string;
  flow: string;
  sourceLength?:number
  calculations: ICalculationSession;
  addSource: (
    propKey: string,
    flowId: string,
    subFlowId: number,
    source: any,
    sourceType: string,
    sourceIndex?: number
  ) => void;
  addCalculationField: (
    propKey: string,
    calculationFieldUID: string,
    calculationField: any
  ) => void;
  setSource: (
    propKey: string,
    flowId: string,
    subFlowId: number,
    source: any,
    sourceType: string,
    sourceIndex: number
  ) => void;
}
const DateDropZone = ({
  children,
  propKey,
  flow,
  sourceLength,
  calculations,

  addCalculationField,
  setSource,
  addSource,
}: IDropZone) => {
  const [showWarning, setShowWarning] = useState(false);
  const uid = new ShortUniqueId({ length: 4 });
  const activeFlow =
    calculations.properties[propKey]?.currentCalculationSession?.activeFlow!;
  const [, drop] = useDrop({
    accept: ["card"],
    drop: (item: any, monitor) => {
      if (!item.fieldData) return;
      if (
        flow!=="stringToDate" &&!["date", "timestamp"].includes(item.fieldData.dataType.toLowerCase())
      ) {
        setShowWarning(true);
        return;
      }
      else if(flow==="stringToDate"){
        if(!["INT", "INTEGER", "BIGINT", "SMALLINT", "TINYINT", "FLOAT", "REAL", "DOUBLE", "DECIMAL", "NUMERIC", "DOUBLE PRECISION","CHAR", "VARCHAR", "TEXT", "STRING"].includes(item.fieldData.dataType.toUpperCase())){
          setShowWarning(true);
          return;
        }
      }
      const fieldId = uid();
      addCalculationField(propKey, fieldId, {
        tableId: item.fieldData.tableId,
        fieldName: item.fieldData.fieldname,
        displayName: item.fieldData.displayname,
        dataType: item.fieldData.dataType,
      });
      if (flow === "addDateInterval") {
        setSource(propKey, activeFlow, 0, fieldId, "field", 0);
        setSource(propKey, activeFlow, 0, 3, "integer", 1);
        setSource(propKey, activeFlow, 0, "day", "text", 2);
      } else if (flow === "truncateDate") {
        setSource(propKey, activeFlow, 0, fieldId, "field", 0);
        setSource(propKey, activeFlow, 0, "year", "text", 1);
      } else if (["datePartName", "datePartNumber"].includes(flow)) {
        setSource(propKey, activeFlow, 0, fieldId, "field", 0);
        setSource(propKey, activeFlow, 0, "month", "text", 1);
      } else if (["minDate", "maxDate"].includes(flow)) {
        setSource(propKey, activeFlow, 0, fieldId, "field", 0);
      }
      /**
       * Date Difference
       */
      else if(flow==='dateInterval'){
        console.log(sourceLength)
        if(!sourceLength && sourceLength!==0)return
        if (sourceLength === 0) {
          addSource(
            propKey,
            activeFlow,
            0,
            fieldId,
            "field",
            0
          );
          addSource(propKey, activeFlow, 0, "day", "text", 2);
        }
        else if(sourceLength===2) addSource(propKey,
          activeFlow,
          0,
          fieldId,
          "field",
          1)
        else setSource(
          propKey,
          activeFlow,
          0,
          fieldId,
          "field",
          1
        );
      }
      else if(flow==='stringToDate'){
        addSource(
          propKey,
          activeFlow,
          0,
          fieldId,
          "field",
          0
        );
      }
    },
  });
  return (
    <>
      <Box
        ref={drop}
        sx={{
          cursor: "pointer",
          textAlign: "left",
          paddingBottom: "10px",
          paddingTop: "5px",
          borderBottom: "1px solid  #999999",
          height:'auto',
          marginBottom: "0.5rem"
        }}
      >
        {children}
      </Box>
      <NotificationDialog
        openAlert={showWarning}
        onCloseAlert={() => setShowWarning(false)}
        severity="warning"
        testMessage={flow==="stringToDate"?"Only string or number types are allowed":"Only date  or date related fields are allowed"}
      />
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
    addCalculationField: (
      propKey: string,
      calculationFieldUID: string,
      calculationField: any
    ) =>
      dispatch(
        addCalculationField(propKey, calculationFieldUID, calculationField)
      ),
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
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(DateDropZone);
