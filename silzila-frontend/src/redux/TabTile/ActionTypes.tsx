import tabTilePropsReducer from "./tabTileProps"

interface AddingTab {
type:"ADD_TAB",
payload:number
}

interface RemovingTab { 
    type:"REMOVE_TAB"
    payload:{
        tabName:string,
         tabId:number, 
         tabToRemoveIndex:number
    }
}

interface RenamingTab { 
    type:"RENAME_TAB"
    payload:{
       renameValue:string, tabId:number
    }
}

interface UpdateNextTileId  {
		type: "UPDATE_NEXT_TILE_ID",
		payload: {
			tileId:number, tabId:number
		},
};

interface UpdateSelectedTileToTab  {
		type: "SELECTED_TILE_IN_TAB",
		payload: {
			tabId:number, tileName:string, tileId:number
		},
};

interface ShowDashboardInTab  {
	 type: "SHOW_DASHBOARD_IN_TAB", payload: { tabId:number, showDash:boolean }
};

interface ToggleDashModeInTab  {
	 type: "TOGGLE_DASH_MODE_IN_TAB", payload: { tabId:number, dashMode:string } 
};

interface ActionsWithTabIdAndValueofNumber {
    type: "SET_ASPECTRATIO_HEIGHT" | "SET_ASPECTRATIO_WIDTH"
    | "SET_CUSTOM_HEIGHT" | "SET_CUSTOM_WIDTH" | "SET_CR_MAX_HEIGHT" | "SET_CR_MAX_WIDTH" | "SET_CR_MIN_HEIGHT" | "SET_CR_MIN_WIDTH"

    payload:{ tabId:number, value:number }
}

//
interface SetDashLayout {
	type:"SET_DASHLAYOUT" , payload: { tabId:number, value:string } 
};

//
interface SetDashLayoutSelectedOptionForAuto  {
type: "SET_DASHLAYOUT_SELECTEDOPTION_FOR_AUTO", payload: { tabId:number, value:string}
};



//
interface SetDashLayoutSelectedOptionForFixed {
	 type: "SET_DASHLAYOUT_SELECTEDOPTION_FOR_FIXED", payload: { tabId:number, value:string } 
};

interface ResetTabState  {
	 type: "RESET_TAB_STATE" 
};

interface ResetGraphHighlight {
	 type: "RESET_GRAPH_BORDER_HIGHLIGHT", payload: { tabId:number } 
};



export type ActionsOfTabState = AddingTab |RemovingTab|RenamingTab 
| UpdateNextTileId | UpdateSelectedTileToTab | ShowDashboardInTab | ToggleDashModeInTab | SetDashLayout | SetDashLayoutSelectedOptionForAuto
| SetDashLayoutSelectedOptionForFixed | ResetTabState | ResetGraphHighlight | ActionsWithTabIdAndValueofNumber


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// tile State
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


interface AddTile {
    type: "ADD_TILE" | "ADD_TILE_FROM_TAB"
    payload:{tabId:number, tileId:number, newTab:boolean}
}
interface RemoveTilesOfTab  {

		type: "REMOVE_TILES_OF_TAB",
		payload: {
			tabName:string, tabId:number
		},
	
};

interface RenameTile {
		type: "RENAME_TILE",
		payload: { tabId:number, tileId:number, renameValue:string },
};

interface RemoveTile {
		type: "REMOVE_TILE",
		payload: {tabId:number, tileId:number, tileIndex:number },
};

interface ToggleGraphSize  {
		type: "TOGGLE_GRAPH_SIZE",
		payload: { tileKey:number, graphSize:boolean },
};

export type ActionsOfTileState = AddTile | RemoveTilesOfTab |RenameTile | RemoveTile | ToggleGraphSize


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// tabTileProps
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

interface UpdateNextTabId  {
	 type: "UPDATE_NEXT_TAB_ID" 
};

interface UpdateSelectedTab {
	
		type: "SELECTED_TAB",
		payload: { tabName:string, tabId:number, showDash:boolean, dashMode:boolean },
	
};

interface UpdateSelectedTile  {
		type: "SELECTED_TILE",
		payload: {
			tileName:string, tileId:number, nextTileId:number
		},
};

interface ToggleEditingTab  {
	 type: "EDITING_TAB", payload:{ isTrue:boolean };
};

interface ToggleEditingTile  {
	 type: "EDITING_TILE", payload: {isTrue:boolean };
};


interface SetDragging  {
 type: "SET_DRAGGING", payload: {dragging:boolean };
};

interface SelectedTable  {
 type: "SET_TABLE", payload: {id:number };
};

interface ChartPropsLeftUpdated  {
 type: "CHART_PROP_UPDATED", payload: {updated:boolean };
};

interface ShowDashBoard  {
 type: "SHOW_DASHBOARD", payload: {showDash:boolean };
};

interface ToggleDashMode  {
 type: "TOGGLE_DASH_MODE", payload: {dashMode:string };
};

interface SetDashGridSize   {
 type: "SET_DASH_GRID_SIZE", payload: {gridSize:any };
};

interface ToggleColumnsOnlyDisplay  {
	type: "TOGGLE_COLUMNS_ONLY_DISPLAY", payload: {columns:boolean };
};

interface ToggleShowDataViewerBottom  {
	 type: "TOGGLE_SHOW_DATA_VIEWER_BOTTOM", payload: {show:boolean };
};

interface SetSelectedControlMenu  {
	 type: "SET_SELECTED_CONTROL_MENU",
      payload:{ menu:string }
};

export type ActionsOfTabTileProps = UpdateNextTabId | UpdateSelectedTab |UpdateSelectedTile | ToggleEditingTab
|ToggleEditingTile | SetDragging | SelectedTable | ChartPropsLeftUpdated | ShowDashBoard | ToggleDashMode | SetDashGridSize | ToggleColumnsOnlyDisplay | ToggleShowDataViewerBottom |SetSelectedControlMenu

