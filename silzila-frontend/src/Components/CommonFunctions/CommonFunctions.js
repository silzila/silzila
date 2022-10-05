export const validateEmail = (email) => {
	const res =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var result = res.test(String(email).toLowerCase());
	return result;
};

export const validateMandatory = (value) => {
	if (value) {
		return value.length >= 1 ? true : false;
	} else {
		// console.log("Some mandatory field is missing");
		return false;
	}
};

export const validatePassword = (password) => {
	return password.length >= 8 ? true : false;
};

export const validateEqualValues = (value1, value2) => {
	return value1 === value2;
};
