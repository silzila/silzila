import { RelationObjProps } from "../../Components/DataSet/CanvasTablesIntefaces";

import { ColumnsWithUid } from "../../Components/DataSet/DatasetInterfaces";

export interface DatasetProps {
	isFlatFile: boolean;
	dsId: string;
	connection: string;
	schema: string;
	tables: UserTableProps[];
	arrows: ArrowsProps[];
	tempTable: tableObjProps[];
	// relationships: RelationshipsProps[];
	relationships: RelationObjProps[];
	dataSetList: DatasetItem[];
	datasetName: string;

	databaseName: string;
	serverName: string;
	dataConnectionList: ConnectionItem[];
	views: any[];
}

// individual connection item in dataconnectionList
export interface ConnectionItem {
	id: string;
	userId: string;
	vendor: string;
	server: string;
	port: string;
	database: string;
	username: string;
	connectionName: string;
	httpPath: string;
}

export interface DataSetStateProps {
	dataSetState: DatasetProps;
}

//arrows
export interface ArrowsProps {
	cardinality: string;
	end: string;
	endColumnName: string;
	endId: string;
	endSchema: string;
	endTableName: string;
	integrity: string;
	isSelected: boolean;
	relationId: string;
	showHead: boolean;
	showTail: boolean;
	start: string;
	startColumnName: string;
	startId: string;
	startSchema: string;
	startTableName: string;
	table1_uid: string;
	table2_uid: string;
}
//tempTable
export interface tableObjProps {
	isView?: boolean;
	id: string;
	table_uid: string;
	tableName: string;
	isSelected: boolean;
	alias: string;
	columns: ColumnsWithUid[];
	dcId: string;
	isNewTable: boolean;
	tablePositionX: number | null;
	tablePositionY: number | null;
	schema: string;
	databaseName?: string;
}

//relationships
export interface RelationshipsProps {
	startId: string;
	endId: string;
	integrity: string;
	cardinality: string;
	showHead: boolean;
	showTail: boolean;
	relationId: string;
}

//tables
export interface UserTableProps {
	schema: string;
	databaseName: string;
	isView?: boolean;
	id: string;
	isNewTable: boolean;
	isSelected: boolean;
	tableName: string;
	table_uid: string;
}

//datasetlist (ind item)
export interface DatasetItem {
	id: string;
	connectionId: string;
	datasetName: string;
	isFlatFileData: boolean;
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@ action interfaces @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

// 0
interface setCreateDsFromFlatFile {
	type: "SET_CREATE_DS_FROM_FLATFILE";
	payload: boolean;
}
// 1
interface SetDatabaseNametoState {
	type: "SET_DATABASE_NAME";
	payload: string;
}
// 2
interface SetServerName {
	type: "SET_SERVER_NAME";
	payload: string;
}
// 3
interface SetConnectionValue {
	type: "SET_CONNECTION_VALUE";
	payload: string;
}
// 4
interface SetDsId {
	type: "SET_DS_ID";
	payload: string;
}
// 5
interface setDatasetName {
	type: "SET_DATASET_NAME";
	payload: string;
}
// 6
interface SetDataSchema {
	type: "SET_DATA_SCHEMA";
	payload: string;
}

// 7
interface SetUserTable {
	type: "SET_TABLES";
	payload: UserTableProps[];
}
// 8
interface SetTempTables {
	type: "SET_TEMP_TABLES";
	payload: tableObjProps[];
}
// 9
interface ToggleOnChecked {
	type: "ON_CHECKED";
	payload: string | number;
}
// 10
interface AddTable {
	type: "ADD_TABLE";
	payload: tableObjProps;
}
// 11
interface RemoveArrows {
	type: "REMOVE_ARROWS";
	payload: string | number;
}
// 12
interface RemoveArrowsFromcanvas {
	type: "REMOVE_ARROWS_FROM_DEL_REL";
	payload: string | number;
}
// 13
interface RemoveIndiArrowFromRelPopover {
	type: "REMOVE_INDI_ARROW_FROM_REL_POPOVER";
	payload: { start: string; end: string };
}
// 14
interface ResetState {
	type: "RESET_STATE";
}
// 15
interface AddNewRelationship {
	type: "ADD_NEW_RELATIONSHIP";
	payload: RelationObjProps;
}
// 16
interface RemoveRelationshipFromTableList {
	type: "DELETE_RELATIONSHIP_FROM_TABLELIST";
	relationId: string | number;
}
// 17
interface RemoveRelationshipFromCanvas {
	type: "DELETE_RELATIONSHIP_FROM_CANVAS";
	payload: any;
}
// 18
interface UpdateRelationship {
	type: "UPDATE_RELATIONSHIP";
	payload: { relationId: any; relation: any };
}
// 19
interface AddArrows {
	type: "ADD_ARROWS";
	payload: ArrowsProps;
}
// 20
interface ClickOnArrow {
	type: "CLICK_ON_ARROW";
	payload: any;
}
// 21
interface setDatasetList {
	type: "SET_DATASET_LIST";
	payload: DatasetItem[];
}
// 22
interface SetRelationship {
	type: "SET_RELATIONSHIP_ARRAY";
	payload: RelationshipsProps[];
}
// 23
interface SetArrows {
	type: "SET_ARROWS";
	payload: ArrowsProps[];
}

// 24
interface SetArrowType {
	type: "SET_ARROW_TYPE";
	payload: any;
}

interface setDataConnectionListToState {
	type: "SET_DATACONNECTION_LIST";
	payload: any[];
}

//26
interface setViews {
	type: "SET_VIEWS";
	payload: any[];
}
interface ToggleOnCheckedOnView {
	type: "ON_CHECKED_ON_VIEW";
	payload: string | number;
}

export type ActionTypeOfDataSet =
	| SetDatabaseNametoState
	| SetServerName
	| SetConnectionValue
	| SetDsId
	| setDatasetName
	| SetDataSchema
	| SetUserTable
	| SetTempTables
	| ToggleOnChecked
	| AddTable
	| RemoveArrows
	| RemoveArrowsFromcanvas
	| RemoveIndiArrowFromRelPopover
	| ResetState
	| AddNewRelationship
	| RemoveRelationshipFromTableList
	| RemoveRelationshipFromCanvas
	| UpdateRelationship
	| AddArrows
	| ClickOnArrow
	| setDatasetList
	| SetRelationship
	| SetArrows
	| SetArrowType
	| setDataConnectionListToState
	| setViews
	| ToggleOnCheckedOnView
	| setCreateDsFromFlatFile;
