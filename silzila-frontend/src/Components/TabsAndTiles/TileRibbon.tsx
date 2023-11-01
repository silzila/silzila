// This component provides list of all tiles for a given tab

import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
	actionsToAddTile,
	actionsToCompleteRenameTile,
	actionsToEnableRenameTile,
	actionsToRemoveTile,
	actionsToUpdateSelectedTile,
} from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";

import IndividualTile from "./IndividualTile";
import { TileRibbonProps, TileRibbonStateProps } from "./TileRibbonInterfaces";
import AddIcon from "@mui/icons-material/Add";
import { addChartFilterTabTileName } from "../../redux/ChartFilterGroup/ChartFilterGroupStateActions";
import Logger from "../../Logger";

const TileRibbon = ({
	// state
	tabTileProps,
	tabState,
	tileState,
	tableData,
	chartProp,
	chartGroup,

	// dispatch
	addTile,
	selectTile,
	enableRenameTile,
	completeRenameTile,
	removeTile,
	addChartFilterTabTileName,
}: TileRibbonProps) => {
	const addReportFilterGroup = (nextPropKey: string) => {
		var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
		let selectedDatasetID = chartProp.properties[propKey].selectedDs.id;

		///	if (!(selectedFilterGroups && selectedFilterGroups.length > 0)) {
		addChartFilterTabTileName(selectedDatasetID, nextPropKey);
		///	}
	};

	// adding new tile information to store
	const handleAddTile = () => {
		let tabObj = tabState.tabs[tabTileProps.selectedTabId];

		var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

		addTile(
			tabObj.tabId,
			tabObj.nextTileId,
			tabTileProps.selectedTable,
			chartProp.properties[propKey].selectedDs,
			chartProp.properties[propKey].selectedTable
		);

		addReportFilterGroup(`${tabObj.tabId}.${tabObj.nextTileId}`);
	};

	const handleSelectTile = (tileId: number, tileName: string, tabId: number, tabName: string) => {
		let tabObj = tabState.tabs[tabTileProps.selectedTabId];
		let nextTileId = tabObj.nextTileId;

		let propKey: string = `${tabId}.${tileId}`;
		let chartObj: any = chartProp.properties[propKey];
		selectTile(tabId, tileName, tileId, nextTileId, false, chartObj.fileId);
	};

	const handleRenameTileBegin = (tabId: number, tileId: number) => {
		enableRenameTile(tabId, tileId, true);
	};

	const handleRenameTileComplete = (renameValue: string, tabId: number, tileId: number) => {
		let tabObj = tabState.tabs[tabTileProps.selectedTabId];
		let nextTileId = tabObj.nextTileId;
		completeRenameTile(tabId, tileId, renameValue, nextTileId, false);
	};

	// Selecting which tile to highlight next
	// if we are removing a tile that is currently selected, pick another tile before or after to highlight.
	// Else no change in highlighting tiles

	const handleRemoveTile = (tabId: number, tileId: number) => {
		let tilesForSelectedTab = tileState.tileList[tabId];

		let numTiles = tilesForSelectedTab.length;
		let tileIndex = tilesForSelectedTab.findIndex(tile => tile === `${tabId}.${tileId}`);

		let prevSelectedTile = tabTileProps.selectedTileId;
		if (tileId === prevSelectedTile) {
			Logger("info", "case 1");
			// handle selecting a new tile
			let nextTileId = tabTileProps.nextTileId;
			if (numTiles === 1) {
				Logger("info", "case 1.1");
				handleAddTile();
				removeTile(tabId, tileId, tileIndex);
			} else {
				Logger("info", "case 1.2");
				// if there are more than one tiles
				let selectedTileName = "";
				let selectedTileId = 0;

				if (tileIndex !== 0) {
					Logger("info", "case 1.2.1");
					let newTileKey: string = tilesForSelectedTab[tileIndex - 1];
					let newTileObj = tileState.tiles[newTileKey];
					selectedTileName = newTileObj.tileName;
					selectedTileId = newTileObj.tileId;
					let propKey: string = `${tabId}.${tileId}`;
					let chartObj: any = chartProp.properties[propKey];

					selectTile(
						tabId,
						selectedTileName,
						selectedTileId,
						nextTileId,
						false,
						chartObj.fileId
					);
					removeTile(tabId, tileId, tileIndex);
				} else {
					Logger("info", "case 1.2.2");
					let newTileKey: string = tilesForSelectedTab[tileIndex + 1];
					let newTileObj = tileState.tiles[newTileKey];
					selectedTileName = newTileObj.tileName;
					selectedTileId = newTileObj.tileId;
					let propKey: string = `${tabId}.${tileId}`;
					let chartObj: any = chartProp.properties[propKey];

					selectTile(
						tabId,
						selectedTileName,
						selectedTileId,
						nextTileId,
						false,
						chartObj.fileId
					);
					removeTile(tabId, tileId, tileIndex);
				}
				// let propKey: string = `${tabId}.${tileId}`;
				// let chartObj: any = chartProp.properties[propKey];
				// selectTile(
				// 	tabId,
				// 	selectedTileName,
				// 	selectedTileId,
				// 	nextTileId,
				// 	false,
				// 	chartObj.fileId
				// );
			}
		} else {
			Logger("info", "case 2");
			removeTile(tabId, tileId, tileIndex);
		}
	};

	let tilesForSelectedTab: any[] = tileState.tileList[tabTileProps.selectedTabId];
	const tileList = tilesForSelectedTab.map((tile: number) => {
		let currentObj: any = tileState.tiles[tile];
		return (
			<IndividualTile
				key={currentObj.tileId}
				tabName={currentObj.tabName}
				tileName={currentObj.tileName}
				editing={tabTileProps.editTileName}
				selectedTile={tabTileProps.selectedTileId}
				tabId={currentObj.tabId}
				tileId={currentObj.tileId}
				showDash={tabTileProps.showDash}
				// actions to call back
				renameTileBegin={handleRenameTileBegin}
				renameTileComplete={handleRenameTileComplete}
				selectTile={handleSelectTile}
				removeTile={handleRemoveTile}
			/>
		);
	});

	return (
		<React.Fragment>
			{tileList}

			<span
				title="Create a new tile"
				// className="plusTile commonTile"
				className="plusTile"
				onClick={() => handleAddTile()}
			>
				<AddIcon sx={{ fontSize: "16px", marginTop: "2px" }} />
			</span>
		</React.Fragment>
	);
};

