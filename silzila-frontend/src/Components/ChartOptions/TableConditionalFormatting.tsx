import { Button, Popover } from "@mui/material";
import "./ConditionalFormatting.css";
import React, { Dispatch, useState } from "react";
import { connect } from "react-redux";
import {
	addTableConditionalFormats,
	addTableLabel,
	deleteTablecf,
	updateRuleObjectOptions,
	updatecfObjectOptions,
	updatecfObjectOptions1,
} from "../../redux/ChartPoperties/ChartControlsActions";
import ShortUniqueId from "short-unique-id";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
	CondtionComponent,
	CustomFontAndBgColor,
	StyleButtons,
} from "./DynamicMeasureConditionalFormating";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";

const TableConditionalFormatting = ({
	chartControls,
	tabTileProps,
	chartProperties,
	addTableConditionalFormats,
	updatecfObjectOptions,
	deleteTablecf,
	updateRuleObjectOptions,
	addTableLabel,
	updatecfObjectOptions1,
}: any) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var uId = new ShortUniqueId({ length: 8 });

	// tableConditionalFormats;

	const [openPopover, setOpenPopover] = useState(false);
	const [anchorEl, setAnchorEl] = useState<any>();
	const [optionAnchorEl, setOptionAnchorEl] = useState<any>();
	const [openOptionPopover, setOpenOptionPopover] = useState<boolean>(false);
	const [selectedColumnName, setSelectedColumnName] = useState<string>("");
	const [gradientValue, setGradientValue] = useState<any>(null);
	const [gradientMinAndMax, setGradientMinAndMax] = useState<any>({
		min: 0,
		max: 0,
	});

	const onUpdateConditionRule = (columnName: string, id: string, action: string) => {
		/* finding  conditional format obj */
		const matchedObj = chartControls.properties[propKey].tableConditionalFormats.filter(
			(column: any) => {
				return column.name === columnName;
			}
		);

		/* if action if delete*/
		const valuesOnDelete = matchedObj[0].value.filter((el: any) => {
			return el.id !== id;
		});

		/* updating values in the values(table data) of selected conditional Format obj */
		// const matchedValues = matchedObj[0].value.map((el: any) => {
		// 	if (el.colValue === valueName) {
		// 		console.log("matched", el.colValue, valueName, optionName, el[optionName]);
		// 		el[optionName] = value;
		// 		console.log(el);
		// 	}
		// 	return el;
		// });

		/* assigning updated values array to corresponding conditional format obj on tableConditionalFormats Array*/
		const updatedValues = chartControls.properties[propKey].tableConditionalFormats.map(
			(column: any) => {
				if (column.name === columnName) {
					if (action === "delete") {
						column.value = valuesOnDelete;
					}
				}
				return column;
			}
		);

		/* sending updatedValues as payload to update state*/
		updatecfObjectOptions1(propKey, updatedValues);
	};
	const onUpdateRule = (updatedArray: any, columnName: string) => {
		const updatedValues = chartControls.properties[propKey].tableConditionalFormats.map(
			(column: any) => {
				if (column.name === columnName) {
					column.value = updatedArray;
				}
				return column;
			}
		);

		/* sending updatedValues as payload to update state*/
		updatecfObjectOptions1(propKey, updatedValues);
	};

	console.log(chartProperties.properties[propKey].chartAxes);

	/* when the selected column is from dimension, getLabelValues will be called,
    this will return all the values of selected column with its properties*/
	const getLabelValues = (columnName: string) => {
		const values = chartControls.properties[propKey].chartData.map((item: any) => {
			return {
				colValue: item[columnName],
				backgroundColor: "white",
				isBold: false,
				isItalic: false,
				isUnderlined: false,
				fontColor: "black",
			};
		});

		return values;
	};

	const getMinAndMaxValue = (column: string) => {
		const valuesArray = chartControls.properties[propKey].chartData.map((el: any) => {
			return el[column];
		});
		const minValue = Math.min(...valuesArray);
		const maxValue = Math.max(...valuesArray);
		setGradientMinAndMax({ min: minValue, max: maxValue });
		return { min: minValue, max: maxValue };
	};

	const onSelectOption = (option: string) => {
		if (option === "rule") {
			addTableConditionalFormats(propKey, {
				id: uId(),
				isLabel: false,
				isGradient: false,
				name: selectedColumnName,
				isCollapsed: false,
				value: [],
			});
		}
		if (option === "gradient") {
			console.log(chartControls);
			addTableConditionalFormats(propKey, {
				id: uId(),
				isLabel: false,
				isGradient: true,
				name: selectedColumnName,
				isCollapsed: false,
				value: [
					{
						id: uId(),
						forNull: true,
						name: "Null",
						value: "null",
						isBold: false,
						isItalic: false,
						isUnderlined: false,
						backgroundColor: "white",
						fontColor: "black",
					},
					{
						id: uId(),
						forNull: false,
						name: "Min",
						value: getMinAndMaxValue(selectedColumnName).min,
						isBold: false,
						isItalic: false,
						isUnderlined: false,
						backgroundColor: "white",
						fontColor: "black",
					},

					{
						id: uId(),
						forNull: false,
						name: "Max",
						value: getMinAndMaxValue(selectedColumnName).max,
						isBold: false,
						isItalic: false,
						isUnderlined: false,
						backgroundColor: "white",
						fontColor: "black",
					},
				],
			});
		}
	};

	/* when user select any column this function will be called, this function will check the column is available in chartaxes's dimension array.
	if the column is available then add obj with properties in TableConditionalFormatArray else (selected column is in measure) 
	populate the other popover to let the user to select condition option for the column of measure*/
	const onSelectColumn = (columnName: string) => {
		var canAdd = false;
		if (chartControls.properties[propKey].tableConditionalFormats.length === 0) {
			canAdd = true;
		} else {
			var columnAlreadyExist = chartControls.properties[
				propKey
			].tableConditionalFormats.filter((item: any) => item.name === columnName)[0];
			if (!columnAlreadyExist) {
				canAdd = true;
			}
		}
		if (canAdd) {
			var isLabel = false;
			chartProperties.properties[propKey].chartAxes[1].fields.map((column: any) => {
				if (columnName === column.fieldname) {
					isLabel = true;

					addTableConditionalFormats(propKey, {
						isLabel: true,
						name: columnName,
						value: getLabelValues(columnName),
						isCollapsed: false,
					});

					setOpenPopover(false);
				}
			});
			if (!isLabel) {
				setOpenOptionPopover(true);
			}
		}
	};

	const onLabelStyleChange = (
		optionName: string,
		value: any,
		valueName: string,
		columnName: string
	) => {
		console.log(valueName);
		/* finding  conditional format obj */
		const matchedObj = chartControls.properties[propKey].tableConditionalFormats.filter(
			(column: any) => {
				return column.name === columnName;
			}
		);

		/* updating values in the values(table data) of selected conditional Format obj */
		const matchedValue = matchedObj[0].value.map((el: any) => {
			if (el.colValue === valueName) {
				console.log("matched", el.colValue, valueName, optionName, el[optionName]);
				el[optionName] = value;
				console.log(el);
			}
			return el;
		});

		console.log(matchedObj);
		/* assigning updated values array to corresponding conditional format obj on tableConditionalFormats Array*/
		const updatedValues = chartControls.properties[propKey].tableConditionalFormats.map(
			(column: any) => {
				if (column.name === columnName) {
					column.value = matchedValue;
				}
				return column;
			}
		);

		/* sending updatedValues as payload to update state*/
		updatecfObjectOptions1(propKey, updatedValues);
	};

	const onGradientStyleChange = (
		optionName: string,
		value: any,
		id: string,
		columnName: string
	) => {
		/* finding  conditional format obj */
		const matchedObj = chartControls.properties[propKey].tableConditionalFormats.filter(
			(column: any) => {
				return column.name === columnName;
			}
		);

		/* updating values in the values(table data) of selected conditional Format obj */
		const matchedValue = matchedObj[0].value.map((el: any) => {
			if (el.id === id) {
				el[optionName] = value;
			}
			return el;
		});

		console.log(matchedObj);
		/* assigning updated values array to corresponding conditional format obj on tableConditionalFormats Array*/
		const updatedValues = chartControls.properties[propKey].tableConditionalFormats.map(
			(column: any) => {
				if (column.name === columnName) {
					column.value = matchedValue;
				}
				return column;
			}
		);

		/* sending updatedValues as payload to update state*/
		updatecfObjectOptions1(propKey, updatedValues);
	};

	const LabelStyleOptions = ({ format, index }: any) => {
		return (
			<>
				{format.value.map((el: any) => {
					return (
						<div
							key={el.id}
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "15px",
								paddingBottom: "2px",
								borderBottom: "2px solid rgba(224,224,224,1)",
								marginBottom: "4px",
							}}
						>
							<span
								style={{
									borderBottom: "2px dashed rgba(224,224,224,1)",
									paddingBottom: "4px",
								}}
							>
								<StarPurple500Icon sx={{ fontSize: "10px", marginRight: "2px	" }} />
								{el.colValue}
							</span>
							<StyleButtons
								isBold={el.isBold}
								isItalic={el.isItalic}
								isUnderlined={el.isUnderlined}
								onChangeStyleProps={(option: string, value: any) => {
									onLabelStyleChange(option, value, el.colValue, format.name);
								}}
							/>

							<CustomFontAndBgColor
								id={el.colValue}
								backgroundColor={el.backgroundColor}
								onChangeColorProps={(
									option: string,
									value: any,
									columnValue: string
								) => {
									onLabelStyleChange(option, value, columnValue, format.name);
								}}
								fontColor={el.fontColor}
							/>
						</div>
					);
				})}
			</>
		);
	};

	const onChangeGradientValue = (e: any) => {
		e.preventdefault();
		console.log(e.target.value);
		if (e.target.value < gradientMinAndMax.max && e.target.value > gradientMinAndMax.min) {
			setGradientValue(e.target.value);
		}
	};

	const onAddCustomValues = (format: any) => {
		var obj = {
			id: uId(),
			forNull: false,
			name: `Value ${uId()}`,
			value: gradientValue,
			isBold: false,
			isItalic: false,
			isUnderlined: false,
			backgroundColor: "white",
			fontColor: "black",
		};

		/*getting condition(gradient) object to be changed*/
		const formatItem = chartControls.properties[propKey].tableConditionalFormats.filter(
			(item: any) => {
				return item.name === format.name;
			}
		);
		/* get formatItem's value to do iteration*/
		var formatItemValue = formatItem[0].value;

		let indexvalue;

		/* to check the enterd value is grater than min and small than max*/
		if (gradientValue > gradientMinAndMax.min && gradientValue < gradientMinAndMax.max) {
			formatItemValue.forEach((item: any, index: number) => {
				/*the first item's (this would be min value) value is less than enterd value, it its valid then check the value next to it is grater than enterd value.
if it is valid then capture the index in whiche the new value will be pushed*/
				if (item.value < gradientValue) {
					if (formatItemValue[index + 1]) {
						if (formatItemValue[index + 1].value > gradientValue) {
							indexvalue = index + 1;
						}
					}
				}
			});
		}
		console.log(indexvalue);

		formatItemValue.splice(indexvalue, 0, obj);
		onUpdateRule(formatItemValue, format.name);
		setGradientValue(null);
	};

	const onAddCondition = (format: any, index: number) => {
		console.log(format, index);
		var obj = {
			id: uId(),
			isConditionSatisfied: false,
			conditionType: 1,
			target: null,
			minValue: null,
			maxValue: null,
			backgroundColor: "white",
			fontColor: "black",
			isBold: false,
			isItalic: false,
			isUnderlined: false,
			isCollapsed: true,
		};

		updatecfObjectOptions(propKey, index, {
			...format,
			value: [...format.value, obj],
		});
	};

	const columnsNames =
		chartControls.properties[propKey].chartData.length > 0
			? Object.keys(chartControls.properties[propKey].chartData[0])
			: [];
	return (
		<div className="optionsInfo">
			<div className="optionDescription" style={{ display: "flex", flexDirection: "column" }}>
				{chartControls.properties[propKey].tableConditionalFormats &&
					chartControls.properties[propKey].tableConditionalFormats.map(
						(format: any, i: number) => {
							return (
								<>
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											borderBottom: "2px solid rgba(224,224,224,1)",
											paddingBottom: "10px",
										}}
									>
										<div style={{ display: "flex" }}>
											<span>{format.name}</span>
											{format.isCollapsed ? (
												<ExpandMoreIcon
													sx={{ margin: "0px 0px 0px auto" }}
													onClick={() => {
														console.log(format);
														updatecfObjectOptions(propKey, i, {
															...format,
															isCollapsed: false,
														});
													}}
												/>
											) : (
												<ExpandLessIcon
													sx={{ margin: "0px 0px 0px auto" }}
													onClick={() => {
														console.log(format, {
															...format,
															isCollapsed: true,
														});

														updatecfObjectOptions(propKey, i, {
															...format,
															isCollapsed: true,
														});
													}}
												/>
											)}
											<DeleteOutlineOutlinedIcon
												onClick={() => deleteTablecf(propKey, i)}
											/>
										</div>
										{format.isCollapsed ? (
											<>
												{format.isLabel ? (
													<LabelStyleOptions format={format} index={i} />
												) : (
													<>
														{format.isGradient ? (
															<>
																<div
																	style={{
																		display: "flex",
																	}}
																>
																	<input
																		type="number"
																		value={gradientValue}
																		onChange={e => {
																			e.preventDefault();
																			setGradientValue(
																				e.target.value
																			);
																		}}
																	/>
																	<button
																		onClick={() =>
																			onAddCustomValues(
																				format
																			)
																		}
																	>
																		add
																	</button>
																</div>
																{format.value.map((el: any) => {
																	return (
																		<div>
																			<div>
																				{el.name}
																				<div
																					style={{
																						border: "2px solid black",
																					}}
																				>
																					{el.value}
																				</div>
																			</div>
																			<div>
																				<StyleButtons
																					isBold={
																						el.isBold
																					}
																					isItalic={
																						el.isItalic
																					}
																					isUnderlined={
																						el.isUnderlined
																					}
																					onChangeStyleProps={(
																						option: string,
																						value: any
																					) => {
																						onGradientStyleChange(
																							option,
																							value,
																							el.id,
																							format.name
																						);
																					}}
																				/>

																				<CustomFontAndBgColor
																					id={el.id}
																					backgroundColor={
																						el.backgroundColor
																					}
																					fontColor={
																						el.fontColor
																					}
																					onChangeColorProps={(
																						option: string,
																						value: any
																					) => {
																						onGradientStyleChange(
																							option,
																							value,
																							el.id,
																							format.name
																						);
																					}}
																				/>
																			</div>
																		</div>
																	);
																})}
															</>
														) : (
															<>
																<CondtionComponent
																	conditionSArray={format.value}
																	onChangeProps={(
																		id: string,
																		option: string,
																		value: any
																	) => {
																		const updatedArray =
																			format.value.map(
																				(el: any) => {
																					if (
																						el.id === id
																					) {
																						el[option] =
																							value;
																					}
																					return el;
																				}
																			);
																		onUpdateRule(
																			updatedArray,
																			format.name
																		);
																	}}
																	onDeleteCondition={(
																		id: string
																	) => {
																		const filterdArray =
																			format.value.filter(
																				(el: any) => {
																					return (
																						el.id !== id
																					);
																				}
																			);
																		onUpdateRule(
																			filterdArray,
																			format.name
																		);
																	}}
																/>
																<Button
																	sx={{
																		backgroundColor:
																			"rgb(43, 185, 187)",
																		height: "25px",
																		width: "100%",
																		color: "white",
																		textTransform: "none",
																		"&:hover": {
																			backgroundColor:
																				"rgb(43, 185, 187)",
																		},
																	}}
																	onClick={() => {
																		onAddCondition(format, i);
																	}}
																>
																	Add Condition
																</Button>
																<hr />
																<div className="optionDescription">
																	<p
																		style={{
																			color: "#ccc",
																			fontStyle: "italic",
																			fontSize: "10px",
																		}}
																	>
																		*the last satisfied
																		condition's style will be
																		applied*
																	</p>
																</div>
															</>
														)}
													</>
												)}
											</>
										) : null}
									</div>
								</>
							);
						}
					)}
			</div>
			<div className="optionDescription">
				<Button
					sx={{
						backgroundColor: "rgb(43, 185, 187)",
						height: "25px",
						width: "100%",
						color: "white",
						textTransform: "none",
						"&:hover": {
							backgroundColor: "rgb(43, 185, 187)",
						},
					}}
					disabled={chartControls.properties[propKey].chartData.length > 0 ? false : true}
					onClick={(e: any) => {
						setAnchorEl(e.currentTarget);
						setOpenPopover(true);
					}}
				>
					Add
				</Button>
			</div>
			{chartControls.properties[propKey].chartData.length > 0 ? null : (
				<p>create a chart first and then add conditional formats</p>
			)}
			<Popover
				open={openPopover}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "center",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "center",
					horizontal: "right",
				}}
				onClose={() => setOpenPopover(false)}
			>
				{columnsNames &&
					columnsNames.map((column: string) => {
						return (
							<Button
								sx={{
									textTransform: "none",
									color: "grey",
									display: "block",
								}}
								value={column}
								onClick={e => {
									setOptionAnchorEl(e.currentTarget);
									setSelectedColumnName(column);
									onSelectColumn(column);
								}}
							>
								{column}
							</Button>
						);
					})}
			</Popover>

			<Popover
				open={openOptionPopover}
				anchorEl={optionAnchorEl}
				anchorOrigin={{
					vertical: "center",
					horizontal: "left",
				}}
				transformOrigin={{
					vertical: "center",
					horizontal: "right",
				}}
				onClose={() => setOpenOptionPopover(false)}
			>
				<Button
					sx={{
						textTransform: "none",
						color: "grey",
						display: "block",
					}}
					value="gradient"
					onClick={(e: any) => {
						// onSelectColumn(column);
						setOpenOptionPopover(false);
						setOpenPopover(false);
						onSelectOption(e.target.value);
					}}
				>
					Gradient
				</Button>
				<Button
					sx={{
						textTransform: "none",
						color: "grey",
						display: "block",
					}}
					value="rule"
					onClick={(e: any) => {
						// onSelectColumn(column);
						setOpenOptionPopover(false);
						setOpenPopover(false);
						onSelectOption(e.target.value);
					}}
				>
					Rule
				</Button>
			</Popover>
		</div>
	);
};

const mapStateToProps = (state: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
		chartProperties: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		addTableConditionalFormats: (propKey: string, item: any) =>
			dispatch(addTableConditionalFormats(propKey, item)),
		updatecfObjectOptions: (propKey: string, removeIndex: number, item: any) =>
			dispatch(updatecfObjectOptions(propKey, removeIndex, item)),
		updateRuleObjectOptions: (
			propKey: string,
			objectIndex: number,
			itemIndex: number,
			item: any
		) => dispatch(updateRuleObjectOptions(propKey, objectIndex, itemIndex, item)),
		deleteTablecf: (propKey: string, index: number) => dispatch(deleteTablecf(propKey, index)),

		//new code
		addTableLabel: (propKey: string, item: any) => dispatch(addTableLabel(propKey, item)),
		updatecfObjectOptions1: (propKey: string, item: any) =>
			dispatch(updatecfObjectOptions1(propKey, item)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TableConditionalFormatting);
