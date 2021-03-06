// container component of Graph within Dashboard.
// This component contains
// 	- a graph title portion, which is the drag handle to move the graph around,
// 	- the graph area where one of the graphtypes (bar, line, etc) is displayed.
//	- The entire container can also be resized within the confines of dashboard

import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { connect } from "react-redux";
import {
	updateDashGraphPosition,
	updateDashGraphSize,
	updateGraphHighlight,
} from "../../redux/TabTile/actionsTabTile";
import DashGraph from "./DashGraph";

const GraphRNDDash = ({
	style,
	setStyle,
	style2,

	tabId,
	boxDetails,

	updateDashGraphPos,
	updateDashGraphSz,

	chartProp,
	tabTileProps,
}) => {
	const gridSize = tabTileProps.dashGridSize;
	const dragGridX = gridSize.x;
	const dragGridY = gridSize.y;
	const resizeGridX = gridSize.x;
	const resizeGridY = gridSize.y;

	const [hovering, setHovering] = useState(false);

	useEffect(() => {
		if (!boxDetails.highlight) setHovering(false);
	}, [boxDetails.highlight]);

	return (
		// Drag and resize component
		<Rnd
			disableDragging={tabTileProps.dashMode === "Edit" ? false : true}
			enableResizing={tabTileProps.dashMode === "Edit" ? true : false}
			onMouseEnter={() => {
				if (tabTileProps.dashMode === "Edit") {
					// console.log("Mouse Entered in GraphRNDDash component");
					setHovering(true);
				}
			}}
			onMouseLeave={() => {
				if (!boxDetails.highlight) setHovering(false);
			}}
			bounds="parent"
			// units of pixels to move each time when this component is dragged or resized
			dragGrid={[dragGridX, dragGridY]}
			resizeGrid={[resizeGridX, resizeGridY]}
			// Compute the width * height based on number of background grids each component takes
			style={boxDetails.highlight || hovering ? style2 : style}
			size={{ width: boxDetails.width * gridSize.x, height: boxDetails.height * gridSize.y }}
			position={{ x: boxDetails.x * gridSize.x, y: boxDetails.y * gridSize.y }}
			onDragStart={(e, d) => {
				// console.log(d);
			}}
			onDrag={(e, d) => {
				// console.log(d);
				setStyle({ ...style, border: "1px solid gray" });
			}}
			onDragStop={(e, d) => {
				// console.log(gridSize, d);
				updateDashGraphPos(
					tabId,
					boxDetails.propKey,
					(d.lastX - 5) / gridSize.x,
					(d.lastY - 60) / gridSize.y
				);
				setStyle({ ...style, border: "1px solid transparent" });
			}}
			onResize={(e, direction, ref, position) => {
				var width = ref.style.width.replace("px", "");
				var widthInt = Number(width);

				var height = ref.style.height.replace("px", "");
				var heightInt = Number(height);

				updateDashGraphSz(
					tabId,
					boxDetails.propKey,
					position.width / gridSize.x,
					position.height / gridSize.y,
					widthInt / gridSize.x,
					heightInt / gridSize.y
				);
				setStyle({ ...style, border: "1px solid gray" });
			}}
			onResizeStop={(e, direction, ref, delta, position) => {
				var width = ref.style.width.replace("px", "");
				var widthInt = Number(width);

				var height = ref.style.height.replace("px", "");
				var heightInt = Number(height);

				updateDashGraphSz(
					tabId,
					boxDetails.propKey,
					position.x / gridSize.x,
					position.y / gridSize.y,
					widthInt / gridSize.x,
					heightInt / gridSize.y
				);
				setStyle({ ...style, border: "1px solid transparent" });
			}}
			dragHandleClassName="dragHeader"
		>
			<div className="rndObject" propKey={boxDetails.propKey}>
				<div
					className="dragHeader"
					style={
						tabTileProps.dashMode === "Present"
							? { cursor: "default" }
							: { cursor: "move" }
					}
					propKey={boxDetails.propKey}
				>
					{chartProp.properties[boxDetails.propKey].titleOptions.chartTitle}
				</div>

				<div className="dashChart" id="dashChart" propKey={boxDetails.propKey}>
					<DashGraph propKey={boxDetails.propKey} tabId={tabId} gridSize={gridSize} />
				</div>
			</div>
		</Rnd>
	);
};

const mapStateToProps = (state) => {
	return {
		tabTileProps: state.tabTileProps,
		chartProp: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateDashGraphPos: (tabId, propKey, x, y) =>
			dispatch(updateDashGraphPosition(tabId, propKey, x, y)),
		updateDashGraphSz: (tabId, propKey, x, y, width, height) =>
			dispatch(updateDashGraphSize(tabId, propKey, x, y, width, height)),
		graphHighlight: (tabId, propKey) => dispatch(updateGraphHighlight(tabId, propKey)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphRNDDash);
