// =============================================================================
// Actions from Sidebar
// =============================================================================

import { useSelector } from "react-redux";
import { RelationObjProps } from "../../Components/DataSet/CanvasInterfaces";
import { DatasetItem } from "../../Components/DataSet/DatasetListInterfaces";
import { tableObjProps } from "../../Components/DataSet/SidebarInterfaces";
import { UserTableProps } from "./DatasetStateInterfacse";

export const setConnectionValue = (connectionId: string) => {
	console.log("set connection value action called");
	return { type: "SET_CONNECTION_VALUE", payload: connectionId };
};

export const setDatabaseNametoState = (name: string) => {
	return { type: "SET_DATABASE_NAME", payload: name };
};

export const setServerName = (name: string) => {
	return { type: "SET_SERVER_NAME", payload: name };
};

export const setDsId = (dsId: string) => {
	return { type: "SET_DS_ID", payload: dsId };
};

export const setDataSchema = (schemaName: string) => {
	return { type: "SET_DATA_SCHEMA", payload: schemaName };
};

// TODO:

export const setUserTable = (userTable: any[]) => {
	console.log("setUserTable action called", userTable);
	return { type: "SET_TABLES", payload: userTable };
};

// TODO

export const addTable = (tableObj: any) => {
	return { type: "ADD_TABLE", payload: tableObj };
};
// TODO
export const toggleOnChecked = (tableId: string | number) => {
	return { type: "ON_CHECKED", payload: tableId };
};
// TODO
export const removeArrows = (arrowId: string | number) => {
	return { type: "REMOVE_ARROWS", payload: arrowId };
};
export const resetState = () => {
	return { type: "RESET_STATE" };
};

export const setDatasetName = (datasetName: string) => {
	return { type: "SET_DATASET_NAME", payload: datasetName };
};

// =============================================================================
// Actions from Canvas
// =============================================================================
// TODO
export const addArrows = (arrowObj: any) => {
	return { type: "ADD_ARROWS", payload: arrowObj };
};

export const clickOnArrow = (arrowObj: any) => {
	return { type: "CLICK_ON_ARROW", payload: arrowObj };
};

export const setArrowType = (payload: any) => {
	return { type: "SET_ARROW_TYPE", payload: payload };
};

export const setArrows = (arrowsArray: any[]) => {
	return { type: "SET_ARROWS", payload: arrowsArray };
};
export const resetArrows = () => {
	return { type: "RESET_ARROWS_ARRAY" };
};

export const removeArrowsFromcanvas = (relationId: string | number) => {
	return { type: "REMOVE_ARROWS_FROM_DEL_REL", payload: relationId };
};

export const removeIndiArrowFromRelPopover = (start: string, end: string) => {
	return { type: "REMOVE_INDI_ARROW_FROM_REL_POPOVER", payload: { start, end } };
};

export const updateRelationship = (relationId: any, relation: any) => {
	return { type: "UPDATE_RELATIONSHIP", payload: { relationId, relation } };
};

// ===============================================================
// Actions from Tables
// ===============================================================

export const addNewRelationship = (payload: RelationObjProps) => {
	return { type: "ADD_NEW_RELATIONSHIP", payload: payload };
};

export const removeRelationshipFromTableList = (relationId: any) => {
	return { type: "DELETE_RELATIONSHIP_FROM_TABLELIST", payload: relationId };
};

export const removeRelationshipFromCanvas = (payload: any) => {
	return { type: "DELETE_RELATIONSHIP_FROM_CANVAS", payload: payload };
};

// ===============================================================
// Add DatasetList from Datahome
// ===============================================================
export const setDatasetList = (datasetList: DatasetItem[]) => {
	return { type: "SET_DATASET_LIST", payload: datasetList };
};

// =====================================================================
// Actions from EditDs
// =====================================================================
export const setTempTables = (tables: tableObjProps[]) => {
	return { type: "SET_TEMP_TABLES", tables };
};

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
