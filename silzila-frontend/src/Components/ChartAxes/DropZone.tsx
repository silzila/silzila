// This component provides individual dropzone
// Each Dropzone can have allowed number of cards.
// Cards can be moved between dropzones & also sorted within a dropzone
import { useEffect, useState } from "react";
import {
	editChartPropItem,
	updateIsAutoFilterEnabledPropLeft,
	updateFilterAnyContidionMatchPropLeft,
	clearDropZoneFieldsChartPropLeft,
	toggleFilterRunState,
} from "../../redux/ChartPoperties/ChartPropertiesActions";
import { useDrop } from "react-dnd";
import { connect } from "react-redux";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import { findNewDisplayName } from "../CommonFunctions/CommonFunctions";
import Card from "./Card";
import ChartsInfo from "./ChartsInfo2";
import { setPrefix } from "./SetPrefix";
import { setDisplayName } from './setDisplayName';
import UserFilterCard from "../ChartFieldFilter/UserFilterCard";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { Menu, MenuItem, Divider, Tooltip } from "@mui/material";
import { ChartPropertiesStateProps } from "../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { Dispatch } from "redux";
import { DropZoneProps } from "./ChartAxesInterfaces";
import DoneIcon from "@mui/icons-material/Done";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { AlertColor } from "@mui/material/Alert";
import {
	editChartPropItemForDm,
	updateDynamicMeasureAxes,
} from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import UserFilterCardForDm from "../ChartFieldFilter/UserFilterCardForDm";
import Logger from "../../Logger";
import { updateFormatOption } from "../../redux/ChartPoperties/ChartControlsActions";
//import { StyledEngineProvider } from '@mui/material/styles';

