// This component is part of table rows within canvas.
// This circular point is the start of drag action to create arrow / relationship

import React, { useRef, useState } from "react";
import Xarrow from "react-xarrows";
// const connectPointStyle:CSS.Properties = {
// 	position: "absolute",
// 	width: 10,
// 	height: 10,
// 	cursor: "pointer",
// 	borderRadius: "50%",
// };

// const connectPointOffset = {
// 	top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
// 	bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" },
// 	left: { left: "50%", top: "50%", transform: "translate(-50%, -50%)" },
// 	right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
// };

interface ConnectPointsWrapperProps {
	itemId: string;
	dragRef: any;
	boxRef: any;
	index: number;
	itemType: string;
	columnName: string;
	tableName: string;
	table_uid: string;
	schema: string;
	table_Id: string;
}

const ConnectPointsWrapper = ({
	itemId,
	dragRef,
	boxRef,
	index,
	itemType,
	columnName,
	tableName,
	table_uid,
	schema,
	table_Id,
}: ConnectPointsWrapperProps) => {
	// TODO: need to specify type
	const ref1 = useRef<any>(null);
	const [position, setPosition] = useState({});
	const [beingDragged, setBeingDragged] = useState(false);

	return (
		<div
			className="connectPoint"
			ref={ref1}
			style={{
				position: "absolute",
				width: 10,
				height: 10,
				cursor: "pointer",
				borderRadius: "50%",
				// ...connectPointStyle,
				left: "100%",
				top: "50%",
				transform: "translate(-50%, -50%)",
				// ...connectPointOffset["right"],
				...position,
			}}
			draggable
			onDragStart={e => {
				setBeingDragged(true);

				e.dataTransfer.setData("connectItemId", itemId);
				e.dataTransfer.setData("connectIndex", index.toString());
				e.dataTransfer.setData("connectTableName", tableName);
				e.dataTransfer.setData("connectColumnName", columnName);
				e.dataTransfer.setData("connectItemType", itemType);
				e.dataTransfer.setData("connecttableUid", table_uid);
				e.dataTransfer.setData("schema", schema);
				e.dataTransfer.setData("tableId", table_Id);
			}}
			onDragEnd={() => {
				setPosition({});
				setBeingDragged(false);
			}}
			onDrag={e => {
				const { offsetTop, offsetLeft } = boxRef.current;
				const { x, y } = dragRef.current.state;
				setPosition({
					position: "fixed",
					left: e.clientX - x - offsetLeft,
					top: e.clientY - y - offsetTop,
					transform: "none",
					opacity: 0,
				});
			}}
		>
			{beingDragged ? <Xarrow start={itemId} end={ref1} /> : null}
		</div>
	);
};

export default ConnectPointsWrapper;
