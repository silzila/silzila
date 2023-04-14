import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateFormatOption } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartConXAxisFormats } from "../../../redux/ChartPoperties/ChartControlsInterface";
import InputPositiveNumber from "../CommonFunctions/InputPositiveNumber";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";

const XAxisFormat = ({
	// state
	tabTileProps,
	chartControls,

	// dispatch
	updateFormat,
}: ChartOptionsProps & {
	updateFormat: (propKey: string, formatType: string | any, option: string, value: any) => void;
}) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	let formatObject: ChartConXAxisFormats =
		chartControls.properties[propKey].formatOptions.xAxisFormats;

	const separatorOptions: any[] = [
		{ type: "None", value: "None" },
		{ type: "Comma", value: "Comma" },
		{ type: "Abbrev", value: "Abbrev" },
	];

	const renderSeparatorOptions = () => {
		return separatorOptions.map(item => {
			return (
				<div
					key={item.value}
					className={
						item.value === formatObject.numberSeparator
							? "radioButtonSelected"
							: "radioButton"
					}
					// value={formatObject.numberSeparator}
					onClick={() => {
						updateFormat(propKey, "xAxisFormats", "numberSeparator", item.value);
					}}
				>
					{item.type}
				</div>
			);
		});
	};

	return (
		<React.Fragment>
			<div className="optionDescription">X-AXIS MEASURE FORMAT</div>

			<div className="optionDescription">
				<label htmlFor="enableDisable" className="enableDisableLabel">
					Separator
				</label>
			</div>
			<div className="radioButtons" style={{ padding: "0", margin: "auto auto 0.5rem" }}>
				{renderSeparatorOptions()}
			</div>
			<div className="optionDescription">
				<label htmlFor="enableDisable" className="enableDisableLabel">
					Round Off
				</label>
			</div>
			<div className="optionDescription">
				<input
					type="checkbox"
					id="enableDisable"
					checked={formatObject.enableRounding}
					onChange={() => {
						updateFormat(
							propKey,
							"xAxisFormats",
							"enableRounding",
							!formatObject.enableRounding
						);
					}}
				/>
				<InputPositiveNumber
					value={formatObject.roundingDigits}
					updateValue={(value: number) => {
						if (value >= 0) {
							updateFormat(propKey, "xAxisFormats", "roundingDigits", value);
						} else {
							updateFormat(propKey, "xAxisFormats", "roundingDigits", 0);
						}
					}}
					disabled={formatObject.enableRounding ? false : true}
				/>
				<span style={{ margin: "auto 0px" }}>decimal</span>
			</div>
		</React.Fragment>
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
		updateFormat: (propKey: string, formatType: string | any, option: string, value: any) =>
			dispatch(updateFormatOption(propKey, formatType, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(XAxisFormat);
