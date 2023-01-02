import { FlatFileProp } from "../../redux/FlatFile/FlatFileInterfaces";

export interface FlatFileUploadProps {
	token: string;
	setApiResponse: (file: FlatFileProp) => void;
	setEditApiResponse: (file: FlatFileProp) => void;
}

export interface EditFlatFileProps {
	token: string;
	editApiResponse: any;

	setEditApiResponse: (key: string, file: any) => void;
	setModifiedApiResponse: (file: any) => void;
	resetFlatFileState: () => void;
}

export interface ConfirmFlatFileProps {
	token: string;
	modifiedResponse: any;

	resetFlatFileState: () => void;
}
