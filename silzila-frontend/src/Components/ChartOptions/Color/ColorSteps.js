// Used for setting color scale in Gauge chart

import { TextField, Tooltip, Popover } from "@mui/material";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
	addingNewStep,
	changingValuesofSteps,
	switchAutotoManualinSteps,
	updateGaugeAxisOptions,
} from "../../../redux/ChartProperties/actionsChartControls";
import { NotificationDialog } from "../../CommonFunctions/DialogComponents";
import { SelectListItem } from "../../CommonFunctions/SelectListItem";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { SketchPicker } from "react-color";
import ChartColors from "./ChartColors";
import { ColorSchemes } from "./ColorScheme";
import "./ColorSteps.css";
import { update } from "immutability-helper";

const textFieldStyleProps = {
	style: {
		fontSize: "12px",
		backgroundColor: "white",
		height: "10px",
		color: "#404040",
		padding: "8px",
	},
};

const ColorSteps = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	addingNewStep,
	changingValuesofSteps,
	updateGaugeAxisOptions,
	switchAutotoManualinSteps,
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const [severity, setSeverity] = useState("success");
	const [openAlert, setOpenAlert] = useState(false);
	const [testMessage, setTestMessage] = useState("Testing alert");

	const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
	const [selectedStepIndex, setSelectedStepIndex] = useState("");

	const [colorsOfScheme, setColorsOfScheme] = useState([]);

	let chartData = chartProp.properties[propKey].chartData
		? chartProp.properties[propKey].chartData.result
		: "";

	// TODO: Priority 1 - Color steps value keeps changing every time we come back to it
	// after clicking on other control tiles

	// console.log(chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor);

	useEffect(() => {
		var col = [];
		ColorSchemes.map((el) => {
			if (el.name === chartProp.properties[propKey].colorScheme) {
				setColorsOfScheme(el.colors);
				col.push(...el.colors);
				// console.log(el.colors);
			}
		});
		if (chartProp.properties[propKey].axisOptions.gaugeChartControls.isStepsAuto) {
			// when theme change  'isColorAuto' prop of all steps set to 'ture' to show the colors of selected theme

			const ArrayOfStepsWithSchemaColors = JSON.parse(
				JSON.stringify(
					chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor
				)
			).map((element, index) => {
				var id = index >= col.length ? index % col.length : index;
				element.isColorAuto = true;
				element.color = col[id];
				return element;
			});

			changingValuesofSteps(propKey, ArrayOfStepsWithSchemaColors);
		}
	}, [chartProp.properties[propKey].colorScheme]);

	useEffect(() => {
		var newTempData = [];
		var total = "";
		if (chartData) {
			Object.keys(chartData[0]).map((key) => {
				newTempData.push({
					name: key,
					value: chartData[0][key],
				});
			});
			if (chartProp.properties[propKey].axisOptions.gaugeChartControls.isStepsAuto) {
				total = newTempData[0].value * 2;
				const stepsWithValues = JSON.parse(
					JSON.stringify(
						chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor
					)
				).map((el) => {
					el.value = Math.ceil((el.stepValue * total) / 100);
					return el;
				});
				changingValuesofSteps(propKey, stepsWithValues);
				updateGaugeAxisOptions(propKey, "max", total);
			}
		}
	}, [chartData]);

	// function to remove existing steps
	const removeStep = (index) => {
		switchAutotoManualinSteps(propKey, false);

		updateGaugeAxisOptions(propKey, "isMaxAuto", false);

		const reminingSteps = JSON.parse(
			JSON.stringify(chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor)
		).filter((el, i) => {
			return i !== index;
		});
		var total = getTotal(reminingSteps);
		var maxTotalAndUpdatedArray = computeAndGetMaxValue(reminingSteps, total);

		changingValuesofSteps(propKey, maxTotalAndUpdatedArray.arrayWithUpdatedValueOfNewStep);
		updateGaugeAxisOptions(propKey, "max", maxTotalAndUpdatedArray.maxTotal);
	};

	// changing value of existing step (edit)
	const changeStepValue = (value, index) => {
		switchAutotoManualinSteps(propKey, false);

		updateGaugeAxisOptions(propKey, "isMaxAuto", false);

		const stepWithChangedValue = JSON.parse(
			JSON.stringify(chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor)
		).map((el, i) => {
			if (index === i) {
				el.value = parseInt(value);
			}
			return el;
		});

		var total = getTotal(stepWithChangedValue);
		var maxTotalAndUpdatedArray = computeAndGetMaxValue(stepWithChangedValue, total);

		changingValuesofSteps(propKey, maxTotalAndUpdatedArray.arrayWithUpdatedValueOfNewStep);
		updateGaugeAxisOptions(propKey, "max", maxTotalAndUpdatedArray.maxTotal);
	};

	const addNewStep = (obj, idx) => {
		// console.log(obj.color);
		switchAutotoManualinSteps(propKey, false);

		updateGaugeAxisOptions(propKey, "isMaxAuto", false);
		addingNewStep(propKey, idx, obj);

		const newStepAddedArray = JSON.parse(
			JSON.stringify(chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor)
		);

		newStepAddedArray.splice(idx, 0, obj);
		// // console.log(newStepAddedArray);

		var total = getTotal(newStepAddedArray);

		var maxTotalAndUpdatedArray = computeAndGetMaxValue(newStepAddedArray, total);

		changingValuesofSteps(propKey, maxTotalAndUpdatedArray.arrayWithUpdatedValueOfNewStep);
		updateGaugeAxisOptions(propKey, "max", maxTotalAndUpdatedArray.maxTotal);
	};

	const getTotal = (stepsArray) => {
		let total = 0;
		stepsArray.map((el) => {
			total = parseInt(total) + parseInt(el.value);
		});
		return total;
	};

	const computeAndGetMaxValue = (stepsArray, total) => {
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

	const getMaxTotalAndUpdatedArray = (per, stepValue, index, stepsArray) => {
		var maxTotal = 0;
		const arrayWithUpdatedValueOfNewStep = stepsArray.map((el, i) => {
			maxTotal = maxTotal + el.value;
			// console.log(maxTotal);
			if (i === index) {
				el.per = per;
				el.stepValue = stepValue;
			}
			return el;
		});

		return { maxTotal, arrayWithUpdatedValueOfNewStep };
	};
	const getbgcolor = (index) => {
		var idx = index;
		// console.log(colorsOfScheme.length, idx);
		// console.log(idx % colorsOfScheme.length);
		var colorValue = "";
		// console.log(colorsOfScheme);
		if (idx >= colorsOfScheme.length) {
			var id2 = idx % colorsOfScheme.length;
			// console.log(id2);
			colorValue = colorsOfScheme[id2];
			// console.log(colorValue);
			return colorValue;
		} else {
			colorValue = colorsOfScheme[idx];
			// console.log(colorValue);

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
				{chartProp.properties[propKey].axisOptions.gaugeChartControls.stepcolor.map(
					(el, index) => {
						return (
							<SelectListItem
								key={index}
								render={(xprops) => (
									<div
										onMouseOver={() => xprops.setOpen(true)}
										onMouseLeave={() => xprops.setOpen(false)}
									>
										<div className="colorStepsInput">
											<TextField
												type="number"
												style={{ flex: 1, marginRight: "5px" }}
												onChange={(e) => {
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
												onClick={(el) => {
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
																onClick={(e) => {
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
																	// console.log(obj);

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
																	// console.log("removing steps");
																	if (
																		chartProp.properties[
																			propKey
																		].axisOptions
																			.gaugeChartControls
																			.stepcolor.length === 1
																	) {
																		// console.log(
																		// 	"cant remove step"
																		// );
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
						// color={selectedStepColor}
						className="sketchPicker"
						width="16rem"
						styles={{ padding: "0" }}
						onChangeComplete={(color) => {
							switchAutotoManualinSteps(propKey, false);

							const stepsWithUserSelectedColor = chartProp.properties[
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
						onChange={(color) => {
							switchAutotoManualinSteps(propKey, false);

							const stepsWithUserSelectedColor = chartProp.properties[
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

const mapStateToProps = (state) => {
	return {
		chartProp: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		changingValuesofSteps: (propKey, value) => dispatch(changingValuesofSteps(propKey, value)),
		switchAutotoManualinSteps: (propKey, value) =>
			dispatch(switchAutotoManualinSteps(propKey, value)),
		addingNewStep: (propKey, index, value) => dispatch(addingNewStep(propKey, index, value)),
		updateGaugeAxisOptions: (propKey, option, value) =>
			dispatch(updateGaugeAxisOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorSteps);
