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
	dashTilesDetails: Object;
}

export interface Tabs {
	[key: number]: IndTabs;
}

export interface TabStateProps {
	tabs: Tabs;
	tabList: Array<number>;
}

export interface TabStateProps2 {
	tabState: TabStateProps;
}

interface AddingTab {
	type: "ADD_TAB";
	payload: number;
}

interface UpdateNextTileId {
	type: "UPDATE_NEXT_TILE_ID";
	payload: {
		nextTileId: number;
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

interface UpdateSelectedTile {
	type: "SELECTED_TILE";
	payload: {
		tileName: string;
		tileId: number;
		nextTileId: number;
	};
}
interface ShowDashBoard {
	type: "SHOW_DASHBOARD";
	payload: boolean;
}
export type ActionsOfTabState =
	| AddingTab
	| UpdateNextTileId
	| UpdateSelectedTileToTab
	| UpdateSelectedTile
	| ShowDashBoard;

interface ResetGraphHighlight {
	type: "RESET_GRAPH_BORDER_HIGHLIGHT";
	payload: { tabId: number };
}

interface UpdateGraphHighlight {
	type: "SET_GRAPH_BORDER_HIGHLIGHT";
	payload: { tabId: number; propKey: number; highlight: boolean };
}

interface updateTabDashDetails {
	type: "UPDATE_DASH_GRAPH_DETAILS";
	payload: {
		checked: boolean;
		propKey: number;
		dashSpecs: any;
		tabId: number;
		propIndex: number;
	};
}
