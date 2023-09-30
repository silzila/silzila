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
import { CloseRounded, MoreVertOutlined } from "@mui/icons-material";
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
import CrossTabChart from "../Charts/CrossTab/CrossTabChart";
import FetchData from "../ServerCall/FetchData";
import { getChartData } from "../ChartAxes/ChartData";
import {
	updateChartMargins,
	updateQueryResult,
} from "../../redux/ChartPoperties/ChartControlsActions";
import { Button, Popover } from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DownloadPagePopover from "../CommonFunctions/PopOverComponents/DownloadPagePopover";
import {
	resetPageSettings,
	setPageSettings,
} from "../../redux/PageSettings/DownloadPageSettingsActions";
import { toPng } from "html-to-image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import sqlIcon from "../../assets/sqlCodeIcon.png";
import DoneIcon from "@mui/icons-material/Done";
import SimpleCard from "../Charts/SimpleCard";
import { renameDynamicMeasure } from "../../redux/DynamicMeasures/DynamicMeasuresActions";
import { formatChartLabelValue } from "../ChartOptions/Format/NumberFormatter";
import TableChart from "../Charts/TableChart/TableChart";
import Logger from "../../Logger";

const popoverButtonStyle = {
	textTransform: "none",
	color: "grey",
	display: "block",
	width: "100%",
};