const mapStateToProps = (state: TileRibbonStateProps) => {
	return {
		tabTileProps: state.tabTileProps,
		tabState: state.tabState,
		tileState: state.tileState,
		tableData: state.tableData,
		chartProp: state.chartProperties,
		chartGroup: state.chartFilterGroup,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		addTile: (
			tabId: number,
			nextTileId: number,
			table: any,
			selectedDataset: any,
			selectedTables: any
		) =>
			dispatch(
				actionsToAddTile({
					tabId,
					nextTileId,
					table,
					fromTab: false,
					selectedDs: selectedDataset,
					selectedTablesInDs: selectedTables,
				})
			),

		selectTile: (
			tabId: number,
			tileName: string,
			tileId: number,
			nextTileId: number,
			fromTab: any,
			fileId: any
		) =>
			dispatch(
				actionsToUpdateSelectedTile(tabId, tileName, tileId, nextTileId, fromTab, fileId)
			),

		enableRenameTile: (tabId: number, tileId: number, isTrue: boolean) =>
			dispatch(actionsToEnableRenameTile(tabId, tileId, isTrue)),

		completeRenameTile: (
			tabId: number,
			tileId: number,
			renameValue: string,
			nextTileId: number,
			isTrue: boolean
		) => dispatch(actionsToCompleteRenameTile(tabId, tileId, renameValue, nextTileId, isTrue)),

		removeTile: (tabId: number, tileId: number, tileIndex: number) =>
			dispatch(actionsToRemoveTile(tabId, tileId, tileIndex)),
		addChartFilterTabTileName: (selectedDatasetID: string, tabTileName: string) =>
			dispatch(addChartFilterTabTileName(selectedDatasetID, tabTileName)),
		// showDashBoard: (tabId, showDash) => dispatch(actions.setShowDashBoard(tabId, showDash)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TileRibbon);
