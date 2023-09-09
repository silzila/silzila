import React from "react";

const Logger = (level: string, note?: string, logItem?: any) => {
	const mode: string = "dev";
	var item = logItem;
	if (logItem && typeof logItem === "object") {
		item = JSON.stringify(logItem, null, "\t");
	}
	if (level === "info" && mode === "dev") {
		return console.log(note ? note : "", item ? item : "");
	}
	if (level === "warn") {
		return console.warn(note ? note : "", item ? item : "");
	}
	if (level === "error") {
		return console.error(note ? note : "", item ? item : "");
	}
};

export default Logger;
