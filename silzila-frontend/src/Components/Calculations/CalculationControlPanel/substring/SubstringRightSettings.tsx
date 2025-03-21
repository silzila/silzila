import React, { Dispatch, useCallback, useEffect, useRef } from 'react'
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { connect } from 'react-redux';
import NumberInput from '../../common/NumberInput';
import { addSourceInfoInCalculationFlow, updateSource } from '../../../../redux/Calculations/CalculationsActions';
import IncludeExcludeToggleButton from './IncludeExcludeToggleButton';

const SubstringRightSettings = ({

    calculations,
    tabTileProps,
    addSourceInfoIntoCalculationFlow,
    updateSourceData

}: any) => {

    // second input is for count only.
    const [secondInputFocused, setSecondInputFocused] = React.useState(false);

    const [secondSourceCardHoverActive, setSecondSourceCardHoverActive] = React.useState(false);

    const propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
    const currentCalculationSession = calculations.properties[propKey]?.currentCalculationSession;
    const activeFlowUid = currentCalculationSession?.activeFlow;
    const allSourcesInFlowArray = currentCalculationSession?.calculationInfo?.flows[activeFlowUid][0]?.source;
    const [secondInputValue, setSecondInputValue] = React.useState(allSourcesInFlowArray?.length === 3 ? allSourcesInFlowArray[1] : allSourcesInFlowArray[0]);
    const [includeOrExclude, setIncludeOrExclude] = React.useState(allSourcesInFlowArray?.length === 3 ? allSourcesInFlowArray[2] : allSourcesInFlowArray[1]);
    const baseSource = allSourcesInFlowArray[allSourcesInFlowArray?.length - 1];
    const isFirstRender = useRef(true);

    const activeFlowName = currentCalculationSession?.calculationInfo?.flows[activeFlowUid][0].flow;

    function debounce<T extends (...args: any[]) => any>(func: T, delay: number) {
        let timeout: ReturnType<typeof setTimeout>;

        return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    const debouncedSetInputValue = useCallback(debounce(({
        value,
        propKey,
        sourceIndex
    }: {
        value: string | number,
        uid: string,
        flow: string,
        propKey: string,
        sourceIndex: number
    }) => {
        updateSourceData(propKey, sourceIndex, value);
    }, 200), []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            debouncedSetInputValue({
                flow: activeFlowName,
                propKey,
                uid: activeFlowUid,
                value: secondInputValue,
                sourceIndex: 0
            });
        }
    }, [secondInputValue])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            debouncedSetInputValue({
                flow: activeFlowName,
                propKey,
                uid: activeFlowUid,
                value: includeOrExclude,
                sourceIndex: 1
            });
        }
    }, [includeOrExclude])

    return (
        <div style={{ height: "100%", padding: "10px", borderTop: "1px solid #ccc" }}>
            <span style={{ fontWeight: 'bold', color: 'gray', textAlign: 'start', display: 'flex', gap: '10px', justifyContent: "space-between" }}>
                Character length
            </span>

            <div
                style={{ display: 'flex', flexDirection: 'column', marginTop: "10px" }}
                onMouseEnter={() => setSecondSourceCardHoverActive(true)}
                onMouseLeave={() => setSecondSourceCardHoverActive(false)}
            >
                {/* <span style={{ fontSize: "14px", textAlign: "start", margin: "4px" }}>Count</span> */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '97%',
                    margin: '0 4px',
                    padding: "0 4px",
                    border: secondInputFocused ? '1px solid #2BB9BB' : '1px solid lightgray',
                    color: 'rgb(128, 128, 128)'
                }}>

                    <NumberInput
                        autoFocus={false}
                        inputValue={secondInputValue}
                        setInputFocused={setSecondInputFocused}
                        setInputValue={setSecondInputValue}
                    />
                </div>
                <span style={{ fontWeight: 'bold', color: 'gray', textAlign: 'start', display: 'flex', gap: '10px', justifyContent: "space-between", paddingTop: "10px" }}>Include or Exclude</span>
                <IncludeExcludeToggleButton includeOrExclude={includeOrExclude} setIncludeOrExclude={setIncludeOrExclude} />
            </div>
        </div>
    );
};

export const mapStateToProps = (state: any) => {
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
        updateSourceData: (propKey: string, sourceIndex: number, newSourceValue: string) =>
            dispatch(updateSource(propKey, sourceIndex, newSourceValue))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SubstringRightSettings);