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
	format = JSON.parse(JSON.stringify(format));
	//console.log(JSON.stringify(format.value.find((item:any)=>item.name == 'Min')))
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

				if(e.target.value){
					el.isUserChanged = true;
				}
				else{
					el.isUserChanged = false;
				}
			}
			return el;
		});		
		

		onUpdateRule(temp, format.name);
	};

	const getMinAndMaxValue = (column: string) => {
		const valuesArray = chartControls.properties[propKey].chartData.map((el: any) => {
			return el[column];
		});		
		const minValue = Number(Math.min(...valuesArray)).toFixed(2);
		const maxValue =  Number(Math.max(...valuesArray)).toFixed(2);	

		return { min: minValue, max: maxValue };
	};

	const getMidValue = (column: string) => {
		const valuesArray = chartControls.properties[propKey].chartData.map((el: any) => {
			return el[column];
		});		
		const minValue:any = Number(Math.min(...valuesArray)).toFixed(2);
		const maxValue:any =  Number(Math.max(...valuesArray)).toFixed(2);	

		return (Number(minValue) + Number(maxValue)) / 2;
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
			backgroundColor: "#E6FB0A",
			fontColor: "black",
		};

		var formatItemValue = format.value;
		let indexvalue = 2;
		let min = format.value.find((val:any)=>val.name == 'Min').value;
		let max = format.value.find((val:any)=>val.name == 'Max').value;
		let midVal = (Number(min) + Number(max)) / 2;

		obj.value = midVal;

		formatItemValue.splice(indexvalue, 0, obj);
		setGradientValue(midVal);
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
							{el.name?.trim() == "Null"? (
								"Null"
							) : (
								<>
									<span>
										{el.name}
										{el.name?.trim() == "Mid Value" ? (
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
										placeholder={el.isUserChanged ? "" : el.name == "Min" ? "Enter Min Value ("+ getMinAndMaxValue(format.name)?.min + ")"
															: el.name == "Max" ? "Enter Max Value (" + getMinAndMaxValue(format.name)?.max + ")" : 
															"Enter Mid Value (" + getMidValue(format.name) + ")"}
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
