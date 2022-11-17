// import React from "react";
// import { connect } from "react-redux";
// import { updateFormatOption } from "../../../redux/ChartProperties/actionsChartControls";
// import InputPositiveNumber from "../CommonFunctions/InputPositiveNumber";

// const YAxisFormat = ({
// 	// props
// 	chartType,

// 	// state
// 	tabTileProps,
// 	chartControl,

// 	// dispatch
// 	updateFormat,
// }) => {
// 	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
// 	let formatObject = chartControl.properties[propKey].formatOptions.yAxisFormats;

// 	const separatorOptions = [
// 		{ type: "None", value: "None" },
// 		{ type: "Comma", value: "Comma" },
// 		{ type: "Abbrev", value: "Abbrev" },
// 	];

// 	const renderSeparatorOptions = () => {
// 		return separatorOptions.map((item) => {
// 			return (
// 				<div
// 					key={item.value}
// 					className={
// 						item.value === formatObject.numberSeparator
// 							? "radioButtonSelected"
// 							: "radioButton"
// 					}
// 					value={formatObject.numberSeparator}
// 					onClick={(e) => {
// 						updateFormat(propKey, "yAxisFormats", "numberSeparator", item.value);
// 					}}
// 				>
// 					{item.type}
// 				</div>
// 			);
// 		});
// 	};

// 	return (
// 		<React.Fragment>
// 			<div className="optionDescription">
// 				{chartType === "scatterPlot" ? "Y-AXIS MEASURE FORMAT" : "MEASURE AXIS FORMAT"}{" "}
// 			</div>

// 			<div className="optionDescription">
// 				<label htmlFor="enableDisable" className="enableDisableLabel">
// 					Separator
// 				</label>
// 			</div>
// 			<div className="radioButtons" style={{ padding: "0", margin: "auto auto 0.5rem" }}>
// 				{renderSeparatorOptions()}
// 			</div>
// 			<div className="optionDescription">
// 				<label htmlFor="enableDisable" className="enableDisableLabel">
// 					Round Off
// 				</label>
// 			</div>
// 			<div className="optionDescription">
// 				<input
// 					type="checkbox"
// 					id="enableDisable"
// 					checked={formatObject.enableRounding}
// 					onChange={(e) => {
// 						updateFormat(
// 							propKey,
// 							"yAxisFormats",
// 							"enableRounding",
// 							!formatObject.enableRounding
// 						);
// 					}}
// 				/>
// 				<InputPositiveNumber
// 					value={formatObject.roundingDigits}
// 					updateValue={(value) => {
// 						if (value >= 0) {
// 							updateFormat(propKey, "yAxisFormats", "roundingDigits", value);
// 						} else {
// 							updateFormat(propKey, "yAxisFormats", "roundingDigits", 0);
// 						}
// 					}}
// 					disabled={formatObject.enableRounding ? false : true}
// 				/>
// 				<span style={{ margin: "auto 0px" }}>decimal</span>
// 			</div>
// 		</React.Fragment>
// 	);
// };

// const mapStateToProps = (state) => {
// 	return {
// 		chartControl: state.chartControls,
// 		tabTileProps: state.tabTileProps,
// 	};
// };

// const mapDispatchToProps = (dispatch) => {
// 	return {
// 		updateFormat: (propKey, formatType, option, value) =>
// 			dispatch(updateFormatOption(propKey, formatType, option, value)),
// 	};
// };

// export default connect(mapStateToProps, mapDispatchToProps)(YAxisFormat);
import React from "react";

const YAxisFormat = () => {
	return <div>YAxisFormat</div>;
};

export default YAxisFormat;
