/* eslint-disable no-lone-blocks */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDrop } from 'react-dnd';
import { addCalculationField, addInitialCalculationFlow, addSourceInfoInCalculationFlow, deleteFlow, setActiveFlow, setFlowPositions, setResultTypeForIfElse, updateFlowDisplayName, updateFlowPositions } from '../../../redux/Calculations/CalculationsActions'
import { connect } from 'react-redux';
import { DataViewerMiddleStateProps } from '../../DataViewer/DataViewerMiddleInterfaces';
import DraggableCalculationFunctionItem from './DraggableCalculationFunctionItem';
import FlowList from "../BottomMenu/BottomMenu";
import { categorizedOperationsForFlowWarning, minMax } from '../constants';
import { NotificationDialog } from '../../CommonFunctions/DialogComponents';
import { Typography } from '@mui/material';
import { getFlowTypeFromFunctionName } from '../utils';
import { fontSize, palette } from '../../..';

const CalculationCanvas = ({
    calculations,
    tabTileProps,

    addInitialCalculationFlow,
    setFlowPositions,
    setActiveFlow,
    deleteFlow,
    updateFlowPosition,
    createNewSourceInfoIntoCalculationFlow,
    updateFlowDisplayName,
    setResultTypeForIfElse
}: any) => {

    const propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
    const flows = calculations.properties[propKey].currentCalculationSession?.calculationInfo.flows
    const currentCalculationSession = calculations.properties[propKey]?.currentCalculationSession;
    let flowPositions = currentCalculationSession?.flowPositions;
    let flowPositionsKeys = Object.keys(flowPositions);
    const conditionsLength = Object.keys(currentCalculationSession?.calculationInfo?.conditionFilters).length;
    const allFlowsList = currentCalculationSession?.calculationInfo?.flows;
    const [alert, setAlert] = useState<any>(null);
    useEffect(() => {

        flowPositions = currentCalculationSession.flowPositions;
        flowPositionsKeys = Object.keys(flowPositions);

    }, [currentCalculationSession?.calculationInfo?.flowPositions])

    const activeFlow = currentCalculationSession?.activeFlow
    const getIsAggregation = (name: string): boolean => {

        /**
         * include all the flow names  in the array that only supports row level calculations
         */
        if ([
            "String to Date",
            "Date Add",
            "Date Difference",
            "Date Name",
            "Date Number",
            "Date Truncate",
            "Today",
            "Now",
            "IfElse",
            "Lowercase",
            "Uppercase",
            "Propercase",
            "Trim",
            "Substring Left",
            "Substring Right",
            "Length",
            "Left Trim",
            "Right Trim",
            "Replace",
            "Split",
            "Min",
            "Max"
        ].includes(name)) return false
        return true
    }
    const handleNewFlowCreation = (item: any, x: number, y: number) => {
        addInitialCalculationFlow(propKey, { uid: `f${Object.keys(flows).length + 1}`, flow: item.flowName ?? item.name, isAggregation: getIsAggregation(item.name) }, `flt${conditionsLength + 1}`, item.name==='IfElse'?'If Else':item.name);
        setFlowPositions(propKey, `f${Object.keys(flows).length}`, x.toString(), y.toString());
        if (item.name === "IfElse") {
            setResultTypeForIfElse(propKey, `f${Object.keys(flows).length}`, null)
        }
        switch (item.flowName ? item.flowName : item.name) {
            case 'log':

                createNewSourceInfoIntoCalculationFlow(10, {
                    uid: `f${Object.keys(flows).length}`,
                    flow: 'log'
                }, propKey, 'decimal', false, 'sum', 0);
                break;

            case 'replace':

                createNewSourceInfoIntoCalculationFlow('', {
                    uid: `f${Object.keys(flows).length}`,
                    flow: 'replace'
                }, propKey, 'text', false, null, 0);

                createNewSourceInfoIntoCalculationFlow('', {
                    uid: `f${Object.keys(flows).length}`,
                    flow: 'replace'
                }, propKey, 'text', false, null, 0);

                break;

            case 'split': {

                createNewSourceInfoIntoCalculationFlow('', {
                    uid: `f${Object.keys(flows).length}`,
                    flow: 'split'
                }, propKey, 'text', false, null, 0);

                createNewSourceInfoIntoCalculationFlow(1, {
                    uid: `f${Object.keys(flows).length}`,
                    flow: 'split'
                }, propKey, 'decimal', false, null, 0);

                createNewSourceInfoIntoCalculationFlow('left', {
                    uid: `f${Object.keys(flows).length}`,
                    flow: 'split'
                }, propKey, 'text', false, null, 0);

                break;
            }

            case 'substringleft': {
                createNewSourceInfoIntoCalculationFlow(0, {
                    uid: `f${Object.keys(flows).length}`,
                    flow: 'substringleft'
                }, propKey, 'decimal', false, null, 0);

                createNewSourceInfoIntoCalculationFlow('include', {
                    uid: `f${Object.keys(flows).length}`,
                    flow: 'substringleft'
                }, propKey, 'text', false, null, 0);

                break;
            }

            case 'substringright': {
                createNewSourceInfoIntoCalculationFlow(0, {
                    uid: `f${Object.keys(flows).length}`,
                    flow: 'substringright'
                }, propKey, 'decimal', false, null, 0);

                createNewSourceInfoIntoCalculationFlow('include', {
                    uid: `f${Object.keys(flows).length}`,
                    flow: 'substringright'
                }, propKey, 'text', false, null, 0);

                break;
            }

            default:
                break;
        }

    }
    const parentRef = useRef<HTMLDivElement | null>(null);
    const [, dropRef] = useDrop({
        accept: 'calculationSelected',
        drop: (item: any, monitor) => {
            const { x, y } = monitor.getSourceClientOffset() || {};
            if (x === undefined || y === undefined) {
                return;
            }
            // not going to allow more than one flow at this point
            // TODO: allow more than one flow later 
            if (!parentRef.current) {
                return;
            }
            const parentRect = parentRef.current?.getBoundingClientRect();
            const relativeX = x - parentRect.left;
            const relativeY = y - parentRect.top;


            if (item.uid in flows) {

                updateFlowPosition(propKey, item.uid, relativeX.toString(), relativeY.toString());

                return
            }

            if (Object.keys(allFlowsList).length === 1) {

                setAlert({ severity: 'warning', message: 'Multi step calculation will be added in future release' })
                return;
            }

            handleNewFlowCreation(item, relativeX, relativeY);

        },
    })

    const defaultCardEditState = Object.keys(flows).reduce((obj: { [key: string]: boolean }, key: string) => {
        obj[key] = false
        return obj
    }, {})

    const [cardEditState, setCardEditState] = useState(defaultCardEditState)
    const flowDisplayNames = currentCalculationSession.flowDisplayNames;

    const activeCondition = currentCalculationSession?.activeCondition;

    return (
        <div onClick={(e) => {
            setActiveFlow(propKey, null)
        }} ref={_ref => {
            dropRef(_ref)
            parentRef.current = _ref
        }} style={{ width: '100%', position: 'relative', paddingTop: "0.5rem" }}>

            <span style={{
                fontSize: fontSize.large,
                fontWeight: "bold",
                color: palette.primary.contrastText,
            }}>Formula builder</span>

            {/* TODO: This will break with if else reason being flowUID[0 won't always work here] */}
            {
                alert && <NotificationDialog
                    severity={alert.severity}
                    openAlert={alert}
                    onCloseAlert={() => setAlert(null)}
                    testMessage={alert.message}
                />
            }
            {
                flowPositionsKeys.length > 0 ? <div>
                    {
                        flowPositionsKeys.map((flowUID: string, index: number) => {

                            const flowName = flows[flowUID][0].flow
                            const flowType = getFlowTypeFromFunctionName(flowName)
                            if (!flowType) return
                            const minimumSourcesForThisFlow = minMax[flowType][flowName].min
                            const sourceTypes = currentCalculationSession.calculationInfo.flows[flowUID][0].sourceType
                            // const minimumSourcesForThisFlow = categorizedOperations.minimumSingleSource.includes(flowName) ? 1 : 2
                            const lengthBeforeAdjustment = currentCalculationSession.calculationInfo.flows[flowUID][0].sourceType.filter((src: any) => (src === 'field' || src === 'decimal' || src === 'integer')).length
                            const lengthOfSourcesForThisFlow = flowName === 'log' ?
                                lengthBeforeAdjustment === 1 ? 0 : lengthBeforeAdjustment
                                :
                                currentCalculationSession.calculationInfo.flows[flowUID][0].sourceType.filter((src: any) => (src === 'field' || src === 'decimal' || src === 'integer')).length
                            {
                                return flowName !== 'IfElse' ? <DraggableCalculationFunctionItem
                                    sourceTypes={sourceTypes}
                                    remainingSources={minimumSourcesForThisFlow - lengthOfSourcesForThisFlow < 1 ? 0 : minimumSourcesForThisFlow - lengthOfSourcesForThisFlow}
                                    totalSources={minimumSourcesForThisFlow}
                                    indexKey={index}
                                    activeFlow={activeFlow}
                                    flowUID={flowUID}
                                    flows={flows}
                                    cardEditState={cardEditState}
                                    setCardEditState={setCardEditState}
                                    flowPositions={flowPositions}
                                    propKey={propKey}
                                    deleteFlow={deleteFlow}
                                    setActiveFlow={setActiveFlow}
                                    setFlowDisplayNames={updateFlowDisplayName}
                                    flowDisplayNames={flowDisplayNames}
                                /> : <DraggableCalculationFunctionItem
                                    sourceTypes={sourceTypes}
                                    indexKey={index}
                                    activeFlow={activeFlow}
                                    flowUID={flowUID}
                                    flows={flows}
                                    cardEditState={cardEditState}
                                    setCardEditState={setCardEditState}
                                    flowPositions={flowPositions}
                                    propKey={propKey}
                                    deleteFlow={deleteFlow}
                                    setActiveFlow={setActiveFlow}
                                    setFlowDisplayNames={updateFlowDisplayName}
                                    flowDisplayNames={flowDisplayNames}
                                    activeConditions={activeCondition}
                                />
                            }

                        })
                    }
                </div> : <Typography variant="h6" style={{ textAlign: 'center', position:'absolute',top:'50%', color: "#999999", fontSize: fontSize.medium,left:'50%',transform:'translate(-50%,-50%)' }}>Please drag a function from left to here build a formula </Typography>
            }
            {
                calculations.properties[propKey]?.currentCalculationSession && <FlowList />
            }

        </div>
    )
}

