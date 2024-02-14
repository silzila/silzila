import React from "react";
import { PageSettingsProps } from "./DownloadPageStateInterfaces";
import update from "immutability-helper";

const initialRecords = {
	downloadType: "pdf",
	callForDownload: false,
	openPageSettingPopover: false,
	SelectedOrientation: "landscape",
	selectedFormat: "a4",
	top_margin: 40,
	right_margin: 20,
	left_margin: 20,
	bottom_margin: 40,
	fullScreen: false,
};

const DownloadPageSettingReducer = (state: PageSettingsProps = initialRecords, action: any) => {
	switch (action.type) {
		case "SET_PAGE_SETTINGS":
			return update(state, { [action.payload.option]: { $set: action.payload.value } });

		case "RESET_PAGE_SETTINGS":
			return initialRecords;
		default:
			return state;
	}
};

export default DownloadPageSettingReducer;
