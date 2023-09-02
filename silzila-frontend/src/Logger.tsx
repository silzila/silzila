import React from "react";

const Logger = (level: string, logItem: any) => {
	const mode: string = "dev";
	if (level === "info" && mode === "dev") {
		return console.log(JSON.stringify(logItem, null, 2));
	}
	if (level === "warn") {
		return console.warn(logItem);
	}
	if (level === "error") {
		return console.error(logItem);
	}
};

export default Logger;
