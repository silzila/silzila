// This component provides individual dropzone
// Each Dropzone can have allowed number of cards.
// Cards can be moved between dropzones & also sorted within a dropzone

import {
	editChartPropItem,
	updateDropZoneExpandCollapsePropLeft,
	updateIsAutoFilterEnabledPropLeft,
	updateFilterAnyContidionMatchPropLeft,
	clearDropZoneFieldsChartPropLeft,
	toggleFilterRunState,
} from "../../redux/ChartProperties/actionsChartProperties";
import React from "react";
import { useState } from "react";
import { useDrop } from "react-dnd";
import { connect } from "react-redux";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import Card from "./Card";
import ChartsInfo from "./ChartsInfo2";
import { setPrefix } from "./SetPrefix";
import UserFilterCard from "../ChartFieldFilter/UserFilterCard";
import expandIcon from "../../assets/expand.png";
import collapseIcon from "../../assets/collapse.png";
import dotIcon from "../../assets/dot.png";
import tickIcon from "../../assets/tick.png";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

import { Menu, MenuItem, Divider, Tooltip } from "@mui/material";
//import { StyledEngineProvider } from '@mui/material/styles';

const DropZone = ({
	// props
	bIndex,
	name,
	propKey,

	// state
	chartProp,

	// dispatch
	clearDropZoneFieldsChartPropLeft,
	updateDropZoneExpandCollapsePropLeft,
	updateIsAutoFilterEnabledPropLeft,
	updateFilterAnyContidionMatchPropLeft,
	updateDropZoneItems,
	moveItemChartProp,
	toggleFilterRunState,
}) => {
	const [severity, setSeverity] = useState("success");
	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("Testing alert");

	const [, drop] = useDrop({
		accept: "card",
		drop: item => handleDrop(item, bIndex),
		collect: monitor => ({
			isOver: monitor.isOver(),
			canDrop: monitor.canDrop(),
		}),
	});

	const uIdGenerator = () => {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	};

	var chartType = chartProp.properties[propKey].chartType;

	const handleDrop = (item, bIndex) => {
		var allowedNumbers = ChartsInfo[chartType].dropZones[bIndex].allowedNumbers;
		let newFieldData = {};

		if (item.bIndex === 99) {
			const uID = uIdGenerator();
			var fieldData = item.fieldData;
			fieldData.uId = uID;

			if (bIndex === 1) {
				if (chartType === "calendar") {
					if (fieldData.dataType === "date") {
						let newFieldData = JSON.parse(
							JSON.stringify(setPrefix(fieldData, name, chartType))
						);
						console.log(propKey, bIndex, newFieldData, allowedNumbers);
						updateDropZoneItems(propKey, bIndex, newFieldData, allowedNumbers);
					} else {
						setSeverity("error");
						setOpenAlert(true);
						setTestMessage(
							"Can't drop columns of datatype other than date or timestamp"
						);
						setTimeout(() => {
							setOpenAlert(false);
							setTestMessage("");
						}, 3000);
					}
				} else {
					let newFieldData = JSON.parse(
						JSON.stringify(setPrefix(fieldData, name, chartType))
					);
					updateDropZoneItems(propKey, bIndex, newFieldData, allowedNumbers);
				}
			}
			//bindex is not 1 (dimension)
			else {
				let newFieldData = JSON.parse(
					JSON.stringify(setPrefix(fieldData, name, chartType))
				);
				updateDropZoneItems(propKey, bIndex, newFieldData, allowedNumbers);
			}
		} else if (item.bIndex !== bIndex) {
			// console.log("-------moving item from within------");
			if (bIndex === 1) {
				if (chartType === "calendar") {
					if (item.dataType === "date") {
						let newFieldData = JSON.parse(
							JSON.stringify(setPrefix(item, name, chartType))
						);
						["type", "bIndex"].forEach(e => delete newFieldData[e]);
						moveItemChartProp(
							propKey,
							item.bIndex,
							item.uId,
							newFieldData,
							bIndex,
							allowedNumbers
						);
					} else {
						setSeverity("error");
						setOpenAlert(true);
						setTestMessage(
							"Can't drop columns of datatype other than date or timestamp"
						);
						setTimeout(() => {
							setOpenAlert(false);
							setTestMessage("");
						}, 3000);
					}
				} else {
					let newFieldData = JSON.parse(JSON.stringify(setPrefix(item, name, chartType)));
					["type", "bIndex"].forEach(e => delete newFieldData[e]);
					moveItemChartProp(
						propKey,
						item.bIndex,
						item.uId,
						newFieldData,
						bIndex,
						allowedNumbers
					);
				}
			}
			//bindex is not 1 (dimension)
			else {
				let newFieldData = JSON.parse(JSON.stringify(setPrefix(item, name, chartType)));
				["type", "bIndex"].forEach(e => delete newFieldData[e]);
				moveItemChartProp(
					propKey,
					item.bIndex,
					item.uId,
					newFieldData,
					bIndex,
					allowedNumbers
				);
			}
		}

		if (name === "Filter") {
			setModalData(newFieldData);
		}
	};

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClose = async (closeFrom, queryParam) => {
		// console.log(closeFrom);
		setAnchorEl(null);
		//setShowOptions(false);

		if (closeFrom === "opt1" && queryParam === "Clear") {
			clearDropZoneFieldsChartPropLeft(propKey, bIndex);
		}

		// updateLeftFilterItem(propKey,0,constructChartAxesFieldObject());
	};

	const RenderMenu = ({ name }) => {
		var options = ["Clear"];
		var options1 = [];
		var options2 = [];

		if (bIndex === 0) {
			options1 = ["All Conditions Met", "Any Condition Met"];
			options2 = ["Auto Refresh", "Manual Run"];
		} else {
			options1 = [];
		}

		return (
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={() => handleClose("clickOutside")}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				{options.length > 0
					? options.map((opt, index) => {
							return (
								<div
									style={{ display: "flex" }}
									onClick={() => handleClose("opt1", opt)}
								>
									<MenuItem key={index}>{opt + " " + name}</MenuItem>
								</div>
							);
					  })
					: null}

				<Divider />

				{bIndex === 0 && options1.length > 0
					? options1.map((opt, index) => {
							return (
								<div
									style={{ display: "flex" }}
									onClick={() => {
										setAnchorEl(null);
										updateFilterAnyContidionMatchPropLeft(
											propKey,
											0,
											!chartProp.properties[propKey].chartAxes[0]
												.any_condition_match
										);
									}}
								>
									<MenuItem key={index}>{opt}</MenuItem>
									{opt ===
									(chartProp.properties[propKey].chartAxes[0].any_condition_match
										? "Any Condition Met"
										: "All Conditions Met") ? (
										<img
											src={tickIcon}
											alt="Selected"
											style={{ height: "16px", width: "16px" }}
											title="Selected"
										/>
									) : null}
								</div>
							);
					  })
					: null}

				<Divider />

				{bIndex === 0 && options2.length > 0
					? options2.map((opt, index) => {
							return (
								<div
									style={{ display: "flex" }}
									onClick={() => {
										setAnchorEl(null);
										updateIsAutoFilterEnabledPropLeft(
											propKey,
											0,
											!chartProp.properties[propKey].chartAxes[0]
												.is_auto_filter_enabled
										);
									}}
								>
									<MenuItem key={index}>{opt}</MenuItem>
									{opt ===
									(chartProp.properties[propKey].chartAxes[0]
										.is_auto_filter_enabled
										? "Auto Refresh"
										: "Manual Run") ? (
										<img
											src={tickIcon}
											alt="Selected"
											style={{ height: "16px", width: "16px" }}
											title="Selected"
										/>
									) : null}
								</div>
							);
					  })
					: null}
			</Menu>
		);
	};

	const [modalData, setModalData] = useState(null);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleModalClose = () => {
		setModalData(null);
	};

	return (
		<div ref={drop} className="chartAxis mt-2">
			<div
				style={{ display: "flex", backgroundColor: "#d3d3d3" }}
				className="chartAxisHeader"
			>
				<span className="axisTitle" style={{ flex: 1, paddingBottom: "2px" }}>
					{name}
				</span>
				{name === "Filter" ? (
					<div style={{ float: "right", borderTop: "2px solid #d3d3d3" }}>
						{!chartProp.properties[propKey].chartAxes[bIndex].isCollapsed ? (
							<Tooltip title="Expand">
								<UnfoldMoreIcon
									style={{
										height: "16px",
										width: "16px",
										color: "#878786",
									}}
									onClick={() => {
										updateDropZoneExpandCollapsePropLeft(
											propKey,
											bIndex,
											!chartProp.properties[propKey].chartAxes[bIndex]
												.isCollapsed
										);
									}}
								/>
							</Tooltip>
						) : (
							<Tooltip title="Collapse">
								<UnfoldLessIcon
									style={{
										height: "16px",
										width: "16px",
										color: "#878786",
									}}
									onClick={() => {
										updateDropZoneExpandCollapsePropLeft(
											propKey,
											bIndex,
											!chartProp.properties[propKey].chartAxes[bIndex]
												.isCollapsed
										);
									}}
								/>
							</Tooltip>
						)}
						<MoreVertIcon
							onClick={handleClick}
							style={{ height: "16px", width: "16px", color: "#878786" }}
						/>

						{/* <img
						src={
							chartProp.properties[propKey].chartAxes[bIndex].isCollapsed
								? expandIcon
								: collapseIcon
						}
						alt="Collapse"
						style={{ height: "16px", width: "16px" }}
						title="Collapse"
						onClick={() => {
							updateDropZoneExpandCollapsePropLeft(
								propKey,
								bIndex,
								!chartProp.properties[propKey].chartAxes[bIndex].isCollapsed
							);
						}}
					/> */}
						{/* <img
						src={dotIcon}
						onClick={handleClick}
						alt="Menu"
						style={{ height: "16px", width: "16px" }}
						title="Mune"
					/> */}
						{bIndex === 0 &&
						chartProp.properties[propKey].chartAxes[0].is_auto_filter_enabled ===
							false ? (
							<button
								onClick={e =>
									toggleFilterRunState(
										propKey,
										!chartProp.properties[propKey].filterRunState
									)
								}
							>
								Run
							</button>
						) : null}
					</div>
				) : null}
			</div>

			{/* {!chartProp.properties[propKey].chartAxes[bIndex].isCollapsed ? ( */}
			<div className="chartAxisBody">
				{/* The subtext displayed under each dropzone  */}
				{/* How many minimum fields required & maximum allowed  */}
				{bIndex === 0 ? (
					<span className="axisInfo">
						{" "}
						Drop (0 - max {ChartsInfo[chartType].dropZones[bIndex]?.allowedNumbers})
						field(s) here
					</span>
				) : null}
				{bIndex === 1 && ChartsInfo[chartType]?.dropZones[bIndex]?.allowedNumbers === 1 ? (
					<span className="axisInfo"> Drop (1) field(s) here</span>
				) : null}
				{bIndex === 1 && ChartsInfo[chartType]?.dropZones[bIndex]?.allowedNumbers > 1 ? (
					<span className="axisInfo">
						{" "}
						Drop (atleast {ChartsInfo[chartType].dropZones[bIndex]?.min} - max{" "}
						{ChartsInfo[chartType].dropZones[bIndex]?.allowedNumbers}) field(s) here
					</span>
				) : null}
				{bIndex === 2 && ChartsInfo[chartType]?.dropZones[bIndex]?.allowedNumbers === 1 ? (
					<span className="axisInfo"> Drop (1) field(s) here</span>
				) : null}
				{bIndex === 2 && ChartsInfo[chartType]?.dropZones[bIndex]?.allowedNumbers > 1 ? (
					<span className="axisInfo">
						{" "}
						Drop (atleast {ChartsInfo[chartType].dropZones[bIndex]?.min} - max{" "}
						{ChartsInfo[chartType].dropZones[bIndex]?.allowedNumbers}) field(s) here
					</span>
				) : null}
				{bIndex === 3 &&
				ChartsInfo[chartType].dropZones[bIndex] &&
				ChartsInfo[chartType].dropZones[bIndex].min === 0 ? (
					<span className="axisInfo">
						{" "}
						Drop (atleast {ChartsInfo[chartType].dropZones[bIndex]?.min} - max{" "}
						{ChartsInfo[chartType].dropZones[bIndex]?.allowedNumbers}) here
					</span>
				) : null}
				{bIndex === 3 &&
				ChartsInfo[chartType].dropZones[bIndex] &&
				ChartsInfo[chartType].dropZones[bIndex].allowedNumbers === 1 ? (
					<span className="axisInfo"> Drop (1) field(s) here</span>
				) : null}
				{/* ChartsInfo[chartType].dropZones[bIndex].allowedNumbers === 1 && ChartsInfo[chartType].dropZones[bIndex].min === 1 ? (
					<span className="axisInfo"> Drop (1) field(s) here</span>
				) : ChartsInfo[chartType].dropZones[bIndex].allowedNumbers > 1 && ChartsInfo[chartType].dropZones[bIndex].min === 1 ? (
					<span className="axisInfo"> Drop (atleast 1 - max {ChartsInfo[chartType].dropZones[bIndex].allowedNumbers}) field(s) here</span>
				) : ChartsInfo[chartType].dropZones[bIndex].allowedNumbers > 1 && ChartsInfo[chartType].dropZones[bIndex].min === 0 ? (
					<span className="axisInfo"> Drop (0 - max {ChartsInfo[chartType].dropZones[bIndex].allowedNumbers}) field(s) here</span>
				) : null */}
				{bIndex == 0
					? chartProp.properties[propKey].chartAxes[bIndex]?.fields?.map(
							(field, index) => (
								<UserFilterCard
									field={field}
									bIndex={bIndex}
									axisTitle={name}
									key={index}
									itemIndex={index}
									propKey={propKey}
								/>
							)
					  )
					: chartProp.properties[propKey].chartAxes[bIndex]?.fields?.map(
							(field, index) => (
								<Card
									field={field}
									bIndex={bIndex}
									axisTitle={name}
									key={index}
									itemIndex={index}
									propKey={propKey}
								/>
							)
					  )}
			</div>
			{/* ) : (
				chartProp.properties[propKey].chartAxes[bIndex]?.fields?.map((field, index) => (
					<UserFilterCard
						field={field}
						bIndex={bIndex}
						axisTitle={name}
						key={index}
						itemIndex={index}
						propKey={propKey}
					/>
				))
			)} */}

			<NotificationDialog
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
				severity={severity}
				testMessage={testMessage}
				openAlert={openAlert}
			/>

			<RenderMenu name={ChartsInfo[chartType].dropZones[bIndex]?.name} />
		</div>
	);
};

