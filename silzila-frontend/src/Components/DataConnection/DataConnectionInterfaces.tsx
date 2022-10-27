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
	//props
	account: DataConnectionDetails;
	setAccount: (value: DataConnectionDetails) => void;

	token: string;
	dataConnId: string;
	viewMode: boolean;
	setViewMode: (value: boolean) => void;
	setSeverity: (value: string) => void;
	setOpenAlert: (value: boolean) => void;
	setTestMessage: (value: string) => void;

	showForm: boolean;
	showAndHideForm: () => void;

	regOrUpdate: string;

	// TODO need to specify type
	handleMode: (e: any) => void;
	// TODO need to specify type
	handleRegister: () => Promise<void>;
	// TODO need to specify type
	getInformation: () => Promise<void>;
	// TODO need to specify type
	handleonUpdate: () => Promise<void>;
}
