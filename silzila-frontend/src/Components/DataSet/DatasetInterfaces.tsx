import { tableObjProps } from "../../redux/DataSet/DatasetStateInterfaces";

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
