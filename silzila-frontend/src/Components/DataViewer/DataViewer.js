// This is the main component where a Playbook with its tabs, tiles and dashboard is rendered
// The page is further grouped into DataViewerMiddle & DataViewerBottom components
//
// 	- DataViewerMiddle holds the following
// 		- drop zones for table columns,
// 		- graph area,
// 		- all the chart control actions

// 	- DataViewerBottom holds the following
// 		- selectedDataset list to work with this playbook,
// 		- list of tables for this dataset &
// 		- Sample records from selected table

import React, { useState } from "react";
import "./dataViewer.css";
import { connect } from "react-redux";
import {
	setShowDashBoard,
	toggleColumnsOnlyDisplay,
	toggleShowDataViewerBottom,
} from "../../redux/TabTile/actionsTabTile";
import TableViewIcon from "@mui/icons-material/TableView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import listOfTilesIcon from "../../assets/listoftilesIcon.svg";
import dashbordSizeIcon from "../../assets/screenSize.png";
import MenuBar from "./MenuBar";

function DataViewer({
	// state
	tabTileProps,

	// dispatch
	showDashBoard,
	toggleColumns,
	toggleDataViewerBottom,
}) {
	const [showListofTileMenu, setShowListofTileMenu] = useState(true);
	const [dashboardResizeColumn, setDashboardResizeColumn] = useState(false);

	// Whether to show table at the bottom of page or not
	const handleTableDisplayToggle = () => {
		toggleDataViewerBottom(!tabTileProps.showDataViewerBottom);
	};

	// switching between Table with all sample records Or just list the columns of selected table
	const handleColumnsOnlyDisplay = col => {
		toggleColumns(col);
	};

	// ===========================================================================================
	//                                      UI Components
	// ===========================================================================================

	const menuIconStyle = {
		width: "26px",
		height: "26px",
		margin: "auto 10px auto 0",
		padding: "2px",
		borderBottom: "2px solid transparent",
	};
	const menuIconSelectedStyle = {
		width: "26px",
		height: "26px",
		margin: "auto 10px auto 0",
		padding: "2px",
		backgroundColor: "#ffffff",
		borderBottom: "2px solid rgb(0,128,255)",
	};

	return (
		<div className="dataViewer">
			<MenuBar from="dataViewer" />
			<div className="tabArea">
				{tabTileProps.showDash || tabTileProps.dashMode === "Present" ? (
					<div style={{ display: "flex", alignItems: "center" }}>
						{tabTileProps.dashMode === "Edit" ? (
							<>
								<img
									key="List of Tiles"
									style={
										showListofTileMenu ? menuIconSelectedStyle : menuIconStyle
									}
									src={listOfTilesIcon}
									alt="List of Tiles"
									onClick={() => {
										if (tabTileProps.dashMode === "Edit") {
											setDashboardResizeColumn(false);
											setShowListofTileMenu(!showListofTileMenu);
										}
									}}
									title="List of Tiles"
								/>

								<img
									key="dashBoard Size"
									style={
										dashboardResizeColumn
											? menuIconSelectedStyle
											: menuIconStyle
									}
									src={dashbordSizeIcon}
									alt="dashBoard Size"
									onClick={() => {
										if (tabTileProps.dashMode === "Edit") {
											setShowListofTileMenu(false);
											setDashboardResizeColumn(!dashboardResizeColumn);
										}
									}}
									title="DashBoard Size"
								/>
							</>
						) : null}
					</div>
				) : null}
			</div>

		

			{/* Dashboard present and edit mode related UI */}
			{tabTileProps.dashMode === "Edit" ? (
				<div className="tilearea">
					<div className="tileItems">
						<span
							title="Dashboard"
							className={
								tabTileProps.showDash
									? "plusTile commonTile indiItemHighlightTile"
									: "plusTile commonTile indiItemTile"
							}
							onClick={() => {
								showDashBoard(tabTileProps.selectedTabId, true);
							}}
						>
							Dashboard
						</span>

					</div>

					{!tabTileProps.showDash ? (
						tabTileProps.showDataViewerBottom ? (
							<>
								<div className="showTableColumns">
									{tabTileProps.columnsOnlyDisplay ? (
										<TableChartOutlinedIcon
											style={{ fontSize: "20px", color: "#404040" }}
											onClick={() => handleColumnsOnlyDisplay(false)}
											title="Show full table"
										/>
									) : (
										<TableRowsIcon
											style={{ fontSize: "20px", color: "#404040" }}
											onClick={() => handleColumnsOnlyDisplay(true)}
											title="Show Column Headers only"
										/>
									)}
								</div>
								<div
									className="tableDisplayToggle"
									onClick={handleTableDisplayToggle}
									title="Show / Hide table"
								>
									<TableViewIcon style={{ fontSize: "20px" }} />
								</div>
							</>
						) : (
							<div
								className="tableDisplayToggle"
								onClick={handleTableDisplayToggle}
								title="Show / Hide table"
							>
								<TableViewIcon style={{ fontSize: "20px", color: "#808080" }} />
							</div>
						)
					) : null}
				</div>
			) : null}
		</div>
	);
}

// ===========================================================================================
//                                 REDUX MAPPING STATE AND DISPATCH TO PROPS
// ===========================================================================================

const mapStateToProps = state => {
	return {
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		showDashBoard: (tabId, showDash) => dispatch(setShowDashBoard(tabId, showDash)),
		toggleColumns: columns => dispatch(toggleColumnsOnlyDisplay(columns)),
		toggleDataViewerBottom: show => dispatch(toggleShowDataViewerBottom(show)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DataViewer);
