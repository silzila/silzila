export interface DashLayout {
	dashboardLayout: string;
	selectedOptionForAuto: string;
	aspectRatio: { height: number; width: number };
	selectedOptionForFixed: string;
	custom: { height: number; width: number };
	customRange: { minHeight: number; minWidth: number; maxHeight: number; maxWidth: number };
}

export interface IndTabs {
	tabId: number;
	tabName: string;
	showDash: boolean;
	dashMode: string;
	dashLayout: DashLayout;
	selectedTileName: string;
	selectedTileId: number;
	nextTileId: number;
	tilesInDashboard: any[];
	dashTilesDetails: any;
}

export interface Tabs {
	[key: number | string]: IndTabs;
}

export interface TabStateProps {
	tabs: Tabs;
	tabList: Array<number>;
}

export interface TabStateProps2 {
	tabState: TabStateProps;
}

//actions

//1
interface AddTab {
	type: "ADD_TAB";
	payload: number;
}

//2
interface RemoveTab {
	type: "REMOVE_TAB";
	payload: { tabName: string; tabId: number; tabToRemoveIndex: number };
}
//3
interface RenameTab {
	type: "RENAME_TAB";
	payload: {
		renameValue: string;
		tabId: number;
	};
}
//4
interface UpdateNextTileId {
	type: "UPDATE_NEXT_TILE_ID";
	payload: {
		nextTileId: number;
		tabId: number;
	};
}

//5
interface UpdateSelectedTileToTab {
	type: "SELECTED_TILE_IN_TAB";
	payload: {
		tabId: number;
		tileName: string;
		tileId: number;
	};
}
//6
interface ShowDashboardInTab {
	type: "SHOW_DASHBOARD_IN_TAB";
	payload: { tabId: number; showDash: boolean };
}

//7
interface ToggleDashModeInTab {
	type: "TOGGLE_DASH_MODE_IN_TAB";
	payload: { tabId: number; dashMode: string };
}

//8
interface UpdateTabDashDetails {
	type: "UPDATE_DASH_GRAPH_DETAILS";
	payload: {
		checked: boolean;
		propKey: string;
		dashSpecs: any;
		tabId: number;
		propIndex: number;
	};
}

//9
interface RemoveTilesInDashDuringDeleteTile {
	type: "REMOVE_TILES_IN_DASH_DURING_DELETE_TILE";
	payload: { tabId: number; propKey: string };
}
//10
interface UpdateDashGraphPosition {
	type: "UPDATE_DASH_GRAPH_POSITION";
	payload: { tabId: number; propKey: string; x: any; y: any };
}
//11
interface UpdateDashGraphSize {
	type: "UPDATE_DASH_GRAPH_SIZE";
	payload: { tabId: number; propKey: string; x: any; y: any; width: any; height: any };
}

//14
interface SetDashLayout {
	type: "SET_DASHLAYOUT";
	payload: { tabId: number; value: any };
}
//15
interface SetDashLayoutSelectedOptionForAuto {
	type: "SET_DASHLAYOUT_SELECTEDOPTION_FOR_AUTO";
	payload: { tabId: number; value: any };
}

//16
interface SetAspectRatioHeight {
	type: "SET_ASPECTRATIO_HEIGHT";
	payload: { tabId: number; value: any };
}
//17
interface SetAspectRatioWidth {
	type: "SET_ASPECTRATIO_WIDTH";
	payload: { tabId: number; value: any };
}
//18
interface SetCustomHeight {
	type: "SET_CUSTOM_HEIGHT";
	payload: { tabId: number; value: any };
}
//19
interface SetCustomWidth {
	type: "SET_CUSTOM_WIDTH";
	payload: { tabId: number; value: any };
}
//20
interface SetCustomRMaxWidth {
	type: "SET_CR_MAX_WIDTH";
	payload: { tabId: number; value: any };
}
//21
interface SetCustomRMinWidth {
	type: "SET_CR_MIN_WIDTH";
	payload: { tabId: number; value: any };
}
//22
interface SetCustomRMaxHeight {
	type: "SET_CR_MAX_HEIGHT";
	payload: { tabId: number; value: any };
}

//23
interface SetCustomRMinHeight {
	type: "SET_CR_MIN_HEIGHT";
	payload: { tabId: number; value: any };
}

//24
interface SetDashLayoutSelectedOptionForFixed {
	type: "SET_DASHLAYOUT_SELECTEDOPTION_FOR_FIXED";
	payload: { tabId: number; value: any };
}

//25
interface LoadTabState {
	type: "LOAD_TAB_STATE_FROM_PLAYBOOK";
	payload: any;
}
//26

interface ResetTabState {
	type: "RESET_TAB_STATE";
}

interface UpdateSelectedTile {
	type: "SELECTED_TILE";
	payload: {
		tileName: string;
		tileId: number;
		nextTileId: number;
	};
}

interface ToggleEditingTab {
	type: "EDITING_TAB";
	payload: boolean;
}
interface ShowDashBoard {
	type: "SHOW_DASHBOARD";
	payload: boolean;
}

interface ResetGraphHighlight {
	type: "RESET_GRAPH_BORDER_HIGHLIGHT";
	payload: number;
}
interface UpdateGraphHighlight {
	type: "SET_GRAPH_BORDER_HIGHLIGHT";
	payload: { tabId: number; propKey: string; highlight: any };
}

export type ActionsOfTabState =
	| AddTab
	| RemoveTab
	| RenameTab
	| UpdateNextTileId
	| UpdateSelectedTileToTab
	| ShowDashboardInTab
	| ToggleDashModeInTab
	| UpdateTabDashDetails
	| RemoveTilesInDashDuringDeleteTile
	| UpdateDashGraphPosition
	| UpdateDashGraphSize
	| SetDashLayout
	| SetDashLayoutSelectedOptionForAuto
	| SetAspectRatioHeight
	| SetAspectRatioWidth
	| SetCustomHeight
	| SetCustomWidth
	| SetCustomRMaxWidth
	| SetCustomRMinWidth
	| SetCustomRMaxHeight
	| SetCustomRMinHeight
	| SetDashLayoutSelectedOptionForFixed
	| LoadTabState
	| ResetTabState
	| UpdateSelectedTile
	| ToggleEditingTab
	| ShowDashBoard
	| ResetGraphHighlight
	| UpdateGraphHighlight;
