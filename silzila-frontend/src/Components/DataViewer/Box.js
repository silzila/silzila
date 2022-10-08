// This component is the draggable table column are then dropped into dropzones

import React from "react";
import { useDrag } from "react-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export const Box = ({ name, type, fieldData, colsOnly }) => {
	const [opacity, drag] = useDrag({
		type: "card",
		item: { name, type, fieldData, bIndex: 99 },
		collect: (monitor) => ({
			opacity: monitor.isDragging() ? 0.4 : 1,
		}),
	});

	return (
		<div ref={drag} className={colsOnly ? "styleForColumnsOnly" : "styleForTableHeader"}>
			<DragIndicatorIcon fontSize="small" />
			<span className="boxText">{name}</span>
		</div>
	);
};
