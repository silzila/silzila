import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import ShortUniqueId from "short-unique-id";
import { updatecfObjectOptions1 } from "../../../redux/ChartPoperties/ChartControlsActions";
import { CustomFontAndBgColor, StyleButtons } from "../DynamicMeasureConditionalFormating";

const GradientComponent = ({
	chartControls,
	tabTileProps,
	chartProperties,
	updatecfObjectOptions1,
	format,
}: any) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var uId = new ShortUniqueId({ length: 8 });

	const [gradientValue, setGradientValue] = useState<any>(null);

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

		formatItemValue.forEach((item: any, index: number) => {
			if (formatItemValue.length === 3) {
				indexvalue = 2;
			} else {
				if (index !== 0 && index !== 1 && index !== formatItemValue.length - 1) {
					if (item.value < gradientValue) {
						if (formatItemValue[index + 1]) {
							if (formatItemValue[index + 1].value > gradientValue) {
								indexvalue = index + 1;
							}
						}
					}
				}
			}
		});

		setGradientValue(0);
		console.log(indexvalue);

		formatItemValue.splice(indexvalue, 0, obj);
		onUpdateRule(formatItemValue, format.name);
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
	return (
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
						setGradientValue(e.target.value);
					}}
				/>
				<div
					title="Add Custom Value"
					className="containerButton"
					onClick={() => {
						if (gradientValue !== 0) {
							onAddCustomValues(format);
						} else {
							// TODO: need to fix
							window.alert("custom value cant be zero");
						}
					}}
				>
					<AddIcon />
				</div>
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
								isBold={el.isBold}
								isItalic={el.isItalic}
								isUnderlined={el.isUnderlined}
								onChangeStyleProps={(option: string, value: any) => {
									onGradientStyleChange(option, value, el.id, format.name);
								}}
							/>

							<CustomFontAndBgColor
								id={el.id}
								backgroundColor={el.backgroundColor}
								fontColor={el.fontColor}
								onChangeColorProps={(option: string, value: any) => {
									onGradientStyleChange(option, value, el.id, format.name);
								}}
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

export default connect(mapStateToProps, mapDispatchToProps)(GradientComponent);