const DropZone = ({
	// props
	bIndex,
	name,
	propKey,
	uID,

	// state
	chartProp,
	chartControls,
	dynamicMeasureState,

	// dispatch
	clearDropZoneFieldsChartPropLeft,
	updateIsAutoFilterEnabledPropLeft,
	updateFilterAnyContidionMatchPropLeft,
	updateDropZoneItems,
	moveItemChartProp,
	toggleFilterRunState,
	updateDynamicMeasureAxes,
	moveItemChartPropForDm,
	updateQueryParam,
	updateFormat,
}: DropZoneProps & any) => {

	const [severity, setSeverity] = useState<AlertColor>("success");
	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("Testing alert");
	const [isFilterCollapsed, setIsFilterCollapsed] = useState<boolean>(false);

	let currentChartAxesName = uID ? "chartAxes_" + uID : "chartAxes";

	//let charAxesFields = chartProp.properties[propKey][currentChartAxesName][bIndex].fields;
	let chatAxesFieldsLength = chartProp.properties[propKey][currentChartAxesName][bIndex].fields.length;

	var selectedDynamicMeasureProps =
		dynamicMeasureState?.dynamicMeasureProps?.[dynamicMeasureState.selectedTabId]?.[
		dynamicMeasureState.selectedTileId
		]?.[
		`${dynamicMeasureState.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`
		];


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

	let currentChartAxes = chartProp.properties[propKey][currentChartAxesName];

	const updateRollUp = () => {
		let currentAxesFields = currentChartAxes[bIndex].fields;

		if (["crossTab", "heatmap", "boxPlot", "bubbleMap"].includes(chartProp.properties[propKey].chartType)) {
			let rollupDimentionOneFieldIndex = chartProp.properties[propKey][currentChartAxesName][1].fields.findIndex((field: any) => field.rollupDepth);
			let rollupDimentionTwoFieldIndex = chartProp.properties[propKey][currentChartAxesName][2].fields.findIndex((field: any) => field.rollupDepth);

			if (uID) {
				if (rollupDimentionOneFieldIndex > -1 || rollupDimentionTwoFieldIndex > -1) {
					let isManualDimentionOne = chartProp.properties[propKey][currentChartAxesName][1].fields.find((field: any) => field.isManual);
					let isManualDimentionTwo = chartProp.properties[propKey][currentChartAxesName][2].fields.find((field: any) => field.isManual);

					if (!isManualDimentionOne && !isManualDimentionTwo) {
						console.log(bIndex);

						if (rollupDimentionOneFieldIndex > -1) {
							updateField(1, rollupDimentionOneFieldIndex, false);
							updateField(2, chartProp.properties[propKey][currentChartAxesName][2].fields?.length - 1, true);
						}
						else {
							updateField(2, rollupDimentionTwoFieldIndex, false);
							updateField(2, chartProp.properties[propKey][currentChartAxesName][2].fields?.length - 1, true);
						}
					}
				}
				else {
					if (chartProp.properties[propKey][currentChartAxesName][2].fields?.length > 0) {
						updateField(2, chartProp.properties[propKey][currentChartAxesName][2].fields?.length - 1, true);
					}
					else {
						updateField(1, chartProp.properties[propKey][currentChartAxesName][1].fields?.length - 1, true);
					}
				}
			}
		}
		else {
			let rollupFieldIndex = chartProp.properties[propKey][currentChartAxesName][bIndex].fields.findIndex((field: any) => field.rollupDepth);

			if (uID) {
				if (rollupFieldIndex > -1) {
					let isManual = chartProp.properties[propKey][currentChartAxesName][bIndex].fields.find((field: any) => field.isManual);

					if (!isManual) {
						updateField(bIndex, rollupFieldIndex, false);
						updateField(bIndex, currentAxesFields?.length - 1, true);
					}
				}
				else {
					updateField(bIndex, rollupFieldIndex, false);
					updateField(bIndex, currentAxesFields?.length - 1, true);
				}
			}
		}


		function updateField(binIndex: number, index: number, enable: boolean) {
			let _field = chartProp.properties[propKey][currentChartAxesName][binIndex].fields[index];

			if (_field) {
				let _tempField = JSON.parse(JSON.stringify(_field));

				if (_tempField) {
					_tempField.rollupDepth = enable;
					updateQueryParam(propKey, binIndex, index, _tempField, currentChartAxesName);
				}
			}
		}
	}

	var chartType = chartProp.properties[propKey].chartType;



	// DropZoneDropItem
	const handleDrop = (item: any, bIndex: number) => {
		var allowedNumbers = ChartsInfo[chartType].dropZones[bIndex].allowedNumbers;
		//let newFieldData = {};

		// when column dragged from table
		if (item.bIndex === 99) {
			const uID = uIdGenerator();
			var fieldData = item.fieldData;
			fieldData.uId = uID;

			//drop zone is measure if the binIndex is 1
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

						newFieldData = setDisplayName(newFieldData, name, chartType);
						//newFieldData.displayname = findNewDisplayName(); //TODO:

						updateDropZoneItems(propKey, bIndex, newFieldData, allowedNumbers, currentChartAxesName);
					} else {
						setSeverity("error");
						setOpenAlert(true);
						setTestMessage(
							"Can't drop columns of datatype other than date or timestamp"
						);
						// setTimeout(() => {
						// 	setOpenAlert(false);
						// 	setTestMessage("");
						// }, 3000);
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

					newFieldData = setDisplayName(newFieldData, name, chartType);
					newFieldData.displayname = findNewDisplayName(chartProp.properties[propKey].chartAxes, newFieldData, allowedNumbers);

					if (chartType === "richText") {
						updateDynamicMeasureAxes(bIndex, allowedNumbers, newFieldData);
					} else {
						updateDropZoneItems(propKey, bIndex, newFieldData, allowedNumbers, currentChartAxesName);
					}
				}
			}
			//bindex is not 1 (dimension)
			else {
				let newFieldData = JSON.parse(
					JSON.stringify(setPrefix(fieldData, name, chartType))
				);

				newFieldData = setDisplayName(newFieldData, name, chartType);
				newFieldData.displayname = findNewDisplayName(chartProp.properties[propKey].chartAxes, newFieldData, allowedNumbers);

				if (chartType === "richText") {
					updateDynamicMeasureAxes(bIndex, allowedNumbers, newFieldData);
				} else {
					updateDropZoneItems(propKey, bIndex, newFieldData, allowedNumbers, currentChartAxesName);
				}
			}

			//setTimeout(updateRollUp, 2000);
		} else if (item.bIndex !== bIndex) {
			if (bIndex === 1) {
				if (chartType === "calendar") {
					if (item.dataType === "date") {
						let newFieldData = JSON.parse(
							JSON.stringify(setPrefix(item, name, chartType))
						);

						newFieldData = setDisplayName(newFieldData, name, chartType);
						//newFieldData.displayname = findNewDisplayName(bIndex, newFieldData, allowedNumbers);

						["type", "bIndex"].forEach(e => delete newFieldData[e]);
						moveItemChartProp(
							propKey,
							item.bIndex,
							item.uId,
							newFieldData,
							bIndex,
							allowedNumbers,
							currentChartAxesName
						);
					} else {
						setSeverity("error");
						setOpenAlert(true);
						setTestMessage(
							"Can't drop columns of datatype other than date or timestamp"
						);
						// setTimeout(() => {
						// 	setOpenAlert(false);
						// 	setTestMessage("");
						// }, 3000);
					}
				} else {
					Logger("info", "******", name);
					let newFieldData = JSON.parse(JSON.stringify(setPrefix(item, name, chartType)));

					newFieldData = setDisplayName(newFieldData, name, chartType);
					//newFieldData.displayname = findNewDisplayName(bIndex, newFieldData).displayname;

					["type", "bIndex"].forEach(e => delete newFieldData[e]);
					if (chartType === "richText") {
						moveItemChartPropForDm(
							`${dynamicMeasureState.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`,
							item.bIndex,
							item.uId,
							newFieldData,
							bIndex,
							allowedNumbers,
							currentChartAxesName
						);
					} else {
						moveItemChartProp(
							propKey,
							item.bIndex,
							item.uId,
							newFieldData,
							bIndex,
							allowedNumbers,
							currentChartAxesName
						);
					}
				}
			}
			//bindex is not 1 (dimension)
			else {
				let newFieldData = JSON.parse(JSON.stringify(setPrefix(item, name, chartType)));
				newFieldData = setDisplayName(newFieldData, name, chartType);
				newFieldData.displayname = findNewDisplayName(chartProp.properties[propKey].chartAxes, newFieldData, allowedNumbers);


				["type", "bIndex"].forEach(e => delete newFieldData[e]);

				if (chartType === "richText") {
					moveItemChartPropForDm(
						`${dynamicMeasureState.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`,
						item.bIndex,
						item.uId,
						newFieldData,
						bIndex,
						allowedNumbers,
						currentChartAxesName
					);
				} else {
					moveItemChartProp(
						propKey,
						item.bIndex,
						item.uId,
						newFieldData,
						bIndex,
						allowedNumbers,
						currentChartAxesName
					);
				}
			}
		}

		if (name === "Filter") {
			//setModalData(newFieldData);
		}
	};

	useEffect(() => {
		updateRollUp();
	}, [chatAxesFieldsLength, chartProp.properties[propKey].enableOverrideForUID])

	const handleUpdateFormat = (option: string, value: any, optionKey?: string) => {

		updateFormat(propKey, optionKey, option, value);

	};

	useEffect(() => {
		const measureIndex = chartProp.properties[propKey].chartAxes.findIndex((item: any) => item.name === 'Measure');
		if (measureIndex === -1) return; // Exit if Measure axis is not found

		const measureFields = chartProp.properties[propKey].chartAxes[measureIndex].fields;
		const currentFormats = chartControls.properties[propKey].formatOptions.labelFormats.measureFormats;

		const measureTracker: any = {};

		measureFields.forEach((field: any) => {
			measureTracker[field.uId] = currentFormats[field.uId] || {
				formatValue: 'Number',
				currencySymbol: '₹',
				enableRounding: true,
				roundingDigits: 1,
				numberSeparator: 'Abbrev',
				percentageCalculate: false
			};
		});

		// Only update if there are changes
		if (JSON.stringify(measureTracker) !== JSON.stringify(currentFormats)) {
			handleUpdateFormat("measureFormats", measureTracker, "labelFormats");

			if (measureFields.length > 0) {
				handleUpdateFormat("selectedMeasure", {
					uId: measureFields[0].uId,
					name: measureFields[0].displayname
				}, "labelFormats");
			}
		}
	}, [chartProp.properties[propKey].chartAxes]);

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleClose = async (closeFrom: any, queryParam?: any) => {
		setAnchorEl(null);
		//setShowOptions(false);

		if (closeFrom === "opt1" && queryParam === "Clear") {
			clearDropZoneFieldsChartPropLeft(propKey, bIndex, currentChartAxesName, currentChartAxesName);
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
										!currentChartAxes[0]
											.any_condition_match,
										currentChartAxesName
									);
								}}
							>
								<span style={{ width: "2rem", paddingLeft: "5px" }}>
									{opt ===
										(currentChartAxes[0]
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
										!currentChartAxes[0]
											.is_auto_filter_enabled,
										currentChartAxesName
									);
								}}
							>
								<span style={{ width: "2rem", paddingLeft: "5px" }}>
									{opt ===
										(currentChartAxes[0]
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

	//const [modalData, setModalData] = useState<any>(null);

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<div
			ref={drop}
			className="chartAxis mt-2"
			style={{ flex: bIndex === 0 ? (isFilterCollapsed ? "none" : 1) : 1 }}
		>
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
						name === "Filter" && chartType !== "geoChart"
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
					{name === "Filter" ? uID ? "Filter Override" : "Chart Filter" : uID ? name + " Override" : name}
					{chartType === "richText" ? (
						<span style={{ marginLeft: "5px" }} className="axisInfo">
							({selectedDynamicMeasureProps?.chartAxes[bIndex]?.fields?.length}/
							{ChartsInfo[chartType].dropZones[bIndex]?.allowedNumbers})
						</span>
					) : (
						<span style={{ marginLeft: "5px" }} className="axisInfo">
							({currentChartAxes[bIndex].fields.length}/
							{ChartsInfo[chartType].dropZones[bIndex]?.allowedNumbers})
						</span>
					)}

					{name === "Filter" ? (
						<div
							style={{
								float: "right",
								display: "flex",
								columnGap: "8px",
								// borderTop: "2px solid #d3d3d3"
							}}
						>
							<MoreVertIcon
								onClick={handleClick}
								style={{ height: "16px", width: "16px", color: "#878786" }}
							/>
							{!isFilterCollapsed ? (
								// {!currentChartAxes[bIndex].isCollapsed ? (
								<Tooltip title="Expand">
									<ExpandMoreIcon
										style={{
											height: "17px",
											width: "17px",
											color: "#878786",
										}}
										onClick={() => {
											setIsFilterCollapsed(!isFilterCollapsed);
										}}
									/>
								</Tooltip>
							) : (
								<Tooltip title="Collapse">
									<KeyboardArrowRightIcon
										style={{
											height: "17px",
											width: "17px",
											color: "#878786",
										}}
										onClick={() => {
											setIsFilterCollapsed(!isFilterCollapsed);

										}}
									/>
								</Tooltip>
							)}

							{bIndex === 0 &&
								currentChartAxes[0].is_auto_filter_enabled ===
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

			{/* {!currentChartAxes[bIndex].isCollapsed ? ( */}
			<div
				className="chartAxisBody"
				style={{
					minHeight: bIndex === 0 ? (isFilterCollapsed ? "auto" : "4em") : "4em",
					display: bIndex === 0 ? (isFilterCollapsed ? "none" : "unset") : "unset",
				}}
			>

				{bIndex === 0 ? (
					<>
						{chartType === "richText"
							? selectedDynamicMeasureProps?.chartAxes[bIndex]?.fields?.map(
								(field: any, index: number) => (
									<UserFilterCardForDm
										field={field}
										uID={uID}
										bIndex={bIndex}
										axisTitle={name}
										key={index}
										itemIndex={index}
										propKey={`${dynamicMeasureState.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`}
									/>
								)
							)
							: currentChartAxes[bIndex]?.fields?.map(
								(field: any, index: number) => (
									<UserFilterCard
										field={field}
										uID={uID}
										bIndex={bIndex}
										axisTitle={name}
										key={index}
										itemIndex={index}
										propKey={propKey}
									/>
								)
							)}
					</>
				) : (
					<>
						{chartType === "richText"
							? selectedDynamicMeasureProps?.chartAxes[bIndex]?.fields?.map(
								(field: any, index: number) => (
									<Card
										field={field}
										uID={uID}
										bIndex={bIndex}
										axisTitle={name}
										key={index}
										itemIndex={index}
										propKey={`${dynamicMeasureState.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`}
									/>
								)
							)
							: currentChartAxes[bIndex]?.fields?.map(
								(field: any, index: number) => (
									<Card
										field={field}
										uID={uID}
										bIndex={bIndex}
										axisTitle={name}
										key={index}
										itemIndex={index}
										propKey={propKey}
									/>
								)
							)}
					</>
				)}
			</div>

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

const mapStateToProps = (state: ChartPropertiesStateProps & any) => {
	return {
		chartProp: state.chartProperties,
		chartControls: state.chartControls,
		dynamicMeasureState: state.dynamicMeasuresState,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		clearDropZoneFieldsChartPropLeft: (
			propKey: string,
			bIndex: number,
			currentChartAxesName: string
		) =>
			dispatch(
				clearDropZoneFieldsChartPropLeft(propKey, bIndex, currentChartAxesName)
			),
		updateFilterAnyContidionMatchPropLeft: (
			propKey: string,
			bIndex: number,
			any_condition_match: any,
			currentChartAxesName: string
		) =>
			dispatch(
				updateFilterAnyContidionMatchPropLeft(
					propKey,
					0,
					any_condition_match,
					currentChartAxesName
				)
			),
		updateIsAutoFilterEnabledPropLeft: (
			propKey: string,
			bIndex: number,
			is_auto_filter_enabled: any,
			currentChartAxesName: string
		) =>
			dispatch(
				updateIsAutoFilterEnabledPropLeft(
					propKey,
					0,
					is_auto_filter_enabled,
					currentChartAxesName
				)
			),
		toggleFilterRunState: (propKey: string, runState: any) =>
			dispatch(toggleFilterRunState(propKey, runState)),

		updateDropZoneItems: (
			propKey: string,
			bIndex: number,
			item: any,
			allowedNumbers: any,
			currentChartAxesName: string
		) =>
			dispatch(
				editChartPropItem("update", {
					propKey,
					bIndex,
					item,
					allowedNumbers,
					currentChartAxesName,
				})
			),

		updateDynamicMeasureAxes: (
			bIndex: number,
			allowedNumbers: number,
			fieldData: any
		) => dispatch(updateDynamicMeasureAxes(bIndex, allowedNumbers, fieldData)),

		updateQueryParam: (
			propKey: string,
			binIndex: number,
			itemIndex: number,
			item: any,
			currentChartAxesName: string
		) =>
			dispatch(
				editChartPropItem("updateQuery", {
					propKey,
					binIndex,
					itemIndex,
					item,
					currentChartAxesName,
				})
			),

		moveItemChartProp: (
			propKey: string,
			fromBIndex: any,
			fromUID: any,
			item: any,
			toBIndex: any,
			allowedNumbers: any,
			currentChartAxesName: string
		) =>
			dispatch(
				editChartPropItem("move", {
					propKey,
					fromBIndex,
					fromUID,
					item,
					toBIndex,
					allowedNumbers,
					currentChartAxesName,
				})
			),
		moveItemChartPropForDm: (
			propKey: string,
			fromBIndex: any,
			fromUID: any,
			item: any,
			toBIndex: any,
			allowedNumbers: any,
			currentChartAxesName: string
		) =>
			dispatch(
				editChartPropItemForDm("move", {
					propKey,
					fromBIndex,
					fromUID,
					item,
					toBIndex,
					allowedNumbers,
					currentChartAxesName,
				})
			),

		updateFormat: (propKey: string, formatType: any, option: string, value: any) =>
			dispatch(updateFormatOption(propKey, formatType, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DropZone);
