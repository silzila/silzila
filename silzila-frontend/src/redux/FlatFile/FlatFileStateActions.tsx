export const setApiResponse = (file: any) => {
	return { type: "SET_API_RESPONSE", payload: file };
};
export const setEditApiResponse = (file: any) => {
	return { type: "SET_EDIT_API_RESPONSE", payload: file };
};
export const setModifiedApiResponse = (file: any) => {
	return { type: "CONFIRM_MODIFIED_RESPONSE", payload: file };
};
export const setEditApiResponseProp = (key: string, file: any) => {
	return { type: "EDIT_API_RESPONSE_PROP", payload: { key, file } };
};
export const resetFlatFileState = () => {
	return { type: "RESET_STATE" };
};
