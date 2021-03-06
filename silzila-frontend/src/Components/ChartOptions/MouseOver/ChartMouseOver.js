// This component is used to enable / disable tooltip option for charts

import { Switch } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { enableMouseOver } from "../../../redux/ChartProperties/actionsChartControls";

const ChartMouseOver = ({
	// state
	chartControl,
	tabTileProps,

	// dispatch
	setMouseOver,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	return (
		<div className="optionsInfo">
			<div className="optionDescription">
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					Enable
				</label>
				<Switch
					size="small"
					id="enableDisable"
					checked={chartControl.properties[propKey].mouseOver.enable}
					onChange={(e) => {
						setMouseOver(propKey, !chartControl.properties[propKey].mouseOver.enable);
					}}
				/>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		chartControl: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setMouseOver: (propKey, enable) => dispatch(enableMouseOver(propKey, enable)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartMouseOver);
