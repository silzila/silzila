export interface DynamicMeasureProps {
	selectedTabId: number;
	selectedTileId: number;
	selectedDynamicMeasureId: number;
	selectedDataSetList: any[];
	tablesForSelectedDataSets: any;
	dynamicMeasureProps: any;
	dynamicMeasureList: any;
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@ action interfaces @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// 0
interface loadDynamicMeasures {
	type: "LOAD_DYMANIC_MEASURES";
	payload: any;
}
// 1
interface setSelectedDatasetForDynamicMeasure {
	type: "SET_SELECTED_DATASET_FOR_DYNAMICMEASURE";
	payload: any;
}
// 2
interface addNewDynamicMeasurePropsFromNewTab {
	type: "ADD_NEW_DYNAMIC_MEASURE_FROM_NEW_TAB";
	payload: { tabId: number; tileId: number; dynamicMeasureId: number; selectedDataset: any };
}
interface addNewDynamicMeasurePropsFromNewTile {
	type: "ADD_NEW_DYNAMIC_MEASURE_FROM_NEW_TILE";
	payload: { tabId: number; tileId: number; dynamicMeasureId: number; selectedDataset: any };
}

interface addNewDynamicMeasurePropsForSameTile {
	type: "ADD_NEW_DYNAMIC_MEASURE_FOR_SAME_TILE";
	payload: { tabId: number; tileId: number; dynamicMeasureId: number; selectedDataset: any };
}

interface setSelectedTableForSelectedDynamicMeasure {
	type: "SET_SELECTED_TABLE";
	payload: {
		selectedTable: any;
	};
}

interface setSelectedTileIdInDynamicMeasureState {
	type: "SET_SELECTED_TILE_ID";
	payload: number;
}
interface setSelectedDynamicMeasureId {
	type: "SET_SELECTED_DYNAMIC_MEASURE_ID";
	payload: number;
}

interface setSelectedTabIdInDynamicMeasureState {
	type: "SET_SELECTED_TAB_ID";
	payload: number;
}

interface updateDynamicMeasureAxes {
	type: "UPDATE_DYNAMIC_MEASURE_AXES";
	payload: { bIndex: number; allowedNumbers: number; item: any };
}

interface onDiscardDynamicMeasureCreation {
	type: "DISCARD_DYNAMIC_MEASURE_CREATION";
}

interface updateChartDataForDm {
	type: "UPDATE_CHART_DATA_FOR_DM";
	payload: any;
}

interface updateDynamicMeasureName {
	type: "UPDATE_DYNAMIC_MEASURE_NAME";
	payload: any;
}
interface renameDynamicMeasure {
	type: "RENAME_DYNAMIC_MEASURE";
	payload: any;
}

interface deletingDynamicMeasure {
	type: "DELETE_DYNAMIC_MEASURE";
	payload: { tabId: number; tileId: number; dmId: number };
}
interface updateTitleOptionsFordm {
	type: "UPDATE_TITLE_OPTIONS";
	payload: { tabId: number; tileId: number; dmPropKey: string; option: string; value: any };
}
interface onCheckorUncheckOnDm1 {
	type: "ON_CHECK_ON_DYNAMIC_MEASURE";
	payload: { dmId: string; value: boolean };
}

interface changeDynamicMeasureOption {
	type: "CHANGE_DYNAMIC_MEASURE_OPTION";
	payload: { value: any };
}

// 	dmId: string,
// 	value: boolean,
// 	propKey: string,
// 	dmValue: any,
// 	styleObj: any
// ) => {
// 	return (dispatch: Dispatch<any>) => {
// 		dispatch(onCheckorUncheckOnDm1(dmId.toString().replace("RichTextID", ""), value));
// 		if (value) {
// 			// var text = ``;
// 			// if (styleObj.textUnderline === "none") {
// 			// 	text = `<span style="background-color:${styleObj.backgroundColor};color:${styleObj.fontColor};font-weight:${styleObj.boldText};font-style:${styleObj.italicText};">${dmValue}</span>`;
// 			// } else {
// 			// 	text = `<span style="background-color:${styleObj.backgroundColor};color:${styleObj.fontColor};font-weight:${styleObj.boldText};font-style:${styleObj.italicText};"><u>${dmValue}</u></span>`;
// 			// }

// 			dispatch(updateRichTextOnAddingDYnamicMeasure(propKey, value, dmValue, styleObj, dmId));
// 		} else {
// 			//dispatch(updateRichTextOnAddingDYnamicMeasure(propKey, value, dmValue,  null, dmId));
// 		}
// 	};
// };

interface updateFormatForDm {
	type: "UPDATE_FORMAT_FOR_DM";
	payload: { dmKey: string; option: string; value: any };
}

interface updateStyleOptions {
	type: "UPDATE_SYLE_OPTIONS";
	payload: { option: string; value: any };
}
interface addNewCondition {
	type: "ADD_NEW_CONDITION";
	payload: any;
}

interface updateConditionalFormat {
	type: "CHANGE_CONDITIONAL_FORMAT";
	payload: any;
}

interface updateLeftFilterItemForDm {
	type: "UPDATE_LEFT_FILTER_ITEM_FOR_DM";
	payload: { propKey: string; bIndex: number; item: any };
}

interface sortAxesForDm {
	type: "SORT_ITEM_FOR_DM";
	payload: {
		propKey: string;
		bIndex: number;
		dragUId: string | number;
		dropUId: string | number;
	};
}

interface revertAxesForDm {
	type: "REVERT_ITEM_FOR_DM";
	payload: { propKey: string; bIndex: number; uId: string | number; originalIndex: any };
}

interface updtateFilterExpandeCollapseForDm {
	type: "UPDATE_FILTER_EXPAND_COLLAPSE_FOR_DM";
	payload: { propKey: string; bIndex: number | string; item: any };
}

interface toggleAxesEditedForDm {
	type: "TOGGLE_AXES_EDITED_FOR_DM";
	payload: { propKey: string; axesEdited: any };
}

interface updateChartPropLeftForDm {
	type: "UPDATE_PROP_FOR_DM";
	payload: { propKey: string; bIndex: number; item: any; allowedNumbers: any };
}

interface moveItemChartPropForDm {
	type: "MOVE_ITEM_FOR_DM";
	payload: {
		propKey: string;
		fromBIndex: any;
		fromUID: any;
		item: any;
		toBIndex: any;
		allowedNumbers: any;
	};
}

interface deleteItemInChartPropForDm {
	type: "DELETE_ITEM_FROM_PROP_FOR_DM";
	payload: {
		propKey: string;
		binIndex: number;
		itemIndex: number;
	};
}

interface updateAxesQueryParamForDm {
	type: "UPDATE_AXES_QUERY_PARAM_FOR_DM";
	payload: { propKey: string; binIndex: number; itemIndex: number; item: any };
}

interface setSelectedToEdit {
	type: "SET_SELECTED_TO_EDIT";
	payload: { tabId: number; tileId: number; dmId: number; value: boolean };
}

interface discardCreationOfFirstDm {
	type: "DISCARD_CREATION_OF_FIRST_DM";
	payload: { tabId: number; tileId: number; dmId: number };
}

export type ActionTypeOfDataSet =
	| loadDynamicMeasures
	| setSelectedDatasetForDynamicMeasure
	| addNewDynamicMeasurePropsFromNewTab
	| addNewDynamicMeasurePropsFromNewTile
	| addNewDynamicMeasurePropsForSameTile
	| setSelectedTableForSelectedDynamicMeasure
	| setSelectedTileIdInDynamicMeasureState
	| setSelectedDynamicMeasureId
	| setSelectedTabIdInDynamicMeasureState
	| updateDynamicMeasureAxes
	| onDiscardDynamicMeasureCreation
	| updateChartDataForDm
	| updateDynamicMeasureName
	| renameDynamicMeasure
	| deletingDynamicMeasure
	| updateTitleOptionsFordm
	| onCheckorUncheckOnDm1
	| changeDynamicMeasureOption
	| updateFormatForDm
	| updateStyleOptions
	| addNewCondition
	| updateConditionalFormat
	| updateLeftFilterItemForDm
	| sortAxesForDm
	| revertAxesForDm
	| updtateFilterExpandeCollapseForDm
	| toggleAxesEditedForDm
	| updateChartPropLeftForDm
	| moveItemChartPropForDm
	| deleteItemInChartPropForDm
	| updateAxesQueryParamForDm
	| setSelectedToEdit
	| discardCreationOfFirstDm;
