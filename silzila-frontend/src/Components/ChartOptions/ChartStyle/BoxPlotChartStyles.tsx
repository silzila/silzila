import { connect } from "react-redux";
import "./chartStyle.css";
import SliderWithInput from "../SliderWithInput";
import { TextField } from "@mui/material";
import SwitchWithInput from "../SwitchWithInput";
import { Dispatch } from "redux";
import { updateBoxPlotStyleOptions } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import { ChartConBoxPlotChartControls } from "../../../redux/ChartPoperties/ChartControlsInterface";
// import CSS from "csstype";

const textFieldInputProps = {
	style: {
		height: "2rem",
		flex: 1,
		padding: "4px 8px 2px 8px",
		width: "4rem",
		fontSize: "14px",
	},
};

interface BoxPlotChartAction {
	updateBoxPlotStyleOptions: (propKey: string, option: string, value: any) => void;
}

const BoxPlotChartStyles = ({
	// state
	chartControls,
	tabTileProps,

	// dispatch
	updateBoxPlotStyleOptions,
}: ChartOptionsProps & BoxPlotChartAction) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var boxStyle: ChartConBoxPlotChartControls =
		chartControls.properties[propKey].boxPlotChartControls;

	return (
		<div className="optionsInfo">
			<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					Flip Axis
				</label>
				<SwitchWithInput
					isChecked={boxStyle.flipAxis}
					onSwitch={() => {
						updateBoxPlotStyleOptions(propKey, "flipAxis", !boxStyle.flipAxis);
					}}
				/>
			</div>
			<div>
				<div className="optionDescription">Box Width</div>
				<div className="inputFieldContainer">
					<TextField
						type="number"
						value={boxStyle.minBoxWidth}
						onChange={e => {
							updateBoxPlotStyleOptions(propKey, "minBoxWidth", e.target.value);
						}}
						label="Min"
						InputLabelProps={{ shrink: true }}
						inputProps={{ ...textFieldInputProps }}
					/>
					<TextField
						type="number"
						value={boxStyle.maxBoxWidth}
						onChange={e => {
							updateBoxPlotStyleOptions(propKey, "maxBoxWidth", e.target.value);
						}}
						label="Max"
						InputLabelProps={{ shrink: true }}
						inputProps={{ ...textFieldInputProps }}
					/>
				</div>
			</div>

			<div className="optionDescription">Border Width</div>
			<SliderWithInput
				percent={false}
				sliderValue={boxStyle.boxborderWidth}
				sliderMinMax={{ min: 1, max: 10, step: 1 }}
				changeValue={value => updateBoxPlotStyleOptions(propKey, "boxborderWidth", value)}
			/>
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
		updateBoxPlotStyleOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateBoxPlotStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(BoxPlotChartStyles);
