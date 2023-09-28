import { AlertColor } from "@mui/material/Alert";
import { ConnectionItem } from "../../redux/DataSet/DatasetStateInterfaces";

//initial state (account)
export interface DataConnectionDetails {
	vendor: string;
	vendorError: string;
	server: string;
	serverError: string;
	port: string;
	portError: string;
	database: string;
	databaseError: string;
	username: string;
	userNameError: string;
	connectionName: string;
	connectionNameError: string;
	password: string;
	passwordError: string;
	httppath: string;
	httppathError: string;
}

export interface DataConnectionProps {
	token: string;
	resetAllStates: () => void;
	setDataConnectionListToState: (list: ConnectionItem[]) => void;
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ form interfaces @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

export interface FormProps {
	account: DataConnectionDetails;
	setAccount: (value: DataConnectionDetails) => void;

	viewMode: boolean;
	setViewMode: (value: boolean) => void;

	token: string;
	dataConnId: string;
	showForm: boolean;
	regOrUpdate: string;

	setSeverity: (value: AlertColor) => void;
	setOpenAlert: (value: boolean) => void;
	setTestMessage: (value: string) => void;
	showAndHideForm: () => void;
	// TODO:need to specify type
	handleMode: (e: any) => void;
	handleRegister: () => Promise<void>;
	getInformation: () => Promise<void>;
	handleonUpdate: () => Promise<void>;
}
