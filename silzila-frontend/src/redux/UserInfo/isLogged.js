const signedInObj = JSON.parse(localStorage.getItem("accountInfo"));

const loggedReducer = (
	state = signedInObj
		? signedInObj
		: {
				isUserLogged: false,
				accessToken: "",
		  },
	action
) => {
	switch (action.type) {
		case "USER_AUTHENTICATED":
			var info = {
				isUserLogged: action.payload.isUserLogged,
				accessToken: action.payload.accessToken,
				tokenType: action.payload.tokenType,
			};
			localStorage.setItem("accountInfo", JSON.stringify(info));

			return action.payload;

		case "RESET_USER":
			var resetInfo = {
				isUserLogged: false,
				accessToken: "",
			};
			localStorage.setItem("accountInfo", JSON.stringify(resetInfo));

			return resetInfo;

		default:
			return state;
	}
};

export default loggedReducer;
