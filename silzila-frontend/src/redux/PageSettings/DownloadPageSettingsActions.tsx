export const setPageSettings = (option: string, value: any) => {
	return { type: "SET_PAGE_SETTINGS", payload: { option, value } };
};
export const resetPageSettings = () => {
	return { type: "RESET_PAGE_SETTINGS" };
};
