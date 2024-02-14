// This component is used to enable / disable tooltip option for charts

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { enableMouseOver } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import SwitchWithInput from "../SwitchWithInput";

interface ChartMarginProps {
	setMouseOver: (propKey: string, enable: boolean) => void;
}

const ChartMouseOver = ({
	// state
	chartControls,
	tabTileProps,

	// dispatch
	setMouseOver,
}: ChartOptionsProps & ChartMarginProps) => {
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
					isChecked={chartControls.properties[propKey].mouseOver.enable}
					onSwitch={() => {
						setMouseOver(propKey, !chartControls.properties[propKey].mouseOver.enable);
					}}
				/>
			</div>
		</div>
	);
};

const mapStateToProps = (state: ChartOptionsStateProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setMouseOver: (propKey: string, enable: boolean) =>
			dispatch(enableMouseOver(propKey, enable)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartMouseOver);