const mapStateToProps = state => {
	return {
		chartProp: state.chartProperties,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		clearDropZoneFieldsChartPropLeft: (propKey, bIndex) =>
			dispatch(clearDropZoneFieldsChartPropLeft(propKey, bIndex)),
		updateDropZoneExpandCollapsePropLeft: (propKey, bIndex, isCollapsed) =>
			dispatch(updateDropZoneExpandCollapsePropLeft(propKey, bIndex, isCollapsed)),
		updateFilterAnyContidionMatchPropLeft: (propKey, bIndex, any_condition_match) =>
			dispatch(updateFilterAnyContidionMatchPropLeft(propKey, 0, any_condition_match)),
		updateIsAutoFilterEnabledPropLeft: (propKey, bIndex, is_auto_filter_enabled) =>
			dispatch(updateIsAutoFilterEnabledPropLeft(propKey, 0, is_auto_filter_enabled)),
		toggleFilterRunState: (propKey, runState) =>
			dispatch(toggleFilterRunState(propKey, runState)),
		updateDropZoneItems: (propKey, bIndex, item, allowedNumbers) =>
			dispatch(
				editChartPropItem({
					action: "update",
					details: { propKey, bIndex, item, allowedNumbers },
				})
			),

		moveItemChartProp: (propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers) =>
			dispatch(
				editChartPropItem({
					action: "move",
					details: { propKey, fromBIndex, fromUID, item, toBIndex, allowedNumbers },
				})
			),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DropZone);
