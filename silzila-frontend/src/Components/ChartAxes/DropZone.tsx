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
} from "../../redux/ChartPoperties/ChartPropertiesActions";
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

import { Menu, MenuItem, Divider, Tooltip, Typography } from "@mui/material";
import { ChartPropertiesStateProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { Dispatch } from "redux";
import { DropZoneDropItem, DropZoneProps } from "./ChartAxesInterfaces";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DoneIcon from "@mui/icons-material/Done";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
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
}: DropZoneProps) => {
	// var geoLocation = chartProp.properties[propKey].geoLocation;

	const [severity, setSeverity] = useState<string>("success");
	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("Testing alert");

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

	// DropZoneDropItem
	const handleDrop = (item: any, bIndex: number) => {
		var allowedNumbers = ChartsInfo[chartType].dropZones[bIndex].allowedNumbers;
		let newFieldData = {};

		if (item.bIndex === 99) {
			const uID = uIdGenerator();
			var fieldData = item.fieldData;
			fieldData.uId = uID;

			if (bIndex === 1) {
				if (chartType === "calendar") {
					if (
						fieldData.dataType === "date" ||
						fieldData.dataType === "timestamp" ||
						// TODO:/* adding these two cases because the datatype of field is in capitalletter(frist), need to fix this or convert to lowercase*/
						fieldData.dataType === "Date" ||
						fieldData.dataType === "Timestamp"
					) {
						let newFieldData = JSON.parse(
							JSON.stringify(setPrefix(fieldData, name, chartType))
						);
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
				}
				// else if (chartType === "geoChart") {
				// 	let newFieldData = JSON.parse(
				// 		JSON.stringify(setPrefix(fieldData, name, chartType, geoLocation))
				// 	);
				// 	updateDropZoneItems(propKey, bIndex, newFieldData, allowedNumbers);
				// }
				else {
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

	const handleClose = async (closeFrom: any, queryParam?: any) => {
		// console.log(closeFrom);
		setAnchorEl(null);
		//setShowOptions(false);

		if (closeFrom === "opt1" && queryParam === "Clear") {
			clearDropZoneFieldsChartPropLeft(propKey, bIndex);
		}

		// updateLeftFilterItem(propKey,0,constructChartAxesFieldObject());
	};

	const RenderMenu = ({ name }: { name: string }) => {
		var options = ["Clear"];
		var options1: string[] = [];
		var options2: string[] = [];

		if (bIndex === 0) {
			options1 = ["All Conditions Met", "Any Condition Met"];
			options2 = ["Auto Refresh", "Manual Run"];
		} else {
			options1 = [];
		}

		return (
			<Menu
				key={name}
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
									key={index}
									style={{
										display: "flex",
										width: "auto",
										padding: "0.2rem 0.5rem 0.2rem 0",
									}}
									onClick={() => handleClose("opt1", opt)}
								>
									<span style={{ width: "2rem" }}></span>
									<MenuItem
										style={{ flex: 1, padding: 0, fontSize: "14px" }}
										key={index}
									>
										{opt + " " + name}
									</MenuItem>
								</div>
							);
					  })
					: null}

				<Divider />

				{bIndex === 0 && options1.length > 0
					? options1.map((opt, index) => {
							return (
								<div
									key={index}
									style={{
										display: "flex",
										width: "auto",
										padding: "0.2rem 0.5rem 0.2rem 0",
									}}
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
									<span style={{ width: "2rem", paddingLeft: "5px" }}>
										{opt ===
										(chartProp.properties[propKey].chartAxes[0]
											.any_condition_match
											? "Any Condition Met"
											: "All Conditions Met") ? (
											<Tooltip title="Selected">
												<DoneIcon
													style={{
														height: "16px",
														width: "16px",
														fontWeight: "10px",
													}}
												/>
											</Tooltip>
										) : null}
									</span>
									<MenuItem
										style={{ flex: 1, padding: 0, fontSize: "14px" }}
										key={index}
									>
										{opt}
									</MenuItem>
								</div>
							);
					  })
					: null}

				<Divider />

				{bIndex === 0 && options2.length > 0
					? options2.map((opt, index) => {
							return (
								<div
									key={index}
									style={{
										display: "flex",
										width: "auto",
										padding: "0.2rem 0.5rem 0.2rem 0",
									}}
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
									<span style={{ width: "2rem", paddingLeft: "5px" }}>
										{opt ===
										(chartProp.properties[propKey].chartAxes[0]
											.is_auto_filter_enabled
											? "Auto Refresh"
											: "Manual Run") ? (
											<Tooltip title="Selected">
												<DoneIcon
													style={{
														height: "16px",
														width: "16px",
														fontWeight: "10px",
													}}
												/>
											</Tooltip>
										) : null}
									</span>
									<MenuItem
										style={{ flex: 1, padding: 0, fontSize: "14px" }}
										key={index}
									>
										{opt}
									</MenuItem>
								</div>
							);
					  })
					: null}
			</Menu>
		);
	};

	const [modalData, setModalData] = useState<any>(null);

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleModalClose = () => {
		setModalData(null);
	};

	return (
		<div ref={drop} className="chartAxis mt-2">
			<div
				style={{
					display: "flex",
					// backgroundColor: "#d3d3d3"
				}}
				className="chartAxisHeader"
			>
				<span
					className="axisTitle"
					style={
						name === "Filter"
							? {
									flex: 1,
									paddingBottom: "2px",
							  }
							: {
									borderTop: "2px solid rgba(224, 224, 224, 1)",
									flex: 1,
									paddingBottom: "2px",
							  }
					}
				>
					{name}

					<span style={{ marginLeft: "5px" }} className="axisInfo">
						({chartProp.properties[propKey].chartAxes[bIndex].fields.length} / {""}
						{ChartsInfo[chartType].dropZones[bIndex]?.allowedNumbers})
					</span>

					{name === "Filter" ? (
						<div
							style={{
								float: "right",

								// borderTop: "2px solid #d3d3d3"
							}}
						>
							<MoreVertIcon
								onClick={handleClick}
								style={{ height: "16px", width: "16px", color: "#878786" }}
							/>
							{!chartProp.properties[propKey].chartAxes[bIndex].isCollapsed ? (
								<Tooltip title="Collapse">
									<ExpandMoreIcon
										style={{
											height: "17px",
											width: "17px",
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
								<Tooltip title="Expand">
									<KeyboardArrowRightIcon
										style={{
											height: "17px",
											width: "17px",
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
				</span>
			</div>

			{/* {!chartProp.properties[propKey].chartAxes[bIndex].isCollapsed ? ( */}
			<div className="chartAxisBody">
				{/* The subtext displayed under each dropzone  */}
				{/* How many minimum fields required & maximum allowed  */}
				{/* {bIndex === 0 ? (
					<span className="axisInfo">
						Drop (0 - max {ChartsInfo[chartType].dropZones[bIndex]?.allowedNumbers})
						field(s) here
					</span>
				) : null}
				{bIndex === 1 && ChartsInfo[chartType]?.dropZones[bIndex]?.allowedNumbers === 1 ? (
					<span className="axisInfo"> Drop (1) field(s) here</span>
				) : null}
				{bIndex === 1 && ChartsInfo[chartType]?.dropZones[bIndex]?.allowedNumbers > 1 ? (
					<span className="axisInfo">
						Drop (atleast {ChartsInfo[chartType].dropZones[bIndex]?.min} - max{" "}
						{ChartsInfo[chartType].dropZones[bIndex]?.allowedNumbers}) field(s) here
					</span>
				) : null}
				{bIndex === 2 && ChartsInfo[chartType]?.dropZones[bIndex]?.allowedNumbers === 1 ? (
					<span className="axisInfo"> Drop (1) field(s) here</span>
				) : null}
				{bIndex === 2 && ChartsInfo[chartType]?.dropZones[bIndex]?.allowedNumbers > 1 ? (
					<span className="axisInfo">
						Drop (atleast {ChartsInfo[chartType].dropZones[bIndex]?.min} - max{" "}
						{ChartsInfo[chartType].dropZones[bIndex]?.allowedNumbers}) field(s) here
					</span>
				) : null} */}
				{/* {bIndex === 3 &&
				ChartsInfo[chartType].dropZones[bIndex] &&
				ChartsInfo[chartType].dropZones[bIndex].min === 0 ? (
					<span className="axisInfo">
						Drop (atleast {ChartsInfo[chartType].dropZones[bIndex]?.min} - max{" "}
						{ChartsInfo[chartType].dropZones[bIndex]?.allowedNumbers}) here
					</span>
				) : null} */}
				{/* {bIndex === 3 &&
				ChartsInfo[chartType].dropZones[bIndex] &&
				ChartsInfo[chartType].dropZones[bIndex].allowedNumbers === 1 ? (
					<span className="axisInfo"> Drop (1) field(s) here</span>
				) : null} */}
				{/* ChartsInfo[chartType].dropZones[bIndex].allowedNumbers === 1 && ChartsInfo[chartType].dropZones[bIndex].min === 1 ? (
					<span className="axisInfo"> Drop (1) field(s) here</span>
				) : ChartsInfo[chartType].dropZones[bIndex].allowedNumbers > 1 && ChartsInfo[chartType].dropZones[bIndex].min === 1 ? (
					<span className="axisInfo"> Drop (atleast 1 - max {ChartsInfo[chartType].dropZones[bIndex].allowedNumbers}) field(s) here</span>
				) : ChartsInfo[chartType].dropZones[bIndex].allowedNumbers > 1 && ChartsInfo[chartType].dropZones[bIndex].min === 0 ? (
					<span className="axisInfo"> Drop (0 - max {ChartsInfo[chartType].dropZones[bIndex].allowedNumbers}) field(s) here</span>
				) : null */}
				{bIndex == 0
					? chartProp.properties[propKey].chartAxes[bIndex]?.fields?.map(
							(field: any, index: number) => (
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
							(field: any, index: number) => (
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

const mapStateToProps = (state: ChartPropertiesStateProps) => {
	return {
		chartProp: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		clearDropZoneFieldsChartPropLeft: (propKey: number | string, bIndex: number) =>
			dispatch(clearDropZoneFieldsChartPropLeft(propKey, bIndex)),
		updateDropZoneExpandCollapsePropLeft: (
			propKey: number | string,
			bIndex: number,
			isCollapsed: boolean
		) => dispatch(updateDropZoneExpandCollapsePropLeft(propKey, bIndex, isCollapsed)),
		updateFilterAnyContidionMatchPropLeft: (
			propKey: number | string,
			bIndex: number,
			any_condition_match: any
		) => dispatch(updateFilterAnyContidionMatchPropLeft(propKey, 0, any_condition_match)),
		updateIsAutoFilterEnabledPropLeft: (
			propKey: number | string,
			bIndex: number,
			is_auto_filter_enabled: any
		) => dispatch(updateIsAutoFilterEnabledPropLeft(propKey, 0, is_auto_filter_enabled)),
		toggleFilterRunState: (propKey: number | string, runState: any) =>
			dispatch(toggleFilterRunState(propKey, runState)),
		updateDropZoneItems: (
			propKey: number | string,
			bIndex: number,
			item: any,
			allowedNumbers: any
		) => dispatch(editChartPropItem("update", { propKey, bIndex, item, allowedNumbers })),

		moveItemChartProp: (
			propKey: number | string,
			fromBIndex: any,
			fromUID: any,
			item: any,
			toBIndex: any,
			allowedNumbers: any
		) =>
			dispatch(
				editChartPropItem("move", {
					propKey,
					fromBIndex,
					fromUID,
					item,
					toBIndex,
					allowedNumbers,
				})
			),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DropZone);
