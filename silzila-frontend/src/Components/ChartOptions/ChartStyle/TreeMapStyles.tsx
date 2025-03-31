import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./chartStyle.css";
import SliderWithInput from "../SliderWithInput";
import { FormControl, MenuItem, Select } from "@mui/material";
import { updateTreeMapStyleOptions } from "../../../redux/ChartPoperties/ChartControlsActions";
import { Dispatch } from "redux";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";

const TreeMapStyles = ({
	// state
	chartControls,
	tabTileProps,
	chartProperties,

	// dispatch
	updateTreeMapStyleOptions,
}: ChartOptionsProps & {
	updateTreeMapStyleOptions: (propKey: string, option: string, value: any) => void;
}) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	const treemapStyle = chartControls.properties[propKey].treeMapChartControls;
	let chartData = chartControls.properties[propKey].chartData
		? chartControls.properties[propKey].chartData
		: [];
	var treeMapLeafDepthOptions: any = [];

	useEffect(() => {
		if (chartData) {
			treeMapLeafDepthOptions = chartProperties.properties[propKey].chartAxes[1].fields.map(
				(el:any, i:number) => {
					return { name: el.fieldname, value: i + 1 };
				}
			);
		}
	}, [chartData, chartControls]);

	treeMapLeafDepthOptions = chartProperties.properties[propKey].chartAxes[1].fields.map(
		(el:any, i:number) => {
			return { name: el.fieldname, value: i + 1 };
		}
	);

	return (
		<div className="optionsInfo">
			<div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Leaf Depth</div>

			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={treemapStyle.leafDepth}
					variant="outlined"
					onChange={e => {
						updateTreeMapStyleOptions(propKey, "leafDepth", e.target.value);
					}}
					sx={{
						fontSize: "12px",
						width: "96%",
						margin: "0 auto 0.5rem auto",
						backgroundColor: "white",
						height: "1.5rem",
						color: "#404040",
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: "#2bb9bb", // Set focused border color
						},
						marginLeft: "5px"
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
					{treeMapLeafDepthOptions.map((depth: any) => {
						return (
							<MenuItem
								value={depth.value}
								key={depth.name}
								sx={{
									padding: "2px 10px",
									fontSize: "12px",
								}}
							>
								{depth.name}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>

			<div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Border Width</div>
			<SliderWithInput
				pointNumbers={true}
				sliderValue={treemapStyle.borderWidth}
				sliderMinMax={{ min: 0, max: 40, step: 1 }}
				percent={true}
				changeValue={value => updateTreeMapStyleOptions(propKey, "borderWidth", value)}
			/>
			<div className="optionDescription" style={{ paddingLeft: "0.5rem"}}>Gap Width</div>
			<SliderWithInput
				pointNumbers={true}
				sliderValue={treemapStyle.gapWidth}
				sliderMinMax={{ min: 0, max: 100, step: 1 }}
				percent={true}
				changeValue={value => updateTreeMapStyleOptions(propKey, "gapWidth", value)}
			/>
		</div>
	);
};
const mapStateToProps = (state: ChartOptionsStateProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProperties: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateTreeMapStyleOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateTreeMapStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeMapStyles);
