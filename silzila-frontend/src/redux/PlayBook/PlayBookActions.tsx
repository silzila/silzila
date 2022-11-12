export const updatePlaybookUid = (
	playBookName: string,
	playBookUid: string,
	description: string,
	oldContent: string | any
) => {
	return {
		type: "ADD_PLAYBOOK_UID",
		payload: {
			playBookName,
			playBookUid,
			description,
			oldContent,
		},
	};
};

export const resetPlayBookData = () => {
	return { type: "RESET_PLAYBOOK_DATA" };
};

export const storePlayBookCopy = (pb: any) => {
	return { type: "STORE_PLAYBOOK_COPY", payload: pb };
};
