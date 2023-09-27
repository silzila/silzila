import { connect } from "react-redux";
import { Dispatch } from "redux";
import ShortUniqueId from "short-unique-id";
import { updatecfObjectOptions1 } from "../../../redux/ChartPoperties/ChartControlsActions";

import "./tablechartCF.css";
import { InputBase } from "@mui/material";
import { Checkbox } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { CustomFontAndBgColor, StyleButtons } from "../CommonComponents";

const closeIconStyle = {
	fontSize: "12px",
	cursor: "pointer",
	float: "right",
};

const inputBaseStyle = {
	border: "2px solid rgba(224,224,224,1)",
	borderRadius: "3px",
	height: "20px",
	fontSize: "12px",
	padding: "0px 4px",
	color: "#a7a7a7",
};
const checkbosStyle = {
	"&.Mui-checked": {
		color: "#2bb9bb",
	},
};

const GradientComponent = ({
	chartControls,
	tabTileProps,
	updatecfObjectOptions1,
	format,
	gradientMinMax,
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

		/* assigning updated values array to corresponding conditional format obj on tableConditionalFormats Array*/
		const updatedValues = chartControls.properties[propKey].tableConditionalFormats.map(
			(column: any) => {
				if (column.name === columnName) {
					column.value = matchedValue;
				}
				return column;
			}
		);

		/* sending updatedValues as payload to update state */
		updatecfObjectOptions1(propKey, updatedValues);
	};

	const onChangeMinMaxValues = (e: any, index: number) => {
		const temp = format.value.map((el: any, i: number) => {
			if (i === index) {
				el.value = e.target.value;
			}
			return el;
		});
		onUpdateRule(temp, format.name);
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

	const onAddMidValue = () => {
		var obj = {
			id: uId(),
			forNull: false,
			name: `Mid Value `,
			value: gradientValue,
			isBold: false,
			isItalic: false,
			isUnderlined: false,
			backgroundColor: "white",
			fontColor: "black",
		};

		var formatItemValue = format.value;
		let indexvalue = 2;
		setGradientValue(0);
		formatItemValue.splice(indexvalue, 0, obj);
		onUpdateRule(formatItemValue, format.name);
	};

	const onRemoveMidValue = () => {
		var formatItemValue = format.value;
		let indexvalue = 2;
		formatItemValue.splice(indexvalue, 1);

		onUpdateRule(formatItemValue, format.name);
	};
	return (
		<>
			{format.value.map((el: any, index: number) => {
				return (
					<div className="gradientComponentContainer">
						<div className="gradientCardContainer">
							{index === 0 ? (
								"Null"
							) : (
								<>
									<span>
										{el.name}
										{format.value.length === 4 && index === 2 ? (
											<CloseIcon
												sx={closeIconStyle}
												onClick={() => onRemoveMidValue()}
											/>
										) : null}
									</span>
									<InputBase
										value={el.value}
										onChange={(e: any) => {
											onChangeMinMaxValues(e, index);
										}}
										sx={inputBaseStyle}
									/>
								</>
							)}
						</div>
						<div className="displayFlex">
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
			<div className="midvalue">
				<Checkbox
					sx={checkbosStyle}
					className="checkboxStyle"
					size="small"
					checked={format.value.length === 4 ? true : false}
					onClick={() => {
						if (format.value.length === 4) {
							onRemoveMidValue();
						} else {
							onAddMidValue();
						}
					}}
				/>
				Add Mid Value
			</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(GradientComponent);
