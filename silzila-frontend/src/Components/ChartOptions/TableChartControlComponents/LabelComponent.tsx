import React from "react";
import { CustomFontAndBgColor, StyleButtons } from "../DynamicMeasureConditionalFormating";
import StarPurple500Icon from "@mui/icons-material/StarPurple500";
import ShortUniqueId from "short-unique-id";
import { updatecfObjectOptions1 } from "../../../redux/ChartPoperties/ChartControlsActions";
import { Dispatch } from "redux";
import { connect } from "react-redux";

const LabelComponent = ({
	format,
	tabTileProps,
	chartControls,
	chartProperties,
	updatecfObjectOptions1,
}: any) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var uId = new ShortUniqueId({ length: 8 });

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
