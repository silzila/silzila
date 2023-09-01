import { Dispatch } from "redux";
import { loadChartControls } from "../ChartPoperties/ChartControlsActions";
import { loadChartProperties } from "../ChartPoperties/ChartPropertiesActions";
import { loadSampleRecords } from "../SampleTableRecords/SampleTableRecordsActions";
import { loadTabState, renameTab } from "./TabActions";
import { loadTabTileProps, updateSelectedTab } from "./TabTileActionsAndMultipleDispatches";
import { loadTileState } from "./TileActions";
import {loadReportFilterGroup} from '../ChartFilterGroup/ChartFilterGroupStateActions';
import {loadDynamicMeasures} from '../DynamicMeasures/DynamicMeasuresActions';

// //  *************************************************************
// //  to tile state reducer
// //  *************************************************************

// notihng
export const updateTabNameOfTile = (tabName: string, tabId: number) => {
	return {
		type: "UPDATE_TAB_NAME_OF_TILE",
		payload: {
			tabName: tabName,
			tabId: tabId,
		},
	};
};

// export const setTileRenameEnable = (tabId, tileId) => {
// 	return {
// 		type: "TILE_RENAME_ENABLE",
// 		payload: { tabId: tabId, tileId: tileId },
// 	};
// };

// //  *************************************************************
// //  to tabTiles meta state (tabTileProps) reducer
// //  *************************************************************

//tab tile mtsp
export const toggleEditingTab = (isTrue: boolean) => {
	return { type: "EDITING_TAB", payload: isTrue };
};

// //  ***************************************************************************************************************************
// //  ***************************************************************************************************************************
// //
// //  MULTIPLE DISPATCHES USING THUNK
// //
// //  ***************************************************************************************************************************
// //  ***************************************************************************************************************************

// //  *************************************************************
// //  Tab actions for multiple dispatches
// //  *************************************************************

export const actionsToSelectTab = (
	tabName: string,
	tabId: number,
	showDash: boolean,
	dashMode: string
) => {
	return (dispatch: Dispatch<any>) => {
		dispatch(updateSelectedTab(tabName, tabId, showDash, dashMode));
	};
};

export const actionsToEnableRenameTab = (tabId: number, isTrue: boolean) => {
	return (dispatch: Dispatch<any>) => {
		dispatch(toggleEditingTab(isTrue));
	};
};

export const actionsToRenameTab = (renameValue: string, tabId: number) => {
	return (dispatch: Dispatch<any>) => {
		dispatch(updateSelectedTab(renameValue, tabId));
		dispatch(updateTabNameOfTile(renameValue, tabId));
		dispatch(renameTab(renameValue, tabId));
		dispatch(toggleEditingTab(false));
	};
};

// //  *************************************************************
// //  Load Playbook data to many different reducers
// //  *************************************************************

export const loadPlaybook = (playbook: any) => {
	return (dispatch: Dispatch<any>) => {
		dispatch(loadTabState(playbook.tabState));
		dispatch(loadTileState(playbook.tileState));
		dispatch(loadTabTileProps(playbook.tabTileProps));
		dispatch(loadChartControls(playbook.chartControl));
		dispatch(loadChartProperties(playbook.chartProperty));
		dispatch(loadReportFilterGroup(playbook.chartGroup));
		dispatch(loadSampleRecords(playbook.sampleRecords));
		dispatch(loadDynamicMeasures(playbook.dynamicMeasureState))
	};
};

// //  *************************************************************
// //  Reset states
// //  *************************************************************
