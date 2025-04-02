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
import InputPositiveNumber from "../CommonFunctions/InputPositiveNumber";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import { TextField } from "@mui/material";
import { textFieldStyleProps } from "../GridAndAxes/GridAndAxes";
import { updateCardControls } from "../../../redux/ChartPoperties/ChartControlsActions";

var titleOptions: any[] = [
	{ type: "Auto",title:'Reset title'},
	{ type: "Manual", hintTitle: "Click to Select Manual" ,title:'Manual'},
];

var titleAlignOptions: any[] = [
	{ name: "Left", value: "left" },
	{ name: "Center", value: "center" },
];

export const RenderTitleOptions: any = ({ generateTitle, setTitleOption }: any) =>
	titleOptions.map((option: any) => {
		const isSelected = option.type === generateTitle;
		return (
			<div
				key={option.type}
				className={isSelected ? "radioButtonSelected" : "radioButton"}
				onClick={() => setTitleOption(option.type)}
				title={option.hintTitle}
				style={{					
					backgroundColor: isSelected? "rgba(224, 224, 224, 1)" : "white",
					cursor: isSelected? "auto" : "pointer",
					fontWeight: isSelected? "600" : "normal",
				}}
			>
				{option.type}
			</div>
		);
	});

export const RenderTitleAlignOptions: any = ({ titleAlignment, changeTitleAlignment }: any) =>
	titleAlignOptions.map((option: any) => {
		const isSelected = option.value === titleAlignment;
		return (
			<div
				key={option.value}
				className={isSelected ? "radioButtonSelected" : "radioButton"}
				onClick={() => changeTitleAlignment(option.value)}
				style={{
					backgroundColor: isSelected? "rgba(224, 224, 224, 1)" : "white",
					cursor: isSelected? "auto" : "pointer",
					fontWeight: isSelected? "600" : "normal",
				}}
			>
				{option.name}
			</div>
		);
	});

interface ChartTitleProps {
	setGenerateTitleToStore: (propKey: string, option: string) => void;
	setTitleAlignment: (propKey: string, align: string) => void;
	setTitleSize: (propKey: string, value: number) => void;
	updateCardControls: (propKey: string, option: string, value: number) => void;
}
const ChartTitle = ({
	// state
	chartProperties,
	tabTileProps,
	chartControls,

	// dispatch
	setGenerateTitleToStore,
	setTitleAlignment,
	setTitleSize,
	updateCardControls,
}: ChartOptionsProps & ChartTitleProps) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	var generateTitle: string = chartProperties.properties[propKey].titleOptions.generateTitle;
	var titleAlignment: string = chartProperties.properties[propKey].titleOptions.titleAlign;

	const setGenerateTitle = (type: string) => {
		setGenerateTitleToStore(propKey, type);
	};

	const changeTitleAlignment = (value: string) => {
		setTitleAlignment(propKey, value);
	};

	return (
		<React.Fragment>
			{chartProperties.properties[propKey].chartType === "simplecard" ? (
				<div className="optionsInfo">
					<div className="optionDescription">Title Align</div>
					<TextField
						value={chartControls.properties[propKey].cardControls.subText}
						variant="outlined"
						onChange={(e: any) => {
							updateCardControls(propKey, "subText", e.target.value);
						}}
						InputProps={{ ...textFieldStyleProps }}
					/>
				</div>
			) : (
				<>
					<div className="optionsInfo">
					<div className="radioButtons" style={{ marginTop: "15px" }}>
							<RenderTitleOptions
								generateTitle={generateTitle}
								setTitleOption={setGenerateTitle}
							/>
						</div>
					</div>
					<div className="optionsInfo">
						<div className="optionDescription" style={{ paddingLeft: "0.5rem" }}>Title Align</div>
						<div className="radioButtons">
							<RenderTitleAlignOptions
								titleAlignment={titleAlignment}
								changeTitleAlignment={changeTitleAlignment}
							/>
						</div>
						<div className="optionDescription" style={{ paddingLeft: "0.5rem" }}>Title Font Size</div>
						<div className="optionDescription" style={{ marginLeft: "-3px", marginTop: "3px", borderRadius: "1px" }}>
							<InputPositiveNumber
								value={chartProperties.properties[propKey].titleOptions.fontSize}
								updateValue={(value: number) => setTitleSize(propKey, value)}								
							/>
						</div>
					</div>
				</>
			)}
		</React.Fragment>
	);
};

const mapStateToProps = (state: ChartOptionsStateProps, ownProps: any) => {
	return {
		chartProperties: state.chartProperties,
		tabTileProps: state.tabTileProps,
		chartControls: state.chartControls,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setGenerateTitleToStore: (propKey: string, option: string) =>
			dispatch(setGenerateTitle(propKey, option)),
		setTitleAlignment: (propKey: string, align: string) =>
			dispatch(setTitleAlignment(propKey, align)),
		setTitleSize: (propKey: string, value: number) => dispatch(setTitleSize(propKey, value)),
		updateCardControls: (propKey: string, option: string, value: any) =>
			dispatch(updateCardControls(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ChartTitle);
