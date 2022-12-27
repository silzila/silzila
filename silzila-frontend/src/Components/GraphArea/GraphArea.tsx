// This container displays the following
// 	- Graph title and the actual chart
// 	- Controls to resize the graph to
// 		- Fit tile area
// 		- Match Dashboard size
// 		- Full screen view
// 	- Also provides the sql query used to generate data for this graph
import { connect } from "react-redux";
import { useEffect, useLayoutEffect, useState } from "react";
import { Dispatch } from "redux";
import { setChartTitle, setGenerateTitle } from "../../redux/ChartPoperties/ChartPropertiesActions";
import { toggleGraphSize } from "../../redux/TabTile/TileActions";
import AreaChart from "../Charts/AreaChart";
import DoughnutChart from "../Charts/DoughnutChart";
import FunnelChart from "../Charts/FunnelChart";
import GaugeChart from "../Charts/GaugeChart";
import HeatMap from "../Charts/HeatMap";
import HorizontalBar from "../Charts/HorizontalBar";
import Horizontalstacked from "../Charts/Horizontalstacked";
import LineChart from "../Charts/LineChart";
import PieChart from "../Charts/PieChart";
import RoseChart from "../Charts/RoseChart";
import ScatterChart from "../Charts/ScatterChart";
import StackedBar from "../Charts/StackedBar";
import { CloseRounded } from "@mui/icons-material";
import CodeIcon from "@mui/icons-material/Code";
import BarChartIcon from "@mui/icons-material/BarChart";
import Sankey from "../Charts/Sankey";
import TreeMap from "../Charts/TreeMap";
import BoxPlotChart from "../Charts/BoxPlotChart";
import CalendarChart from "../Charts/CalendarChart";
import StackedAreaChart from "../Charts/StackedAreaChart";
import MultiBarChart from "../Charts/MultiBarChart";
import SyntaxHighlighter from "react-syntax-highlighter";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import TextEditor from "../Charts/TextEditor";
import CrossTabChart from '../Charts/CrossTab/CrossTabChart'

