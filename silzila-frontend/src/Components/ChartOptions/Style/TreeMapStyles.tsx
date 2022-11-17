// import React, { useEffect } from "react";
// import { connect } from "react-redux";
// import "./chartStyle.css";
// import { updateTreeMapStyleOptions } from "../../../redux/ChartProperties/actionsChartControls";
// import SliderWithInput from "../SliderWithInput";
// import { FormControl, MenuItem, Select, Switch, TextField } from "@mui/material";

// const textFieldStyleProps = {
// 	style: {
// 		fontSize: "12px",
// 		width: "90%",
// 		margin: "0 auto 0.5rem auto",
// 		backgroundColor: "white",
// 		height: "1.5rem",
// 		color: "#404040",
// 	},
// };

// const TreeMapStyles = ({
// 	// state
// 	chartProp,
// 	tabTileProps,
// 	chartDetail,

// 	// dispatch
// 	updateTreeMapStyleOptions,
// }) => {
// 	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
// 	const treemapStyle = chartProp.properties[propKey].treeMapChartControls;
// 	let chartData = chartProp.properties[propKey].chartData
// 		? chartProp.properties[propKey].chartData.result
// 		: "";
// 	var treeMapLeafDepthOptions = [];
// 	console.log(chartDetail[propKey].chartType);

// 	useEffect(() => {
// 		if (chartData) {
// 			treeMapLeafDepthOptions = chartDetail[propKey].chartAxes[1].fields.map((el, i) => {
// 				return { name: el.fieldname, value: i + 1 };
// 			});
// 			// updateTreeMapStyleOptions(
// 			// 	propKey,
// 			// 	"leafDepth",
// 			// 	chartDetail[propKey].chartAxes[1].fields.length
// 			// );
// 		}
// 	}, [chartData, chartProp]);
// 	// useEffect(() => {
// 	// 	if (chartData) {
// 	// 		updateTreeMapStyleOptions(
// 	// 			propKey,
// 	// 			"leafDepth",
// 	// 			chartDetail[propKey].chartAxes[1].fields.length
// 	// 		);
// 	// 	}
// 	// }, [chartDetail[propKey].chartType]);

// 	treeMapLeafDepthOptions = chartDetail[propKey].chartAxes[1].fields.map((el, i) => {
// 		return { name: el.fieldname, value: i + 1 };
// 	});
// 	console.log(treeMapLeafDepthOptions);

// 	return (
// 		<div className="optionsInfo">
// 			<div className="optionDescription">Leaf Depth</div>

// 			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
// 				<Select
// 					value={treemapStyle.leafDepth}
// 					variant="outlined"
// 					onChange={(e) => {
// 						updateTreeMapStyleOptions(propKey, "leafDepth", e.target.value);
// 					}}
// 					sx={{
// 						fontSize: "12px",
// 						width: "90%",
// 						margin: "0 auto 0.5rem auto",
// 						backgroundColor: "white",
// 						height: "1.5rem",
// 						color: "#404040",
// 					}}
// 				>
// 					{treeMapLeafDepthOptions.map((depth) => {
// 						return (
// 							<MenuItem
// 								value={depth.value}
// 								key={depth.name}
// 								sx={{
// 									padding: "2px 10px",
// 									fontSize: "12px",
// 								}}
// 							>
// 								{depth.name}
// 							</MenuItem>
// 						);
// 					})}
// 				</Select>
// 			</FormControl>

// 			<div className="optionDescription">Border Width</div>
// 			<SliderWithInput
// 				pointNumbers={true}
// 				sliderValue={treemapStyle.borderWidth}
// 				sliderMinMax={{ min: 0, max: 40, step: 1 }}
// 				changeValue={(value) => updateTreeMapStyleOptions(propKey, "borderWidth", value)}
// 			/>
// 			<div className="optionDescription">Gap Width</div>
// 			<SliderWithInput
// 				pointNumbers={true}
// 				sliderValue={treemapStyle.gapWidth}
// 				sliderMinMax={{ min: 0, max: 100, step: 1 }}
// 				changeValue={(value) => updateTreeMapStyleOptions(propKey, "gapWidth", value)}
// 			/>
// 		</div>
// 	);
// };
// const mapStateToProps = (state) => {
// 	return {
// 		chartProp: state.chartControls,
// 		tabTileProps: state.tabTileProps,
// 		chartDetail: state.chartProperties.properties,
// 	};
// };

// const mapDispatchToProps = (dispatch) => {
// 	return {
// 		updateTreeMapStyleOptions: (propKey, option, value) =>
// 			dispatch(updateTreeMapStyleOptions(propKey, option, value)),
// 	};
// };

// export default connect(mapStateToProps, mapDispatchToProps)(TreeMapStyles);
import React from "react";

const TreeMapStyles = () => {
	return <div>TreeMapStyles</div>;
};

export default TreeMapStyles;
