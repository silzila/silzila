import { Dispatch } from "redux";
import { updateRichTextOnAddingDYnamicMeasure } from "../ChartPoperties/ChartControlsActions";

export const setSelectedDatasetForDynamicMeasure = (dataset: any) => {
	return { type: "SET_SELECTED_DATASET_FOR_DYNAMICMEASURE", payload: dataset };
};

export const addNewDynamicMeasurePropsFromNewTab = (
	tabId: number,
	tileId: number,
	dynamicMeasureId: number,
	selectedDataset: any
) => {
	return {
		type: "ADD_NEW_DYNAMIC_MEASURE_FROM_NEW_TAB",
		payload: { tabId, tileId, dynamicMeasureId, selectedDataset },
	};
};

export const addNewDynamicMeasurePropsFromNewTile = (
	tabId: number,
	tileId: number,
	dynamicMeasureId: number,
	selectedDataset: any
) => {
	return {
		type: "ADD_NEW_DYNAMIC_MEASURE_FROM_NEW_TILE",
		payload: { tabId, tileId, dynamicMeasureId, selectedDataset },
	};
};

export const addNewDynamicMeasurePropsForSameTile = (
	tabId: number,
	tileId: number,
	dynamicMeasureId: number,
	selectedDataset: any
) => {
	return {
		type: "ADD_NEW_DYNAMIC_MEASURE_FOR_SAME_TILE",
		payload: { tabId, tileId, dynamicMeasureId, selectedDataset },
	};
};

export const setSelectedTableForSelectedDynamicMeasure = (selectedTable: any) => {
	return {
		type: "SET_SELECTED_TABLE",
		payload: {
			selectedTable,
		},
	};
};

export const setSelectedTileIdInDynamicMeasureState = (tileId: number) => {
	return {
		type: "SET_SELECTED_TILE_ID",
		payload: tileId,
	};
};
export const setSelectedDynamicMeasureId = (dynamicMeasureId: number) => {
	return {
		type: "SET_SELECTED_DYNAMIC_MEASURE_ID",
		payload: dynamicMeasureId,
	};
};

export const setSelectedTabIdInDynamicMeasureState = (tabId: number) => {
	return {
		type: "SET_SELECTED_TAB_ID",
		payload: tabId,
	};
};

export const updateDynamicMeasureAxes = (bIndex: number, allowedNumbers: number, item: any) => {
	return {
		type: "UPDATE_DYNAMIC_MEASURE_AXES",
		payload: { bIndex, allowedNumbers, item },
	};
};

export const onDiscardDynamicMeasureCreation = () => {
	return { type: "DISCARD_DYNAMIC_MEASURE_CREATION" };
};

export const updateChartDataForDm = (chartData: any) => {
	return {
		type: "UPDATE_CHART_DATA_FOR_DM",
		payload: chartData,
	};
};
export const updateDynamicMeasureName = (dmName: any) => {
	return {
		type: "UPDATE_DYNAMIC_MEASURE_NAME",
		payload: dmName,
	};
};
export const renameDynamicMeasure = (dmName: any) => {
	return {
		type: "RENAME_DYNAMIC_MEASURE",
		payload: dmName,
	};
};

export const deletingDynamicMeasure = (tabId: number, tileId: number, dmId: number) => {
	return {
		type: "DELETE_DYNAMIC_MEASURE",
		payload: { tabId, tileId, dmId },
	};
};
export const updateTitleOptionsFordm = (
	tabId: number,
	tileId: number,
	dmPropKey: string,
	option: string,
	value: any
) => {
	return {
		type: "UPDATE_TITLE_OPTIONS",
		payload: { tabId, tileId, dmPropKey, option, value },
	};
};
export const onCheckorUncheckOnDm1 = (dmId: number, value: boolean) => {
	return {
		type: "ON_CHECK_ON_DYNAMIC_MEASURE",
		payload: { dmId, value },
	};
};

export const changeDynamicMeasureOption = (value: any) => {
	return {
		type: "CHANGE_DYNAMIC_MEASURE_OPTION",
		payload: { value },
	};
};
// updateRichTextOnAddingDYnamicMeasure;

