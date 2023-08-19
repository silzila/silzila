import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import ShortUniqueId from "short-unique-id";
import {
	updatecfObjectOptions,
	updatecfObjectOptions1,
} from "../../../redux/ChartPoperties/ChartControlsActions";
import {
	CondtionComponent,
	CustomFontAndBgColor,
	StyleButtons,
} from "../DynamicMeasureConditionalFormating";
import { Button } from "@mui/material";

const RuleComponent = ({
	chartControls,
	tabTileProps,
	chartProperties,
	updatecfObjectOptions1,
	updatecfObjectOptions,
	format,
	i,
}: any) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var uId = new ShortUniqueId({ length: 8 });

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

	return (
		<div>
			<CondtionComponent
				conditionSArray={format.value}
				onChangeProps={(id: string, option: string, value: any) => {
					const updatedArray = format.value.map((el: any) => {
						if (el.id === id) {
							el[option] = value;
						}
						return el;
					});
					onUpdateRule(updatedArray, format.name);
				}}
				onDeleteCondition={(id: string) => {
					const filterdArray = format.value.filter((el: any) => {
						return el.id !== id;
					});
					onUpdateRule(filterdArray, format.name);
				}}
			/>
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
					*the last satisfied condition's style will be applied*
				</p>
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
		updatecfObjectOptions1: (propKey: string, item: any) =>
			dispatch(updatecfObjectOptions1(propKey, item)),
		updatecfObjectOptions: (propKey: string, removeIndex: number, item: any) =>
			dispatch(updatecfObjectOptions(propKey, removeIndex, item)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(RuleComponent);
