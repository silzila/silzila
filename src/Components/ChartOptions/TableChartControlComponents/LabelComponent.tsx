import { updatecfObjectOptions1 } from "../../../redux/ChartPoperties/ChartControlsActions";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { CustomFontAndBgColor, StyleButtons } from "../CommonComponents";

const LabelComponent = ({ format, tabTileProps, chartControls, updatecfObjectOptions1 }: any) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const onLabelStyleChange = (
		optionName: string,
		value: any,
		valueName: string,
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
			if (el.colValue === valueName) {
				el[optionName] = value;

				if (optionName === "fontColor" || optionName === "backgroundColor") {
					el.isUnique = true;
				}
			}
			return el;
		});

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

	const onChangeCommonStyles = (option: string, value: any) => {
		const updatedValues = chartControls.properties[propKey].tableConditionalFormats.map(
			(column: any) => {
				if (column.name === format.name) {
					column[option] = value;
					column.value = column.value.map((el: any) => {
						el[option] = value;
						return el;
					});
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
				<div className="labelItemContainer">
					<span className="labelText">(All)</span>
					<div className="labelPropsContailer">
						<StyleButtons
							isBold={format.isBold}
							isItalic={format.isItalic}
							isUnderlined={format.isUnderlined}
							onChangeStyleProps={(option: string, value: any) => {
								onChangeCommonStyles(option, value);
							}}
						/>

						<CustomFontAndBgColor
							backgroundColor={format.commonBg}
							onChangeColorProps={(
								option: string,
								value: any,
								columnValue: string
							) => {
								onChangeCommonStyles(option, value);
							}}
							fontColor={"red"}
						/>
					</div>
				</div>
			</div>
			{format?.value?.map((el: any) => {
				return (
					<div key={el.id} className="labelItemContainer">
						<span className="labelText">{el.colValue}</span>
						<div className="labelPropsContailer">
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
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updatecfObjectOptions1: (propKey: string, item: any) =>
			dispatch(updatecfObjectOptions1(propKey, item)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(LabelComponent);