const mapStateToProps = (state: DataViewerMiddleStateProps & any) => {
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
        addInitialCalculationFlow: (propKey: string, calculationInfo: any, conditionUid: string, flowDisplayName?: string) =>
            dispatch(addInitialCalculationFlow(propKey, calculationInfo, conditionUid, flowDisplayName)),

        setFlowPositions: (propKey: string, calculationFlowUID: string, x: string, y: string) =>
            dispatch(setFlowPositions(propKey, calculationFlowUID, x, y)),

        setActiveFlow: (propKey: string, calculationFlowUID: string) =>
            dispatch(setActiveFlow(propKey, calculationFlowUID)),

        deleteFlow: (propKey: string, flowUID: string) =>
            dispatch(deleteFlow(propKey, flowUID)),

        updateFlowPosition: (propKey: string, calculationFlowUID: string, x: string, y: string) =>
            dispatch(updateFlowPositions(propKey, calculationFlowUID, x, y)),

        updateFlowDisplayName: (propKey: string, flowUID: string, displayName: string) =>
            dispatch(updateFlowDisplayName(propKey, flowUID, displayName)),

        createNewCalculationField: (propKey: string, calculationFieldUID: string, calculationField: any) =>
            dispatch(addCalculationField(propKey, calculationFieldUID, calculationField)),

        createNewSourceInfoIntoCalculationFlow: (tableId: string, calculationFlow: { uid: string, flow: string }, propKey: string, dataType: string, isAggregation: boolean, aggregation: string, conditionNumber: number,) =>
            dispatch(addSourceInfoInCalculationFlow(tableId, calculationFlow, propKey, dataType, isAggregation, aggregation, conditionNumber)),
        setResultTypeForIfElse: (propKey: string, flowUID: string, resultType: string | null) =>
            dispatch(setResultTypeForIfElse(propKey, flowUID, resultType)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalculationCanvas);