const GraphArea = ({
	// state
	tileState,
	tabState,
	tabTileProps,
	chartProperties,
	chartGroup,
	chartControlState,
	token,
	pageSettings,
	dashBoardGroup,
	dynamicMeasureState,

	// dispatch
	setChartTitle,
	setGenerateTitleToStore,
	toggleGraphSize,
	updateQueryResult,
	updateMargin,
	setPageSettings,
	resetPageSettings,
	renameDynamicMeasure,
	updateConditionalFormatStyleOptions,
}: any) => {
	var propKey: string = `${tabTileProps.selectedTabId}.${tabTileProps.selectedTileId}`;

	var selectedDynamicMeasureProp =
		dynamicMeasureState.dynamicMeasureProps?.[`${dynamicMeasureState.selectedTabId}`]?.[
			`${dynamicMeasureState.selectedTileId}`
		]?.[
			`${dynamicMeasureState.selectedTileId}.${dynamicMeasureState.selectedDynamicMeasureId}`
		];

	const [backgroundColor, setBackgroundColor] = useState<string>("");
	const [fontColor, setFontColor] = useState<string>("");
	const [italicText, setItalicText] = useState<string>("");
	const [boldText, setBoldText] = useState<string>("");
	const [textUnderline, setTextUnderline] = useState<string>("");

	useEffect(() => {
		var formats = selectedDynamicMeasureProp?.conditionalFormats;

		if (formats?.length > 0) {
			for (let i = formats.length - 1; i >= 0; i--) {
				if (formats[i].isConditionSatisfied) {
					setBackgroundColor(formats[i].backgroundColor);
					setFontColor(formats[i].fontColor);
					setBoldText(formats[i].isBold ? "bold" : "normal");
					setItalicText(formats[i].isItalic ? "italic" : "normal");
					setTextUnderline(formats[i].isUnderlined ? "underline" : "none");
					return;
				}
				if (i === 0 && !formats[i].isConditionSatisfied) {
					setBackgroundColor(selectedDynamicMeasureProp?.styleOptions.backgroundColor);
					setFontColor(selectedDynamicMeasureProp?.styleOptions.fontColor);
					setBoldText(
						selectedDynamicMeasureProp?.styleOptions.isBold ? "bold" : "normal"
					);
					setItalicText(
						selectedDynamicMeasureProp?.styleOptions.isItalic ? "italic" : "normal"
					);
					setTextUnderline(
						selectedDynamicMeasureProp?.styleOptions.isUnderlined ? "underline" : "none"
					);
				}
			}
		} else {
			setBackgroundColor(selectedDynamicMeasureProp?.styleOptions.backgroundColor);
			setFontColor(selectedDynamicMeasureProp?.styleOptions.fontColor);
			setBoldText(selectedDynamicMeasureProp?.styleOptions.isBold ? "bold" : "normal");
			setItalicText(selectedDynamicMeasureProp?.styleOptions.isItalic ? "italic" : "normal");
			setTextUnderline(
				selectedDynamicMeasureProp?.styleOptions.isUnderlined ? "underline" : "none"
			);
		}
	}, [selectedDynamicMeasureProp]);

	const [graphDimension, setGraphDimension] = useState<any>({});
	const [graphDimension2, setGraphDimension2] = useState<any>({});
	const [editTitle, setEditTitle] = useState<boolean>(false);

	const [showSqlCode, setShowSqlCode] = useState<boolean>(false);
	const [fullScreen, setFullScreen] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<any>();

	useEffect(() => {
		if (!tabTileProps.showDash) {
			if (pageSettings.callForDownload) {
				onDownload();
			}
		}
	}, [pageSettings.callForDownload]);
	useEffect(() => {
		setFullScreen(pageSettings.fullScreen);
	}, [pageSettings.fullScreen]);

	useEffect(() => {
		if (chartProperties.properties[propKey].chartType === "calendar") {
			if (chartControlState.properties[propKey].chartMargin.top < 13) {
				updateMargin(propKey, "top", 13);
			}
		}
	}, []);

	const graphDimensionCompute = () => {
		if (tileState.tiles[propKey]?.graphSizeFull) {
			const height =
				(document.getElementById("graphContainer") as HTMLElement).clientHeight - 30;
			// const height = (document.getElementById("graphContainer") as HTMLElement).clientHeight;
			// const width = (document.getElementById("graphContainer") as HTMLElement).clientWidth;
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
		tileState.tiles[propKey]?.graphSizeFull,
	]);

	const removeFullScreen = (e: any) => {
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
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);

			case "stackedBar":
				return (
					<StackedBar
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);

			case "horizontalBar":
				return (
					<HorizontalBar
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);

			case "horizontalStacked":
				return (
					<Horizontalstacked
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);

			case "crossTab":
				return (
					<CrossTabChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);

			case "scatterPlot":
				return (
					<ScatterChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);
			case "area":
				return (
					<AreaChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);
			case "pie":
				return (
					<PieChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);
			case "donut":
				return (
					<DoughnutChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);
			case "rose":
				return (
					<RoseChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);
			case "line":
				return (
					<LineChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);
			case "funnel":
				return (
					<FunnelChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);

			case "gauge":
				return (
					<GaugeChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);

			case "heatmap":
				return (
					<HeatMap
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);

			// case "geoChart":
			// 	return (
			// 		<GeoChart
			// 			propKey={propKey}
			// 			graphDimension={fullScreen ? graphDimension2 : graphDimension}
			// 			graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
			// 		/>
			// 	);
			case "stackedArea":
				return (
					<StackedAreaChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);
			case "calendar":
				return (
					<CalendarChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);
			case "boxPlot":
				return (
					<BoxPlotChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);
			case "treeMap":
				return (
					<TreeMap
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);
			case "sankey":
				return (
					<Sankey
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);
			case "richText":
				if (chartProperties.properties[propKey].isDynamicMeasureWindowOpened) {
					var data = selectedDynamicMeasureProp?.dmValue;
					// var formattedValue = data;
					var formattedValue = formatChartLabelValue(selectedDynamicMeasureProp, data);

					return (
						<div
							style={{
								color: fontColor,
								backgroundColor: backgroundColor,
								fontStyle: italicText,
								fontWeight: boldText,
								textDecoration: textUnderline,

								padding: "5px",
								width: "fit-content",
								overflow: "hidden",
								margin: "auto",
							}}
						>
							{data ? formattedValue : ""}
						</div>
					);
				} else {
					return (
						<TextEditor
							propKey={propKey}
							graphDimension={fullScreen ? graphDimension2 : graphDimension}
							graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
						/>
					);
				}
			case "simplecard":
				return (
					<SimpleCard
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					/>
				);
			case "table":
				return (
					<TableChart
						propKey={propKey}
						graphDimension={fullScreen ? graphDimension2 : graphDimension}
						graphTileSize={tileState.tiles[propKey]?.graphSizeFull}
					></TableChart>
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
				case "richText":
				case "funnel":
				case "simplecard":
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
							let titlePart = element.fieldname;
							tempTitle = tempTitle + titlePart;
						}
						if (index > 0) {
							let titlePart: any = `, ${element.fieldname}`;
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
				chartProperties.properties[propKey].chartType === "funnel" ||
				chartProperties.properties[propKey].chartType === "simplecard"
			) {
				title = measureTitle ? measureTitle : "";
			} else if (chartProperties.properties[propKey].chartType === "richText") {
				title = "Rich Text Editor Title";
			} else if (chartProperties.properties[propKey].chartType === "crossTab") {
				title = "Cross Tab Title";
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
		if (chartProperties.properties[propKey].chartType === "richText") {
			setTitleText(selectedDynamicMeasureProp?.editedDynamicMeasureName);
		} else {
			setTitleText(chartProperties.properties[propKey].titleOptions.chartTitle);
		}
	}, [
		chartProperties.properties[propKey].titleOptions.chartTitle,
		selectedDynamicMeasureProp?.dynamicMeasureName,
	]);

	const [inputTitleText, setTitleText] = useState<string>("");
	const handleTitleChange = (e: any) => {
		setTitleText(e.target.value);
	};

	const completeRename = () => {
		if (chartProperties.properties[propKey].chartType === "richText") {
			renameDynamicMeasure(inputTitleText);
		} else {
			setChartTitle(propKey, inputTitleText);
		}
		setEditTitle(false);
	};

	const ShowFormattedQuery = () => {
		var query = chartControlState.properties[propKey].queryResult;

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
						!tileState.tiles[propKey]?.graphSizeFull
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
						tileState.tiles[propKey]?.graphSizeFull
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

	const getSqlQuery = () => {
		getChartData(
			chartProperties.properties[propKey].chartAxes,
			chartProperties,
			chartGroup,
			dashBoardGroup,
			propKey,
			"Chartaxes",
			token,
			true
		).then(async data => {
			var url: string = "";
			if (chartProperties.properties[propKey].selectedDs.isFlatFileData) {
				url = `query?datasetid=${chartProperties.properties[propKey].selectedDs.id}`;
			} else {
				url = `query?dbconnectionid=${chartProperties.properties[propKey].selectedDs.connectionId}&datasetid=${chartProperties.properties[propKey].selectedDs.id}`;
			}
			var res: any = await FetchData({
				requestType: "withData",
				method: "POST",
				url: `${url}&sql=true`,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				data: data,
			});
			if (res.status) {
				updateQueryResult(propKey, res.data);
				setShowSqlCode(true);
			} else {
				window.alert("Error in getting sql Query");
			}
		});
	};

	/* 
	*************************************************
	ON DOWNLOAD PDF & ON DOWNLOAD IMAGE
	*************************************************
	*/

	const getHeightAndWidth = (paperHeight: number, paperWidth: number) => {
		var graphHeight = graphDimension2.height;
		var graphWidth = graphDimension2.width;

		const pageHeight = paperHeight - (pageSettings.top_margin + pageSettings.bottom_margin);
		const pageWidth = paperWidth - (pageSettings.right_margin + pageSettings.left_margin);
		var heightRatio = pageHeight / graphHeight;
		var widthRatio = pageWidth / graphWidth;

		// getting least value
		var ratio = Math.min(heightRatio, widthRatio);

		var finalHeight = graphHeight * ratio;
		var finalWidth = graphWidth * ratio;

		return { height: finalHeight, width: finalWidth };
	};

	// function calls when click on the download button after changing pagesettings(orientation,format,ppi)
	const onDownload = async () => {
		// getting  HTML element (chart in fullscreen) as a value in variable
		const input = document.getElementById("graphFullScreen") as HTMLElement;

		// genaration a date to give as a fileName
		const d = new Date();
		const id = `${tabTileProps.selectedTileName}_${d.getDate()}${
			d.getMonth() + 1
		}${d.getFullYear()}:${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;

		// this case will run if We clicked on Download PDF
		if (pageSettings.downloadType === "pdf") {
			html2canvas(input).then(canvas => {
				const imageData = canvas.toDataURL("image/png");
				const pdf = new jsPDF(
					pageSettings.SelectedOrientation,
					"px",
					pageSettings.selectedFormat
				);
				var width = pdf.internal.pageSize.getWidth();
				var height = pdf.internal.pageSize.getHeight();
				const heightAndWidth = getHeightAndWidth(height, width);

				pdf.addImage(
					imageData,
					"JPEG",
					pageSettings.left_margin,
					pageSettings.top_margin,
					heightAndWidth.width,
					heightAndWidth.height
				);
				pdf.save(`${id}`);
				setFullScreen(false);
				setPageSettings("openPageSettingPopover", false);
				setTimeout(() => {
					resetPageSettings();
				}, 300);
			});
		} else {
			toPng(input, { cacheBust: true })
				.then((dataUrl: any) => {
					const link = document.createElement("a");
					link.download = `${id}`;
					link.href = dataUrl;
					link.click();
					setPageSettings("openPageSettingPopover", false);
					setTimeout(() => {
						resetPageSettings();
					}, 300);
				})
				.catch((err: any) => {
					Logger("error", err);
				});
		}
	};

	return (
		<div className="centerColumn" id="centerColumn">
			{chartProperties.properties[propKey].chartType !== "simplecard" ? (
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
									fontSize: chartProperties.properties[propKey]
										.isDynamicMeasureWindowOpened
										? "25px"
										: chartProperties.properties[propKey].titleOptions.fontSize,

									textAlign: chartProperties.properties[propKey]
										.isDynamicMeasureWindowOpened
										? "left"
										: chartProperties.properties[propKey].titleOptions
												.titleAlign,
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
									fontSize: chartProperties.properties[propKey]
										.isDynamicMeasureWindowOpened
										? selectedDynamicMeasureProp?.fontSize
										: chartProperties.properties[propKey].titleOptions.fontSize,
									textAlign: chartProperties.properties[propKey]
										.isDynamicMeasureWindowOpened
										? selectedDynamicMeasureProp?.titleAlign
										: chartProperties.properties[propKey].titleOptions
												.titleAlign,
									paddingLeft: chartProperties.properties[propKey]
										.isDynamicMeasureWindowOpened
										? selectedDynamicMeasureProp?.titleLeftPadding
										: chartProperties.properties[propKey].titleOptions
												.titleLeftPadding,
								}}
								onDoubleClick={() => editTitleText()}
								title="Double click to set title manually"
							>
								{chartProperties.properties[propKey].isDynamicMeasureWindowOpened
									? selectedDynamicMeasureProp?.dynamicMeasureName
									: chartProperties.properties[propKey]?.titleOptions?.chartTitle}
							</div>
						</>
					)}

					{showSqlCode ? (
						<div
							className="graphAreaIcons"
							onClick={() => {
								setShowSqlCode(false);
							}}
							title="View graph"
						>
							<BarChartIcon />
						</div>
					) : (
						<>
							{!pageSettings.callForDownload &&
							!chartProperties.properties[propKey].isDynamicMeasureWindowOpened ? (
								<div className="graphAreaIcons">
									<MoreVertOutlined
										onClick={(e: any) => {
											setOpen(true);
											setAnchorEl(e.currentTarget);
										}}
									/>
								</div>
							) : null}
						</>
					)}
				</div>
			) : null}
			<div
				id="graphContainer"
				className="graphContainer"
				style={{
					margin: tileState.tiles[propKey]?.graphSizeFull ? "0" : "1rem",
				}}
			>
				{showSqlCode ? <ShowFormattedQuery /> : chartDisplayed()}
			</div>
			{/* <ChartThemes /> */}
			{fullScreen ? (
				<>
					<div
						tabIndex={0}
						id="graphFullScreen"
						className="graphFullScreen"
						style={{ zIndex: 3 }}
						onKeyDown={e => {
							removeFullScreen(e);
						}}
					>
						<div style={{ display: "flex" }}>
							<span
								className="graphTitle"
								style={{
									fontSize:
										chartProperties.properties[propKey].titleOptions.fontSize,
								}}
								onDoubleClick={() => editTitleText()}
							>
								{chartProperties.properties[propKey].titleOptions.chartTitle}
							</span>

							<CloseRounded
								style={{
									margin: "0.25rem",
									display: pageSettings.callForDownload ? "none" : "",
								}}
								onClick={() => setFullScreen(false)}
							/>
						</div>

						{chartDisplayed()}
					</div>
				</>
			) : null}
			<Popover
				open={open}
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
				onClose={() => setOpen(false)}
			>
				<Button
					sx={{ ...popoverButtonStyle }}
					value="Full Screen"
					onClick={() => {
						setFullScreen(true);
						setOpen(false);
					}}
				>
					<div className="screenSettingsMenuItems">
						<OpenInFullIcon sx={{ fontSize: "16px" }} />
						Show full screen
					</div>
				</Button>
				<Button
					sx={{ ...popoverButtonStyle }}
					style={
						tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.includes(propKey)
							? {}
							: { cursor: "not-allowed" }
					}
					value="Match Dashboard Size"
					onClick={() => {
						if (
							tabState.tabs[tabTileProps.selectedTabId].tilesInDashboard.includes(
								propKey
							)
						)
							toggleGraphSize(propKey, false);
						setOpen(false);
					}}
				>
					<div className="screenSettingsMenuItems">
						<FullscreenExitIcon sx={{ fontSize: "20px" }} />
						Match Dashboard Size
						<div
							style={{
								visibility: !tileState.tiles[propKey]?.graphSizeFull
									? "visible"
									: "hidden",
								marginLeft: "auto",
								marginRight: "0px",
							}}
						>
							<DoneIcon sx={{ fontSize: "16px" }} />
						</div>
					</div>
				</Button>
				<Button
					sx={{ ...popoverButtonStyle }}
					value="Fit Tile Size"
					onClick={() => {
						toggleGraphSize(propKey, true);
						setOpen(false);
					}}
				>
					<div className="screenSettingsMenuItems">
						<FullscreenIcon sx={{ fontSize: "20px" }} />
						Fit Tile Size
						<div
							style={{
								visibility: tileState.tiles[propKey]?.graphSizeFull
									? "visible"
									: "hidden",
								marginLeft: "auto",
								marginRight: "0px",
							}}
						>
							<DoneIcon sx={{ fontSize: "16px" }} />
						</div>
					</div>
				</Button>
				<hr
					style={{
						border: "1px solid rgba(224,224,224,1)",
						margin: "auto 5px",
						borderRadius: "5px",
					}}
				></hr>
				<Button
					sx={{ ...popoverButtonStyle }}
					value="View SQL"
					onClick={() => {
						getSqlQuery();
						setOpen(false);
					}}
				>
					<div className="screenSettingsMenuItems">
						<img src={sqlIcon} alt="" className="graphAreaViewSqlButtonStyle" />
						View sql
					</div>
				</Button>
				<Button
					sx={{ ...popoverButtonStyle }}
					value="pdf"
					onClick={() => {
						setPageSettings("downloadType", "pdf");
						setPageSettings("fullScreen", true);
						setOpen(false);
						setPageSettings("openPageSettingPopover", true);
					}}
				>
					<div className="screenSettingsMenuItems">
						<PictureAsPdfIcon sx={{ fontSize: "16px" }} />
						Download PDF
					</div>
				</Button>
				<Button
					sx={{ ...popoverButtonStyle }}
					value="image"
					onClick={() => {
						setPageSettings("downloadType", "image");
						setOpen(false);
						setPageSettings("fullScreen", true);
						setPageSettings("openPageSettingPopover", true);
					}}
				>
					<div className="screenSettingsMenuItems">
						<PhotoSizeSelectActualIcon sx={{ fontSize: "16px" }} />
						Download Image
					</div>
				</Button>
			</Popover>
			<DownloadPagePopover />
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
		chartGroup: state.chartFilterGroup,
		token: state.isLogged.accessToken,
		pageSettings: state.pageSettings,
		dynamicMeasureState: state.dynamicMeasuresState,
		dashBoardGroup: state.dashBoardFilterGroup,
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setChartTitle: (propKey: string, title: string) => dispatch(setChartTitle(propKey, title)),
		renameDynamicMeasure: (name: string) => dispatch(renameDynamicMeasure(name)),
		setGenerateTitleToStore: (propKey: string, option: any) =>
			dispatch(setGenerateTitle(propKey, option)),
		toggleGraphSize: (tileKey: string, graphSize: boolean | any) =>
			dispatch(toggleGraphSize(tileKey, graphSize)),
		updateQueryResult: (propKey: string, query: string | any) =>
			dispatch(updateQueryResult(propKey, query)),
		updateMargin: (propKey: string, option: string, value: any) =>
			dispatch(updateChartMargins(propKey, option, value)),
		setPageSettings: (option: string, value: any) => dispatch(setPageSettings(option, value)),
		resetPageSettings: () => dispatch(resetPageSettings()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphArea);
