// This component houses the following
// 	- Dropzones for table fields
// 	- Graph section
// 	- Chart types / Controls selection menu

import React from "react";
import { connect } from "react-redux";

import "./dataViewerMiddle.css";
import chartControlIcon from "../../assets/chart-control-icon.svg";
import settingsIcon from "../../assets/charts_theme_settings_icon.svg";

import { Dispatch } from "redux";
import {
	DataViewerMiddleProps,
	DataViewerMiddleStateProps,
	RenderMenuItems,
} from "./DataViewerMiddleInterfaces";
import { setSelectedControlMenu } from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import ChartTypes from "../ChartOptions/ChartTypes";
import ControlDetail from "../ChartOptions/ControlDetail";
import ChartAxes from "../ChartAxes/ChartAxes";
import GraphArea from "../GraphArea/GraphArea";

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
	// console.log(chartProp);
	var propKey: number = parseFloat(`${tabId}.${tileId}`);
	const rmenu: RenderMenuItems[] = [
		{ name: "Charts", icon: chartControlIcon },
		{ name: "Chart controls", icon: settingsIcon },
	];

	const renderMenu = rmenu.map((rm: RenderMenuItems, i: number) => {
		return (
			<img
				key={rm.name}
				className={
					rm.name === tabTileProps.selectedControlMenu
						? "controlsIcon selectedIcon"
						: "controlsIcon"
				}
				src={rm.icon}
				alt={rm.name}
				onClick={() => {
					if (tabTileProps.selectedControlMenu === rm.name) {
						setMenu("");
					} else {
						setMenu(rm.name);
					}
				}}
				title={rm.name}
			/>
		);
	});

	const controlDisplayed = () => {
		switch (tabTileProps.selectedControlMenu) {
			case "Charts":
				return (
					<div className="rightColumnControlsAndFilters">
						<div className="axisTitle">Charts</div>
						<ChartTypes propKey={propKey} />
					</div>
				);

			case "Chart controls":
				return (
					<div className="rightColumnControlsAndFilters">
						<div className="axisTitle">Charts Controls</div>
						{/* <ChartControlObjects /> */}
						<ControlDetail />
					</div>
				);

			case "Filter":
				return (
					<div className="rightColumnControlsAndFilters">
						<div className="axisTitle">Filters</div>
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

			<div className="rightColumn">
				{controlDisplayed()}
				<div className="rightColumnMenu">{renderMenu}</div>
			</div>
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
