import { DataSetStateProps, UserTableProps } from "../../redux/DataSet/DatasetStateInterfacse";
import { isLoggedProps } from "../../redux/UserInfo/IsLoggedInterfaces";
import { tableObjProps } from "./SidebarInterfaces";

export interface ChangeConnectionProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	setReset: any;
	heading: string;
	message: string;
	onChangeOrAddDataset?: any;
}

export interface EditDatasetProps {
	//state
	token: string;
	dsId: string;

	//dispatch
	setValuesToState: (
		conId: any,
		fname: any,
		canvasTables: any,
		schema: any,
		relationshipsArray: any,
		arrowsArray: any
	) => void;
	setUserTable: (pl: any) => void;
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
