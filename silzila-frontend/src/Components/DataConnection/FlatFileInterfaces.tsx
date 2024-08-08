import { FlatFileProp } from "../../redux/FlatFile/FlatFileInterfaces";

export interface FlatFileUploadProps {
	token: string;
	setApiResponse: (file: FlatFileProp) => void;
	setEditApiResponse: (file: FlatFileProp) => void;
	fileType:string;
}

export interface FileDropZoneProps {
	setSelectedFile: any;
	selectedFile: any;
	fileType: string;
	setSelectedSheetName?: (sheetName: string) => void; 
}


export interface EditFlatFileProps {
	token: string;
	editApiResponse: any;
	editMode: boolean;

	setEditApiResponse: (key: string, file: any) => void;

	resetFlatFileState: () => void;
}

export interface ConfirmFlatFileProps {
	token: string;
	modifiedResponse: any;
	editApiResponse: any;
	editMode: boolean;

	resetFlatFileState: () => void;
	setEditApiResponse: (key: string, file: any) => void;
}
