import { Popover } from "@mui/material";
import { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { updateSankeyStyleOptions } from "../../../redux/ChartPoperties/ChartControlsActions";
import { ChartOptionsProps, ChartOptionsStateProps } from "../CommonInterfaceForChartOptions";
import { ColorSchemes } from "./ColorScheme";
import Logger from "../../../Logger";

const SankeyColorControls = ({
	// state
	chartControls,
	tabTileProps,
	chartProperties,

	// dispatch
	updateSankeyStyleOptions,
}: ChartOptionsProps & {
	updateSankeyStyleOptions: (propKey: string, option: string, value: any) => void;
}) => {
	var propKey = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;
	let chartData = chartControls.properties[propKey].chartData
		? chartControls.properties[propKey].chartData
		: "";

	var colorSchemes = ColorSchemes[6].colors;

	const [isColorPopoverOpen, setColorPopOverOpen] = useState<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<string>("");
	const [dims, setdims] = useState<any>([]);
	const [indexOfNode, setindexOfNode] = useState<any>();
	const [nameOfNode, setnameOfNode] = useState<any>();

	useEffect(() => {
		if (chartData) {
			if (chartControls.properties[propKey].sankeyControls.nodesAndColors.length === 0) {
				let values = [];
				values = chartProperties.properties[propKey].chartAxes[1].fields.map((el, i) => {
					return { nodeName: el.fieldname, nodeColor: colorSchemes[i] };
				});
				setdims(values);
				Logger("info", "🚀 ~ file: SankeyColorControls.js ~ line 30 ~ useEffect ~ dims", dims);
				updateSankeyStyleOptions(propKey, "nodesAndColors", values);
			} else {
				setdims(chartControls.properties[propKey].sankeyControls.nodesAndColors);
			}
		}
	}, [chartData]);

	const renderNodesAndColors = () => {
		if (dims.length !== 0) {
			return dims.map((item: any, i: number) => {
				return (
					<div className="optionDescription">
						<label style={{ width: "40%" }}>{item.nodeName}</label>
						<div
							style={{
								height: "1.25rem",
								width: "50%",
								marginLeft: "20px",
								backgroundColor: item.nodeColor,
								color: item.nodeColor,
								border: "2px solid darkgray",
								margin: "auto",
							}}
							onClick={() => {
								setSelectedItem("nodeColor");
								setindexOfNode(i);
								setnameOfNode(item.nodeName);
								setColorPopOverOpen(!isColorPopoverOpen);
							}}
						></div>
					</div>
				);
			});
		}
	};

	const setColorsToIndNodes = (color: string) => {
		var values = chartControls.properties[propKey].sankeyControls.nodesAndColors;
		values = values.map((el, i) => {
			if (el.nodeName === nameOfNode && i === indexOfNode) {
				el.nodeColor = color;
			}
			return el;
		});

		updateSankeyStyleOptions(propKey, "nodesAndColors", values);
	};

	return (
		<div className="optionsInfo">
			<div>{renderNodesAndColors()}</div>
			<div
				style={{ borderTop: "1px solid rgb(211,211,211)", margin: "0.5rem 6% 1rem" }}
			></div>
			<div className="optionDescription">
				<label style={{ width: "40%" }}>Link Color</label>
				<div
					style={{
						height: "1.25rem",
						width: "50%",
						marginLeft: "20px",
						backgroundColor: chartControls.properties[propKey].sankeyControls.linkColor,
						color: chartControls.properties[propKey].sankeyControls.linkColor,
						border: "2px solid darkgray",
						margin: "auto",
					}}
					onClick={() => {
						setSelectedItem("linkColor");
						setColorPopOverOpen(!isColorPopoverOpen);
					}}
				></div>
			</div>
			<Popover
				open={isColorPopoverOpen}
				onClose={() => setColorPopOverOpen(false)}
				onClick={() => setColorPopOverOpen(false)}
				anchorReference="anchorPosition"
				anchorPosition={{ top: 350, left: 1300 }}
			>
				<div>
					<SketchPicker
						// color={chartControls.properties[propKey].sankeyControls[selectedItem]}
						className="sketchPicker"
						width="16rem"
						// styles={{ padding: "0" }}
						onChangeComplete={color => {
							if (selectedItem === "linkColor") {
								updateSankeyStyleOptions(propKey, selectedItem, color.hex);
							} else {
								setColorsToIndNodes(color.hex);
							}
						}}
						onChange={color => {
							if (selectedItem === "linkColor") {
								updateSankeyStyleOptions(propKey, selectedItem, color.hex);
							} else {
								setColorsToIndNodes(color.hex);
							}
						}}
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
		chartProperties: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateSankeyStyleOptions: (propKey: string, option: string, value: any) =>
			dispatch(updateSankeyStyleOptions(propKey, option, value)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SankeyColorControls);
