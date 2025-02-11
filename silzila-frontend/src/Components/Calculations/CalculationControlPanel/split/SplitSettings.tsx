import React, { Dispatch, useCallback, useEffect, useRef } from 'react'
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { connect } from 'react-redux';
import NumberInput from '../../common/NumberInput';
import { addSourceInfoInCalculationFlow, updateDecimalSourceValue, updateSource } from '../../../../redux/Calculations/CalculationsActions';
import StringInput from '../../common/StringInput';
import { ToggleButton } from '@mui/material';
import DirectionToggleButton from './DirectionToggleButton'

const SplitSettings = ({

    calculations,
    tabTileProps,
    addSourceInfoIntoCalculationFlow,
    updateSourceData

}: any) => {

    const propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
    const currentCalculationSession = calculations.properties[propKey]?.currentCalculationSession;
    const activeFlowUid = currentCalculationSession.activeFlow;
    const allSourcesInFlowArray = currentCalculationSession?.calculationInfo?.flows[activeFlowUid][0]?.source;
    const [firstInputFocused, setFirstInputFocused] = React.useState(false);
    const [secondInputFocused, setSecondInputFocused] = React.useState(false);
    const [firstSourceCardHoverActive, setFirstSourceCardHoverActive] = React.useState(false);
    const [secondSourceCardHoverActive, setSecondSourceCardHoverActive] = React.useState(false);
    const [firstInputValue, setFirstInputValue] = React.useState(allSourcesInFlowArray?.length === 4 ? allSourcesInFlowArray[1] : allSourcesInFlowArray[0]);
    const [secondInputValue, setSecondInputValue] = React.useState(allSourcesInFlowArray?.length === 4 ? allSourcesInFlowArray[2] : allSourcesInFlowArray[1]);
    const [directionInputValue, setDirectionInputValue] = React.useState(allSourcesInFlowArray?.length === 4 ? allSourcesInFlowArray[3]: allSourcesInFlowArray[2]);
    const activeFlowName = currentCalculationSession?.calculationInfo?.flows[activeFlowUid][0].flow;
    const isFirstRender = useRef(true);

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
                value: firstInputValue,
                sourceIndex: 0
            });
        }
    }, [firstInputValue]);

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
    }, [secondInputValue])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {
            debouncedSetInputValue({
                flow: activeFlowName,
                propKey,
                uid: activeFlowUid,
                value: directionInputValue,
                sourceIndex: 2
            });
        }
    }, [directionInputValue])

    return (
        <div style={{ height: "100%", padding: "10px", borderTop: "1px solid #ccc" }}>
            <div
                style={{ display: 'flex', flexDirection: 'column', marginTop: "10px" }}
                onMouseEnter={() => setFirstSourceCardHoverActive(true)}
                onMouseLeave={() => setFirstSourceCardHoverActive(false)}
            >
                <span style={{ fontSize: "14px", textAlign: "start", margin: "4px" }}>Delimiter</span>
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
                        placeholder='Enter delimiter to split'
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
                <span style={{ fontSize: "14px", textAlign: "start", margin: "4px" }}>Index</span>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    margin: '0 4px',
                    padding: "0 4px",
                    position: 'relative',
                    paddingRight: '10px',
                    border: secondInputFocused ? '1px solid #2BB9BB' : '1px solid lightgray',
                    color: 'rgb(128, 128, 128)',                    
                }}>
                    
                    <NumberInput
                        autoFocus={false}
                        inputValue={secondInputValue}
                        setInputFocused={setSecondInputFocused}
                        setInputValue={setSecondInputValue}
                    />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: "10px" }}>
                <span style={{ fontSize: "14px", textAlign: "start", margin: "4px" }}>Direction</span>
                <DirectionToggleButton direction={directionInputValue} setDirection={setDirectionInputValue} />
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

export default connect(mapStateToProps, mapDispatchToProps)(SplitSettings);