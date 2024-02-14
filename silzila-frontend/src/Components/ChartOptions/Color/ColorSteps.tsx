// Used for setting color scale in Gauge chart

import { TextField, Tooltip, Popover } from "@mui/material";
import { useState, useEffect } from "react";
import { connect } from "react-redux";

import { NotificationDialog } from "../../CommonFunctions/DialogComponents";
import { SelectListItem } from "../../CommonFunctions/SelectListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { SketchPicker } from "react-color";
import ChartColors from "./ChartColors";
import { ColorSchemes } from "./ColorScheme";
import "./ColorSteps.css";
import { Dispatch } from "redux";
import {
	addingNewStep,
	changingValuesofSteps,
	switchAutotoManualinSteps,
	updateGaugeAxisOptions,
} from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import { AlertColor } from "@mui/material/Alert";

const textFieldStyleProps = {
	style: {
		fontSize: "12px",
		backgroundColor: "white",
		height: "10px",
		color: "#404040",
		padding: "8px",
	},
};

interface ColorStepsActions {
	changingValuesofSteps: (propKey: string, value: any) => void;
	switchAutotoManualinSteps: (propKey: string, value: any) => void;
	addingNewStep: (propKey: string, index: number, value: any) => void;
	updateGaugeAxisOptions: (propKey: string, option: string, value: any) => void;
}

