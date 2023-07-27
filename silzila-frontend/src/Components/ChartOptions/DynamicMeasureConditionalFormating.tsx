import { Button, FormControl, MenuItem, Popover, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
	addNewCondition,
	updateConditionalFormat,
} from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import ShortUniqueId from "short-unique-id";
import { SelectComponentStyle, menuItemStyle } from "./Labels/SnakeyLabelOptions";
import { textFieldStyleProps } from "./GridAndAxes/GridAndAxes";
import { SketchPicker } from "react-color";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { color } from "echarts";

export const checkIsConditionSatisfied = (formatsArray: any, dmValue: number) => {
	const updatedArray = formatsArray.map((el: any) => {
		if (el.conditionType === 1) {
			if (dmValue > el.target) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		if (el.conditionType === 2) {
			if (dmValue < el.target) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		if (el.conditionType === 3) {
			if (dmValue >= el.target) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		if (el.conditionType === 4) {
			if (dmValue <= el.target) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		if (el.conditionType === 5) {
			if (dmValue === el.target) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		if (el.conditionType === 6) {
			if (dmValue != el.target) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		if (el.conditionType === 7) {
			if (el.minValue < dmValue < el.maxValue) {
				el.isConditionSatisfied = true;
			} else {
				el.isConditionSatisfied = false;
			}
		}
		return el;
	});
	return updatedArray;
};

const conditionTypes = [
	{ id: 1, value: "> Greater than" },
	{ id: 2, value: "< Less than" },
	{ id: 3, value: ">= Greater than or Equal to" },
	{ id: 4, value: "<= Less than or Equal to" },
	{ id: 5, value: "= Equal to" },
	{ id: 6, value: "<> Not Equal to" },
	{ id: 7, value: ">= Between <=" },
];

const GetInputField = ({ condition, onChangeValueProps }: any) => {
	console.log(condition);
	return (
		<>
			{condition.conditionType === 7 ? (
				<>
					<div className="optionDescription">Min Value</div>

					<TextField
						value={condition.minValue}
						variant="outlined"
						type="number"
						onChange={e => {
							e.preventDefault();
							onChangeValueProps("minValue", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>
					<div className="optionDescription">Max Value</div>

					<TextField
						value={condition.maxValue}
						variant="outlined"
						type="number"
						onChange={e => {
							e.preventDefault();
							onChangeValueProps("maxValue", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>
				</>
			) : (
				<>
					<div className="optionDescription">Target Value</div>

					<TextField
						value={condition.target}
						variant="outlined"
						type="number"
						onChange={e => {
							e.preventDefault();
							onChangeValueProps("target", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>
				</>
			)}
		</>
	);
};

export const CondtionComponent = ({
	conditionSArray,
	onDeleteCondition,
	onChangeProps,
	setbgColorPopOverOpen,
	setFontColorPopOverOpen,
	isbgColorPopoverOpen,
	isFontColorPopoverOpen,
}: any) => {
	return (
		<>
			<div className="optionDescription" style={{ display: "flex", flexDirection: "column" }}>
				{conditionSArray.map((condition: any, i: number) => {
					return (
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								borderBottom: "2px solid rgba(224,224,224,1)",
								paddingBottom: "10px",
							}}
						>
							<div style={{ display: "flex" }}>
								<span>conditional Format {i + 1}</span>
								{condition.isCollapsed ? (
									<ExpandMoreIcon
										sx={{ margin: "0px 0px 0px auto" }}
										onClick={() => {
											onChangeProps(
												condition.id,
												"isCollapsed",
												!condition.isCollapsed
											);
										}}
									/>
								) : (
									<ExpandLessIcon
										sx={{ margin: "0px 0px 0px auto" }}
										onClick={() =>
											onChangeProps(
												condition.id,
												"isCollapsed",
												!condition.isCollapsed
											)
										}
									/>
								)}
								<DeleteOutlineOutlinedIcon
									onClick={() => onDeleteCondition(condition.id)}
								/>
							</div>

							{condition.isCollapsed ? (
								<>
									<div style={{ flexDirection: "column" }}>
										<div className="optionDescription">Condition</div>
										<FormControl
											fullWidth
											size="small"
											style={{ fontSize: "12px", borderRadius: "4px" }}
										>
											<Select
												value={condition.conditionType}
												variant="outlined"
												onChange={e => {
													onChangeProps(
														condition.id,
														"conditionType",
														e.target.value
													);
												}}
												sx={SelectComponentStyle}
											>
												{conditionTypes.map((item: any) => {
													return (
														<MenuItem
															value={item.id}
															key={item.id}
															sx={{
																textTransform: "capitalize",
																...menuItemStyle,
															}}
														>
															{item.value}
														</MenuItem>
													);
												})}
											</Select>
										</FormControl>
										<GetInputField
											condition={condition}
											onChangeValueProps={(option: string, value: any) => {
												onChangeProps(condition.id, option, value);
											}}
										/>
										<StyleButtons
											isBold={condition.isBold}
											isItalic={condition.isItalic}
											isUnderlined={condition.isUnderlined}
											onChangeStyleProps={(option: string, value: any) => {
												onChangeProps(condition.id, option, value);
											}}
										/>
										<CustomFontAndBgColor
											backgroundColor={condition.backgroundColor}
											fontColor={condition.fontColor}
											onChangeColorProps={(
												option: string,
												color: any,
												id: any
											) => {
												onChangeProps(id, option, color);
											}}
											id={condition.id}
										/>
									</div>
								</>
							) : null}
						</div>
					);
				})}
			</div>
		</>
	);
};

export const StyleButtons = ({ isBold, isItalic, isUnderlined, onChangeStyleProps }: any) => {
	return (
		<div
			style={{
				display: "flex",
				justifyContent: "space-around",
			}}
		>
			<FormatBoldIcon
				onClick={() => {
					onChangeStyleProps("isBold", !isBold);
				}}
				sx={{
					border: "1px solid grey",
					borderRadius: "3px",
					backgroundColor: isBold ? "rgba(224,224,224,1)" : "none",
				}}
			/>
			<FormatItalicIcon
				onClick={() => onChangeStyleProps("isItalic", !isItalic)}
				sx={{
					border: "1px solid grey",
					borderRadius: "3px",
					backgroundColor: isItalic ? "rgba(224,224,224,1)" : "none",
				}}
			/>
			<FormatUnderlinedIcon
				onClick={() => onChangeStyleProps("isUnderlined", !isUnderlined)}
				sx={{
					border: "1px solid grey",
					borderRadius: "3px",
					backgroundColor: isUnderlined ? "rgba(224,224,224,1)" : "none",
				}}
			/>
		</div>
	);
};

export const CustomFontAndBgColor = ({
	id,
	backgroundColor,

	fontColor,

	onChangeColorProps,
}: any) => {
	const [selectedId, setSelectedId] = useState<string>("");
	const [isbgColorPopoverOpen, setbgColorPopOverOpen] = useState<boolean>(false);
	const [isFontColorPopoverOpen, setFontColorPopOverOpen] = useState<boolean>(false);
	console.log(selectedId);

	return (
		<>
			<div className="optionDescription">
				<label style={{ width: "40%" }}>Background Color</label>
				<div
					style={{
						height: "1.25rem",
						width: "50%",
						marginLeft: "20px",
						backgroundColor: backgroundColor,
						color: backgroundColor,
						border: "2px solid darkgray",
						margin: "auto",
					}}
					onClick={() => {
						setSelectedId(id);

						setbgColorPopOverOpen(!isbgColorPopoverOpen);
					}}
				></div>
				<Popover
					open={isbgColorPopoverOpen}
					onClose={() => setbgColorPopOverOpen(false)}
					onClick={() => setbgColorPopOverOpen(false)}
					anchorReference="anchorPosition"
					anchorPosition={{ top: 350, left: 1300 }}
				>
					<div id={id}>
						<SketchPicker
							className="sketchPicker"
							width="16rem"
							onChangeComplete={color => {
								onChangeColorProps("backgroundColor", color.hex, selectedId);
							}}
							onChange={color => {
								onChangeColorProps("backgroundColor", color.hex, selectedId);
							}}
						/>
					</div>
				</Popover>
			</div>
			<div className="optionDescription">
				<label style={{ width: "40%" }}>Font Color</label>
				<div
					style={{
						height: "1.25rem",
						width: "50%",
						marginLeft: "20px",
						backgroundColor: fontColor,
						color: fontColor,
						border: "2px solid darkgray",
						margin: "auto",
					}}
					onClick={() => {
						setFontColorPopOverOpen(!isFontColorPopoverOpen);
						setSelectedId(id);
					}}
				></div>
				<Popover
					open={isFontColorPopoverOpen}
					onClose={() => setFontColorPopOverOpen(false)}
					onClick={() => setFontColorPopOverOpen(false)}
					anchorReference="anchorPosition"
					anchorPosition={{ top: 350, left: 1300 }}
				>
					<div id={id}>
						<SketchPicker
							className="sketchPicker"
							width="16rem"
							onChangeComplete={color => {
								onChangeColorProps("fontColor", color.hex, selectedId);
							}}
							onChange={color => {
								onChangeColorProps("fontColor", color.hex, selectedId);
							}}
						/>
					</div>
				</Popover>
			</div>
		</>
	);
};

const DynamicMeasureConditionalFormating = ({
	addNewCondition,
	dynamicMeasureProps,
	changeConditionalFormat,
}: any) => {
	var dmProp =
		dynamicMeasureProps.dynamicMeasureProps[`${dynamicMeasureProps.selectedTabId}`]?.[
			`${dynamicMeasureProps.selectedTileId}`
		]?.[
			`${dynamicMeasureProps.selectedTileId}.${dynamicMeasureProps.selectedDynamicMeasureId}`
		];

	const [isbgColorPopoverOpen, setbgColorPopOverOpen] = useState<boolean>(false);

	var uid = new ShortUniqueId({ length: 8 });

	const [isFontColorPopoverOpen, setFontColorPopOverOpen] = useState<boolean>(false);

	const addNewConditionOnClick = () => {
		var obj = {
			id: uid(),
			isConditionSatisfied: false,
			conditionType: 1,
			target: null,
			minValue: null,
			maxValue: null,
			backgroundColor: "white",
			fontColor: "black",
			isFontBold: false,
			isItalic: false,
			isUnderlined: false,
			isCollapsed: true,
		};
		addNewCondition(obj);
	};

	const onDelete = (id: string) => {
		const updatedConditionalFormatsArray = dmProp.conditionalFormats.filter((el: any) => {
			return el.id !== id;
		});
		changeConditionalFormat(updatedConditionalFormatsArray);
	};

	const changeOptionValue = (id: string, option: string, value: any) => {
		// console.log(dmProp.conditionalFormats);
		// console.log(id, option, value);
		const updatedConditionalFormatsArray = dmProp.conditionalFormats.map((el: any) => {
			if (el.id === id) {
				el[option] = value;
			}
			return el;
		});

		if (
			option === "conditionType" ||
			option === "target" ||
			option === "minValue" ||
			option === "maxValue"
		) {
			changeConditionalFormat(
				checkIsConditionSatisfied(updatedConditionalFormatsArray, dmProp.dmValue)
			);
		} else {
			changeConditionalFormat(updatedConditionalFormatsArray);
		}
	};
	return (
		<div className="optionsInfo">
			<CondtionComponent
				conditionSArray={dmProp.conditionalFormats}
				onChangeProps={(id: string, option: string, value: any) => {
					changeOptionValue(id, option, value);
				}}
				onDeleteCondition={(id: string) => onDelete(id)}
				isbgColorPopoverOpen={isbgColorPopoverOpen}
				isFontColorPopoverOpen={isFontColorPopoverOpen}
				setbgColorPopOverOpen={(value: boolean) => setbgColorPopOverOpen(value)}
				setFontColorPopOverOpen={(value: boolean) => setFontColorPopOverOpen(value)}
			/>
			<div className="optionDescription">
				<Button
					sx={{
						backgroundColor: "rgb(43, 185, 187)",
						height: "25px",
						width: "100%",
						color: "white",
						textTransform: "none",
					}}
					disabled={dmProp.dmValue ? false : true}
					onClick={() => {
						addNewConditionOnClick();
					}}
				>
					Add
				</Button>
			</div>
			<hr />
			<div className="optionDescription">
				<p style={{ color: "#ccc", fontStyle: "italic", fontSize: "10px" }}>
					*the last satisfied condition's style will be applied*
				</p>
			</div>
		</div>
	);
};

const mapStateToProps = (state: any, ownProps: any) => {
	return {
		dynamicMeasureProps: state.dynamicMeasuresState,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		addNewCondition: (conditionObj: any) => dispatch(addNewCondition(conditionObj)),
		changeConditionalFormat: (cfArray: any) => dispatch(updateConditionalFormat(cfArray)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DynamicMeasureConditionalFormating);