export const onCheckorUncheckOnDm = (
	dmId: number,
	value: boolean,
	propKey: string,
	dmValue: any,
	styleObj: any
) => {
	return (dispatch: Dispatch<any>) => {
		console.log(styleObj.textUnderline);
		dispatch(onCheckorUncheckOnDm1(dmId, value));
		if (value) {
			var text = ``;
			if (styleObj.textUnderline === "none") {
				text = `<span style="background-color:${styleObj.backgroundColor};color:${styleObj.fontColor};font-weight:${styleObj.boldText};font-style:${styleObj.italicText};">${dmValue}</span>`;
			} else {
				text = `<span style="background-color:${styleObj.backgroundColor};color:${styleObj.fontColor};font-weight:${styleObj.boldText};font-style:${styleObj.italicText};"><u>${dmValue}</u></span>`;
			}
			dispatch(updateRichTextOnAddingDYnamicMeasure(propKey, text));
		}
	};
};

export const updateFormatForDm = (dmKey: string, option: string, value: any) => {
	return {
		type: "UPDATE_FORMAT_FOR_DM",
		payload: { dmKey, option, value },
	};
};

export const updateStyleOptions = (option: string, value: any) => {
	return {
		type: "UPDATE_SYLE_OPTIONS",
		payload: { option, value },
	};
};
export const addNewCondition = (conditionObj: any) => {
	return {
		type: "ADD_NEW_CONDITION",
		payload: conditionObj,
	};
};

export const updateConditionalFormat = (updateFormatArray: any) => {
	return {
		type: "CHANGE_CONDITIONAL_FORMAT",
		payload: updateFormatArray,
	};
};

//
export const addingMeasure1 = (
	tabId: number,
	tileId: number,
	dynamicMeasureId: number,
	newTile: boolean,
	selectedDs: any
) => {
	if (!newTile) {
		return {
			type: "ADD_NEW_MEASURE",
			payload: { tabId, tileId, dynamicMeasureId, selectedDs },
		};
	} else {
		return {
			type: "ADD_NEW_MEASURE",
			payload: { tabId, tileId, dynamicMeasureId, selectedDs },
		};
	}
};

export const onDiscardDynamicMeasureCreation1 = (tileId: number) => {
	return { type: "ON_DISCARD_OF_DYNAMICMEASURE_CREATION", payload: { tileId } };
};

//dynamicMeasureprops
// export const updateDynamicMeasureProps = (option: string, value: any) => { //can be deleted
// 	return {
// 		type: "UPDATE_DYNAMIC_MEASURE_PROPS",
// 		payload: { option, value },
// 	};
// };
export const setSelectedToEdit = (tabId: number, tileId: number, dmId: number, value: boolean) => {
	return {
		type: "SET_SELECTED_TO_EDIT",
		payload: { tabId, tileId, dmId, value },
	};
};

export const discardCreationOfFirstDm = (tabId: number, tileId: number, dmId: number) => {
	return {
		type: "DISCARD_CREATION_OF_FIRST_DM",
		payload: { tabId, tileId, dmId },
	};
};

// export const onDiscardDynamicMeasureCreation = (tileId: number) => {
// 	return (dispatch: Dispatch<any>) => {
// 		dispatch(onDiscardDynamicMeasureCreation1(tileId));
// 		dispatch(updateDynamicMeasureProps("selectedDynamicMeasureId", 2));
// 	};
// };

// export const addingMeasure = ( // can be deleted
// 	tabId: number,
// 	tileId: number,
// 	dynamicMeasureId: number,
// 	newTile: boolean,
// 	selectedDs: any
// ) => {
// 	return (dispatch: Dispatch<any>) => {
// 		dispatch(addingMeasure1(tabId, tileId, dynamicMeasureId, newTile, selectedDs));
// 		dispatch(updateDynamicMeasureProps("selectedDynamicMeasureId", dynamicMeasureId));
// 	};
// };

export const setSelectedTableInDynamicMeasure = (
	dynamicMeasurePropKey: string,
	selectedTable: any
) => {
	return {
		type: "SET_SELECTED_TABLE_IN_DYNAMIC_MEASURE",
		payload: { dynamicMeasurePropKey, selectedTable },
	};
};
