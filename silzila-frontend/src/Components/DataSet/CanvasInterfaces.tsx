import { ArrowsProps, tableObjProps } from "../../redux/DataSet/DatasetStateInterfacse";


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
	cardinality?: string;
	end: string;
	endColumnName: string;

	endId: string;
	endSchema: string;
	endTableName: string;
	integrity?: string;
	isSelected: boolean;
	relationId: string;
	showHead?: boolean;
	showTail?: boolean;
	start: string;
	startColumnName: string;
	startId: string;
	startSchema: string;
	startTableName: string;
	table1_uid: string;
	table2_uid: string;
}
