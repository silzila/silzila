// This component provides list of all tabs for a given playbook

import React from "react";
import { connect } from "react-redux";
import IndividualTab from "./IndividualTab";
import { Dispatch } from "redux";
import { TabTilPropsSelectedDatasetList } from "../../redux/TabTile/TabTilePropsInterfaces";

import { TabRibbonProps, TabRibbonStateProps } from "./TabRibbonInterfaces";
import { IndTabs } from "../../redux/TabTile/TabStateInterfaces";
import {
	actionsToEnableRenameTab,
	actionsToRenameTab,
	actionsToSelectTab,
} from "../../redux/TabTile/actionsTabTile";
import {
	actionsToAddTab,
	actionsToRemoveTab,
	actionsToUpdateSelectedTile,
} from "../../redux/TabTile/TabTileActionsAndMultipleDispatches";
import AddIcon from "@mui/icons-material/Add";
import { addChartFilterTabTileName } from "../../redux/ChartFilterGroup/ChartFilterGroupStateActions";
import Logger from "../../Logger";

const TabRibbon = ({
	// state
	tabTileProps,
	tabState,
	// tileState,
	// tableData,
	chartProp,
	chartGroup,

	// dispatch
	addTab,
	selectTab,
	removeTab,
	enableRenameTab,
	completeRenameTab,
	selectTile,
	addChartFilterTabTileName,
}: TabRibbonProps) => {
	const addReportFilterGroup = (nextPropKey: string) => {
		var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

		// let selectedFilterGroups = chartGroup.tabTile[propKey] || [];
		let selectedDatasetID = chartProp.properties[propKey].selectedDs.id;

		//	if (!(selectedFilterGroups && selectedFilterGroups.length > 0)) {
		addChartFilterTabTileName(selectedDatasetID, nextPropKey);
		///	}
	};

	const handleAddTab = () => {
		let tabId: number = tabTileProps.nextTabId;

		var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

		addTab(
			tabId,
			tabTileProps.selectedTable,
			chartProp.properties[propKey].selectedDs,
			chartProp.properties[propKey].selectedTable
		);

		addReportFilterGroup(`${tabId}.${tabTileProps.selectedTileId}`);
	};

	const handleSelectTab = (tabName: string, tabId: number) => {
		// handle how to get selected tile for the switching tab and update it in two places - tabTileProps and tabState
		let tabObj: IndTabs = tabState.tabs[tabId];

		// changes:
		//  added showDashBoard(tabObj.tabId, tabObj.showDash); in dataviewer comp under onchange
		// once tabtileProps-> dashmode set to present then that remain same for all the tabs that can be selected after this
		// once tabTileprops-> dashmode set to "Edit" then that mode remain same for all tabs that can be selected after this
		// ...but tabtileProps->showdash will change according to individual tab prop(tabstate->tabs->tabid-> showdash)

		if (tabTileProps.dashMode === "Present") {
			selectTab(tabName, tabId, true, "Present");
		} else {
			selectTab(tabName, tabId, tabObj.showDash, tabObj.dashMode);
		}

		let tileName: string = tabObj.selectedTileName;
		let tileId: number = tabObj.selectedTileId;
		let nextTileId: number = tabObj.nextTileId;

		// let propKey:string = `${tabId}.${tileId}`;
		// let chartObj: IndChartPropProperties = chartProp.properties[propKey];

		selectTile(tabId, tileName, tileId, nextTileId, true);
	};

	const handleRemoveTab = (tabName: string, tabId: number) => {
		// getting params to pass for removeTab dispatch
		let tabToRemoveIndex: number = tabState.tabList.findIndex((item: number) => item === tabId);
		let selectedTab: number = tabTileProps.selectedTabId;
		let addingNewTab: boolean = false;

		// Selecting which tab to highlight next
		// if we are removing a tab that is currently selected, pick another tab before or after to highlight.
		// Else no change in highlighting tabs
		if (tabId === selectedTab) {
			// choosing next selection, move left
			let nextSelection: number = tabToRemoveIndex - 1;

			// if this is the first tab, move right
			if (nextSelection < 0) {
				// if this is the only tab in the work area
				if (tabState.tabList.length === 1) {
					addingNewTab = true;
					handleAddTab();
				}

				// if there are more than one tab
				else {
					nextSelection = 1;
				}
			}

			// choosing appropriate dispatch based on whether we are adding a tab or not
			if (addingNewTab) {
				removeTab(tabName, tabId, tabToRemoveIndex);
			} else {
				Logger("info", "case");
				let newTabId: number = tabState.tabList[nextSelection];
				let newObj: IndTabs = tabState.tabs[newTabId];

				removeTab(tabName, tabId, tabToRemoveIndex, newObj);
			}
		} else {
			removeTab(tabName, tabId, tabToRemoveIndex);
		}
	};

	// called when tabName is doubleClicked
	const handleRenameTabBegin = (tabId: number) => {
		enableRenameTab(tabId, true);
	};

	// called when renaming tab is complete
	const handleRenameTabComplete = (renameValue: string, tabId: number) => {
		// enableRenameTab(tabId, false);
		completeRenameTab(renameValue, tabId);
	};

	const tablist = tabState.tabList.map((tab: number) => {
		let currentObj: IndTabs = tabState.tabs[tab];
		return (
			<IndividualTab
				key={currentObj.tabId}
				tabName={currentObj.tabName}
				editing={tabTileProps.editTabName}
				selectedTab={tabTileProps.selectedTabId}
				tabId={currentObj.tabId}
				// actions to call back
				selectTab={handleSelectTab}
				removeTab={handleRemoveTab}
				renameTabBegin={handleRenameTabBegin}
				renameTabComplete={handleRenameTabComplete}
				//showdash prop
				showDash={tabTileProps.showDash}
				dashMode={tabTileProps.dashMode}
			/>
		);
	});

	return (
		<div className="tabItems" style={{ display: "flex" }}>
			{tablist}
			{/* If dashboard in the presentation mode the '+'(adding new tab) will be disappear */}
			{tabTileProps.dashMode !== "Present" ? (
				<span title="Create a new tab" className="plusTab" onClick={() => handleAddTab()}>
					<AddIcon sx={{ fontSize: "16px", marginTop: "3px" }} />
				</span>
			) : null}
		</div>
	);
};

