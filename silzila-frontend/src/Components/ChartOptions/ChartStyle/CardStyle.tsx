import { connect } from "react-redux";
import "./chartStyle.css";
import SliderWithInput from "../SliderWithInput";
import { TextField } from "@mui/material";
import SwitchWithInput from "../SwitchWithInput";
import { Dispatch } from "redux";
import { updateCardControls } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import { ChartConBoxPlotChartControls } from "../../../redux/ChartPoperties/ChartControlsInterface";

const textFieldInputProps = {
	style: {
		height: "2rem",
		flex: 1,
		padding: "4px 8px 2px 8px",
		width: "4rem",
		fontSize: "14px",
	},
};

interface CardStyle {
	updateCardControls: (propKey: string, option: string, value: any) => void;
}

const CardStyle = ({
	// state
	chartControls,
	tabTileProps,

	// dispatch
	updateCardControls,
}: ChartOptionsProps & CardStyle) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var cardStyleOptions: any = chartControls.properties[propKey].cardControls;

	return (
		<div className="optionsInfo">
			<div className="optionDescription">Font Size</div>
			<SliderWithInput
				percent={false}
				sliderValue={cardStyleOptions.fontSize}
				sliderMinMax={{ min: 20, max: 100, step: 1 }}
				changeValue={value => {
					updateCardControls(propKey, "fontSize", value);
				}}
			/>
			<div className="optionDescription">Label Font Size</div>
			<SliderWithInput
				percent={false}
				sliderValue={cardStyleOptions.subtextFontSize}
				sliderMinMax={{ min: 10, max: 70, step: 1 }}
				changeValue={value => updateCardControls(propKey, "subtextFontSize", value)}
			/>
			<div className="optionDescription">Width</div>
			<SliderWithInput
				percent={false}
				sliderValue={cardStyleOptions.width}
				sliderMinMax={{ min: 250, max: 1000, step: 1 }}
				changeValue={(value: any) => {
					updateCardControls(propKey, "width", value);
				}}
			/>
			<div className="optionDescription">Height</div>
			<SliderWithInput
				percent={false}
				sliderValue={cardStyleOptions.height}
				sliderMinMax={{ min: 250, max: 400, step: 1 }}
				changeValue={(value: any) => updateCardControls(propKey, "height", value)}
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
		updateCardControls: (propKey: string, option: string, value: string | number) =>
			dispatch(updateCardControls(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CardStyle);
