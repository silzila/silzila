import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import InputSymbol from "../CommonFunctions/InputSymbol";
import InputPositiveNumber from "../CommonFunctions/InputPositiveNumber";
import { Dispatch } from "redux";
import {
	ChartConLabelFormates,
	ChartControl,
	ChartControlStateProps,
} from "../../../redux/ChartPoperties/ChartControlsInterface";
import {
	TabTileStateProps,
	TabTileStateProps2,
} from "../../../redux/TabTile/TabTilePropsInterfaces";
import {
	ChartPropertiesStateProps,
	ChartPropProperties,
} from "../../../redux/ChartPoperties/ChartPropertiesInterfaces";
import { updateFormatOption } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ArrayWithValueAndType } from "../CommonInterfaces";

interface LabelFormattingProps {
	chartProperty: ChartPropProperties;
	tabTileProps: TabTileStateProps;
	chartControl: ChartControl;

	updateFormat: (propKey: string | number, formatType: any, option: string, value: any) => void;
}

const LabelFormatting = ({
	// state
	chartProperty,
	tabTileProps,
	chartControl,

	// dispatch
	updateFormat,
}: LabelFormattingProps) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	let formatObject: ChartConLabelFormates =
		chartControl.properties[propKey].formatOptions.labelFormats;

	const formatOptions: ArrayWithValueAndType[] = [
		{ type: "Number", value: "Number" },
		{ type: "Currency", value: "Currency" },
		{ type: "Percent", value: "Percent" },
	];

	const [measuresList, setMeasuresList] = useState<any[]>([]);

	useEffect(() => {
		var chartAxes = chartProperty[propKey].chartAxes;
		var measures: any = [];

		switch (chartProperty[propKey].chartType) {
			case "multibar":
			case "stackedBar":
			case "line":
			case "area":
			case "pie":
			case "donut":
				measures = chartAxes[2].fields;
				break;

			case "scatterPlot":
				measures = chartAxes[2].fields;
				measures = measures.concat(chartAxes[3].fields);
				break;

			case "gauge":
			case "funnel":
				measures = chartAxes[1].fields;
				break;

			case "heatmap":
				measures = chartAxes[3].fields;
				break;
		}

		setMeasuresList(measures);
	}, [chartProperty]);

	const renderFormatOptions = () => {
		return formatOptions.map((item: ArrayWithValueAndType) => {
			return (
				<div
					key={item.value}
					className={
						item.value === formatObject.formatValue
							? "radioButtonSelected"
							: "radioButton"
					}
					onClick={() => {
						updateFormat(propKey, "labelFormats", "formatValue", item.value);
					}}
				>
					{item.type}
				</div>
			);
		});
	};

	const separatorOptions: ArrayWithValueAndType[] = [
		{ type: "None", value: "None" },
		{ type: "Comma", value: "Comma" },
		{ type: "Abbrev", value: "Abbrev" },
	];

	const renderSeparatorOptions = () => {
		return separatorOptions.map((item: ArrayWithValueAndType) => {
			return (
				<div
					key={item.value}
					className={
						item.value === formatObject.numberSeparator
							? "radioButtonSelected"
							: "radioButton"
					}
					onClick={() => {
						updateFormat(propKey, "labelFormats", "numberSeparator", item.value);
					}}
				>
					{item.type}
				</div>
			);
		});
	};

	return (
		<React.Fragment>
			<div className="optionDescription">FORMAT VALUE</div>
			<div className="radioButtons" style={{ padding: "0", margin: "auto" }}>
				{renderFormatOptions()}
			</div>
			{formatObject.formatValue === "Currency" ? (
				<>
					<div className="optionDescription" style={{ marginTop: "0.5rem" }}>
						<span style={{ margin: "auto" }}>Curency Symbol</span>
						<InputSymbol
							value={formatObject.currencySymbol}
							updateValue={(value: any) =>
								updateFormat(propKey, "labelFormats", "currencySymbol", value)
							}
						/>
					</div>
				</>
			) : null}

			<div style={{ borderTop: "1px solid rgb(211,211,211)", margin: "1rem 6% 1rem" }}></div>
			{chartProperty[propKey].chartType === "crossTab" ? (
				<div className="optionDescription">FORMAT</div>
			) : (
				<div className="optionDescription">LABEL FORMAT</div>
			)}

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
							"labelFormats",
							"enableRounding",
							!formatObject.enableRounding
						);
					}}
				/>
				<InputPositiveNumber
					value={formatObject.roundingDigits}
					updateValue={(value: number) => {
						if (value >= 0) {
							updateFormat(propKey, "labelFormats", "roundingDigits", value);
						} else {
							updateFormat(propKey, "labelFormats", "roundingDigits", 0);
						}
					}}
					disabled={formatObject.enableRounding ? false : true}
				/>
				<span style={{ margin: "auto 0px" }}>decimal</span>
			</div>
		</React.Fragment>
	);
};

const mapStateToProps = (
	state: ChartControlStateProps & TabTileStateProps2 & ChartPropertiesStateProps
) => {
	return {
		chartControl: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProperty: state.chartProperties.properties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateFormat: (propKey: string | number, formatType: any, option: string, value: any) =>
			dispatch(updateFormatOption(propKey, formatType, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelFormatting);
