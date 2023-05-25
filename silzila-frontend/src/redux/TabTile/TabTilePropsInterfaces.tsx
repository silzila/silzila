export interface TabTileStateProps {
	selectedTabName: string;
	selectedTabId: number;
	nextTabId: number;
	editTabName: boolean;
	previousTabId: number;

	selectedTileName: string;
	selectedTileId: number;
	nextTileId: number;
	editTileName: boolean;
	previousTileId: number;

	dragging: boolean;
	chartPropUpdated: boolean;
	showDash: boolean;
	dashMode: string;
	dashGridSize: { x: null | number | string; y: null | number | string };

	columnsOnlyDisplay: boolean;
	showDataViewerBottom: boolean;
	selectedControlMenu: string;

	selectedDataSetList: TabTilPropsSelectedDatasetList[];
	tablesForSelectedDataSets: TabRilePropsTablesForSelectedDatasets;
	selectedTable?: any;
}

export interface TabTilPropsSelectedDatasetList {
	dc_uid: string;
	ds_uid: string;
	friendly_name: string;
}

interface TabRilePropsTablesForSelectedDatasets {
	[key: string | number]: IndTabRilePropsTablesForSelectedDatasets[];
}
interface IndTabRilePropsTablesForSelectedDatasets {
	table_name: string;
	schema_name: string;
	id: string;
	alias: string;
	table_position: null | string | number;
}

export interface TabTileStateProps2 {
	tabTileProps: TabTileStateProps;
}

//1
interface UpdateNextTabId {
	type: "UPDATE_NEXT_TAB_ID";
}

//2
interface UpdateSelectedTab {
	type: "SELECTED_TAB";
	payload: { tabName: string; tabId: number; showDash?: boolean; dashMode?: string };
}

//3
interface ToggleEditingTab {
	type: "EDITING_TAB";
	payload: boolean;
}
//4
interface ToggleEditingTile {
	type: "EDITING_TILE";
	payload: boolean;
}

//5
interface UpdateSelectedTile {
	type: "SELECTED_TILE";
	payload: {
		tileName: string;
		tileId: number;
		nextTileId: number;
	};
}

//6

interface SetDragging {
	type: "SET_DRAGGING";
	payload: boolean | any;
}

//7
interface SelectedTable {
	type: "SET_TABLE";
	payload: any;
}

//8
interface ChartPropsLeftUpdated {
	type: "CHART_PROP_UPDATED";
	payload: any;
}
//9
interface ShowDashBoard {
	type: "SHOW_DASHBOARD";
	payload: boolean;
}

//10
interface SetDashGridSize {
	type: "SET_DASH_GRID_SIZE";
	payload: any;
}
//11
interface SetSelectedDataSetList {
	type: "SET_SELECTED_DATASET_LIST";
	payload: string;
}
//12
interface SetTablesForSelectedDataSets {
	type: "TABLES_FOR_SELECTED_DATASETS";
	payload: any;
}
//13
interface ToggleColumnsOnlyDisplay {
	type: "TOGGLE_COLUMNS_ONLY_DISPLAY";
	payload: boolean;
}

//14
interface ToggleShowDataViewerBottom {
	type: "TOGGLE_SHOW_DATA_VIEWER_BOTTOM";
	payload: boolean;
}
//15
interface ToggleDashMode {
	type: "TOGGLE_DASH_MODE";
	payload: string;
}
//16
interface SetSelectedControlMenu {
	type: "SET_SELECTED_CONTROL_MENU";
	payload: string;
}

//17
interface LoadTabTileProps {
	type: "LOAD_TAB_TILE_PROPS_FROM_PLAYBOOK";
	payload: any;
}

//18
interface ResetTabTileState {
	type: "RESET_TABTILE_PROPS";
}

export type ActionsOfTabTileProps =
	| UpdateNextTabId
	| UpdateSelectedTab
	| ToggleEditingTab
	| ToggleEditingTile
	| UpdateSelectedTile
	| SetDragging
	| SelectedTable
	| ChartPropsLeftUpdated
	| ShowDashBoard
	| SetDashGridSize
	| SetSelectedDataSetList
	| SetTablesForSelectedDataSets
	| SetTablesForSelectedDataSets
	| ToggleColumnsOnlyDisplay
	| ToggleShowDataViewerBottom
	| ToggleDashMode
	| SetSelectedControlMenu
	| LoadTabTileProps
	| ResetTabTileState;
