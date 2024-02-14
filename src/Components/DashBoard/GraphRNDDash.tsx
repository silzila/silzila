// container component of Graph within Dashboard.
// This component contains
// 	- a graph title portion, which is the drag handle to move the graph around,
// 	- the graph area where one of the graphtypes (bar, line, etc) is displayed.
//	- The entire container can also be resized within the confines of dashboard

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import DashGraph from "./DashGraph";
import { Dispatch } from "redux";
import { updateDashGraphPosition, updateDashGraphSize } from "../../redux/TabTile/TabActions";
import { Rnd } from "react-rnd";

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
	chartControls,
}: any) => {
	const gridSize = tabTileProps.dashGridSize;
	const dragGridX = gridSize.x;
	const dragGridY = gridSize.y;
	const resizeGridX = gridSize.x;
	const resizeGridY = gridSize.y;

	const [hovering, setHovering] = useState<boolean>(false);

	useEffect(() => {
		if (!boxDetails.highlight) setHovering(false);
	}, [boxDetails.highlight]);

	return (
		// Drag and resize component
		<Rnd
			disableDragging={
				tabTileProps.dashMode === "Edit"
					? chartControls.properties[boxDetails.propKey].cardControls.isDragging
						? true
						: false
					: true
			}
			enableResizing={tabTileProps.dashMode === "Edit" ? true : false}
			onMouseEnter={() => {
				if (tabTileProps.dashMode === "Edit") {
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
			onDragStart={(e: any, d: any) => {}}
			onDrag={(e: any, d: any) => {
				setStyle({ ...style, border: "1px solid gray" });
			}}
			onDragStop={(e: any, d: any) => {
				updateDashGraphPos(
					tabId,
					boxDetails.propKey,
					(d.lastX - 5) / gridSize.x,
					(d.lastY - 80) / gridSize.y
					// (d.lastY - 60) / gridSize.y
				);
				setStyle({ ...style, border: "1px solid transparent" });
			}}
			onResize={(e: any, direction: any, ref: any, position: any) => {
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
			onResizeStop={(e: any, direction: any, ref: any, delta: any, position: any) => {
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
			{/* <div className="rndObject" propKey={boxDetails.propKey}> */}

			{chartProp.properties[boxDetails.propKey].chartType === "simplecard" ? (
				<div className="rndObject">
					<div
						className="dragHeader"
						style={{
							cursor: "move",
							border: "none",
							fontWeight: "unset",
							color: "unset",
							fontFamily: "unset",
							height: "100%",
							width: "100%",
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
						}}
					>
						<div
							className="dashChart"
							id="dashChart"
							// propKey={boxDetails.propKey}
						>
							<DashGraph
								propKey={boxDetails.propKey}
								tabId={tabId}
								gridSize={gridSize}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="rndObject">
					<div
						className="dragHeader"
						style={
							tabTileProps.dashMode === "Present"
								? { cursor: "default" }
								: { cursor: "move" }
						}
						// propKey={boxDetails.propKey}
					>
						{chartProp.properties[boxDetails.propKey].titleOptions.chartTitle}
					</div>

					<div
						className="dashChart"
						id="dashChart"
						// propKey={boxDetails.propKey}
					>
						<DashGraph propKey={boxDetails.propKey} tabId={tabId} gridSize={gridSize} />
					</div>
				</div>
			)}
		</Rnd>
	);
};

const mapStateToProps = (state: any) => {
	return {
		tabTileProps: state.tabTileProps,
		chartProp: state.chartProperties,
		chartControls: state.chartControls,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateDashGraphPos: (tabId: number, propKey: string, x: any, y: any) =>
			dispatch(updateDashGraphPosition(tabId, propKey, x, y)),
		updateDashGraphSz: (
			tabId: number,
			propKey: string,
			x: any,
			y: any,
			width: any,
			height: any
		) => dispatch(updateDashGraphSize(tabId, propKey, x, y, width, height)),
		// graphHighlight: (tabId: number, propKey: string) =>
		// 	dispatch(updateGraphHighlight(tabId, propKey)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphRNDDash);
