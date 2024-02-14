// This component is the draggable table column are then dropped into dropzones

import React from "react";
import { useDrag } from "react-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export const Box = ({ name, type, fieldData, colsOnly }: any) => {
	const [opacity, drag] = useDrag<any>({
		type: "card",
		item: { name, type, fieldData, bIndex: 99 },
		collect: (monitor: any) => ({
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
