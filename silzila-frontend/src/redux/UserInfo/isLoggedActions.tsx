export const userAuthentication = (payload: {}) => {
	return { type: "USER_AUTHENTICATED", payload: payload };
};

export const resetUser = () => {
	return { type: "RESET_USER" };
};
export const CustomDefault=()=>{
	return {type:"CUSTOM_DEFAULT"}
}
