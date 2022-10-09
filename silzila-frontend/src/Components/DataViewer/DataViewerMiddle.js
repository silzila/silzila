// This component houses the following
// 	- Dropzones for table fields
// 	- Graph section
// 	- Chart types / Controls selection menu

import React from "react";
import { connect } from "react-redux";
import "./dataViewerMiddle.css";
import chartControlIcon from "../../assets/chart-control-icon.svg";
import settingsIcon from "../../assets/charts_theme_settings_icon.svg";
import { setSelectedControlMenu } from "../../redux/TabTile/actionsTabTile";

const DataViewerMiddle = ({
	// props
	tabId,
	tileId,

	// state
	tabTileProps,
	chartProp,

	// dispatch
	setMenu,
}) => {
	// console.log(chartProp);
	var propKey = `${tabId}.${tileId}`;
	const rmenu = [
		{ name: "Charts", icon: chartControlIcon },
		{ name: "Chart controls", icon: settingsIcon },
	];

	const renderMenu = rmenu.map((rm, i) => {
		return (
			<img
				key={i}
				// key={rm.name}
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
			<div className="rightColumn">
				{controlDisplayed()}
				<div className="rightColumnMenu">{renderMenu}</div>
			</div>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		chartProp: state.chartProperties,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setMenu: menu => dispatch(setSelectedControlMenu(menu)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewerMiddle);
