import { RelationObjProps } from "../../Components/DataSet/CanvasTablesIntefaces";

import {
	ArrowsProps,
	ConnectionItem,
	DatasetItem,
	RelationshipsProps,
	tableObjProps,
	UserTableProps,
} from "./DatasetStateInterfaces";

// =====================================
// actions from sodebar
// ====================================
// 0
export const setCreateDsFromFlatFile = (value: boolean) => {
	return { type: "SET_CREATE_DS_FROM_FLATFILE", payload: value };
}; // 1
export const setDatabaseNametoState = (name: string) => {
	return { type: "SET_DATABASE_NAME", payload: name };
};
// 2
export const setServerName = (name: string) => {
	return { type: "SET_SERVER_NAME", payload: name };
};
// 3
export const setConnectionValue = (connectionId: string) => {
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
export const setUserTable = (userTable: UserTableProps[]) => {
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

export const setViews = (views: any[]) => {
	return { type: "SET_VIEWS", payload: views };
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
export const setDataConnectionListToState = (dcList: ConnectionItem[]) => {
	return { type: "SET_DATACONNECTION_LIST", payload: dcList };
};

// =====================================================================
// Actions from EditDs
// =====================================================================
// 8
export const setTempTables = (tables: tableObjProps[]) => {
	return { type: "SET_TEMP_TABLES", payload: tables };
};
// 23
export const setRelationship = (payload: any) => {
	return { type: "SET_RELATIONSHIP_ARRAY", payload };
};

export const toggleOnCheckedOnView = (tableId: string | number) => {
	return { type: "ON_CHECKED_ON_VIEW", payload: tableId };
};
export const setValuesToState = (
	conId: string,
	fname: string,
	canvasTables: tableObjProps[],

	schema: string,
	relationshipsArray: RelationshipsProps[],
	arrowsArray: ArrowsProps[]
) => {
	return (dispatch: any) => {
		dispatch(setConnectionValue(conId));
		dispatch(setDatasetName(fname));
		dispatch(setTempTables(canvasTables));
		dispatch(setDataSchema(schema));
		dispatch(setRelationship(relationshipsArray));
		dispatch(setArrows(arrowsArray));
	};
};

export const actionsOnRemoveTable = (
	tempTables: tableObjProps[],
	tables: UserTableProps[],
	tableId: string
) => {

	return (dispatch: any) => {
		dispatch(setTempTables(tempTables));
		dispatch(removeRelationshipFromTableList(tableId));
		dispatch(removeArrows(tableId));
		if (tables[0]["isView"]) {
			dispatch(setViews(tables));
		} else {
			dispatch(setUserTable(tables));
		}
	};
};
