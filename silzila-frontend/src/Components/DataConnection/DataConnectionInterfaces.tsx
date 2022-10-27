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
}

export interface DataConnectionProps {
	token: string;
	resetAllStates: () => void;
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

	setSeverity: (value: string) => void;
	setOpenAlert: (value: boolean) => void;
	setTestMessage: (value: string) => void;
	showAndHideForm: () => void;
	// TODO:need to specify type
	handleMode: (e: any) => void;
	handleRegister: () => Promise<void>;
	getInformation: () => Promise<void>;
	handleonUpdate: () => Promise<void>;
}
