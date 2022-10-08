export const updatePlaybookUid = (playBookObj) => {
	return { type: "ADD_PLAYBOOK_UID", payload: playBookObj };
};

export const resetPlayBookData = () => {
	return { type: "RESET_PLAYBOOK_DATA" };
};

export const storePlayBookCopy = (pb) => {
	return { type: "STORE_PLAYBOOK_COPY", payload: pb };
};
