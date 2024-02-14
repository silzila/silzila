export interface FlatFileProp {
	fileId: string;
	name: string;
	dateFormat?: string;
	timestampFormat?: string;
	timestampNTZFormat?: string;
	revisedColumnInfos?: any[];
	columnInfos?: any[];
	sampleRecords?: any[];
}

export interface FlatFileState {
	editMode: boolean;
	initialApiResponse: FlatFileProp | {};
	editApiResponse: FlatFileProp | {};
	confirmModifiedResponse: FlatFileProp | {};
}

export interface FlatFileStateProps {
	flatFileState: FlatFileState;
}

interface setApiResponse {
	type: "SET_API_RESPONSE";
	payload: any;
}

interface setEditApiResponse {
	type: "SET_EDIT_API_RESPONSE";
	payload: any;
}

interface setEditApiResponseProp {
	type: "EDIT_API_RESPONSE_PROP";
	payload: { key: string; file: any };
}

interface resetFlatFileState {
	type: "RESET_STATE";
}
interface toggleEditMode {
	type: "TOGGLE_EDIT_MODE";
	payload: boolean;
}

export type FlatFileActions =
	| setApiResponse
	| setEditApiResponse
	| setEditApiResponseProp
	| resetFlatFileState
	| toggleEditMode;
