import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
	addNewCondition,
	updateConditionalFormat,
} from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import { Dispatch } from "redux";
import ShortUniqueId from "short-unique-id";
import { Button, FormControl, MenuItem, Select, TextField } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
	CustomFontAndBgColor,
	StyleButtons,
	checkIsConditionSatisfied,
	conditionTypes,
} from "./CommonComponents";
import { SelectComponentStyle, menuItemStyle } from "./Labels/SnakeyLabelOptions";
import { textFieldStyleProps } from "./GridAndAxes/GridAndAxes";
// TODO (kasthuri)
interface Props {
	dynamicMeasureProps: any;
	tabTileProps: any;

	addNewCondition: (obj: any) => void;
	changeConditionalFormat: (array: any) => void;
}

const DynamicMeasureConditionalFormattingComponent = ({
	// state
	dynamicMeasureProps,
	tabTileProps,

	//dispatch
	addNewCondition,
	changeConditionalFormat,
}: Props) => {
	var uid = new ShortUniqueId({ length: 8 });

	var measureKey = `${dynamicMeasureProps.selectedTileId}.${dynamicMeasureProps.selectedDynamicMeasureId}`;

	const dmValue =
		dynamicMeasureProps.dynamicMeasureProps[`${tabTileProps.selectedTabId}`][
			`${tabTileProps.selectedTileId}`
		][measureKey].dmValue;

	const [cfList, setCfList] = useState<any>(
		dynamicMeasureProps.dynamicMeasureProps[`${tabTileProps.selectedTabId}`][
			`${tabTileProps.selectedTileId}`
		][measureKey].conditionalFormats
	);

	const [updateState, setUpdateState] = useState<Boolean>(false);

	//Adding  conditional format condition
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

	useEffect(() => {
		if (updateState) {
			changeConditionalFormat(cfList);
			setUpdateState(false);
		}
	}, [updateState]);

	const onDelete = (id: string) => {
		const temp = cfList.filter((el: any) => {
			return el.id !== id;
		});
		setCfList(temp);
		setUpdateState(true);
	};

	const onChageProps = (id: string, option: string, value: any) => {
		const updatedCfList = cfList.map((el: any) => {
			if (el.id === id) {
				el[option] = value;
			}
			return el;
		});
		setCfList(updatedCfList);
		setUpdateState(true);
	};

	return (
		<>
			{cfList &&
				cfList.map((item: any, i: number) => {
					return (
						<div className="optionsInfo">
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									borderBottom: "2px solid rgba(224,224,224,1)",
									paddingBottom: "5px",
								}}
							>
								<div style={{ display: "flex" }}>
									<span>conditional Format {i + 1}</span>
									{item.isCollapsed ? (
										<ExpandMoreIcon
											sx={{
												margin: "5px 0px 0px auto",
												fontSize: "16px",
											}}
											onClick={() => {
												onChageProps(
													item.id,
													"isCollapsed",
													!item.isCollapsed
												);
											}}
										/>
									) : (
										<ChevronRightIcon
											sx={{
												margin: "5px 0px 0px auto",
												fontSize: "16px",
											}}
											onClick={() => {
												onChageProps(
													item.id,
													"isCollapsed",
													!item.isCollapsed
												);
											}}
										/>
									)}
									<DeleteOutlineOutlinedIcon
										sx={{
											margin: "3px 0px 0px 10px",
											fontSize: "18px",
										}}
										onClick={() => onDelete(item.id)}
									/>
								</div>
							</div>
							{item.isCollapsed ? (
								<>
									<div style={{ flexDirection: "column" }}>
										<div>Condition</div>
										<FormControl
											fullWidth
											size="small"
											style={{
												fontSize: "12px",
												borderRadius: "4px",
												marginTop: "5px",
											}}
										>
											<Select
												value={item.conditionType}
												variant="outlined"
												onChange={e => {
													//TODO:(kasthuri)condition satisfied check
													onChageProps(
														item.id,
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
										{item.conditionType === 7 ? (
											<>
												<div>Min Value</div>

												<TextField
													value={item.minValue}
													variant="outlined"
													type="number"
													onChange={e => {
														e.preventDefault();
														const updatedCfList = cfList.map(
															(el: any) => {
																if (el.id === item.id) {
																	el.minValue = e.target.value;
																}
																return el;
															}
														);
														setCfList(
															checkIsConditionSatisfied(
																updatedCfList,
																dmValue
															)
														);
													}}
													onMouseLeave={(e: any) => {
														setUpdateState(true);
													}}
													sx={{ marginTop: "5px" }}
													InputProps={{ ...textFieldStyleProps }}
													fullWidth
												/>
												<div>Max Value</div>

												<TextField
													value={item.maxValue}
													variant="outlined"
													type="number"
													onChange={e => {
														e.preventDefault();
														const updatedCfList = cfList.map(
															(el: any) => {
																if (el.id === item.id) {
																	el.maxValue = e.target.value;
																}
																return el;
															}
														);
														setCfList(
															checkIsConditionSatisfied(
																updatedCfList,
																dmValue
															)
														);
													}}
													onMouseLeave={(e: any) => {
														setUpdateState(true);
													}}
													sx={{ marginTop: "5px" }}
													InputProps={{ ...textFieldStyleProps }}
													fullWidth
												/>
											</>
										) : (
											<>
												<div>Target Value</div>

												<TextField
													value={item.target}
													variant="outlined"
													type="number"
													onChange={e => {
														e.preventDefault();
														const temp = cfList.map((el: any) => {
															if (el.id === item.id) {
																el.target = e.target.value;
															}
															return el;
														});
														setCfList(
															checkIsConditionSatisfied(temp, dmValue)
														);
													}}
													onMouseLeave={(e: any) => {
														setUpdateState(true);
													}}
													sx={{ marginTop: "5px" }}
													InputProps={{ ...textFieldStyleProps }}
													fullWidth
												/>
											</>
										)}
										<div
											style={{
												display: "flex",
												marginTop: "5px",
												marginLeft: "30px",
											}}
										>
											<StyleButtons
												isBold={item.isBold}
												isItalic={item.isItalic}
												isUnderlined={item.isUnderlined}
												onChangeStyleProps={(
													option: string,
													value: any
												) => {
													onChageProps(item.id, option, value);
												}}
											/>
											<CustomFontAndBgColor
												backgroundColor={item.backgroundColor}
												fontColor={item.fontColor}
												onChangeColorProps={(
													option: string,
													color: any,
													id: any
												) => {
													onChageProps(item.id, option, color);
												}}
												id={item.id}
											/>
										</div>
									</div>
								</>
							) : null}
						</div>
					);
				})}
			<div className="optionDescription">
				<Button
					sx={{
						backgroundColor: "rgb(43, 185, 187)",
						height: "25px",
						width: "100%",
						color: "white",
						textTransform: "none",
					}}
					disabled={dmValue ? false : true}
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
		</>
	);
};

const mapStateToProps = (state: any, ownProps: any) => {
	return {
		dynamicMeasureProps: state.dynamicMeasuresState,
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		addNewCondition: (conditionObj: any) => dispatch(addNewCondition(conditionObj)),
		changeConditionalFormat: (cfArray: any) => dispatch(updateConditionalFormat(cfArray)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DynamicMeasureConditionalFormattingComponent);
