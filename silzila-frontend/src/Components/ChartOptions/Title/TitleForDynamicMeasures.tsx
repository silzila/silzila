import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import InputPositiveNumber from "../CommonFunctions/InputPositiveNumber";
import { updateTitleOptionsFordm } from "../../../redux/DynamicMeasures/DynamicMeasuresActions";
import { RenderTitleAlignOptions, RenderTitleOptions } from "./ChartTitle";

const TitleForDynamicMeasure = ({ dynamicMeasureState, updateTitleOptionsFordm }: any) => {
	var tabId = dynamicMeasureState.selectedTabId;
	var tileId = dynamicMeasureState.selectedTileId;
	var dmId = dynamicMeasureState.selectedDynamicMeasureId;
	var dmPropKey = `${tileId}.${dmId}`;
	var selectedChartProps =
		dynamicMeasureState.dynamicMeasureProps?.[tabId]?.[tileId]?.[dmPropKey];
	var generateTitle: string = selectedChartProps?.titleOptions.generateTitle;
	var titleAlignment: string = selectedChartProps?.titleOptions.titleAlign;

	const setGenerateTitle = (type: string) => {
		updateTitleOptionsFordm(tabId, tileId, dmPropKey, "generateTitle", type);
	};

	const changeTitleAlignment = (value: string) => {
		updateTitleOptionsFordm(tabId, tileId, dmPropKey, "titleAlign", value);
	};

	return (
		<React.Fragment>
			<>
				<div className="optionsInfo">
					<div className="radioButtons">
						<RenderTitleOptions
							generateTitle={generateTitle}
							handleOnClick={setGenerateTitle}
						/>
					</div>
				</div>
				<div className="optionsInfo">
					<div className="optionDescription">TITLE ALIGN</div>
					<div className="radioButtons">
						<RenderTitleAlignOptions
							titleAlignment={titleAlignment}
							changeTitleAlignment={changeTitleAlignment}
						/>
					</div>
					<div className="optionDescription">TITLE FONT SIZE</div>
					<div className="optionDescription">
						<InputPositiveNumber
							value={selectedChartProps?.titleOptions.fontSize}
							updateValue={(value: number) =>
								updateTitleOptionsFordm(tabId, tileId, dmPropKey, "fontSize", value)
							}
						/>
					</div>
				</div>
			</>
		</React.Fragment>
	);
};

const mapStateToProps = (state: any, ownProps: any) => {
	return {
		dynamicMeasureState: state.dynamicMeasuresState,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateTitleOptionsFordm: (
			tabId: number,
			tileId: number,
			dmPropKey: string,
			option: string,
			value: any
		) => dispatch(updateTitleOptionsFordm(tabId, tileId, dmPropKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TitleForDynamicMeasure);
