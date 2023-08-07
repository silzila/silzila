import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import ShortUniqueId from "short-unique-id";
import { updatecfObjectOptions1 } from "../../../redux/ChartPoperties/ChartControlsActions";
import { CustomFontAndBgColor, StyleButtons } from "../DynamicMeasureConditionalFormating";

const RuleComponent = ({
	chartControls,
	tabTileProps,
	chartProperties,
	updatecfObjectOptions1,
	format,
}: any) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var uId = new ShortUniqueId({ length: 8 });

	return <div>rule Component</div>;
};

const mapStateToProps = (state: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProperties: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updatecfObjectOptions1: (propKey: string, item: any) =>
			dispatch(updatecfObjectOptions1(propKey, item)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RuleComponent);
