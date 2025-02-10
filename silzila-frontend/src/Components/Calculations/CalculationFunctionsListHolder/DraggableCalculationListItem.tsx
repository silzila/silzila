import React from 'react'
import { useDrag } from "react-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Tooltip } from '@mui/material';
import { fontSize, palette } from '../../..';
const DraggableCalculationListItem = ({ name, type, fieldData, colsOnly, definition, string,flowName }: any) => {
    const [collect, drag] = useDrag({
        type: "calculationSelected",
        item: { flowName,name, type, fieldData, bIndex: 99 },
        collect: (monitor) => ({
            opacity: monitor.isDragging() ? 0.4 : 1,
            isDragging: monitor.isDragging() ? true : false,
        }),

    });

    return (
        <div ref={drag} className={'styleForColumnsOnly'}>
            <DragIndicatorIcon style={{ marginLeft: "-2px",color:palette.primary.contrastText }} fontSize="small" />
            {
                !collect.isDragging && <Tooltip title={definition} placement="right">
                    <span style={{
                        color: palette.primary.contrastText,
                        fontSize:fontSize.medium,
                        textTransform: "capitalize",
                        fontWeight:'400',
                    }} className="boxText">{
                            name === 'IfElse' ? 'If Else' : String(name[0]).toUpperCase() + name.slice(1)
                        }</span>
                </Tooltip>
            }
            {
                collect.isDragging &&
                <span style={{
                    color: '#404040',
                    textTransform: "capitalize",
                     
                    fontSize:'0.75rem',
                    fontWeight:'400',
                }} className="boxText">{
                        name === 'IfElse' ? 'If Else' : String(name[0]).toUpperCase() + name.slice(1)
                    }</span>
            }

        </div>
    )
}

export default DraggableCalculationListItem
