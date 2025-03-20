import React, { useEffect, useState } from 'react'
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useDrag } from 'react-dnd';
import { functionDefinitions } from '../constants';
import { FaInfoCircle } from "react-icons/fa";
import { Button, Tooltip } from '@mui/material';
import { TiTick } from "react-icons/ti";
import { IoWarningOutline } from "react-icons/io5";
import { fontSize, palette } from '../../..';
import MenuIcon from "@mui/icons-material/Menu";
import FunctionsIcon from "@mui/icons-material/Functions";

const DraggableCalculationFunctionItem = ({

    flowUID,
    flows,
    flowPositions,
    activeFlow,
    propKey,
    indexKey,
    remainingSources,
    totalSources,
    cardEditState,
    flowDisplayNames,
    activeConditions,
    sourceTypes,

    deleteFlow,
    setCardEditState,
    setActiveFlow,
    setFlowDisplayNames,

}: {

    flowUID: string,
    flows: any,
    flowPositions: any,
    activeFlow: string,
    propKey: string,
    indexKey: number,
    remainingSources?: number,
    totalSources?: number,
    cardEditState: { [key: string]: boolean },
    flowDisplayNames: { [key: string]: string },
    activeConditions?: number,
    sourceTypes: string[],

    deleteFlow: (propKey: string, flowUID: string) => void,
    setCardEditState: (cardEditState: { [key: string]: boolean }) => void,
    setActiveFlow: (propKey: string, calculationFlowUID: string) => void,
    setFlowDisplayNames: (propKey: string, flowUID: string, displayName: string) => void

}) => {

    const [{ isDragging }, drag] = useDrag({
        type: 'calculationSelected',
        item: { uid: flowUID },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })

    const [showIfElse, setShowIfElse] = useState(false)

    const activeFlowName = flows[flowUID][0].flow

    const aggregationType = (flows[flowUID][0].isAggregation);

    const doesSourceArrayContainField = sourceTypes.includes("field")

    useEffect(() => {
        // used only for if else
        flows[flowUID].map((flow: any) => {
            if (flow.source.length !== 1) {
                setShowIfElse(true)
            }
            else {
                setShowIfElse(false)
            }
        })

    }, [flows[flowUID]])

    const [displayName, setDisplayName] = useState(flowDisplayNames[flowUID])

    // {Minimum_required_fields_no} field/s is/are required, {Minimum required fields no - curren_no_of_fields} is remaining

    return (
        <Tooltip title={(remainingSources !== 0 && activeFlow !== flowUID && activeFlowName !== 'IfElse') ?
            !doesSourceArrayContainField ? "Please add at least one column from the table to proceed." :
                `${totalSources} field${totalSources && totalSources > 1 ? 's' : ''} ${totalSources === 1 ? 'is' : 'are'} required minimum, ${remainingSources} ${remainingSources === 1 ? 'is' : 'are'} remaining` :
            showIfElse && activeFlowName === 'IfElse' ?
                !doesSourceArrayContainField ? "Please add at least one column from the table to proceed." :
                    "One or more conditions are not filled properly" : ""} placement="right">
            <div
                key={indexKey}
                ref={drag}
                onClick={(e) => {
                    e.stopPropagation()
                    setActiveFlow(propKey, flowUID)
                }}
                onDoubleClick={() => {

                    if (cardEditState[flowUID]) return

                    setCardEditState({
                        ...cardEditState,
                        [flowUID]: !cardEditState[flowUID]
                    })
                }}
                style={{
                    position: 'absolute',
                    cursor: "all-scroll",
                    left: Number(flowPositions[flowUID].x) + 'px',
                    top: Number(flowPositions[flowUID].y) + 'px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: activeFlow === flowUID ? "2px solid #2BB9BB" : '2px solid #ccc',
                    minWidth: '200px',
                    color: ' #5d5c5c',
                    textAlign: 'start',
                    backgroundColor: 'white',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: cardEditState[flowUID] ? '0px' : '10px',
                    opacity: isDragging ? 0 : 1,
                }}
            >
                {
                    cardEditState[flowUID] &&
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => {
                            setDisplayName(e.target.value)
                        }}
                        style={{
                            width: '100%',
                            height: "1.5rem",
                            outline: 'none',
                            color: palette.primary.contrastText,
                            border: 'none',
                        }}
                    />
                }
                {
                    !cardEditState[flowUID] &&
                    <button
                        type="button"
                        className="buttonCommon columnClose"
                        title="Remove field"
                        onClick={(e) => {
                            e.stopPropagation()
                            deleteFlow(propKey, flowUID)
                        }}
                    >
                        <CloseRoundedIcon style={{ fontSize: "13px", margin: "auto" }} />
                    </button>
                }
                {
                    !cardEditState[flowUID] && <span style={{
                        color: activeFlow === flowUID ? "#2BB9BB" : palette.primary.contrastText,
                        fontSize:fontSize.medium
                    }}> {flowDisplayNames[flowUID]} </span>
                }
                {
                    cardEditState[flowUID] && <Button onClick={() => {
                        setFlowDisplayNames(propKey, flowUID, displayName)
                        setCardEditState({
                            ...cardEditState,
                            [flowUID]: false
                        })
                    }}>ok</Button>
                }
                {
                    remainingSources !== 0 &&
                    !cardEditState[flowUID] &&
                    activeFlow !== flowUID &&
                    activeFlowName !== 'IfElse' &&
                    <IoWarningOutline style={{ marginLeft: "20px" }} color='orange' />
                }
                {
                    showIfElse && !cardEditState[flowUID] && activeFlow !== flowUID && activeFlowName === 'IfElse' && <IoWarningOutline style={{ marginLeft: "20px" }} color='orange' />
                }
                { !cardEditState[flowUID] && 
                <span style={{ marginLeft: "10px", fontSize: fontSize.medium, display: 'flex', alignItems: "center" }}>
                    {
                        aggregationType ?
                         <FunctionsIcon
                        fontSize="small"
                        sx={{
                            color: palette.primary.contrastText,

                        }}
                        /> 
                        :  
                        <MenuIcon
                            fontSize="small"
                            sx={{
                                color: palette.primary.contrastText,
                            }}
                        />
                    }
                 </span>
                }
            </div>
        </Tooltip>
    )
}

export default DraggableCalculationFunctionItem
