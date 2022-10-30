import {
	ArrowsProps,
	DataSetStateProps,
	RelationshipsProps,
	tableObjProps,
	UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfacse";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";

export interface EditDatasetProps {
	//state
	token: string;
	dsId: string;
	databaseName: string;

	//dispatch
	setValuesToState: (
		conId: string,
		fname: string,
		// canvasTables: tableObjProps[],
		schema: string,
		relationshipsArray: RelationshipsProps[],
		arrowsArray: ArrowsProps[]
	) => void;
	setServerName: (name: string) => void;
	setDatabaseNametoState: (name: string) => void;
	setUserTable: (payload: UserTableProps[]) => void;
	setTempTables: (payload: tableObjProps[]) => void;
}

export interface CanvasIndividualTableProps {
	id: string;
	database: string;
	schema: string;
	table: string;
	alias: string;
	tablePositionX: number;
	tablePositionY: number;
}

export interface ActionPopoverProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	anchorEl: any;
	selectAction: (e: any) => void;
	tableData: tableObjProps;
}

export interface Columns {
	columnName: string;
	dataType: string;
}

export interface ColumnsWithUid {
	columnName: string;
	dataType: string;
	uid: string;
}
