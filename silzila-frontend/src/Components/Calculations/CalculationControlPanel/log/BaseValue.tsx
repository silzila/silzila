import React, {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { DataViewerMiddleStateProps } from "../../../DataViewer/DataViewerMiddleInterfaces";
import { connect } from "react-redux";
import NumberInput from "../../common/NumberInput";
import {
  addSourceInfoInCalculationFlow,
  updateDecimalSourceValue,
} from "../../../../redux/Calculations/CalculationsActions";

const BaseValue = ({
  calculations,
  tabTileProps,

  addSourceInfoIntoCalculationFlow,
  updateDecimalSourceValue,
}: any) => {
  const [inputFocused, setInputFocused] = React.useState(false);
  const [sourceCardHoverActive, setSourceCardHoverActive] =
    React.useState(false);
  const [inputValue, setInputValue] = React.useState(10);
  const propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
  const currentCalculationSession =
    calculations.properties[propKey]?.currentCalculationSession;
  const activeFlowUid = currentCalculationSession?.activeFlow;
  const allSourcesInFlowArray =
    currentCalculationSession?.calculationInfo?.flows[activeFlowUid][0]?.source;
  const isFirstRender = useRef(true);

  // TODO: introduce step here when necessary
  const activeFlowName =
    currentCalculationSession?.calculationInfo?.flows[activeFlowUid][0].flow;

  function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
    let timeout: ReturnType<typeof setTimeout>;

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  const debouncedSetInputValue = useCallback(
    debounce(
      ({
        value,
        uid,
        flow,
        propKey,
      }: {
        value: number;
        uid: string;
        flow: string;
        propKey: string;
      }) => {
        // here we update the second value of the second source in redux

        updateDecimalSourceValue(
          propKey,
          allSourcesInFlowArray.length === 0 ? 0 : 1,
          value
        );
      },
      200
    ),
    []
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      debouncedSetInputValue({
        flow: activeFlowName,
        propKey,
        uid: activeFlowUid,
        value: inputValue,
      });
    }
  }, [inputValue]);

  console.log(currentCalculationSession);

  return (
    <div style={{ height: "50%", padding: "10px" }}>
      <span
        style={{
          fontWeight: "bold",
          color: "gray",
          textAlign: "start",
          display: "flex",
          gap: "10px",
          justifyContent: "space-between",
        }}
      >
        Base value
      </span>
      <div
        style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}
        onMouseEnter={() => setSourceCardHoverActive(true)}
        onMouseLeave={() => setSourceCardHoverActive(false)}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "97%",
            margin: "0 4px",
            padding: "0 4px",
            border: inputFocused ? "1px solid #2BB9BB" : "1px solid lightgray",
            color: "rgb(128, 128, 128)",
          }}
        >
          <div>
            <button
              type="button"
              className="buttonCommon columnClose"
              title="Remove field"
              // onClick={() => handleSourceCardCrossButton(value.sourceUID, index)}
              style={{ width: "13px", height: "13px" }}
            >
              <CloseRoundedIcon
                style={{
                  fontSize: "13px",
                  display: sourceCardHoverActive ? "block" : "none",
                }}
              />
            </button>
          </div>
          <NumberInput
            onBlur={() =>
              updateDecimalSourceValue(
                propKey,
                allSourcesInFlowArray.length === 1 ? 0 : 1,
                inputValue
              )
            }
            autoFocus={false}
            inputValue={inputValue}
            setInputValue={setInputValue}
            setInputFocused={setInputFocused}
          />
        </div>
      </div>
    </div>
  );
};

export const mapStateToProps = (state: DataViewerMiddleStateProps & any) => {
  return {
    tabTileProps: state.tabTileProps,
    calculations: state.calculations,
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {
    addSourceInfoIntoCalculationFlow: (
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
    updateDecimalSourceValue: (
      propKey: string,
      sourceIndex: number,
      value: number
    ) => dispatch(updateDecimalSourceValue(propKey, sourceIndex, value)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseValue);
