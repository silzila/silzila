// This component houses the following
// 	- Dropzones for table fields
// 	- Graph section
// 	- Chart types / Controls selection menu

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import "./dataViewerMiddle.css";
// import chartControlIcon from "../../assets/chart-control-icon.svg";
// import settingsIcon from "../../assets/charts_theme_settings_icon.svg";

import { Dispatch } from "redux";
import { DataViewerMiddleProps, DataViewerMiddleStateProps } from "./DataViewerMiddleInterfaces";
import { setSelectedControlMenu } from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import ChartTypes from "../ChartOptions/ChartTypes";
import ControlDetail from "../ChartOptions/ControlDetail";
import ChartAxes from "../ChartAxes/ChartAxes";
import GraphArea from "../GraphArea/GraphArea";
import ChartControlObjects from "../ChartOptions/ChartControlObjects";
import { CloseSharp } from "@mui/icons-material";
import ChartFilterGroupsContainer from "../ChartFilterGroup/ChartFilterGroupsContainer";
import { AlertColor, Button, Checkbox, Tooltip } from "@mui/material";
import DynamicMeasureWindow from "./DynamicMeasureWindow";
import {
	addNewDynamicMeasurePropsForSameTile,
	addNewDynamicMeasurePropsFromNewTab,
	addNewDynamicMeasurePropsFromNewTile,
	deletingDynamicMeasure,
	onCheckorUncheckOnDm,
	setSelectedDynamicMeasureId,
	setSelectedTabIdInDynamicMeasureState,
	setSelectedTileIdInDynamicMeasureState,
	setSelectedToEdit,
} from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import {
	changeChartOptionSelected,
	setDynamicMeasureWindowOpen,
} from "../../redux/ChartPoperties/ChartPropertiesActions";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";
import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const DataViewerMiddle = ({
	// props
	tabId,
	tileId,
	dynamicMeasureState,

	// state
	tabTileProps,
	chartProp,
	chartControls,

	// dispatch
	setMenu,

	addNewDynamicMeasurePropsFromNewTab,
	addNewDynamicMeasurePropsFromNewTile,
	addNewDynamicMeasurePropsForSameTile,
	setSelectedTileIdForDM,
	setSelectedTabIdForDM,
	deletingDynamicMeasure,
	setSelectedDynamicMeasureId,
	onCheckorUncheckOnDm,
	setDynamicMeasureWindowOpen,
	setSelectedToEdit,
}: DataViewerMiddleProps & any) => {
	var propKey: string = `${tabId}.${tileId}`;
	var tabId = tabTileProps.selectedTabId;
	var tileId = tabTileProps.selectedTileId;

	useEffect(() => {
		setSelectedTileIdForDM(tileId);
		setSelectedTabIdForDM(tabId);
	}, [tileId, tabId]);

	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("");
	const [severity, setSeverity] = useState<AlertColor>("success");
	var dmProp =
		dynamicMeasureState.dynamicMeasureProps[`${dynamicMeasureState.selectedTabId}`]?.[
			`${dynamicMeasureState.selectedTileId}`
		]?.[
			`${dynamicMeasureState.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`
		];

	const [backgroundColor, setBackgroundColor] = useState<string>("");
	const [fontColor, setFontColor] = useState<string>("");
	const [italicText, setItalicText] = useState<string>("");
	const [boldText, setBoldText] = useState<string>("");
	const [textUnderline, setTextUnderline] = useState<string>("");

	useEffect(() => {
		var formats = dmProp?.conditionalFormats;
		if (formats?.length > 0) {
			for (let i = formats.length - 1; i >= 0; i--) {
				if (formats[i].isConditionSatisfied) {
					setBackgroundColor(formats[i].backgroundColor);
					setFontColor(formats[i].fontColor);
					setBoldText(formats[i].isBold ? "bold" : "normal");
					setItalicText(formats[i].isItalic ? "italic" : "normal");
					setTextUnderline(formats[i].isUnderlined ? "underline" : "none");
					return;
				}
				if (i === 0 && !formats[i].isConditionSatisfied) {
					setBackgroundColor(dmProp?.styleOptions.backgroundColor);
					setFontColor(dmProp?.styleOptions.fontColor);
					setBoldText(dmProp?.styleOptions.isBold ? "bold" : "normal");
					setItalicText(dmProp?.styleOptions.isItalic ? "italic" : "normal");
					setTextUnderline(dmProp?.styleOptions.isUnderlined ? "underline" : "none");
				}
			}
		} else {
			setBackgroundColor(dmProp?.styleOptions.backgroundColor);
			setFontColor(dmProp?.styleOptions.fontColor);
			setBoldText(dmProp?.styleOptions.isBold ? "bold" : "normal");
			setItalicText(dmProp?.styleOptions.isItalic ? "italic" : "normal");
			setTextUnderline(dmProp?.styleOptions.isUnderlined ? "underline" : "none");
		}
	}, [dmProp]);

	const MinimizeComponent = () => {
		return (
			<Tooltip title="Hide">
				<KeyboardArrowUpIcon
					sx={{
						fontSize: "18px",
						float: "right",
						marginTop: "5px",
						marginRight: "1rem",
					}}
					onClick={() => setMenu("")}
				/>
			</Tooltip>
		);
	};

	const controlDisplayed = () => {
		switch (tabTileProps.selectedControlMenu) {
			case "Charts":
				return (
					<div className="rightColumnControlsAndFilters">
						<div
							style={{
								color: " #404040",
								fontWeight: "600",
								padding: "10px 0 0 0.5rem",
							}}
						>
							Charts
							<MinimizeComponent />
						</div>
						<ChartTypes propKey={propKey} />
					</div>
				);

			case "Chart controls":
				return (
					<div className="rightColumnControlsAndFilters">
						<div
							style={{
								color: " #404040",
								fontWeight: "600",
								// padding: "0 0.5rem",
								padding: "10px 0 0 0.5rem",
								marginBottom: "3px",
							}}
						>
							Charts Controls
							<MinimizeComponent />
						</div>
						<ChartControlObjects />
						<ControlDetail />
					</div>
				);

			case "Report Filters":
				return (
					<div className="rightColumnControlsAndFilters">
						<div
							style={{
								color: " #404040",
								fontWeight: "600",
								padding: "10px 0 0 0.5rem",
								marginBottom: "3px",
							}}
						>
							Report Filter
							<MinimizeComponent />
						</div>
						<ChartFilterGroupsContainer
							propKey={propKey}
							fromDashboard={false}
						></ChartFilterGroupsContainer>
					</div>
				);
			default:
				return null;
		}
	};

	var dynamicMeasureListForSelectedTile = dynamicMeasureState.dynamicMeasureList[tabId]
		? dynamicMeasureState.dynamicMeasureList[tabId]
			? dynamicMeasureState.dynamicMeasureList[tabId][tileId]
			: null
		: null;

	const handleOnCheckAndUnCheckOndm = (obj: any) => {
		if (obj?.usedInTextEditor) {
			// TODO::DynamicMeasure have to delete the text from editor
			onCheckorUncheckOnDm(
				obj.dynamicMeasureId,
				false,
				propKey,
				getFormatedValue(obj.dynamicMeasureId),
				{
					backgroundColor,
					fontColor,
					boldText,
					italicText,
					textUnderline,
				}
			);
		} else {
			onCheckorUncheckOnDm(
				obj.dynamicMeasureId,
				true,
				propKey,
				getFormatedValue(obj.dynamicMeasureId),
				{
					backgroundColor,
					fontColor,
					boldText,
					italicText,
					textUnderline,
				}
			);
		}
	};

	const getFormatedValue = (dmId: number) => {
		var formattedValue =
			dynamicMeasureState.dynamicMeasureProps?.[dynamicMeasureState.selectedTabId]?.[
				dynamicMeasureState.selectedTileId
			]?.[`${dynamicMeasureState.selectedTileId}.${dmId}`]?.dmValue;
		formattedValue = formatChartLabelValue(
			dynamicMeasureState.dynamicMeasureProps?.[dynamicMeasureState.selectedTabId]?.[
				dynamicMeasureState.selectedTileId
			]?.[`${dynamicMeasureState.selectedTileId}.${dmId}`],
			formattedValue
		);
		return formattedValue;
	};

	const displayDynamicMeasuresList = () => {
		if (dynamicMeasureListForSelectedTile) {
			return dynamicMeasureListForSelectedTile.map((dmeasureKey: string) => {
				let currentObj: any =
					dynamicMeasureState.dynamicMeasureProps[tabId][tileId][`${dmeasureKey}`];
				return (
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							margin: "5px 5px",
							border: "1px solid rgb(224, 224, 224,1)",
							borderRadius: "2px",
							lineHeight: "1.5rem",
							color: "#606060",
							columnGap: "10px",
							boxShadow: currentObj.isCurrentlySelected
								? "4px 4px 4px #aaaaaa"
								: "none",
						}}
					>
						<Checkbox
							size="small"
							checked={currentObj?.usedInTextEditor ? true : false}
							onChange={() => {
								handleOnCheckAndUnCheckOndm(currentObj);
							}}
							style={{
								transform: "scale(0.8)",
								margin: "0px 4px",
							}}
							sx={{
								"&.MuiCheckbox-root": {
									padding: "0px",
									margin: "0px",
								},
								"&.Mui-checked": {
									color: "#2bb9bb",
								},
							}}
						/>
						<div>
							{currentObj.editedDynamicMeasureName}

							<br />
							<span
								style={{
									fontSize: "10px",
									margin: "0px",
									backgroundColor: backgroundColor,
									color: fontColor,
									fontStyle: italicText,
									fontWeight: boldText,
									textDecoration: textUnderline,
								}}
							>
								{getFormatedValue(currentObj.dynamicMeasureId)}
							</span>
						</div>
						<CreateOutlinedIcon
							onClick={() => {
								setSelectedTileIdForDM(currentObj.tabId);
								setSelectedTileIdForDM(currentObj.tileId);
								setSelectedDynamicMeasureId(currentObj.dynamicMeasureId);
								setSelectedToEdit(
									currentObj.tabId,
									currentObj.tileId,
									currentObj.dynamicMeasureId,
									true
								);
								setDynamicMeasureWindowOpen(propKey, true);
							}}
							sx={{ fontSize: "16px", margin: "auto 2px" }}
						/>

						<CloseSharp
							onClick={() => {
								deletingDynamicMeasure(
									currentObj.tabId,
									currentObj.tileId,
									currentObj.selectedDynamicMeasureId
								);
							}}
							sx={{ fontSize: "16px", margin: "auto 2px" }}
						/>
					</div>
				);
			});
		} else {
			return null;
		}
	};

	const onAddingNewDynamicMeaasure = () => {
		if (dynamicMeasureState.dynamicMeasureList) {
			if (dynamicMeasureState.dynamicMeasureList.hasOwnProperty(tabId)) {
				if (dynamicMeasureState.dynamicMeasureList[tabId].hasOwnProperty(tileId)) {
					var totalMeasures =
						dynamicMeasureState.dynamicMeasureProps[tabId][tileId].totalDms;

					addNewDynamicMeasurePropsForSameTile(
						tabId,
						tileId,
						totalMeasures + 1,
						...tabTileProps.selectedDataSetList
					);
				} else {
					addNewDynamicMeasurePropsFromNewTile(
						tabId,
						tileId,
						1,
						...tabTileProps.selectedDataSetList
					);
				}
			} else {
				addNewDynamicMeasurePropsFromNewTab(
					tabId,
					tileId,
					1,
					...tabTileProps.selectedDataSetList
				);
			}
		} else {
			addNewDynamicMeasurePropsFromNewTab(
				tabId,
				tileId,
				1,
				...tabTileProps.selectedDataSetList
			);
		}
	};

	return (
		<div className="dataViewerMiddle" style={{ height: "300px" }}>
			{chartProp.properties[propKey].chartType === "richText" ? (
				<>
				<GraphArea />
				{/* <div className="rightColumn">
					<div className="rightColumnControlsAndFilters">
						<div
							style={{
								color: " #404040",
								fontWeight: "600",
								padding: "10px 0 0 0.5rem",
								marginBottom: "3px",
							}}
						>
							Dynamic Measure
						</div>
						{displayDynamicMeasuresList()}
						<Button
							onClick={() => {
								setDynamicMeasureWindowOpen(propKey, true);
								onAddingNewDynamicMeaasure();
							}}
						>
							Add
						</Button>
					</div>
				</div> */}
				<DynamicMeasureWindow />
			</>
			) : (
				<>
					<ChartAxes tabId={tabId} tileId={tileId} />
					<GraphArea />
					<div className="rightColumn">{controlDisplayed()}</div>
				</>
			)}
			<NotificationDialog
				openAlert={openAlert}
				severity={severity}
				testMessage={testMessage}
			/>
		</div>
	);
};

