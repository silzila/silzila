export const userAuthentication = (payload: {}) => {
	return { type: "USER_AUTHENTICATED", payload: payload };
};

export const resetUser = () => {
	return { type: "RESET_USER" };
};
