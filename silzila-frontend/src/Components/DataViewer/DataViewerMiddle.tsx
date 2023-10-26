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

import ChartFilterGroupsContainer from "../ChartFilterGroup/ChartFilterGroupsContainer";
import { AlertColor, Tooltip } from "@mui/material";
import DynamicMeasureWindow from "./DynamicMeasureWindow";
import {
	setSelectedTabIdInDynamicMeasureState,
	setSelectedTileIdInDynamicMeasureState,
	setSelectedToEdit,
} from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import { changeChartOptionSelected } from "../../redux/ChartPoperties/ChartPropertiesActions";
import { NotificationDialog } from "../CommonFunctions/DialogComponents";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const DataViewerMiddle = ({
	// props
	tabId,
	tileId,

	// state
	tabTileProps,
	chartProp,

	// dispatch
	setMenu,

	setSelectedTileIdForDM,
	setSelectedTabIdForDM,
}: DataViewerMiddleProps & any) => {
	var propKey: string = `${tabId}.${tileId}`;
	// var tabId = tabTileProps.selectedTabId;
	// var tileId = tabTileProps.selectedTileId;

	useEffect(() => {
		setSelectedTileIdForDM(tileId);
		setSelectedTabIdForDM(tabId);
	}, [tileId, tabId]);

	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("");
	const [severity, setSeverity] = useState<AlertColor>("success");

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

	return (
		<div className="dataViewerMiddle" style={{ height: "300px" }}>
			{chartProp.properties[propKey].chartType === "richText" ? (
				<>
					<GraphArea />
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

		setSelectedTileIdForDM: (tileId: number) =>
			dispatch(setSelectedTileIdInDynamicMeasureState(tileId)),
		setSelectedTabIdForDM: (tabId: number) =>
			dispatch(setSelectedTabIdInDynamicMeasureState(tabId)),
		setSelectedToEdit: (tabId: number, tileId: number, dmId: number, value: boolean) =>
			dispatch(setSelectedToEdit(tabId, tileId, dmId, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewerMiddle);