const ColorSteps = ({
	// state
	chartControls,
	tabTileProps,

	// dispatch
	addingNewStep,
	changingValuesofSteps,
	updateGaugeAxisOptions,
	switchAutotoManualinSteps,
}: ChartOptionsProps & ColorStepsActions) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [severity, setSeverity] = useState<AlertColor>("success");
	const [openAlert, setOpenAlert] = useState<boolean>(false);
	const [testMessage, setTestMessage] = useState<string>("Testing alert");

	const [colorPopoverOpen, setColorPopoverOpen] = useState<boolean>(false);
	const [selectedStepIndex, setSelectedStepIndex] = useState<string | number>("");

	const [colorsOfScheme, setColorsOfScheme] = useState<any>([]);

	let chartData = chartControls.properties[propKey].chartData
		? chartControls.properties[propKey].chartData
		: [];

	// TODO: Priority 1 - Color steps value keeps changing every time we come back to it
	// after clicking on other control tiles

	useEffect(() => {
		var col: any = [];
		ColorSchemes.forEach(el => {
			if (el.name === chartControls.properties[propKey].colorScheme) {
				setColorsOfScheme(el.colors);
				col.push(...el.colors);
			}
		});
		if (chartControls.properties[propKey].axisOptions.gaugeChartControls.isStepsAuto) {
			/* when theme change  'isColorAuto' prop of all steps set to 'ture' to show the colors of selected theme */
			const ArrayOfStepsWithSchemaColors = JSON.parse(
				JSON.stringify(
					chartControls.properties[propKey].axisOptions.gaugeChartControls.stepcolor
				)
			).map((element: any, index: number) => {
				var id = index >= col.length ? index % col.length : index;
				element.isColorAuto = true;
				element.color = col[id];
				return element;
			});

			changingValuesofSteps(propKey, ArrayOfStepsWithSchemaColors);
		}
	}, [chartControls.properties[propKey].colorScheme]);

	useEffect(() => {
		var newTempData: any = [];
		var total: number;
		if (chartData) {
			Object.keys(chartData[0]).forEach(key => {
				newTempData.push({
					name: key,
					value: chartData[0][key],
				});
			});
			if (chartControls.properties[propKey].axisOptions.gaugeChartControls.isStepsAuto) {
				total = newTempData[0].value * 2;
				const stepsWithValues = JSON.parse(
					JSON.stringify(
						chartControls.properties[propKey].axisOptions.gaugeChartControls.stepcolor
					)
				).map((el: any) => {
					el.value = Math.ceil((el.stepValue * total) / 100);
					return el;
				});
				changingValuesofSteps(propKey, stepsWithValues);
				updateGaugeAxisOptions(propKey, "max", total);
			}
		}
	}, [chartData]);

	/* function to remove existing steps and update the remining steps*/
	const removeStep = (index: number) => {
		switchAutotoManualinSteps(propKey, false);
		updateGaugeAxisOptions(propKey, "isMaxAuto", false);

		const reminingSteps = JSON.parse(
			JSON.stringify(
				chartControls.properties[propKey].axisOptions.gaugeChartControls.stepcolor
			)
		).filter((el: any, i: number) => {
			return i !== index;
		});
		var total: any = getTotal(reminingSteps);
		var maxTotalAndUpdatedArray: any = computeAndGetMaxValue(reminingSteps, total);

		changingValuesofSteps(propKey, maxTotalAndUpdatedArray.arrayWithUpdatedValueOfNewStep);
		updateGaugeAxisOptions(propKey, "max", maxTotalAndUpdatedArray.maxTotal);
	};

	/* changing value of existing step (edit)*/
	const changeStepValue = (value: any, index: number) => {
		switchAutotoManualinSteps(propKey, false);

		updateGaugeAxisOptions(propKey, "isMaxAuto", false);

		const stepWithChangedValue = JSON.parse(
			JSON.stringify(
				chartControls.properties[propKey].axisOptions.gaugeChartControls.stepcolor
			)
		).map((el: any, i: number) => {
			if (index === i) {
				el.value = parseInt(value);
			}
			return el;
		});

		var total = getTotal(stepWithChangedValue);
		var maxTotalAndUpdatedArray: any = computeAndGetMaxValue(stepWithChangedValue, total);

		changingValuesofSteps(propKey, maxTotalAndUpdatedArray.arrayWithUpdatedValueOfNewStep);
		updateGaugeAxisOptions(propKey, "max", maxTotalAndUpdatedArray.maxTotal);
	};

	/* adding newsteps */
	const addNewStep = (obj: any, idx: number) => {
		switchAutotoManualinSteps(propKey, false);

		updateGaugeAxisOptions(propKey, "isMaxAuto", false);
		addingNewStep(propKey, idx, obj);

		const newStepAddedArray = JSON.parse(
			JSON.stringify(
				chartControls.properties[propKey].axisOptions.gaugeChartControls.stepcolor
			)
		);

		newStepAddedArray.splice(idx, 0, obj);

		var total = getTotal(newStepAddedArray);

		var maxTotalAndUpdatedArray: any = computeAndGetMaxValue(newStepAddedArray, total);

		changingValuesofSteps(propKey, maxTotalAndUpdatedArray.arrayWithUpdatedValueOfNewStep);
		updateGaugeAxisOptions(propKey, "max", maxTotalAndUpdatedArray.maxTotal);
	};

	/* getting total value of all steps*/
	const getTotal = (stepsArray: any) => {
		let total: number = 0;
		stepsArray.forEach((el: any) => {
			total = total + parseInt(el.value);
		});
		return total;
	};

	const computeAndGetMaxValue = (stepsArray: any, total: any) => {
		var per = 0;
		var stepValue = 0;
		var i = 0;
		var maxTotalAndUpdatedArray = {};
		for (i = 0; i < stepsArray.length; i++) {
			per = per + stepsArray[i].value / total;
			stepValue = (stepsArray[i].value * 100) / total;
			maxTotalAndUpdatedArray = getMaxTotalAndUpdatedArray(
				per.toPrecision(1),
				stepValue,
				i,
				stepsArray
			);
		}
		return maxTotalAndUpdatedArray;
	};

	const getMaxTotalAndUpdatedArray = (
		per: any,
		stepValue: any,
		index: number,
		stepsArray: any
	) => {
		var maxTotal = 0;
		const arrayWithUpdatedValueOfNewStep = stepsArray.map((el: any, i: number) => {
			maxTotal = maxTotal + el.value;
			if (i === index) {
				el.per = per;
				el.stepValue = stepValue;
			}
			return el;
		});

		return { maxTotal, arrayWithUpdatedValueOfNewStep };
	};
	const getbgcolor = (index: number) => {
		var idx = index;

		var colorValue = "";
		if (idx >= colorsOfScheme.length) {
			var id2 = idx % colorsOfScheme.length;
			colorValue = colorsOfScheme[id2];
			return colorValue;
		} else {
			colorValue = colorsOfScheme[idx];

			return colorValue;
		}
	};

	return (
		<div className="colorStepsContainer">
			<div>
				<ChartColors />
			</div>

			<div className="optionDescription" style={{ marginTop: "10px" }}>
				STEPS:
			</div>
			<div className=" colorStepsList">
				{chartControls.properties[propKey].axisOptions.gaugeChartControls.stepcolor.map(
					(el: any, index: number) => {
						return (
							<SelectListItem
								key={index}
								render={(xprops: any) => (
									<div
										onMouseOver={() => xprops.setOpen(true)}
										onMouseLeave={() => xprops.setOpen(false)}
									>
										<div className="colorStepsInput">
											<TextField
												type="number"
												style={{ flex: 1, marginRight: "5px" }}
												onChange={e => {
													changeStepValue(e.target.value, index);
												}}
												value={el.value}
												inputProps={{ ...textFieldStyleProps }}
											/>

											<div
												className="colorIndicator"
												style={{
													backgroundColor: el.isColorAuto
														? getbgcolor(index)
														: el.color,
												}}
												onClick={() => {
													setSelectedStepIndex(index);
													setColorPopoverOpen(true);
												}}
											></div>
											<div>
												<div className="colorStepsAddDelete">
													{xprops.open ? (
														<>
															<div
																style={{
																	cursor: "pointer",
																	justifyContent: "center",
																}}
																onClick={e => {
																	var idx = index + 1;
																	var colorValue =
																		getbgcolor(idx);
																	var obj = {
																		stepValue: 1,
																		color: colorValue,
																		per: el.per,
																		isColorAuto: true,
																		value: 0,
																	};

																	addNewStep(obj, idx);
																}}
															>
																<Tooltip title="Add Below">
																	<AddIcon
																		sx={{
																			color: "#666",
																			height: "23px",
																			width: "23px",
																			padding: "1px",
																			marginRight: "4px",
																			"&:hover": {
																				backgroundColor:
																					"#d7d9db",
																				borderRadius: "2px",
																			},
																		}}
																	/>
																</Tooltip>
															</div>
															<div
																style={{
																	cursor: "pointer",
																	justifyContent: "center",
																}}
																onClick={() => {
																	/* deleting step */
																	if (
																		chartControls.properties[
																			propKey
																		].axisOptions
																			.gaugeChartControls
																			.stepcolor.length === 1
																	) {
																		setOpenAlert(true);
																		setSeverity("warning");
																		setTestMessage(
																			"atleast one step should be there"
																		);
																		setTimeout(() => {
																			setOpenAlert(false);
																			setTestMessage("");
																		}, 3000);
																	} else {
																		removeStep(index);
																	}
																}}
															>
																<Tooltip title="Delete">
																	<DeleteIcon
																		sx={{
																			color: "#666",
																			height: "23px",
																			width: "23px",
																			padding: "2px",
																			"&:hover": {
																				color: "red",
																				backgroundColor:
																					"#d7d9db",
																				borderRadius: "2px",
																			},
																		}}
																	/>
																</Tooltip>
															</div>
														</>
													) : null}
												</div>
											</div>
										</div>
									</div>
								)}
							/>
						);
					}
				)}
			</div>

			<NotificationDialog
				severity={severity}
				openAlert={openAlert}
				testMessage={testMessage}
				onCloseAlert={() => {
					setOpenAlert(false);
					setTestMessage("");
				}}
			/>

			<Popover
				open={colorPopoverOpen}
				onClose={() => setColorPopoverOpen(false)}
				onClick={() => setColorPopoverOpen(false)}
				// anchorEl={anchorEl}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						className="sketchPicker"
						width="16rem"
						// styles={{ padding: "0" }}
						onChangeComplete={color => {
							switchAutotoManualinSteps(propKey, false);

							const stepsWithUserSelectedColor = chartControls.properties[
								propKey
							].axisOptions.gaugeChartControls.stepcolor.map((element, index) => {
								if (index === selectedStepIndex) {
									element.color = color.hex;
									element.isColorAuto = false;
								}

								return element;
							});
							changingValuesofSteps(propKey, stepsWithUserSelectedColor);
						}}
						onChange={color => {
							switchAutotoManualinSteps(propKey, false);

							const stepsWithUserSelectedColor = chartControls.properties[
								propKey
							].axisOptions.gaugeChartControls.stepcolor.map((element, index) => {
								if (index === selectedStepIndex) {
									element.color = color.hex;
									element.isColorAuto = false;
								}

								return element;
							});
							changingValuesofSteps(propKey, stepsWithUserSelectedColor);
						}}
						disableAlpha
					/>
				</div>
			</Popover>
		</div>
	);
};

const mapStateToProps = (state: ChartOptionsStateProps, ownprops: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		changingValuesofSteps: (propKey: string, value: any) =>
			dispatch(changingValuesofSteps(propKey, value)),
		switchAutotoManualinSteps: (propKey: string, value: any) =>
			dispatch(switchAutotoManualinSteps(propKey, value)),
		addingNewStep: (propKey: string, index: number, value: any) =>
			dispatch(addingNewStep(propKey, index, value)),
		updateGaugeAxisOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateGaugeAxisOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorSteps);
