import {
	ArrowsProps,
	RelationshipsProps,
	tableObjProps,
	UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfacse";

export interface CanvasProps {
	//state
	tempTable: tableObjProps[];
	arrows: ArrowsProps[];

	//props
	editMode?: boolean;
}

export interface ArrowObj {
	isSelected: boolean;

	startTableName: string;
	startColumnName: string;
	start: string;
	table1_uid: string;
	startSchema: string;
	startId: string;

	endTableName: string;
	endColumnName: string;
	end: string;
	table2_uid: string;
	endSchema: string;
	endId: string;
}
export interface newArrowObj {
	end: string;
	endColumnName: string;
	endId: string;
	endSchema: string;
	endTableName: string;
	isSelected: boolean;
	relationId?: string;
	start: string;
	startColumnName: string;
	startId: string;
	startSchema: string;
	startTableName: string;
	table1_uid: string;
	table2_uid: string;
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ BottomBar interfaces @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
export interface BottomBarProps {
	//props
	editMode: boolean;

	// state
	tempTable: tableObjProps[];
	arrows: ArrowsProps[];
	relationships: RelationshipsProps[];
	token: string;
	connection: string;
	dsId: string;
	datasetName: string;
	database: string;

	// dispatch
	resetState: () => void;
}

export interface tablesSelectedInSidebarProps {
	table: string;
	schema: string;
	id: string;
	alias: string;
	tablePositionX: number;
	tablePositionY: number;
	database: string;
	flatFileId: string | null;
}

export interface relationshipServerObjProps {
	table1: string;
	table2: string;
	cardinality: string;
	refIntegrity: string;
	table1Columns: string[];
	table2Columns: string[];
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ canvas table @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
export interface CanvasTablesProps {
	// props
	tableData: tableObjProps;

	// state
	// dataSetState: DatasetProps;
	tempTable: tableObjProps[];
	arrows: ArrowsProps[];
	relationships: RelationshipsProps[];
	tables: UserTableProps[];

	// dispatch
	addNewRelationship: (payload: RelationObjProps) => void;
	addArrows: (pl: any) => void;
	actionsOnRemoveTable: (
		tempTable: tableObjProps[],
		tables: UserTableProps[],
		tableId: string
	) => void;
	setTempTables: (temptable: tableObjProps[]) => void;
}

export interface RelationObjProps {
	cardinality: string;
	endId: string;
	endTableName: string;
	integrity: string;
	relationId: string;
	showHead: boolean;
	showTail: boolean;
	startId: string;
	startTableName: string;
}