const mapStateToProps = (state: TabRibbonStateProps) => {
	return {
		tabTileProps: state.tabTileProps,
		tabState: state.tabState,
		chartProp: state.chartProperties,
		chartGroup: state.chartFilterGroup,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		// ###########################################################
		// Tab related dispatch methods
		// ###########################################################
		addTab: (
			tabId: number,
			table: any,
			selectedDs: TabTilPropsSelectedDatasetList,
			selectedTablesInDs: any
		) => dispatch(actionsToAddTab({ tabId, table, selectedDs, selectedTablesInDs })),
		selectTab: (tabName: string, tabId: number, showDash: boolean, dashMode: string) =>
			dispatch(actionsToSelectTab(tabName, tabId, showDash, dashMode)),
		removeTab: (tabName: string, tabId: number, tabToRemoveIndex: number, newObj?: any) =>
			dispatch(actionsToRemoveTab(tabName, tabId, tabToRemoveIndex, newObj)),
		enableRenameTab: (tabId: number, isTrue: boolean) =>
			dispatch(actionsToEnableRenameTab(tabId, isTrue)),
		completeRenameTab: (renameValue: string, tabId: number) =>
			dispatch(actionsToRenameTab(renameValue, tabId)),
		// ###########################################################
		// Tile related dispatch methods
		// ###########################################################
		selectTile: (
			tabId: number,
			tileName: string,
			tileId: number,
			nextTileId: number,
			fromTab: boolean
		) => dispatch(actionsToUpdateSelectedTile(tabId, tileName, tileId, nextTileId, fromTab)),
		addChartFilterTabTileName: (selectedDatasetID: string, tabTileName: string) =>
			dispatch(addChartFilterTabTileName(selectedDatasetID, tabTileName)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TabRibbon);
