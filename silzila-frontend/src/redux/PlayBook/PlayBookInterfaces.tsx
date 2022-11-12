export interface PlayBookProps {
	playBookName: null | string;
	playBookUid: null | string;
	description: null | string;
	oldContent: null | any;
}

export interface PlayBookStateProps {
	playBookState: PlayBookProps;
}

interface UpdatePlaybookUid {
	type: "ADD_PLAYBOOK_UID";
	payload: {
		playBookName: string;
		playBookUid: string;
		description: string;
		oldContent: string | any;
	};
}

interface resetPlayBookData {
	type: "RESET_PLAYBOOK_DATA";
}

interface storePlayBookCopy {
	type: "STORE_PLAYBOOK_COPY";
	payload: any;
}
export type ActionType = UpdatePlaybookUid | resetPlayBookData | storePlayBookCopy;
