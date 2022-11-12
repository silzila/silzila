export interface TabTileStateProps {
	selectedTabName: string;
	selectedTabId: number;
	nextTabId: number;
	editTabName: boolean;

	selectedTileName: string;
	selectedTileId: number;
	nextTileId: number;
	editTileName: boolean;

	dragging: boolean;
	chartPropUpdated: boolean;
	showDash: boolean;
	dashMode: string;
	dashGridSize: any;

	columnsOnlyDisplay: boolean;
	showDataViewerBottom: boolean;
	selectedControlMenu: string;

	selectedDataSetList: any[];
	tablesForSelectedDataSets: {};
}

export interface TabTileStateProps2 {
	tabTileProps: TabTileStateProps;
}
interface UpdateNextTabId {
	type: "UPDATE_NEXT_TAB_ID";
}

interface UpdateSelectedTab {
	type: "SELECTED_TAB";
	payload: { tabName: string; tabId: number; showDash: boolean; dashMode: boolean };
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
	payload: { isTrue: boolean };
}

interface ToggleEditingTile {
	type: "EDITING_TILE";
	payload: { isTrue: boolean };
}

interface SetDragging {
	type: "SET_DRAGGING";
	payload: { dragging: boolean };
}

interface SelectedTable {
	type: "SET_TABLE";
	payload: { id: number };
}

interface ChartPropsLeftUpdated {
	type: "CHART_PROP_UPDATED";
	payload: { updated: boolean };
}

interface ShowDashBoard {
	type: "SHOW_DASHBOARD";
	payload: { showDash: boolean };
}

interface ToggleDashMode {
	type: "TOGGLE_DASH_MODE";
	payload: { dashMode: string };
}

interface SetDashGridSize {
	type: "SET_DASH_GRID_SIZE";
	payload: { gridSize: any };
}

interface ToggleColumnsOnlyDisplay {
	type: "TOGGLE_COLUMNS_ONLY_DISPLAY";
	payload: { columns: boolean };
}

interface ToggleShowDataViewerBottom {
	type: "TOGGLE_SHOW_DATA_VIEWER_BOTTOM";
	payload: { show: boolean };
}

interface SetSelectedControlMenu {
	type: "SET_SELECTED_CONTROL_MENU";
	payload: { menu: string };
}

export type ActionsOfTabTileProps =
	| UpdateNextTabId
	| UpdateSelectedTab
	| UpdateSelectedTile
	| ToggleEditingTab
	| ToggleEditingTile
	| SetDragging
	| SelectedTable
	| ChartPropsLeftUpdated
	| ShowDashBoard
	| ToggleDashMode
	| SetDashGridSize
	| ToggleColumnsOnlyDisplay
	| ToggleShowDataViewerBottom
	| SetSelectedControlMenu;
