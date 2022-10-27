import { UserTableProps } from "../../redux/DataSet/DatasetStateInterfacse";
import { tableObjProps } from "./SidebarInterfaces";

export interface TableListProps {
	//props
	className: string;
	table: UserTableProps;
	tableId: string;
	xprops: any;

	//state
	tempTable: tableObjProps[];
	tableList: UserTableProps[];
	token: string;
	connectionId: string;
	schema: string;
	databaseName: string;
	serverName: string;

	//dispatch
	onChecked: (id: string | number) => void;
	removeArrows: (id: string | number) => void;
	removeRelationship: (id: string | number) => void;
	addTable: (tabObj: any) => void;
}
export interface TblColDt {
	columnName: string;
	dataType: string;
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ tableData component Props interface @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
export interface tableDataComponentProps {
	showTableData: boolean;
	setShowTableData: React.Dispatch<React.SetStateAction<boolean>>;
	selectedTable: string;
	setSelectedTable: React.Dispatch<React.SetStateAction<string>>;
	tableData: any[];
	setTableData: React.Dispatch<React.SetStateAction<any[]>>;
	objKeys: any[];
}
