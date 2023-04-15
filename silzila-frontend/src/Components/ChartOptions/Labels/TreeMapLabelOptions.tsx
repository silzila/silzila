import { FormControl, MenuItem, Select } from "@mui/material";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateTreeMapStyleOptions } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";

const menuItemStyle = {
	padding: "2px 10px",
	fontSize: "12px",
};

const SelectComponentStyle = {
	fontSize: "12px",
	width: "90%",
	margin: "0 auto 0.5rem auto",
	backgroundColor: "white",
	height: "1.5rem",
	color: "#404040",
};

const TreeMapLabelOptions = ({
	//  state
	chartControls,
	tabTileProps,

	//  dispatch

	updateTreeMapStyleOptions,
}: ChartOptionsProps & {
	updateTreeMapStyleOptions: (propKey: string, option: string, value: any) => void;
}) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	const treeMapLabelOptionList = [
		{ name: "Top", value: "top" },
		{ name: "Left", value: "left" },
		{ name: "Right", value: "right" },
		{ name: "Bottom", value: "bottom" },
		{ name: "Inside", value: "inside" },
		{ name: "Inside Left", value: "insideLeft" },
		{ name: "Inside Right", value: "insideRight" },
		{ name: "Inside Top", value: "insideTop" },
		{ name: "Inside Bottom", value: "insideBottom" },
		{ name: "Inside Top Left", value: "insideTopLeft" },
		{ name: "Inside Bottom Left", value: "insideBottomLeft" },
		{ name: "Inside Top Right", value: "insideTopRight" },
		{ name: "Inside Bottom Right", value: "insideBottomRight" },
	];

	const treeMapLabelRotationOption = [
		{ name: "Horizondal", value: 0 },
		{ name: "Vertical", value: 90 },
		{ name: "Vertical Flip", value: -90 },
	];
	return (
		<React.Fragment>
			<div className="optionDescription">Label Position</div>
			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={chartControls.properties[propKey].treeMapChartControls.labelPosition}
					variant="outlined"
					onChange={e => {
						updateTreeMapStyleOptions(propKey, "labelPosition", e.target.value);
					}}
					sx={SelectComponentStyle}
				>
					{treeMapLabelOptionList.map(position => {
						return (
							<MenuItem value={position.value} key={position.name} sx={menuItemStyle}>
								{position.name}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
			<div className="optionDescription">Label Rotate</div>
			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={chartControls.properties[propKey].treeMapChartControls.labelRotate}
					variant="outlined"
					onChange={e => {
						updateTreeMapStyleOptions(propKey, "labelRotate", e.target.value);
					}}
					sx={SelectComponentStyle}
				>
					{treeMapLabelRotationOption.map(position => {
						return (
							<MenuItem value={position.value} key={position.name} sx={menuItemStyle}>
								{position.name}
							</MenuItem>
						);
					})}
				</Select>
			</FormControl>
			<div className="optionDescription">Label Overflow</div>
			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={chartControls.properties[propKey].treeMapChartControls.overFlow}
					variant="outlined"
					onChange={e => {
						updateTreeMapStyleOptions(propKey, "overFlow", e.target.value);
					}}
					sx={SelectComponentStyle}
				>
					<MenuItem sx={menuItemStyle} value="truncate">
						Truncate
					</MenuItem>
					<MenuItem sx={menuItemStyle} value="break">
						Break
					</MenuItem>
				</Select>
			</FormControl>
			<div
				style={{ borderTop: "1px solid rgb(211,211,211)", margin: "0.5rem 6% 1rem" }}
			></div>
			<div className="optionDescription">Horizondal Align of Label</div>
			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={chartControls.properties[propKey].treeMapChartControls.horizondalAlign}
					variant="outlined"
					onChange={e => {
						updateTreeMapStyleOptions(propKey, "horizondalAlign", e.target.value);
					}}
					sx={SelectComponentStyle}
				>
					<MenuItem sx={menuItemStyle} value="left">
						Left
					</MenuItem>
					<MenuItem sx={menuItemStyle} value="center">
						Center
					</MenuItem>
					<MenuItem sx={menuItemStyle} value="right">
						Right
					</MenuItem>
				</Select>
			</FormControl>
			<div className="optionDescription">Vertical Align of Label</div>
			<FormControl fullWidth size="small" style={{ fontSize: "12px", borderRadius: "4px" }}>
				<Select
					value={chartControls.properties[propKey].treeMapChartControls.verticalAlign}
					variant="outlined"
					onChange={e => {
						updateTreeMapStyleOptions(propKey, "verticleAlign", e.target.value);
					}}
					sx={SelectComponentStyle}
				>
					<MenuItem sx={menuItemStyle} value="top">
						Top
					</MenuItem>
					<MenuItem sx={menuItemStyle} value="middle">
						Middle
					</MenuItem>
					<MenuItem sx={menuItemStyle} value="bottom">
						Bottom
					</MenuItem>
				</Select>
			</FormControl>
		</React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(TreeMapLabelOptions);
