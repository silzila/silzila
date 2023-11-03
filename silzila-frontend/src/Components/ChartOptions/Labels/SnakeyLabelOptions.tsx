import { connect } from "react-redux";
import "./chartLabels.css";
import SliderWithInput from "../SliderWithInput";
import { FormControl, MenuItem, Select } from "@mui/material";
import { Dispatch } from "redux";
import { updateSankeyStyleOptions } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";

export const menuItemStyle = {
	padding: "2px 10px",
	fontSize: "12px",
};

export const SelectComponentStyle = {
	fontSize: "12px",
	width: "90%",
	margin: "0 auto 0.5rem auto",
	backgroundColor: "white",
	height: "1.5rem",
	color: "#404040",
};

const SankeyLabelOptions = ({
	// state
	chartControls,
	tabTileProps,

	// dispatch

	updateSankeyStyleOptions,
}: ChartOptionsProps & {
	updateSankeyStyleOptions: (propKey: string, option: string, value: any) => void;
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	// const handleOnSlide = debounce((value: any) => {
	// 	updateSankeyStyleOptions(propKey, "labelDistance", value);
	// }, 5000);

	const sankeyLabelRotationOption = [
		{ name: "Horizondal", value: 0 },
		{ name: "Vertical", value: 90 },
		{ name: "Vertical Flip", value: -90 },
	];

	return (
		<div className="optionsInfo">
			<div className="optionDescription">Label Position</div>
			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={chartControls.properties[propKey].sankeyControls.labelPosition}
					variant="outlined"
					onChange={e => {
						updateSankeyStyleOptions(propKey, "labelPosition", e.target.value);
					}}
					sx={SelectComponentStyle}
				>
					<MenuItem value="inside" key="inside" sx={menuItemStyle}>
						Inside
					</MenuItem>
					<MenuItem value="outside" key="outside" sx={menuItemStyle}>
						Outside
					</MenuItem>
				</Select>
			</FormControl>
			<div className="optionDescription">Label Distance</div>
			<SliderWithInput
				percent={true}
				sliderValue={chartControls.properties[propKey].sankeyControls.labelDistance}
				sliderMinMax={{ min: 0, max: 50, step: 1 }}
				changeValue={value => {
					// handleOnSlide(value);
					updateSankeyStyleOptions(propKey, "labelDistance", value);
				}}
			/>
			<div className="optionDescription">Label Rotate</div>
			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={chartControls.properties[propKey].sankeyControls.labelRotate}
					variant="outlined"
					onChange={e => {
						updateSankeyStyleOptions(propKey, "labelRotate", e.target.value);
					}}
					sx={SelectComponentStyle}
				>
					{sankeyLabelRotationOption.map(position => {
						return (
							<MenuItem value={position.value} key={position.name} sx={menuItemStyle}>
								{position.name}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>

			<div className="optionDescription">Label Overflow</div>
			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={chartControls.properties[propKey].sankeyControls.overFlow}
					variant="outlined"
					onChange={e => {
						updateSankeyStyleOptions(propKey, "overFlow", e.target.value);
					}}
					sx={SelectComponentStyle}
				>
					<MenuItem sx={menuItemStyle} value="truncate">
						Truncate
					</MenuItem>
					<MenuItem sx={menuItemStyle} value="break">
						Break
					</MenuItem>
				</Select>
			</FormControl>
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
		updateSankeyStyleOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateSankeyStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SankeyLabelOptions);
