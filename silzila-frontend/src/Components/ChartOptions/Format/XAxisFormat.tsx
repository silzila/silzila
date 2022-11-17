// import React from "react";
// import { connect } from "react-redux";
// import { updateFormatOption } from "../../../redux/ChartProperties/actionsChartControls";
// import InputPositiveNumber from "../CommonFunctions/InputPositiveNumber";

// const XAxisFormat = ({
// 	// props
// 	chartType,

// 	// state
// 	tabTileProps,
// 	chartControl,

// 	// dispatch
// 	updateFormat,
// }) => {
// 	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
// 	let formatObject = chartControl.properties[propKey].formatOptions.xAxisFormats;

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
// 						// console.log(item.value);
// 						updateFormat(propKey, "xAxisFormats", "numberSeparator", item.value);
// 					}}
// 				>
// 					{item.type}
// 				</div>
// 			);
// 		});
// 	};

// 	return (
// 		<React.Fragment>
// 			<div className="optionDescription">X-AXIS MEASURE FORMAT</div>

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
// 							"xAxisFormats",
// 							"enableRounding",
// 							!formatObject.enableRounding
// 						);
// 					}}
// 				/>
// 				<InputPositiveNumber
// 					value={formatObject.roundingDigits}
// 					updateValue={(value) => {
// 						if (value >= 0) {
// 							updateFormat(propKey, "xAxisFormats", "roundingDigits", value);
// 						} else {
// 							updateFormat(propKey, "xAxisFormats", "roundingDigits", 0);
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

// export default connect(mapStateToProps, mapDispatchToProps)(XAxisFormat);
import React from "react";

const XAxisFormat = () => {
	return <div>XAxisFormat</div>;
};

export default XAxisFormat;
