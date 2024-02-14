import { Popover } from "@mui/material";
import React, { useState } from "react";
import { ColorResult, SketchPicker } from "react-color";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateTreeMapStyleOptions } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import SliderWithInput from "../SliderWithInput";
import SwitchWithInput from "../SwitchWithInput";

const TreeMapLegend = ({
	// state
	tabTileProps,
	chartControls,

	// dispatch
	updateTreeMapStyleOptions,
}: ChartOptionsProps & {
	updateTreeMapStyleOptions: (propKey: string, option: string, value: any) => void;
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	const treeLegend = chartControls.properties[propKey].treeMapChartControls;
	const [isColorPopoverOpen, setColorPopOverOpen] = useState<boolean>(false);

	const itemWidthMinMax: any = { min: 25, max: 50, step: 1 };
	const itemHeightMinMax: any = { min: 25, max: 50, step: 1 };

	return (
		<div className="optionsInfo">
			<div className="optionDescription" style={{ padding: "0 6% 5px 4%" }}>
				<label
					htmlFor="enableDisable"
					className="enableDisableLabel"
					style={{ marginRight: "10px" }}
				>
					Show Breadcrumb
				</label>
				<SwitchWithInput
					isChecked={treeLegend.showBreadCrumb}
					onSwitch={() => {
						updateTreeMapStyleOptions(
							propKey,
							"showBreadCrumb",
							!treeLegend.showBreadCrumb
						);
					}}
				/>
			</div>
			{treeLegend.showBreadCrumb ? (
				<React.Fragment>
					<div className="optionDescription">Width</div>
					<SliderWithInput
						sliderValue={treeLegend.bcWidth}
						sliderMinMax={itemWidthMinMax}
						changeValue={(value: any) =>
							updateTreeMapStyleOptions(propKey, "bcWidth", value)
						}
					/>
					<div className="optionDescription">Height</div>
					<SliderWithInput
						sliderValue={treeLegend.bcHeight}
						sliderMinMax={itemHeightMinMax}
						changeValue={(value: any) =>
							updateTreeMapStyleOptions(propKey, "bcHeight", value)
						}
					/>

					<div className="optionDescription">
						<label
							htmlFor="enableDisable"
							className="enableDisableLabel"
							style={{ marginRight: "10px" }}
						>
							Breadcrumb Color
						</label>
						<div
							style={{
								height: "1.25rem",
								width: "50%",
								marginLeft: "20px",
								backgroundColor: treeLegend.bcColor,
								color: treeLegend.bcColor,
								border: "2px solid darkgray",
								margin: "auto",
							}}
							onClick={() => {
								setColorPopOverOpen(!isColorPopoverOpen);
							}}
						>
							{"  "}
						</div>
					</div>
				</React.Fragment>
			) : null}
			<Popover
				open={isColorPopoverOpen}
				onClose={() => setColorPopOverOpen(false)}
				onClick={() => setColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						color={treeLegend.bcColor}
						className="sketchPicker"
						width="16rem"
						// styles={{ padding: "0" }}
						onChangeComplete={(color: ColorResult) => {
							updateTreeMapStyleOptions(propKey, "bcColor", color.hex);
						}}
						onChange={(color: ColorResult) =>
							updateTreeMapStyleOptions(propKey, "bcColor", color.hex)
						}
						disableAlpha
					/>
				</div>
			</Popover>
		</div>
	);
};

const mapStateToProps = (state: ChartOptionsStateProps, ownProps: any) => {
	return {
		chartControls: state.chartControls,
		tabTileProps: state.tabTileProps,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateTreeMapStyleOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateTreeMapStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TreeMapLegend);
