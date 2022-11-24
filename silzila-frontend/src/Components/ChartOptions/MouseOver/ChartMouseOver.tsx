// This component is used to enable / disable tooltip option for charts

import { Switch } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { enableMouseOver } from "../../../redux/ChartPoperties/ChartControlsActions";
import {
	ChartControl,
	ChartControlStateProps,
} from "../../../redux/ChartPoperties/ChartControlsInterface";
import {
	TabTileStateProps,
	TabTileStateProps2,
} from "../../../redux/TabTile/TabTilePropsInterfaces";
import SwitchWithInput from "../SwitchWithInput";

interface ChartMarginProps {
	chartControl: ChartControl;
	tabTileProps: TabTileStateProps;
	setMouseOver: (propKey: number | string, enable: boolean) => void;
}

const ChartMouseOver = ({
	// state
	chartControl,
	tabTileProps,

	// dispatch
	setMouseOver,
}: ChartMarginProps) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

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

				<SwitchWithInput
					isChecked={chartControl.properties[propKey].mouseOver.enable}
					onSwitch={() => {
						setMouseOver(propKey, !chartControl.properties[propKey].mouseOver.enable);
					}}
				/>
			</div>
		</div>
	);
};

const mapStateToProps = (state: ChartControlStateProps & TabTileStateProps2) => {
	return {
		chartControl: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setMouseOver: (propKey: number | string, enable: boolean) =>
			dispatch(enableMouseOver(propKey, enable)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartMouseOver);
