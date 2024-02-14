import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import InputSymbol from "../CommonFunctions/InputSymbol";
import InputPositiveNumber from "../CommonFunctions/InputPositiveNumber";
import { Dispatch } from "redux";
import { ChartConLabelFormates } from "../../../redux/ChartPoperties/ChartControlsInterface";
import { updateFormatOption } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import { updateFormatForDm } from "../../../redux/DynamicMeasures/DynamicMeasuresActions";
import Logger from "../../../Logger";

const LabelFormatting = ({
	// state
	chartProperties,
	tabTileProps,
	chartControls,
	dynamicMeasureState,

	// dispatch
	updateFormat,
	updateFormatForDm,
}: ChartOptionsProps &
	any & {
		updateFormat: (propKey: string, formatType: any, option: string, value: any) => void;
	}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var chartType = chartProperties.properties[propKey].chartType;
	var dmKey = `${dynamicMeasureState.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`;
	let formatObject: ChartConLabelFormates | any =
		chartType === "richText"
			? dynamicMeasureState.dynamicMeasureProps?.[`${dynamicMeasureState.selectedTabId}`]?.[
					`${dynamicMeasureState.selectedTileId}`
			  ]?.[dmKey]?.formatOptions.labelFormats
			: chartControls.properties[propKey].formatOptions.labelFormats;
	const formatOptions: any[] = [
		{ type: "Number", value: "Number" },
		{ type: "Currency", value: "Currency" },
		{ type: "Percent", value: "Percent" },
	];

	const [measuresList, setMeasuresList] = useState<any[]>([]);

	useEffect(() => {
		var chartAxes = chartProperties.properties[propKey].chartAxes;
		var measures: any = [];

		switch (chartProperties.properties[propKey].chartType) {
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
			case "simplecard":
			case "richText":
				measures = chartAxes[1].fields;
				break;

			case "heatmap":
				measures = chartAxes[3].fields;
				break;
		}

		setMeasuresList(measures);
	}, [chartProperties]);

	const handleUpdateFormat = (option: string, value: any, optionKey?: string) => {
		if (chartType === "richText") {
			updateFormatForDm(dmKey, option, value);
		} else {
			updateFormat(propKey, optionKey, option, value);
		}
	};

	const renderFormatOptions = () => {
		return formatOptions.map((item: any) => {
			return (
				<div
					key={item.value}
					className={
						item.value === formatObject.formatValue
							? "radioButtonSelected"
							: "radioButton"
					}
					onClick={() => {
						Logger("info", "sdfsdf");
						handleUpdateFormat("formatValue", item.value, "labelFormats");
					}}
				>
					{item.type}
				</div>
			);
		});
	};

	const separatorOptions: any[] = [
		{ type: "None", value: "None" },
		{ type: "Comma", value: "Comma" },
		{ type: "Abbrev", value: "Abbrev" },
	];

	const renderSeparatorOptions = () => {
		return separatorOptions.map((item: any) => {
			return (
				<div
					key={item.value}
					className={
						item.value === formatObject.numberSeparator
							? "radioButtonSelected"
							: "radioButton"
					}
					onClick={() => {
						handleUpdateFormat("numberSeparator", item.value, "labelFormats");
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
								handleUpdateFormat("currencySymbol", value, "labelFormats")
							}
						/>
					</div>
				</>
			) : null}

			<div style={{ borderTop: "1px solid rgb(211,211,211)", margin: "1rem 6% 1rem" }}></div>
			{chartProperties.properties[propKey].chartType === "crossTab" ||
			chartProperties.properties[propKey].chartType === "richText" ? (
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
						handleUpdateFormat(
							"enableRounding",
							!formatObject.enableRounding,
							"labelFormats"
						);
					}}
				/>
				<InputPositiveNumber
					value={formatObject.roundingDigits}
					updateValue={(value: number) => {
						if (value >= 0) {
							handleUpdateFormat("roundingDigits", value, "labelFormats");
						} else {
							handleUpdateFormat("roundingDigits", 0, "labelFormats");
						}
					}}
					disabled={formatObject.enableRounding ? false : true}
				/>
				<span style={{ margin: "auto 0px" }}>decimal</span>
			</div>
		</React.Fragment>
	);
};

const mapStateToProps = (state: ChartOptionsStateProps & any, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProperties: state.chartProperties,
		dynamicMeasureState: state.dynamicMeasuresState,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateFormat: (propKey: string, formatType: any, option: string, value: any) =>
			dispatch(updateFormatOption(propKey, formatType, option, value)),
		updateFormatForDm: (dmKey: string, option: string, value: any) =>
			dispatch(updateFormatForDm(dmKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelFormatting);
