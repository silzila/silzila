import { connect } from "react-redux";
import { Dispatch } from "redux";
import ShortUniqueId from "short-unique-id";
import { Button, FormControl, MenuItem, Select } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { addConditionButtonStyle } from "./TableChartControlComponents/TableConditionalFormatting";
import { addOrEditSimplecardConditionalFormat } from "../../redux/ChartPoperties/ChartControlsActions";
import { SelectComponentStyle, menuItemStyle } from "./Labels/SnakeyLabelOptions";
import {
	CustomFontAndBgColor,
	GetInputField,
	StyleButtons,
	checkIsConditionSatisfied,
	conditionTypes,
} from "./CommonComponents";

import {useEffect} from 'react';

const SimplecardConditionalFormatting = ({
	chartControls,
	tabTileProps,
	chartProperties,
	addOrEditSimplecardConditionalFormat,
}: any) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var uId = new ShortUniqueId({ length: 8 });
	var cfList = chartControls.properties[propKey].simplecardConditionalFormats;
	var valueName: any = Object.keys(chartControls.properties[propKey].chartData[0]);
	var dataValue = chartControls.properties[propKey].chartData[0][valueName];


	// useEffect(()=>{

	// }
	// ,[chartProperties.properties[propKey].chartAxes])

	const onAddCondition = () => {
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

		var finalArray = [...cfList, obj];
		addOrEditSimplecardConditionalFormat(propKey, finalArray);
	};

	const onStylePropsChange = (id: string, option: string, value: any) => {
		const updatedArray = cfList.map((el: any) => {
			if (el.id === id) {
				el[option] = value;
			}
			return el;
		});
		addOrEditSimplecardConditionalFormat(
			propKey,
			checkIsConditionSatisfied(updatedArray, dataValue)
		);
	};

	return (
		<div className="optionsInfo">
			<div
				className="optionDescription"
				style={{ display: "flex", flexDirection: "column", marginTop: "0px" }}
			>
				<div style={{ display: "flex", flexDirection: "column" }}>
					{chartControls.properties[propKey].simplecardConditionalFormats &&
						chartControls.properties[propKey].simplecardConditionalFormats.map(
							(condition: any, i: number) => {
								return (
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											borderBottom: "2px solid rgba(224,224,224,1)",
											paddingBottom: "10px",
										}}
									>
										<div style={{ display: "flex", marginTop: "5px" }}>
											<span>Rule {i + 1}</span>
											<span className="expandLessMoreContainer">
												{condition.isCollapsed ? (
													<ExpandMoreIcon
														sx={{
															fontSize: "16px",
														}}
														onClick={() => {
															onStylePropsChange(
																condition.id,
																"isCollapsed",
																!condition.isCollapsed
															);
														}}
													/>
												) : (
													<ChevronRightIcon
														sx={{
															fontSize: "16px",
														}}
														onClick={() =>
															onStylePropsChange(
																condition.id,
																"isCollapsed",
																!condition.isCollapsed
															)
														}
													/>
												)}
											</span>
											<span className="deleteIconContainer">
												<DeleteOutlineOutlinedIcon
													sx={{ fontSize: "16px" }}
													onClick={() => {
														const filterdArray = cfList.filter(
															(el: any) => {
																return el.id !== condition.id;
															}
														);
														addOrEditSimplecardConditionalFormat(
															propKey,
															filterdArray
														);
													}}
												/>
											</span>
										</div>

										{condition.isCollapsed ? (
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
															value={condition.conditionType}
															variant="outlined"
															onChange={e => {
																onStylePropsChange(
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
																			textTransform:
																				"capitalize",
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
														onChangeValueProps={(
															option: string,
															value: any
														) => {
															onStylePropsChange(
																condition.id,
																option,
																value
															);
														}}
													/>
													<div
														style={{
															display: "flex",
															marginTop: "5px",
															marginLeft: "0px",
														}}
													>
														<StyleButtons
															isBold={condition.isBold}
															isItalic={condition.isItalic}
															isUnderlined={condition.isUnderlined}
															onChangeStyleProps={(
																option: string,
																value: any
															) => {
																onStylePropsChange(
																	condition.id,
																	option,
																	value
																);
															}}
														/>
														<CustomFontAndBgColor
															backgroundColor={
																condition.backgroundColor
															}
															fontColor={condition.fontColor}
															onChangeColorProps={(
																option: string,
																color: any,
																id: any
															) => {
																onStylePropsChange(
																	id,
																	option,
																	color
																);
															}}
															id={condition.id}
														/>
													</div>
												</div>
											</>
										) : null}
									</div>
								);
							}
						)}
				</div>

				{chartControls.properties[propKey].chartData === "" ? (
					<div>
						<p className="noteStyle">
							*Drop any column in the measure to add conditions*
						</p>
					</div>
				) : (
					<>
						<Button
							sx={addConditionButtonStyle}
							onClick={() => {
								onAddCondition();
							}}
						>
							Add Condition
						</Button>

						<div>
							<p className="noteStyle">
								*the last satisfied condition's style will be applied*
							</p>
						</div>
					</>
				)}
			</div>
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
		addOrEditSimplecardConditionalFormat: (propKey: string, item: any) =>
			dispatch(addOrEditSimplecardConditionalFormat(propKey, item)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SimplecardConditionalFormatting);
