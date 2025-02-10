import React, { Dispatch, useCallback, useEffect, useRef } from 'react'
import { connect } from 'react-redux';
import { addSourceInfoInCalculationFlow, updateSource } from '../../../../redux/Calculations/CalculationsActions';
import StringInput from '../../common/StringInput';

const ReplaceSettings = ({

    calculations,
    tabTileProps,
    addSourceInfoIntoCalculationFlow,
    updateSourceString

}: any) => {

    const [firstInputFocused, setFirstInputFocused] = React.useState(false);
    const [secondInputFocused, setSecondInputFocused] = React.useState(false);

    const [firstSourceCardHoverActive, setFirstSourceCardHoverActive] = React.useState(false);
    const [secondSourceCardHoverActive, setSecondSourceCardHoverActive] = React.useState(false);

    const propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
    const currentCalculationSession = calculations.properties[propKey]?.currentCalculationSession;
    const activeFlowUid = currentCalculationSession?.activeFlow;
    const allSourcesInFlowArray = currentCalculationSession?.calculationInfo?.flows[activeFlowUid][0]?.source;

    const [firstInputValue, setFirstInputValue] = React.useState(allSourcesInFlowArray?.length === 3 ? allSourcesInFlowArray[1] : allSourcesInFlowArray[0]);
    const [secondInputValue, setSecondInputValue] = React.useState(allSourcesInFlowArray?.length === 3 ? allSourcesInFlowArray[2] : allSourcesInFlowArray[1]);

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
        value: string,
        uid: string,
        flow: string,
        propKey: string,
        sourceIndex: number
    }) => {
        updateSourceString(propKey, sourceIndex, value);
    }, 200), []);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            debouncedSetInputValue({
                flow: activeFlowName,
                propKey,
                uid: activeFlowUid,
                value: firstInputValue,
                sourceIndex: 0
            });
        }
    }, [firstInputValue]);

    useEffect(() => {
        if (isFirstRender.current && secondInputValue) {
            isFirstRender.current = false;
            debouncedSetInputValue({
                flow: activeFlowName,
                propKey,
                uid: activeFlowUid,
                value: secondInputValue,
                sourceIndex: 1
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
                value: secondInputValue,
                sourceIndex: 1
            });
        }
    }, [secondInputValue]);

    return (
        <div style={{ height: "100%", padding: "10px", borderTop: "1px solid #ccc" }}>

            <div
                style={{ display: 'flex', flexDirection: 'column', marginTop: "10px" }}
                onMouseEnter={() => setFirstSourceCardHoverActive(true)}
                onMouseLeave={() => setFirstSourceCardHoverActive(false)}
            >
                <span style={{ fontSize: "14px", textAlign: "start", margin: "4px" }}>Find</span>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '97%',
                    margin: '0 4px',
                    padding: "0 4px",
                    border: firstInputFocused ? '1px solid #2BB9BB' : '1px solid lightgray',
                    color: 'rgb(128, 128, 128)'
                }}>
                    <StringInput
                        autofocus={false}
                        placeholder='Enter text to find'
                        inputValue={firstInputValue}
                        setInputValue={setFirstInputValue}
                        setInputFocused={setFirstInputFocused}
                    />
                </div>
            </div>

            <div
                style={{ display: 'flex', flexDirection: 'column', marginTop: "10px" }}
                onMouseEnter={() => setSecondSourceCardHoverActive(true)}
                onMouseLeave={() => setSecondSourceCardHoverActive(false)}
            >
                <span style={{ fontSize: "14px", textAlign: "start", margin: "4px" }}>Replace</span>
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
                    <StringInput
                        autofocus={false}
                        placeholder='Enter text to replace'
                        inputValue={secondInputValue}
                        setInputValue={setSecondInputValue}
                        setInputFocused={setSecondInputFocused}
                    />
                </div>
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
        updateSourceString: (propKey: string, sourceIndex: number, newSourceValue: string) =>
            dispatch(updateSource(propKey, sourceIndex, newSourceValue))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ReplaceSettings);