import { connect } from "react-redux";
import "./chartStyle.css";
import SliderWithInput from "../SliderWithInput";
import { FormControl, MenuItem, Select } from "@mui/material";
import SwitchWithInput from "../SwitchWithInput";
import { Dispatch } from "redux";
import { updateSankeyStyleOptions } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";

const SankeyStyles = ({
	// state
	chartControls,
	tabTileProps,

	// dispatch
	updateSankeyStyleOptions,
}: ChartOptionsProps & {
	updateSankeyStyleOptions: (propKey: string, option: string, value: any) => void;
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	const sankeyStyle = chartControls.properties[propKey].sankeyControls;

	return (
		<div className="optionsInfo">
			<div className="optionDescription" style={{ marginLeft: "-5px" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px", marginLeft: "0.5rem" }}
				>
					Draggable Node
				</label>
				<SwitchWithInput
					isChecked={sankeyStyle.draggable}
					onSwitch={() => {
						updateSankeyStyleOptions(propKey, "draggable", !sankeyStyle.draggable);
					}}
				/>
			</div>
			<div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Node Align</div>

			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={sankeyStyle.nodeAlign}
					variant="outlined"
					onChange={e => {
						updateSankeyStyleOptions(propKey, "nodeAlign", e.target.value);
					}}
					sx={{
						fontSize: "12px",
						width: "96%",
						margin: "0 auto 0.5rem 0.3rem",
						backgroundColor: "white",
						height: "1.5rem",
						color: "#404040",
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: "#2bb9bb", // Set focused border color
						},
					}}
					MenuProps={{
						PaperProps: {
							sx: {
								"& .MuiMenuItem-root.Mui-selected": {
									backgroundColor: "rgba(43, 185, 187, 0.1) !important",  // Force background color												
								},
								"& .MuiMenuItem-root.Mui-selected:hover": {
									backgroundColor: "rgba(43, 185, 187, 0.2) !important",  // Change hover state for selected item
								}
							}
						}
					}}
				>
					<MenuItem value="left" sx={{ padding: "2px 10px", fontSize: "12px" }}>
						Left
					</MenuItem>
					<MenuItem value="right" sx={{ padding: "2px 10px", fontSize: "12px" }}>
						Right
					</MenuItem>
					<MenuItem value="justify" sx={{ padding: "2px 10px", fontSize: "12px" }}>
						Justify
					</MenuItem>
				</Select>
			</FormControl>

			<div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Orient</div>

			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={sankeyStyle.orient}
					variant="outlined"
					onChange={e => {
						updateSankeyStyleOptions(propKey, "orient", e.target.value);
					}}
					sx={{
						fontSize: "12px",
						width: "96%",
						margin: "0 auto 0.5rem 0.3rem",
						backgroundColor: "white",
						height: "1.5rem",
						color: "#404040",
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: "#2bb9bb", // Set focused border color
						},
					}}
					MenuProps={{
						PaperProps: {
							sx: {
								"& .MuiMenuItem-root.Mui-selected": {
									backgroundColor: "rgba(43, 185, 187, 0.1) !important",  // Force background color												
								},
								"& .MuiMenuItem-root.Mui-selected:hover": {
									backgroundColor: "rgba(43, 185, 187, 0.2) !important",  // Change hover state for selected item
								}
							}
						}
					}}
				>
					<MenuItem value="horizontal" sx={{ padding: "2px 10px", fontSize: "12px" }}>
						Horizontal
					</MenuItem>
					<MenuItem value="vertical" sx={{ padding: "2px 10px", fontSize: "12px" }}>
						Vertical
					</MenuItem>
				</Select>
			</FormControl>

			<div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Node Width</div>
			<SliderWithInput
				pointNumbers={true}
				sliderValue={sankeyStyle.nodeWidth}
				sliderMinMax={{ min: 8, max: 100, step: 1 }}
				percent={true}
				changeValue={value => updateSankeyStyleOptions(propKey, "nodeWidth", value)}
			/>
			<div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Node Gap</div>
			<SliderWithInput
				pointNumbers={true}
				sliderValue={sankeyStyle.nodeGap}
				sliderMinMax={{ min: 0, max: 80, step: 1 }}
				percent={true}
				changeValue={value => updateSankeyStyleOptions(propKey, "nodeGap", value)}
			/>
			<div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Link Opacity</div>
			<SliderWithInput
				pointNumbers={true}
				sliderValue={sankeyStyle.opacity}
				sliderMinMax={{ min: 0, max: 100, step: 10 }}
				percent={true}
				changeValue={value => updateSankeyStyleOptions(propKey, "opacity", value)}
			/>
			<div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Link Curveness</div>
			<SliderWithInput
				pointNumbers={true}
				sliderValue={sankeyStyle.curveness}
				sliderMinMax={{ min: 0, max: 100, step: 10 }}
				percent={true}
				changeValue={value => updateSankeyStyleOptions(propKey, "curveness", value)}
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
		updateSankeyStyleOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateSankeyStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SankeyStyles);