const mapStateToProps = (state: DataViewerMiddleStateProps & any) => {
	return {
		chartProp: state.chartProperties,
		tabTileProps: state.tabTileProps,
		dynamicMeasureState: state.dynamicMeasuresState,
		chartControls: state.chartControls,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setMenu: (menu: string) => dispatch(setSelectedControlMenu(menu)),

		changeChartOption: (propKey: string, chartValue: any) =>
			dispatch(changeChartOptionSelected(propKey, chartValue)),

		addNewDynamicMeasurePropsFromNewTab: (
			tabId: number,
			tileId: number,
			dynamicMeasureId: number,
			dataset: any
		) =>
			dispatch(addNewDynamicMeasurePropsFromNewTab(tabId, tileId, dynamicMeasureId, dataset)),
		addNewDynamicMeasurePropsFromNewTile: (
			tabId: number,
			tileId: number,
			dynamicMeasureId: number,
			dataset: any
		) =>
			dispatch(
				addNewDynamicMeasurePropsFromNewTile(tabId, tileId, dynamicMeasureId, dataset)
			),
		addNewDynamicMeasurePropsForSameTile: (
			tabId: number,
			tileId: number,
			dynamicMeasureId: number,
			dataset: any
		) =>
			dispatch(
				addNewDynamicMeasurePropsForSameTile(tabId, tileId, dynamicMeasureId, dataset)
			),
		setSelectedTileIdForDM: (tileId: number) =>
			dispatch(setSelectedTileIdInDynamicMeasureState(tileId)),
		setSelectedTabIdForDM: (tabId: number) =>
			dispatch(setSelectedTabIdInDynamicMeasureState(tabId)),
		deletingDynamicMeasure: (tabId: number, tileId: number, dmId: number) =>
			dispatch(deletingDynamicMeasure(tabId, tileId, dmId)),
		setSelectedDynamicMeasureId: (dmId: number) => dispatch(setSelectedDynamicMeasureId(dmId)),
		onCheckorUncheckOnDm: (
			dmId: string,
			value: boolean,
			propKey: string,
			dmValue: any,
			styleObj: any
		) => dispatch(onCheckorUncheckOnDm(dmId, value, propKey, dmValue, styleObj)),
		setDynamicMeasureWindowOpen: (propKey: string, chartValue: any) =>
			dispatch(setDynamicMeasureWindowOpen(propKey, chartValue)),

		setSelectedToEdit: (tabId: number, tileId: number, dmId: number, value: boolean) =>
			dispatch(setSelectedToEdit(tabId, tileId, dmId, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewerMiddle);
