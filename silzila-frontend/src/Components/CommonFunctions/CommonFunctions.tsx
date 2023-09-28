export const validateEmail = (email: string) => {
	const res =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var result = res.test(String(email).toLowerCase());
	return result;
};

export const validateMandatory = (value: string) => {
	if (value) {
		return value.length >= 1 ? true : false;
	} else {
		return false;
	}
};

export const validatePassword = (password: string) => {
	// return password.length >= 8 ? true : false;
	// TODO: need to change 4 to 6 after testing
	return password.length >= 4 ? true : false;
};

export const validateEqualValues = (value1: string, value2: string) => {
	return value1 === value2;
};