const GraphArea = ({
	// state
	tileState,
	tabState,
	tabTileProps,
	chartProperties,
	chartControlState,

	// dispatch
	setChartTitle,
	setGenerateTitleToStore,
	toggleGraphSize,
}: any) => {
	var propKey: number = parseFloat(
		`${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`
	);

	const [graphDimension, setGraphDimension] = useState<any>({});
	const [graphDimension2, setGraphDimension2] = useState<any>({});
	const [editTitle, setEditTitle] = useState<boolean>(false);

	const [showSqlCode, setShowSqlCode] = useState<boolean>(false);
	const [fullScreen, setFullScreen] = useState<boolean>(false);

	const graphDimensionCompute = () => {
		if (tileState.tiles[propKey].graphSizeFull) {
			const height =
				(document.getElementById("graphContainer") as HTMLElement).clientHeight - 30;
			// const height = document.getElementById("graphContainer").clientHeight;
			const width =
				(document.getElementById("graphContainer") as HTMLElement).clientWidth - 30;

			setGraphDimension({
				height,
				width,
			});
		} else {
			setGraphDimension({
				height:
					tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails[propKey].height *
					tabTileProps.dashGridSize.y,
				width:
					tabState.tabs[tabTileProps.selectedTabId].dashTilesDetails[propKey].width *
					tabTileProps.dashGridSize.x,
			});
		}
	};

	const graphDimensionCompute2 = () => {
		const height = (document.getElementById("graphFullScreen") as HTMLElement).clientHeight;
		const width = (document.getElementById("graphFullScreen") as HTMLElement).clientWidth;
		setGraphDimension2({
			height,
			width,
		});
	};

	useLayoutEffect(() => {
		function updateSize() {
			graphDimensionCompute();
			if (fullScreen) graphDimensionCompute2();
		}
		window.addEventListener("resize", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, [
		fullScreen,
		tabTileProps.showDataViewerBottom,
		tabTileProps.selectedControlMenu,
		tileState.tiles[propKey].graphSizeFull,
	]);

	const removeFullScreen = (e: any) => {
		//console.log(e.keyCode);
		if (e.keyCode === 27) {
			setFullScreen(false);
		}
	};

	const chartDisplayed = () => {
		switch (chartProperties.properties[propKey].chartType) {
			case "multibar":
				return (
					<MultiBarChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);

			case "stackedBar":
				return (
					<StackedBar
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);

			case "horizontalBar":
				return (
					<HorizontalBar
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);

			case "horizontalStacked":
				return (
					<Horizontalstacked
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);

			case "crossTab":
				return (
					<CrossTabChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);

			case "scatterPlot":
				return (
					<ScatterChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);
			case "area":
				return (
					<AreaChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);
			case "pie":
				return (
					<PieChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);
			case "donut":
				return (
					<DoughnutChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);
			case "rose":
				return (
					<RoseChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);
			case "line":
				return (
					<LineChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);
			case "funnel":
				return (
					<FunnelChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);

			case "gauge":
				return (
					<GaugeChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);

			case "heatmap":
				return (
					<HeatMap
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);

			// case "geoChart":
			// 	return (
			// 		<GeoChart
			// 			propKey={propKey}
			// 			graphDimension={fullScreen ? graphDimension2 : graphDimension}
			// 			graphTileSize={tileState.tiles[propKey].graphSizeFull}
			// 		/>
			// 	);
			case "stackedArea":
				return (
					<StackedAreaChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);
			case "calendar":
				return (
					<CalendarChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);
			case "boxPlot":
				return (
					<BoxPlotChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);
			case "treeMap":
				return (
					<TreeMap
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);
			case "sankey":
				return (
					<Sankey
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);
			case "richText":
				return (
					<TextEditor
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey].graphSizeFull}
					/>
				);

			default:
				return <h2>Work in progress</h2>;
		}
	};

	// ############################################
	// Setting title automatically
	// ############################################

	const graphTitle = () => {
		if (chartProperties.properties[propKey].titleOptions.generateTitle === "Auto") {
			const chartAxes = chartProperties.properties[propKey].chartAxes;

			var dims: any[] = [];
			var measures: any[] = [];

			// Compile dimensions and measures of different chart types in one format
			switch (chartProperties.properties[propKey].chartType) {
				case "crossTab":
				case "heatmap":
					dims = dims.concat(chartAxes[1].fields);
					dims = dims.concat(chartAxes[2].fields);
					measures = measures.concat(chartAxes[3].fields);
					break;

				case "scatterPlot":
					dims = dims.concat(chartAxes[1].fields);
					measures = measures.concat(chartAxes[2].fields);
					measures = measures.concat(chartAxes[3].fields);
					break;

				case "gauge":
				case "funnel":
					measures = measures.concat(chartAxes[1].fields);
					break;

				default:
					dims = dims.concat(chartAxes[1].fields);
					measures = measures.concat(chartAxes[2].fields);
					break;
			}

			var title = "";

			// Concatenate field names in dims / measures
			const concatenateFields = (fields: any) => {
				if (fields.length > 0) {
					var tempTitle = "";
					fields.forEach((element: any, index: number) => {
						if (index === 0) {
							var titlePart = element.fieldname;
							tempTitle = tempTitle + titlePart;
						}
						if (index > 0) {
							var titlePart: any = `, ${element.fieldname}`;
							tempTitle = tempTitle + titlePart;
						}
					});

					return tempTitle;
				}
			};

			var dimTitle = concatenateFields(dims);
			var measureTitle = concatenateFields(measures);

			if (
				chartProperties.properties[propKey].chartType === "gauge" ||
				chartProperties.properties[propKey].chartType === "funnel"
			) {
				title = measureTitle ? measureTitle : "";
			} else if (chartProperties.properties[propKey].chartType === "richText") {
				title = "Rich Text Editor Title";
			} else {
				title = measureTitle ? measureTitle : "";
				title = dimTitle ? title + ` by ${dimTitle}` : "";
			}

			title = title.charAt(0).toUpperCase() + title.slice(1);

			setChartTitle(propKey, title);
		}
	};

	useEffect(() => {
		graphTitle();
	}, [
		chartProperties.properties[propKey].chartAxes,
		chartProperties.properties[propKey].titleOptions.generateTitle,
	]);

	// ############################################
	// Manual title entry
	// ############################################

	const editTitleText = () => {
		// if (chartProperties.properties[propKey].generateTitle === "Manual") {
		setEditTitle(true);
		setGenerateTitleToStore(propKey, "Manual");
		// }
	};

	useEffect(() => {
		setTitleText(chartProperties.properties[propKey].titleOptions.chartTitle);
	}, [chartProperties.properties[propKey].titleOptions.chartTitle]);

	const [inputTitleText, setTitleText] = useState<string>("");
	const handleTitleChange = (e: any) => {
		setTitleText(e.target.value);
	};

	const completeRename = () => {
		setChartTitle(propKey, inputTitleText);
		setEditTitle(false);
	};

	const ShowFormattedQuery = () => {
		var query = chartControlState.properties[propKey].chartData?.query;

		return (
			<SyntaxHighlighter
				className="syntaxHighlight"
				language="sql"
				// style={a11yLight}
				showLineNumbers={true}
			>
				{query ? query : null}
			</SyntaxHighlighter>
		);
	};

	const RenderScreenOption = () => {
		return (
			<>
				<div
					className={
						!tileState.tiles[propKey].graphSizeFull
							? "graphAreaIconsSelected"
							: "graphAreaIcons"
					}
					title="Match Dashboard Size"
					style={
						tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.includes(propKey)
							? {}
							: { cursor: "not-allowed" }
					}
					onClick={() => {
						if (
							tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.includes(
								propKey
							)
						)
							toggleGraphSize(propKey, false);
					}}
				>
					<FullscreenExitIcon />
				</div>

				<div
					className={
						tileState.tiles[propKey].graphSizeFull
							? "graphAreaIconsSelected"
							: "graphAreaIcons"
					}
					title="Fit Tile Size"
					onClick={() => toggleGraphSize(propKey, true)}
				>
					<FullscreenIcon />
				</div>
			</>
		);
	};

	return (
		<div className="centerColumn">
			<div className="graphTitleAndEdit">
				{editTitle ? (
					<form
						style={{ width: "100%" }}
						onSubmit={(evt: any) => {
							evt.currentTarget.querySelector("input").blur();
							evt.preventDefault();
						}}
					>
						<input
							autoFocus
							style={{
								fontSize: chartProperties.properties[propKey].titleOptions.fontSize,

								textAlign:
									chartProperties.properties[propKey].titleOptions.titleAlign,
							}}
							type="text"
							className="editTitle"
							value={inputTitleText}
							onChange={handleTitleChange}
							onBlur={() => completeRename()}
						/>
					</form>
				) : (
					<>
						<div
							className="graphTitle"
							style={{
								fontSize: chartProperties.properties[propKey].titleOptions.fontSize,
								textAlign:
									chartProperties.properties[propKey].titleOptions.titleAlign,
								paddingLeft:
									chartProperties.properties[propKey].titleOptions
										.titleLeftPadding,
							}}
							onDoubleClick={() => editTitleText()}
							title="Double click to set title manually"
						>
							{chartProperties.properties[propKey].titleOptions.chartTitle}
						</div>
					</>
				)}

				{!showSqlCode ? (
					tabState.tabs[tabTileProps.selectedTabId].showDash ? null : (
						<>
							<RenderScreenOption />
							<div
								className="graphAreaIcons"
								onClick={() => setFullScreen(true)}
								title="Show full screen"
							>
								<OpenInFullIcon />
							</div>
						</>
					)
				) : null}
				<div
					style={{
						borderRight: "1px solid rgb(211,211,211)",
						margin: "6px 2px",
					}}
				></div>
				{showSqlCode ? (
					<div
						className="graphAreaIcons"
						onClick={() => setShowSqlCode(false)}
						title="View graph"
					>
						<BarChartIcon />
					</div>
				) : (
					<div
						className="graphAreaIcons"
						onClick={() => setShowSqlCode(true)}
						title="View SQL Code"
					>
						<CodeIcon />
					</div>
				)}
			</div>

			<div
				id="graphContainer"
				className="graphContainer"
				style={{ margin: tileState.tiles[propKey].graphSizeFull ? "0" : "1rem" }}
			>
				{showSqlCode ? <ShowFormattedQuery /> : chartDisplayed()}
			</div>
			{/* <ChartThemes /> */}
			{fullScreen ? (
				<div
					tabIndex={0}
					id="graphFullScreen"
					className="graphFullScreen"
					onKeyDown={e => {
						//console.log("Key pressed");
						removeFullScreen(e);
					}}
				>
					<div style={{ display: "flex" }}>
						<span
							className="graphTitle"
							style={{
								fontSize: chartProperties.properties[propKey].titleOptions.fontSize,
							}}
							onDoubleClick={() => editTitleText()}
						>
							{chartProperties.properties[propKey].titleOptions.chartTitle}
						</span>
						<CloseRounded
							style={{ margin: "0.25rem" }}
							onClick={() => setFullScreen(false)}
						/>
					</div>
					{chartDisplayed()}
				</div>
			) : null}
		</div>
	);
};

const mapStateToProps = (state: any) => {
	return {
		tileState: state.tileState,
		tabState: state.tabState,
		tabTileProps: state.tabTileProps,
		chartControlState: state.chartControls,
		chartProperties: state.chartProperties,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setChartTitle: (propKey: number, title: string) => dispatch(setChartTitle(propKey, title)),
		setGenerateTitleToStore: (propKey: number, option: any) =>
			dispatch(setGenerateTitle(propKey, option)),
		toggleGraphSize: (tileKey: number, graphSize: boolean | any) =>
			dispatch(toggleGraphSize(tileKey, graphSize)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphArea);
