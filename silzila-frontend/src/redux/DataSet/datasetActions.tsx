import { RelationObjProps } from "../../Components/DataSet/CanvasInterfaces";
import { DatasetItem, tableObjProps } from "./DatasetStateInterfacse";

// =====================================
// actions from sodebar
// ====================================

// 1
export const setDatabaseNametoState = (name: string) => {
	return { type: "SET_DATABASE_NAME", payload: name };
};
// 2
export const setServerName = (name: string) => {
	return { type: "SET_SERVER_NAME", payload: name };
};
// 3
export const setConnectionValue = (connectionId: string) => {
	console.log("set connection value action called");
	return { type: "SET_CONNECTION_VALUE", payload: connectionId };
};

// 4
export const setDsId = (dsId: string) => {
	return { type: "SET_DS_ID", payload: dsId };
};
// 6
export const setDataSchema = (schemaName: string) => {
	return { type: "SET_DATA_SCHEMA", payload: schemaName };
};

// 7
export const setUserTable = (userTable: any[]) => {
	console.log("setUserTable action called", userTable);
	return { type: "SET_TABLES", payload: userTable };
};
// 10
export const addTable = (tableObj: any) => {
	return { type: "ADD_TABLE", payload: tableObj };
};
// 9
export const toggleOnChecked = (tableId: string | number) => {
	return { type: "ON_CHECKED", payload: tableId };
};
// 11
export const removeArrows = (arrowId: string | number) => {
	return { type: "REMOVE_ARROWS", payload: arrowId };
};
// 14
export const resetState = () => {
	return { type: "RESET_STATE" };
};
// 5
export const setDatasetName = (datasetName: string) => {
	return { type: "SET_DATASET_NAME", payload: datasetName };
};

// =============================================================================
// Actions from Canvas
// =============================================================================
// 19
export const addArrows = (arrowObj: any) => {
	return { type: "ADD_ARROWS", payload: arrowObj };
};
// 20
export const clickOnArrow = (arrowObj: any) => {
	return { type: "CLICK_ON_ARROW", payload: arrowObj };
};
// 21
export const setArrowType = (payload: any) => {
	return { type: "SET_ARROW_TYPE", payload: payload };
};
// 24
export const setArrows = (arrowsArray: any[]) => {
	return { type: "SET_ARROWS", payload: arrowsArray };
};

// 12
export const removeArrowsFromcanvas = (relationId: string | number) => {
	return { type: "REMOVE_ARROWS_FROM_DEL_REL", payload: relationId };
};
// 13
export const removeIndiArrowFromRelPopover = (start: string, end: string) => {
	return { type: "REMOVE_INDI_ARROW_FROM_REL_POPOVER", payload: { start, end } };
};
// 18
export const updateRelationship = (relationId: any, relation: any) => {
	return { type: "UPDATE_RELATIONSHIP", payload: { relationId, relation } };
};

// ===============================================================
// Actions from Tables
// ===============================================================
// 15
export const addNewRelationship = (payload: RelationObjProps) => {
	return { type: "ADD_NEW_RELATIONSHIP", payload: payload };
};
// 16
export const removeRelationshipFromTableList = (relationId: any) => {
	return { type: "DELETE_RELATIONSHIP_FROM_TABLELIST", payload: relationId };
};
// 17
export const removeRelationshipFromCanvas = (payload: any) => {
	return { type: "DELETE_RELATIONSHIP_FROM_CANVAS", payload: payload };
};

// ===============================================================
// Add DatasetList from Datahome
// ===============================================================
// 22
export const setDatasetList = (datasetList: DatasetItem[]) => {
	return { type: "SET_DATASET_LIST", payload: datasetList };
};

// =====================================================================
// Actions from EditDs
// =====================================================================
// 8
export const setTempTables = (tables: tableObjProps[]) => {
	return { type: "SET_TEMP_TABLES", tables };
};
// 23
export const setRelationship = (payload: any) => {
	return { type: "SET_RELATIONSHIP_ARRAY", payload };
};

export const setValuesToState = (payload: any) => {
	return (dispatch: any) => {
		dispatch(setConnectionValue(payload.conId));
		dispatch(setDatasetName(payload.fname));
		dispatch(setArrows(payload.relationshipArray));
		dispatch(setDataSchema(payload.schema));
		dispatch(setTempTables(payload.canvasTables));
		dispatch(setArrows(payload.arrowsArray));
		dispatch(setRelationship(payload.relationshipsArray));
	};
};

export const actionsOnRemoveTable = ({ tempTables, tables, tableId }: any) => {
	//console.log("REMOVE TABLE FROM CANVAS", tempTables, tables, tableId);
	return (dispatch: any) => {
		dispatch(setTempTables(tempTables));
		dispatch(setUserTable(tables));
		dispatch(removeRelationshipFromTableList(tableId));
		dispatch(removeArrows(tableId));
	};
};
