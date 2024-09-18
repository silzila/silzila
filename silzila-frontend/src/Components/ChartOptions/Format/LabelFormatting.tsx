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
import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { format } from "path";

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
	const [selectedMeasure, setSelectedMeasure] = useState<any>("");

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
						item.value === formatObject?.measureFormats[formatObject.selectedMeasure]?.formatValue
							? "radioButtonSelected"
							: "radioButton"
					}
					onClick={() => {

						handleUpdateFormat("measureFormats", {
							...(formatObject.measureFormats),
							[formatObject.selectedMeasure]: {
								...(formatObject.measureFormats[formatObject.selectedMeasure]),
								formatValue: item.value,
							}
						}, "labelFormats")
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
						item.value === formatObject?.measureFormats[formatObject.selectedMeasure]?.numberSeparator
							? "radioButtonSelected"
							: "radioButton"
					}
					onClick={() => {
						handleUpdateFormat("measureFormats", {
							...(formatObject.measureFormats),
							[formatObject.selectedMeasure]: {
								...(formatObject.measureFormats[formatObject.selectedMeasure]),
								numberSeparator: item.value,
							}
						}, "labelFormats")
					}}
				>
					{item.type}
				</div>
			);
		});
	};

	const handleChartMeasuresSelectChange = (event: any) => {
		console.log(chartControls.properties[propKey].formatOptions.labelFormats.measureFormats);

		setSelectedMeasure(event.target.value);
		handleUpdateFormat("selectedMeasure", event.target.value.displayname, "labelFormats");

		if (!formatObject.measureFormats[event.target.value.displayname]) {
			handleUpdateFormat("measureFormats", {
				...(chartControls.properties[propKey].formatOptions.labelFormats.measureFormats),
				[event.target.value.displayname]: {
					formatValue: 'Number',
					currencySymbol: '₹',
					enableRounding: true,
					roundingDigits: 1,
					numberSeparator: 'Abbrev',
				}
			}, "labelFormats")
		}
	};

	return (
		<React.Fragment>


			{
				chartControls.properties[propKey].sortedValue ? null : <div className="optionDescription">MEASURES</div>
			}

			<FormControl fullWidth sx={{ margin: "0 10px 0 10px" }}>
				<Select sx={{
					width: "95.5%", height: "26px", fontSize: "13px", '&.MuiOutlinedInput-root': {
						'& fieldset': {
							border: '1px solid rgb(211, 211, 211)', // Change the border color here
						},
						'&:hover fieldset': {
							border: '1px solid #2bb9bb', // Change the hover border color here
						},
						'&.Mui-focused fieldset': {
							border: '1px solid #2bb9bb', // Change the focused border color here
						},
						'&.Mui-focused svg': {
							color: '#2bb9bb', // Change the arrow color when focused
						},
					},
				}}
					onChange={handleChartMeasuresSelectChange}
					value={selectedMeasure}>
					{

						// crosstab has 3 axes, Table has 2
						chartProperties.properties[propKey].chartAxes[chartProperties.properties[propKey].chartType === "crossTab" ? 3 : 2].fields.map((item: any, index: number) => {
							return (
								<MenuItem
									key={index}
									value={item}
									sx={{ color: "black", fontSize: "13px", "&:hover": { backgroundColor: "rgb(238, 238, 238)" }, }}>
									{item.displayname}
								</MenuItem>
							);
						})
					}
				</Select>

			</FormControl>
			<div className="optionDescription">FORMAT VALUE</div>
			<div className="radioButtons" style={{ padding: "0", margin: "auto auto 10px auto" }}>
				{renderFormatOptions()}
			</div>
			{formatObject.measureFormats[formatObject.selectedMeasure]?.formatValue === "Currency" ? (
				<>
					<div className="optionDescription" style={{ marginTop: "0.5rem" }}>
						<span style={{ margin: "auto" }}>Curency Symbol</span>
						<InputSymbol
							value={formatObject.currencySymbol}
							updateValue={(value: any) =>
								handleUpdateFormat("measureFormats", {
									...(formatObject.measureFormats),
									[formatObject.selectedMeasure]: {
										...(formatObject.measureFormats[formatObject.selectedMeasure]),
										currencySymbol: value,
									}
								}, "labelFormats")
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
					checked={formatObject?.measureFormats[formatObject.selectedMeasure]?.enableRounding ? true : false}
					onChange={() => {
						handleUpdateFormat(
							"measureFormats",
							{
								...(formatObject.measureFormats),
								[formatObject.selectedMeasure]: {
									...(formatObject.measureFormats[formatObject.selectedMeasure]),
									enableRounding: !formatObject.measureFormats[formatObject.selectedMeasure].enableRounding,
								}
							},
							"labelFormats"
						);
					}}
				/>
				<InputPositiveNumber
					value={formatObject.measureFormats[formatObject.selectedMeasure]?.roundingDigits ? formatObject.measureFormats[formatObject.selectedMeasure].roundingDigits : 1}
					updateValue={(value: number) => {
						if (value >= 0) {
							handleUpdateFormat("measureFormats", {
								...(formatObject.measureFormats),
								[formatObject.selectedMeasure]: {
									...(formatObject.measureFormats[formatObject.selectedMeasure]),
									roundingDigits: value,
								}
							}, "labelFormats")
						} else {
							handleUpdateFormat('measureFormats', {
								...(formatObject.measureFormats),
								[formatObject.selectedMeasure]: {
									...(formatObject.measureFormats[formatObject.selectedMeasure]),
									roundingDigits: 0,
								}
							}, "labelFormats")
						}
					}}
					disabled={formatObject?.measureFormats[formatObject.selectedMeasure]?.enableRounding ? false : true}
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
