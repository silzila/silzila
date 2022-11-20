// Control functions related to chart title are handled here
// Function include
// 	- Setting title for graph automatically / manually
// 	- Alignment of graph title

import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
	setGenerateTitle,
	setTitleAlignment,
	setTitleSize,
} from "../../../redux/ChartPoperties/ChartPropertiesActions";
import { ChartPropertiesProps } from "../../../redux/ChartPoperties/ChartPropertiesInterfaces";

import { TabTileStateProps } from "../../../redux/TabTile/TabTilePropsInterfaces";
import InputPositiveNumber from "../CommonFunctions/InputPositiveNumber";
import { ControlDetailStateProps } from "../CommonInterfacesForChartOptions";

interface ChartTitleProps {
	// state
	chartProp: ChartPropertiesProps;
	tabTileProps: TabTileStateProps;

	// dispatch
	setGenerateTitleToStore: (propKey: number | string, option: string) => void;
	setTitleAlignment: (propKey: number | string, align: string) => void;
	setTitleSize: (propKey: number | string, value: number) => void;
}

interface TitleOptions {
	type: string;
	hintTitle?: string;
}

interface titleAlignOptions {
	name: string;
	value: string;
}

const ChartTitle = ({
	// state
	chartProp,
	tabTileProps,

	// dispatch
	setGenerateTitleToStore,
	setTitleAlignment,
	setTitleSize,
}: ChartTitleProps) => {
	var propKey: number = parseFloat(
		`${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`
	);

	var generateTitle = chartProp.properties[propKey].titleOptions.generateTitle;
	var titleAlignment = chartProp.properties[propKey].titleOptions.titleAlign;

	var titleOptions: TitleOptions[] = [
		{ type: "Auto" },
		{ type: "Manual", hintTitle: "Double click on title to edit" },
	];

	var titleAlignOptions: titleAlignOptions[] = [
		{ name: "Left", value: "left" },
		{ name: "Center", value: "center" },
	];

	const setGenerateTitle = (type: string) => {
		setGenerateTitleToStore(propKey, type);
	};

	const renderTitleOptions = () =>
		titleOptions.map((option: TitleOptions) => {
			return (
				<div
					key={option.type}
					className={
						option.type === generateTitle ? "radioButtonSelected" : "radioButton"
					}
					onClick={() => setGenerateTitle(option.type)}
					title={option.hintTitle}
				>
					{option.type}
				</div>
			);
		});

	const renderTitleAlignOptions = () =>
		titleAlignOptions.map((option: titleAlignOptions) => {
			return (
				<div
					key={option.value}
					className={
						option.value === titleAlignment ? "radioButtonSelected" : "radioButton"
					}
					onClick={() => setTitleAlignment(propKey, option.value)}
				>
					{option.name}
				</div>
			);
		});

	return (
		<React.Fragment>
			<div className="optionsInfo">
				<div className="radioButtons">{renderTitleOptions()}</div>
			</div>
			<div className="optionsInfo">
				<div className="optionDescription">TITLE ALIGN</div>
				<div className="radioButtons">{renderTitleAlignOptions()}</div>
				<div className="optionDescription">TITLE FONT SIZE</div>
				<div className="optionDescription">
					<InputPositiveNumber
						value={chartProp.properties[propKey].titleOptions.fontSize}
						updateValue={(value: number) => setTitleSize(propKey, value)}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

const mapStateToProps = (state: ControlDetailStateProps) => {
	return {
		chartProp: state.chartProperties,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setGenerateTitleToStore: (propKey: number | string, option: string) =>
			dispatch(setGenerateTitle(propKey, option)),
		setTitleAlignment: (propKey: number | string, align: string) =>
			dispatch(setTitleAlignment(propKey, align)),
		setTitleSize: (propKey: number | string, value: number) =>
			dispatch(setTitleSize(propKey, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartTitle);
