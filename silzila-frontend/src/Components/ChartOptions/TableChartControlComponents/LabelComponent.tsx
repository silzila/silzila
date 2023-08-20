import React, { useState } from "react";
import { CustomFontAndBgColor, StyleButtons } from "../DynamicMeasureConditionalFormating";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
import ShortUniqueId from "short-unique-id";
import { updatecfObjectOptions1 } from "../../../redux/ChartPoperties/ChartControlsActions";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { CheckBox } from "@mui/icons-material";
import { SketchPicker } from "react-color";
import { Checkbox, Popover, Typography } from "@mui/material";

const LabelComponent = ({
	format,
	tabTileProps,
	chartControls,
	chartProperties,
	updatecfObjectOptions1,
}: any) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var uId = new ShortUniqueId({ length: 8 });
	const [commonBg, setCommonBg] = useState<string>("white");
	const [bgPopover, setBgPopover] = useState<boolean>(false);
	const [commonFc, setCommonFc] = useState<string>("black");
	const [fontPopover, setFontPopover] = useState<boolean>(false);

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
				if (optionName === "fontColor" || optionName === "backgroundColor") {
					el.isUnique = true;
				}
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
	const onCheckOrOnUnCheck = () => {
		const updatedValues = chartControls.properties[propKey].tableConditionalFormats.map(
			(column: any) => {
				if (column.name === format.name) {
					if (!column.applyCommonStyle) {
						column.value = column.value.map((el: any) => {
							el.isUnique = false;

							return el;
						});
					} else {
						column.value = column.value.map((el: any) => {
							if (!el.isUnique) {
								el.backgroundColor = format.commonBg;
								el.fontColor = format.commonFontColor;
							}
							return el;
						});
					}
					column.applyCommonStyle = !column.applyCommonStyle;
				}
				return column;
			}
		);

		/* sending updatedValues as payload to update state*/
		updatecfObjectOptions1(propKey, updatedValues);
	};
	const onChangeCommonBg = (color: string) => {
		const updatedValues = chartControls.properties[propKey].tableConditionalFormats.map(
			(column: any) => {
				if (column.name === format.name) {
					column.commonBg = color;
					if (column.applyCommonStyle) {
						column.value = column.value.map((el: any) => {
							if (!el.isUnique) {
								el.backgroundColor = format.commonBg;
								// el.fontColor = format.commonFontColor;
							}
							return el;
						});
					}
				}
				return column;
			}
		);

		/* sending updatedValues as payload to update state*/
		updatecfObjectOptions1(propKey, updatedValues);
	};
	const onChangeCommonFont = (color: string) => {
		const updatedValues = chartControls.properties[propKey].tableConditionalFormats.map(
			(column: any) => {
				if (column.name === format.name) {
					column.commonFontColor = color;
					if (column.applyCommonStyle) {
						column.value = column.value.map((el: any) => {
							if (!el.isUnique) {
								// el.backgroundColor = format.commonBg;
								el.fontColor = format.commonFontColor;
							}
							return el;
						});
					}
				}
				return column;
			}
		);

		/* sending updatedValues as payload to update state*/
		updatecfObjectOptions1(propKey, updatedValues);
	};
	return (
		<>
			<div>
				<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
					<div
						title="Background Color"
						style={{
							height: "25px",
							width: "25px",
							backgroundColor: commonBg,
							color: commonBg,
							border: "2px solid darkgray",
							borderRadius: "4px",
						}}
						onClick={() => {
							setBgPopover(true);
						}}
					></div>
					<Popover
						open={bgPopover}
						onClose={() => setBgPopover(false)}
						onClick={() => setBgPopover(false)}
						anchorReference="anchorPosition"
						anchorPosition={{ top: 350, left: 1300 }}
					>
						<div id={"1"}>
							<SketchPicker
								className="sketchPicker"
								width="16rem"
								onChangeComplete={color => {
									setCommonBg(color.hex);
									onChangeCommonBg(color.hex);
								}}
								onChange={color => {
									setCommonBg(color.hex);
								}}
							/>
						</div>
					</Popover>

					<div
						title="Font Color"
						style={{
							height: "25px",
							width: "25px",
							backgroundColor: commonFc,
							color: commonFc,
							border: "2px solid darkgray",
							borderRadius: "4px",
						}}
						onClick={() => {
							setFontPopover(true);
						}}
					></div>
					<Popover
						open={fontPopover}
						onClose={() => setFontPopover(false)}
						onClick={() => setFontPopover(false)}
						anchorReference="anchorPosition"
						anchorPosition={{ top: 350, left: 1300 }}
					>
						<div id={"2"}>
							<SketchPicker
								className="sketchPicker"
								width="16rem"
								onChangeComplete={color => {
									setCommonFc(color.hex);
									onChangeCommonFont(color.hex);
								}}
								onChange={color => {
									setCommonFc(color.hex);
								}}
							/>
						</div>
					</Popover>

					<div style={{ display: "flex", height: "25px" }}>
						<Checkbox
							sx={{
								"&.Mui-checked": {
									color: "#2bb9bb",
								},
								"&.Mui-disabled": {
									color: "#B1B1B1",
								},
							}}
							style={{ width: "0.5rem", height: "0.5rem", margin: "auto 5px auto 0" }}
							size="small"
							// size="1rem"
							// disabled={props.table.isNewTable ? false : true}
							checked={format.applyCommonStyle}
							onClick={() => onCheckOrOnUnCheck()}
							// value={props.table.tableName}
						/>
						<Typography sx={{ fontSize: "14px" }}>(All)</Typography>
					</div>
				</div>
			</div>
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
						<div style={{ display: "flex", marginBottom: "10px" }}>
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
					</div>
				);
			})}
		</>
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
		updatecfObjectOptions1: (propKey: string, item: any) =>
			dispatch(updatecfObjectOptions1(propKey, item)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelComponent);
