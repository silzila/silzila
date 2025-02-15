export const userAuthentication = (payload: {}) => {
	return { type: "USER_AUTHENTICATED", payload: payload };
};

export const resetUser = () => {
	return { type: "RESET_USER" };
};

export const updateToken = (payload: string) => {
	return {
		type: "UPDATE_TOKEN",
		payload: payload,
	};
}