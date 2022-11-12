export interface DashLayout {
	dashboardLayout: string;
	selectedOptionForAuto: string;
	aspectRatio: { height: number; width: number };
	selectedOptionForFixed: string;
	custom: { height: number; width: number };
	customRange: { minHeight: number; minWidth: number; maxHeight: number; maxWidth: number };
}

export interface Tabs {
	[key: number]: {
		tabId: number;
		tabName: string;
		showDash: boolean;
		dashMode: string;
		dashLayout: DashLayout;
		selectedTileName: string;
		selectedTileId: number;
		nextTileId: number;
		tilesInDashboard: Array<any>;
		dashTilesDetails: Object;
	};
}
export interface TabStateProps {
	tabs: Tabs;
	tabList: number[];
}

export interface TabStateProps2 {
	tabState: TabStateProps;
}

interface AddingTab {
	type: "ADD_TAB";
	payload: number;
}

interface RemovingTab {
	type: "REMOVE_TAB";
	payload: {
		tabName: string;
		tabId: number;
		tabToRemoveIndex: number;
	};
}

interface RenamingTab {
	type: "RENAME_TAB";
	payload: {
		renameValue: string;
		tabId: number;
	};
}

interface UpdateNextTileId {
	type: "UPDATE_NEXT_TILE_ID";
	payload: {
		tileId: number;
		tabId: number;
	};
}

interface UpdateSelectedTileToTab {
	type: "SELECTED_TILE_IN_TAB";
	payload: {
		tabId: number;
		tileName: string;
		tileId: number;
	};
}

interface ShowDashboardInTab {
	type: "SHOW_DASHBOARD_IN_TAB";
	payload: { tabId: number; showDash: boolean };
}

interface ToggleDashModeInTab {
	type: "TOGGLE_DASH_MODE_IN_TAB";
	payload: { tabId: number; dashMode: string };
}

interface ActionsWithTabIdAndValueofNumber {
	type:
		| "SET_ASPECTRATIO_HEIGHT"
		| "SET_ASPECTRATIO_WIDTH"
		| "SET_CUSTOM_HEIGHT"
		| "SET_CUSTOM_WIDTH"
		| "SET_CR_MAX_HEIGHT"
		| "SET_CR_MAX_WIDTH"
		| "SET_CR_MIN_HEIGHT"
		| "SET_CR_MIN_WIDTH";

	payload: { tabId: number; value: number };
}

interface SetDashLayout {
	type: "SET_DASHLAYOUT";
	payload: { tabId: number; value: string };
}

//
interface SetDashLayoutSelectedOptionForAuto {
	type: "SET_DASHLAYOUT_SELECTEDOPTION_FOR_AUTO";
	payload: { tabId: number; value: string };
}

//
interface SetDashLayoutSelectedOptionForFixed {
	type: "SET_DASHLAYOUT_SELECTEDOPTION_FOR_FIXED";
	payload: { tabId: number; value: string };
}

interface ResetTabState {
	type: "RESET_TAB_STATE";
}

interface ResetGraphHighlight {
	type: "RESET_GRAPH_BORDER_HIGHLIGHT";
	payload: number;
}

export type ActionsOfTabState =
	| AddingTab
	| RemovingTab
	| RenamingTab
	| UpdateNextTileId
	| UpdateSelectedTileToTab
	| ShowDashboardInTab
	| ToggleDashModeInTab
	| SetDashLayout
	| SetDashLayoutSelectedOptionForAuto
	| SetDashLayoutSelectedOptionForFixed
	| ResetTabState
	| ResetGraphHighlight
	| ActionsWithTabIdAndValueofNumber;
