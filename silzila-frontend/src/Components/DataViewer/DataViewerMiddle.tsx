// This component houses the following
// 	- Dropzones for table fields
// 	- Graph section
// 	- Chart types / Controls selection menu

import React from "react";
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

const DataViewerMiddle = ({
	// props
	tabId,
	tileId,

	// state
	tabTileProps,
	chartProp,

	// dispatch
	setMenu,
}: DataViewerMiddleProps) => {
	var propKey: string = `${tabId}.${tileId}`;

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
							<CloseSharp
								sx={{
									fontSize: "16px",
									float: "right",
									marginTop: "5px",
									marginRight: "1rem",
								}}
								onClick={() => setMenu("")}
							/>
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
							<CloseSharp
								sx={{
									fontSize: "16px",
									float: "right",
									marginTop: "5px",
									marginRight: "12px",
								}}
								onClick={() => setMenu("")}
							/>
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
									// padding: "0 0.5rem",
									padding: "10px 0 0 0.5rem",
									marginBottom: "3px",
								}}
							>
								Report Filter
								<CloseSharp
									sx={{
										fontSize: "16px",
										float: "right",
										marginTop: "5px",
										marginRight: "12px",
									}}
									onClick={() => setMenu("")}
								/>
							</div>
							<ChartFilterGroupsContainer propKey={propKey} fromDashboard={false}></ChartFilterGroupsContainer>
						</div>
					);
			default:
				return null;
		}
	};

	return (
		<div className="dataViewerMiddle" style={{ height: "300px" }}>
			{chartProp.properties[propKey].chartType === "richText" ? null : (
				<ChartAxes tabId={tabId} tileId={tileId} />
			)}

			<GraphArea />

			<div className="rightColumn">{controlDisplayed()}</div>
		</div>
	);
};

const mapStateToProps = (state: DataViewerMiddleStateProps) => {
	return {
		chartProp: state.chartProperties,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setMenu: (menu: string) => dispatch(setSelectedControlMenu(menu)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewerMiddle);
