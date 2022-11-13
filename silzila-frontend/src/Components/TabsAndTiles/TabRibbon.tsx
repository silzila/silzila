// This component provides list of all tabs for a given playbook

import React from "react";
import { connect } from "react-redux";
import IndividualTab from "./IndividualTab";
import * as actions from "../../redux/TabTile/actionsTabTile";
import { Dispatch } from "redux";

const TabRibbon = ({
	// state
	tabTileProps,
	tabState,
	// tileState,
	// tableData,
	chartProp,

	// dispatch
	addTab,
	selectTab,
	removeTab,
	enableRenameTab,
	completeRenameTab,
	selectTile,
}: any) => {
	const handleAddTab = () => {
		let tabId = tabTileProps.nextTabId;

		var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

		addTab(
			tabId,
			tabTileProps.selectedTable,
			chartProp.properties[propKey].selectedDs,
			chartProp.properties[propKey].selectedTable
		);
	};

	const handleSelectTab = (tabName: any, tabId: any) => {
		// handle how to get selected tile for the switching tab and update it in two places - tabTileProps and tabState
		let tabObj = tabState.tabs[tabId];

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

		let tileName = tabObj.selectedTileName;
		let tileId = tabObj.selectedTileId;
		let nextTileId = tabObj.nextTileId;

		let propKey = `${tabId}.${tileId}`;
		let chartObj = chartProp.properties[propKey];
		selectTile(tabId, tileName, tileId, nextTileId, chartObj.fileId, true);
	};

	const handleRemoveTab = (tabName: any, tabId: any) => {
		// getting params to pass for removeTab dispatch
		let tabToRemoveIndex = tabState.tabList.findIndex((item: any) => item === tabId);
		let selectedTab = tabTileProps.selectedTabId;
		let addingNewTab = false;

		// Selecting which tab to highlight next
		// if we are removing a tab that is currently selected, pick another tab before or after to highlight.
		// Else no change in highlighting tabs
		if (tabId === selectedTab) {
			// choosing next selection, move left
			let nextSelection = tabToRemoveIndex - 1;

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
				let newTabId = tabState.tabList[nextSelection];
				let newObj = tabState.tabs[newTabId];

				removeTab(tabName, tabId, tabToRemoveIndex, newObj);
			}
		} else {
			removeTab(tabName, tabId, tabToRemoveIndex);
		}
	};

	// called when tabName is doubleClicked
	const handleRenameTabBegin = (tabId: any) => {
		enableRenameTab(tabId, true);
	};

	// called when renaming tab is complete
	const handleRenameTabComplete = (renameValue: any, tabId: any) => {
		// enableRenameTab(tabId, false);
		completeRenameTab(renameValue, tabId);
	};

	const tablist = tabState.tabList.map((tab: any) => {
		let currentObj = tabState.tabs[tab];
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
		<div className="tabItems">
			{tablist}
			{/* If dashboard in the presentation mode the '+'(adding new tab) will be disappear */}
			{tabTileProps.dashMode !== "Present" ? (
				<span
					title="Create a new tab"
					className="plusTab commonTab"
					onClick={() => handleAddTab()}
				>
					+
				</span>
			) : null}
		</div>
	);
};

const mapStateToProps = (state: any) => {
	return {
		tabTileProps: state.tabTileProps,
		tabState: state.tabState,
		chartProp: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		// ###########################################################
		// Tab related dispatch methods
		// ###########################################################
		// addTab: (tabId: any, table: any, selectedDs: any, selectedTablesInDs: any) =>
		// 	dispatch(actions.actionsToAddTab({ tabId, table, selectedDs, selectedTablesInDs })),
		// selectTab: (tabName: any, tabId: any, showDash: any, dashMode: any) =>
		// 	dispatch(actions.actionsToSelectTab({ tabName, tabId, showDash, dashMode })),
		// removeTab: (tabName: any, tabId: any, tabToRemoveIndex: any, newObj: any) =>
		// 	dispatch(actions.actionsToRemoveTab({ tabName, tabId, tabToRemoveIndex, newObj })),
		// enableRenameTab: (tabId: any, isTrue: any) =>
		// 	dispatch(actions.actionsToEnableRenameTab({ tabId, isTrue })),
		// completeRenameTab: (renameValue: any, tabId: any) =>
		// 	dispatch(actions.actionsToRenameTab({ renameValue, tabId })),
		// ###########################################################
		// Tile related dispatch methods
		// ###########################################################
		// selectTile: (
		// 	tabId: any,
		// 	tileName: any,
		// 	tileId: any,
		// 	nextTileId: any,
		// 	fileId: any,
		// 	fromTab: any
		// ) =>
		// 	dispatch(
		// 		actions.actionsToUpdateSelectedTile({
		// 			tabId,
		// 			tileName,
		// 			tileId,
		// 			nextTileId,
		// 			fileId,
		// 			fromTab,
		// 		})
		// 	),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TabRibbon);
