import {
	ArrowsProps,
	DataSetStateProps,
	RelationshipsProps,
	tableObjProps,
	UserTableProps,
} from "../../redux/DataSet/DatasetStateInterfaces";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";

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
