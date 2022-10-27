
export const userAuthentication = (payload:{}) => {
	console.log(payload)
	return { type: "USER_AUTHENTICATED", payload: payload };
};

export const resetUser = () => {
	return { type: "RESET_USER" };
};
